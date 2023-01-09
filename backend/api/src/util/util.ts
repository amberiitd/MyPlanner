import { get, isEmpty, toUpper } from "lodash";
import { CrudRequest, HandlerResponse } from "../models/common";

export interface CrudFunctionMap{
    [key: string]: {
        requiredParams: string[];
        callback: (request: CrudRequest) => Promise<HandlerResponse>
    };
}

export interface FunctionMap{
    [key: string]: {
        requiredParams: string[];
        callback: (params: any) => Promise<any>
    };
}

export const actionHandler = async (event: any, context: any, functionMap: CrudFunctionMap) => {
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

export const pathHandler = async (event: any, context: any, functionMap: CrudFunctionMap) => {
    // TODO implement
    console.info(event)
    console.log(event)
    const body = event.body;
    const uid = event.cognitoPoolClaims.sub;
    const path = event.requestPath.replace('{proxy+}', event.path.proxy);

    const returnObj = await functionMap[path].callback({
        identity:{uid, email: event.cognitoPoolClaims.email},
        ...body
    })

    return {
        statusCode: 200,
        body: JSON.stringify(returnObj || {})
    } as HandlerResponse;
};