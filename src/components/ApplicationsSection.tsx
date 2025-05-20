import React from 'react';
import {  AlertTriangle, Save, RotateCcw, Info, Shield, Globe, Box, Cloud, Tag, UserCircle, GitCommit, AlertOctagon, Activity, HardDrive, FileSearch, AlertCircle, Timer, GitPullRequest } from 'lucide-react';
import { Icon } from './Icon';
import { formatDistanceToNow, differenceInHours } from 'date-fns';
import DataTable from './DataTable';
import StatusBadge from './StatusBadge';
import AuthCard from './AuthCard';
import { Application, Backup,  Incident } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { groupBy } from 'lodash';
import {MonitoringSection} from './sections/MonitoringSection'
import {VersionSection} from './sections/VersionSection'
import FindingsSection from './sections/FindingsSection';

interface ApplicationsSectionProps {
  application: Application;
  printView: boolean;
}

const PIPELINE_STATUS_COLORS = {
  success: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  running: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-gray-100 text-gray-800'
};

const TYPE_COLORS = {
  security: '#ef4444',    // red-500
  compliance: '#3b82f6',  // blue-500
  performance: '#8b5cf6', // purple-500
  reliability: '#10b981'  // emerald-500
};

const SEVERITY_COLORS = {
  critical: '#ef4444',  // red-500
  high: '#f97316',     // orange-500
  medium: '#eab308',   // yellow-500
  low: '#3b82f6'       // blue-500
};

const renderLegend = (props: any) => {
  const { payload } = props;
  
  return (
    <ul className="flex flex-wrap justify-center gap-4 text-sm mt-2">
      {payload.map((entry: any, index: number) => (
        <li key={`item-${index}`} className="flex items-center">
          <span 
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: entry.color }}
          />
          <span className="capitalize">{entry.value}</span>
        </li>
      ))}
    </ul>
  );
};

const ApplicationsSection: React.FC<ApplicationsSectionProps> = ({ application, printView }) => {
  // Calculate backup statistics
  const calculateBackupStats = (backups: Backup[]) => {
    const totalSize = backups.reduce((acc, backup) => {
      const size = parseFloat(backup.size.split(' ')[0]);
      return acc + size;
    }, 0);
    
    const successCount = backups.filter(b => b.status === 'successful').length;
    const successRate = (successCount / backups.length) * 100;
    
    const latestBackupDate = new Date(backups[0].date);
    const backupAge = formatDistanceToNow(latestBackupDate);
    
    return {
      avgSize: (totalSize / backups.length).toFixed(1),
      successRate: successRate.toFixed(1),
      backupAge
    };
  };

  // Calculate incident statistics
  const calculateIncidentStats = (incidents: Incident[]) => {
    const openIncidents = incidents.filter(i => !i.resolvedDate);
    const openBySeverity = groupBy(openIncidents, 'severity');
    
    const resolutionTimes = incidents
      .filter(i => i.resolvedDate)
      .map(i => ({
        duration: differenceInHours(new Date(i.resolvedDate!), new Date(i.date))
      }));
    
    const avgResolutionTime = resolutionTimes.length > 0
      ? (resolutionTimes.reduce((acc, curr) => acc + curr.duration, 0) / resolutionTimes.length).toFixed(1)
      : 0;

    const incidentsByType = Object.entries(groupBy(incidents, 'severity')).map(([severity, items]) => ({
      severity,
      value: items.length
    }));

    return {
      openBySeverity,
      avgResolutionTime,
      incidentsByType
    };
  };

  const backupStats = calculateBackupStats(application.backups);
  const incidentStats = calculateIncidentStats(application.incidents);
  const latestBackup = application.backups[0];
  const latestRestore = application.restores[0];
  const latestIncident = application.incidents[0];

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const calculateDuration = (start: string, end?: string) => {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();
    const hours = differenceInHours(endDate, startDate);
    
    if (hours < 24) {
      return `${hours}h`;
    }
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h`;
  };



  const pipelineColumns = [
    { header: 'Name', accessor: 'name' },
    { 
      header: 'Last Run', 
      accessor: 'lastRun',
      render: (value: string) => formatDate(value)
    },
    { header: 'Last Run By', accessor: 'lastRunBy' },
    { header: 'Git Tag', accessor: 'gitTag' },
    { header: 'Repository', accessor: 'repository' },
    { header: 'Environment', accessor: 'environment' },
    { header: 'Duration', accessor: 'duration' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (value: string) => (
        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${PIPELINE_STATUS_COLORS[value as keyof typeof PIPELINE_STATUS_COLORS]}`}>
          <span className="capitalize">{value}</span>
        </span>
      )
    },
  ];

  const userColumns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Role', accessor: 'role' },
    { 
      header: 'Auth Type', 
      accessor: 'authType',
      render: (value: string, user: any) => {
        const auth = application.accessControl.authentication.find(a => 
          user.email.endsWith(a.domain || '')
        );
        return auth ? auth.type.toUpperCase() : 'N/A';
      }
    },
    { 
      header: 'Created', 
      accessor: 'created',
      render: (value: string) => formatDate(value)
    },
    { 
      header: 'Last Login', 
      accessor: 'lastLogin',
      render: (value: string) => formatDate(value)
    },
    { 
      header: 'Last Access Review', 
      accessor: 'lastAccessReview',
      render: (value: string) => formatDate(value)
    },
  ];

  const changeColumns = [
    { header: 'Change ID', accessor: 'id' },
    { 
      header: 'Date', 
      accessor: 'date',
      render: (value: string) => formatDate(value)
    },
    { header: 'User', accessor: 'user' },
    { header: 'Description', accessor: 'description' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (value: string) => <StatusBadge status={value as any} printView={printView} />
    },
  ];

  const incidentColumns = [
    { 
      header: 'Date', 
      accessor: 'date',
      render: (value: string) => formatDate(value)
    },
    { 
      header: 'Severity', 
      accessor: 'severity',
      render: (value: string) => <StatusBadge status={value as any} printView={printView} />
    },
    { header: 'Description', accessor: 'description' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (value: string) => <StatusBadge status={value as any} printView={printView} />
    },
    { 
      header: 'Duration',
      accessor: 'date',
      render: (value: string, incident: Incident) => calculateDuration(value, incident.resolvedDate)
    },
    { 
      header: 'Resolved Date', 
      accessor: 'resolvedDate',
      render: (value: string) => value ? formatDate(value) : '-'
    },
  ];

  const backupColumns = [
    { header: 'Database', accessor: 'database' },
    { 
      header: 'Date', 
      accessor: 'date',
      render: (value: string) => formatDate(value)
    },
    { header: 'Size', accessor: 'size' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (value: string) => <StatusBadge status={value as any} printView={printView} />
    },
    { 
      header: 'Error', 
      accessor: 'error',
      render: (value: string) => value || '-'
    },
  ];

  const restoreColumns = [
    { header: 'Database', accessor: 'database' },
    { 
      header: 'Date', 
      accessor: 'date',
      render: (value: string) => formatDate(value)
    },
    { header: 'Source', accessor: 'source' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (value: string) => <StatusBadge status={value as any} printView={printView} />
    },
    { 
      header: 'Completed Date', 
      accessor: 'completedDate',
      render: (value: string) => value ? formatDate(value) : '-'
    },
  ];

  const findingColumns = [
    { 
      header: 'Type', 
      accessor: 'type',
      render: (value: string) => {
        const getTypeIcon = (type: string) => {
          switch (type) {
            case 'security':
              return <Shield size={16} className="text-gray-500" />;
            case 'compliance':
              return <FileSearch size={16} className="text-gray-500" />;
            case 'performance':
              return <Activity size={16} className="text-gray-500" />;
            case 'reliability':
              return <HardDrive size={16} className="text-gray-500" />;
            default:
              return <AlertCircle size={16} className="text-gray-500" />;
          }
        };

        return (
          <span className="inline-flex items-center gap-2 px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
            {getTypeIcon(value)}
            <span className="capitalize">{value}</span>
          </span>
        );
      }
    },
    { 
      header: 'Severity', 
      accessor: 'severity',
      render: (value: string) => <StatusBadge status={value as any} printView={printView} />
    },
    { header: 'Title', accessor: 'title' },
    { header: 'Description', accessor: 'description' },
    { 
      header: 'First Observed', 
      accessor: 'date',
      render: (value: string) => formatDate(value)
    },
    { 
      header: 'Last Observed', 
      accessor: 'lastObserved',
      render: (value: string) => formatDate(value)
    },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (value: string) => (
        <span 
          className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
            value === 'open' ? 'bg-red-100 text-red-800' :
            value === 'resolved' ? 'bg-green-100 text-green-800' :
            value === 'in-progress' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}
        >
          <span className="capitalize">{value}</span>
        </span>
      )
    },
  ];

  const assessmentColumns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Type', accessor: 'type' },
    { 
      header: 'Assessor', 
      accessor: 'assesor',
      render: (value: any) => value?.name || '-'
    },
    { 
      header: 'Date', 
      accessor: 'date',
      render: (value: string) => formatDate(value)
    },
    { 
      header: 'Expiry', 
      accessor: 'expiry',
      render: (value: string) => formatDate(value)
    },
    {
      header: 'Findings',
      accessor: 'findings',
      render: (value: any) => (
        <div className="space-x-2">
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800">
            {value.high} High
          </span>
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800">
            {value.medium} Medium
          </span>
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
            {value.low} Low
          </span>
        </div>
      )
    },
    {
      header: 'Unresolved',
      accessor: 'unresolved',
      render: (value: any) => (
        <div className="space-x-2">
          {value.high > 0 && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800">
              {value.high} High
            </span>
          )}
          {value.low > 0 && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
              {value.low} Low
            </span>
          )}
          {value.high === 0 && value.low === 0 && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
              All Resolved
            </span>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="applications-section space-y-8">
      <h2 className="text-2xl font-semibold mb-6 flex items-center">
        <Box className="mr-2 text-teal-600" size={24} />
        {application.name} - {application.type}
      </h2>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Info className="mr-2 text-teal-600" size={20} />
            Application Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500 flex items-center mb-2">
                  <Shield className="mr-1.5 text-gray-400" size={16} />
                  Classification
                </div>
                <p className="text-sm">{application.dataClassication}</p>
              </div>
              <div>
                <div className="text-sm text-gray-500 flex items-center mb-2">
                  <AlertTriangle className="mr-1.5 text-gray-400" size={16} />
                  Criticality
                </div>
                <p className="text-sm">{application.criticality}</p>
              </div>
              <div>
                <div className="text-sm text-gray-500 flex items-center mb-2">
                  <Globe className="mr-1.5 text-gray-400" size={16} />
                  Usage
                </div>
                <p className="text-sm">{application.use}</p>
              </div>
              <div>
                <div className="text-sm text-gray-500 flex items-center mb-2">
                  <Box className="mr-1.5 text-gray-400" size={16} />
                  Source
                </div>
                <p className="text-sm">{application.source}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500 flex items-center mb-2">
                  <Info className="mr-1.5 text-gray-400" size={16} />
                  Description
                </div>
                <p className="text-sm">{application.description}</p>
              </div>
            </div>
           
          </div>
        </div>

        <hr className="border-gray-200" />
  

        <hr className="border-gray-200" />
        
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <UserCircle className="mr-2 text-teal-600" size={20} />
            Users & Roles
          </h3>
          <div className="space-y-6">
            <DataTable 
              columns={userColumns} 
              data={application.accessControl.users} 
            />
            <div>
              <h4 className="text-lg font-medium mb-3">Authentication Methods</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {application.accessControl.authentication.slice(0, 3).map((auth) => (
                  <AuthCard key={auth.name} auth={auth} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <hr className="border-gray-200" />
        
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <GitCommit className="mr-2 text-teal-600" size={20} />
            Changes
          </h3>
          <DataTable 
            columns={changeColumns} 
            data={application.changes} 
          />
        </div>

        <hr className="border-gray-200" />
        
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <AlertOctagon className="mr-2 text-teal-600" size={20} />
            Incidents
          </h3>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="text-sm font-medium text-gray-600 mb-4">Open Incidents by Severity</h4>
                <div className="space-y-2">
                  {Object.entries(incidentStats.openBySeverity).map(([severity, incidents]) => (
                    <div key={severity} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: SEVERITY_COLORS[severity as keyof typeof SEVERITY_COLORS] }}
                        />
                        <span className="text-sm text-gray-600 capitalize">{severity}</span>
                      </div>
                      <span className="text-sm font-medium">{incidents.length}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Average Resolution Time</h4>
                <p className="text-2xl font-semibold text-teal-600">{incidentStats.avgResolutionTime}h</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Incidents by Type</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={incidentStats.incidentsByType}
                        dataKey="value"
                        nameKey="severity"
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        label
                      >
                        {incidentStats.incidentsByType.map((entry) => (
                          <Cell 
                            key={entry.severity} 
                            fill={SEVERITY_COLORS[entry.severity as keyof typeof SEVERITY_COLORS]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend content={renderLegend} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <DataTable 
              columns={incidentColumns} 
              data={application.incidents} 
            />
          </div>
        </div>

        <hr className="border-gray-200" />
        
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Save className="mr-2 text-teal-600" size={20} />
            Recent Backups
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 max-w-[16rem]">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Average Backup Size</h4>
                <p className="text-2xl font-semibold text-teal-600">{backupStats.avgSize} GB</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 max-w-[16rem]">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Backup Success Rate</h4>
                <p className="text-2xl font-semibold text-teal-600">{backupStats.successRate}%</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 max-w-[16rem]">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Last Backup Age</h4>
                <p className="text-2xl font-semibold text-teal-600">{backupStats.backupAge}</p>
              </div>
            </div>
            <DataTable 
              columns={backupColumns} 
              data={application.backups} 
            />
          </div>
        </div>

        <hr className="border-gray-200" />
        
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <RotateCcw className="mr-2 text-teal-600" size={20} />
            Recent Restores
          </h3>
          <DataTable 
            columns={restoreColumns} 
            data={application.restores} 
          />
        </div>

        <hr className="border-gray-200" />

        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <FileSearch className="mr-2 text-teal-600" size={20} />
            Security Assessments
          </h3>
          <DataTable 
            columns={assessmentColumns} 
            data={application.assessments} 
          />
        </div>

        <hr className="border-gray-200" />

        <FindingsSection application={application} printView={printView} />

        <hr className="border-gray-200" />

        <MonitoringSection application={application}/>

        <hr className="border-gray-200" />
        <VersionSection application={application}/>


        <hr className="border-gray-200" />
        
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <GitPullRequest className="mr-2 text-teal-600" size={20} />
            Pipelines
          </h3>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Pipeline Status</h4>
                <div className="space-y-2">
                  {Object.entries(groupBy(application.pipelines, 'status')).map(([status, items]) => (
                    <div key={status} className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${PIPELINE_STATUS_COLORS[status as keyof typeof PIPELINE_STATUS_COLORS]}`}>
                        <span className="capitalize">{status}</span>
                      </span>
                      <span className="text-sm font-medium">{items.length}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Latest Pipeline</h4>
                {application.pipelines[0] && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">{application.pipelines[0].name}</p>
                    <p className="text-xs text-gray-500">{formatDate(application.pipelines[0].lastRun)}</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${PIPELINE_STATUS_COLORS[application.pipelines[0].status]}`}>
                      <span className="capitalize">{application.pipelines[0].status}</span>
                    </span>
                  </div>
                )}
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Average Duration</h4>
                <div className="flex items-center">
                  <Timer className="text-gray-400 mr-2" size={16} />
                  <p className="text-2xl font-semibold text-teal-600">
                    {application.pipelines.reduce((acc, curr) => {
                      const [min, sec] = curr.duration.split('m ');
                      return acc + (parseInt(min) * 60) + parseInt(sec.replace('s', ''));
                    }, 0) / application.pipelines.length / 60}m
                  </p>
                </div>
              </div>
            </div>
            <DataTable 
              columns={pipelineColumns} 
              data={application.pipelines} 
            />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Cloud className="mr-2 text-teal-600" size={20} />
            Locations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(application.locations || []).map((location, index) => (
              <div key={index} className="relative bg-gray-50 p-4 rounded-lg border border-gray-200 max-w-md">
                <span className="absolute top-2 right-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  <Tag size={12} className="mr-1" />
                  {location.role}
                </span>
                <div className="flex items-center gap-2 mt-2">
                  <Icon name={location.provider.toLowerCase()} className="h-5 w-5 text-gray-500" />
                  <div className="flex-grow">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{location.name}</span>
                      <span className="text-gray-500">({location.provider})</span>
                    </div>
                    <div className="text-gray-600 text-sm mt-1">
                      
                      <span className="mr-4">Region: {location.region}</span>
                      <span>ID: {location.id}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsSection;