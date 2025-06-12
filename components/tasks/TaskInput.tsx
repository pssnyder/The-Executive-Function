
import React, { useState, FormEvent } from 'react';
import { useTasks } from '../../contexts/TaskContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { ParsedTaskData, TaskPriority, TaskStatus } from '../../types';
import { Card } from '../ui/Card';
import { DEFAULT_TASK_PRIORITY, DEFAULT_TASK_STATUS } from '../../constants';

const TaskInput: React.FC = () => {
  const [naturalLanguageInput, setNaturalLanguageInput] = useState('');
  const { addTask, isLoading: isTaskContextLoading, parseTaskWithAI } = useTasks();
  const [parsedData, setParsedData] = useState<ParsedTaskData | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleParse = async () => {
    if (!naturalLanguageInput.trim()) {
      setError("Please enter a task description.");
      return;
    }
    setError(null);
    setIsParsing(true);
    setParsedData(null);
    try {
      const result = await parseTaskWithAI(naturalLanguageInput);
      if (result) {
        setParsedData(result);
      } else {
        setError("Could not parse task with AI. Please try rephrasing or adding manually.");
      }
    } catch (err) {
      console.error("Parsing error:", err);
      setError("An error occurred while parsing the task.");
    } finally {
      setIsParsing(false);
    }
  };
  
  const handleAddTask = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!parsedData && !naturalLanguageInput.trim()) {
        setError("No task data to add. Please enter or parse a task.");
        return;
    }
    setError(null);

    const taskToAdd = {
        title: parsedData?.title || naturalLanguageInput, // Fallback to raw input if no title parsed
        description: parsedData?.description,
        priority: (parsedData?.priority as TaskPriority) || (DEFAULT_TASK_PRIORITY as TaskPriority),
        dueDate: parsedData?.dueDate,
        category: parsedData?.category,
        status: DEFAULT_TASK_STATUS as TaskStatus, // Default status
    };

    try {
        // Pass original natural language input to addTask if you want it logged or used further
        await addTask(taskToAdd, naturalLanguageInput);
        setNaturalLanguageInput('');
        setParsedData(null);
    } catch (err: any) {
        setError(err.message || "Failed to add task.");
    }
  };

  const handleManualInputChange = <K extends keyof ParsedTaskData,>(field: K, value: ParsedTaskData[K]) => {
    setParsedData(prev => ({ ...(prev || {}), [field]: value } as ParsedTaskData));
  };


  return (
    <Card className="mb-8" title="Add New Task with AI">
      <form onSubmit={handleAddTask} className="space-y-4">
        <Input
          id="naturalLanguageInput"
          placeholder='e.g., "Schedule Q3 planning meeting for next Friday morning, high priority, category Work"'
          value={naturalLanguageInput}
          onChange={(e) => {
            setNaturalLanguageInput(e.target.value);
            if (parsedData) setParsedData(null); // Clear parsed data if input changes
            if (error) setError(null);
          }}
          disabled={isParsing || isTaskContextLoading}
          aria-label="Enter task using natural language"
        />
        <div className="flex space-x-2">
            <Button type="button" onClick={handleParse} isLoading={isParsing} disabled={isTaskContextLoading || !naturalLanguageInput.trim()} className="flex-grow">
                {isParsing ? 'Parsing...' : 'Parse with AI'}
            </Button>
            {parsedData && (
                 <Button type="submit" isLoading={isTaskContextLoading} disabled={isParsing} className="flex-grow bg-green-500 hover:bg-green-600">
                    Add Task
                </Button>
            )}
        </div>
        
        {error && <p className="text-sm text-red-500">{error}</p>}
      </form>

      {parsedData && (
        <div className="mt-6 p-4 border border-slate-300 rounded-md bg-slate-50 space-y-3">
          <h4 className="text-md font-semibold text-slate-700">AI Suggested Details:</h4>
          <div>
            <label className="text-sm font-medium text-slate-600 block">Title:</label>
            <Input type="text" value={parsedData.title || ''} onChange={(e) => handleManualInputChange('title', e.target.value)} className="text-sm"/>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600 block">Description:</label>
            <textarea value={parsedData.description || ''} onChange={(e) => handleManualInputChange('description', e.target.value)} className="w-full p-2 border border-slate-300 rounded-md text-sm min-h-[60px]"/>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
                <label className="text-sm font-medium text-slate-600 block">Priority:</label>
                <select value={parsedData.priority || DEFAULT_TASK_PRIORITY} onChange={(e) => handleManualInputChange('priority', e.target.value as TaskPriority)} className="w-full p-2 border border-slate-300 rounded-md text-sm">
                    {Object.values(TaskPriority).map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                </select>
            </div>
            <div>
                <label className="text-sm font-medium text-slate-600 block">Due Date:</label>
                <Input type="date" value={parsedData.dueDate || ''} onChange={(e) => handleManualInputChange('dueDate', e.target.value)} className="text-sm"/>
            </div>
             <div>
                <label className="text-sm font-medium text-slate-600 block">Category:</label>
                <Input type="text" value={parsedData.category || ''} onChange={(e) => handleManualInputChange('category', e.target.value)} className="text-sm"/>
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-2">
            <Button type="button" variant="ghost" onClick={() => setParsedData(null)}>Clear AI Suggestion</Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default TaskInput;

