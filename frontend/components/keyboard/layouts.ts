export interface Layout {
    name: string,
    keys: string[][],
}

export enum SpecialKeys {
    Backspace = 'Backspace',
    Enter = 'Enter',
    CapsLock = 'CapsLock',
    Space = 'Space',
    Placeholder = 'Placeholder',
}

export const latinLayout: Layout = {
    name: "Latin",
    keys: [
        ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', SpecialKeys.Backspace],
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        [SpecialKeys.CapsLock, 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
        [SpecialKeys.Space]
    ],
};

export const numericLayout: Layout = {
    name: "Numeric",
    keys: [
        ['7', '8', '9'],
        ['4', '5', '6'],
        ['1', '2', '3'],
        [SpecialKeys.Placeholder, '0', SpecialKeys.Backspace]
    ],
};
