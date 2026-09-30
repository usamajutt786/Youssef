import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Product } from '../../types';
import { FRAME_DEFINITIONS, FrameDefinition } from '../../assets/frames/framesData';
import { SAMPLE_FACES, SampleFace } from '../../assets/faces/sampleFaces';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useI18n } from '../../context/I18nContext';
import {
  Upload,
  RotateCcw,
  Download,
  Share2,
  ShoppingBag,
  Info,
  Trash2,
  Video,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Move,
  Check
} from 'lucide-react';

interface VirtualTryOnProps {
  initialProductId?: string;
  onClose?: () => void;
}

export const VirtualTryOnCanvas: React.FC<VirtualTryOnProps> = ({ initialProductId, onClose }) => {
  const { products, addToCart, incrementTryOnCount } = useMarketplace();
  const { t, lang, formatPrice } = useI18n();

  // Filter products that support 2D try-on
  const tryOnProducts = products.filter(p => p.tryOnAsset?.supported);

  // Active product state
  const [selectedProduct, setSelectedProduct] = useState<Product>(() => {
    if (initialProductId) {
      const match = tryOnProducts.find(p => p.id === initialProductId);
      if (match) return match;
    }
    return tryOnProducts[0] || products[0];
  });

  // Find corresponding frame definition
  const frameDef: FrameDefinition =
    FRAME_DEFINITIONS.find(f => f.id === selectedProduct.tryOnAsset?.frameSvgOrPng) ||
    FRAME_DEFINITIONS[0];

  // Active color variant
  const [selectedColorHex, setSelectedColorHex] = useState<string>(() => {
    return frameDef.colors[0]?.hex || '#000000';
  });

  // Face image: either custom uploaded (temporary object URL) or selected sample face
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string | null>(null);
  const [selectedSampleFace, setSelectedSampleFace] = useState<SampleFace>(SAMPLE_FACES[0]);

  // Frame placement state on canvas
  const [frameX, setFrameX] = useState<number>(300); // Center of 600px width
  const [frameY, setFrameY] = useState<number>(330); // ~44% of 750px height
  const [frameScale, setFrameScale] = useState<number>(1.0);
  const [frameRotation, setFrameRotation] = useState<number>(0); // in degrees

  // Dragging interaction state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Notifications / UI states
  const [cartFeedback, setCartFeedback] = useState(false);
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);
  const [shareSuccessNotice, setShareSuccessNotice] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Synchronize color when product changes
  useEffect(() => {
    if (frameDef && frameDef.colors.length > 0) {
      setSelectedColorHex(frameDef.colors[0].hex);
    }
    setFrameScale(selectedProduct.tryOnAsset?.defaultScale || 1.0);
    setFrameRotation(selectedProduct.tryOnAsset?.defaultRotation || 0);

    // Track try-on analytics
    incrementTryOnCount(selectedProduct.id);
  }, [selectedProduct.id]);

  // Clean up uploaded image object URL on unmount or reset
  useEffect(() => {
    return () => {
      if (customPhotoUrl) {
        URL.revokeObjectURL(customPhotoUrl);
      }
    };
  }, [customPhotoUrl]);

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 8MB) and type
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image valide (JPG, PNG, WebP).');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      alert('La taille de l\'image ne doit pas dépasser 8 Mo.');
      return;
    }

    if (customPhotoUrl) {
      URL.revokeObjectURL(customPhotoUrl);
    }

    const tempUrl = URL.createObjectURL(file);
    setCustomPhotoUrl(tempUrl);
  };

  const handleClearPhoto = () => {
    if (customPhotoUrl) {
      URL.revokeObjectURL(customPhotoUrl);
    }
    setCustomPhotoUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Reset placement to defaults
  const handleResetPlacement = () => {
    setFrameX(300);
    setFrameY(330);
    setFrameScale(selectedProduct.tryOnAsset?.defaultScale || 1.0);
    setFrameRotation(selectedProduct.tryOnAsset?.defaultRotation || 0);
  };

  // Render Canvas with Face + 2D Frame
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentFaceSrc = customPhotoUrl || selectedSampleFace.image;

    const faceImg = new Image();
    faceImg.crossOrigin = 'anonymous';
    faceImg.src = currentFaceSrc;

    faceImg.onload = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Face Image fitted to canvas
      ctx.drawImage(faceImg, 0, 0, canvas.width, canvas.height);

      // Prepare Frame SVG with selected color
      const selectedColor = frameDef.colors.find(c => c.hex === selectedColorHex) || frameDef.colors[0];
      const strokeCol = selectedColor?.strokeColor || '#B8860B';
      const frameSvg = frameDef.getSvg(strokeCol);
      const frameDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(frameSvg)}`;

      const frameImg = new Image();
      frameImg.src = frameDataUri;

      frameImg.onload = () => {
        ctx.save();

        // Translate to current frame position
        ctx.translate(frameX, frameY);
        // Rotate
        ctx.rotate((frameRotation * Math.PI) / 180);

        // Frame dimensions (base width: ~380px at scale 1.0)
        const baseWidth = 380 * frameScale;
        const baseHeight = (baseWidth * 180) / 500; // Aspect ratio of our SVG frames

        // Draw centered on (frameX, frameY)
        ctx.drawImage(frameImg, -baseWidth / 2, -baseHeight / 2, baseWidth, baseHeight);

        ctx.restore();
      };
    };
  }, [
    customPhotoUrl,
    selectedSampleFace,
    frameDef,
    selectedColorHex,
    frameX,
    frameY,
    frameScale,
    frameRotation
  ]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Dragging Mouse / Touch Handlers
  const handlePointerDown = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleFactorX = canvas.width / rect.width;
    const scaleFactorY = canvas.height / rect.height;

    const clickX = (clientX - rect.left) * scaleFactorX;
    const clickY = (clientY - rect.top) * scaleFactorY;

    setIsDragging(true);
    setDragStartPos({ x: clickX - frameX, y: clickY - frameY });
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleFactorX = canvas.width / rect.width;
    const scaleFactorY = canvas.height / rect.height;

    const currentX = (clientX - rect.left) * scaleFactorX;
    const currentY = (clientY - rect.top) * scaleFactorY;

    setFrameX(currentX - dragStartPos.x);
    setFrameY(currentY - dragStartPos.y);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Download Snapshot Artifact
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `optique-essayage-${selectedProduct.reference}.png`;
    link.href = dataUrl;
    link.click();
  };

  // Share Look with Native Share or Download Fallback
  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (navigator.share) {
      try {
        canvas.toBlob(async blob => {
          if (blob) {
            const file = new File([blob], `essayage-${selectedProduct.reference}.png`, { type: 'image/png' });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
              await navigator.share({
                title: `Mon essayage ${selectedProduct.name[lang] || selectedProduct.name.fr}`,
                text: `Regarde cette monture ${selectedProduct.name[lang] || selectedProduct.name.fr} sur Optique !`,
                files: [file]
              });
              return;
            }
          }
          // Text share fallback
          await navigator.share({
            title: selectedProduct.name[lang] || selectedProduct.name.fr,
            text: `Essayage virtuel de la monture ${selectedProduct.name[lang] || selectedProduct.name.fr}`,
            url: window.location.href
          });
        });
      } catch (err) {
        handleDownload();
      }
    } else {
      // Fallback: download directly
      handleDownload();
      setShareSuccessNotice(true);
      setTimeout(() => setShareSuccessNotice(false), 2500);
    }
  };

  // Add to Cart
  const handleAddToCart = () => {
    const variant = selectedProduct.variants[0];
    addToCart(selectedProduct, variant?.id, 1);
    setCartFeedback(true);
    setTimeout(() => setCartFeedback(false), 2000);
  };

  // Product Navigation
  const currentIndex = tryOnProducts.findIndex(p => p.id === selectedProduct.id);
  const handlePrevProduct = () => {
    const prevIdx = (currentIndex - 1 + tryOnProducts.length) % tryOnProducts.length;
    setSelectedProduct(tryOnProducts[prevIdx]);
  };
  const handleNextProduct = () => {
    const nextIdx = (currentIndex + 1) % tryOnProducts.length;
    setSelectedProduct(tryOnProducts[nextIdx]);
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl overflow-hidden max-w-6xl w-full mx-auto">
      {/* Top Header */}
      <div className="p-4 sm:px-6 sm:py-4 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-4 bg-neutral-50/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-neutral-900 tracking-tight">
              {t('tryOnTitle')}
            </h2>
            <span className="text-[11px] font-semibold text-neutral-600 bg-neutral-200/80 px-2 py-0.5 rounded">
              2D Studio
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            {t('tryOnSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Live Camera Roadmap Button */}
          <button
            onClick={() => setShowRoadmapModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-300 text-xs font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <Video className="w-3.5 h-3.5 text-neutral-500" />
            <span>Caméra Direct</span>
            <span className="text-[10px] text-amber-700 bg-amber-100 px-1 rounded">
              {t('liveCameraBadge')}
            </span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Studio Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        
        {/* Left / Center Canvas Area */}
        <div className="lg:col-span-7 bg-neutral-900 p-4 sm:p-6 flex flex-col items-center justify-center relative select-none">
          
          {/* Hint Overlay */}
          <div className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-md text-white text-[11px] px-3 py-1 rounded-full flex items-center gap-1.5">
            <Move className="w-3 h-3 text-amber-400" />
            <span>{t('dragHint')}</span>
          </div>

          {/* Interactive HTML5 Canvas */}
          <div className="relative rounded-xl overflow-hidden shadow-2xl border border-neutral-800 bg-neutral-950 flex items-center justify-center max-w-full">
            <canvas
              ref={canvasRef}
              width={600}
              height={750}
              onMouseDown={e => handlePointerDown(e.clientX, e.clientY)}
              onMouseMove={e => handlePointerMove(e.clientX, e.clientY)}
              onMouseUp={handlePointerUp}
              onMouseLeave={handlePointerUp}
              onTouchStart={e => {
                if (e.touches[0]) handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
              }}
              onTouchMove={e => {
                if (e.touches[0]) handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
              }}
              onTouchEnd={handlePointerUp}
              className="w-full max-h-[520px] object-contain cursor-grab active:cursor-grabbing touch-none"
            />
          </div>

          {/* Canvas Bottom Action Bar */}
          <div className="flex items-center flex-wrap justify-center gap-2 mt-4 z-10">
            <button
              onClick={handleResetPlacement}
              className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('resetPosition')}</span>
            </button>

            <button
              onClick={handleDownload}
              className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t('downloadSnapshot')}</span>
            </button>

            <button
              onClick={handleShare}
              className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{t('shareLook')}</span>
            </button>

            {customPhotoUrl && (
              <button
                onClick={handleClearPhoto}
                className="bg-red-950/80 hover:bg-red-900 text-red-200 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t('clearPhoto')}</span>
              </button>
            )}
          </div>

          {shareSuccessNotice && (
            <div className="mt-2 text-xs text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded">
              Image téléchargée sur votre appareil !
            </div>
          )}
        </div>

        {/* Right Controls Panel */}
        <div className="lg:col-span-5 p-5 sm:p-6 flex flex-col justify-between overflow-y-auto max-h-[640px] space-y-6">
          
          {/* Active Product Showcase */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                  {selectedProduct.brandName}
                </span>
                <h3 className="text-base font-bold text-neutral-900 leading-snug">
                  {selectedProduct.name[lang] || selectedProduct.name.fr}
                </h3>
                <span className="text-sm font-semibold text-neutral-900 tabular-nums">
                  {formatPrice(selectedProduct.promotionalPrice || selectedProduct.price)}
                </span>
              </div>

              {/* Prev / Next Frame Switchers */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevProduct}
                  className="p-1.5 rounded-md border border-neutral-200 hover:bg-neutral-100 text-neutral-600"
                  title="Monture précédente"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextProduct}
                  className="p-1.5 rounded-md border border-neutral-200 hover:bg-neutral-100 text-neutral-600"
                  title="Monture suivante"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Frame Color Selection */}
            <div>
              <label className="text-xs font-medium text-neutral-700 block mb-2">
                {t('selectColor')}
              </label>
              <div className="flex items-center gap-2">
                {frameDef.colors.map(col => (
                  <button
                    key={col.id}
                    onClick={() => setSelectedColorHex(col.hex)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-all ${
                      selectedColorHex === col.hex
                        ? 'border-neutral-900 bg-neutral-50 font-semibold'
                        : 'border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-neutral-300"
                      style={{ backgroundColor: col.hex }}
                    />
                    <span>{col.name[lang] || col.name.fr}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Fine Tuning Controls (Scale & Rotation) */}
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200/80 space-y-3">
              <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wide">
                {t('adjustControls')}
              </h4>

              {/* Scale Slider */}
              <div>
                <div className="flex justify-between text-xs text-neutral-600 mb-1">
                  <span>{t('scale')}</span>
                  <span className="tabular-nums font-mono">{(frameScale * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.6"
                  max="1.5"
                  step="0.02"
                  value={frameScale}
                  onChange={e => setFrameScale(parseFloat(e.target.value))}
                  className="w-full accent-neutral-900"
                />
              </div>

              {/* Rotation Slider */}
              <div>
                <div className="flex justify-between text-xs text-neutral-600 mb-1">
                  <span>{t('rotate')}</span>
                  <span className="tabular-nums font-mono">{frameRotation}°</span>
                </div>
                <input
                  type="range"
                  min="-25"
                  max="25"
                  step="1"
                  value={frameRotation}
                  onChange={e => setFrameRotation(parseInt(e.target.value))}
                  className="w-full accent-neutral-900"
                />
              </div>
            </div>

            {/* Face Source Selection (Upload OR Sample Face) */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-neutral-700 block">
                {t('uploadPhoto')}
              </label>

              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="tryon-file-input"
                />
                <label
                  htmlFor="tryon-file-input"
                  className="flex-1 border-2 border-dashed border-neutral-300 hover:border-neutral-900 rounded-lg p-2.5 text-center cursor-pointer transition-colors flex items-center justify-center gap-2 text-xs font-medium text-neutral-700"
                >
                  <Upload className="w-4 h-4 text-neutral-500" />
                  <span>{customPhotoUrl ? 'Changer ma photo' : t('uploadPhoto')}</span>
                </label>
              </div>

              {/* Preset Sample Faces */}
              <div className="pt-1">
                <span className="text-[11px] text-neutral-500 block mb-1.5">
                  {t('sampleFaces')}
                </span>
                <div className="flex items-center gap-2">
                  {SAMPLE_FACES.map(face => (
                    <button
                      key={face.id}
                      onClick={() => {
                        setSelectedSampleFace(face);
                        setCustomPhotoUrl(null);
                      }}
                      className={`flex-1 py-1.5 px-2 rounded-lg border text-xs font-medium transition-all ${
                        !customPhotoUrl && selectedSampleFace.id === face.id
                          ? 'border-neutral-900 bg-neutral-900 text-white'
                          : 'border-neutral-200 text-neutral-700 hover:border-neutral-400 bg-white'
                      }`}
                    >
                      {face.name[lang] || face.name.fr}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Privacy Consent Notice */}
            <div className="flex items-start gap-2 bg-neutral-50 p-2.5 rounded-lg border border-neutral-200 text-[11px] text-neutral-500 leading-relaxed">
              <Info className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
              <span>{t('privacyConsent')}</span>
            </div>
          </div>

          {/* Bottom Buy Action */}
          <div className="pt-4 border-t border-neutral-100 flex items-center gap-3">
            <button
              onClick={handleAddToCart}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm ${
                cartFeedback
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-900 text-white hover:bg-neutral-800'
              }`}
            >
              {cartFeedback ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Ajouté au panier !</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>{t('addToCart')} ({formatPrice(selectedProduct.promotionalPrice || selectedProduct.price)})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Live Camera Roadmap Modal */}
      {showRoadmapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl border border-neutral-200">
            <div className="flex items-center gap-2 mb-3">
              <Video className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-bold text-neutral-900">{t('liveCameraTitle')}</h3>
            </div>
            <p className="text-sm text-neutral-600 leading-relaxed mb-4">
              {t('liveCameraDesc')}
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 mb-5">
              <strong>Spécification client :</strong> Le flux vidéo en direct avec calcul de points de repère 3D sera développé lors d'une phase ultérieure. Le studio actuel 2D fonctionne sur toute photo sans nécessiter d'accès matériel ou de serveur distant.
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowRoadmapModal(false)}
                className="px-4 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition-colors"
              >
                Compris
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
