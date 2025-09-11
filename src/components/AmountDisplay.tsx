import { formatCurrency } from "../helpers"


type AmountDisplayProps = {
    label?: string, //Con el signo de pregunta le decimos que el valor puede se opcional
    amount : number
}


export default function AmountDisplay({label, amount} : AmountDisplayProps) {
  return (
    <p className=" text-2xl text-blue-600 font-bold">
        {label && `${label}: `}
        <span className=" font-black text-black">{formatCurrency(amount)}</span>
    </p>
  )
}
