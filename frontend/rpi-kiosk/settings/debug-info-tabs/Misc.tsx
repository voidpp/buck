import * as React from "react";
import {Dialog, Table, TableBody, useTheme} from "@material-ui/core";
import {FormattedFieldRow} from "./tools";
import {useBoolState} from "../../../hooks";
import {FormattedButton} from "../../translations";

const size = 350;

const AspectRatioChecker = () => {
    const [isShow, show, hide] = useBoolState();
    const theme = useTheme();

    return (
        <React.Fragment>
            <FormattedButton msgId="open" onClick={show} size="small"/>
            <Dialog open={isShow} onClose={hide}>
                <div style={{display: "flex", justifyContent: "center"}}>
                    <div style={{
                        margin: "0.5em",
                        width: size,
                        height: size,
                        borderRadius: size,
                        border: `2px solid ${theme.palette.primary.main}`,
                    }}/>
                </div>
            </Dialog>
        </React.Fragment>
    );
};

export default () => {
    return (
        <Table size="small">
            <TableBody>
                <FormattedFieldRow labelId="aspectRatioChecker">
                    <AspectRatioChecker/>
                </FormattedFieldRow>
            </TableBody>
        </Table>
    );
};
