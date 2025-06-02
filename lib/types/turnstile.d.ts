export {}; // Pastikan file ini diperlakukan sebagai modul

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, params: TurnstileWidgetParams) => string | undefined;
      reset: (widgetId?: string) => void;
      getResponse: (widgetId?: string) => string | undefined;
      remove: (widgetId?: string) => void;
    };
  }
}

interface TurnstileWidgetParams {
  sitekey: string;
  action?: string;
  cData?: string;
  callback?: (token: string) => void;
  'error-callback'?: () => void;
  'expired-callback'?: () => void;
  'timeout-callback'?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  language?: string; // atau daftar kode bahasa yang didukung
  tabindex?: number;
  'response-field'?: boolean;
  'response-field-name'?: string;
  size?: 'normal' | 'compact' | 'invisible';
  retry?: 'auto' | 'never';
  'retry-interval'?: number;
  'refresh-expired'?: 'auto' | 'manual' | 'never';
  // Tambahkan parameter lain jika diperlukan dari dokumentasi Turnstile
}