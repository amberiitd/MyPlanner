import { CrudRequest, Issue, ItemType, RequestAction } from "./models/common";
import { actionHandler, CrudFunctionMap } from "./util/util";
import { createItem, deleteItem, getItems, updateItem } from "./util/commonDB";
import { isEmpty } from "lodash";

const createIssue = async (request: CrudRequest) => {
    await createItem(`project:${request.data.projectId}`, `${ItemType.ISSUE}:${request.data.id}`, {
        itemType: ItemType.ISSUE,
        ...request.data
    })
    return {
        statusCode: 200,
        headers: {
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods" : "OPTIONS,POST,GET,PUT"
    },
        body: JSON.stringify({
        message: "success"
        })
    };
}

const getIssues = async (request: CrudRequest) => {
    const items = await getItems(`project:${request.data.projectId}`, ItemType.ISSUE)
    
    return {
        statusCode: 200,
        body: JSON.stringify({
            'message': 'success',
            'data': items
        })
    }
}

const deleteIssue = async (request: CrudRequest) => {
    await deleteItem(`project:${request.data.projectId}`, `${ItemType.ISSUE}:${request.data.id}`)
    return {
        statusCode: 200,
        body: JSON.stringify({
            'message': 'success',
        })
    }
}

const assignToSprint = async (request: CrudRequest) => {

    if (!isEmpty(request.data.ids)){
        const ids = request.data.ids || [];
        for (let i=0; i< ids.length; i++){
            await updateItem(`project:${request.data.projectId}`, `${ItemType.ISSUE}:${ids[i]}`, {
                sprintId: request.data.sprintId
            } as Issue);
        }
    }
    return {
        statusCode: 200,
        headers: {
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods" : "OPTIONS,POST,GET,PUT"
    },
        body: JSON.stringify({
            message: "success"
        })
    };
}

const functionMap: CrudFunctionMap = {
    [RequestAction.CREATE]: {
        requiredParams: ['uid', 'data', 'itemType'],
        callback: createIssue
    },
    [RequestAction.DELETE]: {
        requiredParams: ['uid', 'data', 'itemType'],
        callback: deleteIssue
    },
    [RequestAction.RETRIEVE]: {
        requiredParams: ['uid', 'data', 'itemType'],
        callback: getIssues
    },
    [RequestAction.Issue.ASSIGN_SPRINT]: {
        requiredParams: ['uid', 'data', 'itemType'],
        callback: assignToSprint
    }
}

exports.handler = (event: any, context: any) => {
    return actionHandler(event, context, functionMap);
}

