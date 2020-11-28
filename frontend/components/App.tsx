import * as React from "react";
import {colors, createMuiTheme, CssBaseline, MuiThemeProvider} from "@material-ui/core";
import {BrowserRouter as Router} from "react-router-dom";
import messages from "../translations";
import {IntlProvider} from "react-intl";
import Kiosk from "./layouts/kiosk/Kiosk";
import {createClient} from "../apollo-client/factory";
import {ApolloProvider} from "@apollo/client";
import {Provider as ReduxStoreProvider} from "react-redux";
import configureStore from "../store";

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
    typography: {
        fontSize: 22,
    }
});

const store = configureStore();
const client = createClient(store);

export default () => {
    return (
        <ApolloProvider client={client}>
            <ReduxStoreProvider store={store}>
                <IntlProvider messages={messages.en} locale="en" defaultLocale="en">
                    <MuiThemeProvider theme={darkTheme}>
                        <Router>
                            <CssBaseline/>
                            <Kiosk/>
                        </Router>
                    </MuiThemeProvider>
                </IntlProvider>
            </ReduxStoreProvider>
        </ApolloProvider>
    );
}
