import { useEffect, useRef, useState, useCallback } from 'react';

interface ReCaptchaProps {
  onChange: (token: string | null) => void;
}

declare global {
  interface Window {
    grecaptcha: {
      render: (element: string | Element, options: any) => number;
      reset: (widgetId?: number) => void;
      getResponse: (widgetId?: number) => string;
      ready: (callback: () => void) => void;
    };
    onRecaptchaLoad?: () => void;
  }
}

export const ReCaptcha = ({ onChange }: ReCaptchaProps) => {
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
    
    console.log('=== reCAPTCHA Диагностика ===');
    console.log('Site Key:', siteKey);
    console.log('Домен:', window.location.hostname);
    console.log('Повний URL:', window.location.href);
    
    if (!siteKey) {
      const errorMsg = 'reCAPTCHA Site Key не налаштований';
      console.error(errorMsg);
      setError(errorMsg);
      setIsLoading(false);
      return;
    }

    const renderRecaptcha = () => {
      if (!recaptchaRef.current) {
        console.log('DOM елемент ще не готовий, чекаємо...');
        setTimeout(renderRecaptcha, 100);
        return;
      }

      if (!window.grecaptcha || !window.grecaptcha.render) {
        console.log('Google reCAPTCHA API ще не завантажений, чекаємо...');
        setTimeout(renderRecaptcha, 500);
        return;
      }

      if (widgetIdRef.current !== null) {
        console.log('reCAPTCHA вже відрендерена');
        return;
      }

      try {
        console.log('Рендеримо reCAPTCHA...');
        widgetIdRef.current = window.grecaptcha.render(recaptchaRef.current, {
          sitekey: siteKey,
          callback: (token: string) => {
            console.log('✅ reCAPTCHA успішно пройдена');
            onChange(token);
            setError(null);
          },
          'expired-callback': () => {
            console.log('⏰ reCAPTCHA прострочена');
            onChange(null);
          },
          'error-callback': (err: any) => {
            console.error('❌ Помилка reCAPTCHA:', err);
            setError(`reCAPTCHA помилка: ${err}`);
            onChange(null);
          }
        });
        
        console.log('✅ reCAPTCHA успішно відрендерена, ID:', widgetIdRef.current);
        setIsLoading(false);
        
      } catch (err) {
        console.error('❌ Критична помилка при рендері reCAPTCHA:', err);
        const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
        setError(`Помилка ініціалізації reCAPTCHA: ${errorMessage}`);
        setIsLoading(false);
      }
    };

    // Перевіряємо чи reCAPTCHA вже завантажена
    if (window.grecaptcha && window.grecaptcha.ready) {
      console.log('Google reCAPTCHA API вже завантажений');
      window.grecaptcha.ready(renderRecaptcha);
    } else if (document.querySelector('script[src*="recaptcha"]')) {
      console.log('Скрипт reCAPTCHA вже додано до DOM, чекаємо завантаження');
      setTimeout(() => {
        if (window.grecaptcha && window.grecaptcha.ready) {
          window.grecaptcha.ready(renderRecaptcha);
        } else {
          renderRecaptcha();
        }
      }, 1000);
    } else {
      console.log('Завантажуємо скрипт Google reCAPTCHA...');
      
      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('✅ Скрипт reCAPTCHA завантажено');
        if (window.grecaptcha && window.grecaptcha.ready) {
          window.grecaptcha.ready(renderRecaptcha);
        } else {
          renderRecaptcha();
        }
      };

      script.onerror = (e) => {
        console.error('❌ Помилка завантаження скрипта reCAPTCHA:', e);
        setError('Помилка завантаження Google reCAPTCHA');
        setIsLoading(false);
      };

      document.head.appendChild(script);
    }

    return () => {
      if (widgetIdRef.current !== null && window.grecaptcha && window.grecaptcha.reset) {
        try {
          window.grecaptcha.reset(widgetIdRef.current);
          widgetIdRef.current = null;
        } catch (err) {
          console.error('Помилка при очищенні reCAPTCHA:', err);
        }
      }
    };
  }, [onChange]);

  if (error) {
    return (
      <div className="flex justify-center p-4 border border-destructive rounded-md bg-destructive/10">
        <div className="text-center">
          <p className="text-sm text-destructive font-medium mb-2">❌ {error}</p>
          <div className="text-xs text-foreground-secondary space-y-1">
            <p><strong>Домен:</strong> {window.location.hostname}</p>
            <p><strong>Site Key:</strong> {import.meta.env.VITE_RECAPTCHA_SITE_KEY?.slice(0, 20)}...</p>
            <p className="mt-2">Перевірте консоль браузера для деталей</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <div className="text-center">
          <div className="flex items-center gap-2 justify-center mb-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <p className="text-sm text-foreground-secondary">Завантаження reCAPTCHA...</p>
          </div>
          <div className="text-xs text-foreground-secondary space-y-1">
            <p><strong>Домен:</strong> {window.location.hostname}</p>
            <p><strong>Site Key:</strong> {import.meta.env.VITE_RECAPTCHA_SITE_KEY?.slice(0, 20)}...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div ref={recaptchaRef} />
    </div>
  );
};