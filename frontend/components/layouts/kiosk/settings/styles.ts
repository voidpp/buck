import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {CreateCSSProperties} from "@material-ui/core/styles/withStyles";

export const useCommonStyles = makeStyles((theme: Theme) => createStyles({
    slider: {
        display: "flex",
        alignItems: "center",
        minWidth: 300,
    } as CreateCSSProperties,
}));
