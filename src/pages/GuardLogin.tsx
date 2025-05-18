import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Lock, Clock } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
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
        // Updated: Accept phone numbers starting with 7, 8, or 9 (instead of just 9)
        const isValid = (phone.startsWith('7') || phone.startsWith('8') || phone.startsWith('9')) && phone.length === 10;
        resolve({ valid: isValid });
      }, 800);
    });
  },
  
  // Simulates sending an OTP to a phone number
  requestOTP: (phone: string): Promise<{success: boolean, expiresAt: Date}> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would trigger an SMS to be sent
        const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes from now
        resolve({ success: true, expiresAt });
      }, 1000);
    });
  },
  
  // Simulates verifying an OTP
  verifyOTP: (phone: string, otp: string, attempts: number): Promise<{success: boolean, token?: string, locked?: boolean, message?: string}> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // For testing: "123456" is always the "correct" OTP
        const isCorrect = otp === "123456";
        
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
            message: "Invalid OTP" 
          });
        }
      }, 800);
    });
  }
};

const phoneSchema = z.object({
  phone: z.string().min(10, "Phone number must be 10 digits").max(10, "Phone number must be 10 digits").regex(/^\d+$/, "Must contain only digits")
});

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits")
});

const GuardLogin = () => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState<string>('');
  const [otpExpiry, setOtpExpiry] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [lockdownEndTime, setLockdownEndTime] = useState<Date | null>(null);
  const [lockdownTimeLeft, setLockdownTimeLeft] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: '',
    },
  });
  
  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    // Timer for OTP expiry countdown
    if (otpExpiry && step === 'otp') {
      timer = setInterval(() => {
        const now = new Date();
        const diff = otpExpiry.getTime() - now.getTime();
        
        if (diff <= 0) {
          setTimeLeft(0);
          clearInterval(timer);
          toast({
            title: "OTP Expired",
            description: "Your one-time password has expired. Please request a new one.",
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
  }, [otpExpiry, step, isLocked, lockdownEndTime, toast]);

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
      
      // Phone is valid, request OTP
      const otpResult = await mockApi.requestOTP(data.phone);
      
      if (otpResult.success) {
        setPhone(data.phone);
        setOtpExpiry(otpResult.expiresAt);
        setStep('otp');
        toast({
          title: "OTP Sent",
          description: `A one-time password has been sent to ${data.phone}`,
        });
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleOTPSubmit = async (data: z.infer<typeof otpSchema>) => {
    try {
      setLoading(true);
      setError(null);
      
      if (isLocked) {
        setError("Account is locked. Please try again later.");
        setLoading(false);
        return;
      }
      
      if (otpExpiry && new Date() > otpExpiry) {
        setError("OTP expired. Please request a new one.");
        setLoading(false);
        return;
      }
      
      const verifyResult = await mockApi.verifyOTP(phone, data.otp, attempts);
      
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
          setError(verifyResult.message || "Invalid OTP");
          
          // Show how many attempts are left
          const attemptsLeft = 5 - (attempts + 1);
          if (attemptsLeft > 0) {
            toast({
              title: "Invalid OTP",
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

  const requestNewOTP = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const otpResult = await mockApi.requestOTP(phone);
      
      if (otpResult.success) {
        setOtpExpiry(otpResult.expiresAt);
        setAttempts(0);
        otpForm.reset();
        toast({
          title: "New OTP Sent",
          description: `A new one-time password has been sent to ${phone}`,
        });
      }
    } catch (err) {
      setError("Failed to request a new OTP. Please try again.");
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
              ? 'Enter your registered phone number to receive a one-time password.' 
              : `Enter the 6-digit code sent to ${phone.replace(/(\d{2})(\d{4})(\d{4})/, '$1****$3')}`}
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
            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(handleOTPSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <FormField
                    control={otpForm.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>One-Time Password</FormLabel>
                        <FormControl>
                          <InputOTP maxLength={6} {...field}>
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {timeLeft > 0 && (
                  <div className="flex items-center justify-center text-sm text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>OTP expires in {formatTime(timeLeft)}</span>
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
              {loading ? "Sending..." : "Send OTP"}
            </Button>
          ) : (
            <>
              <Button 
                className="w-full" 
                onClick={otpForm.handleSubmit(handleOTPSubmit)}
                disabled={loading || isLocked}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
              
              <div className="flex w-full justify-between text-sm">
                <Button 
                  variant="link" 
                  onClick={() => {
                    setStep('phone');
                    setAttempts(0);
                    otpForm.reset();
                  }}
                  disabled={loading}
                  className="px-0"
                >
                  Change Phone Number
                </Button>
                <Button 
                  variant="link" 
                  onClick={requestNewOTP}
                  disabled={loading || timeLeft > 0}
                  className="px-0"
                >
                  Resend OTP
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
