import React from "react";
import { CalculateMetadataFunction, Composition } from "remotion";
import { BaseProps, FPS, HEIGHT, WIDTH } from "./shared";
import { CtaCard, LogoIntro, LogoOutro, LowerThird, StatCard, TextPopup, TitleCard } from "./templates";

// Length comes from the `seconds` prop, so each render can be a different length.
const fromSeconds: CalculateMetadataFunction<BaseProps> = ({ props }) => ({
  durationInFrames: Math.round(props.seconds * FPS),
});

const common = { fps: FPS, width: WIDTH, height: HEIGHT, durationInFrames: 90, calculateMetadata: fromSeconds };

export const Root: React.FC = () => (
  <>
    <Composition id="TitleCard" component={TitleCard} {...common}
      defaultProps={{ seconds: 3, title: "Meet your AI agent", subtitle: "It never sleeps" }} />
    <Composition id="TextPopup" component={TextPopup} {...common}
      defaultProps={{ seconds: 2, text: "No more busywork", position: "middle" as const }} />
    <Composition id="StatCard" component={StatCard} {...common}
      defaultProps={{ seconds: 3, value: 10, suffix: "x", label: "faster replies" }} />
    <Composition id="LowerThird" component={LowerThird} {...common}
      defaultProps={{ seconds: 4, name: "Your Brother", role: "Founder & CEO" }} />
    <Composition id="LogoIntro" component={LogoIntro} {...common}
      defaultProps={{ seconds: 2, tagline: "" }} />
    <Composition id="LogoOutro" component={LogoOutro} {...common}
      defaultProps={{ seconds: 3, tagline: "AI agents that do the work" }} />
    <Composition id="CtaCard" component={CtaCard} {...common}
      defaultProps={{ seconds: 3, headline: "Want an agent like this?", action: "Link in bio" }} />
  </>
);
