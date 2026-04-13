import { motion } from 'framer-motion';
import { useI18n } from '../contexts/I18nContext';
import { Award, Heart, Users, ChefHat, MapPin, Phone } from 'lucide-react';

export default function About() {
  const { t } = useI18n();

  const values = [
    {
      icon: Award,
      title: t('about.authenticity'),
      description: t('about.authenticityText')
    },
    {
      icon: Heart,
      title: t('about.quality'),
      description: t('about.qualityText')
    },
    {
      icon: Users,
      title: t('about.community'),
      description: t('about.communityText')
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1920&q=80)',
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {t('about.title')}
            </h1>
            <p className="text-xl text-amber-400">{t('about.subtitle')}</p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img
                src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80"
                alt="Egyptian Food"
                className="rounded-2xl shadow-xl"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold">{t('about.title')}</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {t('about.story1')}
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {t('about.story2')}
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {t('about.story3')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-amber-50 dark:bg-amber-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <ChefHat className="w-16 h-16 text-amber-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">{t('about.mission')}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('about.missionText')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('about.values')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8 bg-background rounded-2xl shadow-lg"
              >
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team/Location Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Visit Us</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-gray-400">
                      Via Panfilo Castaldi 23<br />
                      Porta Venezia, Milan<br />
                      Italy
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="w-6 h-6 text-amber-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <a href="tel:+393924756960" className="text-gray-400 hover:text-amber-500">
                      +39 392 475 6960
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-80 bg-gray-800 rounded-2xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2796.7840375986!2d9.2046!3d45.4773!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4786c1493f1275e5%3A0x3c38e5f6c5e0e7b8!2sVia%20Panfilo%20Castaldi%2C%2023%2C%2020124%20Milano%20MI%2C%20Italy!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="koshari101 Location"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
