import { Group, PredefinedTimer, TimerEvent, usePredefinedTimerListQuery, useTimerEventsSubscription } from "@/graphql-types-and-hooks";
import { useEffect, useRef, useState } from "react";

export function useInterval(callback: any, delay: number, enabled: boolean = true) {
    const savedCallback = useRef<any>();

    useEffect(() => {
        savedCallback.current = callback;
    });

    useEffect(() => {
        function tick() {
            if (enabled)
                savedCallback.current();
        }

        const id = setInterval(tick, delay);
        return () => clearInterval(id);
    }, [delay]);
}

/**
 * returns: [value, setValueToTrue, setValueToFalse, toggleValue]
 */
export function useBoolState(defaultValue: boolean = false): [boolean, () => void, () => void, () => void] {
    const [value, setValue] = useState(defaultValue);

    return [value, () => setValue(true), () => setValue(false), () => setValue(!value)];
}

export type GroupedPredefinedTimer = {
    group: Group | null,
    predefinedTimers: Omit<PredefinedTimer, "__typename" | "group" | "groupId">[],
};

type GroupedPredefinedTimerList = {
    timers: GroupedPredefinedTimer[],
    refetch: () => void,
}

export const useGroupedPredefinedTimerList = (): GroupedPredefinedTimerList => {
    const {data, refetch} = usePredefinedTimerListQuery({fetchPolicy: "cache-and-network"});

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

export const useActiveTimerEvent = (initialEvent?: TimerEvent) => {
    const [activeEvent, setActiveEvent] = useState<TimerEvent>(initialEvent);

    useTimerEventsSubscription({
        onData: data => {
            for (const event of data.data.data.timerEvents) {
                switch (event.type) {
                    case "ALARM":
                        setActiveEvent(event);
                        break;
                    case "CLEAR_ALARM":
                        setActiveEvent(null);
                        break;
                }
                return;
            }
        },
    });    

    return {activeEvent, clearEvent: () => setActiveEvent(null)}
}