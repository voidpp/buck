import * as React from "react";
import {PredefinedTimer} from "../../api";
import {IconButton} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import SavePredefinedTimerDialog from "../SavePredefinedTimerDialog";
import {useBoolState} from "../../hooks";


export default ({timer, onSuccess}: { timer: PredefinedTimer, onSuccess: () => void }) => {

    const [isOpen, open, close] = useBoolState();

    return (
        <React.Fragment>
            <IconButton size="small" style={{marginRight: 10}} onClick={open}>
                <EditIcon fontSize="small"/>
            </IconButton>
            <SavePredefinedTimerDialog
                show={isOpen}
                close={close}
                data={{...timer, groupName: timer.group?.name ?? ""}}
                onSuccess={onSuccess}
            />
        </React.Fragment>
    );
}
