export interface BBVAParsingResult {
  accountNumber: string;
  finalBalance: number;
  startBalance: number;
  averageBalance: number;
  thirdPartyMovements: any;
  receiveMovements: any;
  standardMovements: any;
  sentMovements: any;
  creditCardPayments: any;
  bankPayments: any;
}

export interface Movement {
  amount: number;
  concept: string;
  reference: string;
  date: Date;
  time: string;
  receiverIdentifier?: string;
  issuerIdentifier?: string;
}

export interface ThirdPartyPaymentMovement {
  amount: number;
  date: Date;
  reference: string;
  bankSourceIdentifier: string;
}
