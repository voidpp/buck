import * as React from "react";
import { createContext, useContext } from "react";
import { ConfigQuery, useConfigQuery } from "../graphql-types-and-hooks";

export const ConfigContext = createContext(undefined);

export const useConfig = (): ConfigQuery["config"] => useContext(ConfigContext);

export const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
    const { data } = useConfigQuery();

    if (!data) return null;

    return <ConfigContext.Provider value={data.config}>{children}</ConfigContext.Provider>;
};
