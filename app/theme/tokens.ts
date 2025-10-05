export const spacing = { xs:4, sm:8, md:12, lg:16, xl:24 } as const;
export const radius  = { sm:8, md:12, lg:16, xl:20 } as const;

export const palette = {
  light: {
    background: "#FFFFFF",
    surface: "#F7F7F9",
    text: "#222222",
    primary: "#B56531",     
    muted: "#7B7F85",
    border: "#E6E6EA",
    tabBarBackground: "#FFFFFF",
    shadow: "rgba(0,0,0,0.08)",
  },
  dark: {
    background: "#0B0B10",
    surface: "#171720",
    text: "#F7F7F7",
    primary: "#D28C5C",
    muted: "#A3A7AE",
    border: "#2C2D35",
    tabBarBackground: "#171720",
    shadow: "rgba(0,0,0,0.35)",
  },
} as const;

export type ThemeName = keyof typeof palette;
