import React from "react";
import { Cloud, Tag } from "lucide-react";
import { Icon } from "../Icon";
import { Application } from "../../types";

interface LocationsSectionProps {
  application: Application;
}

export const LocationsSection: React.FC<LocationsSectionProps> = ({
  application
}) => {
  if (!application.locations || application.locations.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="mb-4 flex items-center text-xl font-semibold">
        <Cloud className="mr-2 text-teal-600" size={20} />
        Locations
      </h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {(application.locations || []).map((location, index) => (
          <div
            key={index}
            className="relative max-w-md rounded-lg border border-gray-200 bg-gray-50 p-4"
          >
            <span className="absolute right-2 top-2 inline-flex items-center rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
              <Tag size={12} className="mr-1" />
              {location.purpose}
            </span>
            <div className="mt-2 flex items-center gap-2">
              <Icon
                name={location.provider.toLowerCase()}
                className="h-5 w-5 text-gray-500"
              />
              <div className="flex-grow">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{location.name}</span>
                  <span className="text-gray-500">({location.provider})</span>
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  <span className="mr-4">Region: {location.region}</span>
                  {location.id && <span>ID: {location.id}</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationsSection;
