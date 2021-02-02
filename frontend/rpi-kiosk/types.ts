export type DialogProps = {
    show: boolean,
    close: () => void,
    onDone?: () => void,
};

export class LocalStorageSchema {
    selectedDashboard: number = 0;
    weatherCity: string = null;
    volume: number = 100;
}
