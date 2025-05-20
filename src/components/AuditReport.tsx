import React, { useRef, useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import Header from './Header';
import ApplicationsSection from './ApplicationsSection';
import { applications } from '../data/mockData';
import { Application } from '../types';

// Make audit data globally available for export
declare global {
  interface Window {
    __AUDIT_DATA__: Application[];
  }
}

window.__AUDIT_DATA__ = applications;

const AuditReport: React.FC = () => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [printView, setPrintView] = useState(() => {
    // Initialize from URL parameter
    const params = new URLSearchParams(window.location.search);
    return params.get('print') === 'true';
  });

  useEffect(() => {
    // Update URL when print view changes
    const newUrl = new URL(window.location.href);
    if (printView) {
      newUrl.searchParams.set('print', 'true');
    } else {
      newUrl.searchParams.delete('print');
    }
    window.history.replaceState({}, '', newUrl.toString());
  }, [printView]);

  const handleExport = async () => {
    if (!reportRef.current) return;

    const opt = {
      margin: 0.25,
      filename: `audit-report-${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        letterRendering: true
      },
      jsPDF: { 
        unit: 'in', 
        format: 'a4', 
        orientation: 'landscape' 
      }
    };

    try {
      await html2pdf().set(opt).from(reportRef.current).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className="audit-report min-h-screen flex flex-col bg-gray-50">
      <Header 
        onExport={handleExport} 
        printView={printView}
        onPrintViewChange={setPrintView}
      />
      
      <main 
        ref={reportRef} 
        className={`container mx-auto px-4 py-6 flex-grow space-y-6 ${printView ? 'pdf-export' : ''}`}
      >
        {applications.map((application: Application) => (
          <ApplicationsSection 
            key={application.id} 
            application={application} 
            printView={printView} 
          />
        ))}
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Flanksource • Audit Report
        </div>
      </footer>
    </div>
  );
};

export default AuditReport;