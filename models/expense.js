import { Schema, model } from "mongoose";

const expenseSchema = new Schema(
    {
        items : { type : String , required : true },
        expense : { type :Number, required : true },
      
    },
    
    { timestamps : true }
);

const Expense = model('Expense', expenseSchema);
export default Expense;