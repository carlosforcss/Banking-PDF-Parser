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
  coverage: any;
}


export enum bbvaMonthsFormat {
  ENE = "01",
  FEB = "02",
  MAR = "03",
  ABR = "04",
  MAY = "05",
  JUN = "06",
  JUL = "07",
  AGO = "08",
  SEP = "09",
  OCT = "10",
  NOV = "11",
  DIC = "12"
}
