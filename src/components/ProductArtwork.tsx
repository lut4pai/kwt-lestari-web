'use client';

import React, { useState } from 'react';
import { Coffee, Flame, Leaf, Sparkles, Wheat } from 'lucide-react';
import { Product } from '@/types';

interface ProductArtworkProps {
  product: Pick<Product, 'name' | 'category' | 'image_url'>;
  size?: 'card' | 'thumb' | 'modal';
}

export function ProductArtwork({ product, size = 'card' }: ProductArtworkProps) {
  const [imgError, setImgError] = useState(false);
  const hasValidImage = Boolean(product.image_url?.trim()) && !imgError;

  if (hasValidImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={product.image_url}
        alt={product.name}
        onError={() => setImgError(true)}
        loading="lazy"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
    );
  }

  // Pilih ikon ilustrasi alami sesuai nama/kategori produk (mengacu referensi Stitch)
  const lowerName = product.name.toLowerCase();
  const lowerCat = (product.category || '').toLowerCase();

  let IconComponent = Leaf;
  let accentClass = 'bg-stone-200/75 text-stone-600';

  if (lowerName.includes('sambal') || lowerName.includes('chili') || lowerCat.includes('sambal')) {
    IconComponent = Flame;
    accentClass = 'bg-amber-100/80 text-amber-800';
  } else if (lowerName.includes('singkong')) {
    IconComponent = Wheat;
    accentClass = 'bg-amber-50 text-earth-700 border border-amber-200/60';
  } else if (lowerName.includes('cokelat') || lowerName.includes('kopi')) {
    IconComponent = Coffee;
    accentClass = 'bg-stone-200/80 text-earth-800';
  } else if (lowerName.includes('cabe') || lowerName.includes('bubuk') || lowerCat.includes('bumbu')) {
    IconComponent = Sparkles;
    accentClass = 'bg-orange-100/75 text-orange-800';
  } else {
    IconComponent = Leaf;
    accentClass = 'bg-leaf-100/80 text-leaf-800';
  }

  if (size === 'thumb') {
    return (
      <div className="w-full h-full bg-cream-100 flex items-center justify-center">
        <IconComponent className="w-5 h-5 text-leaf-700" />
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-b from-stone-100/90 to-cream-100 flex flex-col items-center justify-center p-4 select-none">
      <div
        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-105 ${accentClass}`}
      >
        <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.75]" />
      </div>
      <span className="mt-2.5 text-[11px] font-medium text-stone-400 tracking-wide">
        Foto Olahan Asli
      </span>
    </div>
  );
}
