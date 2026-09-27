// Mirror of brand/brand.md — keep these in sync.
// TODO: replace the placeholder values once brand.md is filled in.
export const brand = {
  colors: {
    primary: "#3B82F6", // highlights, stat numbers
    background: "#0B0F1A", // card / box backgrounds
    text: "#FFFFFF", // main text
    accent: "#22D3EE", // underlines, small details
  },
  fonts: {
    heading: "Inter",
    body: "Inter",
  },
  // Font files inside brand/fonts/, e.g. { family: "Inter", file: "fonts/Inter-Bold.woff2", weight: "700" }
  fontFiles: [] as { family: string; file: string; weight: string }[],
  logo: "logo.png", // inside brand/
};

export const fallbackFonts = "'Helvetica Neue', Helvetica, Arial, sans-serif";
export const headingFont = `'${brand.fonts.heading}', ${fallbackFonts}`;
export const bodyFont = `'${brand.fonts.body}', ${fallbackFonts}`;
