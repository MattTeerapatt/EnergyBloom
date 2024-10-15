export type ElectricityUsage = {
    id: string;
    user_id: string;
    month: number;
    year: number;
    usage: number;
    price: number;
    created_at: string;
    updated_at: string;
};

export interface GetTodayUsageParams {
    user_id: string;
}

export interface GetMonthlyUsageParams {
    user_id: string;
}

export interface AddElectricityUsageParams {
    user_id: string;
    usage: number;
    price: number;
}

export interface UpdateElectricityUsageParams {
    user_id: string;
    usage: number;
    price: number;
}

export interface AddorUpdateElectricityUsageParams {
    user_id: string;
    usage: number;
    price: number;
}

