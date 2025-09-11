export type Expense = {
  id: string;
  expenseName: string;
  category: string;
  date: Value;
  amount: number;
};

export type DraftExpense = Omit<Expense, "id">;

export type Value = ValuePiece | [ValuePiece, ValuePiece];
export type ValuePiece = Date | null;

export type Category = {
  id: string;
  name: string;
  icon: string;
};
