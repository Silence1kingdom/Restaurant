import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useI18n } from '../contexts/I18nContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { CreditCard, Banknote, Truck, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import api from '../lib/api';

export default function Checkout() {
  const { t } = useI18n();
  const { user } = useAuth();
  const { items, subtotal, deliveryFee, tax, total, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderType, setOrderType] = useState('delivery');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address?.street || '',
    city: user?.address?.city || 'Milan',
    zipCode: user?.address?.zipCode || '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const orderData = {
        customerInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: {
            street: formData.address,
            city: formData.city,
            zipCode: formData.zipCode,
            country: 'Italy'
          }
        },
        items: items.map(item => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          specialInstructions: item.specialInstructions
        })),
        orderType,
        paymentMethod,
        notes: formData.notes
      };

      const response = await api.post('/orders', orderData);
      const { order } = response.data.data;

      // If card payment, handle Stripe
      if (paymentMethod === 'card') {
        await api.post('/payment/create-intent', { orderId: order._id });
        // Redirect to Stripe payment page or handle in-modal
        // For now, we'll just show success
      }

      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order-success/${order._id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">{t('checkout.title')}</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Delivery Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-background p-6 rounded-xl shadow-md border"
            >
              <h2 className="text-xl font-semibold mb-6">{t('checkout.deliveryInfo')}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('checkout.name')}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('checkout.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="phone">{t('checkout.phone')}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">{t('checkout.address')}</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required={orderType === 'delivery'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">{t('checkout.city')}</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">{t('checkout.zipCode')}</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  />
                </div>
              </div>
            </motion.div>

            {/* Order Type */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-background p-6 rounded-xl shadow-md border"
            >
              <h2 className="text-xl font-semibold mb-6">{t('checkout.orderType')}</h2>
              <RadioGroup value={orderType} onValueChange={setOrderType} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <RadioGroupItem value="delivery" id="delivery" className="peer sr-only" />
                  <Label
                    htmlFor="delivery"
                    className="flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer peer-data-[state=checked]:border-amber-600 peer-data-[state=checked]:bg-amber-50 hover:bg-gray-50"
                  >
                    <Truck className="w-8 h-8 mb-2 text-amber-600" />
                    <span className="font-medium">{t('checkout.delivery')}</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="pickup" id="pickup" className="peer sr-only" />
                  <Label
                    htmlFor="pickup"
                    className="flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer peer-data-[state=checked]:border-amber-600 peer-data-[state=checked]:bg-amber-50 hover:bg-gray-50"
                  >
                    <Store className="w-8 h-8 mb-2 text-amber-600" />
                    <span className="font-medium">{t('checkout.pickup')}</span>
                  </Label>
                </div>
              </RadioGroup>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-background p-6 rounded-xl shadow-md border"
            >
              <h2 className="text-xl font-semibold mb-6">{t('checkout.paymentMethod')}</h2>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                <div>
                  <RadioGroupItem value="card" id="card" className="peer sr-only" />
                  <Label
                    htmlFor="card"
                    className="flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer peer-data-[state=checked]:border-amber-600 peer-data-[state=checked]:bg-amber-50 hover:bg-gray-50"
                  >
                    <CreditCard className="w-6 h-6 text-amber-600" />
                    <div>
                      <span className="font-medium block">{t('checkout.card')}</span>
                      <span className="text-sm text-muted-foreground">Pay securely with credit card</span>
                    </div>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="cash" id="cash" className="peer sr-only" />
                  <Label
                    htmlFor="cash"
                    className="flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer peer-data-[state=checked]:border-amber-600 peer-data-[state=checked]:bg-amber-50 hover:bg-gray-50"
                  >
                    <Banknote className="w-6 h-6 text-amber-600" />
                    <div>
                      <span className="font-medium block">{t('checkout.cash')}</span>
                      <span className="text-sm text-muted-foreground">Pay when you receive your order</span>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </motion.div>

            {/* Order Notes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-background p-6 rounded-xl shadow-md border"
            >
              <Label htmlFor="notes" className="text-xl font-semibold mb-4 block">
                {t('checkout.notes')}
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any special requests?"
                rows={3}
              />
            </motion.div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-background p-6 rounded-xl shadow-md border sticky top-24"
            >
              <h2 className="text-xl font-bold mb-6">{t('checkout.orderSummary')}</h2>
              
              {/* Items */}
              <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.quantity}x {item.name.en}
                    </span>
                    <span>€{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-muted-foreground">
                  <span>{t('cart.subtotal')}</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>{t('cart.delivery')}</span>
                  <span>€{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>{t('cart.tax')}</span>
                  <span>€{tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-xl font-bold">
                    <span>{t('cart.total')}</span>
                    <span className="text-amber-600">€{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 mt-6"
                size="lg"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    {t('checkout.processing')}
                  </span>
                ) : (
                  t('checkout.placeOrder')
                )}
              </Button>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  );
}
