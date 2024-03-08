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
