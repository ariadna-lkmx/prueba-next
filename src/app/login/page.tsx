'use client';

import { useState } from 'react';

interface Issue {
  id: number;
  title: string;
  createdBy: string;
  createdAt: string;
  type: string;
  status: string;
  assignedTo?: string;
  updatedAt: string;
}

export default function LoginPage() {
  const [text, setText] = useState('');
  const [processedIssues, setProcessedIssues] = useState<Issue[]>([]);
  const [hasProcessed, setHasProcessed] = useState(false);

  const processText = (inputText: string): Issue[] => {
    const issues: Issue[] = [];
    const lines = inputText.split('\n');
    
    let currentIssue: Partial<Issue> = {};
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Check for issue number
      if (line.startsWith('#')) {
        // If we have a previous issue, save it
        if (currentIssue.id) {
          issues.push(currentIssue as Issue);
        }
        
        // Start new issue
        const idMatch = line.match(/#(\d+)/);
        if (idMatch) {
          currentIssue = {
            id: parseInt(idMatch[1]),
            title: lines[i - 1]?.trim() || '',
            createdBy: '',
            createdAt: '',
            type: '',
            status: '',
            updatedAt: ''
          };
        }
      }
      
      // Parse issue details
      if (currentIssue.id) {
        if (line.includes('created') && line.includes('by')) {
          const createdMatch = line.match(/created (.*?) by (.*?)(?:\s|$)/);
          if (createdMatch) {
            currentIssue.createdAt = createdMatch[1];
            currentIssue.createdBy = createdMatch[2];
          }
        }
        
        if (line.includes('updated')) {
          const updatedMatch = line.match(/updated (.*?)(?:\s|$)/);
          if (updatedMatch) {
            currentIssue.updatedAt = updatedMatch[1];
          }
        }
        
        if (line.includes('Assigned to')) {
          currentIssue.assignedTo = line.replace('Assigned to', '').trim();
        }
        
        if (line.includes('🔴 Epic') || line.includes('🔵 User Story') || line.includes('⚫️ Change') || line.includes('🚧 Risk') || line.includes('🐞 Bug')) {
          currentIssue.type = line.trim();
        }
        
        if (line.includes('In Testing') || line.includes('Done') || line.includes('Accepted for development') || 
            line.includes('More Information Required') || line.includes('Resolved') || line.includes('Escalated') || 
            line.includes('Canceled')) {
          currentIssue.status = line.trim();
        }
      }
    }
    
    // Add the last issue
    if (currentIssue.id) {
      issues.push(currentIssue as Issue);
    }
    
    return issues;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const issues = processText(text);
    setProcessedIssues(issues);
    setHasProcessed(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Issue Parser
          </h2>
        </div>
        <div className="space-y-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm">
              <div>
                <label htmlFor="text-input" className="sr-only">
                  Enter your text
                </label>
                <textarea
                  id="text-input"
                  name="text"
                  rows={8}
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your text here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-red-600 hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Process Text
              </button>
            </div>
          </form>

          {hasProcessed && (
            <div className="rounded-md shadow-sm">
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Processed Issues</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {processedIssues.map((issue, index) => (
                        <tr key={issue.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{issue.id}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{issue.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{issue.type}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{issue.status}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{issue.assignedTo || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{issue.createdBy}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{issue.updatedAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 