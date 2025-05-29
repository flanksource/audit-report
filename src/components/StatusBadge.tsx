import React from "react";

type StatusType =
  | "completed"
  | "pending"
  | "failed"
  | "resolved"
  | "investigating"
  | "mitigated"
  | "successful"
  | "in-progress"
  | "critical"
  | "high"
  | "medium"
  | "low";

interface StatusBadgeProps {
  status: StatusType;
  printView?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  printView = false
}) => {
  const getStatusColor = (
    status: StatusType
  ): { bg: string; dot: string; text: string } => {
    switch (status.toLowerCase()) {
      case "completed":
      case "resolved":
      case "successful":
        return {
          bg: "bg-green-100 text-green-800",
          dot: "bg-green-600",
          text: "text-green-700"
        };
      case "pending":
      case "in-progress":
      case "mitigated":
        return {
          bg: "bg-blue-100 text-blue-800",
          dot: "bg-blue-600",
          text: "text-blue-700"
        };
      case "failed":
        return {
          bg: "bg-red-100 text-red-800",
          dot: "bg-red-600",
          text: "text-red-700"
        };
      case "investigating":
        return {
          bg: "bg-yellow-100 text-yellow-800",
          dot: "bg-yellow-600",
          text: "text-yellow-700"
        };
      case "critical":
        return {
          bg: "bg-red-100 text-red-800",
          dot: "bg-red-600",
          text: "text-red-700"
        };
      case "high":
        return {
          bg: "bg-orange-100 text-orange-800",
          dot: "bg-orange-600",
          text: "text-orange-700"
        };
      case "medium":
        return {
          bg: "bg-yellow-100 text-yellow-800",
          dot: "bg-yellow-600",
          text: "text-yellow-700"
        };
      case "low":
        return {
          bg: "bg-blue-100 text-blue-800",
          dot: "bg-blue-600",
          text: "text-blue-700"
        };
      default:
        return {
          bg: "bg-gray-100 text-gray-800",
          dot: "bg-gray-600",
          text: "text-gray-700"
        };
    }
  };

  const { bg, dot, text } = getStatusColor(status);

  if (printView) {
    return (
      <span className="inline-flex items-center">
        <span className={`mr-1.5 inline-block h-2 w-2 rounded-full ${dot}`} />
        <span className={text}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </span>
    );
  }

  return (
    <span className={`status-badge ${bg}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;
