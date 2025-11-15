import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LogOut, Plus, CheckCircle, Clock, Trash2, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface User {
  id: string;
  nome: string;
  tipo: string;
}

interface Submission {
  id: string;
  texto_entrega: string;
  status: string;
  data_entrega: string;
  id_missao: string;
  missao: {
    id: string;
    titulo: string;
    pontos_xp: number;
  };
  aluno: {
    nome: string;
  };
}

interface Mission {
  id: string;
  titulo: string;
  descricao: string;
  pontos_xp: number;
  materia: string;
  origem?: string;
  dificuldade?: string;
}

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingMission, setEditingMission] = useState<Mission | null>(null);
  
  // Filters
  const [filterMateria, setFilterMateria] = useState<string>("todas");
  const [filterStatus, setFilterStatus] = useState<string>("todas");
  
  // New mission form
  const [newMission, setNewMission] = useState({
    titulo: "",
    descricao: "",
    pontos_xp: 10,
    materia: "matematica",
    dificuldade: "media"
  });

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      navigate('/');
      return;
    }

    const userData = JSON.parse(currentUser);
    if (userData.tipo !== 'professor') {
      navigate('/');
      return;
    }

    setUser(userData);
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      // Load pending submissions
      const { data: submissionsData, error: submissionsError } = await supabase
        .from('entregas')
        .select(`
          *,
          missao:missoes(id, titulo, pontos_xp),
          aluno:usuarios(nome)
        `)
        .eq('status', 'aguardando')
        .order('data_entrega', { ascending: false });

      if (submissionsError) throw submissionsError;
      setSubmissions(submissionsData || []);

      // Load all missions
      const { data: missionsData, error: missionsError } = await supabase
        .from('missoes')
        .select('*')
        .order('created_at', { ascending: false });

      if (missionsError) throw missionsError;
      setMissions(missionsData || []);

      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error("Erro ao carregar dados");
      setLoading(false);
    }
  };

  const handleApproveSubmission = async (submissionId: string, missionId: string, pontosXp: number) => {
    try {
      const { error } = await supabase
        .from('entregas')
        .update({ status: 'aprovada' })
        .eq('id', submissionId);

      if (error) throw error;

      toast.success(`✅ Missão aprovada! Aluno ganhou ${pontosXp} XP`);
      loadData();
    } catch (error) {
      console.error('Error approving submission:', error);
      toast.error("Erro ao aprovar missão");
    }
  };

  const handleCreateMission = async () => {
    if (!newMission.titulo.trim() || !newMission.descricao.trim() || !user) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    try {
      const { error } = await supabase
        .from('missoes')
        .insert([{
          titulo: newMission.titulo,
          descricao: newMission.descricao,
          pontos_xp: newMission.pontos_xp,
          materia: newMission.materia as 'matematica' | 'portugues' | 'ciencias' | 'historia' | 'geografia',
          dificuldade: newMission.dificuldade,
          criado_por: user.id,
          origem: 'customizada'
        }]);

      if (error) throw error;

      toast.success("🎯 Nova missão criada com sucesso!");
      setDialogOpen(false);
      setNewMission({
        titulo: "",
        descricao: "",
        pontos_xp: 10,
        materia: "matematica",
        dificuldade: "media"
      });
      loadData();
    } catch (error) {
      console.error('Error creating mission:', error);
      toast.error("Erro ao criar missão");
    }
  };

  const handleEditMission = async () => {
    if (!editingMission || !editingMission.titulo.trim() || !editingMission.descricao.trim()) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    try {
      const { error } = await supabase
        .from('missoes')
        .update({
          titulo: editingMission.titulo,
          descricao: editingMission.descricao,
          pontos_xp: editingMission.pontos_xp,
          materia: editingMission.materia as 'matematica' | 'portugues' | 'ciencias' | 'historia' | 'geografia',
          dificuldade: editingMission.dificuldade
        })
        .eq('id', editingMission.id);

      if (error) throw error;

      toast.success("✏️ Missão atualizada com sucesso!");
      setEditDialogOpen(false);
      setEditingMission(null);
      loadData();
    } catch (error) {
      console.error('Error updating mission:', error);
      toast.error("Erro ao atualizar missão");
    }
  };

  const openEditDialog = (mission: Mission) => {
    setEditingMission(mission);
    setEditDialogOpen(true);
  };

  const handleDeleteMission = async (missionId: string) => {
    try {
      const { error } = await supabase
        .from('missoes')
        .delete()
        .eq('id', missionId);

      if (error) throw error;

      toast.success("Missão excluída com sucesso");
      loadData();
    } catch (error) {
      console.error('Error deleting mission:', error);
      toast.error("Erro ao excluir missão");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
    toast.success("Até logo!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-lg text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              TaskVerse
            </h1>
          </div>
          <Button variant="outline" onClick={handleLogout} size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Card className="gradient-card shadow-elevated p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Olá, {user?.nome}! 👨‍🏫</h2>
              <p className="text-muted-foreground">Gerencie suas missões e avalie entregas</p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-hero">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Missão
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Criar Nova Missão</DialogTitle>
                  <DialogDescription>Preencha os detalhes da nova missão</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="titulo">Título</Label>
                    <Input
                      id="titulo"
                      value={newMission.titulo}
                      onChange={(e) => setNewMission({ ...newMission, titulo: e.target.value })}
                      placeholder="Ex: Resolver equações de primeiro grau"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea
                      id="descricao"
                      value={newMission.descricao}
                      onChange={(e) => setNewMission({ ...newMission, descricao: e.target.value })}
                      placeholder="Descreva a atividade em detalhes..."
                      className="min-h-[100px]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="materia">Matéria</Label>
                      <Select
                        value={newMission.materia}
                        onValueChange={(value) => setNewMission({ ...newMission, materia: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="matematica">🔢 Matemática</SelectItem>
                          <SelectItem value="portugues">📚 Português</SelectItem>
                          <SelectItem value="ciencias">🔬 Ciências</SelectItem>
                          <SelectItem value="historia">🏛️ História</SelectItem>
                          <SelectItem value="geografia">🌍 Geografia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pontos_xp">Pontos XP</Label>
                      <Input
                        id="pontos_xp"
                        type="number"
                        min="5"
                        max="100"
                        value={newMission.pontos_xp}
                        onChange={(e) => setNewMission({ ...newMission, pontos_xp: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dificuldade">Dificuldade</Label>
                    <Select
                      value={newMission.dificuldade}
                      onValueChange={(value) => setNewMission({ ...newMission, dificuldade: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="facil">⭐ Fácil</SelectItem>
                        <SelectItem value="media">⭐⭐ Média</SelectItem>
                        <SelectItem value="dificil">⭐⭐⭐ Difícil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleCreateMission} className="w-full bg-success hover:bg-success/90">
                    Criar Missão
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </Card>

        <Tabs defaultValue="submissions" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="submissions">
              Entregas Pendentes ({submissions.length})
            </TabsTrigger>
            <TabsTrigger value="missions">
              Todas as Missões ({missions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="submissions" className="space-y-4">
            {submissions.length === 0 ? (
              <Card className="p-8 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium">Nenhuma entrega pendente</p>
                <p className="text-muted-foreground">Quando os alunos entregarem missões, elas aparecerão aqui</p>
              </Card>
            ) : (
              submissions.map((submission) => (
                <Card key={submission.id} className="shadow-card hover:shadow-elevated transition-smooth">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{submission.missao.titulo}</CardTitle>
                        <CardDescription>Aluno: {submission.aluno.nome}</CardDescription>
                      </div>
                      <Badge variant="secondary">
                        {submission.missao.pontos_xp} XP
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm font-medium mb-2">Resposta do Aluno:</p>
                      <p className="text-sm whitespace-pre-wrap">{submission.texto_entrega}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleApproveSubmission(submission.id, submission.id_missao, submission.missao.pontos_xp)}
                        className="flex-1 bg-success hover:bg-success/90"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Aprovar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="missions" className="space-y-4">
            <div className="flex gap-4 mb-4">
              <Select value={filterMateria} onValueChange={setFilterMateria}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filtrar por matéria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as matérias</SelectItem>
                  <SelectItem value="matematica">🔢 Matemática</SelectItem>
                  <SelectItem value="portugues">📚 Português</SelectItem>
                  <SelectItem value="ciencias">🔬 Ciências</SelectItem>
                  <SelectItem value="historia">🏛️ História</SelectItem>
                  <SelectItem value="geografia">🌍 Geografia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {missions
              .filter(mission => filterMateria === "todas" || mission.materia === filterMateria)
              .map((mission) => (
              <Card key={mission.id} className="shadow-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="capitalize">{mission.materia}</Badge>
                        <Badge variant="secondary">{mission.pontos_xp} XP</Badge>
                        {mission.dificuldade && (
                          <Badge variant="outline">
                            {mission.dificuldade === 'facil' ? '⭐ Fácil' : 
                             mission.dificuldade === 'media' ? '⭐⭐ Média' : 
                             '⭐⭐⭐ Difícil'}
                          </Badge>
                        )}
                        {mission.origem === 'padrao' && (
                          <Badge variant="outline">📋 Padrão</Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg">{mission.titulo}</CardTitle>
                      <CardDescription className="mt-2">{mission.descricao}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openEditDialog(mission)}
                      >
                        <Edit className="h-4 w-4 text-primary" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir Missão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir esta missão? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteMission(mission.id)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* Edit Mission Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Missão</DialogTitle>
              <DialogDescription>Atualize os detalhes da missão</DialogDescription>
            </DialogHeader>
            {editingMission && (
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-titulo">Título</Label>
                  <Input
                    id="edit-titulo"
                    value={editingMission.titulo}
                    onChange={(e) => setEditingMission({ ...editingMission, titulo: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-descricao">Descrição</Label>
                  <Textarea
                    id="edit-descricao"
                    value={editingMission.descricao}
                    onChange={(e) => setEditingMission({ ...editingMission, descricao: e.target.value })}
                    className="min-h-[100px]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-materia">Matéria</Label>
                    <Select
                      value={editingMission.materia}
                      onValueChange={(value) => setEditingMission({ ...editingMission, materia: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="matematica">🔢 Matemática</SelectItem>
                        <SelectItem value="portugues">📚 Português</SelectItem>
                        <SelectItem value="ciencias">🔬 Ciências</SelectItem>
                        <SelectItem value="historia">🏛️ História</SelectItem>
                        <SelectItem value="geografia">🌍 Geografia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-pontos_xp">Pontos XP</Label>
                    <Input
                      id="edit-pontos_xp"
                      type="number"
                      min="5"
                      max="100"
                      value={editingMission.pontos_xp}
                      onChange={(e) => setEditingMission({ ...editingMission, pontos_xp: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-dificuldade">Dificuldade</Label>
                  <Select
                    value={editingMission.dificuldade || "media"}
                    onValueChange={(value) => setEditingMission({ ...editingMission, dificuldade: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="facil">⭐ Fácil</SelectItem>
                      <SelectItem value="media">⭐⭐ Média</SelectItem>
                      <SelectItem value="dificil">⭐⭐⭐ Difícil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleEditMission} className="w-full bg-primary hover:bg-primary/90">
                  Salvar Alterações
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default TeacherDashboard;
