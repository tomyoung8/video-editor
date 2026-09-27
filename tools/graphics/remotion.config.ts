import { Config } from "@remotion/cli/config";

// Defaults = transparent ProRes 4444 .mov for overlaying in CapCut.
// render.sh overrides these for opaque full-screen .mp4 cards.
Config.setVideoImageFormat("png");
Config.setPixelFormat("yuva444p10le");
Config.setCodec("prores");
Config.setProResProfile("4444");

// Logo and fonts come straight from the studio's brand/ folder.
Config.setPublicDir("../../brand");
