import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useI18n } from '../contexts/I18nContext';
import { ArrowRight, ChefHat, Clock, Leaf, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '../lib/api';

interface MenuItem {
  _id: string;
  name: { en: string; ar: string };
  description: { en: string; ar: string };
  price: number;
  image: string;
  isPopular: boolean;
  ratings: { average: number; count: number };
}

interface Review {
  _id: string;
  customerName: string;
  rating: number;
  comment: string;
}

export default function Home() {
  const { t, language } = useI18n();
  const [popularItems, setPopularItems] = useState<MenuItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuRes, reviewsRes] = await Promise.all([
          api.get('/menu/popular'),
          api.get('/reviews?limit=3')
        ]);
        setPopularItems(menuRes.data.data.popularItems);
        setReviews(reviewsRes.data.data.reviews);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const features = [
    {
      icon: ChefHat,
      title: t('home.authentic'),
      description: t('home.authenticDesc')
    },
    {
      icon: Leaf,
      title: t('home.fresh'),
      description: t('home.freshDesc')
    },
    {
      icon: Clock,
      title: t('home.fast'),
      description: t('home.fastDesc')
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: 'url(https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=1920&q=80)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        </div>

        {/* Content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-white"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600/90 rounded-full text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              Authentic Egyptian Cuisine
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-amber-400 font-semibold mb-4">
              {t('hero.subtitle')}
            </p>
            <p className="text-lg text-gray-300 mb-8 max-w-xl">
              {t('hero.description')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/menu">
                <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-8">
                  {t('hero.cta')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/menu">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                  {t('hero.secondaryCta')}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center text-center p-6 bg-background rounded-2xl shadow-sm"
              >
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                  <feature.icon className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Dishes Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('home.popularTitle')}</h2>
            <p className="text-muted-foreground text-lg">{t('home.popularSubtitle')}</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-64 bg-gray-200 rounded-t-2xl" />
                  <div className="p-6 bg-gray-100 rounded-b-2xl space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {popularItems.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-background rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name[language]}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {item.isPopular && (
                      <div className="absolute top-4 left-4 px-3 py-1 bg-amber-600 text-white text-sm font-medium rounded-full">
                        {t('menu.popular')}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold">{item.name[language]}</h3>
                      <span className="text-lg font-bold text-amber-600">
                        €{item.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {item.description[language]}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium">{item.ratings.average}</span>
                        <span className="text-sm text-muted-foreground">({item.ratings.count})</span>
                      </div>
                      <Link to={`/menu`}>
                        <Button variant="outline" size="sm">
                          {t('menu.addToCart')}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/menu">
              <Button variant="outline" size="lg">
                {t('home.viewAll')} {t('nav.menu')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-amber-50 dark:bg-amber-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('home.testimonials')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-background p-8 rounded-2xl shadow-lg"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < review.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6">"{review.comment}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <span className="text-amber-600 font-semibold">
                      {review.customerName.charAt(0)}
                    </span>
                  </div>
                  <span className="font-medium">{review.customerName}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-amber-600 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/food.png')] opacity-10" />
            <div className="relative px-8 py-16 md:px-16 md:py-20 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Taste Egypt?
              </h2>
              <p className="text-amber-100 text-lg mb-8 max-w-2xl mx-auto">
                Order now and experience the authentic flavors of Egyptian street food delivered to your doorstep.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/menu">
                  <Button size="lg" variant="secondary" className="px-8">
                    {t('hero.cta')}
                  </Button>
                </Link>
                <a 
                  href="https://wa.me/393924756960"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                    {t('contact.whatsapp')}
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
