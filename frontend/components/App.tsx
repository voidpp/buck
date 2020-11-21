import * as React from "react";
import {colors, createMuiTheme, CssBaseline, MuiThemeProvider} from "@material-ui/core";
import {BrowserRouter as Router} from "react-router-dom";
import messages from "../translations";
import {IntlProvider} from "react-intl";

const lightTheme = createMuiTheme({
    palette: {
        type: 'light',
        primary: colors.blue,
    },
    typography: {}
});


const darkTheme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: colors.cyan,
        secondary: colors.pink,
    },
    typography: {}
});

export default () => {
    return (
        <IntlProvider messages={messages.en} locale="en" defaultLocale="en">
            <MuiThemeProvider theme={darkTheme}>
                <Router>
                    <CssBaseline/>
                </Router>
            </MuiThemeProvider>
        </IntlProvider>
    );
}
