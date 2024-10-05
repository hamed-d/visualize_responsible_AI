import React, { useState } from 'react';
import { ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';

const categories = {
  academic: "Academic",
  nonprofit: "Non-Profit",
  lawfirm: "Law Firm",
  thinktank: "Think Tank",
  individual: "Individual",
  professional: "Professional",
  industry: "Industry",
  tech: "Technology",
  company: "Company",
  community: "Community",
  independent: "Independent",
  government: "Government",
  bank: "Bank"
};

const AISubmissionsViewer = () => {
  const [data, setData] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandedOrgs, setExpandedOrgs] = useState({});

  React.useEffect(() => {
    fetch('/api/data/clusters.json')
      .then(response => response.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-400"></div>
    </div>
  );

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const toggleOrg = (category, index) => {
    const key = `${category}-${index}`;
    setExpandedOrgs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-8 max-w-5xl mx-auto bg-blue-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-800">AI Submissions Viewer</h1>
      {Object.entries(categories).map(([key, label]) => (
        <div key={key} className="mb-6 bg-white rounded-lg shadow-md overflow-hidden">
          <button
            onClick={() => toggleCategory(key)}
            className="flex items-center justify-between text-lg font-semibold bg-blue-300 text-blue-800 p-4 w-full text-left transition duration-150 ease-in-out hover:bg-blue-400"
          >
            <span>{label}</span>
            {expandedCategories[key] ? <ChevronDown size={24} /> : <ChevronRight size={24} />}
          </button>
          {expandedCategories[key] && data[key] && (
            <div className="p-4">
              {data[key].map((org, index) => (
                <div key={index} className="mb-4 border-b border-blue-100 pb-4 last:border-b-0 last:pb-0">
                  <button
                    onClick={() => toggleOrg(key, index)}
                    className="flex items-center justify-between font-medium text-blue-700 hover:text-blue-500 transition duration-150 ease-in-out w-full"
                  >
                    <span>{org.organization_name || "Unnamed Organization"}</span>
                    {expandedOrgs[`${key}-${index}`] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  </button>
                  {expandedOrgs[`${key}-${index}`] && (
                    <div className="mt-4 ml-6 text-sm text-blue-800 space-y-2">
                      <p><span className="font-semibold">Type:</span> {org.organization_type}</p>
                      <p><span className="font-semibold">Position:</span> {org.overall_position}</p>
                      <p className="font-semibold">Key Recommendations:</p>
                      <ul className="list-disc ml-6 space-y-1">
                        {org.key_recommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                      <p><span className="font-semibold">International Alignment:</span> {org.international_alignment}</p>
                      <a
                        href={`/api/files/${org.filename}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 transition duration-150 ease-in-out mt-2"
                      >
                        View Full Submission <ExternalLink size={16} className="ml-1" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AISubmissionsViewer;