import React from "react";
import CalendarHeatmap, {
  ReactCalendarHeatmapValue
} from "react-calendar-heatmap";
import { Backup } from "../types";

import "./heatmap.css";

interface BackupCalendarHeatmapProps {
  backups: Backup[];
  className?: string;
}

interface HeatmapValue {
  date: string;
  successful: number;
  failed: number;
}

export const BackupCalendarHeatmap: React.FC<BackupCalendarHeatmapProps> = ({
  backups,
  className = ""
}) => {
  // Process backup data for heatmap
  const processBackupData = (): HeatmapValue[] => {
    const backupMap = new Map<string, HeatmapValue>();

    backups.forEach((backup) => {
      const date = backup.date.split("T")[0]; // Get date part only

      if (!backupMap.has(date)) {
        backupMap.set(date, {
          date,
          successful: 0,
          failed: 0
        });
      }

      const entry = backupMap.get(date)!;
      if (["Successful", "Completed"].includes(backup.status)) {
        entry.successful += 1;
      } else {
        entry.failed += 1;
      }
    });

    return Array.from(backupMap.values());
  };

  const heatmapData = processBackupData();

  // Calculate date range (last 365 days)
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear() - 1);

  const getClassForValue = (
    value: ReactCalendarHeatmapValue<string> | undefined
  ) => {
    if (!value || value.count === 0) {
      return "fill-gray-100";
    }

    // Color based on success rate and frequency
    const successRate = value.successful / (value.successful + value.failed);

    if (successRate === 1) {
      return "fill-green-200";
    } else if (successRate >= 0.5) {
      return "fill-orange-200";
    } else {
      return "fill-red-200";
    }
  };

  return (
    <div className={`backup-heatmap ${className}`}>
      <div className="mb-4">
        <h4 className="mb-2 text-lg font-semibold text-gray-700">
          Backup Activity Calendar
        </h4>
        <div className="mb-2 flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-sm bg-green-200"></div>
            <span>All successful</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-sm bg-orange-200"></div>
            <span>Mostly successful</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-sm bg-red-200"></div>
            <span>Mostly failed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-sm border bg-gray-100"></div>
            <span>No backups</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          gutterSize={3}
          values={heatmapData}
          classForValue={getClassForValue}
        />
      </div>
    </div>
  );
};
