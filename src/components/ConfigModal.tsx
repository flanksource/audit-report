import React, { useState, useEffect } from "react";

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  setApiEndpoint: (apiEndpoint: string) => void;
  initialApiEndpoint: string;
}

const ConfigModal: React.FC<ConfigModalProps> = ({
  isOpen,
  onClose,
  setApiEndpoint,
  initialApiEndpoint
}) => {
  const [modalApiEndpoint, setModalApiEndpoint] = useState(initialApiEndpoint);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out">
      <div className="w-full max-w-md scale-100 transform rounded-lg bg-white p-6 opacity-100 shadow-xl transition-all duration-300 ease-in-out">
        <h2 className="mb-4 text-xl font-semibold">Configure API Endpoint</h2>
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
