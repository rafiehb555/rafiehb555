import Navbar from '../../components/Navbar';

export default function FranchisePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Franchise System</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-lg text-gray-600">Business expansion platform coming soon...</p>
        </div>
      </main>
    </div>
  );
}
