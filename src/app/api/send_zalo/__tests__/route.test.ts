import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { POST } from "@/app/api/send_zalo/route";

function makeRequest(body: unknown, opts?: { throwOnJson?: boolean }): Request {
  return {
    json: async () => {
      if (opts?.throwOnJson) throw new Error("bad json");
      return body;
    },
  } as unknown as Request;
}

describe("POST /api/send_zalo", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("ZALO_BOT_TOKEN", "test-token");
    vi.stubEnv("ZALO_CHAT_ID", "test-chat");
    vi.spyOn(console, "error").mockImplementation(() => {});
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("returns success when the Zalo API responds without an error", async () => {
    fetchMock.mockResolvedValue({ json: async () => ({ ok: true }) });

    const res = await POST(
      makeRequest({
        name: "Nguyen",
        phone: "0900000000",
        selectedCar: "VF 8",
        paymentMethod: "Trả góp",
      }),
    );

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ success: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("calls the Zalo bot endpoint built from the token env var", async () => {
    fetchMock.mockResolvedValue({ json: async () => ({}) });

    await POST(makeRequest({ phone: "0900000000", paymentMethod: "Trả thẳng" }));

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(
      "https://bot-api.zaloplatforms.com/bottest-token/sendMessage",
    );
    expect(init.method).toBe("POST");
    const payload = JSON.parse(init.body);
    expect(payload.chat_id).toBe("test-chat");
    expect(payload.text).toContain("0900000000");
    expect(payload.text).toContain("Trả thẳng");
  });

  it("uses placeholder text for missing name and car", async () => {
    fetchMock.mockResolvedValue({ json: async () => ({}) });

    await POST(makeRequest({ phone: "0900000000", paymentMethod: "Trả góp" }));

    const payload = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(payload.text).toContain("Chưa nhập tên");
    expect(payload.text).toContain("Chưa chọn");
  });

  it("returns a 400 when the Zalo API reports an error", async () => {
    fetchMock.mockResolvedValue({
      json: async () => ({ error: true, message: "invalid token" }),
    });

    const res = await POST(
      makeRequest({ phone: "0900000000", paymentMethod: "Trả góp" }),
    );

    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({
      success: false,
      error: "invalid token",
    });
  });

  it("returns a 500 when parsing the request body throws", async () => {
    const res = await POST(makeRequest(null, { throwOnJson: true }));

    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({
      success: false,
      error: "Internal Server Error",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns a 500 when the fetch call rejects", async () => {
    fetchMock.mockRejectedValue(new Error("network down"));

    const res = await POST(
      makeRequest({ phone: "0900000000", paymentMethod: "Trả góp" }),
    );

    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({
      success: false,
      error: "Internal Server Error",
    });
  });
});
