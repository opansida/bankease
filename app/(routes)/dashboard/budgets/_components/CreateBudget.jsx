"use client";
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'components/ui/dialog';
import EmojiPicker from 'emoji-picker-react';
import { Button } from 'components/ui/button';
import { Input } from "@/components/ui/input";
import { db } from '@/utils/dbConfig';
import { Budget } from '@utils/schema'; 
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs'; 
import { DialogFooter, DialogClose } from 'components/ui/dialog';

function CreateBudget({ refreshData }) {
  const { user } = useUser(); 
  const [emojiIcon, setEmojiIcon] = useState('💰');
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const onCreateBudget = async () => {
    try {
      const result = await db.insert(Budget)
        .values({
          name: name,
          amount: amount,
          createdBy: user?.primaryEmailAddress?.emailAddress, 
          icon: emojiIcon,
        })
        .returning({ insertedId: Budget.id });

      if (result) {
        refreshData();
        toast.success('Budget Created Successfully');
      }
    } catch (error) {
      console.error('Error creating budget:', error);
      toast.error('Failed to create budget');
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <div>
          <div className="bg-slate-100 p-10 rounded-md items-center flex flex-col border-2 border-dashed cursor-pointer hover:shadow-md">
            <h2 className="text-3xl">+</h2>
            <h2>Create New Budget</h2>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="bg-white shadow-lg rounded-lg p-5">
        <DialogHeader>
          <DialogTitle>Create New Budget</DialogTitle>
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
                  placeholder="e.g. Car"
                  value={name}
                  onChange={(e) => setName(e.target.value)} 
                />
              </div>
              <div className="mt-2">
                <h2 className="text-black font-medium my-1">Budget Amount</h2>
                <Input 
                  type="number"
                  placeholder="e.g. € 1000"
                  value={amount}
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
              onClick={() => onCreateBudget()}
              className="mt-5 w-full"
            >
              Add Budget
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateBudget;



