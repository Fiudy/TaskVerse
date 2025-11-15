import { render, screen } from "@testing-library/react";
import XPDisplay from "@/components/XPDisplay";

describe("XPDisplay", () => {
  it("shows user greeting, total XP, level and progress", () => {
    render(<XPDisplay totalXP={150} userName="Ana" />);

    expect(screen.getByText(/olá, ana!/i)).toBeInTheDocument();
    expect(screen.getByText(/150 xp/i)).toBeInTheDocument();
    expect(screen.getByText(/nível 2/i)).toBeInTheDocument();
    expect(screen.getByText(/50 \/ 100 xp/i)).toBeInTheDocument();
  });
});