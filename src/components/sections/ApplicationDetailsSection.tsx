import React from "react";
import { Info, Shield, AlertTriangle, Globe, Box } from "lucide-react";
import Section from "../Section";
import { Application } from "../../types";

interface ApplicationDetailsSectionProps {
  application: Application;
}

const ApplicationDetailsSection: React.FC<ApplicationDetailsSectionProps> = ({
  application
}) => {
  return (
    <Section title="Application Details" icon={Info}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-4">
          <div>
            <div className="mb-2 flex items-center text-sm text-gray-500">
              <Shield className="mr-1.5 text-gray-400" size={16} />
              Classification
            </div>
            <p className="text-sm">{application.dataClassication}</p>
          </div>
          <div>
            <div className="mb-2 flex items-center text-sm text-gray-500">
              <AlertTriangle className="mr-1.5 text-gray-400" size={16} />
              Criticality
            </div>
            <p className="text-sm">{application.criticality}</p>
          </div>
          <div>
            <div className="mb-2 flex items-center text-sm text-gray-500">
              <Globe className="mr-1.5 text-gray-400" size={16} />
              Usage
            </div>
            <p className="text-sm">{application.use}</p>
          </div>
          <div>
            <div className="mb-2 flex items-center text-sm text-gray-500">
              <Box className="mr-1.5 text-gray-400" size={16} />
              Source
            </div>
            <p className="text-sm">{application.source}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <div className="mb-2 flex items-center text-sm text-gray-500">
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
