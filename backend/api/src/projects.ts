import { CrudRequest, ItemType, RequestAction } from "./models/common";
import { actionHandler, CrudFunctionMap } from "./util/util";
import { createItem, deleteItem, getItems } from "./util/commonDB";

const createProject = async (request: CrudRequest) => {
    await createItem(`uid:${request.uid}`, `${ItemType.PROJECT}:${request.data.id}`, {
        itemType: ItemType.PROJECT,
        ...request.data,
        uid: request.uid,
        gsi_pk_1: `project:${request.data.id}`,
        gsi_sk_1: 'project'
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

const getProjects = async (request: CrudRequest) => {
    const items = await getItems(`uid:${request.uid}`, ItemType.PROJECT)
    
    return {
        statusCode: 200,
        body: JSON.stringify({
            'message': 'success',
            'data': items
        })
    }
}

const deleteProject = async (request: CrudRequest) => {
    await deleteItem(`uid:${request.uid}`, `${ItemType.PROJECT}:${request.data.id}`)
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
        callback: createProject
    },
    [RequestAction.DELETE]: {
        requiredParams: ['uid', 'itemType'],
        callback: deleteProject
    },
    [RequestAction.RETRIEVE]: {
        requiredParams: ['uid', 'itemType'],
        callback: getProjects
    }
}

exports.handler = (event: any, context: any) => {
    return actionHandler(event,context, functionMap);
}

