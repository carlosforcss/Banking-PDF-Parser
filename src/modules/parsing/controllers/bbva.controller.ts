import axios from 'axios';
import { BBVAPdfParser } from "../helpers/bbvaPdfParser.helper";
import { logger } from '../../../common/utils/logger';

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

  async parseFromUrl(url: string): Promise<any> {
    logger.info(`BBVAController.parseFromUrl -> ${url}`)
    const fileBuffer: Buffer = await this.readFileBufferFromUrl(url);
    const pdfParser = new BBVAPdfParser();
    return await pdfParser.parse(fileBuffer);
  }

}