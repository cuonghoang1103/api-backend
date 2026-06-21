'use client';

import { motion } from 'framer-motion';
import type { HubLink } from '@/lib/api';
import HubLinkCard from './HubLinkCard';

interface HubLinkGridProps {
  links: HubLink[];
  onEdit: (link: HubLink) => void;
  onDelete: (id: number) => void;
  onStatusChange?: (id: number, status: string) => void;
}

export default function HubLinkGrid({ links, onEdit, onDelete, onStatusChange }: HubLinkGridProps) {
  return (
    <motion.ul
      layout
      className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
    >
      {links.map((link, i) => (
        <motion.li
          key={link.id}
          layout
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: Math.min(i, 8) * 0.02 }}
        >
          <HubLinkCard
            link={link}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        </motion.li>
      ))}
    </motion.ul>
  );
}
