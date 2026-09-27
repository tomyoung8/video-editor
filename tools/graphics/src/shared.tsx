import React from "react";
import {
  AbsoluteFill,
  Easing,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand } from "./brand";

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
const ANIM_FRAMES = 9; // ~0.3s in and out

// Instagram/TikTok UI keeps these areas covered.
export const SAFE = { top: 250, bottom: 400, left: 60, right: 180 };

export type BaseProps = {
  seconds: number;
  // true = opaque full-screen card (render as .mp4); false = transparent overlay
  fullscreen?: boolean;
};

// 0 → 1 over the first ~0.3s, 1 → 0 over the last ~0.3s.
export const useInOut = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const ease = Easing.out(Easing.cubic);
  const into = interpolate(frame, [0, ANIM_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const out = interpolate(
    frame,
    [durationInFrames - ANIM_FRAMES, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) },
  );
  return Math.min(into, out);
};

// Loads the brand font files (if any) before the first frame renders.
let fontsLoaded: Promise<void> | null = null;
export const useBrandFonts = () => {
  const [handle] = React.useState(() => delayRender("Loading brand fonts"));
  React.useEffect(() => {
    fontsLoaded ??= Promise.all(
      brand.fontFiles.map(async (f) => {
        const face = new FontFace(f.family, `url(${staticFile(f.file)})`, { weight: f.weight });
        await face.load();
        document.fonts.add(face);
      }),
    ).then(() => undefined);
    fontsLoaded.then(() => continueRender(handle)).catch((err) => {
      console.error("Brand font failed to load, using fallback", err);
      continueRender(handle);
    });
  }, [handle]);
};

// Root wrapper for every template: brand fonts, optional opaque background,
// and a safe-zone box that children are positioned inside.
export const Frame: React.FC<{
  fullscreen?: boolean;
  align?: "start" | "center" | "end";
  children: React.ReactNode;
}> = ({ fullscreen, align = "center", children }) => {
  useBrandFonts();
  return (
    <AbsoluteFill style={{ backgroundColor: fullscreen ? brand.colors.background : "transparent" }}>
      <div
        style={{
          position: "absolute",
          top: SAFE.top,
          bottom: SAFE.bottom,
          left: SAFE.left,
          right: SAFE.right,
          display: "flex",
          flexDirection: "column",
          justifyContent: align === "start" ? "flex-start" : align === "end" ? "flex-end" : "center",
          alignItems: "center",
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

// Slide up a little + fade, driven by useInOut.
export const riseStyle = (p: number, distance = 40): React.CSSProperties => ({
  opacity: p,
  transform: `translateY(${(1 - p) * distance}px)`,
});
