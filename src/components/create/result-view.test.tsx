import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ResultView } from "./result-view";

// Mock next/image to render a plain <img>
vi.mock("next/image", () => ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  default: ({ fill, ...rest }: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean }) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...rest} />;
  },
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Download: () => <span>⬇</span>,
  RefreshCw: () => <span>↻</span>,
  Film: () => <span>🎞</span>,
  Loader2: () => <span>⏳</span>,
  Sparkles: () => <span>✦</span>,
}));

// Mock gif-encoder to avoid canvas issues in jsdom
vi.mock("@/lib/gif-encoder", () => ({
  encodeGif: vi.fn(),
}));

const defaultProps = {
  result: {
    imageUrl: "https://example.com/image.webp",
    prompt: "anime style, test prompt",
  },
  onCreateAnother: vi.fn(),
  onIterate: vi.fn(),
  remainingGenerations: 3,
};

describe("ResultView", () => {
  beforeEach(() => {
    defaultProps.onCreateAnother.mockClear();
    defaultProps.onIterate.mockClear();
  });

  it("renders feedback textarea", () => {
    render(<ResultView {...defaultProps} />);
    expect(screen.getByPlaceholderText(/make the sky more orange/i)).toBeInTheDocument();
  });

  it("Regenerate button is disabled when feedback is empty", () => {
    render(<ResultView {...defaultProps} />);
    const regenButton = screen.getByRole("button", { name: /regenerate/i });
    expect(regenButton).toBeDisabled();
  });

  it("Regenerate enables after typing feedback", async () => {
    const user = userEvent.setup();
    render(<ResultView {...defaultProps} />);

    const textarea = screen.getByPlaceholderText(/make the sky more orange/i);
    await user.type(textarea, "add cherry blossoms");

    const regenButton = screen.getByRole("button", { name: /regenerate/i });
    expect(regenButton).not.toBeDisabled();
  });

  it("clicking Regenerate calls onIterate with feedback text", async () => {
    const user = userEvent.setup();
    render(<ResultView {...defaultProps} />);

    const textarea = screen.getByPlaceholderText(/make the sky more orange/i);
    await user.type(textarea, "add cherry blossoms");
    await user.click(screen.getByRole("button", { name: /regenerate/i }));

    expect(defaultProps.onIterate).toHaveBeenCalledWith("add cherry blossoms");
  });

  it("shows remaining generations count", () => {
    render(<ResultView {...defaultProps} />);
    expect(screen.getByText(/3 generations remaining today/i)).toBeInTheDocument();
  });

  it("feedback and Regenerate are disabled at 0 remaining", () => {
    render(<ResultView {...defaultProps} remainingGenerations={0} />);
    const textarea = screen.getByPlaceholderText(/make the sky more orange/i);
    expect(textarea).toBeDisabled();
    const regenButton = screen.getByRole("button", { name: /regenerate/i });
    expect(regenButton).toBeDisabled();
  });
});
