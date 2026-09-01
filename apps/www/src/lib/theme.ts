const KEY = "svenjs-theme";

export type Theme = "light" | "dark" | "system";

export function readTheme(): Theme {
  try {
    const t = localStorage.getItem(KEY);
    if (t === "light" || t === "dark" || t === "system") return t;
  } catch {
    /* ignore */
  }
  return "system";
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    /* ignore */
  }
}

export function cycleTheme(theme: Theme): Theme {
  const next = theme === "system" ? "dark" : theme === "dark" ? "light" : "system";
  applyTheme(next);
  return next;
}

export function themeLabel(theme: Theme) {
  if (theme === "light") return "Light";
  if (theme === "dark") return "Dark";
  return "System";
}
