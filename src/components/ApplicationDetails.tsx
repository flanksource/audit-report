import React from "react";
import { Application } from "../types";
import { Info, Shield, AlertTriangle, Globe, Box } from "lucide-react";

interface ApplicationDetailsProps {
  application: Application;
}

const ApplicationDetails: React.FC<ApplicationDetailsProps> = ({
  application
}) => {
  return (
    <>
      <div>
        <h3 className="mb-4 flex items-center text-xl font-semibold">
          <Info className="mr-2 text-teal-600" size={20} />
          Application Details
        </h3>
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
      </div>

      <hr className="border-gray-200" />

      <hr className="border-gray-200" />
    </>
  );
};

export default ApplicationDetails;
