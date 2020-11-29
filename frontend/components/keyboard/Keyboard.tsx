import * as React from "react";
import {useState} from "react";
import {latinLayout, Layout, SpecialKeys} from "./layouts";
import Key from "./Key";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {CreateCSSProperties} from "@material-ui/core/styles/withStyles";
import {Context} from "./types";

export type KeyboardProps = {
    value: string,
    onChange: (value: string) => void,
    layout?: Layout,
};

const useStyles = makeStyles((theme: Theme) => createStyles({
    row: {
        display: "flex",
        flexGrow: 1,
    } as CreateCSSProperties,
    container: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
    } as CreateCSSProperties,
}));

const defaultContext: Context = {
    capsLock: false,
};

export default (props: KeyboardProps) => {
    const {value, layout = latinLayout, onChange} = props;
    const [context, setContext] = useState<Context>(defaultContext);
    const classes = useStyles();

    const clickKey = (key: string) => {
        let val = value;
        switch (key) {
            case SpecialKeys.Backspace:
                val = val.slice(0, -1);
                break
            case SpecialKeys.Space:
                val += ' ';
                break
            case SpecialKeys.CapsLock:
                setContext({...context, capsLock: !context.capsLock});
                return;
            default:
                val += context.capsLock ? key.toUpperCase() : key;
        }

        onChange(val);
    }

    return (
        <div className={classes.container}>
            {layout.keys.map((row, idx) => (
                <div key={`${layout.name}-row-${idx}`} className={classes.row}>
                    {row.map(k => <Key context={context} keyString={k} key={k} onClick={clickKey}/>)}
                </div>
            ))}
        </div>
    );
}
