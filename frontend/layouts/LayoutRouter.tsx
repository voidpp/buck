import {
    Box,
    CssBaseline,
    Theme,
    ThemeOptions,
    ThemeProvider,
    colors,
    createTheme,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import * as React from "react";
import { LayoutConfig, LayoutConfigContext } from "../contexts/layoutSettings";
import { RPiKioskLayout } from "./rpi-kiosk/Layout";
import { SmallPortraitLayout } from "./small-portrait/Layout";

const basePalette: ThemeOptions["palette"] = {
    mode: "dark",
    primary: colors.cyan,
    secondary: colors.pink,
    background: {
        default: "#222",
    },
};

const baseTheme = createTheme({
    palette: basePalette,
    components: {
        MuiTextField: {
            defaultProps: {
                size: "small",
            },
        },
    },
});

const kioskTheme = createTheme({
    palette: basePalette,
    typography: {
        fontSize: 22,
    },
    components: {
        MuiTextField: {
            defaultProps: {
                variant: "standard",
            },
        },
    },
});

export const LayoutRouter = () => {
    const theme = useTheme();
    const isSmallPortrait = useMediaQuery(theme.breakpoints.down("sm"));
    const isRpiKiosk = useMediaQuery("(width: 800px)");

    let Component = () => <Box>TODO</Box>;
    let layoutConfig: LayoutConfig = { virtualKeyboard: false };
    let layoutTheme: Theme = baseTheme;

    if (isSmallPortrait) {
        Component = SmallPortraitLayout;
        layoutConfig = { virtualKeyboard: false };
    }

    if (isRpiKiosk) {
        Component = RPiKioskLayout;
        layoutConfig = { virtualKeyboard: true };
        layoutTheme = kioskTheme;
    }

    return (
        <LayoutConfigContext.Provider value={layoutConfig}>
            <ThemeProvider theme={layoutTheme}>
                <CssBaseline />
                <Component />
            </ThemeProvider>
        </LayoutConfigContext.Provider>
    );
};
