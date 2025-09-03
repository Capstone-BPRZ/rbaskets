export interface User {
  id: number,
}

export interface Basket {
  id: number,
  user_id: number,
  basket_path: string,
}

export interface Request {
  id: number,
  basket_id: number,
  received: Date,
  method: string,
  headers: string,
  body_id: string,
}