import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import FloatingContact from "@/app/components/floating_contact";

describe("FloatingContact", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    fetchMock.mockReset();
  });

  it("renders the default hotline before data loads", () => {
    fetchMock.mockReturnValue(new Promise(() => {}));
    render(<FloatingContact />);

    const zalo = screen.getByRole("link", { name: /zalo/i });
    expect(zalo).toHaveAttribute("href", "https://zalo.me/0836588679");
  });

  it("formats the hotline from the API by stripping spaces and dots", async () => {
    fetchMock.mockResolvedValue({
      json: async () => ({ data: { hotline: "090 123.456" } }),
    });
    render(<FloatingContact />);

    await waitFor(() => {
      const phone = document.querySelector('a[href^="tel:"]');
      expect(phone).toHaveAttribute("href", "tel:090123456");
    });
    expect(
      document.querySelector('a[href^="https://zalo.me/"]'),
    ).toHaveAttribute("href", "https://zalo.me/090123456");
  });

  it("keeps the default hotline when the fetch fails", async () => {
    fetchMock.mockRejectedValue(new Error("network"));
    render(<FloatingContact />);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
    });
    expect(screen.getByRole("link", { name: /zalo/i })).toHaveAttribute(
      "href",
      "https://zalo.me/0836588679",
    );
  });
});
