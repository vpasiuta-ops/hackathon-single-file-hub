import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface MockReCaptchaProps {
  onChange: (token: string | null) => void;
}

export const MockReCaptcha = ({ onChange }: MockReCaptchaProps) => {
  const [isVerified, setIsVerified] = useState(false);

  const handleVerify = () => {
    setIsVerified(true);
    // Generate a mock token for testing
    const mockToken = 'mock_recaptcha_token_' + Date.now();
    onChange(mockToken);
  };

  if (isVerified) {
    return (
      <div className="flex items-center justify-center gap-2 p-4 border border-success rounded-md bg-success/10">
        <CheckCircle className="w-5 h-5 text-success" />
        <span className="text-sm text-success">Перевірка пройдена!</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 p-4 border border-border rounded-md bg-muted/30">
      <div className="text-center">
        <p className="text-sm text-foreground-secondary mb-2">
          Демо-версія reCAPTCHA для тестування
        </p>
        <p className="text-xs text-muted-foreground">
          Натисніть кнопку нижче для імітації проходження перевірки
        </p>
      </div>
      <Button 
        onClick={handleVerify}
        variant="outline"
        size="sm"
      >
        ✅ Я не робот
      </Button>
    </div>
  );
};