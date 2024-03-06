import * as pdf from "pdf-parse";
import { BBVAParsingResult } from "@common/interfaces/movements";

export class BBVAPdfParser {
  pdfContent: string;

  executeRegex(
    regex: RegExp,
    text: string,
    includeEverything: boolean = false,
  ): string | null {
    const matches: RegExpMatchArray = text.match(regex);
    if (includeEverything) {
      return matches ? matches[0] : null;
    }
    return matches ? matches[1].trim() : null;
  }

  stringToNumber(nonParsedNumber: string | null): number {
    if (!nonParsedNumber) return 0;
    const numberWithCommaRemoved = nonParsedNumber.replace(',', '');
    return parseFloat(numberWithCommaRemoved);
  }

  _getAccountNumber(): string {
    return this.executeRegex(
      /No\. de Cuenta(\d+)/,
      this.pdfContent,
    )
  }

  _getFinalBalance(): number {
    return this.stringToNumber(
      this.executeRegex(
        /Saldo Final([\d,]+(\.\d{1,2})?)/,
        this.pdfContent
      )
    )
  }

  _getStartBalance(): number {
    return this.stringToNumber(
      this.executeRegex(
        /Saldo Anterior([\d,]+(\.\d{1,2})?)/,
        this.pdfContent
      )
    )
  }

  _getAverageBalance(): number {
    return this.stringToNumber(
      this.executeRegex(
        /Saldo Promedio([\d,]+(\.\d{1,2})?)/,
        this.pdfContent
      )
    );
  }

  _getStandardTransactions(): any {
    const transactionInfoPattern = /(\d{2}\/[A-Z]{3}){2}\n(.*?)\n([\d,]+\.\d{2})([\d,]+\.\d{2})?([\d,]+\.\d{2})?\n\s*?RFC:\s*(.*?)? (\d{2}:\d{2}) AUT: (\d+) Referencia (.*?)\n/g;
    let match;
    let counter = 0;
    let movements = [];
    while ((match = transactionInfoPattern.exec(this.pdfContent)) !== null) {
      const movement = {
        date: match[1],
        concept: match[2],
        amount: this.stringToNumber(match[3]),
        time: match[7],
        receiverIdentifier: match[8],
        reference: match[9]
      }
      movements.push(movement)
      counter++
    }
    return {
      counter: counter,
      movements: movements,
    }
  }

  _getBankPayments(): any {
    const transactionInfoPattern = /(\d{2}\/[A-Z]{3}){2}\n(.*?)\n([\d,]+\.\d{2})([\d,]+\.\d{2})?([\d,]+\.\d{2})?\n\s*?Referencia (.*?)\n/g;
    const movements = [];
    let counter = 0;
    let match;
    while ((match = transactionInfoPattern.exec(this.pdfContent)) !== null) {
      const movement = {
        date: match[1],
        concept: match[2],
        amount: this.stringToNumber(match[3]),
        reference: match[6]
      }
      movements.push(movement)
      counter++
    }
    return {
      counter: counter,
      movements: movements,
    }
  }

  _getReceivedSpeiTransactions(): any {
    const transactionInfoPattern = /(\d{2}\/[A-Z]{3}){2}\nSPEI RECIBIDO(.*?)\n([\d,]+\.\d{2})([\d,]+\.\d{2})?([\d,]+\.\d{2})?\n\s(.*?) Referencia (.*?)\n/g;
    let match;
    let counter = 0;
    let movements = [];
    while ((match = transactionInfoPattern.exec(this.pdfContent)) !== null) {
      movements.push({
        date: match[1],
        concept: match[6],
        amount: match[3],
        reference: match[7],
        receptionSystem: match[8]
      })
      counter++
    }
    return {
      counter: counter,
      movements: movements,
    }
  }

  _getSentSpeiTransactions(): any {
    const transactionInfoPattern = /(\d{2}\/[A-Z]{3}){2}\nSPEI ENVIADO (.*?)\n([\d,]+\.\d{2})([\d,]+\.\d{2})?([\d,]+\.\d{2})?\n\s+(.*)? Referencia (.*?)\n\s+(.*?)\n\s+(.*?)\n\s+(.*?)\n/g;
    let match;
    let counter = 0;
    let movements = [];
    while ((match = transactionInfoPattern.exec(this.pdfContent)) !== null) {
      movements.push({
        date: match[1],
        amount: match[3],
        bankName: match[2],
        concept: match[6],
        contact: match[10],
        reference: match[7],
        receiverIdentifier: match[8]
      })
      counter++
    }
    return {
      counter: counter,
      movements: movements,
    }
  }

  _getCreditCardPayments(): any {
    const transactionInfoPattern = /(\d{2}\/[A-Z]{3}){2}\nPAGO TARJETA DE CREDITO\n([\d,]+\.\d{2})([\d,]+\.\d{2})?([\d,]+\.\d{2})?\n\s+(.*)? CUENTA: (.*?) Referencia (.*?)\n/g;
    let match;
    let counter = 0;
    let movements = [];
    while ((match = transactionInfoPattern.exec(this.pdfContent)) !== null) {
      movements.push({
        date: match[1],
        amount: this.stringToNumber(match[2]),
        reference: match[7]
      })
      counter++
    }
    return {
      counter: counter,
      movements: movements,
    }
  }

  _getThirdPartyPayments(): any {
    const transactionInfoPattern = /(\d{2}\/[A-Z]{3}){2}\nPAGO CUENTA DE TERCERO\n([\d,]+\.\d{2})([\d,]+\.\d{2})?([\d,]+\.\d{2})?\n .*? BNET (.*?) Referencia (.*?)\n/g;
    let match;
    let movements = [];
    let counter = 0;
    while ((match = transactionInfoPattern.exec(this.pdfContent)) !== null) {
      movements.push({
        amount: this.stringToNumber(match[2]),
        reference: match[6],
        date: match[1],
        bankSourceIdentifier: match[5]
      })
      counter++
    }
    return {
      counter: counter,
      movements: movements
    }
  }

  _getAllReferences() {
    const transactionInfoPattern = /Referencia (.*?)\n/g;
    let match;
    let references = [];
    let counter = 0;
    while ((match = transactionInfoPattern.exec(this.pdfContent)) !== null) {
      counter++
      references.push(match[1])
    }
    console.log(counter)
    return references
  }

  _getReferences(movements: any): string[] {
    let references = []
    movements.movements.forEach(movement => {
      references.push(movement.reference)
    })
    return references
  }

  _cleanText(): void {
    this.pdfContent = this.pdfContent.replace(
      /No\. de Cuenta\n([\s\S]*?)(?:\n(?=\n)|$)/g,
      ''
    )
  }

  async parse(pdfBuffer: Buffer) {
    const pdfResult: pdf.Result = await pdf(pdfBuffer);
    this.pdfContent = pdfResult.text;
    this._cleanText();
    this._getAllReferences()
    const parsingResult: BBVAParsingResult = {
      accountNumber: this._getAccountNumber(),
      finalBalance: this._getFinalBalance(),
      averageBalance: this._getAverageBalance(),
      startBalance: this._getStartBalance(),
      thirdPartyMovements: this._getThirdPartyPayments(),
      receiveMovements: this._getReceivedSpeiTransactions(),
      standardMovements: this._getStandardTransactions(),
      sentMovements: this._getSentSpeiTransactions(),
      creditCardPayments: this._getCreditCardPayments(),
      bankPayments: this._getBankPayments()
    }
    let totalMovements = parsingResult.bankPayments.counter
    totalMovements += parsingResult.creditCardPayments.counter
    totalMovements += parsingResult.standardMovements.counter
    totalMovements += parsingResult.receiveMovements.counter
    totalMovements += parsingResult.thirdPartyMovements.counter
    totalMovements += parsingResult.sentMovements.counter
    console.log(parsingResult);

    const references = this._getAllReferences()
    let allReferences: string[] = []
    allReferences = allReferences.concat(this._getReferences(parsingResult.bankPayments))
    allReferences = allReferences.concat(this._getReferences(parsingResult.thirdPartyMovements))
    allReferences = allReferences.concat(this._getReferences(parsingResult.receiveMovements))
    allReferences = allReferences.concat(this._getReferences(parsingResult.sentMovements))
    allReferences = allReferences.concat(this._getReferences(parsingResult.standardMovements))
    allReferences = allReferences.concat(this._getReferences(parsingResult.creditCardPayments))
    references.forEach(reference => {
      if (!allReferences.includes(reference)) {
        console.log('missing ' + reference)
      }
    })

    function countOccurrences(strings: string[]): Map<string, number> {
      const occurrencesMap: Map<string, number> = new Map();
      for (const str of strings) {
        if (occurrencesMap.has(str)) {
          occurrencesMap.set(str, occurrencesMap.get(str)! + 1);
        } else {
          occurrencesMap.set(str, 1);
        }
      }
      return occurrencesMap;
    }

    const referencesOccurrences = countOccurrences(references);
    console.log(referencesOccurrences);

    const allReferencesOccurrences = countOccurrences(allReferences);
    console.log(allReferencesOccurrences)
    console.log(totalMovements)
  }
}

