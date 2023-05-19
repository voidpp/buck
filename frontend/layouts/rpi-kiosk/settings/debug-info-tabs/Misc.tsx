import { useBoolState } from "@/hooks";
import { buckLocalStorage, setBodyAspectRatioOffset } from "@/tools";
import { FormattedButton } from "@/translations";
import { Box, Dialog, Slider, SxProps, Table, TableBody, Theme } from "@mui/material";
import * as React from "react";
import { FormattedFieldRow } from "./tools";

const styles = {
    circle: {
        margin: "0.5em",
        borderRadius: "50%",
        border: theme => `2px solid ${theme.palette.primary.main}`,
        transition: "all 0.5s",
        width: 10,
        height: 10,
    },
    container: {
        display: "flex",
        alignItems: "center",
        height: "100%",
    },
    circleContainer: {
        height: "100%",
        flexGrow: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
} satisfies Record<string, SxProps<Theme>>;

const AspectRatioSettings = () => {
    const [isShow, show, hide] = useBoolState();
    const [offset, setOffset] = React.useState(buckLocalStorage.aspectRatioOffset);
    const containerRef = React.useRef<HTMLDivElement>();
    const circleRef = React.useRef<HTMLDivElement>();

    return (
        <>
            <FormattedButton msgId="open" onClick={show} size="small" />
            <Dialog
                open={isShow}
                onClose={hide}
                fullScreen
                TransitionProps={{
                    onEntered: () => {
                        const size = containerRef.current.clientHeight - 32;
                        circleRef.current.style.width = `${size}px`;
                        circleRef.current.style.height = `${size}px`;
                    },
                }}
            >
                <Box sx={styles.container} ref={containerRef}>
                    <Box sx={styles.circleContainer}>
                        <Box sx={styles.circle} ref={circleRef} />
                    </Box>
                    <Box sx={{ display: "flex", height: "100%", alignItems: "stretch", p: 4, gap: 2 }}>
                        <Slider
                            min={0.8}
                            max={1.2}
                            value={offset}
                            onChange={(_, value) => {
                                const val = value as number;
                                setBodyAspectRatioOffset(val);
                                setOffset(val);
                            }}
                            orientation="vertical"
                            valueLabelDisplay="auto"
                            step={0.01}
                        />
                        <Box sx={{ height: "100%", display: "flex", flexDirection: "column", gap: 2 }}>
                            <FormattedButton
                                msgId="save"
                                onClick={() => {
                                    buckLocalStorage.aspectRatioOffset = offset;
                                    hide();
                                }}
                                variant="contained"
                                sx={{ mt: "auto" }}
                            />
                            <FormattedButton
                                variant="contained"
                                msgId="reset"
                                onClick={() => {
                                    setBodyAspectRatioOffset(1);
                                    buckLocalStorage.aspectRatioOffset = 1;
                                    setOffset(1);
                                }}
                            />
                            <FormattedButton
                                variant="contained"
                                msgId="cancel"
                                onClick={() => {
                                    setBodyAspectRatioOffset(buckLocalStorage.aspectRatioOffset);
                                    setOffset(buckLocalStorage.aspectRatioOffset);
                                    hide();
                                }}
                            />
                        </Box>
                    </Box>
                </Box>
            </Dialog>
        </>
    );
};

export default () => {
    return (
        <Table size="small">
            <TableBody>
                <FormattedFieldRow labelId="aspectRatio">
                    <AspectRatioSettings />
                </FormattedFieldRow>
            </TableBody>
        </Table>
    );
};
