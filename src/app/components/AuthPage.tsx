import { useState } from 'react';
import { User } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { GoogleLogin } from '@react-oauth/google';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Building2, LogIn, UserPlus, AlertCircle, CheckCircle2, Mail, Lock, User as UserIcon, BadgeCheck, Phone, ArrowLeft } from 'lucide-react';
import { mockUsers } from '../data/mockData';
import { toast } from 'sonner';

interface AuthPageProps {
  onLogin: (user: User) => void;
  onBack?: () => void;
}

type ForgotPasswordStep = 'email' | 'verification' | 'reset' | 'success';

export function AuthPage({ onLogin, onBack }: AuthPageProps) {
  const [activeTab, setActiveTab] = useState('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginConfirm, setShowLoginConfirm] = useState(false);
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  // Sign In State
  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
    role: 'employee' as 'employee' | 'admin',
  });
  const [signInError, setSignInError] = useState('');

  // Register State
  const [registerData, setRegisterData] = useState({
    employeeId: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'admin' as 'employee' | 'admin',
  });
  const [registerError, setRegisterError] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [showEmailOTPDialog, setShowEmailOTPDialog] = useState(false);
  const [emailOTP, setEmailOTP] = useState('');
  const [generatedEmailOTP, setGeneratedEmailOTP] = useState('');
  const [enteredEmailOTP, setEnteredEmailOTP] = useState('');
  const [showPhoneOTPDialog, setShowPhoneOTPDialog] = useState(false);
  const [generatedPhoneOTP, setGeneratedPhoneOTP] = useState('');
  const [enteredPhoneOTP, setEnteredPhoneOTP] = useState('');

  // Forgot Password State
  const [forgotPasswordStep, setForgotPasswordStep] = useState<ForgotPasswordStep>('email');
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: '',
    phone: '',
    verificationMethod: 'email' as 'email' | 'phone',
    verificationCode: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [forgotPasswordErrors, setForgotPasswordErrors] = useState<string[]>([]);

  // Password validation rules
  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 8) errors.push('At least 8 characters');
    if (!/[A-Z]/.test(password)) errors.push('One uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('One lowercase letter');
    if (!/[0-9]/.test(password)) errors.push('One number');
    if (!/[!@#$%^&*]/.test(password)) errors.push('One special character (!@#$%^&*)');
    return errors;
  };

  // Handle Sign In
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSignInError('');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = mockUsers.find(u => 
      u.email === signInData.email && 
      u.role === signInData.role
    );

    if (user) {
      setPendingUser(user);
      setShowLoginConfirm(true);
    } else {
      setSignInError(`Invalid credentials or incorrect role. Please check your ${signInData.role === 'employee' ? 'Employee' : 'HR Admin'} credentials.`);
      toast.error('Login failed', {
        description: 'Invalid credentials or role mismatch',
      });
    }
    
    setIsLoading(false);
  };

  // Handle Google Sign In
  const handleGoogleSignIn = (credentialResponse: any) => {
    try {
      // Decode the JWT token from Google
      const decoded = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
      
      // Create user from Google credentials
      const googleUser: User = {
        id: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        role: 'employee',
        department: 'General',
        position: 'Employee',
        phone: '+1-555-0000',
        joiningDate: new Date().toISOString(),
        profileImage: decoded.picture,
      };
      
      setPendingUser(googleUser);
      setShowLoginConfirm(true);
      
      toast.success('Google authentication successful', {
        description: `Welcome, ${googleUser.name}!`,
      });
    } catch (error) {
      toast.error('Google Sign-In failed', {
        description: 'Unable to authenticate with Google',
      });
    }
  };

  const handleGoogleError = () => {
    toast.error('Google Sign-In failed', {
      description: 'Unable to authenticate with Google',
    });
  };

  // Confirm Login
  const confirmLogin = () => {
    if (pendingUser) {
      toast.success('Login successful!', {
        description: `Welcome back, ${pendingUser.name}!`,
      });
      onLogin(pendingUser);
    }
    setShowLoginConfirm(false);
    setPendingUser(null);
  };

  // Cancel Login
  const cancelLogin = () => {
    setShowLoginConfirm(false);
    setPendingUser(null);
    setIsLoading(false);
  };

  // Send Email OTP for Registration
  const handleSendEmailOTP = async () => {
    if (!registerData.email || !/\S+@\S+\.\S+/.test(registerData.email)) {
      toast.error('Invalid email', {
        description: 'Please enter a valid email address',
      });
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate OTP (in real app, this would be sent by backend)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedEmailOTP(otp);
    setEnteredEmailOTP('');

    toast.success('Verification code sent!', {
      description: `Check your email inbox. Demo OTP: ${otp}`,
      duration: 10000,
    });

    setShowEmailOTPDialog(true);
    setIsLoading(false);
  };

  const handleSendPhoneOTP = async () => {
    if (!/^[0-9]{10}$/.test(registerData.phone)) {
      toast.error('Invalid phone number', {
        description: 'Enter a 10-digit phone number without spaces',
      });
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedPhoneOTP(otp);
    setEnteredPhoneOTP('');

    toast.success('Verification code sent!', {
      description: `Check your phone messages. Demo OTP: ${otp}`,
      duration: 10000,
    });

    setShowPhoneOTPDialog(true);
    setIsLoading(false);
  };

  // Verify Email OTP
  const handleVerifyEmailOTP = async () => {
    if (enteredEmailOTP !== generatedEmailOTP) {
      toast.error('Invalid code', {
        description: 'The verification code you entered is incorrect',
      });
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    setEmailVerified(true);
    setShowEmailOTPDialog(false);
    
    toast.success('Email verified!', {
      description: 'You can now complete your registration',
    });
    
    setIsLoading(false);
  };

  const handleVerifyPhoneOTP = async () => {
    if (enteredPhoneOTP !== generatedPhoneOTP) {
      toast.error('Invalid code', {
        description: 'The verification code you entered is incorrect',
      });
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    setPhoneVerified(true);
    setShowPhoneOTPDialog(false);
    
    toast.success('Phone verified!', {
      description: 'You can now complete your registration',
    });
    
    setIsLoading(false);
  };

  // Resend Email OTP
  const handleResendEmailOTP = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedEmailOTP(otp);
    setEnteredEmailOTP('');

    toast.success('New code sent!', {
      description: `Check your email inbox. Demo OTP: ${otp}`,
      duration: 10000,
    });

    setIsLoading(false);
  };

  const handleResendPhoneOTP = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedPhoneOTP(otp);
    setEnteredPhoneOTP('');

    toast.success('New code sent!', {
      description: `Check your phone messages. Demo OTP: ${otp}`,
      duration: 10000,
    });

    setIsLoading(false);
  };

  // Close Email OTP Dialog
  const closeEmailOTPDialog = () => {
    setShowEmailOTPDialog(false);
    setEnteredEmailOTP('');
    setGeneratedEmailOTP('');
  };

  const closePhoneOTPDialog = () => {
    setShowPhoneOTPDialog(false);
    setEnteredPhoneOTP('');
    setGeneratedPhoneOTP('');
  };

  // Handle Registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setRegisterError('');

    // Validate password
    const errors = validatePassword(registerData.password);
    if (errors.length > 0) {
      setRegisterError('Password does not meet security requirements');
      setIsLoading(false);
      return;
    }

    // Check password match
    if (registerData.password !== registerData.confirmPassword) {
      setRegisterError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Check email verification
    if (!emailVerified) {
      setRegisterError('Please verify your email address before registering');
      setIsLoading(false);
      return;
    }

    // Check phone verification
    if (!phoneVerified) {
      setRegisterError('Please verify your phone number before registering');
      setIsLoading(false);
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success('Registration successful!', {
      description: 'Please sign in with your credentials',
    });

    // Reset registration form and switch to sign in
    setRegisterData({
      employeeId: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'admin',
    });
    setEmailVerified(false);
    setPhoneVerified(false);
    setPasswordErrors([]);
    setEnteredPhoneOTP('');
    setGeneratedPhoneOTP('');
    
    // Switch to sign in tab
    setActiveTab('signin');
    setSignInData({ email: registerData.email, password: '', role: registerData.role });
    setIsLoading(false);
  };

  // Handle Forgot Password
  const handleForgotPassword = () => {
    setForgotPasswordStep('email');
    setForgotPasswordData({
      email: signInData.email,
      phone: '',
      verificationMethod: 'email',
      verificationCode: '',
      newPassword: '',
      confirmNewPassword: '',
    });
    setGeneratedOTP('');
    setForgotPasswordErrors([]);
    setShowForgotPassword(true);
  };

  // Step 1: Submit email/phone for verification
  const handleSendVerification = async () => {
    const { email, phone, verificationMethod } = forgotPasswordData;

    if (verificationMethod === 'email') {
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        toast.error('Invalid email', {
          description: 'Please enter a valid email address',
        });
        return;
      }
    } else {
      if (!phone || !/^\d{10}$/.test(phone)) {
        toast.error('Invalid phone number', {
          description: 'Please enter a valid 10-digit phone number',
        });
        return;
      }
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate OTP (in real app, this would be sent by backend)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOTP(otp);

    toast.success('Verification code sent!', {
      description: `Check your ${verificationMethod === 'email' ? 'email inbox' : 'phone messages'}. Demo OTP: ${otp}`,
      duration: 10000,
    });

    setForgotPasswordStep('verification');
    setIsLoading(false);
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async () => {
    if (forgotPasswordData.verificationCode !== generatedOTP) {
      toast.error('Invalid code', {
        description: 'The verification code you entered is incorrect',
      });
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    toast.success('Code verified!', {
      description: 'You can now set a new password',
    });

    setForgotPasswordStep('reset');
    setIsLoading(false);
  };

  // Step 3: Reset Password
  const handleResetPassword = async () => {
    const { newPassword, confirmNewPassword } = forgotPasswordData;

    // Validate password
    const errors = validatePassword(newPassword);
    if (errors.length > 0) {
      toast.error('Weak password', {
        description: 'Password does not meet security requirements',
      });
      return;
    }

    // Check password match
    if (newPassword !== confirmNewPassword) {
      toast.error('Passwords do not match', {
        description: 'Please ensure both passwords are identical',
      });
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success('Password reset successful!', {
      description: 'You can now sign in with your new password',
    });

    setForgotPasswordStep('success');
    setIsLoading(false);
  };

  // Close forgot password dialog and reset
  const closeForgotPassword = () => {
    setShowForgotPassword(false);
    setForgotPasswordStep('email');
    setForgotPasswordData({
      email: '',
      phone: '',
      verificationMethod: 'email',
      verificationCode: '',
      newPassword: '',
      confirmNewPassword: '',
    });
    setGeneratedOTP('');
    setForgotPasswordErrors([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        {onBack && (
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-4 hover:bg-purple-50"
          >
            ← Back to Home
          </Button>
        )}

        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl mb-4 shadow-lg">
            <Building2 className="size-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Dayflow HRMS
          </h1>
        </div>

        {/* Auth Card */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center">Authentication</CardTitle>
            <CardDescription className="text-center">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              {/* Sign In Tab */}
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  {signInError && (
                    <Alert variant="destructive">
                      <AlertCircle className="size-4" />
                      <AlertDescription>{signInError}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="signin-role">
                      <UserIcon className="size-4 inline mr-2" />
                      Role
                    </Label>
                    <Select
                      value={signInData.role}
                      onValueChange={(value: 'employee' | 'admin') => 
                        setSignInData({ ...signInData, role: value })
                      }
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employee">Employee</SelectItem>
                        <SelectItem value="admin">HR Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-email">
                      <Mail className="size-4 inline mr-2" />
                      Email Address
                    </Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="your.email@company.com"
                      value={signInData.email}
                      onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="signin-password">
                        <Lock className="size-4 inline mr-2" />
                        Password
                      </Label>
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-xs text-purple-600 hover:text-purple-700 hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      value={signInData.password}
                      onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                      required
                      className="h-11"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full h-11 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
                  >
                    {isLoading ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <LogIn className="size-4 mr-2" />
                        Sign In
                      </>
                    )}
                  </Button>

                  <div className="text-center text-sm text-gray-600">
                    <span className="mr-1">Don't have an account?</span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('register')}
                      className="font-semibold text-purple-600 hover:text-purple-700"
                    >
                      Sign up
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-3 bg-white text-gray-500 font-medium">Or continue with</span>
                    </div>
                  </div>

                  {/* Google Sign In Button */}
                  <div className="w-full flex justify-center">
                    <GoogleLogin
                      onSuccess={handleGoogleSignIn}
                      onError={handleGoogleError}
                      theme="outline"
                      size="large"
                      width="100%"
                    />
                  </div>

                  {/* Demo Credentials */}
                  <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <p className="text-xs font-semibold text-purple-900 mb-2">Password rules:</p>
                    <div className="text-xs text-purple-700 space-y-2">
                      <div className="space-y-1">
                        
                        <p>Use at least 8 characters for your password.</p>
                        <p>Change your password often to limit the time a password could be compromised.</p>
                        <p>Mix letters, numbers, and symbols to create a complex password</p>
                        <p>Don't Let Your Browser Save Your Passwords (Without a Master Password)</p>
                      </div>
                      <div className="space-y-1 pt-2 border-t border-purple-200">
                       
                        
                      </div>
                    </div>
                  </div>
                </form>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  {registerError && (
                    <Alert variant="destructive">
                      <AlertCircle className="size-4" />
                      <AlertDescription>{registerError}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="register-role">
                      <UserIcon className="size-4 inline mr-2" />
                      Role (HR Admin only)
                    </Label>
                    <Select
                      value={registerData.role}
                      onValueChange={(value: 'employee' | 'admin') => 
                        setRegisterData({ ...registerData, role: value })
                      }
                      disabled
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">HR Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-employeeId">
                      <BadgeCheck className="size-4 inline mr-2" />
                      Employee ID
                    </Label>
                    <Input
                      id="register-employeeId"
                      type="text"
                      placeholder="EMP001"
                      value={registerData.employeeId}
                      onChange={(e) => setRegisterData({ ...registerData, employeeId: e.target.value })}
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-phone">
                      <Phone className="size-4 inline mr-2" />
                      Phone Number
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="register-phone"
                        type="tel"
                        placeholder="1234567890"
                        value={registerData.phone}
                        onChange={(e) => {
                          setRegisterData({ ...registerData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) });
                          setPhoneVerified(false);
                        }}
                        required
                        className="h-11 flex-1"
                        maxLength={10}
                      />
                      <Button
                        type="button"
                        variant={phoneVerified ? "default" : "outline"}
                        onClick={handleSendPhoneOTP}
                        disabled={isLoading || phoneVerified || registerData.phone.length !== 10}
                        className="h-11"
                      >
                        {phoneVerified ? (
                          <CheckCircle2 className="size-4" />
                        ) : (
                          'Verify'
                        )}
                      </Button>
                    </div>
                    {phoneVerified && (
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle2 className="size-3" />
                        Phone verified successfully
                      </p>
                    )}
                    {!phoneVerified && registerData.phone && registerData.phone.length !== 10 && (
                      <p className="text-xs text-red-600">Enter a valid 10-digit number</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">
                      <Mail className="size-4 inline mr-2" />
                      Email Address
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="your.email@company.com"
                        value={registerData.email}
                        onChange={(e) => {
                          setRegisterData({ ...registerData, email: e.target.value });
                          setEmailVerified(false);
                        }}
                        required
                        className="h-11 flex-1"
                      />
                      <Button
                        type="button"
                        variant={emailVerified ? "default" : "outline"}
                        onClick={handleSendEmailOTP}
                        disabled={isLoading || emailVerified || !registerData.email}
                        className="h-11"
                      >
                        {emailVerified ? (
                          <CheckCircle2 className="size-4" />
                        ) : (
                          'Verify'
                        )}
                      </Button>
                    </div>
                    {emailVerified && (
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle2 className="size-3" />
                        Email verified successfully
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">
                      <Lock className="size-4 inline mr-2" />
                      Password
                    </Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerData.password}
                      onChange={(e) => {
                        setRegisterData({ ...registerData, password: e.target.value });
                        setPasswordErrors(validatePassword(e.target.value));
                      }}
                      required
                      className="h-11"
                    />
                    {registerData.password && passwordErrors.length > 0 && (
                      <div className="text-xs text-gray-600 space-y-1 mt-2">
                        <p className="font-semibold">Password must contain:</p>
                        {passwordErrors.map((error, index) => (
                          <p key={index} className="text-red-600">• {error}</p>
                        ))}
                      </div>
                    )}
                    {registerData.password && passwordErrors.length === 0 && (
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle2 className="size-3" />
                        Password meets all requirements
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-confirmPassword">
                      <Lock className="size-4 inline mr-2" />
                      Confirm Password
                    </Label>
                    <Input
                      id="register-confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      required
                      className="h-11"
                    />
                    {registerData.confirmPassword && registerData.password !== registerData.confirmPassword && (
                      <p className="text-xs text-red-600">Passwords do not match</p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isLoading || passwordErrors.length > 0 || !emailVerified || !phoneVerified}
                    className="w-full h-11 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
                  >
                    {isLoading ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <UserPlus className="size-4 mr-2" />
                        Create Account
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>© 2026 Dayflow HRMS. Secure & Professional.</p>
        </div>
      </div>

      {/* Login Confirmation Dialog */}
      <AlertDialog open={showLoginConfirm} onOpenChange={setShowLoginConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Login</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingUser && (
                <>
                  You are signing in as <strong>{pendingUser.name}</strong> ({pendingUser.role === 'admin' ? 'HR Admin' : 'Employee'}).
                  <br />
                  Do you want to continue?
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelLogin}>No, Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmLogin}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Yes, Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Email OTP Verification Dialog for Registration */}
      <AlertDialog open={showEmailOTPDialog} onOpenChange={setShowEmailOTPDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Verify Your Email</AlertDialogTitle>
            <AlertDialogDescription>
              Enter the 6-digit verification code sent to{' '}
              <strong>{registerData.email}</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-otp">Verification Code</Label>
              <Input
                id="email-otp"
                type="text"
                placeholder="000000"
                value={enteredEmailOTP}
                onChange={(e) =>
                  setEnteredEmailOTP(e.target.value.replace(/\D/g, '').slice(0, 6))
                }
                className="h-11 text-center text-2xl tracking-widest"
                maxLength={6}
              />
              <p className="text-xs text-gray-500 text-center">
                Demo OTP: <strong>{generatedEmailOTP}</strong>
              </p>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendEmailOTP}
                className="text-sm text-purple-600 hover:text-purple-700 hover:underline"
                disabled={isLoading}
              >
                Resend Code
              </button>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeEmailOTPDialog}>Cancel</AlertDialogCancel>
            <Button
              onClick={handleVerifyEmailOTP}
              disabled={isLoading || enteredEmailOTP.length !== 6}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Phone OTP Verification Dialog for Registration */}
      <AlertDialog open={showPhoneOTPDialog} onOpenChange={setShowPhoneOTPDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Verify Your Phone</AlertDialogTitle>
            <AlertDialogDescription>
              Enter the 6-digit verification code sent to <strong>{registerData.phone}</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone-otp">Verification Code</Label>
              <Input
                id="phone-otp"
                type="text"
                placeholder="000000"
                value={enteredPhoneOTP}
                onChange={(e) =>
                  setEnteredPhoneOTP(e.target.value.replace(/\D/g, '').slice(0, 6))
                }
                className="h-11 text-center text-2xl tracking-widest"
                maxLength={6}
              />
              <p className="text-xs text-gray-500 text-center">
                Demo OTP: <strong>{generatedPhoneOTP}</strong>
              </p>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendPhoneOTP}
                className="text-sm text-purple-600 hover:text-purple-700 hover:underline"
                disabled={isLoading}
              >
                Resend Code
              </button>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={closePhoneOTPDialog}>Cancel</AlertDialogCancel>
            <Button
              onClick={handleVerifyPhoneOTP}
              disabled={isLoading || enteredPhoneOTP.length !== 6}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isLoading ? 'Verifying...' : 'Verify Phone'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Forgot Password Dialog with Multi-Step Flow */}
      <AlertDialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {forgotPasswordStep !== 'email' && forgotPasswordStep !== 'success' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (forgotPasswordStep === 'verification') setForgotPasswordStep('email');
                    if (forgotPasswordStep === 'reset') setForgotPasswordStep('verification');
                  }}
                  className="p-0 h-auto hover:bg-transparent"
                >
                  <ArrowLeft className="size-4" />
                </Button>
              )}
              <span>
                {forgotPasswordStep === 'email' && 'Reset Password'}
                {forgotPasswordStep === 'verification' && 'Verify Code'}
                {forgotPasswordStep === 'reset' && 'Set New Password'}
                {forgotPasswordStep === 'success' && 'Password Reset Complete'}
              </span>
            </AlertDialogTitle>
          </AlertDialogHeader>

          {/* Step 1: Email/Phone Selection */}
          {forgotPasswordStep === 'email' && (
            <div className="space-y-4">
              <AlertDialogDescription>
                Choose how you'd like to receive your verification code
              </AlertDialogDescription>

              <div className="space-y-2">
                <Label>Verification Method</Label>
                <Select
                  value={forgotPasswordData.verificationMethod}
                  onValueChange={(value: 'email' | 'phone') =>
                    setForgotPasswordData({ ...forgotPasswordData, verificationMethod: value })
                  }
                >
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">
                      <div className="flex items-center gap-2">
                        <Mail className="size-4" />
                        Email Address
                      </div>
                    </SelectItem>
                    <SelectItem value="phone">
                      <div className="flex items-center gap-2">
                        <Phone className="size-4" />
                        Phone Number
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {forgotPasswordData.verificationMethod === 'email' ? (
                <div className="space-y-2">
                  <Label htmlFor="forgot-email">
                    <Mail className="size-4 inline mr-2" />
                    Email Address
                  </Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="your.email@company.com"
                    value={forgotPasswordData.email}
                    onChange={(e) =>
                      setForgotPasswordData({ ...forgotPasswordData, email: e.target.value })
                    }
                    className="h-11"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="forgot-phone">
                    <Phone className="size-4 inline mr-2" />
                    Phone Number
                  </Label>
                  <Input
                    id="forgot-phone"
                    type="tel"
                    placeholder="1234567890"
                    value={forgotPasswordData.phone}
                    onChange={(e) =>
                      setForgotPasswordData({ ...forgotPasswordData, phone: e.target.value })
                    }
                    className="h-11"
                    maxLength={10}
                  />
                  <p className="text-xs text-gray-500">Enter 10-digit phone number without spaces</p>
                </div>
              )}

              <AlertDialogFooter>
                <AlertDialogCancel onClick={closeForgotPassword}>Cancel</AlertDialogCancel>
                <Button
                  onClick={handleSendVerification}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {isLoading ? 'Sending...' : 'Send Code'}
                </Button>
              </AlertDialogFooter>
            </div>
          )}

          {/* Step 2: Verification Code */}
          {forgotPasswordStep === 'verification' && (
            <div className="space-y-4">
              <AlertDialogDescription>
                Enter the 6-digit verification code sent to{' '}
                <strong>
                  {forgotPasswordData.verificationMethod === 'email'
                    ? forgotPasswordData.email
                    : forgotPasswordData.phone}
                </strong>
              </AlertDialogDescription>

              <div className="space-y-2">
                <Label htmlFor="verification-code">Verification Code</Label>
                <Input
                  id="verification-code"
                  type="text"
                  placeholder="000000"
                  value={forgotPasswordData.verificationCode}
                  onChange={(e) =>
                    setForgotPasswordData({
                      ...forgotPasswordData,
                      verificationCode: e.target.value.replace(/\D/g, '').slice(0, 6),
                    })
                  }
                  className="h-11 text-center text-2xl tracking-widest"
                  maxLength={6}
                />
                <p className="text-xs text-gray-500 text-center">
                  Demo OTP: <strong>{generatedOTP}</strong>
                </p>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleSendVerification}
                  className="text-sm text-purple-600 hover:text-purple-700 hover:underline"
                  disabled={isLoading}
                >
                  Resend Code
                </button>
              </div>

              <AlertDialogFooter>
                <AlertDialogCancel onClick={closeForgotPassword}>Cancel</AlertDialogCancel>
                <Button
                  onClick={handleVerifyOTP}
                  disabled={isLoading || forgotPasswordData.verificationCode.length !== 6}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {isLoading ? 'Verifying...' : 'Verify Code'}
                </Button>
              </AlertDialogFooter>
            </div>
          )}

          {/* Step 3: Set New Password */}
          {forgotPasswordStep === 'reset' && (
            <div className="space-y-4">
              <AlertDialogDescription>
                Create a strong password for your account
              </AlertDialogDescription>

              <div className="space-y-2">
                <Label htmlFor="new-password">
                  <Lock className="size-4 inline mr-2" />
                  New Password
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  value={forgotPasswordData.newPassword}
                  onChange={(e) => {
                    setForgotPasswordData({ ...forgotPasswordData, newPassword: e.target.value });
                    setForgotPasswordErrors(validatePassword(e.target.value));
                  }}
                  className="h-11"
                />
                {forgotPasswordData.newPassword && forgotPasswordErrors.length > 0 && (
                  <div className="text-xs text-gray-600 space-y-1 mt-2">
                    <p className="font-semibold">Password must contain:</p>
                    {forgotPasswordErrors.map((error, index) => (
                      <p key={index} className="text-red-600">• {error}</p>
                    ))}
                  </div>
                )}
                {forgotPasswordData.newPassword && forgotPasswordErrors.length === 0 && (
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <CheckCircle2 className="size-3" />
                    Password meets all requirements
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-new-password">
                  <Lock className="size-4 inline mr-2" />
                  Confirm New Password
                </Label>
                <Input
                  id="confirm-new-password"
                  type="password"
                  placeholder="••••••••"
                  value={forgotPasswordData.confirmNewPassword}
                  onChange={(e) =>
                    setForgotPasswordData({ ...forgotPasswordData, confirmNewPassword: e.target.value })
                  }
                  className="h-11"
                />
                {forgotPasswordData.confirmNewPassword &&
                  forgotPasswordData.newPassword !== forgotPasswordData.confirmNewPassword && (
                    <p className="text-xs text-red-600">Passwords do not match</p>
                  )}
              </div>

              <AlertDialogFooter>
                <AlertDialogCancel onClick={closeForgotPassword}>Cancel</AlertDialogCancel>
                <Button
                  onClick={handleResetPassword}
                  disabled={
                    isLoading ||
                    forgotPasswordErrors.length > 0 ||
                    forgotPasswordData.newPassword !== forgotPasswordData.confirmNewPassword ||
                    !forgotPasswordData.newPassword
                  }
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </Button>
              </AlertDialogFooter>
            </div>
          )}

          {/* Step 4: Success */}
          {forgotPasswordStep === 'success' && (
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="size-8 text-green-600" />
                </div>
              </div>
              <AlertDialogDescription>
                Your password has been successfully reset. You can now sign in with your new password.
              </AlertDialogDescription>
              <AlertDialogFooter>
                <Button
                  onClick={closeForgotPassword}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Go to Sign In
                </Button>
              </AlertDialogFooter>
            </div>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
