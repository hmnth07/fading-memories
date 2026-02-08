import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryForm } from "./memory-form";
import type { MemoryFormData } from "@/types/memory";

// Mock lucide-react icons to avoid SVG rendering issues in jsdom
vi.mock("lucide-react", () => ({
  ArrowLeft: () => <span>←</span>,
  ArrowRight: () => <span>→</span>,
  Sparkles: () => <span>✦</span>,
  SkipForward: () => <span>⏭</span>,
}));

describe("MemoryForm", () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it("renders step 1 fields on mount", () => {
    render(<MemoryForm onSubmit={mockOnSubmit} />);
    expect(screen.getByText("Who is in this memory?")).toBeInTheDocument();
    expect(screen.getByText("Where were you?")).toBeInTheDocument();
    expect(screen.getByText("What was happening?")).toBeInTheDocument();
  });

  it("Next button is disabled when required fields are empty", () => {
    render(<MemoryForm onSubmit={mockOnSubmit} />);
    const nextButton = screen.getByRole("button", { name: /next/i });
    expect(nextButton).toBeDisabled();
  });

  it("Next button enables after filling all 3 required fields", async () => {
    const user = userEvent.setup();
    render(<MemoryForm onSubmit={mockOnSubmit} />);

    const textareas = screen.getAllByRole("textbox");
    await user.type(textareas[0], "grandmother");
    await user.type(textareas[1], "kitchen");
    await user.type(textareas[2], "cooking");

    const nextButton = screen.getByRole("button", { name: /next/i });
    expect(nextButton).not.toBeDisabled();
  });

  it("clicking Next navigates to step 2", async () => {
    const user = userEvent.setup();
    render(<MemoryForm onSubmit={mockOnSubmit} />);

    const textareas = screen.getAllByRole("textbox");
    await user.type(textareas[0], "grandmother");
    await user.type(textareas[1], "kitchen");
    await user.type(textareas[2], "cooking");

    await user.click(screen.getByRole("button", { name: /next/i }));

    // Step 2 atmosphere fields should now be visible
    expect(screen.getByText("What season? What time of day?")).toBeInTheDocument();
    expect(screen.getByText("Any small details you remember?")).toBeInTheDocument();
    expect(screen.getByText("How did this memory make you feel?")).toBeInTheDocument();
  });

  it("Skip & Generate on step 2 calls onSubmit", async () => {
    const user = userEvent.setup();
    render(<MemoryForm onSubmit={mockOnSubmit} />);

    // Fill step 1 and advance
    const textareas = screen.getAllByRole("textbox");
    await user.type(textareas[0], "grandmother");
    await user.type(textareas[1], "kitchen");
    await user.type(textareas[2], "cooking");
    await user.click(screen.getByRole("button", { name: /next/i }));

    // Click Skip & Generate
    await user.click(screen.getByRole("button", { name: /skip & generate/i }));

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        who: "grandmother",
        where: "kitchen",
        what: "cooking",
      })
    );
  });

  it("initialData prop pre-fills the fields", () => {
    const initialData: MemoryFormData = {
      who: "my dog",
      where: "the park",
      what: "playing fetch",
      atmosphere: "summer",
      details: "golden fur",
      feeling: "happy",
    };
    render(<MemoryForm onSubmit={mockOnSubmit} initialData={initialData} />);

    const textareas = screen.getAllByRole("textbox");
    expect(textareas[0]).toHaveValue("my dog");
    expect(textareas[1]).toHaveValue("the park");
    expect(textareas[2]).toHaveValue("playing fetch");
  });
});
