import { palette, ThemeName } from "../theme/tokens";
import { useState } from "react";

let current: ThemeName = "light";
export const setTheme = (t: ThemeName) => { current = t; };

export const useThemeColors = () => {
  useState(current); 
  return { colors: palette[current] };
};
