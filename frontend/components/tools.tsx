import * as React from "react";
import {TransitionProps} from "@material-ui/core/transitions";
import {Slide, TableCell, TableCellProps, TableHead, TableRow, Typography} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import {FormattedMessage} from "react-intl";


type IfCompProps = {
    condition: any,
    children: React.ReactNode,
    else_?: React.ReactNode,
}

export const If = ({condition, children, else_ = null}: IfCompProps) => (
    (!!condition) ? <React.Fragment>{children}</React.Fragment> : <React.Fragment>{else_}</React.Fragment>
);

export const SlideUp = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement<any, any> },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const SlideDown = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement<any, any> },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="down" ref={ref} {...props} />;
});

export const BoolIcon = ({value}: { value: boolean }) => (value ? <CheckIcon/> : <CloseIcon/>);


type FormattedTableHeadProps = {
    labels: string[],
    cellProps?: Record<string, TableCellProps>,
    prefix?: string,
    cellRenderer?: { [s: string]: React.Factory<{}> },
};

export const FormattedTableHead = ({labels, cellProps = {}, prefix, cellRenderer = {}}: FormattedTableHeadProps) => (
    <TableHead>
        <TableRow>
            {labels.map((label, idx) => (
                <TableCell key={idx} {...cellProps[label]}>
                    {cellRenderer[label] ? React.createElement(cellRenderer[label]) : (
                        <Typography>
                            {label ? <FormattedMessage id={prefix ? `${prefix}.${label}` : label}/> : null}
                        </Typography>
                    )}
                </TableCell>
            ))}
        </TableRow>
    </TableHead>
);
