import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { ReCaptcha } from '@/components/ReCaptcha';
import { Eye, EyeOff, Mail, Lock, UserPlus, LogIn } from 'lucide-react';

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await signIn(loginData.email, loginData.password);
      
      if (error) {
        toast({
          title: 'Помилка входу',
          description: error.message === 'Invalid login credentials' 
            ? 'Невірний email або пароль' 
            : 'Сталася помилка при вході',
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Успішно!',
          description: 'Ви успішно увійшли в систему'
        });
        // Redirect to home page (which will redirect to hackathons for authenticated users)
        navigate('/');
      }
    } catch (error) {
      toast({
        title: 'Помилка',
        description: 'Сталася несподівана помилка',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: 'Помилка',
        description: 'Паролі не співпадають',
        variant: 'destructive'
      });
      return;
    }
    
    if (registerData.password.length < 6) {
      toast({
        title: 'Помилка',
        description: 'Пароль повинен містити не менше 6 символів',
        variant: 'destructive'
      });
      return;
    }

    if (!recaptchaToken) {
      toast({
        title: 'Помилка',
        description: 'Будь ласка, пройдіть перевірку reCAPTCHA',
        variant: 'destructive'
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await signUp(registerData.email, registerData.password, recaptchaToken);
      
      if (error) {
        if (error.message.includes('already registered')) {
          toast({
            title: 'Помилка реєстрації',
            description: 'Користувач з таким email вже існує',
            variant: 'destructive'
          });
        } else {
          toast({
            title: 'Помилка реєстрації',
            description: 'Сталася помилка при реєстрації',
            variant: 'destructive'
          });
        }
      } else {
        toast({
          title: 'Успішно!',
          description: 'Реєстрація пройшла успішно. Заповніть свій профіль.'
        });
      }
    } catch (error) {
      toast({
        title: 'Помилка',
        description: 'Сталася несподівана помилка',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Вітаємо в HackHub
          </h1>
          <p className="text-foreground-secondary">
            Увійдіть або створіть новий акаунт
          </p>
        </div>

        <Card className="bg-gradient-card border-border">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">
                <LogIn className="w-4 h-4 mr-2" />
                Вхід
              </TabsTrigger>
              <TabsTrigger value="register">
                <UserPlus className="w-4 h-4 mr-2" />
                Реєстрація
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <CardHeader>
                <CardTitle className="text-center">Увійти в акаунт</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-foreground-secondary" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="your@email.com"
                        value={loginData.email}
                        onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Пароль</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-foreground-secondary" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Ваш пароль"
                        value={loginData.password}
                        onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-foreground-secondary hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Входимо...' : 'Увійти'}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="register">
              <CardHeader>
                <CardTitle className="text-center">Створити акаунт</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-foreground-secondary" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="your@email.com"
                        value={registerData.email}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Пароль</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-foreground-secondary" />
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Мінімум 6 символів"
                        value={registerData.password}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                        className="pl-10 pr-10"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-foreground-secondary hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Підтвердіть пароль</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-foreground-secondary" />
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Повторіть пароль"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-foreground-secondary hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <ReCaptcha onChange={setRecaptchaToken} />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isLoading || !recaptchaToken}
                  >
                    {isLoading ? 'Реєструємо...' : 'Створити акаунт'}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}