import React, { useState } from 'react';
import { Info, FileText, Users, CheckSquare, CheckCircle, MessageSquare,Clock, NotebookIcon } from 'lucide-react';
import OverviewTab from './tabs/OverviewTab';
import ResourcesTab from './tabs/ResourcesTab';
import TeamTab from './tabs/TeamTab';
import TasksTab from './tabs/TasksTab';
import AttendanceTab from './tabs/AttendanceTab';
import FeedbackTab from './tabs/FeedbackTab';
import TimelineTab from "./tabs/TimelineTab";
import CertificateTab from './tabs/CertificateTab'; 

function EventTabs({ event, isRegistered }) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: "overview", label: "Overview", icon: Info },
    { id: "timeline", label: "Timeline", icon: Clock },
    { id: "resources", label: "Resources", icon: FileText },
    { id: "team", label: "Team", icon: Users },
    { id: "tasks", label: "Tasks", icon: CheckSquare },
    { id: "attendance", label: "Attendance", icon: CheckCircle },
    { id: "certificate", label: "Certificate", icon: NotebookIcon },
    { id: "feedback", label: "Feedback", icon: MessageSquare },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab event={event} />;
      case 'timeline':
        return <TimelineTab event={event} />;
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
      case 'certificate':
        return <CertificateTab event={event._id} isRegistered={isRegistered} />;
      default:
        return <OverviewTab event={event} />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto px-2 py-2 scrollbar-hide">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  group inline-flex items-center py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${activeTab === tab.id 
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <tab.icon 
                  className={`w-5 h-5 mr-2 transition-colors
                    ${activeTab === tab.id 
                      ? 'text-indigo-500'
                      : 'text-gray-400 group-hover:text-gray-500'
                    }
                  `}
                />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventTabs;