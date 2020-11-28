import {gql} from "@apollo/client";

export const predefinedTimerListQuery = gql`
    query PredefinedTimerList {
        predefinedTimers {
            name
            length
            id
            group {
                id
                name
            }
        }
    }
`;
