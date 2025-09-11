import { Category, DraftExpense, Expense } from "../types";
import { v4 as uuidv4 } from "uuid";

export type BudgetActions =
  | { type: "add-budget"; payload: { budget: number } }
  | { type: "show-modal" }
  | { type: "close-modal" }
  | { type: "add-expense"; payload: { expense: DraftExpense } }
  | { type: "remove-expense"; payload: { id: Expense["id"] } }
  | { type: "get-expense-by-id"; payload: { id: Expense["id"] } }
  | { type: "update-expense"; payload: { expense: Expense } }
  | { type: "reset-app" }
  | { type: "add-filter-category"; payload: { id: Category["id"] } };

export interface IBudgetState {
  budget: number;
  modal: boolean;
  expenses: Expense[];
  editingId: Expense["id"]; 
  currentCategory: Category["id"];
}

const initialBubget = (): number => {
  const localStorageBudget = localStorage.getItem("budget");
  return localStorageBudget ? +localStorageBudget : 0;
};

const initialExpenses = (): Expense[] => {
  const localStorageExpenses = localStorage.getItem("expenses");
  return localStorageExpenses ? JSON.parse(localStorageExpenses) : [];
};

export const initialState: IBudgetState = {
  budget: initialBubget(),
  modal: false,
  expenses: initialExpenses(),
  editingId: "",
  currentCategory: "",
};

const createExpense = (draftExpense: DraftExpense): Expense => {
  return {  
    ...draftExpense,
    id: uuidv4(),
  };
};

export const budgetReducer = (
  state: IBudgetState = initialState,
  actions: BudgetActions
) => {
  switch (actions.type) {
    case "add-budget":
      return {
        ...state,
        budget: actions.payload.budget,
      };
    case "show-modal":
      return {
        ...state,
        modal: true,
      };
    case "close-modal":
      return {
        ...state,
        modal: false,
        editingId: "",
      };
    case "add-expense":
      const expense = createExpense(actions.payload.expense);

      return {
        ...state,
        expenses: [...state.expenses, expense],
        modal: false,
      };
    case "remove-expense":
      return {
        ...state,
        expenses: state.expenses.filter(
          (expense) => expense.id !== actions.payload.id
        ),
      };
    case "get-expense-by-id":
      return {
        ...state,
        editingId: actions.payload.id,
        modal: true,
      };
    case "update-expense":
      return {
        ...state,
        expenses: state.expenses.map((expense) =>
          expense.id === actions.payload.expense.id
            ? actions.payload.expense
            : expense
        ),
        modal: false,
        editingId: "",
      };
    case "reset-app":
      return {
        ...state,
        budget: 0,
        expenses: [],
      };
    case "add-filter-category":
      return {
        ...state,
        currentCategory: actions.payload.id,
      };

    default:
      break;
  }

  return state;
};
