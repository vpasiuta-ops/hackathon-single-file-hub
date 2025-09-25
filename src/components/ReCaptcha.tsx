import { useEffect, useRef, useState } from 'react';

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
  }
}

export const ReCaptcha = ({ onChange }: ReCaptchaProps) => {
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const widgetIdRef = useRef<number | null>(null);
  const initAttemptRef = useRef(0);

  useEffect(() => {
    const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
    
    console.log('=== reCAPTCHA Ініціалізація ===');
    console.log('Site Key:', siteKey);
    console.log('Домен:', window.location.hostname);
    
    if (!siteKey) {
      setError('Site Key не налаштований');
      return;
    }

    const initializeRecaptcha = () => {
      initAttemptRef.current += 1;
      
      // Перевіряємо чи DOM елемент готовий
      if (!recaptchaRef.current) {
        console.log(`Спроба #${initAttemptRef.current}: DOM елемент не готовий`);
        if (initAttemptRef.current < 50) { // Максимум 50 спроб = 5 секунд
          setTimeout(initializeRecaptcha, 100);
        } else {
          console.error('❌ DOM елемент не з\'явився після 50 спроб');
          setError('DOM елемент недоступний');
        }
        return;
      }

      // Перевіряємо чи Google reCAPTCHA API готовий
      if (!window.grecaptcha || !window.grecaptcha.render) {
        console.log(`Спроба #${initAttemptRef.current}: Google reCAPTCHA API не готовий`);
        if (initAttemptRef.current < 50) {
          setTimeout(initializeRecaptcha, 100);
        } else {
          console.error('❌ Google reCAPTCHA API не завантажився');
          setError('Google reCAPTCHA API недоступний');
        }
        return;
      }

      // Якщо widget вже створений
      if (widgetIdRef.current !== null) {
        console.log('✅ Widget вже існує');
        setIsLoaded(true);
        return;
      }

      try {
        console.log(`✅ Спроба #${initAttemptRef.current}: Створюємо reCAPTCHA widget...`);
        console.log('DOM елемент:', recaptchaRef.current);
        
        widgetIdRef.current = window.grecaptcha.render(recaptchaRef.current, {
          sitekey: siteKey,
          callback: (token: string) => {
            console.log('✅ reCAPTCHA пройдена успішно');
            onChange(token);
            setError(null);
          },
          'expired-callback': () => {
            console.log('⏰ reCAPTCHA прострочена');
            onChange(null);
          },
          'error-callback': (err: any) => {
            console.error('❌ reCAPTCHA помилка:', err);
            setError(`reCAPTCHA помилка: ${err}`);
            onChange(null);
          }
        });
        
        console.log('✅ reCAPTCHA успішно створена, Widget ID:', widgetIdRef.current);
        setIsLoaded(true);
        
      } catch (err) {
        console.error('❌ Помилка створення reCAPTCHA:', err);
        const message = err instanceof Error ? err.message : 'Невідома помилка';
        setError(`Помилка: ${message}`);
      }
    };

    // Завантажуємо Google reCAPTCHA скрипт
    if (!window.grecaptcha && !document.querySelector('script[src*="recaptcha"]')) {
      console.log('Завантажуємо Google reCAPTCHA скрипт...');
      
      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('✅ Скрипт завантажено, чекаємо DOM...');
        // Даємо час для рендерингу DOM та ініціалізації API
        setTimeout(initializeRecaptcha, 200);
      };

      script.onerror = () => {
        console.error('❌ Помилка завантаження скрипта');
        setError('Не вдалося завантажити Google reCAPTCHA');
      };

      document.head.appendChild(script);
    } else {
      // Скрипт вже завантажений, запускаємо ініціалізацію
      console.log('Скрипт вже завантажений, запускаємо ініціалізацію...');
      setTimeout(initializeRecaptcha, 100);
    }

    return () => {
      if (widgetIdRef.current !== null && window.grecaptcha?.reset) {
        try {
          window.grecaptcha.reset(widgetIdRef.current);
        } catch (err) {
          console.error('Помилка очищення:', err);
        }
        widgetIdRef.current = null;
      }
    };
  }, []); // Пусті залежності

  if (error) {
    return (
      <div className="flex justify-center p-4 border border-destructive rounded-md bg-destructive/10">
        <div className="text-center">
          <p className="text-sm text-destructive font-medium mb-2">❌ {error}</p>
          <div className="text-xs text-foreground-secondary space-y-1">
            <p><strong>Спроб ініціалізації:</strong> {initAttemptRef.current}</p>
            <p><strong>Домен:</strong> {window.location.hostname}</p>
            <p><strong>Site Key:</strong> {import.meta.env.VITE_RECAPTCHA_SITE_KEY?.slice(0, 20)}...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex justify-center p-4">
        <div className="text-center">
          <div className="flex items-center gap-2 justify-center mb-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <p className="text-sm text-foreground-secondary">Завантаження reCAPTCHA...</p>
          </div>
          <div className="text-xs text-foreground-secondary space-y-1">
            <p><strong>Спроба:</strong> #{initAttemptRef.current}</p>
            <p><strong>Домен:</strong> {window.location.hostname}</p>
            <p><strong>Site Key:</strong> {import.meta.env.VITE_RECAPTCHA_SITE_KEY?.slice(0, 20)}...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div ref={recaptchaRef} className="recaptcha-container" />
    </div>
  );
};