
export interface Territory {
    territoryId: string;
    territoryName?: string;
    parentId: string;
    parentName?: string;
    orderId?: number;
    regions?: Territory[];
}

export interface CheckboxItem {
    id?: string;
    position: number;
    text: string;
    data?: any;
}