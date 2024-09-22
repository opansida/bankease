import { integer, numeric, pgTable, serial, varchar } from "drizzle-orm/pg-core"; 


// Budget Table Definition
export const Budget = pgTable('budget', {
    id: serial('id').primaryKey(),
    name: varchar('name').notNull(),
    amount: varchar('amount').notNull(),  
    icon: varchar('icon'),
    createdBy: varchar('createdBy').notNull(),
});

// Expense Table Definition
export const Expense = pgTable('expense', {
    id: serial('id').primaryKey(),
    name: varchar('name').notNull(),
    amount: numeric('amount').notNull().default(0),  
    budgetId: integer('budgetId').references(() => Budget.id),  
    createdAt: varchar('createdAt').notNull(),
});

