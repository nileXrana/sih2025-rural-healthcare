# Multi-Language Support Documentation

## Overview
The Healthcare Hub-and-Spoke System now supports three languages:
- **English** (🇺🇸) - Default language
- **Hindi** (🇮🇳) - हिंदी support for broader Indian audience
- **Punjabi** (🇮🇳) - ਪੰਜਾਬੀ support for Punjab region

## Implementation Details

### Core Components

#### 1. Translation System (`lib/translations.ts`)
- Contains all translations for the application
- Supports both string and array translations
- Type-safe with TypeScript interfaces

#### 2. Language Context (`lib/LanguageContext.tsx`)
- React Context for managing current language state
- Provides `LanguageProvider` and `useLanguage` hook
- Includes `LanguageSelector` dropdown component

#### 3. Translation Hooks (`lib/useTranslation.tsx`)
- `useTranslation()` - Hook for accessing translations in components
- `Trans` - Component for inline translations
- `TransArray` - Component for array-based translations

### Usage Examples

#### Basic Translation
```tsx
import { useTranslation } from '@/lib/useTranslation';

function MyComponent() {
  const { t } = useTranslation();
  
  return <h1>{t('heroTitle')}</h1>;
}
```

#### Array Translations
```tsx
import { useTranslation } from '@/lib/useTranslation';

function FeatureList() {
  const { tArray } = useTranslation();
  const features = tArray('miRoomFeatures');
  
  return (
    <ul>
      {features.map((feature, index) => (
        <li key={index}>{feature}</li>
      ))}
    </ul>
  );
}
```

#### Using Translation Components
```tsx
import { Trans, TransArray } from '@/lib/useTranslation';

function MyComponent() {
  return (
    <div>
      <h1><Trans k="heroTitle" /></h1>
      <TransArray 
        k="miRoomFeatures" 
        render={(features) => (
          <ul>
            {features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        )}
      />
    </div>
  );
}
```

### Adding New Translations

1. **Add to translations.ts**:
```typescript
export const translations: Translations = {
  // ... existing translations
  newKey: {
    en: "English text",
    hi: "हिंदी text",
    pa: "ਪੰਜਾਬੀ text"
  }
};
```

2. **Use in components**:
```tsx
const { t } = useTranslation();
return <p>{t('newKey')}</p>;
```

### Language Selector

The language selector is automatically included in the header and allows users to switch between:
- 🇺🇸 English
- 🇮🇳 हिंदी (Hindi)
- 🇮🇳 ਪੰਜਾਬੀ (Punjabi)

### Google Translate API Integration (Future)

The system is prepared for Google Translate API integration:

1. **Setup Environment Variables**:
```bash
GOOGLE_CLOUD_PROJECT_ID="your-project-id"
GOOGLE_CLOUD_KEY_FILE="path-to-service-account.json"
GOOGLE_TRANSLATE_API_KEY="your-api-key"
```

2. **API Endpoint**: `/api/translate`
   - Currently returns predefined translations
   - Can be extended with Google Translate API

### Supported Languages

| Language | Code | Native Name | Status |
|----------|------|-------------|---------|
| English | `en` | English | ✅ Complete |
| Hindi | `hi` | हिंदी | ✅ Complete |
| Punjabi | `pa` | ਪੰਜਾਬੀ | ✅ Complete |

### Translation Coverage

All major UI elements are translated:
- ✅ Navigation and headers
- ✅ Portal descriptions and features
- ✅ System benefits
- ✅ Village awareness messaging
- ✅ Call-to-action buttons
- ✅ Footer content

### Performance Considerations

- Translations are loaded at build time (no runtime API calls)
- Language switching is instant (client-side only)
- Small bundle size impact (~2KB for all translations)
- No external API dependencies for basic functionality

### Accessibility

- Language selector is keyboard accessible
- Screen reader friendly with proper ARIA labels
- RTL support can be added if needed for other languages

### Future Enhancements

1. **More Languages**: Easy to add Gujarati, Tamil, Telugu, etc.
2. **Google Translate Integration**: Dynamic translation for user content
3. **Persistent Language Preference**: Save user's language choice
4. **Regional Variations**: Support for different dialects
5. **Audio Translations**: Text-to-speech in local languages

## Testing

Test the translation feature by:
1. Starting the development server: `npm run dev`
2. Opening `http://localhost:3001`
3. Using the language selector in the header
4. Verifying all content switches to the selected language

The system maintains full functionality in all languages while providing culturally appropriate messaging for the rural healthcare context.