import React from "react";
import { LucideIcon } from "lucide-react";
import DynamicDataTable from "../DynamicDataTable";
import { ViewResult } from "../../types";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";

interface ViewProps {
  title: string;
  icon: LucideIcon;
  view: ViewResult;
}

const COLOR_BANK = [
  "#3b82f6", // blue-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#ef4444", // red-500
  "#8b5cf6", // purple-500
  "#06b6d4", // cyan-500
  "#84cc16", // lime-500
  "#f97316", // orange-500
  "#ec4899", // pink-500
  "#6366f1", // indigo-500
  "#14b8a6", // teal-500
  "#f43f5e", // rose-500
  "#a855f7", // violet-500
  "#22c55e", // green-500
  "#eab308", // yellow-500
  "#64748b", // slate-500
  "#78716c", // stone-500
  "#dc2626", // red-600
  "#2563eb", // blue-600
  "#059669" // emerald-600
];

const shuffleArray = (array: string[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const generatePieChartData = (rows: Record<string, any>[]) => {
  return rows.map((row) => {
    const { count, ...rest } = row;
    const labelKey = Object.keys(rest)[0];
    const labelValue = rest[labelKey];

    return {
      name: labelValue,
      value: count
    };
  });
};

const renderLegend = (props: any) => {
  const { payload } = props;

  return (
    <ul className="mt-1 flex flex-wrap justify-center gap-1 text-xs text-gray-600">
      {payload.map((entry: any, index: number) => (
        <li key={`item-${index}`} className="flex items-center">
          <span
            className="mr-1 h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span>{entry.value}</span>
        </li>
      ))}
    </ul>
  );
};

const getGaugeColor = (
  value: number,
  thresholds: Array<{ value: number; color: string }>
) => {
  // Sort thresholds by value in ascending order
  const sortedThresholds = [...thresholds].sort((a, b) => a.value - b.value);

  // Find the appropriate range and return its color
  for (let i = 0; i < sortedThresholds.length; i++) {
    const currentThreshold = sortedThresholds[i];
    const nextThreshold = sortedThresholds[i + 1];

    // If this is the last threshold or value is less than next threshold
    if (!nextThreshold || value < nextThreshold.value) {
      // Value falls in this range if it's >= current threshold
      if (value >= currentThreshold.value) {
        return currentThreshold.color;
      }
    }
  }

  // Default to the first threshold color if value is below all thresholds
  return sortedThresholds[0]?.color || "#10b981";
};

const generateGaugeData = (
  row: Record<string, any>,
  gauge: {
    min: number;
    max: number;
    thresholds?: Array<{ value: number; color: string }>;
  }
) => {
  const value = row.value || 0;
  const percentage = ((value - gauge.min) / (gauge.max - gauge.min)) * 100;
  const clampedPercentage = Math.max(0, Math.min(100, percentage));

  const color = gauge.thresholds
    ? getGaugeColor(value, gauge.thresholds)
    : "#10b981";

  return {
    value: clampedPercentage,
    originalValue: value,
    color: color,
    max: gauge.max,
    min: gauge.min,
    label: row.health || row.type || "Value"
  };
};

const View: React.FC<ViewProps> = ({ title, icon: Icon, view }) => {
  const pieChartSummaries =
    view.summaries?.filter((summary) => summary.type === "piechart") || [];
  const numberSummaries =
    view.summaries?.filter((summary) => summary.type === "number") || [];
  const breakdownSummaries =
    view.summaries?.filter((summary) => summary.type === "breakdown") || [];
  const gaugeSummaries =
    view.summaries?.filter((summary) => summary.type === "gauge") || [];

  return (
    <div>
      <h3 className="mb-4 flex items-center text-xl font-semibold">
        <Icon className="mr-2 text-teal-600" size={20} />
        {title}
      </h3>
      <div className="space-y-6">
        {(numberSummaries.length > 0 ||
          breakdownSummaries.length > 0 ||
          pieChartSummaries.length > 0 ||
          gaugeSummaries.length > 0) && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {numberSummaries.flatMap((summary) =>
              summary.rows.map((row, rowIndex) => {
                const { value, ...rest } = row;
                const labelKey = Object.keys(rest)[0];
                const labelValue = rest[labelKey];

                return (
                  <div
                    key={`${summary.name}-${rowIndex}`}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                  >
                    <h4 className="mb-2 text-sm font-medium capitalize text-gray-600">
                      {labelValue}
                    </h4>
                    {summary.description && (
                      <p className="mb-3 text-xs text-gray-500">
                        {summary.description}
                      </p>
                    )}
                    <p className="text-2xl font-semibold text-teal-600">
                      {value}
                    </p>
                  </div>
                );
              })
            )}

            {breakdownSummaries.map((summary, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 bg-gray-50 p-4"
              >
                <h4 className="mb-2 text-sm font-medium text-gray-600">
                  {summary.name}
                </h4>
                <div className="space-y-2">
                  {summary.rows.map((row, rowIndex) => {
                    const { value, ...rest } = row;
                    const labelKey = Object.keys(rest)[0];
                    const labelValue = rest[labelKey];

                    return (
                      <div
                        key={rowIndex}
                        className="flex items-center justify-between"
                      >
                        <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium">
                          {labelValue}
                        </span>
                        <span className="text-sm font-medium">{value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {pieChartSummaries.map((summary, index) => {
              const chartData = generatePieChartData(summary.rows);
              const shuffledColors = shuffleArray(COLOR_BANK);

              return (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                >
                  <h4 className="mb-2 text-sm font-medium text-gray-600">
                    {summary.name}
                  </h4>
                  {summary.description && (
                    <p className="mb-3 text-xs text-gray-500">
                      {summary.description}
                    </p>
                  )}
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          dataKey="value"
                          nameKey="name"
                          label={{ fontSize: 10, fill: "#374151" }}
                        >
                          {chartData.map((_, entryIndex) => (
                            <Cell
                              key={`cell-${entryIndex}`}
                              fill={
                                shuffledColors[
                                  entryIndex % shuffledColors.length
                                ]
                              }
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend content={renderLegend} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              );
            })}

            {gaugeSummaries.flatMap((summary, summaryIndex) =>
              summary.rows
                .map((row, rowIndex) => {
                  if (!summary.gauge) return null;

                  const gaugeData = generateGaugeData(row, summary.gauge);
                  const outerArcLength = 204; // π * 65 for outer threshold arc

                  return (
                    <div
                      key={`${summaryIndex}-${rowIndex}`}
                      className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                    >
                      <h4 className="mb-1 text-sm font-medium text-gray-600">
                        {summary.name}
                      </h4>
                      {summary.description && (
                        <p className="mb-3 text-xs text-gray-500">
                          {summary.description}
                        </p>
                      )}
                      <div className="relative flex h-32 items-center justify-center">
                        <svg
                          width="160"
                          height="100"
                          viewBox="0 0 160 80"
                          className="overflow-visible"
                        >
                          {/* Outer arc background */}
                          <path
                            d="M 15 70 A 65 65 0 0 1 145 70"
                            stroke="#374151"
                            strokeWidth="8"
                            fill="none"
                            opacity="0.1"
                          />

                          {/* Outer arc - Threshold segments */}
                          {summary.gauge &&
                            summary.gauge.thresholds &&
                            summary.gauge.thresholds.map(
                              (_, thresholdIndex) => {
                                const sortedThresholds = [
                                  ...summary.gauge!.thresholds!
                                ].sort((a, b) => a.value - b.value);
                                const currentThreshold =
                                  sortedThresholds[thresholdIndex];
                                const nextThreshold =
                                  sortedThresholds[thresholdIndex + 1];

                                const startPercentage =
                                  ((currentThreshold.value - gaugeData.min) /
                                    (gaugeData.max - gaugeData.min)) *
                                  100;
                                const endPercentage = nextThreshold
                                  ? ((nextThreshold.value - gaugeData.min) /
                                      (gaugeData.max - gaugeData.min)) *
                                    100
                                  : 100;

                                const startLength =
                                  (startPercentage / 100) * outerArcLength;
                                const segmentLength =
                                  ((endPercentage - startPercentage) / 100) *
                                  outerArcLength;

                                return (
                                  <path
                                    key={thresholdIndex}
                                    d="M 15 70 A 65 65 0 0 1 145 70"
                                    stroke={currentThreshold.color}
                                    strokeWidth="8"
                                    fill="none"
                                    strokeDasharray={`${segmentLength} ${outerArcLength}`}
                                    strokeDashoffset={-startLength}
                                    opacity="0.4"
                                  />
                                );
                              }
                            )}

                          {/* Inner arc background */}
                          <path
                            d="M 25 70 A 55 55 0 0 1 135 70"
                            stroke="#374151"
                            strokeWidth="16"
                            fill="none"
                            opacity="0.05"
                          />

                          {/* Inner arc - Current value (twice as thick) */}
                          <path
                            d="M 25 70 A 55 55 0 0 1 135 70"
                            stroke={gaugeData.color}
                            strokeWidth="16"
                            fill="none"
                            strokeDasharray={`${(gaugeData.value / 100) * 173} 173`}
                            className="transition-all duration-700 ease-out"
                            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center pt-4">
                          <div
                            className="text-3xl font-bold"
                            style={{ color: gaugeData.color }}
                          >
                            {gaugeData.originalValue}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
                .filter(Boolean)
            )}
          </div>
        )}

        {view.rows && view.columns && (
          <DynamicDataTable columns={view.columns} rows={view.rows} />
        )}
      </div>
    </div>
  );
};

export default View;
