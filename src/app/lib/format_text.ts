// Escape HTML special characters so untrusted CMS content cannot inject markup.
const escapeHtml = (str: string) =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// Hàm dịch Markdown tự tạo.
// Escape trước để tránh XSS, sau đó mới chèn các thẻ định dạng an toàn.
export const formatText = (str: string) => {
  if (!str) return "";
  return (
    escapeHtml(str)
      // **: in nghiêng (em)
      .replace(/\*\*(.*?)\*\*/g, '<em class="italic">$1</em>')

      // *: in đậm (strong)
      .replace(/\*(.*?)\*/g, '<strong class="font-bold">$1</strong>')

      // xử lý xuống dòng
      .replace(/\n/g, "<br />")
  );
};
