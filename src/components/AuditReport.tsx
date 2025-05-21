import React, { useRef, useState, useEffect } from "react";
import html2pdf from "html2pdf.js";
import Header from "./Header";
import ApplicationsSection from "./ApplicationsSection";
import { Application } from "../types";
import ConfigModal from "./ConfigModal";
import { useConfigManagement } from "../hooks/useConfigManagement";

// Make audit data globally available for export
declare global {
  interface Window {
    __AUDIT_DATA__: Application[];
  }
}

const AuditReport: React.FC = () => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [application, setApplications] = useState<Application>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { apiEndpoint, setApiEndpoint } = useConfigManagement();
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  const [printView, setPrintView] = useState(() => {
    // Initialize from URL parameter
    const params = new URLSearchParams(window.location.search);
    return params.get("print") === "true";
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const backendFromUrl = urlParams.get("backend");
    if (backendFromUrl) {
      const decodedApiEndpoint = decodeURIComponent(backendFromUrl);
      setApiEndpoint(decodedApiEndpoint);
    }
  }, [setApiEndpoint]);

  useEffect(() => {
    if (apiEndpoint) {
      setIsConfigModalOpen(false);
      setLoading(false);
    }

    const fetchData = async () => {
      try {
        if (!apiEndpoint) {
          setIsConfigModalOpen(true);
          setLoading(false);
          return;
        }

        const response = await fetch(apiEndpoint, {
          credentials: "include"
        });

        if (!response.ok) {
          throw new Error("Failed to fetch audit data");
        }

        const data = await response.json();
        setApplications(data);
        window.__AUDIT_DATA__ = data; // Update global audit data
        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while fetching data"
        );
        setLoading(false);
      }
    };

    fetchData();
  }, [apiEndpoint]);

  useEffect(() => {
    // Update URL when print view changes
    const newUrl = new URL(window.location.href);
    if (printView) {
      newUrl.searchParams.set("print", "true");
    } else {
      newUrl.searchParams.delete("print");
    }
    window.history.replaceState({}, "", newUrl.toString());
  }, [printView]);

  const handleExport = async () => {
    if (!reportRef.current) return;

    const opt = {
      margin: 0.25,
      filename: `audit-report-${new Date().toISOString().split("T")[0]}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true
      },
      jsPDF: {
        unit: "in",
        format: "a4",
        orientation: "landscape"
      }
    };

    try {
      await html2pdf().set(opt).from(reportRef.current).save();
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="audit-report flex min-h-screen flex-col bg-gray-50">
      <Header
        onOpenConfigModal={() => {
          setIsConfigModalOpen(true);
        }}
        onExport={handleExport}
        printView={printView}
        onPrintViewChange={setPrintView}
      />

      <main
        ref={reportRef}
        className={`container mx-auto flex-grow space-y-6 px-4 py-6 ${printView ? "pdf-export" : ""}`}
      >
        {application && (
          <ApplicationsSection
            key={application.id}
            application={application}
            printView={printView}
          />
        )}
      </main>

      <footer className="border-t border-gray-200 bg-white py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Flanksource • Audit Report
        </div>
      </footer>

      <ConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        setApiEndpoint={setApiEndpoint}
        initialApiEndpoint={apiEndpoint}
      />
    </div>
  );
};

export default AuditReport;
