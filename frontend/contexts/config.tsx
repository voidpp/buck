import {gql, useQuery} from "@apollo/client";
import * as React from "react";
import {createContext, useContext} from "react";
import {ConfigQuery, ConfigQuery_config} from "./__generated__/ConfigQuery";

export const ConfigContext = createContext(undefined);

export const useConfig = (): ConfigQuery_config => useContext(ConfigContext);

const configQuery = gql`
    query ConfigQuery {
        config {
            sounds {
                filename
                title
            }
        }
    }
`;

export const ConfigProvider = ({children}: {children: React.ReactNode}) => {
    const {data} = useQuery<ConfigQuery>(configQuery);

    if (!data)
        return null;

    return (
        <ConfigContext.Provider value={data.config}>
            {children}
        </ConfigContext.Provider>
    );
};
