import {createErrorHandlerLink} from "./errors";
import {ApolloClient, from, HttpLink, InMemoryCache} from "@apollo/client";
import {TStore} from "../types";
import apolloLogger from 'apollo-link-logger';

const httpLink = new HttpLink({
    uri: "/api/graphql",
});

const cache = new InMemoryCache();

export const createClient = (store: TStore) => {
    return new ApolloClient({
        cache,
        link: from([
            createErrorHandlerLink(store),
            apolloLogger,
            httpLink,
        ]),
    });
};
