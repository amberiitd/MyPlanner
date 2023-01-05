import { CrudRequest, ItemType, RequestAction } from "./models/common";
import { actionHandler, CrudFunctionMap } from "./util/util";
import { createItem, deleteItem, getItems, updateItem } from "./util/commonDB";
import moment from "moment";
import { isEmpty } from "lodash";
const AWS = require('aws-sdk');

const DB = new AWS.DynamoDB.DocumentClient();
const TABLE = 'dev-mainTable';

const createCommonChild = async (request: CrudRequest) => {
    const updatedAt = moment().unix();
    const data ={
        updatedAt,
        createdAt: updatedAt,
        ...request.data
    }
    const path = !isEmpty(request.data.subPath) ? (request.data.subPath+ '.'): '';
    var params = {
        TableName: TABLE,
        Key: { pk: `project:${request.data.projectId}`, sk:  `${request.itemType}:${request.data.parentId}`},
        UpdateExpression: `SET ${path}${request.data.itemType} = list_append(if_not_exists(${path}${request.data.itemType}, :empty), :item), updatedAt = :updatedAt`,
        ExpressionAttributeValues:{
            ":item": [data],
            ":empty": [],
            ":updatedAt": updatedAt
        }
    };
    console.info(params);
    const response = await DB.update(params).promise();
    console.info(response);

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

const parseParams = (data: any, parentData: string) => {
    let expr = ''
    let values: any = {};
    Object.entries(data).forEach(([key, val]) => {
        expr+= `, ${parentData}.${key} = :${key}`;
        values[`:${key}`] = val;
    })

    return [expr, values];
}

const updateCommonChild = async (request: CrudRequest) => {
    const updatedAt = moment().unix();
    const data ={
        updatedAt,
        ...request.data
    }
    const path = !isEmpty(request.data.subPath) ? (request.data.subPath+ '.'): '';
    const [updateExpSuffix, attributeValues] = parseParams(data, `${path}${request.data.itemType}[${request.data.childCurrentIndex}]`);
    const UpdateExpression = 'SET updatedAt= :updatedAt '+ updateExpSuffix;
    const ExpressionAttributeValues = {
        ':updatedAt': updatedAt,
        ...attributeValues
    }
    var params = {
        TableName: TABLE,
        Key: { pk: `project:${request.data.projectId}`, sk:  `${request.itemType}:${request.data.parentId}`},
        UpdateExpression,
        ExpressionAttributeValues
    };
    console.info(params);
    const response = await DB.update(params).promise();
    console.info(response);

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

const deleteCommonChild = async (request: CrudRequest) => {
    const updatedAt = moment().unix();
    const path = !isEmpty(request.data.subPath) ? (request.data.subPath+ '.'): '';
    var params = {
        TableName: TABLE,
        Key: { pk: `project:${request.data.projectId}`, sk:  `${request.itemType}:${request.data.parentId}`},
        UpdateExpression: `SET updatedAt= :updatedAt REMOVE ${path}${request.data.itemType}[${request.data.childCurrentIndex}]`,
        ExpressionAttributeValues: {
            ':updatedAt': updatedAt
        }
    };
    console.info(params);
    const response = await DB.update(params).promise();
    console.info(response);

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
        callback: createCommonChild
    },
    [RequestAction.UPDATE]: {
        requiredParams: ['uid', 'data', 'itemType'],
        callback: updateCommonChild
    },
    [RequestAction.DELETE]: {
        requiredParams: ['uid', 'data', 'itemType'],
        callback: deleteCommonChild
    },
}

exports.handler = (event: any, context: any) => {
    return actionHandler(event, context, functionMap);
}