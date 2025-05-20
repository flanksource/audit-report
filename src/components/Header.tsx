import React, { useState, useRef, useEffect } from 'react';
import { ClipboardCheck, Download, Eye, ChevronDown } from 'lucide-react';

interface HeaderProps {
  onExport: () => void;
  printView: boolean;
  onPrintViewChange: (printView: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ onExport, printView, onPrintViewChange }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExportJSON = () => {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(window.__AUDIT_DATA__, null, 2)
    )}`;
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', `audit-report-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    setMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <ClipboardCheck className="h-8 w-8 text-teal-600 mr-3" />
          <div>
            <h1 className="text-2xl font-semibold">Audit Report</h1>
            <p className="text-sm text-gray-500">
              Generated on {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onPrintViewChange(!printView)}
            className={`flex items-center px-4 py-2 rounded-md transition-colors ${
              printView 
                ? 'bg-teal-100 text-teal-800' 
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            <Eye className="h-4 w-4 mr-2" />
            Print View
          </button>
          
          <div className="relative inline-flex" ref={menuRef}>
            <button 
              onClick={onExport}
              className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-l-md hover:bg-teal-700 transition-colors whitespace-nowrap"
            >
              <Download className="h-4 w-4 mr-2" />
              Export as PDF
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex items-center px-2 py-2 bg-teal-600 text-white rounded-r-md border-l border-teal-500 hover:bg-teal-700 transition-colors"
            >
              <ChevronDown className="h-4 w-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 top-full">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <button
                    onClick={handleExportJSON}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    role="menuitem"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export as JSON
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;