import * as React from "react";
import {useEffect, useRef} from "react";
import {TransitionProps} from "@material-ui/core/transitions";
import {DialogActions, Slide} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import {kioskLocalStorage} from "./tools";
import {FormattedButton} from "./translations";


type IfCompProps = {
    condition: any,
    children: React.ReactNode,
    else_?: React.ReactNode,
}

export const If = ({condition, children, else_ = null}: IfCompProps) => (
    (!!condition) ? <React.Fragment>{children}</React.Fragment> : <React.Fragment>{else_}</React.Fragment>
);

export const SlideUp = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement<any, any> },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const SlideDown = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement<any, any> },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="down" ref={ref} {...props} />;
});

export const BoolIcon = ({value}: { value: boolean }) => (value ? <CheckIcon/> : <CloseIcon/>);

export const Audio = ({src}: { src: string }) => {
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (audioRef.current)
            audioRef.current.volume = kioskLocalStorage.volume / 100;
    }, [src])

    return <audio src={src} autoPlay loop ref={audioRef}/>;
};

export const DialogActionButtons = ({onCancel, onSubmit}: { onSubmit: () => void, onCancel: () => void }) => (
    <DialogActions>
        <FormattedButton onClick={onSubmit} msgId="submit"/>
        <FormattedButton onClick={onCancel} msgId="cancel" color="secondary"/>
    </DialogActions>
);
