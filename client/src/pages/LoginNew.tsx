import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, LogIn, Mail, Shield, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import govtEmblem from "@/assets/govt-emblem.png";
import pmAjayLogo from "@/assets/pm-ajay logo.png";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);

    try {
      console.log('Attempting login with:', formData.email);
      await login(formData.email, formData.password);
      console.log('Login successful, navigating to dashboard');
      toast({
        title: "Login Successful",
        description: "Welcome to PM-AJAY Dashboard",
        action: (
          <CheckCircle className="h-4 w-4 text-green-600" />
        ),
      });
      // Navigate to dashboard after successful login
      navigate('/dashboard');
    } catch (error: any) {
      const errorMessage = error.message || "Invalid credentials";
      toast({
        title: "Login Failed", 
        description: errorMessage,
        variant: "destructive",
        action: (
          <AlertCircle className="h-4 w-4 text-red-600" />
        ),
      });
      
      // Set specific field errors based on error type
      if (errorMessage.toLowerCase().includes('email')) {
        setErrors({ email: "Email not found or invalid" });
      } else if (errorMessage.toLowerCase().includes('password')) {
        setErrors({ password: "Incorrect password" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!forgotPasswordEmail) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotPasswordEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setForgotPasswordLoading(true);

    try {
      // Mock API call - replace with actual forgot password API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setResetEmailSent(true);
      toast({
        title: "Reset Email Sent",
        description: "Password reset instructions have been sent to your email",
        action: (
          <Mail className="h-4 w-4 text-blue-600" />
        ),
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const getRoleDisplayName = (role: string) => {
    const roleMap: { [key: string]: string } = {
      'super_admin': 'Super Admin',
      'central_admin': 'Central Admin',
      'state_nodal_admin': 'State Nodal Admin',
      'state_sc_corporation_admin': 'State SC Corporation Admin',
      'state_treasury': 'State Treasury',
      'district_collector': 'District Collector',
      'district_pacc_admin': 'District PACC Admin',
      'implementing_agency_user': 'Implementing Agency',
      'gram_panchayat_user': 'Gram Panchayat User',
      'contractor_vendor': 'Contractor/Vendor',
      'auditor_oversight': 'Auditor/Oversight',
      'technical_support_group': 'Technical Support'
    };
    return roleMap[role] || role;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
      </div>

      <div className="w-full max-w-6xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <img 
              src={pmAjayLogo} 
              alt="PM-AJAY Logo" 
              className="h-20 w-20 object-contain bg-white rounded-full p-2 shadow-lg mr-4"
            />
            <div className="text-left">
              <h1 className="text-3xl font-bold text-blue-900">
                Pradhan Mantri Anusuchit Jaati Abhyuday Yojna
              </h1>
              <h2 className="text-xl font-semibold text-orange-600">(PM-AJAY)</h2>
              <p className="text-gray-600 mt-1">
                Department of Social Justice & Empowerment, Government of India
              </p>
            </div>
            
          </div>
          {/* Registration Notice */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm p-4 mb-8 text-center">
          <p className="text-gray-700">
            All Institute or university have to send the signed{" "}
            <span className="text-blue-600 font-medium cursor-pointer hover:underline">
              REGISTRATION FORM
            </span>{" "}
            to email id <strong>Singh[dot]Ramesh[at]gov[dot]in</strong> to obtain the login details.
          </p>
        </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Side - Role Information */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
                <img 
                  src={govtEmblem} 
                  alt="Government of India" 
                  className="w-8 h-8 mr-3"
                />
                Authorized User Roles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Central Level */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-blue-900 mb-3 border-b border-blue-200 pb-1">
                  Central Level
                </h3>
                <div className="space-y-2">
                  {[
                    { role: "Ministry of Social Justice & Empowerment", description: "Central government oversight", email: "central.admin@pmajay.gov.in" },
                    { role: "Technical Support Group", description: "Technical assistance & guidance", email: "tech.support@pmajay.gov.in" }
                  ].map((item, index) => (
                    <div key={`central-${index}`} className="flex items-start p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-800">{item.role}</span>
                          <button
                            onClick={() => {
                              setFormData({ email: item.email, password: "123123" });
                            }}
                            className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                          >
                            Use Demo
                          </button>
                        </div>
                        <p className="text-sm text-gray-600">{item.description}</p>
                        <p className="text-xs text-gray-500 mt-1 font-mono">{item.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* State Level */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-green-900 mb-3 border-b border-green-200 pb-1">
                  State Level
                </h3>
                <div className="space-y-2">
                  {[
                    { role: "State Nodal Agency", description: "State-level program coordination", email: "state.nodal@maharashtra.gov.in" },
                    { role: "State Treasury", description: "Fund management & disbursement", email: "treasury@maharashtra.gov.in" },
                    { role: "State SC Corporation", description: "SC community program management", email: "sc.corp@maharashtra.gov.in" }
                  ].map((item, index) => (
                    <div key={`state-${index}`} className="flex items-start p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                      <div className="w-2 h-2 bg-green-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-800">{item.role}</span>
                          <button
                            onClick={() => {
                              setFormData({ email: item.email, password: "123123" });
                            }}
                            className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition-colors"
                          >
                            Use Demo
                          </button>
                        </div>
                        <p className="text-sm text-gray-600">{item.description}</p>
                        <p className="text-xs text-gray-500 mt-1 font-mono">{item.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* District Level */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-orange-900 mb-3 border-b border-orange-200 pb-1">
                  District Level
                </h3>
                <div className="space-y-2">
                  {[
                    { role: "District Collector", description: "District administration & coordination", email: "collector@mumbai.gov.in" },
                    { role: "District PACC", description: "Project Appraisal & Convergence Committee", email: "pacc@mumbai.gov.in" }
                  ].map((item, index) => (
                    <div key={`district-${index}`} className="flex items-start p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                      <div className="w-2 h-2 bg-orange-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-800">{item.role}</span>
                          <button
                            onClick={() => {
                              setFormData({ email: item.email, password: "123123" });
                            }}
                            className="text-xs bg-orange-500 text-white px-2 py-1 rounded hover:bg-orange-600 transition-colors"
                          >
                            Use Demo
                          </button>
                        </div>
                        <p className="text-sm text-gray-600">{item.description}</p>
                        <p className="text-xs text-gray-500 mt-1 font-mono">{item.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Local Level */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-purple-900 mb-3 border-b border-purple-200 pb-1">
                  Local Level
                </h3>
                <div className="space-y-2">
                  {[
                    { role: "Gram Panchayat", description: "Village-level implementation & monitoring", email: "gp@govandi.gov.in" }
                  ].map((item, index) => (
                    <div key={`local-${index}`} className="flex items-start p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-800">{item.role}</span>
                          <button
                            onClick={() => {
                              setFormData({ email: item.email, password: "123123" });
                            }}
                            className="text-xs bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600 transition-colors"
                          >
                            Use Demo
                          </button>
                        </div>
                        <p className="text-sm text-gray-600">{item.description}</p>
                        <p className="text-xs text-gray-500 mt-1 font-mono">{item.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> Each role has specific permissions and access levels. 
                  Contact your system administrator for role assignment or access issues.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Right Side - Login Form */}
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Login to PM-AJAY Portal
              </CardTitle>
              <p className="text-center text-blue-100">
                Access your role-based dashboard
              </p>
              
            </CardHeader>
            <CardContent>
              {!showForgotPassword ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="email" className="text-white/90 text-sm font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`mt-1 bg-white text-gray-900 border-0 focus:ring-2 focus:ring-blue-300 ${
                        errors.email ? 'border-red-500 focus:ring-red-300' : ''
                      }`}
                      required
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-200 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="password" className="text-white/90 text-sm font-medium">
                      Password
                    </Label>
                    <div className="relative mt-1">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className={`bg-white text-gray-900 border-0 focus:ring-2 focus:ring-blue-300 pr-10 ${
                          errors.password ? 'border-red-500 focus:ring-red-300' : ''
                        }`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-200 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-blue-200 hover:text-white underline"
                    >
                      Forgot Password?
                    </button>
                    <div className="flex items-center text-sm text-blue-200">
                      <Shield className="w-4 h-4 mr-1" />
                      Secure Login
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-white text-blue-700 hover:bg-gray-100 font-medium py-3 rounded-md transition-colors flex items-center justify-center"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-700"></div>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4 mr-2" />
                        Login to Dashboard
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                // Forgot Password Form
                <div className="space-y-6">
                  {!resetEmailSent ? (
                    <form onSubmit={handleForgotPassword}>
                      <div className="text-center mb-4">
                        <h3 className="text-xl font-semibold text-white mb-2">Reset Password</h3>
                        <p className="text-blue-100 text-sm">
                          Enter your email address and we'll send you instructions to reset your password.
                        </p>
                      </div>
                      
                      <div>
                        <Label htmlFor="forgotEmail" className="text-white/90 text-sm font-medium">
                          Email Address
                        </Label>
                        <Input
                          id="forgotEmail"
                          type="email"
                          placeholder="Enter your registered email"
                          value={forgotPasswordEmail}
                          onChange={(e) => setForgotPasswordEmail(e.target.value)}
                          className="mt-1 bg-white text-gray-900 border-0 focus:ring-2 focus:ring-blue-300"
                          required
                        />
                      </div>

                      <div className="flex space-x-3 mt-6">
                        <Button
                          type="button"
                          onClick={() => {
                            setShowForgotPassword(false);
                            setForgotPasswordEmail("");
                            setResetEmailSent(false);
                          }}
                          variant="outline"
                          className="flex-1 border-white text-white hover:bg-white hover:text-blue-700"
                        >
                          Back to Login
                        </Button>
                        <Button
                          type="submit"
                          disabled={forgotPasswordLoading}
                          className="flex-1 bg-white text-blue-700 hover:bg-gray-100"
                        >
                          {forgotPasswordLoading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"></div>
                          ) : (
                            <>
                              <Mail className="w-4 h-4 mr-2" />
                              Send Reset Email
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    // Reset Email Sent Confirmation
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">Email Sent!</h3>
                      <p className="text-blue-100 text-sm">
                        Password reset instructions have been sent to<br />
                        <strong>{forgotPasswordEmail}</strong>
                      </p>
                      <p className="text-blue-200 text-xs">
                        Didn't receive the email? Check your spam folder or contact technical support.
                      </p>
                      <Button
                        onClick={() => {
                          setShowForgotPassword(false);
                          setForgotPasswordEmail("");
                          setResetEmailSent(false);
                        }}
                        variant="outline"
                        className="mt-4 border-white text-white hover:bg-white hover:text-blue-700"
                      >
                        Back to Login
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;