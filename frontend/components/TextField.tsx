import { TextField as MUITextField, TextFieldProps } from "@mui/material";
import * as React from "react";
import { useLayoutConfig } from "../contexts/layoutSettings";
import { TextFieldDialog } from "./virtual-keyboard/TextFieldDialog";

type Props = TextFieldProps;

export const TextField = (props: Props) => {
    const { virtualKeyboard } = useLayoutConfig();

    if (virtualKeyboard) return <TextFieldDialog {...props} />;

    return <MUITextField {...props} />;
};
