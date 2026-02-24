import { useEffect } from 'react';
import { SajdaFeatures } from '../components/SajdaFeatures';

export function SajdaPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-20">
      <SajdaFeatures />
    </div>
  );
}
