'use client';

import { motion } from 'framer-motion';
import { Zap, Brain, Gem, LucideIcon } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface BenefitCardProps {
  icon: LucideIcon;
  titleKey: string;
  descriptionKey: string;
  color: 'indigo' | 'violet' | 'fuchsia';
  delay?: number;
}

const colorStyles = {
  indigo: {
    bg: 'from-neon-indigo/10 to-neon-indigo/5',
    border: 'hover:border-neon-indigo/50',
    icon: 'text-neon-indigo',
    glow: 'group-hover:shadow-neon-indigo/20',
  },
  violet: {
    bg: 'from-neon-violet/10 to-neon-violet/5',
    border: 'hover:border-neon-violet/50',
    icon: 'text-neon-violet',
    glow: 'group-hover:shadow-neon-violet/20',
  },
  fuchsia: {
    bg: 'from-neon-fuchsia/10 to-neon-fuchsia/5',
    border: 'hover:border-neon-fuchsia/50',
    icon: 'text-neon-fuchsia',
    glow: 'group-hover:shadow-neon-fuchsia/20',
  },
};

function BenefitCard({ icon: Icon, titleKey, descriptionKey, color, delay = 0 }: BenefitCardProps) {
  const { t } = useTranslation();
  const styles = colorStyles[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`group relative p-6 bg-gradient-to-br ${styles.bg} rounded-2xl border border-darkborder/50 ${styles.border} transition-all duration-300 cursor-default ${styles.glow}`}
    >
      {/* Icon container */}
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${styles.bg} border border-current/${styles.icon === 'text-neon-indigo' ? 'neon-indigo/20' : styles.icon === 'text-neon-violet' ? 'neon-violet/20' : 'neon-fuchsia/20'} flex items-center justify-center mb-4 ${styles.icon} group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-7 h-7" strokeWidth={1.5} />
      </div>

      {/* Content */}
      <h3 className="text-lg font-heading font-bold text-text-primary mb-2 group-hover:text-white transition-colors">
        {t(titleKey)}
      </h3>
      <p className="text-sm text-text-secondary leading-relaxed">
        {t(descriptionKey)}
      </p>

      {/* Hover indicator */}
      <div className={`absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r ${styles.icon === 'text-neon-indigo' ? 'from-neon-indigo to-neon-violet' : styles.icon === 'text-neon-violet' ? 'from-neon-violet to-neon-fuchsia' : 'from-neon-fuchsia to-neon-indigo'} group-hover:w-full transition-all duration-500 rounded-full`} />
    </motion.div>
  );
}

// Pre-defined benefit cards data
export const benefits = [
  {
    icon: Zap,
    titleKey: 'benefits.fastDelivery.title',
    descriptionKey: 'benefits.fastDelivery.description',
    color: 'indigo' as const,
  },
  {
    icon: Brain,
    titleKey: 'benefits.aiPowered.title',
    descriptionKey: 'benefits.aiPowered.description',
    color: 'violet' as const,
  },
  {
    icon: Gem,
    titleKey: 'benefits.highQuality.title',
    descriptionKey: 'benefits.highQuality.description',
    color: 'fuchsia' as const,
  },
];

export default BenefitCard;
