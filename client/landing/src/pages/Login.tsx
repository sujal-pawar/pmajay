import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [captcha] = useState("d-e_u7d"); // Mock captcha
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    captcha: "",
  });

  const userTypes = [
    "District checker/maker user of Grants-in-Aid",
    "State checker/maker user of Grants-in-Aid", 
    "District checker/maker user of Hostel",
    "State checker/maker user of Hostel",
    "State Institute/university",
    "Central Institute/University",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="relative min-h-[calc(100vh-200px)] bg-gradient-hero">
        <div className="absolute inset-0 bg-muted/30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Registration Notice */}
          <Card className="mb-8 bg-card shadow-card">
            <CardContent className="p-6 text-center">
              <p className="text-foreground">
                All Institute or university have to send the signed{" "}
                <Link to="/registration-form" className="text-primary font-semibold hover:underline">
                  REGISTRATION FORM
                </Link>{" "}
                to email id{" "}
                <span className="font-mono text-primary">
                  pandey[dot]nishant[at]gov[dot]in
                </span>{" "}
                obtain the login details.
              </p>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* User Types */}
            <Card className="bg-card shadow-card">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-center">
                  Only following users should login:
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userTypes.map((type, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                    <span className="text-foreground">{type}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Login Form */}
            <Card className="bg-primary text-primary-foreground shadow-elevated">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">
                  Login with 2-Step Authentication
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="userId" className="text-primary-foreground font-medium">
                    User Id
                  </Label>
                  <Input
                    id="userId"
                    type="text"
                    value={formData.userId}
                    onChange={(e) => setFormData(prev => ({ ...prev, userId: e.target.value }))}
                    className="bg-primary-foreground text-foreground border-none"
                    placeholder="Enter your user ID"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-primary-foreground font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="bg-primary-foreground text-foreground border-none pr-10"
                      placeholder="Enter your password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Captcha */}
                <div className="space-y-2">
                  <Label className="text-primary-foreground font-medium">Captcha</Label>
                  <div className="flex items-center space-x-3">
                    <div className="bg-gray-800 text-white px-4 py-2 rounded font-mono text-lg flex-1 text-center border-2 border-gray-600">
                      {captcha}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    type="text"
                    value={formData.captcha}
                    onChange={(e) => setFormData(prev => ({ ...prev, captcha: e.target.value }))}
                    className="bg-primary-foreground text-foreground border-none"
                    placeholder="Enter Captcha"
                  />
                </div>

                <div className="text-left">
                  <Link 
                    to="/forgot-password" 
                    className="text-primary-foreground hover:underline font-medium"
                  >
                    Forgot Password
                  </Link>
                </div>

                <div className="flex justify-center pt-4">
                  <Button
                    size="lg"
                    className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-md font-semibold"
                  >
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}