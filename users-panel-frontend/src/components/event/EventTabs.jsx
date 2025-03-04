import React, { useState } from 'react';
import { Info, FileText, Users, CheckSquare, CheckCircle, MessageSquare } from 'lucide-react';
import OverviewTab from './tabs/OverviewTab';
import ResourcesTab from './tabs/ResourcesTab';
import TeamTab from './tabs/TeamTab';
import TasksTab from './tabs/TasksTab';
import AttendanceTab from './tabs/AttendanceTab';
import FeedbackTab from './tabs/FeedbackTab';

function EventTabs({ event, isRegistered }) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'resources', label: 'Resources', icon: FileText },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'attendance', label: 'Attendance', icon: CheckCircle },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab event={event} />;
      case 'resources':
        return <ResourcesTab event={event} />;
      case 'team':
        return <TeamTab event={event} isRegistered={isRegistered} />;
      case 'tasks':
        return <TasksTab event={event} isRegistered={isRegistered} />;
      case 'attendance':
        return <AttendanceTab event={event} isRegistered={isRegistered} />;
      case 'feedback':
        return <FeedbackTab event={event} isRegistered={isRegistered} />;
      default:
        return <OverviewTab event={event} />;
    }
  };

  return (
    <div>
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                ${activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <tab.icon className="w-5 h-5 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {renderTabContent()}
      </div>
    </div>
  );
}

export default EventTabs;