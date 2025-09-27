import { Zap, Crown, BookOpen } from 'lucide-react'

export const plans = {
    FREE: {
      name: 'Free',
      icon: BookOpen,
      color: 'from-gray-400 to-gray-600',
      borderColor: 'border-gray-300',
      glowColor: 'shadow-gray-200',
      price: {  annual: 0 },
      description: 'Perfect for getting started',
      features: [
        'Access to basic study materials',
        '5 practice questions per day',
        'Basic progress tracking',
        'Community forum access'
      ],
      limitations: ['Limited practice questions', 'No personalized feedback', 'No tutor support']
    },
    BASIC: {
      name: 'Basic',
      icon: Zap,
      color: 'from-blue-500 to-purple-600',
      borderColor: 'border-blue-400',
      glowColor: 'shadow-blue-200',
      price: { annual: 290 },
      description: 'Everything you need to excel',
      popular: true,
      features: [
        'Unlimited practice questions',
        'Detailed explanations & solutions',
        'Advanced progress analytics',
        'Personalized study plans',
        'Video lessons library',
        'Priority email support'
      ],
      limitations: []
    },
    TUTORED: {
      name: 'Tutored',
      icon: Crown,
      color: 'from-amber-400 to-orange-500',
      borderColor: 'border-amber-400',
      glowColor: 'shadow-amber-200',
      price: { annual: 990 },
      description: 'Premium experience with personal tutor',
      premium: true,
      features: [
        'Everything in Basic',
        '1-on-1 tutor sessions (4 hours/month)',
        'Personalized tutor matching',
        'Real-time homework help',
        'Custom lesson plans',
        'Priority scheduling',
        'Direct tutor messaging',
        'Monthly progress reviews'
      ],
      limitations: []
    }
  };