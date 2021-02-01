import en from "./en";

export function flatten(data: Record<string, any>, prefix?: string): Record<string, string> {
    const res = {};

    for (const [key, value] of Object.entries(data)) {
        const chainedKey = prefix ? `${prefix}.${key}` : key;
        if (typeof value == "object")
            Object.assign(res, flatten(value, chainedKey))
        else
            res[chainedKey] = value;
    }

    return res;
}

export const messages = {
    en: flatten(en),
}
