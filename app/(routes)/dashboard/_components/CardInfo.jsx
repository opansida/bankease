import React, { useState, useEffect } from 'react'; // 导入 useState 和 useEffect
import { Coins, ReceiptText, Wallet } from 'lucide-react';

function CardInfo({ budgetList }) {
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpend, setTotalSpend] = useState(0);

  useEffect(() => {
    budgetList && CalulateCardInfo();
  }, [budgetList]);

  const CalulateCardInfo = () => {
    console.log(budgetList);
    let totalBudget_ = 0;
    let totalSpend_ = 0;
    budgetList.forEach((element) => {
      totalBudget_ += Number(element.amount); 
      totalSpend_ += element.totalSpend || 0; 
    });
    setTotalBudget(totalBudget_);
    setTotalSpend(totalSpend_);

    console.log(totalBudget_, totalSpend_);
  };

  return (
    <div className='mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
      <div className='p-7 border rounded-lg flex items-center justify-between'>
        <div>
          <h2 className='text-sm'>Total Budget</h2>
          <h2 className='font-bold text-2xl'>€ {totalBudget}</h2>
        </div>
        <Coins className='bg-primary p-3 h-12 w-12 rounded-full text-white' />
      </div>
      <div className='p-7 border rounded-lg flex items-center justify-between'>
        <div>
          <h2 className='text-sm'>Total Spend</h2>
          <h2 className='font-bold text-2xl'>€ {totalSpend}</h2>
        </div>
        <ReceiptText className='bg-primary p-3 h-12 w-12 rounded-full text-white' />
      </div>
      <div className='p-7 border rounded-lg flex items-center justify-between'>
        <div>
          <h2 className='text-sm'>No. of Budget</h2>
          <h2 className='font-bold text-2xl'>{budgetList?.length}</h2> 
        </div>
        <Wallet className='bg-primary p-3 h-12 w-12 rounded-full text-white' />
      </div>
    </div>
  );
}

export default CardInfo;

