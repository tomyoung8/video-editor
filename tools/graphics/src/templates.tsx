import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { brand, bodyFont, headingFont } from "./brand";
import { BaseProps, Frame, riseStyle, useInOut } from "./shared";

const card: React.CSSProperties = {
  backgroundColor: brand.colors.background,
  borderRadius: 28,
  padding: "36px 48px",
  maxWidth: "100%",
  boxSizing: "border-box",
};

// ── Title card: big headline, optional subtitle ─────────────────────────
export type TitleCardProps = BaseProps & { title: string; subtitle?: string };
export const TitleCard: React.FC<TitleCardProps> = ({ title, subtitle, fullscreen }) => {
  const p = useInOut();
  return (
    <Frame fullscreen={fullscreen}>
      <div style={{ ...card, ...riseStyle(p), textAlign: "center", background: fullscreen ? "none" : card.backgroundColor }}>
        <div style={{ fontFamily: headingFont, fontWeight: 800, fontSize: 96, lineHeight: 1.05, color: brand.colors.text }}>
          {title}
        </div>
        {subtitle ? (
          <div style={{ fontFamily: bodyFont, fontWeight: 500, fontSize: 48, marginTop: 20, color: brand.colors.accent }}>
            {subtitle}
          </div>
        ) : null}
      </div>
    </Frame>
  );
};

// ── Text pop-up: short phrase that pops in, e.g. a key word from the script ─
export type TextPopupProps = BaseProps & { text: string; position?: "top" | "middle" | "bottom" };
export const TextPopup: React.FC<TextPopupProps> = ({ text, position = "middle", fullscreen }) => {
  const p = useInOut();
  const scale = interpolate(p, [0, 1], [0.85, 1]);
  const align = position === "top" ? "start" : position === "bottom" ? "end" : "center";
  return (
    <Frame fullscreen={fullscreen} align={align}>
      <div
        style={{
          ...card,
          opacity: p,
          transform: `scale(${scale})`,
          fontFamily: headingFont,
          fontWeight: 800,
          fontSize: 72,
          lineHeight: 1.1,
          textAlign: "center",
          color: brand.colors.text,
          borderBottom: `8px solid ${brand.colors.primary}`,
        }}
      >
        {text}
      </div>
    </Frame>
  );
};

// ── Stat card: big number that counts up, with a label ───────────────────
export type StatCardProps = BaseProps & {
  value: number;
  prefix?: string; // e.g. "$"
  suffix?: string; // e.g. "x", "%"
  label: string; // e.g. "faster onboarding"
  decimals?: number;
};
export const StatCard: React.FC<StatCardProps> = ({ value, prefix = "", suffix = "", label, decimals = 0, fullscreen }) => {
  const p = useInOut();
  const frame = useCurrentFrame();
  const counted = interpolate(frame, [0, 24], [0, value], { extrapolateRight: "clamp" });
  return (
    <Frame fullscreen={fullscreen}>
      <div style={{ ...card, ...riseStyle(p), textAlign: "center" }}>
        <div style={{ fontFamily: headingFont, fontWeight: 900, fontSize: 200, lineHeight: 1, color: brand.colors.primary }}>
          {prefix}
          {counted.toFixed(decimals)}
          {suffix}
        </div>
        <div style={{ fontFamily: bodyFont, fontWeight: 600, fontSize: 56, marginTop: 16, color: brand.colors.text }}>
          {label}
        </div>
      </div>
    </Frame>
  );
};

// ── Lower third: name + role, bottom-left above the platform UI ──────────
export type LowerThirdProps = BaseProps & { name: string; role?: string };
export const LowerThird: React.FC<LowerThirdProps> = ({ name, role, fullscreen }) => {
  const p = useInOut();
  return (
    <Frame fullscreen={fullscreen} align="end">
      <div style={{ alignSelf: "flex-start", opacity: p, transform: `translateX(${(1 - p) * -60}px)` }}>
        <div style={{ ...card, borderLeft: `10px solid ${brand.colors.primary}`, borderRadius: 16, padding: "24px 36px" }}>
          <div style={{ fontFamily: headingFont, fontWeight: 800, fontSize: 60, color: brand.colors.text }}>{name}</div>
          {role ? (
            <div style={{ fontFamily: bodyFont, fontWeight: 500, fontSize: 40, marginTop: 6, color: brand.colors.accent }}>
              {role}
            </div>
          ) : null}
        </div>
      </div>
    </Frame>
  );
};

// ── Logo intro / outro: logo scales in, optional tagline ─────────────────
export type LogoProps = BaseProps & { tagline?: string };
const Logo: React.FC<LogoProps> = ({ tagline, fullscreen }) => {
  const p = useInOut();
  const scale = interpolate(p, [0, 1], [0.9, 1]);
  return (
    <Frame fullscreen={fullscreen}>
      <Img src={staticFile(brand.logo)} style={{ width: 600, opacity: p, transform: `scale(${scale})` }} />
      {tagline ? (
        <div style={{ ...riseStyle(p, 20), fontFamily: bodyFont, fontWeight: 600, fontSize: 52, marginTop: 40, color: brand.colors.text, textAlign: "center" }}>
          {tagline}
        </div>
      ) : null}
    </Frame>
  );
};
export const LogoIntro: React.FC<LogoProps> = (props) => <Logo {...props} />;
export const LogoOutro: React.FC<LogoProps> = (props) => <Logo {...props} />;

// ── Call-to-action end card ─────────────────────────────────────────────
export type CtaCardProps = BaseProps & { headline: string; action: string };
export const CtaCard: React.FC<CtaCardProps> = ({ headline, action, fullscreen }) => {
  const p = useInOut();
  return (
    <Frame fullscreen={fullscreen}>
      <div style={{ ...card, ...riseStyle(p), textAlign: "center" }}>
        <div style={{ fontFamily: headingFont, fontWeight: 800, fontSize: 80, lineHeight: 1.1, color: brand.colors.text }}>
          {headline}
        </div>
        <div
          style={{
            display: "inline-block",
            marginTop: 36,
            padding: "22px 48px",
            borderRadius: 999,
            backgroundColor: brand.colors.primary,
            fontFamily: bodyFont,
            fontWeight: 700,
            fontSize: 48,
            color: brand.colors.text,
          }}
        >
          {action}
        </div>
      </div>
    </Frame>
  );
};
