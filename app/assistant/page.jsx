import Navbar from '../../components/Navbar';

export default function AssistantPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">AI Assistant</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-lg text-gray-600">Smart support system coming soon...</p>
        </div>
      </main>
    </div>
  );
}
