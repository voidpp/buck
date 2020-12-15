import * as React from "react";
import {TransitionProps} from "@material-ui/core/transitions";
import {Slide} from "@material-ui/core";


type IfCompProps = {
    condition: boolean,
    children: React.ReactNode,
    else_?: React.ReactNode,
}

export const If = ({condition, children, else_ = null}: IfCompProps) => (
    condition ? <React.Fragment>{children}</React.Fragment> : <React.Fragment>{else_}</React.Fragment>
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
