import { CrudRequest, ItemType, RequestAction } from "./models/common";
import { actionHandler, CrudFunctionMap } from "./util/util";
import { createItem, deleteItem, getItems, updateItem } from "./util/commonDB";

const create = async (request: CrudRequest) => {
    await createItem(`project:${request.data.projectId}`, `${request.itemType}:${request.data.id}`, {
        itemType: request.itemType,
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

const getAll = async (request: CrudRequest) => {
    const items = await getItems(`project:${request.data.projectId}`, request.itemType)
    
    return {
        statusCode: 200,
        body: JSON.stringify({
            'message': 'success',
            'data': items
        })
    }
}

const deleteOne = async (request: CrudRequest) => {
    await deleteItem(`project:${request.data.projectId}`, `${request.itemType}:${request.data.id}`)
    return {
        statusCode: 200,
        body: JSON.stringify({
            'message': 'success',
        })
    }
}

const update = async (request: CrudRequest) => {
    await updateItem(`project:${request.data.projectId}`, `${request.itemType}:${request.data.id}`, request.data , request.data.subPath);
    return {
        statusCode: 200,
        body: JSON.stringify({
            'message': 'success',
        })
    }
}

const functionMap: CrudFunctionMap = {
    [RequestAction.CREATE]: {
        requiredParams: ['uid', 'itemType'],
        callback: create
    },
    [RequestAction.DELETE]: {
        requiredParams: ['uid', 'itemType'],
        callback: deleteOne
    },
    [RequestAction.RETRIEVE]: {
        requiredParams: ['uid', 'itemType'],
        callback: getAll
    },
    [RequestAction.UPDATE]: {
        requiredParams: ['uid', 'itemType'],
        callback: update
    }
}

exports.handler = (event: any, context: any) => {
    return actionHandler(event, context, functionMap);
}

