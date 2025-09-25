import { CY } from "./config.js";

const colorSchemes = {
  amber: {
    key: "CY.ColorSchemeAmber",
    accent: "gray",
    background: "#282828",
    buttonBackground: "#FFCC0033",
    buttonForeground: "#FFCC00",
    cyberText: "#F8F800",
    disabled: "gray",
    foreground: "#FFB000",
    highlight: "#FFCC00",
    sheetShadow: "0px 0px 15px 5px gray",
    windowBackground: "#282828",
  },  
  blackOnWhite: {
    key: "CY.ColorSchemeBlackOnWhite",
    accent: "#656565",
    background: "#ffffff",
    buttonBackground: "#000000",
    buttonForeground: "#ffffff",    
    cyberText: "#ffffff",
    disabled: "gray",
    foreground: "#000000",
    highlight: "#656565",
    sheetShadow: "none",
    windowBackground: "#ffffff",
  },   
  c64: {
    key: "CY.ColorSchemeC64",
    accent: "#8B4096",
    background: "#41328D",
    buttonBackground: "#8B409666",
    buttonForeground: "#68B6BD",
    cyberText: "#F8F800",
    disabled: "gray",
    foreground: "#68B6BD",
    highlight: "#8B4096",
    sheetShadow: "0px 0px 15px 5px #8B4096",
    windowBackground: "#41328D",
  },    
  chalk: {
    key: "CY.ColorSchemeChalk",
    accent: "#656565",
    background: "#2E2E2E",
    buttonBackground: "#65656566",
    buttonForeground: "#D4D4D4",    
    cyberText: "#F8F800",
    disabled: "gray",
    foreground: "#D4D4D4",
    highlight: "#656565",
    sheetShadow: "none",
    windowBackground: "#2E2E2E",
  },  
  defcon27: {
    key: "CY.ColorSchemeDefcon27",
    accent: "#FF63BE",
    background: "#000000",
    buttonBackground: "#B55AFC33",
    buttonForeground: "#B55AFC",    
    cyberText: "#F8F800",
    disabled: "gray",
    foreground: "#07CAF9",
    highlight: "#B55AFC",
    sheetShadow: "0px 0px 15px 5px #FF63BE",    
    windowBackground: "#000000",
  },
  flintwyrm: {
    key: "CY.ColorSchemeFlintwyrm",
    accent: "#71C5C9",
    background: "#000000",
    buttonBackground: "#F800F833",
    buttonForeground: "#F800F8",
    cyberText: "#F8F800",
    disabled: "gray",
    foreground: "#F6EDDB",
    highlight: "#F800F8",
    sheetShadow: "none",
    windowBackground: "#333333",
  },
  greenHell: {
    key: "CY.ColorSchemeGreenHell",
    accent: "gray",
    background: "#062C01",
    buttonBackground: "#A0C5771A",
    buttonForeground: "#A0C577",
    cyberText: "#F8F800",
    disabled: "gray",
    foreground: "#0CFF01",
    highlight: "#A0C577",
    sheetShadow: "0px 0px 15px 5px #0CFF01",  
    windowBackground: "#062C01",
  },
  mork: {
    key: "CY.ColorSchemeMork",
    accent: "gray",
    background: "#000000",
    buttonBackground: "#FFFFFF33",
    buttonForeground: "#FFFFFF",    
    cyberText: "#F8F800",
    disabled: "gray",
    foreground: "#FFE800",
    highlight: "#FFFFFF",
    sheetShadow: "none",
    windowBackground: "#000000",
  },  
  p0w3rsh3ll: {
    key: "CY.ColorSchemeP0w3rsh3ll",
    accent: "gray",
    background: "#032556",
    buttonBackground: "#F7F00D33",
    buttonForeground: "#F7F00D",       
    cyberText: "#F8F800",
    disabled: "gray",
    foreground: "#EEEDF0",
    highlight: "#F7F00D",
    sheetShadow: "none",
    windowBackground: "#032556",
  },
  solarizedDark: {
    key: "CY.ColorSchemeSolarizedDark",
    // blue 1F88D2
    // cream FDF6E3
    // almost black 002B36
    // gray light 93A1A1
    // magenta D33682 
    // orange B58900
    accent: "#B58900",
    background: "#002B36",
    buttonBackground: "#1F88D233",
    buttonForeground: "#1F88D2",      
    cyberText: "#D33682",
    disabled: "gray",
    foreground: "#93A1A1",
    highlight: "#1F88D2",    
    sheetShadow: "none",
    windowBackground: "#002B36",
  },
  solarizedLight: {
    key: "CY.ColorSchemeSolarizedLight",    
    accent: "#B58900",
    background: "#FDF6E3",
    buttonBackground: "#268BD233",
    buttonForeground: "#268BD2",       
    cyberText: "#D33682",
    disabled: "gray",
    foreground: "#657B83",
    highlight: "#268BD2",
    sheetShadow: "none",
    windowBackground: "#FDF6E3",
  },
  virtuaBoi: {
    key: "CY.ColorSchemeVirtuaBoi",
    accent: "gray",
    background: "#530300",
    buttonBackground: "#94000033",
    buttonForeground: "#E60000",      
    cyberText: "#F8F800",
    disabled: "gray",
    foreground: "#E60000",
    highlight: "#940000",
    sheetShadow: "0px 0px 15px 5px #E60000",     
    windowBackground: "#530300",    
  },
};

export const colorChoices = Object.keys(colorSchemes).reduce((accum, curr) => {
  accum[curr] = colorSchemes[curr].key;
  return accum;
}, {});

export const applyFontsAndColors = () => {
  const colorSchemeSetting = game.settings.get(CY.system, "colorScheme");
  const colorScheme = colorSchemes[colorSchemeSetting];
  const r = document.querySelector(":root");
  // CY css variables
  r.style.setProperty("--cy-accent-color", colorScheme.accent);
  r.style.setProperty("--cy-background-color", colorScheme.background);
  r.style.setProperty("--cy-button-background-color", colorScheme.buttonBackground);
  r.style.setProperty("--cy-button-foreground-color", colorScheme.buttonForeground);
  r.style.setProperty("--cy-cybertext-color", colorScheme.cybertext);
  r.style.setProperty("--cy-disabled-color", colorScheme.disabled);
  r.style.setProperty("--cy-foreground-color", colorScheme.foreground);
  r.style.setProperty("--cy-highlight-color", colorScheme.highlight);
  r.style.setProperty("--cy-sheet-shadow", colorScheme.sheetShadow);
  r.style.setProperty("--cy-window-background-color", colorScheme.windowBackground);
  // Foundry css variables
  r.style.setProperty("--color-text-hyperlink", colorScheme.highlight);
  r.style.setProperty("--color-shadow-primary", colorScheme.highlight);
  r.style.setProperty("--color-shadow-highlight", colorScheme.highlight);
  r.style.setProperty("--color-border-highlight", colorScheme.highlight);
  r.style.setProperty("--color-border-highlight-alt", colorScheme.highlight);

  // TODO: fonts
  // --font-primary: 'Perfect DOS VGA 437';                
};
