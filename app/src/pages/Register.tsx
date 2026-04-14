import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useI18n } from '../contexts/I18nContext';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, User, Phone, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export default function Register() {
  const { t } = useI18n();
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t('auth.nameRequired') || 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = t('auth.nameTooShort') || 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = t('auth.emailRequired') || 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('auth.invalidEmail') || 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = t('auth.passwordRequired') || 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = t('auth.passwordTooShort') || 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.passwordsDontMatch') || 'Passwords do not match';
    }

    if (!agreeTerms) {
      newErrors.terms = t('auth.mustAgreeTerms') || 'You must agree to the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await register(formData.name, formData.email, formData.password, formData.phone);
      navigate('/');
    } catch (error: any) {
      console.error('Registration failed:', error);
      if (error.response?.data?.message?.includes('email')) {
        setErrors(prev => ({ ...prev, email: t('auth.emailExists') || 'Email already exists' }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background p-8 rounded-2xl shadow-lg border"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-amber-600">K</span>
            </div>
            <h1 className="text-2xl font-bold">{t('auth.registerTitle')}</h1>
            <p className="text-muted-foreground mt-2">{t('auth.registerSubtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('auth.name')}</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="John Doe"
                  className={`pl-10 ${errors.name ? 'border-red-500' : ''}`}
                  required
                  disabled={isLoading}
                />
              </div>
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="your@email.com"
                  className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  required
                  disabled={isLoading}
                />
              </div>
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{t('auth.phone')}</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="+39 392 475 6960"
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  placeholder="••••••••"
                  className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => updateField('confirmPassword', e.target.value)}
                  placeholder="••••••••"
                  className={`pl-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  required
                  disabled={isLoading}
                />
              </div>
              {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={agreeTerms}
                onCheckedChange={(checked) => {
                  setAgreeTerms(checked as boolean);
                  if (checked) setErrors(prev => ({ ...prev, terms: '' }));
                }}
                disabled={isLoading}
              />
              <Label htmlFor="terms" className="text-sm font-normal leading-tight cursor-pointer">
                {t('auth.agreeToTerms') || 'I agree to the'}{' '}
                <Link to="/terms" className="text-amber-600 hover:underline">
                  {t('auth.terms') || 'Terms of Service'}
                </Link>{' '}
                {t('auth.and') || 'and'}{' '}
                <Link to="/privacy" className="text-amber-600 hover:underline">
                  {t('auth.privacy') || 'Privacy Policy'}
                </Link>
              </Label>
            </div>
            {errors.terms && <p className="text-sm text-red-500">{errors.terms}</p>}

            <Button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t('auth.creatingAccount') || 'Creating account...'}
                </span>
              ) : (
                t('auth.signUp')
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              {t('auth.hasAccount')}{' '}
              <Link to="/login" className="text-amber-600 hover:underline font-medium">
                {t('auth.signIn')}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
