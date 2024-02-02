export interface IAction {
    text: string;
    handler: (record: any) => void;
    disabled?: boolean;
    danger?: boolean;
}