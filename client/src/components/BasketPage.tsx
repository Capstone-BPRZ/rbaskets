import type {Request} from "../types";
interface BasketPageProps {
  requests: Request[],
}

const BasketPage = ({ requests }: BasketPageProps) => {
  const temp = requests[0].headers
  return(
    <><p>this is a placeholder--delete me!</p><p>{temp}</p></>
  )
}

export default BasketPage;