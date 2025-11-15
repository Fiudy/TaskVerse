import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, BookOpen, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!login || !senha) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('login', login)
        .eq('senha', senha)
        .single();

      if (error || !data) {
        toast.error("Credenciais inválidas");
        setLoading(false);
        return;
      }

      // Store user info in localStorage
      localStorage.setItem('currentUser', JSON.stringify(data));
      
      toast.success(`Bem-vindo, ${data.nome}!`);
      
      // Redirect based on user type
      if (data.tipo === 'aluno') {
        navigate('/aluno');
      } else {
        navigate('/professor');
      }
    } catch (err) {
      toast.error("Erro ao fazer login");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero p-4">
      <Card className="w-full max-w-md shadow-elevated">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Trophy className="h-16 w-16 text-xp-gold animate-bounce-slow" />
              <BookOpen className="h-10 w-10 text-primary absolute -bottom-2 -right-2" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">TaskVerse</CardTitle>
          <CardDescription className="text-base">
            Sua Jornada Gamificada de Aprendizagem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login">Usuário</Label>
              <Input
                id="login"
                type="text"
                placeholder="Digite seu usuário"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <div className="relative">
                <Input
                  id="senha"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  disabled={loading}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full gradient-hero text-white hover:opacity-90 transition-smooth"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <Button
              variant="outline"
              onClick={() => navigate('/cadastro')}
              className="w-full"
              disabled={loading}
            >
              Criar nova conta
            </Button>
          </div>
          
          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-center text-muted-foreground mb-3">
              Usuários de demonstração:
            </p>
            <div className="grid gap-2">
              <div className="p-3 bg-muted rounded-lg text-sm">
                <p className="font-medium">👨‍🎓 Aluno</p>
                <p className="text-muted-foreground">Login: <span className="font-mono">aluno</span> / Senha: <span className="font-mono">aluno@123</span></p>
              </div>
              <div className="p-3 bg-muted rounded-lg text-sm">
                <p className="font-medium">👨‍🏫 Professor</p>
                <p className="text-muted-foreground">Login: <span className="font-mono">professor</span> / Senha: <span className="font-mono">professor@123</span></p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
