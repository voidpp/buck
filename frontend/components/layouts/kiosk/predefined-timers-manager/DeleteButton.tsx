import * as React from "react";
import {PredefinedTimer} from "../../../../api";
import ConfirmDeleteButton from "../../../ConfirmDeleteButton";
import {gql, useMutation} from "@apollo/client";
import {DeleteTimerMutation, DeleteTimerMutationVariables} from "./__generated__/DeleteTimerMutation";

const deleteTimerMutation = gql`
    mutation DeleteTimerMutation($id: Int!) {
        deletePredefinedTimer(id: $id) {
            id
        }
    }
`;

export default ({timer, onDeleteSuccess}: { timer: PredefinedTimer, onDeleteSuccess: Function }) => {

    const [deleteTimer] = useMutation<DeleteTimerMutation, DeleteTimerMutationVariables>(deleteTimerMutation);

    const confirm = async () => {
        await deleteTimer({variables: {id: timer.id}});
        onDeleteSuccess();
    };

    return (
        <ConfirmDeleteButton
            onConfirm={confirm}
            messageId="deletePredefinedTimer"
            messageVars={{name: timer.name}}
        />
    );
}
