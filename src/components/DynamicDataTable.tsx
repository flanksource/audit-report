import React from "react";
import { ViewColumnDef } from "../types";
import { formatDate } from "../utils";
import DataTable from "./DataTable";
import { formatDuration, intervalToDuration } from "date-fns";

interface DynamicDataTableProps {
  columns: ViewColumnDef[];
  rows: any[][];
  title?: string;
}

const DynamicDataTable: React.FC<DynamicDataTableProps> = ({
  columns,
  rows,
  title
}) => {
  // Convert ViewColumnDef[] to DataTable Column format
  const adaptedColumns = columns.map((col, index) => ({
    header: col.name,
    accessor: `col_${index}`,
    render: (value: any) => renderCellValue(value, col)
  }));

  // Convert rows array to object format expected by DataTable
  const adaptedData = rows.map((row) => {
    const rowObj: { [key: string]: any } = {};
    row.forEach((value, index) => {
      rowObj[`col_${index}`] = value;
    });
    return rowObj;
  });

  const renderCellValue = (value: any, column: ViewColumnDef) => {
    if (value == null) return "-";

    switch (column.type) {
      case "datetime":
        if (typeof value === "string" && /\d{4}-\d{2}-\d{2}/.test(value)) {
          return formatDate(value);
        }
        return String(value);
      case "boolean":
        return value ? "Yes" : "No";
      case "number":
        return typeof value === "number"
          ? value.toLocaleString()
          : String(value);
      case "duration": {
        if (typeof value !== "number") {
          return String(value);
        }
        // value is in nanoseconds, intervalToDuration expects milliseconds.
        const duration = intervalToDuration({
          start: 0,
          end: value / 1_000_000
        });
        const formatted = formatDuration(duration);
        return formatted || "0s";
      }
      case "string":
      default:
        return String(value);
    }
  };

  return (
    <DataTable columns={adaptedColumns} data={adaptedData} title={title} />
  );
};

export default DynamicDataTable;
