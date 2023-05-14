import { Box, SxProps } from "@mui/material";
import * as React from "react";
import { useState } from "react";
import Key from "./Key";
import { Layout, SpecialKeys } from "./layouts";
import { Context } from "./types";

export type KeyboardProps = {
    value: string,
    onChange: (value: string) => void,
    layout: Layout,
};

const styles = {
    row: {
        display: "flex",
        flexGrow: 1,
    },
    container: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
    },
} satisfies Record<string, SxProps>;

const defaultContext: Context = {
    capsLock: false,
};

export default (props: KeyboardProps) => {
    const {value, onChange, layout} = props;
    const [context, setContext] = useState<Context>(defaultContext);

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
        <Box sx={styles.container}>
            {layout.map((row, idx) => (
                <Box key={idx} sx={styles.row}>
                    {row.map(k => <Key context={context} keyString={k} key={k} onClick={clickKey}/>)}
                </Box>
            ))}
        </Box>
    );
}
