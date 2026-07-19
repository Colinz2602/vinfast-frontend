import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import QuoteModal from "@/app/components/quote_modal";

function mockFetchByUrl() {
  return vi.fn((url: string, _init?: RequestInit) => {
    if (url.includes("/api/cars")) {
      return Promise.resolve({
        json: async () => ({
          data: [
            { id: 1, name: "VF 8" },
            { id: 2, name: "VF 9" },
          ],
        }),
      });
    }
    if (url.includes("/api/global-setting")) {
      return Promise.resolve({
        json: async () => ({ data: { hotline: "0900000000" } }),
      });
    }
    if (url.includes("/api/send_zalo")) {
      return Promise.resolve({ json: async () => ({ success: true }) });
    }
    return Promise.resolve({ json: async () => ({}) });
  });
}

describe("QuoteModal", () => {
  let fetchMock: ReturnType<typeof mockFetchByUrl>;

  beforeEach(() => {
    fetchMock = mockFetchByUrl();
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("alert", vi.fn());
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("renders nothing when closed", () => {
    const { container } = render(
      <QuoteModal isOpen={false} onClose={() => {}} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("loads and renders car options when opened", async () => {
    render(<QuoteModal isOpen={true} onClose={() => {}} />);

    await waitFor(() => {
      expect(screen.getByRole("option", { name: "VF 8" })).toBeInTheDocument();
    });
    expect(screen.getByRole("option", { name: "VF 9" })).toBeInTheDocument();
  });

  it("shows a validation error and does not submit when phone is empty", async () => {
    const user = userEvent.setup();
    render(<QuoteModal isOpen={true} onClose={() => {}} />);

    await user.click(screen.getByRole("button", { name: /nhận thông tin/i }));

    expect(
      screen.getByText(/vui lòng nhập dữ liệu cho trường này/i),
    ).toBeInTheDocument();
    expect(
      fetchMock.mock.calls.some(([url]) => String(url).includes("/api/send_zalo")),
    ).toBe(false);
  });

  it("submits to the send_zalo endpoint and closes on success", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<QuoteModal isOpen={true} onClose={onClose} />);

    await user.type(screen.getByPlaceholderText(/di động/i), "0911222333");
    await user.click(screen.getByRole("button", { name: /nhận thông tin/i }));

    await waitFor(() => {
      expect(
        fetchMock.mock.calls.some(([url]) =>
          String(url).includes("/api/send_zalo"),
        ),
      ).toBe(true);
    });

    const call = fetchMock.mock.calls.find(([url]) =>
      String(url).includes("/api/send_zalo"),
    );
    const body = JSON.parse(call![1]!.body as string);
    expect(body.phone).toBe("0911222333");
    expect(body.paymentMethod).toBe("Trả thẳng");

    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });
});
