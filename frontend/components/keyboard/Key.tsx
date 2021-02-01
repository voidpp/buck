import * as React from "react";
import {createStyles, makeStyles, Theme, useTheme} from "@material-ui/core/styles";
import {CreateCSSProperties} from "@material-ui/core/styles/withStyles";
import {SpecialKeys} from "./layouts";
import BackspaceIcon from '@material-ui/icons/Backspace';
import SpaceBarIcon from '@material-ui/icons/SpaceBar';
import KeyboardCapslockIcon from '@material-ui/icons/KeyboardCapslock';
import {Button, ButtonProps} from "@material-ui/core";
import {Context} from "./types";


export type KeyProps = {
    keyString: string,
    context: Context,
    onClick: (key: string) => void,
};

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        flexGrow: 1,
        margin: 2,
        fontSize: "1.2em",
        fontWeight: "bold",
    } as CreateCSSProperties,
}));

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
    const classes = useStyles();
    const theme = useTheme();
    const formatter = formatters[keyString] ?? formatters.generic;
    const {text, style, buttonProps} = formatter(keyString, context, theme);
    return (
        <Button
            size="small"
            className={classes.root}
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
