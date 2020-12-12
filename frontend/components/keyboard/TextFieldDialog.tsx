import * as React from "react";
import {useState} from "react";
import {useBoolState} from "../../hooks";
import {Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, Slide, TextField, TextFieldProps} from "@material-ui/core";
import Keyboard from "./Keyboard";
import {TransitionProps} from "@material-ui/core/transitions";
import {FormattedButton, FormattedMessage} from "../translations";
import {LayoutName, layouts} from "./layouts";
import {objectKeys} from "../../tools";


type Props = TextFieldProps;

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement<any, any> },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});


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
                <TextField value={text} fullWidth label={label}/>
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
                TransitionComponent={Transition}
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
