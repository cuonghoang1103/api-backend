'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { ArrowUpRight, Layers3, Monitor, Smartphone, Terminal } from 'lucide-react';
import { PRODUCTS } from './content';
import s from './showroom.module.css';

/** Architectural exhibit, not a fabricated screenshot of a shipped interface. */
export default function ProductStage({ lang }: { lang: 'vi' | 'en' }) {
  const [selected, setSelected] = useState(0);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(x, { stiffness: 100, damping: 24 });
  const rotateY = useSpring(y, { stiffness: 100, damping: 24 });
  const p = PRODUCTS[selected];
  const bi = (value: readonly [string, string]) => value[lang === 'vi' ? 0 : 1];
  const L = (vi: string, en: string) => lang === 'vi' ? vi : en;
  return (
    <div className={s.exhibit} onPointerMove={(e) => {
      if (reduced || e.pointerType !== 'mouse' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
      const rect = e.currentTarget.getBoundingClientRect();
      x.set(-((e.clientY - rect.top) / rect.height - .5) * 5);
      y.set(((e.clientX - rect.left) / rect.width - .5) * 7);
    }} onPointerLeave={() => { x.set(0); y.set(0); }}>
      <div className={s.exhibitTop}><span>CUONGHOANG / SYSTEMS</span><span>0{selected + 1}</span></div>
      <div className={s.space} aria-hidden="true">
        <div className={s.orbit} />
        <motion.div className={s.assembly} style={reduced ? undefined : { rotateX, rotateY }}>
          <div className={`${s.plane} ${s.planeBack}`}><Layers3 size={22} /><span>DATA & STORAGE</span><small>PostgreSQL · R2</small></div>
          <div className={`${s.plane} ${s.planeMiddle}`}><Terminal size={22} /><span>APPLICATION API</span><small>Express · TypeScript</small></div>
          <div className={`${s.plane} ${s.planeFront}`}><div className={s.platforms}><Monitor /><Terminal /><Smartphone /></div><strong>{L('Một hệ thống.', 'One system.')}<br />{L('Muôn vàn khả năng.', 'Many possibilities.')}</strong><small>WEB / DESKTOP / iOS</small></div>
        </motion.div>
      </div>
      <p className={s.artCaption}>{L('Sơ đồ kiến trúc hệ sinh thái cuongthai.com', 'Architecture of the cuongthai.com ecosystem')}</p>
      <div className={s.selector} role="group" aria-label={L('Chọn sản phẩm', 'Choose a product')}>
        {PRODUCTS.map((product, i) => <button key={product.id} type="button" aria-pressed={i === selected} onClick={() => setSelected(i)}>{product.name}</button>)}
      </div>
      <div className={s.productInfo} aria-live="polite" aria-atomic="true">
        <p className={s.productKind}>{bi(p.kind)}</p><h2>{p.name}</h2><p>{bi(p.what)}</p>
        {p.href && <Link href={p.href}>{L('Khám phá sản phẩm', 'Explore product')}<ArrowUpRight size={16} aria-hidden="true" /></Link>}
      </div>
    </div>
  );
}
