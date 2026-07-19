import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navbutton from "@/app/components/navbutton";

describe("Navbutton", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve({ json: async () => ({ data: [] }) })),
    );
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("renders the four quick-action controls with correct links", () => {
    render(<Navbutton />);

    expect(
      screen.getByRole("link", { name: /ô tô vinfast/i }),
    ).toHaveAttribute("href", "#danh-sach-xe");
    expect(screen.getByRole("link", { name: /bảng giá xe/i })).toHaveAttribute(
      "href",
      "/price_list",
    );
    expect(
      screen.getByRole("button", { name: /lái thử xe/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /khuyến mãi/i }),
    ).toBeInTheDocument();
  });

  it("does not render the quote modal until a button is clicked", () => {
    render(<Navbutton />);
    expect(
      screen.queryByText(/báo giá lăn bánh & lái thử xe/i),
    ).not.toBeInTheDocument();
  });

  it("opens the quote modal when 'LÁI THỬ XE' is clicked", async () => {
    const user = userEvent.setup();
    render(<Navbutton />);

    await user.click(screen.getByRole("button", { name: /lái thử xe/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/báo giá lăn bánh & lái thử xe/i),
      ).toBeInTheDocument();
    });
  });
});
