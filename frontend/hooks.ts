import {useEffect, useRef, useState} from "react";


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
