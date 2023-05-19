import { TStore } from "@/types";
import { ApolloClient, from, HttpLink, InMemoryCache, split } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { createErrorHandlerLink } from "./errors";

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
