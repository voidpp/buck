import BackspaceIcon from '@mui/icons-material/Backspace';
import KeyboardCapslockIcon from '@mui/icons-material/KeyboardCapslock';
import SpaceBarIcon from '@mui/icons-material/SpaceBar';
import { Button, ButtonProps, SxProps, Theme, useTheme } from "@mui/material";
import * as React from "react";
import { SpecialKeys } from "./layouts";
import { Context } from "./types";


export type KeyProps = {
    keyString: string,
    context: Context,
    onClick: (key: string) => void,
};

const styles = {
    root: {
        flexGrow: 1,
        margin: '2px',
        fontSize: "1.2em",
        fontWeight: "bold",
    },
} satisfies Record<string, SxProps<Theme>>;;

type Formatter = (k: string, c: Context, t: Theme) => {
    text: React.ReactNode,
    style?: React.CSSProperties,
    buttonProps?: ButtonProps;
};

const formatters: { [s: string]: Formatter } = {
    generic: k => ({text: k}),
    [SpecialKeys.Placeholder]: k => ({text: ''}),
    [SpecialKeys.Backspace]: k => ({text: <BackspaceIcon/>}),
    [SpecialKeys.Space]: k => ({
        text: <SpaceBarIcon/>,
        style: {
            flexGrow: 1,
        },
    }),
    [SpecialKeys.CapsLock]: k => ({text: <KeyboardCapslockIcon/>}),
};

export default ({keyString, onClick, context}: KeyProps) => {
    const theme = useTheme();
    const formatter = formatters[keyString] ?? formatters.generic;
    const {text, style, buttonProps} = formatter(keyString, context, theme);
    return (
        <Button
            size="small"
            sx={styles.root}
            onClick={() => onClick(keyString)}
            style={{
                textTransform: context.capsLock ? 'uppercase' : 'none',
                minWidth: "auto",
                ...style,
            }}
            variant="contained"
            {...buttonProps}
        >
            {text}
        </Button>
    );
}
