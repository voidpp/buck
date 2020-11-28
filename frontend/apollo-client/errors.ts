import {BackendErrorCode, TStore} from "../types";
import {setBackendError} from "../actions";
import {onError} from "@apollo/client/link/error";

export const createErrorHandlerLink = (store: TStore) => {
    return onError(({graphQLErrors, networkError, operation, forward}) => {

        if (graphQLErrors?.length) {
            const err = graphQLErrors[0];
            const code = err.extensions?.code as BackendErrorCode ?? "unknown";

            switch (code) {
                default:
                    store.dispatch(setBackendError({
                        code,
                        details: `Message: ${err.message}` + (err.path ? `\nPath: ${err.path.join('.')}` : ''),
                    }));
            }

        }

        if (networkError && !graphQLErrors)
            store.dispatch(setBackendError({code: "unreachable"}));
    });
};
