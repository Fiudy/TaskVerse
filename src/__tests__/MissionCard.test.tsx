import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import MissionCard from "@/components/MissionCard";

describe("MissionCard", () => {
  const baseProps = {
    titulo: "Soma Simples",
    descricao: "Resolva: 25 + 37",
    pontosXp: 10,
    materia: "matematica",
    dificuldade: "media" as const,
  };

  it("renders title, XP and materia badge", () => {
    render(
      <MissionCard
        {...baseProps}
        status="aprovada"
      />
    );

    expect(screen.getByText(/soma simples/i)).toBeInTheDocument();
    expect(screen.getByText(/resolva: 25 \+ 37/i)).toBeInTheDocument();
    expect(screen.getByText(/10 xp/i)).toBeInTheDocument();
    expect(screen.getByText(/matematica/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /entregar missão/i })).not.toBeInTheDocument();
  });

  it("shows submit button and triggers callback when pending", () => {
    const onSubmit = vi.fn();
    render(
      <MissionCard
        {...baseProps}
        status="pendente"
        onSubmit={onSubmit}
      />
    );

    const btn = screen.getByRole("button", { name: /entregar missão/i });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});