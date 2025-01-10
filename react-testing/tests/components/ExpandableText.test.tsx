import { render, screen } from "@testing-library/react";
import ExpandableText from "../../src/components/ExpandableText";
import userEvent from "@testing-library/user-event";

describe("ExpandableText", () => {
  const limit = 255;
  const longText = "a".repeat(limit + 1);
  const truncatedText = longText.substring(0, limit) + "...";

  it("should render full text if less than 255 character", () => {
    const text =
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Earum reiciendis expedita impedit dicta maxime pariatur eos voluptatibus. Est, qui incidunt!";
    render(<ExpandableText text={text} />);

    expect(screen.getByText(text)).toBeInTheDocument();

    // expect(screen.getByRole("article")).toHaveLength(text.length);
  });

  it("should truncate text if longer than 255 character", () => {
    render(<ExpandableText text={longText} />);

    expect(screen.getByText(truncatedText)).toBeInTheDocument();

    const expandButton = screen.getByRole("button");

    expect(expandButton).toHaveTextContent(/more/i);
    expect(expandButton).toBeInTheDocument();
  });

  it("should expand text when show more button clicked", async () => {
    render(<ExpandableText text={longText} />);

    expect(screen.getByText(truncatedText)).toBeInTheDocument();

    const expandButton = screen.getByRole("button");
    const user = userEvent.setup();
    await user.click(expandButton);

    expect(screen.getByText(longText)).toBeInTheDocument();
    expect(expandButton).toHaveTextContent(/less/i);
    expect(expandButton).toBeInTheDocument();
  });

  it("should collapse text when show less button clicked", async () => {
    render(<ExpandableText text={longText} />);

    expect(screen.getByText(truncatedText)).toBeInTheDocument();

    const expandButton = screen.getByRole("button");
    const user = userEvent.setup();
    await user.click(expandButton);
    await user.click(expandButton);

    expect(screen.getByText(truncatedText)).toBeInTheDocument();
    expect(expandButton).toHaveTextContent(/more/i);
    expect(expandButton).toBeInTheDocument();
  });
});
