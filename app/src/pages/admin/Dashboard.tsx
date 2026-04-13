import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Users, TrendingUp, DollarSign, Package } from 'lucide-react';
import api from '../../lib/api';

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  todayOrders: number;
  pendingOrders: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/orders/stats');
        setStats(response.data.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingBag,
      color: 'bg-blue-500',
      trend: '+12%'
    },
    {
      title: 'Total Revenue',
      value: `€${(stats?.totalRevenue || 0).toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-green-500',
      trend: '+8%'
    },
    {
      title: 'Avg Order Value',
      value: `€${(stats?.avgOrderValue || 0).toFixed(2)}`,
      icon: TrendingUp,
      color: 'bg-purple-500',
      trend: '+5%'
    },
    {
      title: 'Today\'s Orders',
      value: stats?.todayOrders || 0,
      icon: Package,
      color: 'bg-amber-500',
      trend: '+3'
    },
    {
      title: 'Pending Orders',
      value: stats?.pendingOrders || 0,
      icon: ShoppingBag,
      color: 'bg-red-500',
      trend: 'Needs attention'
    },
    {
      title: 'Total Customers',
      value: '245',
      icon: Users,
      color: 'bg-indigo-500',
      trend: '+15%'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-green-600 mt-2">{stat.trend}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-sm border"
        >
          <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                <div>
                  <p className="font-medium">K101-ABC123</p>
                  <p className="text-sm text-gray-500">2 items • €25.50</p>
                </div>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  Pending
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-sm border"
        >
          <h3 className="text-lg font-semibold mb-4">Popular Items</h3>
          <div className="space-y-4">
            {[
              { name: 'Classic Koshari', orders: 156 },
              { name: 'Spicy Koshari', orders: 89 },
              { name: 'Family Size', orders: 67 },
              { name: 'Koshari Bowl', orders: 45 },
              { name: 'Vegan Koshari', orders: 34 }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">{item.orders} orders</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
