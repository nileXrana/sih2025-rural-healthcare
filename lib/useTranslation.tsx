'use client';

import React from 'react';
import { useLanguage } from './LanguageContext';
import { getTranslation, getTranslationArray } from './translations';

export function useTranslation() {
  const { language } = useLanguage();

  const t = (key: string): string => {
    const translation = getTranslation(key, language);
    return Array.isArray(translation) ? translation[0] : translation;
  };

  const tArray = (key: string): string[] => {
    return getTranslationArray(key, language);
  };

  return { t, tArray, language };
}

// Translation component for inline usage
interface TransProps {
  k: string; // key
  fallback?: string;
}

export function Trans({ k, fallback }: TransProps): React.JSX.Element {
  const { t } = useTranslation();
  const translation = t(k);
  
  return <>{translation !== k ? translation : (fallback || k)}</>;
}

// Translation component for arrays
interface TransArrayProps {
  k: string; // key
  render: (items: string[]) => React.ReactNode;
}

export function TransArray({ k, render }: TransArrayProps): React.JSX.Element {
  const { tArray } = useTranslation();
  const translations = tArray(k);
  
  return <>{render(translations)}</>;
}