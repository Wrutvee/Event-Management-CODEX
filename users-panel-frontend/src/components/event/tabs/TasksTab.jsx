import React, { useState } from 'react';
import { CheckSquare, Clock, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

function TasksTab({ event, isRegistered }) {
  const [tasks, setTasks] = useState(event.tasks || []);

  if (!isRegistered) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <CheckSquare className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Registration Required</h3>
        <p className="text-gray-500">
          Please register for the event to view and manage tasks.
        </p>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <CheckSquare className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Tasks</h3>
        <p className="text-gray-500">
          There are no tasks assigned for this event yet.
        </p>
      </div>
    );
  }

  const handleStatusChange = async (taskId, newStatus) => {
    // In a real app, this would make an API call
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Tasks</h3>
      <div className="space-y-4">
        {tasks.map(task => (
          <div
            key={task.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${
                task.status === 'completed' 
                  ? 'bg-green-50' 
                  : task.status === 'pending' 
                    ? 'bg-yellow-50' 
                    : 'bg-red-50'
              }`}>
                {task.status === 'completed' ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : task.status === 'pending' ? (
                  <Clock className="w-5 h-5 text-yellow-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
                <p className="text-xs text-gray-500">
                  Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
            
            {task.status !== 'completed' && (
              <button
                onClick={() => handleStatusChange(task.id, 'completed')}
                className="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
              >
                Mark Complete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TasksTab;