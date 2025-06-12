
import React, { useEffect, useState, useMemo } from 'react';
import { useTasks } from '../../contexts/TaskContext';
import TaskItem from './TaskItem';
import { Task, TaskStatus, TaskPriority } from '../../types';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from '../../constants';

const TaskList: React.FC = () => {
  const { tasks, isLoading, fetchTasks } = useTasks();
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'creationDate'>('creationDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Fetch tasks on mount

  const filteredAndSortedTasks = useMemo(() => {
    let processedTasks = [...tasks];

    // Filter by status
    if (filterStatus !== 'all') {
      processedTasks = processedTasks.filter(task => task.status === filterStatus);
    }

    // Filter by priority
    if (filterPriority !== 'all') {
      processedTasks = processedTasks.filter(task => task.priority === filterPriority);
    }
    
    // Filter by search term (title and description)
    if (searchTerm) {
      processedTasks = processedTasks.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sort
    processedTasks.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'dueDate') {
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : (sortOrder === 'asc' ? Infinity : -Infinity);
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : (sortOrder === 'asc' ? Infinity : -Infinity);
        comparison = dateA - dateB;
      } else if (sortBy === 'priority') {
        const priorityOrder: Record<TaskPriority, number> = { [TaskPriority.URGENT]: 4, [TaskPriority.HIGH]: 3, [TaskPriority.MEDIUM]: 2, [TaskPriority.LOW]: 1 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
      } else { // creationDate
        comparison = new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime();
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return processedTasks;
  }, [tasks, filterStatus, filterPriority, searchTerm, sortBy, sortOrder]);


  if (isLoading && tasks.length === 0) {
    return <LoadingSpinner className="mt-8" />;
  }

  return (
    <div>
      <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-slate-700 mb-3">Filter & Sort Tasks</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Input 
            type="text" 
            placeholder="Search tasks..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            label="Search"
          />
          <Select label="Status" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as TaskStatus | 'all')}>
            <option value="all">All Statuses</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
          </Select>
          <Select label="Priority" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value as TaskPriority | 'all')}>
            <option value="all">All Priorities</option>
            {PRIORITY_OPTIONS.map(p => <option key={p} value={p} className="capitalize">{p}</option>)}
          </Select>
          <Select label="Sort By" value={sortBy} onChange={(e) => setSortBy(e.target.value as 'dueDate' | 'priority' | 'creationDate')}>
            <option value="creationDate">Creation Date</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </Select>
           <Select label="Order" value={sortOrder} onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}>
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </Select>
        </div>
      </div>

      {isLoading && <LoadingSpinner className="my-4" size="sm"/>}
      
      {filteredAndSortedTasks.length === 0 && !isLoading ? (
        <p className="text-center text-slate-500 py-8">No tasks match your criteria, or you haven't added any tasks yet.</p>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedTasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
