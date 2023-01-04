import { OperationType } from "../../enums/OperationType";

export type ICreateStatementDTO ={
  
  user_id: string;
  sender_id?: string | null;
  receiver_id?: string | null;
  description: string;
  amount: number;
  type: OperationType;

}
