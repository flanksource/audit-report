import React from 'react';
import { Info, Shield, AlertTriangle, Globe, Box, GitBranch } from 'lucide-react';
import Section from '../Section';
import { Icon } from '../Icon';
import { Application } from '../../types';

interface ApplicationDetailsSectionProps {
  application: Application;
}

const ApplicationDetailsSection: React.FC<ApplicationDetailsSectionProps> = ({ application }) => {
  return (
    <Section title="Application Details" icon={Info}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div>
            <div className="text-sm text-gray-500 flex items-center mb-2">
              <Shield className="mr-1.5 text-gray-400" size={16} />
              Classification
            </div>
            <p className="text-sm">{application.dataClassication}</p>
          </div>
          <div>
            <div className="text-sm text-gray-500 flex items-center mb-2">
              <AlertTriangle className="mr-1.5 text-gray-400" size={16} />
              Criticality
            </div>
            <p className="text-sm">{application.criticality}</p>
          </div>
          <div>
            <div className="text-sm text-gray-500 flex items-center mb-2">
              <Globe className="mr-1.5 text-gray-400" size={16} />
              Usage
            </div>
            <p className="text-sm">{application.use}</p>
          </div>
          <div>
            <div className="text-sm text-gray-500 flex items-center mb-2">
              <Box className="mr-1.5 text-gray-400" size={16} />
              Source
            </div>
            <p className="text-sm">{application.source}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <div className="text-sm text-gray-500 flex items-center mb-2">
              <Info className="mr-1.5 text-gray-400" size={16} />
              Description
            </div>
            <p className="text-sm">{application.description}</p>
          </div>
        </div>
        
      </div>
    </Section>
  );
};

export default ApplicationDetailsSection;