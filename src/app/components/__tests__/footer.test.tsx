import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import Footer from "@/app/components/footer";

describe("Footer", () => {
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

  it("renders global settings returned by the API", async () => {
    fetchMock.mockResolvedValue({
      json: async () => ({
        data: {
          hotline: "0900000000",
          showroom: "VinFast Quận 1",
          address: "123 Đường ABC",
          email: "sale@vinfast.vn",
        },
      }),
    });

    render(<Footer />);

    await waitFor(() => {
      expect(screen.getAllByText(/VinFast Quận 1/).length).toBeGreaterThan(0);
    });
    expect(screen.getByText(/123 Đường ABC/)).toBeInTheDocument();
    expect(screen.getByText(/sale@vinfast.vn/)).toBeInTheDocument();
    expect(
      document.querySelector('a[href="tel:0900000000"]'),
    ).toBeInTheDocument();
    expect(
      document.querySelector('a[href="mailto:sale@vinfast.vn"]'),
    ).toBeInTheDocument();
  });

  it("returns null (renders no footer) when the API returns no data", async () => {
    fetchMock.mockRejectedValue(new Error("network"));

    const { container } = render(<Footer />);

    await waitFor(() => {
      expect(container.querySelector("footer")).toBeNull();
    });
  });
});
