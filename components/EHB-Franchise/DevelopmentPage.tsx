import React from 'react';
import { ServiceCategory } from './FranchiseUtils/FranchiseTypes';
import { FRANCHISE_TYPES } from './FranchiseUtils/Constants';
import { FiSearch, FiDownload, FiBookmark, FiShare2 } from 'react-icons/fi';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface FranchiseLevel {
  type: string;
  scope: string;
  controls: string;
  manages: string;
}

interface EarningSource {
  level: string;
  incomeSource: string;
}

interface Penalty {
  violation: string;
  escalationTiming: string;
  fine: string;
}

interface ApplicationStep {
  step: number;
  action: string;
}

interface SearchResult {
  section: string;
  content: string;
  relevance: number;
}

interface Bookmark {
  id: string;
  title: string;
  section: string;
  timestamp: number;
}

const franchiseLevels: FranchiseLevel[] = [
  {
    type: 'Sub-Franchise',
    scope: 'Local Area / Tehsil',
    controls: 'Orders, Complaints',
    manages: '10 Levels: L1 – L10',
  },
  {
    type: 'Master-Franchise',
    scope: 'District / Region',
    controls: 'Sub-franchise Reports',
    manages: 'Max 25 Sub-Franchises',
  },
  {
    type: 'Corporate',
    scope: 'National Level',
    controls: 'Full Country Data',
    manages: 'All Master + Sub Levels',
  },
];

const earningSources: EarningSource[] = [
  {
    level: 'Sub-Franchise',
    incomeSource: 'Direct order commission, fines collected locally',
  },
  {
    level: 'Master-Franchise',
    incomeSource: 'Share from sub-franchises under control',
  },
  {
    level: 'Corporate Franchise',
    incomeSource: 'Share from all master + direct validator rewards',
  },
];

const penalties: Penalty[] = [
  {
    violation: 'Complaint not resolved',
    escalationTiming: '6 hrs > Master',
    fine: '$10–$200 (2% order value)',
  },
  {
    violation: "Master didn't resolve",
    escalationTiming: '6 hrs > Corporate',
    fine: '$300–$3,000 (up to 5%)',
  },
  {
    violation: 'Fake Verification',
    escalationTiming: 'Auto-escalate to Admin',
    fine: 'Franchise Suspension',
  },
];

const applicationSteps: ApplicationStep[] = [
  {
    step: 1,
    action: 'Select Service (e.g., GoSellr, Health, Legal)',
  },
  {
    step: 2,
    action: 'Choose Area + Type (Sub/Master/Corporate)',
  },
  {
    step: 3,
    action: 'Submit Documents (CNIC, Address, Bank, Experience, etc.)',
  },
  {
    step: 4,
    action: 'Attach JPS Profile (Auto-attached if available)',
  },
  {
    step: 5,
    action: 'Wallet Token Lock (Lock EHBGC if required for validator eligibility)',
  },
  {
    step: 6,
    action: 'Final Verification (Admin/AI auto-review + SQL filter matching)',
  },
];

const sections = [
  'overview',
  'responsibilities',
  'earnings',
  'penalties',
  'integration',
  'application',
];

export default function DevelopmentPage() {
  const [activeTab, setActiveTab] = React.useState('overview');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<SearchResult[]>([]);
  const [bookmarks, setBookmarks] = React.useState<Bookmark[]>([]);
  const [showSearch, setShowSearch] = React.useState(false);
  const [showBookmarks, setShowBookmarks] = React.useState(false);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const results: SearchResult[] = [];
    const searchLower = query.toLowerCase();

    franchiseLevels.forEach(level => {
      if (
        level.type.toLowerCase().includes(searchLower) ||
        level.scope.toLowerCase().includes(searchLower) ||
        level.controls.toLowerCase().includes(searchLower) ||
        level.manages.toLowerCase().includes(searchLower)
      ) {
        results.push({
          section: 'overview',
          content: `${level.type}: ${level.scope}`,
          relevance: 1,
        });
      }
    });

    earningSources.forEach(source => {
      if (
        source.level.toLowerCase().includes(searchLower) ||
        source.incomeSource.toLowerCase().includes(searchLower)
      ) {
        results.push({
          section: 'earnings',
          content: `${source.level}: ${source.incomeSource}`,
          relevance: 1,
        });
      }
    });

    penalties.forEach(penalty => {
      if (
        penalty.violation.toLowerCase().includes(searchLower) ||
        penalty.escalationTiming.toLowerCase().includes(searchLower) ||
        penalty.fine.toLowerCase().includes(searchLower)
      ) {
        results.push({
          section: 'penalties',
          content: `${penalty.violation}: ${penalty.fine}`,
          relevance: 1,
        });
      }
    });

    setSearchResults(results.sort((a, b) => b.relevance - a.relevance));
  };

  const addBookmark = () => {
    const newBookmark: Bookmark = {
      id: Date.now().toString(),
      title: `Bookmark ${bookmarks.length + 1}`,
      section: activeTab,
      timestamp: Date.now(),
    };
    setBookmarks([...bookmarks, newBookmark]);
  };

  const removeBookmark = (id: string) => {
    setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id));
  };

  const exportToPDF = async () => {
    const element = document.getElementById('content-section');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('ehb-franchise-documentation.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const shareContent = () => {
    if (navigator.share) {
      navigator.share({
        title: 'EHB Franchise Documentation',
        text: `Check out the ${activeTab} section of the EHB Franchise Documentation`,
        url: window.location.href,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            EHB Franchise Model Documentation
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Complete technical documentation and development guide
          </p>

          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FiSearch className="mr-2" />
              Search
            </button>
            <button
              onClick={exportToPDF}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FiDownload className="mr-2" />
              Export PDF
            </button>
            <button
              onClick={addBookmark}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FiBookmark className="mr-2" />
              Bookmark
            </button>
            <button
              onClick={shareContent}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FiShare2 className="mr-2" />
              Share
            </button>
          </div>

          {showSearch && (
            <div className="max-w-xl mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value);
                    handleSearch(e.target.value);
                  }}
                  placeholder="Search documentation..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
                {searchResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
                    {searchResults.map((result, index) => (
                      <div
                        key={index}
                        className="p-3 hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          setActiveTab(result.section);
                          setShowSearch(false);
                        }}
                      >
                        <div className="text-sm font-medium text-gray-900">{result.content}</div>
                        <div className="text-xs text-gray-500">Section: {result.section}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {showBookmarks && bookmarks.length > 0 && (
            <div className="max-w-xl mx-auto mb-8">
              <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Bookmarks</h3>
                <div className="space-y-2">
                  {bookmarks.map(bookmark => (
                    <div
                      key={bookmark.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                    >
                      <button
                        onClick={() => setActiveTab(bookmark.section)}
                        className="text-left flex-1"
                      >
                        <div className="text-sm font-medium text-gray-900">{bookmark.title}</div>
                        <div className="text-xs text-gray-500">Section: {bookmark.section}</div>
                      </button>
                      <button
                        onClick={() => removeBookmark(bookmark.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {sections.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div id="content-section" className="bg-white rounded-lg shadow-lg p-6">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Franchise Model Overview
                </h2>
                <p className="text-gray-600 mb-6">
                  EHB's franchise model manages service areas worldwide through a Corporate {'>'}{' '}
                  Master {'>'} Sub-Franchise hierarchy. Each service has specific franchise routes,
                  ownership rights, earning logic, and penalties defined.
                </p>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Scope
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Controls
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Manages
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {franchiseLevels.map(level => (
                        <tr key={level.type}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {level.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {level.scope}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {level.controls}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {level.manages}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'responsibilities' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Key Franchise Responsibilities
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">
                      Sub-Franchise (L1–L10)
                    </h3>
                    <ul className="space-y-2 text-blue-800">
                      <li>• Register and verify local services/products</li>
                      <li>• Resolve complaints in 6 hours</li>
                      <li>• Get service charge share per completed order</li>
                      <li>• Responsible for local traffic/order flow</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-900 mb-3">Master Franchise</h3>
                    <ul className="space-y-2 text-green-800">
                      <li>• Handle escalated issues from sub-franchises</li>
                      <li>• Ensure verification standard of local businesses</li>
                      <li>• Get commission override from connected sub-franchises</li>
                      <li>• Monitor SQL updates and rating systems</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-900 mb-3">
                      Corporate Franchise
                    </h3>
                    <ul className="space-y-2 text-purple-800">
                      <li>• Owns the national control layer</li>
                      <li>• Can launch national marketing campaigns</li>
                      <li>• Earns from master franchises and national orders</li>
                      <li>• Required to maintain validator status</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'earnings' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Earning System</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Franchise Level
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Income Source
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {earningSources.map(source => (
                        <tr key={source.level}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {source.level}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {source.incomeSource}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                  <p className="text-yellow-800">
                    💰 <span className="font-semibold">Passive Income Model:</span> Validator +
                    Loyalty rewards (EHBGC Locked)
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'penalties' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Penalty & Fine System</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Violation
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Escalation Timing
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fine
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {penalties.map(penalty => (
                        <tr key={penalty.violation}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {penalty.violation}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {penalty.escalationTiming}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {penalty.fine}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integration' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Module Integration</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">SQL Integration</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>
                        • Franchisees can only register services/products equal to or below their
                        own SQL
                      </li>
                      <li>• SQL violations trigger auto-downgrade or warnings</li>
                      <li>
                        • Franchise levels affect the type and volume of services they can handle
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Connected Modules</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• EHB Dashboard: Shows owned franchise, earnings, complaints</li>
                      <li>• JPS: Sends applicant profile and documents</li>
                      <li>• SQL System: Validates eligibility</li>
                      <li>• EHB Wallet: Manages payments and income</li>
                      <li>• EHB AI Marketplace: Franchise discovery</li>
                      <li>• KYC & PSS: Identity verification</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'application' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Franchise Application Process
                </h2>
                <div className="space-y-4">
                  {applicationSteps.map(step => (
                    <div
                      key={step.step}
                      className="flex items-start space-x-4 bg-gray-50 p-4 rounded-lg"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                        {step.step}
                      </div>
                      <div>
                        <p className="text-gray-900">{step.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
