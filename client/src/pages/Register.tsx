import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import pmAjayLogo from "@/assets/pm-ajay logo.png";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    state: "",
    district: "",
    block: "",
    village: "",
    department: "",
    agency: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const roles = [
    { value: "super_admin", label: "Super Admin", description: "Complete system administration" },
    { value: "central_admin", label: "Central Admin", description: "National-level oversight" },
    { value: "state_nodal_admin", label: "State Nodal Admin", description: "State-level management" },
    { value: "state_sc_corporation_admin", label: "State SC Corporation Admin", description: "SC community programs" },
    { value: "district_collector", label: "District Collector", description: "District coordination" },
    { value: "district_pacc_admin", label: "District PACC Admin", description: "Project appraisal" },
    { value: "implementing_agency_user", label: "Implementing Agency User", description: "Project execution" },
    { value: "gram_panchayat_user", label: "Gram Panchayat User", description: "Village-level implementation" },
    { value: "contractor_vendor", label: "Contractor/Vendor", description: "Contract management" },
    { value: "auditor_oversight", label: "Auditor/Oversight", description: "Compliance monitoring" },
    { value: "technical_support_group", label: "Technical Support Group", description: "System maintenance" }
  ];

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
    "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry", "Chandigarh",
    "Andaman and Nicobar Islands", "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role || "gram_panchayat_user",
        jurisdiction: {
          state: formData.state || undefined,
          district: formData.district || undefined,
          block: formData.block || undefined,
          village: formData.village || undefined,
        },
        department: formData.department || undefined,
        agency: formData.agency || undefined,
      };

      await register(userData);
      toast({
        title: "Registration Successful",
        description: "Welcome to PM-AJAY Dashboard",
      });
      // Navigation will be handled by the AuthProvider and routing
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Registration failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const needsJurisdiction = ["state_nodal_admin", "state_sc_corporation_admin", "district_collector", "district_pacc_admin", "gram_panchayat_user"].includes(formData.role);
  const needsStateOnly = ["state_nodal_admin", "state_sc_corporation_admin"].includes(formData.role);
  const needsDistrictOnly = ["district_collector", "district_pacc_admin"].includes(formData.role);
  const needsVillageLevel = formData.role === "gram_panchayat_user";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <img 
              src={pmAjayLogo} 
              alt="PM-AJAY Logo" 
              className="h-16 w-16 object-contain bg-white rounded-full p-2 shadow-lg mr-4"
            />
            <div className="text-left">
              <h1 className="text-2xl font-bold text-blue-900">Register for PM-AJAY Portal</h1>
              <p className="text-gray-600">Create your account to access role-based dashboard</p>
            </div>
          </div>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800 text-center">
              User Registration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password *
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pr-10"
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

                <div>
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm Password *
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <Label htmlFor="role" className="text-sm font-medium">
                  Select Your Role *
                </Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choose your role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        <div>
                          <div className="font-medium">{role.label}</div>
                          <div className="text-xs text-gray-500">{role.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Jurisdiction Fields */}
              {needsJurisdiction && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800">Jurisdiction Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="state" className="text-sm font-medium">
                        State *
                      </Label>
                      <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {indianStates.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {!needsStateOnly && (
                      <div>
                        <Label htmlFor="district" className="text-sm font-medium">
                          District {(needsDistrictOnly || needsVillageLevel) ? "*" : ""}
                        </Label>
                        <Input
                          id="district"
                          type="text"
                          placeholder="Enter district name"
                          value={formData.district}
                          onChange={(e) => handleInputChange("district", e.target.value)}
                          className="mt-1"
                          required={needsDistrictOnly || needsVillageLevel}
                        />
                      </div>
                    )}
                  </div>

                  {needsVillageLevel && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="block" className="text-sm font-medium">
                          Block
                        </Label>
                        <Input
                          id="block"
                          type="text"
                          placeholder="Enter block name"
                          value={formData.block}
                          onChange={(e) => handleInputChange("block", e.target.value)}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="village" className="text-sm font-medium">
                          Village *
                        </Label>
                        <Input
                          id="village"
                          type="text"
                          placeholder="Enter village name"
                          value={formData.village}
                          onChange={(e) => handleInputChange("village", e.target.value)}
                          className="mt-1"
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Additional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="department" className="text-sm font-medium">
                    Department
                  </Label>
                  <Input
                    id="department"
                    type="text"
                    placeholder="Enter your department"
                    value={formData.department}
                    onChange={(e) => handleInputChange("department", e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="agency" className="text-sm font-medium">
                    Agency/Organization
                  </Label>
                  <Input
                    id="agency"
                    type="text"
                    placeholder="Enter your agency/organization"
                    value={formData.agency}
                    onChange={(e) => handleInputChange("agency", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-md transition-colors flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Account
                  </>
                )}
              </Button>

              <div className="text-center pt-4">
                <p className="text-gray-600 text-sm">
                  Already have an account?{" "}
                  <Link 
                    to="/login" 
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Login here
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;