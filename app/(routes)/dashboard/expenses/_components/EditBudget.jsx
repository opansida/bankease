"use client";

import { PenBox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React, { use, useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'components/ui/dialog';
import EmojiPicker from 'emoji-picker-react';
import { Input } from "@/components/ui/input";
import { useUser } from '@clerk/nextjs';
import { DialogFooter, DialogClose } from 'components/ui/dialog';
import { toast } from 'sonner';
import { db } from '@utils/dbConfig';
import { Budget } from '@/utils/schema';
import { eq } from 'drizzle-orm';


function EditBudget({ budgetInfo, refreshData }) {  
  const { user } = useUser(); 
  const [emojiIcon, setEmojiIcon] = useState(budgetInfo?.icon );
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

  const [name, setName] = useState();
  const [amount, setAmount] = useState();

  useEffect(() => {
    if (budgetInfo){
      setEmojiIcon(budgetInfo?.icon)
      setAmount(budgetInfo?.amount)
      setName(budgetInfo?.name)
    }
    
  },[budgetInfo])

  const onUpdateBudget = async () => {
    const result = await db.update(Budget).set({
      name: name,
      amount: amount,
      icon: emojiIcon,
    }).where(eq(Budget.id, budgetInfo.id))
    .returning();
    
    if (result) {

      refreshData();
      toast.success('Budget updated successfully');
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div>
            <Button className="flex gap-2">
              <PenBox /> Edit
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent className="bg-white shadow-lg rounded-lg p-5">
          <DialogHeader>
            <DialogTitle>Update New Budget</DialogTitle>
            <DialogDescription>
              <div className="mt-5">
                <Button
                  variant="outline"
                  className="text-lg"
                  onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                >
                  {emojiIcon}
                </Button>
                {openEmojiPicker && (
                  <div className="absolute z-20">
                    <EmojiPicker
                      onEmojiClick={(e) => {
                        setEmojiIcon(e.emoji);
                        setOpenEmojiPicker(false);
                      }}
                    />
                  </div>
                )}
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Budget Name</h2>
                  <Input
                    placeholder="e.g. Home"
                    defaultValue={budgetInfo?.name} 
                    onChange={(e) => setName(e.target.value)} 
                  />
                </div>
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Budget Amount</h2>
                  <Input
                    type="number"
                    placeholder="e.g. € 2000"
                    defaultValue={budgetInfo?.amount} 
                    onChange={(e) => setAmount(e.target.value)} 
                  />
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                disabled={!name || !amount}
                onClick={() => onUpdateBudget()}
                className="mt-5 w-full"
              >
                Update Budget
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EditBudget;











