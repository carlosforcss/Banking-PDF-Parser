

export enum MovementType {
  CREDIT = "CREDIT",
  DEBIT = "DEBIT"
}


export interface Validation {
  numberOfDebitsFound: number;
  numberOfCreditsFound: number;
  numberOfExistingCredits: number;
  numberOfExistingDebits: number;
  amountOfCreditFound: number;
  amountOfDebitFound: number;
  amountOfExistingCredit: number;
  amountOfExistingDebit: number;
  valid: boolean;
}


export interface AccountState {
  accountNumber: string;
  movements: Array<Movement>;
  validations?: Validation;
}


export interface Movement {
  amount: number;
  date: string;
  time?: string;
  concept: string;
  reference: string;
  movementType: MovementType;
}
