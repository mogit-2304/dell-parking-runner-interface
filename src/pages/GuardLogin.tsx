
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Mock API for simulating backend responses
const mockApi = {
  // Simulates a phone number validation check
  validatePhoneNumber: (phone: string): Promise<{valid: boolean}> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Only accept specific phone numbers
        const validPhoneNumbers = [
          '9885657890',
          '7456657320',
          '8989006732',
          '9908904546',
          '8909883121'
        ];
        const isValid = validPhoneNumbers.includes(phone);
        resolve({ valid: isValid });
      }, 800);
    });
  },
  
  // Simulates password verification
  verifyPassword: (phone: string, password: string): Promise<{success: boolean, token?: string, message?: string}> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const validPassword = "123@Classified";
        
        if (password === validPassword) {
          resolve({ 
            success: true, 
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c" 
          });
        } else {
          resolve({ 
            success: false,
            message: "Invalid password" 
          });
        }
      }, 800);
    });
  }
};

const phoneSchema = z.object({
  phone: z.string().min(10, "Phone number must be 10 digits").max(10, "Phone number must be 10 digits").regex(/^\d+$/, "Must contain only digits")
});

const passwordSchema = z.object({
  password: z.string().min(1, "Password is required")
});

const GuardLogin = () => {
  const [step, setStep] = useState<'phone' | 'password'>('phone');
  const [phone, setPhone] = useState<string>('');
  const [attempts, setAttempts] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [lockdownEndTime, setLockdownEndTime] = useState<Date | null>(null);
  const [lockdownTimeLeft, setLockdownTimeLeft] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  
  const { toast } = useToast();
  
  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: '',
    },
  });
  
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: '',
    },
  });

  useEffect(() => {
    // Timer for lockdown countdown
    if (isLocked && lockdownEndTime) {
      const timer = setInterval(() => {
        const now = new Date();
        const diff = lockdownEndTime.getTime() - now.getTime();
        
        if (diff <= 0) {
          setIsLocked(false);
          setLockdownTimeLeft(0);
          clearInterval(timer);
          setAttempts(0);
        } else {
          setLockdownTimeLeft(Math.floor(diff / 1000));
        }
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [isLocked, lockdownEndTime]);

  const handlePhoneSubmit = async (data: z.infer<typeof phoneSchema>) => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate phone number against backend
      const validateResult = await mockApi.validatePhoneNumber(data.phone);
      
      if (!validateResult.valid) {
        setError("Phone number not recognized");
        setLoading(false);
        return;
      }
      
      // Phone is valid, proceed to password step
      setPhone(data.phone);
      setStep('password');
      toast({
        title: "Phone Verified",
        description: `Please enter your password`,
      });
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handlePasswordSubmit = async (data: z.infer<typeof passwordSchema>) => {
    try {
      setLoading(true);
      setError(null);
      
      if (isLocked) {
        setError("Account is locked. Please try again later.");
        setLoading(false);
        return;
      }
      
      const verifyResult = await mockApi.verifyPassword(phone, data.password);
      
      if (verifyResult.success) {
        // Successful login
        toast({
          title: "Login Successful",
          description: "You have been successfully logged in.",
        });
        
        // In a real app, we would store the JWT token here
        localStorage.setItem('guard-token', verifyResult.token as string);
        
        // Navigate to Select Office screen
        window.location.href = "/select-office";
      } else {
        setAttempts(attempts + 1);
        setError(verifyResult.message || "Invalid password");
        
        // Show how many attempts are left
        const attemptsLeft = 5 - (attempts + 1);
        if (attemptsLeft > 0) {
          toast({
            title: "Invalid Password",
            description: `${attemptsLeft} attempts remaining before lockout.`,
            variant: "destructive",
          });
        } else {
          setIsLocked(true);
          const lockEndTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes lockdown
          setLockdownEndTime(lockEndTime);
          setError("Too many attempts—try again in 15 minutes");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 p-4">
      {/* Logo section at the top */}
      <div className="mx-auto w-full max-w-md mb-4 pt-4">
        <div className="flex items-center justify-center">
          <img 
            src="/lovable-uploads/b3ecde46-910c-4cab-8d3f-63e1447f2f46.png" 
            alt="Move in Sync Logo" 
            className="h-16 w-auto" 
          />
        </div>
      </div>
      
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Guard Login</CardTitle>
          <CardDescription>
            {step === 'phone' 
              ? 'Enter your registered phone number to continue.' 
              : `Enter your password to login`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {isLocked ? (
            <div className="text-center py-6">
              <Lock className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">Account Temporarily Locked</h3>
              <p className="text-muted-foreground mt-2">
                Too many failed attempts. Try again in {formatTime(lockdownTimeLeft)}.
              </p>
            </div>
          ) : step === 'phone' ? (
            <Form {...phoneForm}>
              <form onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)} className="space-y-4">
                <FormField
                  control={phoneForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter 10-digit phone number"
                          {...field}
                          className="text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          ) : (
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-6">
                <FormField
                  control={passwordForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            {...field}
                            className="text-base pr-10"
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          {step === 'phone' ? (
            <Button 
              className="w-full" 
              onClick={phoneForm.handleSubmit(handlePhoneSubmit)}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Continue"}
            </Button>
          ) : (
            <>
              <Button 
                className="w-full" 
                onClick={passwordForm.handleSubmit(handlePasswordSubmit)}
                disabled={loading || isLocked}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
              
              <div className="flex w-full justify-between text-sm">
                <Button 
                  variant="link" 
                  onClick={() => {
                    setStep('phone');
                    setAttempts(0);
                    passwordForm.reset();
                  }}
                  disabled={loading}
                  className="px-0"
                >
                  Change Phone Number
                </Button>
              </div>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default GuardLogin;
