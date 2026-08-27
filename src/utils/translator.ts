import type { CanvasItem } from '@/store/useEditorStore';
import { SUPPORTED_LANGUAGES } from '@/config/languages';
import FileSaver from 'file-saver';

const saveAs = (FileSaver as { saveAs?: (blob: Blob, name: string) => void })?.saveAs || (FileSaver as unknown as (blob: Blob, name: string) => void);

// Built-in offline dictionary for common App Store / showcase keywords
const OFFLINE_DICTIONARY: Record<string, Record<string, string>> = {
  es: {
    'Amazing Features': 'Funciones Increíbles',
    'Discover what makes our app great': 'Descubre lo que hace genial a nuestra aplicación',
    'New Feature': 'Nueva Función',
    'Describe it here': 'Descríbela aquí',
    'Track Your Progress': 'Sigue Tu Progreso',
    'Stay organized and productive': 'Mantente organizado y productivo',
    'Smart Analytics': 'Analíticas Inteligentes',
    'Powerful insights at your fingertips': 'Información clave al alcance de tu mano',
    'Fast & Secure': 'Rápido y Seguro',
    'Your data is always encrypted and protected': 'Tus datos siempre protegidos y cifrados',
    'All-in-One Hub': 'Todo en Uno',
    'Seamless Integration': 'Integración Total',
    'Dark Mode Support': 'Modo Oscuro',
    'Top Rated Experience': 'La Mejor Experiencia',
  },
  pt: {
    'Amazing Features': 'Recursos Incríveis',
    'Discover what makes our app great': 'Descubra o que torna nosso app excelente',
    'New Feature': 'Novo Recurso',
    'Describe it here': 'Descreva-o aqui',
    'Track Your Progress': 'Acompanhe Seu Progresso',
    'Stay organized and productive': 'Mantenha-se organizado e produtivo',
    'Smart Analytics': 'Análises Inteligentes',
    'Powerful insights at your fingertips': 'Insights poderosos na ponta dos seus dedos',
    'Fast & Secure': 'Rápido e Seguro',
    'Your data is always encrypted and protected': 'Seus dados sempre protegidos e criptografados',
    'All-in-One Hub': 'Tudo em Um Só Lugar',
    'Seamless Integration': 'Integração Perfeita',
    'Dark Mode Support': 'Suporte a Modo Escuro',
    'Top Rated Experience': 'Experiência Nº 1',
  },
  fr: {
    'Amazing Features': 'Fonctionnalités Uniques',
    'Discover what makes our app great': 'Découvrez ce qui rend notre application exceptionnelle',
    'New Feature': 'Nouvelle Fonctionnalité',
    'Describe it here': 'Décrivez-la ici',
    'Track Your Progress': 'Suivez Vos Progrès',
    'Stay organized and productive': 'Restez organisé et productif',
    'Smart Analytics': 'Statistiques Intelligentes',
    'Powerful insights at your fingertips': 'Des analyses précises à portée de main',
    'Fast & Secure': 'Rapide et Sécurisé',
    'Your data is always encrypted and protected': 'Vos données restent protégées et chiffrées',
    'All-in-One Hub': 'Solution Tout-en-Un',
    'Seamless Integration': 'Intégration Fluide',
    'Dark Mode Support': 'Mode Sombre',
    'Top Rated Experience': 'Expérience Haut de Gamme',
  },
  de: {
    'Amazing Features': 'Tolle Funktionen',
    'Discover what makes our app great': 'Entdecken Sie die Vorteile unserer App',
    'New Feature': 'Neue Funktion',
    'Describe it here': 'Hier beschreiben',
    'Track Your Progress': 'Fortschritt Verfolgen',
    'Stay organized and productive': 'Organisiert und produktiv bleiben',
    'Smart Analytics': 'Intelligente Analysen',
    'Powerful insights at your fingertips': 'Wichtige Einblicke auf einen Blick',
    'Fast & Secure': 'Schnell und Sicher',
    'Your data is always encrypted and protected': 'Ihre Daten sind sicher verschlüsselt',
    'All-in-One Hub': 'Alles an einem Ort',
    'Seamless Integration': 'Nahtlose Integration',
    'Dark Mode Support': 'Dunkelmodus',
    'Top Rated Experience': 'Erstklassige Erfahrung',
  },
  it: {
    'Amazing Features': 'Funzionalità Straordinarie',
    'Discover what makes our app great': 'Scopri cosa rende speciale la nostra app',
    'New Feature': 'Nuova Funzionalità',
    'Describe it here': 'Descrivila qui',
    'Track Your Progress': 'Monitora i Tuoi Progressi',
    'Stay organized and productive': 'Rimani organizzato e produttivo',
    'Smart Analytics': 'Analitiche Intelligenti',
    'Powerful insights at your fingertips': 'Dati preziosi a portata di mano',
    'Fast & Secure': 'Veloce e Sicuro',
    'Your data is always encrypted and protected': 'I tuoi dati sono sempre protetti e crittografati',
    'All-in-One Hub': 'Tutto in Uno',
    'Seamless Integration': 'Integrazione Perfetta',
    'Dark Mode Support': 'Supporto Modalità Scura',
    'Top Rated Experience': 'Esperienza Top',
  },
  ja: {
    'Amazing Features': '注目の機能',
    'Discover what makes our app great': 'アプリの魅力と優れた機能をご紹介',
    'New Feature': '新機能',
    'Describe it here': 'ここに説明を入力',
    'Track Your Progress': '進捗を簡単に記録',
    'Stay organized and productive': '日々の管理と効率化をサポート',
    'Smart Analytics': 'スマート分析',
    'Powerful insights at your fingertips': '役立つインサイトをひと目で確認',
    'Fast & Secure': '高速かつ安心のセキュリティ',
    'Your data is always encrypted and protected': 'データは厳重に暗号化され保護されます',
    'All-in-One Hub': 'オールインワン',
    'Seamless Integration': 'シームレスな連携',
    'Dark Mode Support': 'ダークモード対応',
    'Top Rated Experience': '高評価のユーザー体験',
  },
  zh: {
    'Amazing Features': '精彩功能',
    'Discover what makes our app great': '探索我们应用的独特之处',
    'New Feature': '新功能',
    'Describe it here': '在此输入描述',
    'Track Your Progress': '跟踪您的进度',
    'Stay organized and productive': '保持井井有条与高效',
    'Smart Analytics': '智能数据分析',
    'Powerful insights at your fingertips': '随时掌握关键洞察',
    'Fast & Secure': '快速且安全',
    'Your data is always encrypted and protected': '您的数据始终经过加密保护',
    'All-in-One Hub': '一站式平台',
    'Seamless Integration': '无缝集成',
    'Dark Mode Support': '支持深色模式',
    'Top Rated Experience': '顶级使用体验',
  },
  ko: {
    'Amazing Features': '놀라운 기능',
    'Discover what makes our app great': '앱의 특별한 기능을 확인해보세요',
    'New Feature': '새로운 기능',
    'Describe it here': '여기에 설명을 입력하세요',
    'Track Your Progress': '진행 상황 한눈에 확인',
    'Stay organized and productive': '체계적이고 효율적인 일상 관리',
    'Smart Analytics': '스마트 분석',
    'Powerful insights at your fingertips': '유용한 인사이트를 손쉽게 파악',
    'Fast & Secure': '빠르고 안전한 보안',
    'Your data is always encrypted and protected': '모든 데이터는 암호화되어 안전하게 보관됩니다',
    'All-in-One Hub': '올인원 플랫폼',
    'Seamless Integration': '원활한 연동',
    'Dark Mode Support': '다크 모드 지원',
    'Top Rated Experience': '최고 등급의 사용자 경험',
  },
  ru: {
    'Amazing Features': 'Потрясающие функции',
    'Discover what makes our app great': 'Узнайте о возможностях нашего приложения',
    'New Feature': 'Новая функция',
    'Describe it here': 'Опишите здесь',
    'Track Your Progress': 'Отслеживайте прогресс',
    'Stay organized and productive': 'Организованность и продуктивность каждый день',
    'Smart Analytics': 'Умная аналитика',
    'Powerful insights at your fingertips': 'Полезная статистика у вас под рукой',
    'Fast & Secure': 'Быстро и безопасно',
    'Your data is always encrypted and protected': 'Все данные зашифрованы и надежно защищены',
    'All-in-One Hub': 'Всё в одном месте',
    'Seamless Integration': 'Простая интеграция',
    'Dark Mode Support': 'Темная тема',
    'Top Rated Experience': 'Высокие оценки пользователей',
  },
};

/**
 * Translate a single string to a target language.
 * Tries Google Translate public API first, then MyMemory API, then offline dictionary, and falls back to original text.
 */
export async function translateText(text: string, targetLang: string, sourceLang = 'auto'): Promise<string> {
  const trimmed = text ? text.trim() : '';
  if (!trimmed) return text;
  if (targetLang.toLowerCase() === sourceLang.toLowerCase()) return text;

  // 1. Check offline dictionary first for instant match
  const dict = OFFLINE_DICTIONARY[targetLang.toLowerCase()];
  if (dict && dict[trimmed]) {
    return dict[trimmed];
  }

  // 2. Try Google Translate public web API (gtx client)
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(
      sourceLang
    )}&tl=${encodeURIComponent(targetLang)}&dt=t&q=${encodeURIComponent(trimmed)}`;
    
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (res.ok) {
      const data = (await res.json()) as unknown;
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const segments: string[] = [];
        for (const item of data[0]) {
          if (Array.isArray(item) && typeof item[0] === 'string') {
            segments.push(item[0]);
          }
        }
        const translated = segments.join('');
        if (translated) {
          return translated;
        }
      }
    }
  } catch {
    // Continue to next fallback
  }

  // 3. Try MyMemory API fallback
  try {
    const src = sourceLang === 'auto' ? 'en' : sourceLang;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      trimmed
    )}&langpair=${encodeURIComponent(src)}|${encodeURIComponent(targetLang)}`;
    
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (res.ok) {
      const data = (await res.json()) as { responseStatus?: number; responseData?: { translatedText?: string } };
      if (data?.responseStatus === 200 && data.responseData?.translatedText) {
        return data.responseData.translatedText;
      }
    }
  } catch {
    // Continue to next fallback
  }

  // 4. Return original text if translation failed
  return text;
}

/**
 * Translate an array of canvases for a specific target language.
 */
export async function batchTranslateCanvases(
  canvases: CanvasItem[],
  targetLang: string,
  onProgress?: (completed: number, total: number) => void
): Promise<Array<{ id: string; title: string; subtitle: string }>> {
  const results: Array<{ id: string; title: string; subtitle: string }> = [];
  const total = canvases.length;
  let completed = 0;

  for (let i = 0; i < canvases.length; i++) {
    const canvas = canvases[i];
    
    // Translate title & subtitle
    const [title, subtitle] = await Promise.all([
      canvas.title ? translateText(canvas.title, targetLang) : Promise.resolve(''),
      canvas.subtitle ? translateText(canvas.subtitle, targetLang) : Promise.resolve(''),
    ]);

    results.push({
      id: canvas.id,
      title,
      subtitle,
    });

    completed++;
    if (onProgress) {
      onProgress(completed, total);
    }
  }

  return results;
}

/**
 * Translate canvases across multiple languages.
 */
export async function batchTranslateAllLanguages(
  canvases: CanvasItem[],
  targetLanguages: string[],
  onProgress?: (completed: number, total: number) => void
): Promise<Record<string, Array<{ id: string; title: string; subtitle: string }>>> {
  const result: Record<string, Array<{ id: string; title: string; subtitle: string }>> = {};
  const totalSteps = targetLanguages.length * canvases.length;
  let currentStep = 0;

  for (const lang of targetLanguages) {
    const langResults = await batchTranslateCanvases(canvases, lang, () => {
      currentStep++;
      if (onProgress) {
        onProgress(currentStep, totalSteps);
      }
    });
    result[lang] = langResults;
  }

  return result;
}

/**
 * Export current language translations as JSON file.
 */
export function exportSingleLanguageJson(
  canvases: CanvasItem[],
  langCode: string,
  appName = 'app'
) {
  const payload = canvases.map((canvas, idx) => {
    const translation = canvas.translations?.[langCode];
    return {
      slide: idx + 1,
      title: translation?.title ?? canvas.title,
      subtitle: translation?.subtitle ?? canvas.subtitle,
    };
  });

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const sanitizedAppName = appName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  saveAs(blob, `${sanitizedAppName}-translations-${langCode}.json`);
}

/**
 * Export all languages translations as a single JSON file.
 */
export function exportAllLanguagesJson(
  canvases: CanvasItem[],
  appName = 'app'
) {
  const languages = SUPPORTED_LANGUAGES.map((l) => l.code);
  const payload: Record<string, Array<{ slide: number; title: string; subtitle: string }>> = {};

  for (const lang of languages) {
    payload[lang] = canvases.map((canvas, idx) => {
      const translation = canvas.translations?.[lang];
      return {
        slide: idx + 1,
        title: translation?.title ?? (lang === 'en' ? canvas.title : ''),
        subtitle: translation?.subtitle ?? (lang === 'en' ? canvas.subtitle : ''),
      };
    });
  }

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const sanitizedAppName = appName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  saveAs(blob, `${sanitizedAppName}-translations-all.json`);
}

/**
 * Download a blank sample translation JSON template.
 */
export function downloadTranslationTemplate(canvases: CanvasItem[]) {
  const template = canvases.map((canvas, idx) => ({
    slide: idx + 1,
    title: canvas.title || `Feature Title ${idx + 1}`,
    subtitle: canvas.subtitle || `Feature Subtitle ${idx + 1}`,
  }));

  const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
  saveAs(blob, 'launchshot-translation-template.json');
}

export type ParsedTranslationResult = 
  | { type: 'single'; data: Array<{ title: string; subtitle: string }> }
  | { type: 'multi'; data: Record<string, Array<{ title: string; subtitle: string }>> };

/**
 * Parse an uploaded JSON translation file.
 * Handles both Array format `[{title, subtitle}, ...]` and multi-language object `{ es: [...], pt: [...] }`.
 */
export function parseUploadedTranslationJson(jsonText: string): ParsedTranslationResult {
  const parsed: unknown = JSON.parse(jsonText);

  if (Array.isArray(parsed)) {
    return {
      type: 'single',
      data: parsed.map((item: Record<string, unknown>) => ({
        title: typeof item?.title === 'string' ? item.title : '',
        subtitle: typeof item?.subtitle === 'string' ? item.subtitle : '',
      })),
    };
  }

  if (typeof parsed === 'object' && parsed !== null) {
    const multiMap: Record<string, Array<{ title: string; subtitle: string }>> = {};
    for (const [key, val] of Object.entries(parsed as Record<string, unknown>)) {
      if (Array.isArray(val)) {
        multiMap[key.toLowerCase()] = val.map((item: Record<string, unknown>) => ({
          title: typeof item?.title === 'string' ? item.title : '',
          subtitle: typeof item?.subtitle === 'string' ? item.subtitle : '',
        }));
      }
    }
    return {
      type: 'multi',
      data: multiMap,
    };
  }

  throw new Error('Unsupported JSON format. Expected an array or a language dictionary object.');
}
