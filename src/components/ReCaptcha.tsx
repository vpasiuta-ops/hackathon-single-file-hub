import { useEffect, useRef } from 'react';

interface ReCaptchaProps {
  onChange: (token: string | null) => void;
}

declare global {
  interface Window {
    grecaptcha: {
      render: (element: string | Element, options: any) => number;
      reset: (widgetId?: number) => void;
      getResponse: (widgetId?: number) => string;
    };
  }
}

export const ReCaptcha = ({ onChange }: ReCaptchaProps) => {
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);

  useEffect(() => {
    const loadRecaptcha = () => {
      if (window.grecaptcha && recaptchaRef.current) {
        widgetIdRef.current = window.grecaptcha.render(recaptchaRef.current, {
          sitekey: import.meta.env.VITE_RECAPTCHA_SITE_KEY,
          callback: onChange,
          'expired-callback': () => onChange(null),
        });
      }
    };

    // Check if reCAPTCHA script is already loaded
    if (window.grecaptcha) {
      loadRecaptcha();
    } else {
      // Load reCAPTCHA script
      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js';
      script.async = true;
      script.defer = true;
      script.onload = loadRecaptcha;
      document.head.appendChild(script);
    }

    return () => {
      if (widgetIdRef.current !== null) {
        window.grecaptcha?.reset(widgetIdRef.current);
      }
    };
  }, [onChange]);

  return (
    <div className="flex justify-center">
      <div ref={recaptchaRef} />
    </div>
  );
};