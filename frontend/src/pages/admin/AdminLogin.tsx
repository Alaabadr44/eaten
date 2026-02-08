import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const API_URL = import.meta.env.VITE_API_URL || "/api";
      const response = await fetch(`${API_URL}/auth/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("admin_token", data.data.access_token);
        toast({ title: "Login successful", description: "Welcome back, Admin." });
        navigate("/admin/dashboard");
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: data.message || "Invalid credentials",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Is the backend running?",
      });
    }
  };

  return (
    <div className="min-h-screen bg-eaten-beige flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl bg-white/90 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-eaten-charcoal font-heading">
            Admin Panel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white border-eaten-taupe"
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white border-eaten-taupe"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-eaten-dark hover:bg-eaten-charcoal transition-colors"
            >
              Login
            </Button>
            
            {/* Debug Button - Remove later */}
            <Button
              type="button"
              variant="outline"
              className="w-full mt-2"
              onClick={() => {
                setEmail("admin@eaten.com");
                setPassword("admin");
              }}
            >
              Debug: Fill Credentials
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
