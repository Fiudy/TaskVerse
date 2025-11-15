import { render, screen } from "@testing-library/react";
import App from "@/App";

describe("App", () => {
  it("renders Login page on root route", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: /taskverse/i })).toBeInTheDocument();
    expect(screen.getByText(/sua jornada gamificada de aprendizagem/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
  });
});