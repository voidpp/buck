import * as React from "react";
import {useState} from "react";
import {useBoolState} from "../../hooks";
import {Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, Slide, TextField, TextFieldProps} from "@material-ui/core";
import Keyboard from "./Keyboard";
import {TransitionProps} from "@material-ui/core/transitions";
import {FormattedButton, FormattedMessage} from "../translations";
import {LayoutName, layouts} from "./layouts";
import {objectKeys} from "../../tools";


type Props = {} & TextFieldProps;

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement<any, any> },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default (props: Props) => {
    const [isShowDialog, showDialog, hideDialog] = useBoolState();
    const [text, setText] = useState<string>(props.value as string ?? "");
    const [edited, setEdited] = useState(false);
    const [layoutName, setLayoutName] = useState<LayoutName>("hungarian"); // TODO: localstorage

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
                TransitionComponent={Transition}
                keepMounted
            >
                <DialogTitle>
                    <TextField value={text} fullWidth label={props.label}/>
                </DialogTitle>
                <DialogContent>
                    <Keyboard value={text} onChange={setText} layout={layouts[layoutName]}/>
                </DialogContent>
                <DialogActions style={{justifyContent: "flex-start", padding: "0px 1em 0.4em"}}>
                    <Select
                        value={layoutName}
                        onChange={ev => setLayoutName(ev.target.value as LayoutName)}
                        style={{minWidth: 150}}
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
                            setEdited(true);
                            hideDialog();
                            // @ts-ignore
                            props.onChange({target: {value: text}});
                        }}
                    />
                    <FormattedButton
                        color="secondary"
                        msgId="cancel"
                        onClick={() => {
                            setEdited(true);
                            hideDialog();
                            setText(props.value as string ?? "")
                        }}
                    />
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
