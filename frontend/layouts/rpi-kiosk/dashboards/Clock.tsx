import { ClockWidget } from "@/components/Clock";
import { Box, SxProps } from "@mui/material";
import * as React from "react";
import { useEffect, useRef, useState } from "react";

const styles = {
    root: {
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
        paddingTop: ".15em",
    },
} satisfies Record<string, SxProps>;

export const ClockPanel = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [fontSize, setFontSize] = useState(10);

    useEffect(() => {
        setFontSize(containerRef.current.offsetHeight * 0.48);
    }, []);

    return (
        <Box sx={styles.root} ref={containerRef} style={{ fontSize }}>
            <ClockWidget />
        </Box>
    );
};
