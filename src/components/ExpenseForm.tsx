import { categories } from "../data/categories";
import type { DraftExpense, Value } from "../types";
import DatePicker from 'react-date-picker';
import 'react-calendar/dist/Calendar.css'
import 'react-date-picker/dist/DatePicker.css'
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import ErrorMessage from "./ErrorMessage";
import { useBudget } from "../hooks/useBudget";




export default function ExpenseForm() {
    const [expense,setExpense] = useState<DraftExpense>({
        amount:0,
        expenseName: '',
        category: '',
        date: new Date()
    })
    const [error, setError] = useState('')
    const [previosAmount, setPreviosAmount] = useState(0)
    const {dispatch , state, remainingBudget}= useBudget()

    useEffect(() => {
        if(state.editingId){
            const editingExpense = state.expenses.filter( currentExpense => currentExpense.id === state.editingId)[0]
            setExpense(editingExpense)
            setPreviosAmount(editingExpense.amount)
        }
    },[state.editingId])

    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) =>{
        const {name, value} = e.target
        const isAmountField = ['amount'].includes(name) //Retorna true o false si el evento se llama de amount
        setExpense({
            ...expense,
            [name] : isAmountField ? +value : value //El signo de mas es para convertirlo a numero
        })
    }

    const handleChangeDate = (value : Value  )=> {
        setExpense({
            ...expense,
            date: value
        })
    }

    const handleSubmit = (e : FormEvent<HTMLFormElement>) =>{
        e.preventDefault()

        //validar
        if(Object.values(expense).includes('')){
            setError('todos los campos son obligatorios')
            return
        }

        //validar
        if((expense.amount - previosAmount) > remainingBudget){
            setError('Este gasto se sale del presupuesto')
            return
        }

        if(state.editingId){
            dispatch({type: 'update-expense', payload: {expense: {id: state.editingId, ...expense}}})
        }else{
            dispatch({type: 'add-expense', payload: {expense: expense}})
        }


        setExpense(
            {
                amount:0,
                expenseName: '',
                category: '',
                date: new Date()
            }
        )
        setPreviosAmount(0)
        
    }


  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
        <legend className="uppercase text-center text-2xl font-black border-b-4 border-blue-500 py-2">
            {state.editingId ? 'Guardando Cambior' : "Nuevo Gasto"}
        </legend>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <div className="flex flex-col gap-2">
            <label htmlFor="expenseName"
            className="text-xl">
                Nombre Gasto:
            </label>
            <input type="text" id="expenseName" placeholder="Añadir el Nombre del gasto "
            className="bg-slate-100 p-2"
            name="expenseName" 
            value={expense.expenseName}
            onChange={handleChange}
            />
        </div>

        <div className="flex flex-col gap-2">
            <label htmlFor="amount"
            className="text-xl">
                Cantidad:
            </label>
            <input type="number" id="amount" placeholder="Añadir la cantidad ej:200 "
            className="bg-slate-100 p-2"
            name="amount"
            value={expense.amount}
            onChange={handleChange}
            />
        </div>

        <div className="flex flex-col gap-2">
            <label htmlFor="category"
            className="text-xl">
                Categoria:
            </label>
            <select  
                id="category"
                className="bg-slate-100 p-2"
                name="category" 
                value={expense.category}
                onChange={handleChange}
                >
                    <option value="">-- Seleccione --</option>
                    {categories.map(category => (
                        <option
                            key={category.id}
                            value={category.id}
                        >
                            {category.name}
                        </option>
                    ))}
            </select>
        </div>

        <div className="flex flex-col gap-2">
            <label htmlFor="amount"
            className="text-xl">
                Fecha Gasto:
            </label>
            <DatePicker
                className="bg-slate-100 p-2 border-0"
                value={expense.date}
                onChange={handleChangeDate}
            />
        </div>

        <input type="submit" 
        className="  bg-blue-600 cursor-pointer w-full p-2 text-white uppercase font-bold rounded-lg"
        value={state.editingId ? "Guardar Cambios" : 'Registrar Gasto'}
        />
    </form>
  )
}
