import { TimelineEvent, RoadmapStatus } from '../types';

interface RoadmapTimelineProps {
  timeline: TimelineEvent[];
  status: RoadmapStatus;
}

export default function RoadmapTimeline({ timeline, status }: RoadmapTimelineProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'milestone':
        return '🎯';
      case 'release':
        return '🚀';
      case 'update':
        return '📝';
      default:
        return '📌';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Timeline</h2>
      
      <div className="space-y-8">
        {timeline.map((event) => (
          <div key={event.id} className="relative pl-8">
            {/* Timeline line */}
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200" />
            
            {/* Timeline dot */}
            <div className="absolute left-0 top-2 w-4 h-4 rounded-full bg-blue-500" />
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{getTypeIcon(event.type)}</span>
                    <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                  </div>
                  <p className="mt-1 text-gray-600">{event.description}</p>
                </div>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(event.status)}`}>
                  {event.status}
                </span>
              </div>
              
              <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <span>{event.date}</span>
                <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
                  View Module Details
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 