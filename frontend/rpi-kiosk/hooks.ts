import {PredefinedTimer} from "../api";
import {useQuery} from "@apollo/client";

import {predefinedTimerListQuery} from "./queries";
import {PredefinedTimerList, PredefinedTimerList_predefinedTimers_group} from "./__generated__/PredefinedTimerList";

export type GroupedPredefinedTimer = {
    group: Omit<PredefinedTimerList_predefinedTimers_group, '__typename'> | null,
    predefinedTimers: Omit<PredefinedTimer, "__typename" | "group" | "groupId">[],
};

type GroupedPredefinedTimerList = {
    timers: GroupedPredefinedTimer[],
    refetch: () => void,
}

export const useGroupedPredefinedTimerList = (): GroupedPredefinedTimerList => {
    const {data, refetch} = useQuery<PredefinedTimerList>(predefinedTimerListQuery, {fetchPolicy: "cache-and-network"});

    if (!data)
        return {timers: [], refetch};

    const groups: Record<number, GroupedPredefinedTimer> = {};

    for (const timer of data.predefinedTimers) {
        const grpId: number = timer.group?.id ?? null;
        if (grpId in groups)
            groups[grpId].predefinedTimers.push(timer);
        else
            groups[grpId] = {
                group: timer.group ?? {
                    id: 0,
                    name: "",
                },
                predefinedTimers: [timer],
            }
    }

    return {
        timers: Object.values(groups).sort((a, b) => a.group.name.localeCompare(b.group.name)),
        refetch,
    };
}
