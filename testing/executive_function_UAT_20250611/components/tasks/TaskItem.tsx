
import React, { useState } from 'react';
import { Task, TaskStatus, TaskPriority } from '../../types';
import { useTasks } from '../../contexts/TaskContext';
import { PRIORITY_COLORS, STATUS_OPTIONS, PRIORITY_OPTIONS } from '../../constants';
import { IconButton } from '../ui/IconButton';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button'; // For potential edit save/cancel
import { Input } from '../ui/Input'; // For inline editing


const EditIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
);

const DeleteIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c1.153 0 2.243.032 3.287.094M5.114 5.79l-.012.002C4.943 6.094 4.808 6.453 4.77 6.852M7.5 10.5h.008v.008H7.5V10.5zm2.25 0h.008v.008H9.75V10.5zm2.25 0h.008v.008H12V10.5zM15 10.5h.008v.008H15V10.5z" />
  </svg>
);


interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { updateTask, deleteTask, isLoading } = useTasks();
  const [isEditing, setIsEditing] = useState(false);
  const [editableTask, setEditableTask] = useState<Task>(task);

  const priorityStyle = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium;

  const handleStatusChange = (newStatus: TaskStatus) => {
    updateTask(task.id, { status: newStatus });
  };
  
  const handlePriorityChange = (newPriority: TaskPriority) => {
     if(isEditing) {
        setEditableTask(prev => ({...prev, priority: newPriority}));
     } else {
        updateTask(task.id, { priority: newPriority });
     }
  };

  const handleEditToggle = () => {
    if (isEditing) { // Was editing, now save
        updateTask(task.id, editableTask);
    }
    setIsEditing(!isEditing);
    setEditableTask(task); // Reset or set to current task for editing
  };

  const handleInputChange = <K extends keyof Task,>(field: K, value: Task[K]) => {
    setEditableTask(prev => ({...prev, [field]: value}));
  };


  return (
    <div className={`p-4 mb-3 bg-white rounded-lg shadow-sm border-l-4 ${priorityStyle.border} hover:shadow-md transition-shadow`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="flex-grow mb-2 sm:mb-0">
          {isEditing ? (
             <Input 
                type="text" 
                value={editableTask.title} 
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="text-lg font-semibold text-slate-800 p-1 border rounded"
             />
          ) : (
             <h3 className="text-lg font-semibold text-slate-800">{task.title}</h3>
          )}
          {isEditing ? (
            <textarea 
                value={editableTask.description || ''} 
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="text-sm text-slate-600 mt-1 p-1 border rounded w-full min-h-[50px]"
                placeholder="Task description"
            />
          ) : (
            task.description && <p className="text-sm text-slate-600 mt-1">{task.description}</p>
          )}
        </div>
        <div className="flex items-center space-x-2 sm:ml-4 flex-shrink-0">
          <IconButton 
            icon={<EditIcon />} 
            onClick={handleEditToggle} 
            tooltip={isEditing ? "Save Changes" : "Edit Task"} 
            className={isEditing ? "text-green-600 hover:bg-green-100" : ""}
            disabled={isLoading}
          />
          <IconButton icon={<DeleteIcon />} onClick={() => deleteTask(task.id)} tooltip="Delete Task" className="text-red-500 hover:bg-red-100" disabled={isLoading} />
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
        <div>
          <span className="font-medium text-slate-500 block mb-1">Status:</span>
           <Select
            value={isEditing ? editableTask.status : task.status}
            onChange={(e) => isEditing ? handleInputChange('status', e.target.value as TaskStatus) : handleStatusChange(e.target.value as TaskStatus)}
            className={`capitalize ${isEditing ? 'border-blue-300' : ''}`}
            disabled={isLoading && !isEditing}
          >
            {STATUS_OPTIONS.map(opt => <option key={opt} value={opt} className="capitalize">{opt}</option>)}
          </Select>
        </div>
        <div>
          <span className="font-medium text-slate-500 block mb-1">Priority:</span>
          <Select
            value={isEditing ? editableTask.priority : task.priority}
            onChange={(e) => handlePriorityChange(e.target.value as TaskPriority)}
            className={`capitalize ${priorityStyle.text} ${isEditing ? 'border-blue-300' : ''}`}
            disabled={isLoading && !isEditing}
          >
             {PRIORITY_OPTIONS.map(opt => <option key={opt} value={opt} className="capitalize">{opt}</option>)}
          </Select>
        </div>
         <div>
          <span className="font-medium text-slate-500 block mb-1">Due Date:</span>
          {isEditing ? (
            <Input 
                type="date" 
                value={editableTask.dueDate ? new Date(editableTask.dueDate).toISOString().split('T')[0] : ''} 
                onChange={(e) => handleInputChange('dueDate', e.target.value ? new Date(e.target.value).toISOString() : null)}
                className="p-1 border rounded"
            />
          ) : (
            <span className="text-slate-700">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}</span>
          )}
        </div>
        <div>
          <span className="font-medium text-slate-500 block mb-1">Category:</span>
           {isEditing ? (
            <Input 
                type="text" 
                value={editableTask.category || ''} 
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="p-1 border rounded"
                placeholder="e.g., Work"
            />
          ) : (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600`}>
                {task.category || 'General'}
            </span>
          )}
        </div>
      </div>
       {isEditing && (
        <div className="mt-4 flex justify-end space-x-2">
            <Button variant="secondary" size="sm" onClick={() => { setIsEditing(false); setEditableTask(task); }}>Cancel</Button>
            <Button size="sm" onClick={handleEditToggle} isLoading={isLoading}>Save Changes</Button>
        </div>
      )}
    </div>
  );
};

export default TaskItem;
