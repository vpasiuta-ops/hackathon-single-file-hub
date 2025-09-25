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
  const renderAttemptRef = useRef(0);

  const renderRecaptcha = useCallback(() => {
    renderAttemptRef.current += 1;
    console.log(`Render attempt #${renderAttemptRef.current}`);
    console.log('Attempting to render reCAPTCHA...');
    console.log('grecaptcha available:', !!window.grecaptcha);
    console.log('grecaptcha.render available:', !!(window.grecaptcha && window.grecaptcha.render));
    console.log('recaptchaRef.current available:', !!recaptchaRef.current);
    console.log('widgetIdRef.current:', widgetIdRef.current);
    
    if (!recaptchaRef.current) {
      console.log('Ref not ready, scheduling retry...');
      // Try again after DOM is ready
      setTimeout(() => {
        if (renderAttemptRef.current < 10 && isLoading) {
          renderRecaptcha();
        } else if (renderAttemptRef.current >= 10) {
          console.error('Max render attempts reached');
          setError('Failed to initialize reCAPTCHA - DOM element not available');
          setIsLoading(false);
        }
      }, 200);
      return;
    }

    if (!window.grecaptcha || !window.grecaptcha.render) {
      console.log('Google reCAPTCHA not ready yet');
      setTimeout(() => {
        if (renderAttemptRef.current < 10 && isLoading) {
          renderRecaptcha();
        }
      }, 200);
      return;
    }

    if (widgetIdRef.current !== null) {
      console.log('Widget already rendered');
      return;
    }

    const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
    
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
  }, [onChange, isLoading]);

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

    // Reset attempt counter
    renderAttemptRef.current = 0;

    // Check if reCAPTCHA is already loaded
    if (window.grecaptcha && window.grecaptcha.render) {
      console.log('reCAPTCHA already loaded, using ready callback');
      if (window.grecaptcha.ready) {
        window.grecaptcha.ready(renderRecaptcha);
      } else {
        // Wait a bit for DOM to be ready
        setTimeout(renderRecaptcha, 100);
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
            window.grecaptcha.ready(() => {
              // Wait for DOM
              setTimeout(renderRecaptcha, 100);
            });
          } else {
            setTimeout(renderRecaptcha, 100);
          }
        };

        script.onload = () => {
          console.log('reCAPTCHA script loaded via onload');
          if (!window.onRecaptchaLoad) {
            setTimeout(renderRecaptcha, 100);
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
        setTimeout(renderRecaptcha, 500);
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
  }, [renderRecaptcha]);

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
            Спроба #{renderAttemptRef.current} | Домен: {window.location.hostname}
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