import React from 'react';
import { Activity } from 'lucide-react';
import Section from '../Section';
import { Application } from '../../types';
import { Icon } from '../Icon';

interface MonitoringSectionProps {
  application: Application;
}

export const MonitoringSection: React.FC<MonitoringSectionProps> = ({ application }) => {
  return (
    <Section title="Monitoring" icon={Activity}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Alerts Configured</h4>
          <p className="text-2xl font-semibold text-teal-600">{application.monitoring.alertsConfigured}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Alerts Fired</h4>
          <p className="text-2xl font-semibold text-teal-600">{application.monitoring.alertsFired}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Uptime</h4>
          <p className="text-2xl font-semibold text-teal-600">{application.monitoring.uptime}%</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Apdex Score</h4>
          <p className="text-2xl font-semibold text-teal-600">{application.monitoring.apdex}</p>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-lg font-medium mb-4">Monitoring Tools</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {application.monitoring.tools.map((tool, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Icon name={tool.name.toLowerCase().replace(/\s+/g, '-')} className="h-5 w-5 text-gray-500" />
                <h5 className="font-medium">{tool.name}</h5>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">{tool.purpose}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full capitalize">
                    {tool.type}
                  </span>
                  <a 
                    href={tool.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-teal-600 hover:text-teal-700"
                  >
                    View Dashboard
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};