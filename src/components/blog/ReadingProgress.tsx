'use client';
import { useEffect, useState } from 'react';

export default function ReadingProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const el = document.documentElement;
    const onScroll = () => {
      const h = el.scrollHeight - el.clientHeight;
      setP(Math.min(100, Math.max(0, (el.scrollTop / h) * 100)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="fixed left-0 top-0 z-[60] h-1 w-full bg-transparent">
      <div className="h-full bg-blue-500 dark:bg-blue-400 transition-[width]" style={{ width: `${p}%` }} />
    </div>
  );
}
