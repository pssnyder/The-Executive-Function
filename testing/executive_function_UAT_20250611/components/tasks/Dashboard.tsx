
import React from 'react';
import TaskInput from './TaskInput';
import TaskList from './TaskList';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div className="space-y-8">
      <div className="text-left">
        <h2 className="text-3xl font-bold text-slate-800">Hello, {currentUser?.email}!</h2>
        <p className="text-slate-600 mt-1">Let's get your tasks organized.</p>
      </div>
      <TaskInput />
      <TaskList />
    </div>
  );
};

export default Dashboard;
