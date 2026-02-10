'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios"; // Import important pour le test d'erreur

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const newErrors: Record<string, string> = {};
    setErrors({});
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email) newErrors.email = "Veuillez entrer votre email";
    if (!password) newErrors.password = "Veuillez entrer votre mot de passe";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/auth/login", { email, password });
      // Le token est maintenant en httpOnly cookie (Set-Cookie du serveur)
      // On sauvegarde juste les infos utilisateur
      setAuth(response.data.user);
      
      toast.success("Connexion réussie !");
      router.push("/jobs");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          newErrors.password = "Email ou mot de passe incorrect";
        } else {
          const message = error.response?.data?.message || "Erreur de connexion";
          toast.error(message);
        }
      } else {
        toast.error("Une erreur inattendue est survenue");
      }
      setErrors(newErrors);
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
          <CardDescription>Entrez vos identifiants pour accéder à votre compte</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4"noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="nom@exemple.com" 
                required 
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}