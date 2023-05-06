import { ApolloProvider } from "@apollo/client";
import { colors, CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import * as React from "react";
import { IntlProvider } from "react-intl";
import { Provider as ReduxStoreProvider } from "react-redux";
import { createClient } from "../apollo-client/factory";
import { ConfigProvider } from "../contexts/config";
import configureStore from "../store";
import { messages } from "../translations/tools";
import { MainFrame } from "./MainFrame";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
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
                    <ThemeProvider theme={darkTheme}>
                        <CssBaseline/>
                        <ConfigProvider>
                            <MainFrame />
                        </ConfigProvider>
                    </ThemeProvider>
                </IntlProvider>
            </ReduxStoreProvider>
        </ApolloProvider>
    );
}
