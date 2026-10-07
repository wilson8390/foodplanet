import React, { useState } from 'react';
import defaultLogoSvg from '../assets/images/FOOD_PLANET_logo.svg';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'giant';
  showSubtitle?: boolean;
  variant?: 'light' | 'dark';
}

export const FoodPlanetLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
  variant = 'dark',
}) => {
  const [customLogo, setCustomLogo] = useState<string | null>(() => {
    try {
      return localStorage.getItem('food_planet_custom_logo') || null;
    } catch {
      return null;
    }
  });

  const dimensions = {
    sm: { w: '110px', maxH: '48px' },
    md: { w: '170px', maxH: '72px' },
    lg: { w: '260px', maxH: '120px' },
    xl: { w: '340px', maxH: '160px' },
    giant: { w: '440px', maxH: '210px' },
  }[size];

  // Exact logo source uploaded by user: FOOD_PLANET_logo.svg
  const logoSrc = customLogo || defaultLogoSvg || '/FOOD_PLANET_logo.svg';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setCustomLogo(result);
          try {
            localStorage.setItem('food_planet_custom_logo', result);
          } catch (err) {
            console.error('Failed to save logo to localStorage:', err);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`relative group inline-flex flex-col items-center justify-center select-none ${className}`}>
      <img
        src={logoSrc}
        alt="Food Planet - Milanesas, Sándwiches, Pollo, Parrilla"
        style={{
          width: dimensions.w,
          maxHeight: dimensions.maxH,
          objectFit: 'contain',
        }}
        className="w-auto h-auto drop-shadow-md transition-all duration-200 group-hover:scale-[1.02]"
        onError={(e) => {
          const target = e.currentTarget;
          if (target.src.includes('FOOD_PLANET_logo.svg')) {
            target.src = '/logo.svg';
          } else if (target.src.includes('logo.svg')) {
            target.src = '/logo.png';
          }
        }}
      />

      {/* Hidden file input for uploading direct image if user wants to swap files */}
      <input
        type="file"
        id="logo-file-input"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
