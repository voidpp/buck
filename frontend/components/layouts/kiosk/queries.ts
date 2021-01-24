import {gql} from "@apollo/client";

export const predefinedTimerListQuery = gql`
    query PredefinedTimerList {
        predefinedTimers {
            name
            length
            id
            soundFile
            group {
                id
                name
            }
        }
    }
`;


export const startTimerMutation = gql`
    mutation StartTimerMutation($name: String, $length: String!, $predefinedTimerId: Int, $soundFile: String!) {
        startTimer(name: $name length: $length predefinedTimerId: $predefinedTimerId soundFile: $soundFile) {
            id
            errors {
                path
                type
                context
            }
        }
    }
`;
