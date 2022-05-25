// https://bareynol.github.io/mui-theme-creator/

export interface PageTheme {
   "--color-bg-main": string;
   "--color-bg-paper": string;
   "--color-txt-main": string;
   "--color-primary-main": string;
   "--color-primary-light": string;
   "--color-primary-dark": string;
   "--color-primary-txt-contrast": string;
   "--color-secondary-main": string;
   "--color-secondary-light": string;
   "--color-secondary-dark": string;
   "--color-secondary-txt-contrast": string;
}

export const DARK_THEME_COLORS: PageTheme = {
   "--color-bg-main": "#0d0b0a",
   "--color-bg-paper": "#52453f",
   "--color-txt-main": "#f5f2eb",
   "--color-primary-main": "#aca199",
   "--color-primary-light": "rgb(188, 179, 173)",
   "--color-primary-dark": "rgb(120, 112, 107)",
   "--color-primary-txt-contrast": "rgba(0, 0, 0, 0.87)",
   "--color-secondary-main": "#f5f2ec",
   "--color-secondary-light": "rgb(247, 244, 239)",
   "--color-secondary-dark": "rgb(171, 169, 165)",
   "--color-secondary-txt-contrast": "rgba(0, 0, 0, 0.87)",
};

export const LIGHT_THEME_COLORS: PageTheme = {
   "--color-bg-main": "#F5F2EC",
   "--color-bg-paper": "#ffffff",
   "--color-txt-main": "rgba(0, 0, 0, 0.87)",
   "--color-primary-main": "#1c1816",
   "--color-primary-light": "rgb(73, 70, 68)",
   "--color-primary-dark": "rgb(19, 16, 15)",
   "--color-primary-txt-contrast": "#ffffff",
   "--color-secondary-main": "#aca199",
   "--color-secondary-light": "rgb(188, 179, 173)",
   "--color-secondary-dark": "rgb(120, 112, 107)",
   "--color-secondary-txt-contrast": "rgba(0, 0, 0, 0.87)",
};
