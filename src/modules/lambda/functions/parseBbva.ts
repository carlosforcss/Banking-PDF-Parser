import { APIGatewayProxyHandler } from 'aws-lambda';
import {BBVAController} from "../../parsing/controllers/bbva.controller";
import { logger } from '../../../common/utils/logger';

export const handler: APIGatewayProxyHandler = async (event) => {
  logger.info(`Executing BBVA Parsing function -> ${JSON.stringify(event)} `)
  const eventBody = JSON.parse(event.body);
  try {
    const response = await new BBVAController().parseFromUrl(eventBody.url);
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        "message": `An error occurred -> ${e} with body ${event}`
      })
    }
  }

};
