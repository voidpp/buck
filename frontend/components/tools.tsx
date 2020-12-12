import * as React from "react";


type IfCompProps = {
    condition: boolean,
    children: React.ReactNode,
    else_?: React.ReactNode,
}

export const If = ({condition, children, else_ = null}: IfCompProps) => (
    condition ? <React.Fragment>{children}</React.Fragment> : <React.Fragment>{else_}</React.Fragment>
);

