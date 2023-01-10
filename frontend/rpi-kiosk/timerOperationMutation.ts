import { gql } from "@apollo/client";

export const timerOperationMutation = gql`
    mutation TimerOperationMutation($id: Int! $operation: TimerOperation!) {
        operateTimer(id: $id operation: $operation) {
            errors {
                type
            }
        }
    }
`;
