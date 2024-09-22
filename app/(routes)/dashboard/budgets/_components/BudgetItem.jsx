import React from 'react'
import Link from 'next/link'

function BudgetItem({ budget }) {

  const calculateProgressPerc = () => {
    //(spend/total)*100
    const perc=(budget.totalSpend/budget.amount)*100;
    return perc.toFixed(2);
  }

  return (
    <Link href={'/dashboard/expenses/'+budget?.id} >
      <div className='p-5 border rounded-lg hover:shadow-md cursor-pointer h-[170px]'>
        <div className='flex gap-3 items-center justify-between'>
          <div className='flex gap-3 items-center'>
            <h2 className='text-2xl p-5 px-6 bg-slate-100 rounded-full'>{budget?.icon}</h2>
            <div>
              <h2 className='font-bold'>{budget?.name}</h2>
              <h2 className='text-sm text-gray-400'>{budget?.totalItem} Item{budget?.totalItem > 1 ? 's' : ''}</h2>
            </div>
          </div>
          <h2 className='font-bold text-primary text-left'>€ {budget?.amount}</h2>
        </div>
        <div className='mt-5'>
          <div className='flex items-center justify-between mb-3'>
            <h2 className='text-xs text-slate-500'>€ {budget.totalSpend?budget.totalSpend:0} Spend</h2>
            <h2 className='text-xs text-slate-500'>€ {budget.amount-budget.totalSpend} Remailing</h2>
          </div>
          <div className='w-full bg-slate-400 h-2 rounded-full'>
            <div className=' bg-primary h-2 rounded-full'
            style={{
              width: `${calculateProgressPerc()}%`
            }}>

            </div>

          </div>
        </div>
      </div>
    </Link>
  )
}

export default BudgetItem;

