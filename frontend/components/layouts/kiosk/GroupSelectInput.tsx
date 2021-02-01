import * as React from "react";
import {gql, useQuery} from "@apollo/client";
import {GroupList} from "./__generated__/GroupList";
import TextFieldDialog from "../../keyboard/TextFieldDialog";
import {FormattedButton} from "../../translations";
import {useBoolState} from "../../../hooks";
import {Dialog, DialogContent, List, ListItem} from "@material-ui/core";
import {FormattedDialogTitle} from "../../widgets/dialogs";
import {FormattedMessage} from "react-intl";

const groupListQuery = gql`
    query GroupList {
        groups {
            id
            name
        }
    }
`;

type Props = {
    value: string,
    onChange: (val: string) => void,
};


export default ({value, onChange}: Props) => {
    const [isShowDialog, showDialog, hideDialog] = useBoolState();
    const {data} = useQuery<GroupList>(groupListQuery, {fetchPolicy: "cache-and-network"});

    const groups = data?.groups ?? [];

    return (
        <div style={{display: "flex"}}>
            <TextFieldDialog
                label={<FormattedMessage id="group"/>}
                value={value}
                onChange={ev => onChange(ev.target.value)}
                fullWidth
                style={{marginRight: 10}}
            />
            <FormattedButton
                msgId="selectGroup"
                variant="contained"
                size="small"
                style={{whiteSpace: "nowrap", minWidth: "auto"}}
                onClick={showDialog}
                disabled={groups.length === 0}
            />
            <Dialog open={isShowDialog} onClose={hideDialog}>
                <FormattedDialogTitle msgId="selectGroup" onCloseIconClick={hideDialog}/>
                <DialogContent>
                    <List>
                        {groups.map(grp => (
                            <ListItem
                                key={grp.id}
                                button
                                onClick={() => {
                                    onChange(grp.name);
                                    hideDialog();
                                }}
                            >
                                {grp.name}
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
            </Dialog>
        </div>
    );
}
