import axios from 'axios';
import { logger } from '../../../common/utils/logger';
import { AccountState, Movement, MovementType } from '../../../common/interfaces/movements';
import { BBVAPdfParser } from "../helpers/bbvaPdfParser.helper";
import { bbvaMonthsFormat } from "../interfaces/bbva.interface"


export class BBVAController{
  constructor() {}

  async readFileBufferFromUrl(fileUrl: string): Promise<Buffer> {
    logger.info(`BBVAController.readFileBufferFromUrl -> ${fileUrl}`)
    try {
      const response = await axios.get(fileUrl, {
        responseType: 'arraybuffer'
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error reading file from URL: ${error.message}`);
    }
  }

  _normalizeDate (bbvaFormatDate: string, year: number): string {
    const [day, month] = bbvaFormatDate.split("/")
    const isoFormatMonth = bbvaMonthsFormat[month]
    return `${day}/${isoFormatMonth}/${year}`
  }

  async normalizeMovements(bbvaParsedResult: any): Promise<AccountState> {
    const movements: Array<Movement> = new Array<Movement>();
    console.log(bbvaParsedResult.coverage.startDate)
    bbvaParsedResult.standardMovements.movements.forEach(movement => {
      movements.push({
        date: this._normalizeDate(movement.date, bbvaParsedResult.coverage.startDate.getFullYear()),
        amount: movement.amount,
        time: movement.time,
        concept: movement.concept,
        reference: movement.reference,
        movementType: MovementType.DEBIT
      })
    })
    bbvaParsedResult.sentMovements.movements.forEach(movement => {
      movements.push({
        date: this._normalizeDate(movement.date, bbvaParsedResult.coverage.startDate.getFullYear()),
        amount: movement.amount,
        reference: movement.reference,
        concept: movement.concept,
        movementType: MovementType.DEBIT
      })
    })
    bbvaParsedResult.receiveMovements.movements.forEach(movement => {
      movements.push({
        date: this._normalizeDate(movement.date, bbvaParsedResult.coverage.startDate.getFullYear()),
        amount: movement.amount,
        reference: movement.reference,
        concept: movement.concept,
        movementType: MovementType.CREDIT
      })
    })
    bbvaParsedResult.creditCardPayments.movements.forEach(movement => {
      movements.push({
        date: this._normalizeDate(movement.date, bbvaParsedResult.coverage.startDate.getFullYear()),
        amount: movement.amount,
        reference: movement.reference,
        concept: "CREDIT CARD PAYMENT",
        movementType: MovementType.DEBIT
      })
    })
    bbvaParsedResult.thirdPartyMovements.movements.forEach(movement => {
      movements.push({
        date: this._normalizeDate(movement.date, bbvaParsedResult.coverage.startDate.getFullYear()),
        amount: movement.amount,
        movementType: MovementType.DEBIT,
        concept: "Third Party Movement",
        reference: movement.reference
      })
    })
    bbvaParsedResult.bankPayments.movements.forEach(movement => {
      movements.push({
        date: this._normalizeDate(movement.date, bbvaParsedResult.coverage.startDate.getFullYear()),
        amount: movement.amount,
        movementType: MovementType.DEBIT,
        concept: movement.concept,
        reference: movement.reference
      })
    })
    console.log(movements.length)
    return {
      movements: movements,
      accountNumber: bbvaParsedResult.accountNumber
    };
  }

  async parseFromUrl(url: string, normalize: boolean = true): Promise<any> {
    logger.info(`BBVAController.parseFromUrl -> ${url}`)
    const fileBuffer: Buffer = await this.readFileBufferFromUrl(url);
    const pdfParser = new BBVAPdfParser();
    if (normalize) {
      return this.normalizeMovements(await pdfParser.parse(fileBuffer));
    }
    return await pdfParser.parse(fileBuffer);
  }

}