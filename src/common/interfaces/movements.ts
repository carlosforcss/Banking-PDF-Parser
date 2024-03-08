

export enum MovementType {
  CREDIT = "Credit",
  DEBIT = "Debit"
}


export interface AccountState {
  accountNumber: string;
  movements: Array<Movement>;
}


export interface Movement {
  amount: number;
  date: string;
  time?: string;
  concept: string;
  reference: string;
  movementType: MovementType;
}
