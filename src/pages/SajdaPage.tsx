import { useEffect } from 'react';
import { SajdaFeatures } from '../components/SajdaFeatures';

export function SajdaPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Sajda — Islamic Prayer Times for macOS & Windows | builtby.';
    return () => {
      document.title = 'Apps Built By Hafiz Hanif, PhD';
    };
  }, []);

  return (
    <div className="pt-20">
      <SajdaFeatures />
    </div>
  );
}
