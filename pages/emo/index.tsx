import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import EMOHomeCard from '../../components/EMO/EMOHomeCard';
import EMOServiceList from '../../components/EMO/EMOServiceList';
import EMOOrdersPanel from '../../components/EMO/EMOOrdersPanel';
import EMOBusinessProfile from '../../components/EMO/EMOBusinessProfile';
import EMOFranchisePanel from '../../components/EMO/EMOFranchisePanel';
import EMOAdminNotice from '../../components/EMO/EMOAdminNotice';

interface Session {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
    role: string;
  };
}

interface EMOProps {
  session: Session;
  businessData: any; // TODO: Add proper type
  hasFranchise: boolean;
}

export default function EMODashboard({ session, businessData, hasFranchise }: EMOProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Business Dashboard</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Admin Notices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <EMOAdminNotice />
        </motion.div>

        {/* Overview Cards */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <EMOHomeCard businessData={businessData} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <EMOBusinessProfile businessData={businessData} />
          </motion.div>
        </div>

        {/* Services & Orders */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <EMOServiceList />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <EMOOrdersPanel />
          </motion.div>
        </div>

        {/* Franchise Panel (Conditional) */}
        {hasFranchise && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8"
          >
            <EMOFranchisePanel />
          </motion.div>
        )}
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  // TODO: Fetch business data from API
  const businessData = {
    name: 'Sample Business',
    sqlLevel: 2,
    services: 5,
    orders: 12,
    revenue: 1500,
  };

  // TODO: Check if user has franchise
  const hasFranchise = false;

  return {
    props: {
      session,
      businessData,
      hasFranchise,
    },
  };
};
