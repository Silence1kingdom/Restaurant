import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useI18n } from '../contexts/I18nContext';
import { useCart } from '../contexts/CartContext';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Cart() {
  const { t } = useI18n();
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    updateInstructions,
    subtotal, 
    deliveryFee, 
    tax, 
    total 
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold mb-4">{t('cart.empty')}</h2>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link to="/menu">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
                {t('cart.browseMenu')}
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">{t('cart.title')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-background p-6 rounded-xl shadow-md border"
              >
                <div className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name.en}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg">{item.name.en}</h3>
                      <span className="font-bold text-amber-600">
                        €{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">
                      €{item.price.toFixed(2)} each
                    </p>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        {t('cart.remove')}
                      </Button>
                    </div>

                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">
                        {t('cart.specialInstructions')}
                      </label>
                      <Input
                        placeholder={t('cart.addInstructions')}
                        value={item.specialInstructions || ''}
                        onChange={(e) => updateInstructions(item.id, e.target.value)}
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            <Link to="/menu">
              <Button variant="outline" className="w-full">
                {t('cart.continueShopping')}
              </Button>
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-background p-6 rounded-xl shadow-md border sticky top-24"
            >
              <h2 className="text-xl font-bold mb-6">{t('checkout.orderSummary')}</h2>
              
              <div className="space-y-3 mb-6">
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
                  <div className="flex justify-between text-lg font-bold">
                    <span>{t('cart.total')}</span>
                    <span className="text-amber-600">€{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Link to="/checkout">
                <Button className="w-full bg-amber-600 hover:bg-amber-700" size="lg">
                  {t('cart.checkout')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
