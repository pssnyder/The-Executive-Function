
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Task, TaskContextType, TaskStatus, TaskPriority, ParsedTaskData } from '../types';
import { useAuth } from './AuthContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { parseNaturalLanguageTask as parseTaskWithAIGemini } from '../services/geminiService';
import { DEFAULT_TASK_PRIORITY, DEFAULT_TASK_STATUS } from '../constants';

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    if (!currentUser) return;
    setIsLoading(true);
    // Simulate API call, in reality, this would filter by currentUser.id from backend
    // For localStorage, we filter client-side after loading all tasks or store them user-specifically
    const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]') as Task[];
    setTasks(allTasks.filter(task => task.userId === currentUser.id));
    setIsLoading(false);
  }, [currentUser, setTasks]);
  

  const addTask = async (taskData: Omit<Task, 'id' | 'userId' | 'creationDate' | 'status'>, naturalLanguageInput: string) => {
    if (!currentUser) throw new Error("User not authenticated");
    setIsLoading(true);
    
    let aiParsedData: ParsedTaskData | null = null;
    if (naturalLanguageInput) { // If there's natural language input, try to parse with AI
        aiParsedData = await parseTaskWithAIGemini(naturalLanguageInput);
    }

    const newTask: Task = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: currentUser.id,
      title: aiParsedData?.title || taskData.title || "Untitled Task",
      description: aiParsedData?.description || taskData.description,
      status: DEFAULT_TASK_STATUS as TaskStatus, // Corrected: Initialize status to default
      priority: (aiParsedData?.priority as TaskPriority) || (taskData.priority as TaskPriority) || TaskPriority.MEDIUM,
      dueDate: aiParsedData?.dueDate || taskData.dueDate,
      creationDate: new Date().toISOString(),
      category: aiParsedData?.category || taskData.category || "General",
    };

    setTasks(prevTasks => [...prevTasks, newTask]);
    setIsLoading(false);
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    setIsLoading(true);
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    setIsLoading(false);
  };

  const deleteTask = async (taskId: string) => {
    setIsLoading(true);
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    setIsLoading(false);
  };

  const parseTaskWithAI = async (naturalLanguageInput: string): Promise<ParsedTaskData | null> => {
    setIsLoading(true);
    try {
      const result = await parseTaskWithAIGemini(naturalLanguageInput);
      return result;
    } catch (error) {
      console.error("Error in TaskContext calling parseTaskWithAIGemini:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <TaskContext.Provider value={{ tasks, isLoading, fetchTasks, addTask, updateTask, deleteTask, parseTaskWithAI }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
