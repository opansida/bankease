"use client";

import React, { useEffect, useState } from 'react';
import { UserButton, useUser } from '@clerk/nextjs';
import { db } from '@/utils/dbConfig';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { Expense, Budget } from '@/utils/schema';
import CardInfo from './_components/CardInfo';
import BarChartDashboard from './_components/BarChartDashboard';
import BudgetItem from './budgets/_components/BudgetItem';
import { get } from 'http';
import ExpenseListTable from './expenses/_components/ExpenseListTable';


function Dashboard() {
  const { isLoaded, user } = useUser(); 

  const [budgetList, setBudgetList] = useState([]);
  const [expenseList, setExpenseList] = useState([]);

  // get budget list
  const getBudgetList = async () => {
    const result = await db.select({
      ...getTableColumns(Budget),
      totalSpend: sql`sum(${Expense.amount}::numeric)`.mapWith(Number),
      totalItem: sql`count(${Expense.id})`.mapWith(Number),
    })
    .from(Budget)
    .leftJoin(Expense, eq(Budget.id, Expense.budgetId))
    .where(eq(Budget.createdBy, user?.primaryEmailAddress?.emailAddress))
    .groupBy(Budget.id)
    .orderBy(desc(Budget.id));

    setBudgetList(result);
    getAllExpenses();
  };

  // get budget list when user is loaded
  useEffect(() => {
    if (user) {
      getBudgetList();
    }
  }, [user]);

  // check if user is loaded
  if (!isLoaded) {
    return <div>Loading...</div>; 
  }

  // get all expenses
  const getAllExpenses = async () => {
    const result = await db.select({
      id: Expense.id,
      name: Expense.name,
      amount: Expense.amount,
      createdAt: Expense.createdAt,
    }).from(Budget)
    .rightJoin(Expense, eq(Budget.id, Expense.budgetId))
    .where(eq(Budget.createdBy, user?.primaryEmailAddress?.emailAddress))
    .orderBy(desc(Expense.createdAt));
    
    setExpenseList(result);

  }


  return (
    <div className='p-8'>
      <h2 className='font-bold text-3xl'>
        Hi, {user?.fullName || user?.firstName || 'Guest'} ☀️ 
      </h2>
      <p className='text-lg text-gray-600'>Welcome to BankEase.</p>
      <CardInfo budgetList={budgetList} />
      <div className='grid grid-cols-1 md:grid-cols-3 mt-6 gap-5'>
        <div className='col-span-2'>
          <BarChartDashboard 
          budgetList={budgetList}/>

          <ExpenseListTable
          expensesList={expenseList}
          refreshData={()=>getBudgetList()}/>

        </div>
        <div className='grid gap-5'>
          <h2 className='font-bold text-2xl'>Latest Budgets</h2>
          {budgetList.map((budge,index) => (
            <BudgetItem budget={budge} key={index} />
          ))}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;


