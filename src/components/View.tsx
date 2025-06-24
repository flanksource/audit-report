import React from "react";
import { LucideIcon } from "lucide-react";
import DynamicDataTable from "./DynamicDataTable";
import { ViewResult } from "../types";
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
  console.log(rows);
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

const View: React.FC<ViewProps> = ({ title, icon: Icon, view }) => {
  const pieChartSummaries =
    view.summaries?.filter((summary) => summary.type === "piechart") || [];
  const numberSummaries =
    view.summaries?.filter((summary) => summary.type === "number") || [];

  return (
    <div>
      <h3 className="mb-4 flex items-center text-xl font-semibold">
        <Icon className="mr-2 text-teal-600" size={20} />
        {title}
      </h3>
      <div className="space-y-6">
        {numberSummaries.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
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
          </div>
        )}

        {pieChartSummaries.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
