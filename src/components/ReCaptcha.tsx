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
    
    console.log('reCAPTCHA Site Key:', siteKey);
    console.log('Current domain:', window.location.hostname);
    
    if (!siteKey) {
      console.error('reCAPTCHA Site Key not configured');
      setError('reCAPTCHA Site Key not configured');
      setIsLoading(false);
      return;
    }

    const renderRecaptcha = () => {
      console.log('Attempting to render reCAPTCHA...');
      console.log('grecaptcha available:', !!window.grecaptcha);
      console.log('grecaptcha.render available:', !!(window.grecaptcha && window.grecaptcha.render));
      console.log('recaptchaRef.current available:', !!recaptchaRef.current);
      
      if (window.grecaptcha && window.grecaptcha.render && recaptchaRef.current && !widgetIdRef.current) {
        try {
          console.log('Rendering reCAPTCHA with site key:', siteKey);
          widgetIdRef.current = window.grecaptcha.render(recaptchaRef.current, {
            sitekey: siteKey,
            callback: (token: string) => {
              console.log('reCAPTCHA success, token received');
              onChange(token);
              setError(null);
            },
            'expired-callback': () => {
              console.log('reCAPTCHA expired');
              onChange(null);
            },
            'error-callback': (error: any) => {
              console.error('reCAPTCHA error:', error);
              setError('reCAPTCHA error occurred');
              onChange(null);
            }
          });
          console.log('reCAPTCHA rendered successfully, widget ID:', widgetIdRef.current);
          setIsLoading(false);
        } catch (err) {
          console.error('reCAPTCHA render error:', err);
          setError('Failed to load reCAPTCHA: ' + (err as Error).message);
          setIsLoading(false);
        }
      } else {
        console.log('Conditions not met for rendering:', {
          grecaptcha: !!window.grecaptcha,
          render: !!(window.grecaptcha && window.grecaptcha.render),
          ref: !!recaptchaRef.current,
          alreadyRendered: !!widgetIdRef.current
        });
        // Retry after a delay if conditions aren't met
        setTimeout(() => {
          if (isLoading) {
            console.log('Retrying reCAPTCHA render...');
            renderRecaptcha();
          }
        }, 1000);
      }
    };

    // Check if reCAPTCHA is already loaded
    if (window.grecaptcha && window.grecaptcha.render) {
      console.log('reCAPTCHA already loaded, using ready callback');
      if (window.grecaptcha.ready) {
        window.grecaptcha.ready(renderRecaptcha);
      } else {
        renderRecaptcha();
      }
    } else {
      console.log('Loading reCAPTCHA script...');
      // Load reCAPTCHA script if not already present
      if (!document.querySelector('script[src*="recaptcha"]')) {
        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit`;
        script.async = true;
        script.defer = true;
        
        console.log('Creating reCAPTCHA script with URL:', script.src);
        
        // Set up global callback
        window.onRecaptchaLoad = () => {
          console.log('reCAPTCHA script loaded via callback');
          if (window.grecaptcha.ready) {
            window.grecaptcha.ready(renderRecaptcha);
          } else {
            renderRecaptcha();
          }
        };

        script.onload = () => {
          console.log('reCAPTCHA script loaded via onload');
          if (!window.onRecaptchaLoad) {
            renderRecaptcha();
          }
        };

        script.onerror = (e) => {
          console.error('Failed to load reCAPTCHA script:', e);
          setError('Failed to load reCAPTCHA script');
          setIsLoading(false);
        };

        document.head.appendChild(script);
      } else {
        console.log('reCAPTCHA script already exists in DOM');
        // Script exists but maybe not loaded yet
        setTimeout(renderRecaptcha, 1000);
      }
    }

    return () => {
      if (widgetIdRef.current !== null && window.grecaptcha && window.grecaptcha.reset) {
        try {
          window.grecaptcha.reset(widgetIdRef.current);
        } catch (err) {
          console.error('Error resetting reCAPTCHA:', err);
        }
        widgetIdRef.current = null;
      }
    };
  }, [onChange, isLoading]);

  if (error) {
    return (
      <div className="flex justify-center p-4 border border-destructive rounded-md bg-destructive/10">
        <div className="text-center">
          <p className="text-sm text-destructive mb-2">{error}</p>
          <p className="text-xs text-foreground-secondary">
            Домен: {window.location.hostname}
          </p>
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
          <p className="text-xs text-foreground-secondary">
            Домен: {window.location.hostname}
          </p>
          <p className="text-xs text-foreground-secondary">
            Якщо завантаження триває довго, перевірте консоль браузера
          </p>
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