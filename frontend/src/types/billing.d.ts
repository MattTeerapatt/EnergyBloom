export type Billing = {
    id: string;
    user_id: string;
    month: number;
    year: number;
    usage: number;
    price: number;
    tax: number;
    total: number;
    created_at: string;
}

export interface AddBillingParams {
    user_id: string;
    month: number;
    year: number;
}

export interface GetBillingParams {
    user_id: string;
}