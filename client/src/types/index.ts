<<<<<<< HEAD
export interface Basket {
  id: number
=======
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
>>>>>>> b774eb38e314ec818dd8b04be5e11e597841b630
}