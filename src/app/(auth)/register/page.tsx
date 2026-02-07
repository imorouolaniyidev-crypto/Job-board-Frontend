'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import axios from "axios";

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"ADMIN" | "CANDIDATE">("CANDIDATE");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation password strength
  const validatePassword = (password: string): string | null => {
    if (password.length < 8) return "Le mot de passe doit contenir au moins 8 caractères";
    if (!/[A-Z]/.test(password)) return "Le mot de passe doit contenir au moins une majuscule";
    if (!/[0-9]/.test(password)) return "Le mot de passe doit contenir au moins un chiffre";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    setErrors({});
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Validations côté client
    if (!email) {
      newErrors.email = "L'email est requis";
    }
    if (!password) {
      newErrors.password = "Le mot de passe est requis";
    } else {
      const passwordError = validatePassword(password);
      if (passwordError) newErrors.password = passwordError;
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }
    if (!termsAccepted) {
      newErrors.terms = "Vous devez accepter les conditions d'utilisation";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      // Appel API inscription
      const response = await api.post("/auth/register", { email, password, role });
      const { user } = response.data;

      // Auto-login : sauvegarde l'utilisateur
      // Token stocké en httpOnly cookie par le serveur (Set-Cookie)
      setAuth(user);

      toast.success("Compte créé avec succès !");
      // Redirection vers jobs au lieu de login
      router.push("/jobs");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || "Erreur lors de l'inscription";
        if (error.response?.status === 409) {
          newErrors.email = "Cet email est déjà utilisé";
        } else {
          toast.error(errorMessage);
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
          <CardTitle className="text-2xl font-bold">Créer un compte</CardTitle>
          <CardDescription>Rejoignez la plateforme Job Board</CardDescription>
          <p className="text-xs text-gray-500 pt-2">Déjà inscrit ? <a href="/login" className="text-blue-600 underline">Connectez-vous</a></p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="Min 8 caractères, 1 majuscule, 1 chiffre"
                required
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirmez le mot de passe"
                required
                className={errors.confirmPassword ? "border-red-500" : ""}
              />
              {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
            </div>

            <div className="space-y-2">
              <Label>Vous êtes ?</Label>
              <Select
                value={role}
                onValueChange={(value: "ADMIN" | "CANDIDATE") => setRole(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CANDIDATE">Candidat</SelectItem>
                  <SelectItem value="ADMIN">Recruteur (Admin)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              />
              <Label htmlFor="terms" className="font-normal cursor-pointer">
                J&apos;accepte les <a href="#" className="text-blue-600 underline">conditions d&apos;utilisation</a>
              </Label>
            </div>
            {errors.terms && <p className="text-sm text-red-500">{errors.terms}</p>}

            <Button type="submit" className="w-full" disabled={loading || !termsAccepted}>
              {loading ? "Création en cours..." : "S&apos;inscrire"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}