'use client';

import { motion } from 'framer-motion';
import type { HubLink } from '@/lib/api';
import HubLinkRow from './HubLinkRow';

interface HubLinkListProps {
  links: HubLink[];
  onEdit: (link: HubLink) => void;
  onDelete: (id: number) => void;
  onStatusChange?: (id: number, status: string) => void;
  onShare?: (link: HubLink) => void;
  onManageShares?: (link: HubLink) => void;
  // Sparse map from linkId → recipient count so the menu can
  // show "Quản lý chia sẻ (N)". Use a map rather than a per-link
  // prop so HubClient doesn't have to re-render every row when
  // a single share is revoked.
  sharedCounts?: Record<number, number>;
}

export default function HubLinkList({ links, onEdit, onDelete, onStatusChange, onShare, onManageShares, sharedCounts }: HubLinkListProps) {
  return (
    <motion.ul layout className="space-y-2">
      {links.map((link, i) => (
        <motion.li
          key={link.id}
          layout
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: Math.min(i, 8) * 0.015 }}
        >
          <HubLinkRow
            link={link}
            onEdit={onEdit}
            onDelete={onDelete}
            onShare={onShare}
            onManageShares={onManageShares}
            sharedCount={sharedCounts?.[link.id]}
          />
        </motion.li>
      ))}
    </motion.ul>
  );
}
