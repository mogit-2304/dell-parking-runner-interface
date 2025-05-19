
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Lock, Clock, Eye, EyeOff } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Mock API for simulating backend responses
const mockApi = {
  // List of allowed phone numbers
  allowedPhoneNumbers: ['9885657890', '7456657320', '8989006732', '9908904546', '8909883121'],
  
  // Simulates a phone number validation check
  validatePhoneNumber: (phone: string): Promise<{valid: boolean}> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Check if phone number is in the allowed list
        const isValid = mockApi.allowedPhoneNumbers.includes(phone);
        resolve({ valid: isValid });
      }, 800);
    });
  },
  
  // Simulates sending a verification code to a phone number
  requestVerification: (phone: string): Promise<{success: boolean, expiresAt: Date}> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would trigger an SMS to be sent
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
        resolve({ success: true, expiresAt });
      }, 1000);
    });
  },
  
  // Simulates verifying a password
  verifyPassword: (phone: string, password: string, attempts: number): Promise<{success: boolean, token?: string, locked?: boolean, message?: string}> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // The correct password is "123@Classified" for all allowed numbers
        const isCorrect = password === "123@Classified";
        
        // Handle lockout after 5 attempts
        if (attempts >= 5) {
          resolve({ success: false, locked: true, message: "Too many attempts—try again in 15 minutes" });
          return;
        }
        
        if (isCorrect) {
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
  const [verificationExpiry, setVerificationExpiry] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
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
    let timer: NodeJS.Timeout;
    
    // Timer for verification expiry countdown
    if (verificationExpiry && step === 'password') {
      timer = setInterval(() => {
        const now = new Date();
        const diff = verificationExpiry.getTime() - now.getTime();
        
        if (diff <= 0) {
          setTimeLeft(0);
          clearInterval(timer);
          toast({
            title: "Session Expired",
            description: "Your verification session has expired. Please try again.",
            variant: "destructive",
          });
        } else {
          setTimeLeft(Math.floor(diff / 1000));
        }
      }, 1000);
    }
    
    // Timer for lockdown countdown
    if (isLocked && lockdownEndTime) {
      timer = setInterval(() => {
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
    }
    
    return () => clearInterval(timer);
  }, [verificationExpiry, step, isLocked, lockdownEndTime, toast]);

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
      
      // Phone is valid, request verification
      const verificationResult = await mockApi.requestVerification(data.phone);
      
      if (verificationResult.success) {
        setPhone(data.phone);
        setVerificationExpiry(verificationResult.expiresAt);
        setStep('password');
        toast({
          title: "Phone Verified",
          description: `Please enter your password to continue`,
        });
      }
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
      
      if (verificationExpiry && new Date() > verificationExpiry) {
        setError("Session expired. Please try again.");
        setLoading(false);
        return;
      }
      
      const verifyResult = await mockApi.verifyPassword(phone, data.password, attempts);
      
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
        if (verifyResult.locked) {
          setIsLocked(true);
          const lockEndTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes lockdown
          setLockdownEndTime(lockEndTime);
          setError(verifyResult.message || "Too many attempts—try again in 15 minutes");
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
          }
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const requestNewVerification = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const verificationResult = await mockApi.requestVerification(phone);
      
      if (verificationResult.success) {
        setVerificationExpiry(verificationResult.expiresAt);
        setAttempts(0);
        passwordForm.reset();
        toast({
          title: "New Verification Session",
          description: `A new verification session has been started`,
        });
      }
    } catch (err) {
      setError("Failed to request a new verification. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
              : `Enter your password to log in with ${phone.replace(/(\d{2})(\d{4})(\d{4})/, '$1****$3')}`}
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
              <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
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
                <div className="space-y-2">
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
                              onClick={togglePasswordVisibility}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-500" />
                              ) : (
                                <Eye className="h-5 w-5 text-gray-500" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {timeLeft > 0 && (
                  <div className="flex items-center justify-center text-sm text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>Session expires in {formatTime(timeLeft)}</span>
                  </div>
                )}
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
                {loading ? "Verifying..." : "Login"}
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
                <Button 
                  variant="link" 
                  onClick={requestNewVerification}
                  disabled={loading || timeLeft > 0}
                  className="px-0"
                >
                  Restart Session
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
