import { ApolloProvider } from "@apollo/client";
import * as React from "react";
import { IntlProvider } from "react-intl";
import { Provider as ReduxStoreProvider } from "react-redux";
import { createClient } from "./apollo-client/factory";
import { ConfigProvider } from "./contexts/config";
import { LayoutRouter } from "./layouts/LayoutRouter";
import configureStore from "./store";
import { messages } from "./translations/tools";

const store = configureStore();
const client = createClient(store);

export default () => {
    return (
        <ApolloProvider client={client}>
            <ReduxStoreProvider store={store}>
                <IntlProvider messages={messages.en} locale="en" defaultLocale="en">
                    <ConfigProvider>
                        <LayoutRouter />
                    </ConfigProvider>
                </IntlProvider>
            </ReduxStoreProvider>
        </ApolloProvider>
    );
};
