import { render, screen } from "@testing-library/react";
import Index from "@/pages/Index";

describe("Index page", () => {
  it("renders welcome title and description", () => {
    render(<Index />);
    expect(
      screen.getByRole("heading", { name: /welcome to your blank app/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/start building your amazing project here!/i)
    ).toBeInTheDocument();
  });
});