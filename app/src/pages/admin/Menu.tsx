import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
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
import api from '../../lib/api';

interface MenuItem {
  _id: string;
  name: { en: string; ar: string };
  description: { en: string; ar: string };
  price: number;
  category: string;
  image: string;
  isAvailable: boolean;
  isPopular: boolean;
  ratings: { average: number; count: number };
  ingredients?: { en: string; ar: string }[];
  dietary?: { vegetarian: boolean; vegan: boolean; glutenFree: boolean; spicy: boolean };
  calories?: number;
  preparationTime?: number;
}

const categories = ['koshari', 'appetizers', 'desserts', 'drinks', 'specials', 'combos'];

export default function AdminMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await api.get('/menu');
      setMenuItems(response.data.data.menuItems);
    } catch (error) {
      toast.error('Failed to load menu items');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await api.delete(`/menu/${id}`);
      toast.success('Item deleted successfully');
      fetchMenuItems();
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.en.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Menu Management</h2>
          <p className="text-gray-500">Manage your menu items</p>
        </div>
        <Button 
          onClick={() => { setEditingItem(null); setIsDialogOpen(true); }}
          className="bg-amber-600 hover:bg-amber-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Menu Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse bg-white rounded-xl h-80" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm border overflow-hidden"
            >
              <div className="relative h-48">
                <img
                  src={item.image}
                  alt={item.name.en}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => { setEditingItem(item); setIsDialogOpen(true); }}
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {!item.isAvailable && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-semibold">Unavailable</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">{item.name.en}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                  </div>
                  <span className="font-bold text-amber-600">€{item.price.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                  {item.description.en}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant={item.isAvailable ? 'default' : 'secondary'}>
                    {item.isAvailable ? 'Available' : 'Unavailable'}
                  </Badge>
                  {item.isPopular && (
                    <Badge className="bg-amber-100 text-amber-800">Popular</Badge>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
          </DialogHeader>
          <MenuItemForm 
            item={editingItem} 
            onSuccess={() => {
              setIsDialogOpen(false);
              fetchMenuItems();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Menu Item Form Component
function MenuItemForm({ item, onSuccess }: { item: MenuItem | null; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: { en: item?.name.en || '', ar: item?.name.ar || '' },
    description: { en: item?.description.en || '', ar: item?.description.ar || '' },
    price: item?.price || 0,
    category: item?.category || 'koshari',
    image: item?.image || '',
    isAvailable: item?.isAvailable ?? true,
    isPopular: item?.isPopular || false,
    ingredients: item?.ingredients || [],
    dietary: item?.dietary || { vegetarian: false, vegan: false, glutenFree: false, spicy: false },
    calories: item?.calories || 0,
    preparationTime: item?.preparationTime || 15
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (item) {
        await api.put(`/menu/${item._id}`, formData);
        toast.success('Item updated successfully');
      } else {
        await api.post('/menu', formData);
        toast.success('Item created successfully');
      }
      onSuccess();
    } catch (error) {
      toast.error('Failed to save item');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name (English)</label>
          <Input
            value={formData.name.en}
            onChange={(e) => setFormData({ ...formData, name: { ...formData.name, en: e.target.value } })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Name (Arabic)</label>
          <Input
            value={formData.name.ar}
            onChange={(e) => setFormData({ ...formData, name: { ...formData.name, ar: e.target.value } })}
            required
            dir="rtl"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Description (English)</label>
          <Input
            value={formData.description.en}
            onChange={(e) => setFormData({ ...formData, description: { ...formData.description, en: e.target.value } })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description (Arabic)</label>
          <Input
            value={formData.description.ar}
            onChange={(e) => setFormData({ ...formData, description: { ...formData.description, ar: e.target.value } })}
            required
            dir="rtl"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Price (€)</label>
          <Input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <Input
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.isAvailable}
            onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
          />
          Available
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.isPopular}
            onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
          />
          Popular
        </label>
      </div>

      <Button
        type="submit"
        className="w-full bg-amber-600 hover:bg-amber-700"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Saving...' : item ? 'Update Item' : 'Create Item'}
      </Button>
    </form>
  );
}
