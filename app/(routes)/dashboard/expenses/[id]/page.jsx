"use client";

import { Budget, Expense } from '@/utils/schema'; 
import { db } from '@utils/dbConfig';
import { useUser } from '@clerk/nextjs'; 
import { sql, eq, getTableColumns, desc } from 'drizzle-orm'; 
import React, { useEffect, useState } from 'react';
import BudgetItem from '../../budgets/_components/BudgetItem';
import AddExpense from '../../expenses/_components/AddExpense';
import ExpenseListTable from '../../expenses/_components/ExpenseListTable';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation'; 
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner'; 
import EditBudget from '../../expenses/_components/EditBudget';


function ExpensesScreen({ params }) { 
  const { user } = useUser(); 
  const [budgetInfo, setBudgetInfo] = useState(null); 
  const [expensesList, setExpensesList] = useState([]);
  const router = useRouter();  

  // useEffect hook to get budget info
  useEffect(() => {
    if (user) {
      getBudgetInfo();
    }
  }, [user]);

  // Function to get budget info
  const getBudgetInfo = async () => {
    try {
      const result = await db
        .select({
          ...getTableColumns(Budget),
          totalSpend: sql`sum(${Expense.amount}::numeric)`.mapWith(Number),
          totalItem: sql`count(${Expense.id})`.mapWith(Number),
        })
        .from(Budget)
        .leftJoin(Expense, eq(Budget.id, Expense.budgetId))
        .where(eq(Budget.createdBy, user?.primaryEmailAddress?.emailAddress)) 
        .where(eq(Budget.id, params.id)) 
        .groupBy(Budget.id);

      setBudgetInfo(result[0]); // end result to budgetInfo
      getExpensesList();
    } catch (error) {
      console.error('Error fetching budget info:', error);
    }
  };

  // Function to get latest expenses list
  const getExpensesList = async () => {
    try {
      const result = await db
        .select()
        .from(Expense)
        .where(eq(Expense.budgetId, params.id))
        .orderBy(desc(Expense.id));

      setExpensesList(result); 
    } catch (error) {
      console.error('Error fetching expenses list:', error);
    }
  };

  // Delete budget
  const deleteBudget = async () => {
    try {
      // delete all expenses related to the budget
      await db.delete(Expense).where(eq(Expense.budgetId, params.id));

      // delete the budget
      const result = await db.delete(Budget).where(eq(Budget.id, params.id));

      if (result) {
        toast.success("Budget Deleted!"); 
        router.replace('/dashboard/budgets');  
      }
    } catch (error) {
      console.error('Error deleting budget:', error);
      toast.error("Failed to delete budget!"); 
    }
  };

  return (
    <div className='p-10'>
      <h2 className='text-2xl font-bold text-primary flex justify-between items-center'>
        <span className='flex gap-2 items-center'>
          <ArrowLeft  onClick={()=>router.back()} className='cursor-pointer'/>
        My Expenses
        </span>
        <div className='flex gap-2 items-center'>
          <EditBudget budgetInfo={budgetInfo} 
           refreshData={()=>getBudgetInfo()}/>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className="flex gap-2">
              <Button variant="destructive">
                <Trash /> Delete
              </Button>
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your budget.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteBudget()}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        </div>
        
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-2 mt-8 gap-6'>
        {budgetInfo ? (
          <BudgetItem budget={budgetInfo} 
          refreshData={()=> getBudgetInfo()}/>
        ) : (
          <div className='h-[150px] w-full bg-slate-200 rounded-lg animate-pulse'></div>
        )}

        <AddExpense 
          budgetId={params.id}
          user={user}
          refreshData={() => getBudgetInfo()}
        />
      </div>

      <div className='mt-4'>
        <h2 className='font-bold text-lg'>Latest Expenses</h2>
        <ExpenseListTable 
          expensesList={expensesList}
          refreshData={() => getBudgetInfo()}
        />
      </div>
    </div>
  );
}

export default ExpensesScreen;

