import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, CheckCircle, Clock, BookOpen } from "lucide-react";

interface MissionCardProps {
  titulo: string;
  descricao: string;
  pontosXp: number;
  status: 'pendente' | 'entregue' | 'aprovada';
  materia: string;
  dificuldade?: string;
  onSubmit?: () => void;
}

const MissionCard = ({ titulo, descricao, pontosXp, status, materia, dificuldade, onSubmit }: MissionCardProps) => {
  const statusConfig = {
    pendente: { label: "Pendente", icon: Clock, variant: "outline" as const, color: "text-muted-foreground" },
    entregue: { label: "Aguardando", icon: Clock, variant: "secondary" as const, color: "text-warning" },
    aprovada: { label: "Aprovada", icon: CheckCircle, variant: "default" as const, color: "text-success" }
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  const materiaEmoji: Record<string, string> = {
    matematica: "🔢",
    portugues: "📚",
    ciencias: "🔬",
    historia: "🏛️",
    geografia: "🌍"
  };

  return (
    <Card className="shadow-card hover:shadow-elevated transition-smooth">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{materiaEmoji[materia]}</span>
              <Badge variant="outline" className="capitalize">
                {materia}
              </Badge>
              {dificuldade && (
                <Badge variant="outline">
                  {dificuldade === 'facil' ? '⭐ Fácil' : 
                   dificuldade === 'media' ? '⭐⭐ Média' : 
                   '⭐⭐⭐ Difícil'}
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg">{titulo}</CardTitle>
            <CardDescription className="mt-2">{descricao}</CardDescription>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-1 bg-xp-gold/10 px-3 py-1 rounded-full">
              <Trophy className="h-4 w-4 text-xp-gold" />
              <span className="font-bold text-xp-gold">{pontosXp} XP</span>
            </div>
            <Badge variant={config.variant} className="flex items-center gap-1">
              <StatusIcon className={`h-3 w-3 ${config.color}`} />
              {config.label}
            </Badge>
          </div>
        </div>
      </CardHeader>
      {status === 'pendente' && onSubmit && (
        <CardContent>
          <Button 
            onClick={onSubmit}
            className="w-full bg-primary hover:bg-primary/90 transition-smooth"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Entregar Missão
          </Button>
        </CardContent>
      )}
    </Card>
  );
};

export default MissionCard;
