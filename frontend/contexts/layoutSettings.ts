import { createContext, useContext } from "react";

export type LayoutConfig = {
    virtualKeyboard: boolean;
}

export const LayoutConfigContext = createContext<LayoutConfig>({virtualKeyboard: false});

export const useLayoutConfig = () => useContext(LayoutConfigContext)
