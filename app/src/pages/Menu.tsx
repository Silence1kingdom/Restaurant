import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '../contexts/I18nContext';
import { useCart } from '../contexts/CartContext';
import { Search, Plus, Minus, Leaf, Flame, Wheat, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import api from '../lib/api';

interface MenuItem {
  _id: string;
  name: { en: string; ar: string };
  description: { en: string; ar: string };
  price: number;
  image: string;
  category: string;
  ingredients: { en: string; ar: string }[];
  dietary: {
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
    spicy: boolean;
  };
  isAvailable: boolean;
  isPopular: boolean;
  calories: number;
  preparationTime: number;
  ratings: { average: number; count: number };
}

const categories = [
  { id: 'all', name: { en: 'All', ar: 'الكل' } },
  { id: 'koshari', name: { en: 'Koshari', ar: 'كشري' } },
  { id: 'appetizers', name: { en: 'Appetizers', ar: 'مقبلات' } },
  { id: 'desserts', name: { en: 'Desserts', ar: 'حلويات' } },
  { id: 'drinks', name: { en: 'Drinks', ar: 'مشروبات' } },
  { id: 'specials', name: { en: 'Specials', ar: 'أطباق خاصة' } },
];

export default function Menu() {
  const { t, language } = useI18n();
  const { addItem } = useCart();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [selectedCategory, searchQuery, menuItems]);

  const fetchMenuItems = async () => {
    try {
      const response = await api.get('/menu');
      setMenuItems(response.data.data.menuItems);
    } catch (error) {
      toast.error('Failed to load menu');
    } finally {
      setIsLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = menuItems;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.name[language].toLowerCase().includes(query) ||
        item.description[language].toLowerCase().includes(query)
      );
    }

    setFilteredItems(filtered);
  };

  const handleAddToCart = () => {
    if (!selectedItem) return;

    addItem({
      menuItemId: selectedItem._id,
      name: selectedItem.name,
      price: selectedItem.price,
      quantity,
      image: selectedItem.image,
      specialInstructions
    });

    setSelectedItem(null);
    setQuantity(1);
    setSpecialInstructions('');
  };

  const openItemDetails = (item: MenuItem) => {
    setSelectedItem(item);
    setQuantity(1);
    setSpecialInstructions('');
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('menu.title')}</h1>
          <p className="text-muted-foreground text-lg">{t('menu.subtitle')}</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t('menu.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
                className={selectedCategory === cat.id ? 'bg-amber-600 hover:bg-amber-700' : ''}
              >
                {cat.name[language]}
              </Button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-xl" />
                <div className="p-4 bg-gray-100 rounded-b-xl space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">{t('menu.noResults')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-background rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => openItemDetails(item)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name[language]}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {item.isPopular && (
                      <Badge className="absolute top-2 left-2 bg-amber-600">
                        {t('menu.popular')}
                      </Badge>
                    )}
                    {!item.isAvailable && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white font-semibold">Unavailable</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                      {item.dietary.vegetarian && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          <Leaf className="w-3 h-3 mr-1" />
                          {t('menu.vegetarian')}
                        </Badge>
                      )}
                      {item.dietary.spicy && (
                        <Badge variant="secondary" className="bg-red-100 text-red-700">
                          <Flame className="w-3 h-3 mr-1" />
                          {t('menu.spicy')}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg">{item.name[language]}</h3>
                      <span className="font-bold text-amber-600">
                        €{item.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                      {item.description[language]}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{item.calories} kcal</span>
                      <span>{item.preparationTime} {t('menu.minutes')}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Item Detail Dialog */}
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedItem && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl">{selectedItem.name[language]}</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.name[language]}
                    className="w-full h-64 object-cover rounded-xl"
                  />

                  <div className="flex flex-wrap gap-2">
                    {selectedItem.dietary.vegetarian && (
                      <Badge className="bg-green-100 text-green-700">
                        <Leaf className="w-3 h-3 mr-1" />
                        {t('menu.vegetarian')}
                      </Badge>
                    )}
                    {selectedItem.dietary.vegan && (
                      <Badge className="bg-green-100 text-green-700">
                        <Leaf className="w-3 h-3 mr-1" />
                        {t('menu.vegan')}
                      </Badge>
                    )}
                    {selectedItem.dietary.glutenFree && (
                      <Badge className="bg-blue-100 text-blue-700">
                        <Wheat className="w-3 h-3 mr-1" />
                        {t('menu.glutenFree')}
                      </Badge>
                    )}
                    {selectedItem.dietary.spicy && (
                      <Badge className="bg-red-100 text-red-700">
                        <Flame className="w-3 h-3 mr-1" />
                        {t('menu.spicy')}
                      </Badge>
                    )}
                  </div>

                  <p className="text-muted-foreground">
                    {selectedItem.description[language]}
                  </p>

                  <div>
                    <h4 className="font-semibold mb-2">{t('menu.ingredients')}</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.ingredients.map((ing, idx) => (
                        <Badge key={idx} variant="outline">
                          {ing[language]}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <span>{selectedItem.calories} kcal</span>
                    <span>{selectedItem.preparationTime} {t('menu.minutes')}</span>
                  </div>

                  <div className="border-t pt-6">
                    <label className="block text-sm font-medium mb-2">
                      {t('cart.specialInstructions')}
                    </label>
                    <Input
                      placeholder={t('cart.addInstructions')}
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-amber-600">
                        €{(selectedItem.price * quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    className="w-full bg-amber-600 hover:bg-amber-700"
                    size="lg"
                  >
                    {t('menu.addToCart')}
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
