import { Config } from "@remotion/cli/config";

// Defaults = transparent ProRes 4444 .mov for overlaying in CapCut.
// render.sh adds --prores-profile=4444, or overrides these for opaque .mp4 cards.
Config.setVideoImageFormat("png");
Config.setPixelFormat("yuva444p10le");
Config.setCodec("prores");

// Logo and fonts come straight from the studio's brand/ folder.
Config.setPublicDir("../../brand");
