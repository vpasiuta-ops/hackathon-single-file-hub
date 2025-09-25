import { useEffect, useState } from 'react';

interface ReCaptchaProps {
  onChange: (token: string | null) => void;
}

declare global {
  interface Window {
    grecaptcha?: {
      render: (element: string | Element, options: any) => number;
      reset: (widgetId?: number) => void;
      getResponse: (widgetId?: number) => string;
      ready: (callback: () => void) => void;
    };
  }
}

export const ReCaptcha = ({ onChange }: ReCaptchaProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
    
    console.log('🔄 reCAPTCHA ініціалізація почалася');
    console.log('📍 Site Key:', siteKey);
    console.log('🌐 Домен:', window.location.hostname);
    
    if (!siteKey) {
      console.error('❌ Site Key відсутній');
      setError('reCAPTCHA Site Key не налаштований');
      return;
    }

    const renderRecaptcha = () => {
      // 1. Перевіряємо чи DOM контейнер існує
      const container = document.getElementById('recaptcha-container');
      if (!container) {
        console.log('⏳ DOM контейнер ще не готовий, чекаємо...');
        setTimeout(renderRecaptcha, 100);
        return;
      }

      // 2. Перевіряємо чи Google reCAPTCHA API завантажений
      if (!window.grecaptcha || !window.grecaptcha.render) {
        console.log('⏳ Google reCAPTCHA API ще не готовий, чекаємо...');
        setTimeout(renderRecaptcha, 200);
        return;
      }

      // 3. Рендеримо reCAPTCHA
      try {
        console.log('✅ Всі умови виконані, рендеримо reCAPTCHA');
        console.log('📦 Контейнер знайдено:', container);
        
        window.grecaptcha.render('recaptcha-container', {
          sitekey: siteKey,
          callback: (token: string) => {
            console.log('🎉 reCAPTCHA успішно пройдена!');
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
        
        console.log('✅ reCAPTCHA успішно відрендерена');
        setIsLoaded(true);
        
      } catch (err) {
        console.error('💥 Критична помилка при рендері reCAPTCHA:', err);
        const message = err instanceof Error ? err.message : 'Невідома помилка';
        setError(`Помилка ініціалізації: ${message}`);
      }
    };

    // Завантажуємо Google reCAPTCHA скрипт якщо потрібно
    if (!document.querySelector('script[src*="recaptcha"]')) {
      console.log('📥 Завантажуємо Google reCAPTCHA скрипт...');
      
      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('✅ Скрипт Google reCAPTCHA завантажено');
        // Даємо час API ініціалізуватися після завантаження
        setTimeout(renderRecaptcha, 300);
      };

      script.onerror = (e) => {
        console.error('❌ Помилка завантаження скрипта reCAPTCHA:', e);
        setError('Не вдалося завантажити Google reCAPTCHA');
      };

      document.head.appendChild(script);
    } else {
      console.log('📋 Скрипт reCAPTCHA вже присутній, запускаємо рендер...');
      // Скрипт вже є, запускаємо рендер з невеликою затримкою
      setTimeout(renderRecaptcha, 200);
    }

  }, []); // Виконується лише один раз після монтування компонента

  if (error) {
    return (
      <div className="flex justify-center p-4 border border-destructive rounded-md bg-destructive/10">
        <div className="text-center">
          <p className="text-sm text-destructive font-medium mb-2">❌ {error}</p>
          <div className="text-xs text-foreground-secondary space-y-1">
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
            <p><strong>Домен:</strong> {window.location.hostname}</p>
            <p><strong>Site Key:</strong> {import.meta.env.VITE_RECAPTCHA_SITE_KEY?.slice(0, 20)}...</p>
          </div>
        </div>
      </div>
    );
  }

  // 1. СТВОРЮЄМО ЧІТКЕ МІСЦЕ ДЛЯ CAPTCHA
  return (
    <div className="flex justify-center">
      <div id="recaptcha-container" className="recaptcha-widget"></div>
    </div>
  );
};