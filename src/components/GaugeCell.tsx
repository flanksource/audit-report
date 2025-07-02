import React from "react";
import { GaugeConfig } from "../types";
import { generateGaugeData } from "./View/panels/utils";

interface GaugeCellProps {
  value: number;
  gauge: GaugeConfig;
}

const GaugeCell: React.FC<GaugeCellProps> = ({ value, gauge }) => {
  const gaugeData = generateGaugeData({ value }, gauge);
  const percentage = gaugeData.value;
  const color = gaugeData.color;

  return (
    <div className="flex items-center gap-2">
      <div className="flex w-20 items-center gap-2">
        {/* Progress bar */}
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${percentage}%`,
              backgroundColor: color
            }}
          />
        </div>
        {/* Value text */}
        <span className="min-w-fit text-xs font-medium text-gray-700">
          {value}
        </span>
      </div>
    </div>
  );
};

export default GaugeCell;
