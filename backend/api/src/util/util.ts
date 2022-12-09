import { get, isEmpty, toUpper } from "lodash";
import { CrudRequest, HandlerResponse } from "../models/common";

export interface FunctionMap{
    [key: string]: {
        requiredParams: string[];
        callback: (request: CrudRequest) => Promise<HandlerResponse>
    };
}

export const actionHandler = async (event: any, context: any, functionMap: FunctionMap) => {
    // TODO implement
    console.info(event)

    const body = event.body;
    const uid = event.cognitoPoolClaims.sub;
    const action = toUpper(body.action || '');
    if (!isEmpty(uid) 
        && body.data !== undefined
        && get(functionMap, action)
    ){
        return functionMap[action].callback({
            uid,
            data: body.data,
            itemType: body.itemType
        })
    }
    
    return {
        statusCode: 200,
        body: JSON.stringify({
          errorMessage: 'action method do not exist'
        })
    } as HandlerResponse;
};
