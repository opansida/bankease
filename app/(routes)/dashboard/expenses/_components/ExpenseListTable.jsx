import React from 'react';
import { Trash } from 'lucide-react';
import { db } from '@/utils/dbConfig';
import { Expense } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { toast } from 'sonner';

function ExpenseListTable({ expensesList, refreshData }) {

  const deleteExpense = async (expense) => {
    const result = await db.delete(Expense)
    .where(eq(Expense.id, expense.id))
    .returning();

    if(result)
    {
      toast('Expense deleted successfully!')
      refreshData()
    }
  }
  return (
    <div className='mt-3'>
      {/* Header */}
      <h2 className='font-bold text-lg'>Latest Expenses</h2>
      <div className='grid grid-cols-4 bg-slate-300 p-2 font-bold mt-3'>
        <h2>Name</h2>
        <h2>Amount</h2>
        <h2>Date</h2>
        <h2>Action</h2>
      </div>
      {/* Expense Rows */}
      {expensesList.map((expense, index) => (
        <div key={index} className='grid grid-cols-4 bg-slate-100 p-2 items-center'>
          <h2>{expense.name}</h2>
          <h2>{expense.amount}</h2>
          <h2>{expense.createdAt}</h2>
          <div>
            <Trash className='text-orange-600 cursor-pointer'
            onClick={()=>deleteExpense(expense)} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default ExpenseListTable;

