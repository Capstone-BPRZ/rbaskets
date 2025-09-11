interface Request {
    id: number;
    received: Date;
    method: string;
    headers: string;
    basket_id: number;
}

export interface RequestDB extends Request {
    body_id: string
}

export interface RequestData extends Request {
    body: string
}


export interface BasketData {
    id: number;
    basket_path: string;
    user_id: number;
}

export type user_id = number;


export interface RDSCredentials {
    username: string;
    password: string;
}

