import { describe, it, expect } from "vitest";
import { generateSlugId } from "@/app/components/cars_list";

describe("generateSlugId", () => {
  it("lowercases the input", () => {
    expect(generateSlugId("VinFast")).toBe("vinfast");
  });

  it("replaces whitespace runs with a single hyphen", () => {
    expect(generateSlugId("VF   8   Plus")).toBe("vf-8-plus");
  });

  it("strips Vietnamese diacritics", () => {
    expect(generateSlugId("Ô tô điện")).toBe("o-to-dien");
  });

  it("maps đ/Đ to d", () => {
    expect(generateSlugId("đông Đô")).toBe("dong-do");
  });

  it("removes characters that are not word chars or hyphens", () => {
    expect(generateSlugId("Xe (2024)!")).toBe("xe-2024");
  });

  it("keeps existing hyphens", () => {
    expect(generateSlugId("vf-8")).toBe("vf-8");
  });

  it("returns an empty string for empty input", () => {
    expect(generateSlugId("")).toBe("");
  });

  it("is deterministic for the same input", () => {
    expect(generateSlugId("Dòng SUV")).toBe(generateSlugId("Dòng SUV"));
  });
});
