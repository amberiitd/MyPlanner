import { HandlerResponse } from "./models/common";

exports.handler = async (event: any, context: any) => {
    // TODO implement
    console.info(event)

    const body = event.body;
    const uid = event.cognitoPoolClaims.sub;
    const projectId = body.projectId;
    
    return {
        statusCode: 200,
        body: JSON.stringify({
          errorMessage: 'action method do not exist'
        })
    } as HandlerResponse;
}