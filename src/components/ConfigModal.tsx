import React, { useState, useEffect, useRef } from "react";
import { Upload } from "lucide-react";

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  setApiEndpoint: (apiEndpoint: string) => void;
  initialApiEndpoint: string;
  onFileLoad?: (data: any) => void;
}

const ConfigModal: React.FC<ConfigModalProps> = ({
  isOpen,
  onClose,
  setApiEndpoint,
  initialApiEndpoint,
  onFileLoad
}) => {
  const [modalApiEndpoint, setModalApiEndpoint] = useState(initialApiEndpoint);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setModalApiEndpoint(initialApiEndpoint || "");
    }
  }, [isOpen, initialApiEndpoint]);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    setApiEndpoint(modalApiEndpoint);
    onClose();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (onFileLoad) {
        onFileLoad(e.target?.result);
        onClose();
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out">
      <div className="w-full max-w-md scale-100 transform rounded-lg bg-white p-6 opacity-100 shadow-xl transition-all duration-300 ease-in-out">
        <h2 className="mb-4 text-xl font-semibold">Configure Data Source</h2>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="modalApiEndpoint"
              className="block text-sm font-medium text-gray-700"
            >
              API Endpoint URL:
            </label>
            <input
              type="text"
              id="modalApiEndpoint"
              value={modalApiEndpoint}
              onChange={(e) => setModalApiEndpoint(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              placeholder="http://localhost:3000/api/application/mc/azure-flanksource"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Or</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Load from JSON file:
            </label>
            <div className="mt-1 flex items-center justify-center">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <Upload className="mr-2 h-4 w-4" />
                Choose File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            type="button"
            className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            type="button"
            className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigModal;
