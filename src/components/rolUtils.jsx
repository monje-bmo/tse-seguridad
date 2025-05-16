// src/utils/rolUtils.js
const PALETTE = [
  { bg: "#fee2e2", text: "#b91c1c" }, // red
  { bg: "#d1fae5", text: "#047857" }, // green
  { bg: "#ffedd5", text: "#c2410c" }, // orange
  { bg: "#dbeafe", text: "#1e3a8a" }, // blue
  { bg: "#f3e8ff", text: "#6b21a8" }, // purple
  // agregá más si querés
];

export const getRolStyles = (rol) => {
  if (!rol) return {};
  const sum = Array.from(rol).reduce((a, c) => a + c.charCodeAt(0), 0);
  const idx = sum % PALETTE.length;
  return {
    backgroundColor: PALETTE[idx].bg,
    color: PALETTE[idx].text,
  };
};
