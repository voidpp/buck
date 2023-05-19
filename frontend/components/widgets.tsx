import { buckLocalStorage } from "@/tools";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Box, DialogActions, Slide, SxProps, Typography } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import * as React from "react";
import { useEffect, useRef } from "react";
import { useInterval } from "../hooks";
import { FormattedButton } from "../translations";

type IfCompProps = {
    condition: any;
    children: React.ReactNode;
    else_?: React.ReactNode;
};

export const If = ({ condition, children, else_ = null }: IfCompProps) =>
    !!condition ? <React.Fragment>{children}</React.Fragment> : <React.Fragment>{else_}</React.Fragment>;

export const SlideUp = React.forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement<any, any> },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const SlideDown = React.forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement<any, any> },
    ref: React.Ref<unknown>
) {
    return <Slide direction="down" ref={ref} {...props} />;
});

export const BoolIcon = ({ value }: { value: boolean }) => (value ? <CheckIcon /> : <CloseIcon />);

export const Audio = ({ src }: { src: string }) => {
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = buckLocalStorage.volume / 100;
    }, [src]);

    return <audio src={src} autoPlay loop ref={audioRef} />;
};

export const DialogActionButtons = ({ onCancel, onSubmit }: { onSubmit: () => void; onCancel: () => void }) => (
    <DialogActions>
        <FormattedButton onClick={onSubmit} msgId="submit" />
        <FormattedButton onClick={onCancel} msgId="cancel" color="secondary" />
    </DialogActions>
);

export const Timedelta = ({ value }: { value: number }) => {
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value - hours * 3600) / 60);
    const seconds = value % 60;

    return (
        <span>
            {hours ? `${hours}:` : ""}
            {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
        </span>
    );
};

export const Counter = ({ sx }: { sx?: SxProps }) => {
    const [milliSeconds, setMilliSeconds] = React.useState(0);
    useInterval(() => setMilliSeconds(milliSeconds + 100), 100);

    const minutes = Math.floor(milliSeconds / 1000 / 60);
    const seconds = Math.floor((milliSeconds - minutes * 60 * 1000) / 1000);
    const ms = Math.floor((milliSeconds % 1000) / 100);

    return (
        <Box sx={sx} component="span">
            {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}.{ms.toString().padStart(1, "0")}
        </Box>
    );
};

export const Fieldset = ({
    label,
    children,
    sx,
}: {
    label: React.ReactNode;
    children: React.ReactNode;
    sx?: SxProps;
}) => (
    <Box
        component="fieldset"
        sx={{ borderRadius: 1, borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.23)", margin: 0, ...sx }}
    >
        <Box component="legend">
            <Typography variant="caption" sx={{ mx: 0.5, color: "text.secondary" }}>
                {label}
            </Typography>
        </Box>
        {children}
    </Box>
);
