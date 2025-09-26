import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RefreshCw, Eye, EyeOff } from "lucide-react";
import govtEmblem from "@/assets/govt-emblem.png";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [captcha, setCaptcha] = useState("ABCD123");
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    captchaInput: ""
  });

  const refreshCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 7; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(result);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempt:", formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
      </div>

      <div className="w-full max-w-5xl relative z-10">
        {/* Registration Notice */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm p-4 mb-8 text-center">
          <p className="text-gray-700">
            All Institute or university have to send the signed{" "}
            <span className="text-blue-600 font-medium cursor-pointer hover:underline">
              REGISTRATION FORM
            </span>{" "}
            to email id <strong>pandey[dot]nishant[at]gov[dot]in</strong> to obtain the login details.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - User Categories */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-0">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <img 
                  src={govtEmblem} 
                  alt="Government of India" 
                  className="w-12 h-12 mr-4"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">PM-AJAY Portal</h3>
                  <p className="text-sm text-gray-600">Government of India</p>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-6 text-gray-800">
                Only following users should login:
              </h3>

              <div className="space-y-4">
                {[
                  "District checker/maker user of Grants-in-Aid",
                  "State checker/maker user of Grants-in-Aid", 
                  "District checker/maker user of Hostel",
                  "State checker/maker user of Hostel",
                  "State Institute/university",
                  "Central Institute/University"
                ].map((userType, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">{userType}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Right Side - Login Form */}
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg border-0">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-8 text-center">
                Login with 2-Step Authentication
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="userId" className="text-white/90 text-sm font-medium">
                    User Id
                  </Label>
                  <Input
                    id="userId"
                    type="text"
                    placeholder="User Id"
                    value={formData.userId}
                    onChange={(e) => handleInputChange("userId", e.target.value)}
                    className="mt-1 bg-white text-gray-900 border-0 focus:ring-2 focus:ring-blue-300"
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
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="bg-white text-gray-900 border-0 focus:ring-2 focus:ring-blue-300 pr-10"
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

                {/* Captcha */}
                <div>
                  <Label className="text-white/90 text-sm font-medium">
                    Captcha
                  </Label>
                  <div className="flex items-center space-x-3 mt-1">
                    <div className="bg-gray-800 px-4 py-2 rounded-md font-mono text-lg tracking-wider text-white flex-1 text-center">
                      {captcha}
                    </div>
                    <Button
                      type="button"
                      onClick={refreshCaptcha}
                      variant="outline"
                      size="sm"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                  <Input
                    type="text"
                    placeholder="Enter Captcha"
                    value={formData.captchaInput}
                    onChange={(e) => handleInputChange("captchaInput", e.target.value)}
                    className="mt-2 bg-white text-gray-900 border-0 focus:ring-2 focus:ring-blue-300"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    className="text-white/80 hover:text-white text-sm underline"
                  >
                    Forgot Password
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 rounded-md transition-colors"
                >
                  Continue
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;