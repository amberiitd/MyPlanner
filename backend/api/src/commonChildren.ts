import { CrudRequest, ItemType, RequestAction } from "./models/common";
import { actionHandler, FunctionMap } from "./util/util";
import { createItem, deleteItem, getItems, updateItem } from "./util/commonDB";
import moment from "moment";
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
    var params = {
        TableName: TABLE,
        Key: { pk: `uid:${request.uid}`, sk:  `${request.itemType}:${request.data.parentId}`},
        UpdateExpression: `SET ${request.data.itemType} = list_append(if_not_exists(${request.data.itemType}, :empty), :item), updatedAt = :updatedAt`,
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
    const [updateExpSuffix, attributeValues] = parseParams(data, `${request.data.itemType}[${request.data.childCurrentIndex}]`);
    const UpdateExpression = 'SET updatedAt= :updatedAt '+ updateExpSuffix;
    const ExpressionAttributeValues = {
        ':updatedAt': updatedAt,
        ...attributeValues
    }
    var params = {
        TableName: TABLE,
        Key: { pk: `uid:${request.uid}`, sk:  `${request.itemType}:${request.data.parentId}`},
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
    var params = {
        TableName: TABLE,
        Key: { pk: `uid:${request.uid}`, sk:  `${request.itemType}:${request.data.parentId}`},
        UpdateExpression: `SET updatedAt= :updatedAt REMOVE ${request.data.itemType}[${request.data.childCurrentIndex}]`,
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

const functionMap: FunctionMap = {
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