import * as fs from 'fs';
import { BBVAPdfParser } from './modules/parsing/controllers/bbva.controller';


function readFileBuffer(filePath: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
        if (err) {
            reject(`Error reading file: ${err.message}`);
        } else {
            resolve(data);
        }
        });§
    });
}


async function main(): Promise<void> {
    const filePath = 'static/account_state_august.pdf';
    const pdfContent: Buffer = await readFileBuffer(filePath);
    const bbvaParser = new BBVAPdfParser();
    await bbvaParser.parse(pdfContent)
}


main()
