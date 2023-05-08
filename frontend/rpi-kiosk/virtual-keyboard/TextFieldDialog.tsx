import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Select, TextField, TextFieldProps } from "@mui/material";
import * as React from "react";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { useBoolState } from "../../hooks";
import { objectKeys } from "../../tools";
import { FormattedButton } from "../translations";
import { SlideUp } from "../widgets";
import Keyboard from "./Keyboard";
import { LayoutName, layouts } from "./layouts";


type Props = TextFieldProps;

type ContentProps = {
    setEdited: () => void,
    value: string,
    label: React.ReactNode,
    hideDialog: () => void,
    onChange: (value: string) => void,
};

const Content = ({hideDialog, label, setEdited, value, onChange}: ContentProps) => {
    const [text, setText] = useState<string>(value);
    const [layoutName, setLayoutName] = useState<LayoutName>("hungarian"); // TODO: localstorage


    return (
        <React.Fragment>
            <DialogTitle>
                <div style={{display: "flex"}}>
                    <TextField value={text} fullWidth label={label}/>
                    <IconButton style={{marginBottom: -20, marginLeft: -50}} onClick={() => setText("")}>
                        <CloseIcon/>
                    </IconButton>
                </div>
            </DialogTitle>
            <DialogContent>
                <Keyboard value={text} onChange={setText} layout={layouts[layoutName]}/>
            </DialogContent>
            <DialogActions style={{justifyContent: "flex-start", padding: "0px 1em 0.4em"}}>
                <Select
                    value={layoutName}
                    onChange={ev => setLayoutName(ev.target.value as LayoutName)}
                    style={{minWidth: 150}}
                    variant='standard'
                >
                    {objectKeys(layouts).map(name => (
                        <MenuItem key={name} value={name}>
                            <FormattedMessage id={name}/>
                        </MenuItem>
                    ))}
                </Select>
                <div style={{flexGrow: 1}}/>
                <FormattedButton
                    msgId="submit"
                    onClick={() => {
                        setEdited();
                        hideDialog();
                        onChange(text);
                    }}
                />
                <FormattedButton
                    color="secondary"
                    msgId="cancel"
                    onClick={() => {
                        setEdited();
                        hideDialog();
                        setText(value);
                    }}
                />
            </DialogActions>
        </React.Fragment>
    );
}

export default (props: Props) => {
    const [isShowDialog, showDialog, hideDialog] = useBoolState();
    const [edited, setEdited] = useState(false);

    const onFocus = () => {
        if (!edited)
            showDialog();
    }

    const onBlur = () => {
        if (!isShowDialog)
            setEdited(false);
    }

    return (
        <React.Fragment>
            <TextField {...props} onFocus={onFocus} onBlur={onBlur}/>
            <Dialog
                open={isShowDialog}
                fullScreen
                TransitionComponent={SlideUp}
                // keepMounted
            >
                <Content
                    setEdited={() => setEdited(true)}
                    value={props.value as string ?? ""}
                    label={props.label}
                    hideDialog={hideDialog}
                    onChange={value => {
                        // @ts-ignore
                        props.onChange({target: {value}});
                    }}
                />
            </Dialog>
        </React.Fragment>
    );
}
