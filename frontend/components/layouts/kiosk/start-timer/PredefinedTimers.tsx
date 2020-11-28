import * as React from "react";
import {useBoolState} from "../../../../hooks";
import {Dialog, DialogContent, List, ListItem, ListItemText, ListSubheader} from "@material-ui/core";
import {FormattedButton} from "../../../translations";
import {useGroupedPredefinedTimerList} from "../hooks";

type Props = {
    onSelect: (length: number, name: string, id: number) => void,
};

export default ({onSelect}: Props) => {
    const [isShowDialog, showDialog, hideDialog] = useBoolState();

    const groupedTimers = useGroupedPredefinedTimerList();

    return (
        <React.Fragment>
            <FormattedButton onClick={showDialog} msgId="predefinedTimersSelect"/>
            <Dialog open={isShowDialog} onClose={hideDialog}>
                <DialogContent>
                    {groupedTimers.map(grp => (
                        <List
                            key={grp.group?.id ?? 0}
                            subheader={(
                                <ListSubheader disableSticky={true}>
                                    {grp.group?.name ?? 'empty'}
                                </ListSubheader>
                            )}
                        >
                            {grp.predefinedTimers.map(t => (
                                <ListItem button key={t.id} onClick={() => {
                                    onSelect(t.length, t.name, t.id);
                                    hideDialog();
                                }}>
                                    <ListItemText>{t.name} ({t.length}s)</ListItemText>
                                </ListItem>
                            ))}
                        </List>
                    ))}
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}
