// panda.config.ts
import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx,svelte}", "./pages/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      tokens: {
        fonts: {
          body: {
            value: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
            description: "Body font family",
          },
        },
        fontSizes: {
          lg: {
            value: "32px",
            description: "Large font size",
          },
          md: {
            value: "16px",
            description: "Medium font size",
          },
        },
        fontWeights: {
          heading: {
            value: "600",
            description: "Font weight for headings",
          },
        },
        colors: {
          fg: {
            value: "#2b3a42",
            description: "Foreground color",
          },
          fgMuted: {
            value: "#7a8a99",
            description: "Muted foreground color",
          },
          border: {
            value: "#d1dde6",
            description: "Border color",
          },
          bg: {
            value: "#e6eef4",
            description: "Background color",
          },
          bgForm: {
            value: "#f9f9fb",
            description: "Form background color",
          },
          bgControl: {
            value: "#e0e8ef",
            description: "Control background color",
          },
          status: {
            warning: {
              value: "#f0ad4e",
              description: "Warning status color",
            },
            warningContrast: {
              value: "#fff",
              description: "Warning status contrast color",
            },
            error: {
              value: "#d9534f",
              description: "Error status color",
            },
            errorContrast: {
              value: "#f2dede",
              description: "Error status contrast color",
            },
            errorBgMuted: {
              value: "rgba(210, 83, 79, 0.05)",
              description: "Muted error background color",
            },
          },
        },
        shadows: {
          controlFocusVisible: {
            value: `inset 0 0 0 1px {colors.fg}, 0 0 0 1px {colors.fg}`
          },
          controlWarning: {
            value: `inset 0 0 0 1px {colors.status.warning}, 0 0 0 1px {colors.status.warning}`
          },
          page: {
            value: `0 0 1.5rem rgba(0, 0, 0, 0.025)`
          }
        },
        radii: {
          control: {
            value: "0.35rem",
            description: "Control border radius",
          },
          page: {
            value: "0.5rem",
            description: "Page border radius",
          },
        },
        sizes: {
          controlHeight: {
            value: "32px",
            description: "Control height",
          },
        },
        easings: {
          control: {
            value: "0.1s",
            description: "Control transition duration",
          },
        },
      },
    },
  },

  patterns: {
    extend: {
      pressable: {
        description: "Styles for a pressable element",
        defaultValues: {
          fontFamily: "body",
          fontSize: "md",
          backgroundColor: "bgControl",
          borderRadius: "control",
          border: "none",
          padding: "0.25rem 0.5rem",
          height: "controlHeight",
          lineHeight: "controlHeight",
          color: "inherit",
          outline: "none",
          position: "relative",
          cursor: "pointer",
          _disabled: {
            cursor: "not-allowed"
          },
          _hover: {

          },
          _focus: {
            zIndex: 1,
            boxShadow: "controlFocusVisible"
          },
        },
        transform(props) {
          return {
            ...props,
          };
        },
      },
      inputField: {
        description: 'Styles for input fields',
        properties: {
          fontSize: { type: 'string' },
          fontFamily: { type: 'string' },
          backgroundColor: { type: 'string' },
          borderRadius: { type: 'string' },
          border: { type: 'string' },
          padding: { type: 'string' },
          height: { type: 'string' },
          width: { type: 'string' },
          color: { type: 'string' },
          outline: { type: 'string' },
          boxShadow: { type: 'string' },
        },
        defaultValues: {
          fontFamily: "body",
          fontSize: "md",
          backgroundColor: "bgControl",
          borderRadius: "control",
          border: "none",
          width: "100%",
          padding: "0 0.5rem",
          height: "controlHeight",
          maxHeight: "controlHeight",
          minHeight: "controlHeight",
          lineHeight: "controlHeight",
          color: "inherit",
          outline: "none",
          position: "relative",
          _focus: {
            zIndex: 1,
            boxShadow: "controlFocusVisible"
          },
          "&.isWarning": {
            boxShadow: "controlWarning"
          }
        },
        transform(props) {
          return {
            ...props,
          };
        },
      },
    },
  },


  globalCss: {
    "body": {
      minHeight: "100vh",
      margin: 0,
      padding: "1rem",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      fontSize: "md",
      unicodeBidi: "embed",
      fontFamily: "body",
      lineHeight: 1.5,
      color: "fg",
      backgroundColor: "bg",
    }
  },

  // Weird build issues? Try setting this to 'react' and then back to 'svelte'.
  jsxFramework: 'react',

  // The output directory for your css system
  outdir: "styled-system",
});
