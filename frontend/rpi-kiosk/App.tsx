import * as React from "react";
import {colors, createMuiTheme, CssBaseline, MuiThemeProvider} from "@material-ui/core";
import {messages} from "../translations/tools";
import {IntlProvider} from "react-intl";
import Kiosk from "./Kiosk";
import {createClient} from "../apollo-client/factory";
import {ApolloProvider} from "@apollo/client";
import {Provider as ReduxStoreProvider} from "react-redux";
import configureStore from "../store";
import {ConfigProvider} from "../contexts/config";

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
                        <CssBaseline/>
                        <ConfigProvider>
                            <Kiosk/>
                        </ConfigProvider>
                    </MuiThemeProvider>
                </IntlProvider>
            </ReduxStoreProvider>
        </ApolloProvider>
    );
}
