import { LocalStorageSchema } from "./types";

export function objectKeys<T>(obj: T): (keyof T)[] {
    return Object.keys(obj) as (keyof T)[];
}

export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

const localStorageHandler = {
    get: (target: LocalStorageSchema, name: string) => {
        const res = window.localStorage.getItem(name);
        return res === null ? target[name] : JSON.parse(res);
    },
    set: (target: LocalStorageSchema, name: string, value: any, receiver: any) => {
        window.localStorage.setItem(name, JSON.stringify(value));
        return true;
    },
};

export const buckLocalStorage = new Proxy<LocalStorageSchema>(new LocalStorageSchema(), localStorageHandler);

const initialWindowWidth = window.innerWidth;

export const setBodyAspectRatioOffset = (offset: number) => {
    const pixels = (1 - offset) * initialWindowWidth;
 
    window.document.body.style.transform = `scaleX(${offset})`;
    window.document.body.style.width = `${initialWindowWidth + pixels}px`;
    window.document.body.style.marginLeft = `${pixels / -2}px`;
};
