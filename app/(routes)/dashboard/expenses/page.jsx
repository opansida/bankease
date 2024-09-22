"use client"
import { db } from '@/utils/dbConfig';
import { Budget, Expense } from '@/utils/schema';  // 确保导入正确的模型
import { desc, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import ExpenseListTable from './_components/ExpenseListTable';
import { useUser } from '@clerk/nextjs';

function ExpensesScreen() {
  const [expensesList, setExpensesList] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    user && getAllExpenses();
  }, [user]);

  /**
   * 获取用户的所有支出
   */
  const getAllExpenses = async () => {
    const result = await db.select({
      id: Expense.id,    // 确保这里使用了正确的模型
      name: Expense.name,
      amount: Expense.amount,
      createdAt: Expense.createdAt
    })
    .from(Budget)
    .rightJoin(Expense, eq(Budget.id, Expense.budgetId))  // 统一模型名称
    .where(eq(Budget.createdBy, user?.primaryEmailAddress?.emailAddress)) // 使用 Clerk user email
    .orderBy(desc(Expense.id));

    setExpensesList(result);
  };

  return (
    <div className='p-10'>
      <h2 className='font-bold text-3xl'>My Expenses</h2>

      <ExpenseListTable 
        refreshData={() => getAllExpenses()}  // 刷新数据
        expensesList={expensesList}
      />
    </div>
  );
}

export default ExpensesScreen;
