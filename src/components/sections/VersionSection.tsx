import React from 'react';
import { GitBranch } from 'lucide-react';
import Section from '../Section';
import DataTable from '../DataTable';
import { Icon } from '../Icon';
import { formatDistanceToNow } from 'date-fns';
import { Application } from '../../types';

interface VersionSectionProps {
  application: Application;
}

export const VersionSection = ({ application }: VersionSectionProps) => {
  const versionColumns = [
    { header: 'Number', accessor: 'number' },
    { 
      header: 'Released', 
      accessor: 'released',
      render: (value: string) => formatDistanceToNow(new Date(value), { addSuffix: true })
    },
    { 
      header: 'Deployed', 
      accessor: 'deployed',
      render: (value: string) => formatDistanceToNow(new Date(value), { addSuffix: true })
    },
    { header: 'Git Tag', accessor: 'gitTag' },
    { header: 'Repo Name', accessor: 'repoName' },
    { header: 'Created By', accessor: 'createdBy' },
    { header: 'Authorized By', accessor: 'authorizedBy' },
  ];

  return (
    <Section title="Version Information" icon={GitBranch}>
       <div>
            <div className="text-sm text-gray-500 flex items-center mb-2">
              <GitBranch className="mr-1.5 text-gray-400" size={16} />
              Repositories
            </div>
            {(application.repositories || []).map((repo, index) => (
              <div key={index} className="flex items-center gap-2 text-sm mb-2">
                <Icon name={repo.type.toLowerCase()} className="h-4 w-4 text-gray-500" />
                <a 
                  href={repo.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-teal-600 hover:text-teal-700"
                >
                  {repo.url.replace(/^https?:\/\//, '')}
                </a>
              </div>
            ))}
          </div>
      <div className="space-y-4">
        <DataTable 
          columns={versionColumns} 
          data={[application.version]}
        />
       
      </div>
    </Section>
  );
};

export default VersionSection;