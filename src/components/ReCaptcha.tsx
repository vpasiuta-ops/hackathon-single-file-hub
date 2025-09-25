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
    
    if (!siteKey) {
      setError('reCAPTCHA Site Key not configured');
      setIsLoading(false);
      return;
    }

    const renderRecaptcha = () => {
      if (window.grecaptcha && window.grecaptcha.render && recaptchaRef.current && !widgetIdRef.current) {
        try {
          widgetIdRef.current = window.grecaptcha.render(recaptchaRef.current, {
            sitekey: siteKey,
            callback: (token: string) => {
              onChange(token);
              setError(null);
            },
            'expired-callback': () => {
              onChange(null);
            },
            'error-callback': () => {
              setError('reCAPTCHA error occurred');
              onChange(null);
            }
          });
          setIsLoading(false);
        } catch (err) {
          console.error('reCAPTCHA render error:', err);
          setError('Failed to load reCAPTCHA');
          setIsLoading(false);
        }
      }
    };

    // Check if reCAPTCHA is already loaded
    if (window.grecaptcha && window.grecaptcha.render) {
      if (window.grecaptcha.ready) {
        window.grecaptcha.ready(renderRecaptcha);
      } else {
        renderRecaptcha();
      }
    } else {
      // Load reCAPTCHA script if not already present
      if (!document.querySelector('script[src*="recaptcha"]')) {
        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit`;
        script.async = true;
        script.defer = true;
        
        // Set up global callback
        window.onRecaptchaLoad = () => {
          if (window.grecaptcha.ready) {
            window.grecaptcha.ready(renderRecaptcha);
          } else {
            renderRecaptcha();
          }
        };

        script.onerror = () => {
          setError('Failed to load reCAPTCHA script');
          setIsLoading(false);
        };

        document.head.appendChild(script);
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
  }, [onChange]);

  if (error) {
    return (
      <div className="flex justify-center p-4 border border-destructive rounded-md bg-destructive/10">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          <p className="text-sm text-foreground-secondary">Завантаження reCAPTCHA...</p>
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