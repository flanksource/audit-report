import { useState } from "react";

export interface ConfigManagementHook {
  apiEndpoint: string;
  setApiEndpoint: React.Dispatch<React.SetStateAction<string>>;
}

export const useConfigManagement = (): ConfigManagementHook => {
  const [apiEndpoint, setApiEndpoint] = useState("");

  return {
    apiEndpoint,
    setApiEndpoint
  };
};
