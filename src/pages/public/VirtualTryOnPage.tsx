import React from 'react';
import { VirtualTryOnCanvas } from '../../components/tryon/VirtualTryOnCanvas';
import { useRouter } from '../../context/RouterContext';

export const VirtualTryOnPage: React.FC = () => {
  const { navigate } = useRouter();

  // Check URL param if opened with specific product
  const params = new URLSearchParams(window.location.search);
  const initialProductId = params.get('productId') || undefined;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <VirtualTryOnCanvas
        initialProductId={initialProductId}
        onClose={() => navigate('/catalog')}
      />
    </div>
  );
};
