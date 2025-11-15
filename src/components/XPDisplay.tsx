import { Trophy, Star } from "lucide-react";
import { Card } from "@/components/ui/card";

interface XPDisplayProps {
  totalXP: number;
  userName: string;
}

const XPDisplay = ({ totalXP, userName }: XPDisplayProps) => {
  const level = Math.floor(totalXP / 100) + 1;
  const xpInCurrentLevel = totalXP % 100;
  const xpForNextLevel = 100;
  const progressPercentage = (xpInCurrentLevel / xpForNextLevel) * 100;

  return (
    <Card className="gradient-card shadow-elevated p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Olá, {userName}! 👋</h2>
          <p className="text-muted-foreground">Continue sua jornada de aprendizado</p>
        </div>
        <div className="flex items-center gap-2 bg-xp-gold/10 px-4 py-2 rounded-full shadow-xp">
          <Trophy className="h-6 w-6 text-xp-gold" />
          <span className="text-2xl font-bold text-xp-gold">{totalXP} XP</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-xp-gold" />
            <span className="font-medium">Nível {level}</span>
          </div>
          <span className="text-muted-foreground">
            {xpInCurrentLevel} / {xpForNextLevel} XP
          </span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full gradient-xp transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </Card>
  );
};

export default XPDisplay;
