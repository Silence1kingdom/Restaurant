import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useI18n } from '../contexts/I18nContext';
import { CheckCircle, Package, Clock, MapPin, ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '../lib/api';

interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  estimatedDeliveryTime: string;
  total: number;
}

export default function OrderSuccess() {
  const { t } = useI18n();
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/orders/${orderId}`);
        setOrder(response.data.data.order);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Order not found</p>
          <Link to="/orders">
            <Button className="mt-4">View My Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          {/* Success Icon */}
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {t('order.success')}
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            {t('order.thankYou')}
          </p>

          {/* Order Details Card */}
          <div className="bg-background p-8 rounded-2xl shadow-lg border mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Package className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">{t('order.orderNumber')}</p>
                <p className="font-semibold">{order.orderNumber}</p>
              </div>
              <div className="text-center">
                <Clock className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">{t('order.estimatedDelivery')}</p>
                <p className="font-semibold">
                  {new Date(order.estimatedDeliveryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div className="text-center">
                <MapPin className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-semibold capitalize">{order.status}</p>
              </div>
            </div>

            <div className="border-t mt-6 pt-6">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Amount</span>
                <span className="text-2xl font-bold text-amber-600">
                  €{order.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={`/orders/${order._id}`}>
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
                {t('order.trackOrder')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/menu">
              <Button size="lg" variant="outline">
                <ShoppingBag className="w-5 h-5 mr-2" />
                {t('order.continueShopping')}
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
