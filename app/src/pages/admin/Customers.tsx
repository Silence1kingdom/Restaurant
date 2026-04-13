import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  address?: {
    street: string;
    city: string;
  };
  createdAt: string;
  orderCount?: number;
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      // This would be a real endpoint in production
      // For now, we'll use mock data
      setCustomers([
        {
          _id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+39 123 456 7890',
          role: 'customer',
          address: { street: 'Via Roma 1', city: 'Milan' },
          createdAt: '2024-01-15',
          orderCount: 5
        },
        {
          _id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+39 098 765 4321',
          role: 'customer',
          address: { street: 'Via Milano 2', city: 'Milan' },
          createdAt: '2024-02-20',
          orderCount: 3
        },
        {
          _id: '3',
          name: 'Ahmed Hassan',
          email: 'ahmed@example.com',
          phone: '+39 392 475 6960',
          role: 'admin',
          createdAt: '2024-01-01',
          orderCount: 0
        }
      ]);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Customer Management</h2>
        <p className="text-gray-500">View and manage your customers</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Search customers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-white rounded-xl h-64" />
          ))
        ) : filteredCustomers.map((customer, index) => (
          <motion.div
            key={customer._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-amber-600">
                  {customer.name.charAt(0)}
                </span>
              </div>
              <Badge className={customer.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}>
                {customer.role}
              </Badge>
            </div>

            <h3 className="font-semibold text-lg mb-1">{customer.name}</h3>
            
            <div className="space-y-2 mt-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                {customer.email}
              </div>
              {customer.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  {customer.phone}
                </div>
              )}
              {customer.address && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  {customer.address.street}, {customer.address.city}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                Joined {new Date(customer.createdAt).toLocaleDateString()}
              </div>
            </div>

            {customer.orderCount !== undefined && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Total Orders</span>
                  <span className="font-semibold">{customer.orderCount}</span>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
