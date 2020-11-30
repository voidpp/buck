import {TranslationKey} from "../../translations";

export enum SpecialKeys {
    Backspace = 'Backspace',
    Enter = 'Enter',
    CapsLock = 'CapsLock',
    Space = 'Space',
    Placeholder = 'Placeholder',
}

export type Layout = string[][];

export const layouts: { [K in TranslationKey]?: Layout } = {
    latin: [
        ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', SpecialKeys.Backspace],
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        [SpecialKeys.CapsLock, 'z', 'x', 'c', 'v', 'b', 'n', 'm', '.', '-', '_'],
        [SpecialKeys.Space]
    ],
    hungarian: [
        ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', SpecialKeys.Backspace],
        ['q', 'w', 'e', 'r', 't', 'z', 'u', 'i', 'o', 'p', 'ő', 'ú'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'é', 'á', 'ű'],
        [SpecialKeys.CapsLock, 'í', 'y', 'x', 'c', 'v', 'b', 'n', 'm', '.', '-', '_'],
        [SpecialKeys.Space]
    ],
    numeric: [
        ['7', '8', '9'],
        ['4', '5', '6'],
        ['1', '2', '3'],
        [SpecialKeys.Placeholder, '0', SpecialKeys.Backspace]
    ]
}

export type LayoutName = keyof typeof layouts;
