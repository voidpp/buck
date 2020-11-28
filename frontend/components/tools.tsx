import * as React from "react";


export const If = ({condition, children}: {condition: boolean, children: React.ReactNode}) => (
    condition ? <React.Fragment>{children}</React.Fragment> : null
);

