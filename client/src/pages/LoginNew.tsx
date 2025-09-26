import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, LogIn } from "lucide-react";
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

  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      toast({
        title: "Login Successful",
        description: "Welcome to PM-AJAY Dashboard",
      });
      // Navigation will be handled by the AuthProvider and routing
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
              <div className="grid grid-cols-1 gap-3">
                {[
                  { role: "Super Admin", description: "Complete system administration" },
                  { role: "Central Admin", description: "National-level oversight" },
                  { role: "State Nodal Admin", description: "State-level management" },
                  { role: "State SC Corporation Admin", description: "SC community programs" },
                  { role: "District Collector", description: "District coordination" },
                  { role: "District PACC Admin", description: "Project appraisal" },
                  { role: "Implementing Agency", description: "Project execution" },
                  { role: "Gram Panchayat User", description: "Village-level implementation" },
                  { role: "Contractor/Vendor", description: "Contract management" },
                  { role: "Auditor/Oversight", description: "Compliance monitoring" },
                  { role: "Technical Support", description: "System maintenance" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-medium text-gray-800">{item.role}</span>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
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
                    className="mt-1 bg-white text-gray-900 border-0 focus:ring-2 focus:ring-blue-300"
                    required
                  />
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
                      className="bg-white text-gray-900 border-0 focus:ring-2 focus:ring-blue-300 pr-10"
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

                <div className="text-center pt-4">
                  <p className="text-blue-100 text-sm">
                    Don't have an account?{" "}
                    <Link 
                      to="/register" 
                      className="text-white font-medium hover:underline"
                    >
                      Register here
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;