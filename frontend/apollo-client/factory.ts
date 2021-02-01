import {createErrorHandlerLink} from "./errors";
import {ApolloClient, from, HttpLink, InMemoryCache, split} from "@apollo/client";
import {TStore} from "../types";
import {getMainDefinition} from "@apollo/client/utilities";
import {WebSocketLink} from "@apollo/client/link/ws";

const httpLink = new HttpLink({
    uri: "/api/graphql",
});

const webSocketProtocol = window.location.protocol === "https:" ? "wss" : "ws";

const wsLink = new WebSocketLink({uri: `${webSocketProtocol}://${window.location.host}/api/subscribe`});

const cache = new InMemoryCache();

export const createClient = (store: TStore) => {
    return new ApolloClient({
        cache,
        link: from([
            createErrorHandlerLink(store),
            // apolloLogger,
            split(
                // split based on operation type
                ({query}) => {
                    const definition = getMainDefinition(query);
                    return (
                        definition.kind === 'OperationDefinition' &&
                        definition.operation === 'subscription'
                    );
                },
                wsLink,
                httpLink,
            ),
        ]),
    });
};
