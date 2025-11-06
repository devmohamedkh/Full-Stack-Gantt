import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#60C0E0",
        },
        secondary: {
            main: "#F7C548",
        },
        background: {
            default: "#1A2B40",
            paper: "#1A2B40",
        },
        text: {
            primary: "#FFFFFF",
            secondary: "#E0E0E0",
        },
        divider: "#4A6B8C",
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
            fontSize: "2rem",
        },
        h2: {
            fontWeight: 600,
            fontSize: "1.5rem",
        },
        h3: {
            fontWeight: 600,
            fontSize: "1.25rem",
        },
        body1: {
            fontSize: "0.875rem",
        },
        body2: {
            fontSize: "0.75rem",
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    borderRadius: 4,
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: "none",
                },
            },
        },
    },
});

// Task color palette matching the image
export const taskColors = {
    planning: "#F7C548", // Orange-yellow
    packaging: "#C0E060", // Light green-yellow
    marketing: "#F08040", // Orange
    sales: "#60C0E0", // Light blue
    statistics: "#E04060", // Red
};

export const getTaskColor = (index: number): string => {
    const colors = Object.values(taskColors);
    return colors[index % colors.length];
};
