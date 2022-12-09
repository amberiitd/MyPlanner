import moment from "moment";
import { ItemType } from "../models/common";
import { createLogger } from 'logger';
import { isEmpty } from "lodash";
const AWS = require('aws-sdk');

const DB = new AWS.DynamoDB.DocumentClient();
const TABLE = 'dev-mainTable';


export const createItem = async (pk: string, sk: string, data: any, table?: string) => {
    if (isEmpty(pk) || isEmpty(sk)){
        return
    }
    const unix = moment().unix();
    const params = {
        TableName: table || TABLE,
        Item: {
            createdAt: unix,
            updatedAt: unix,
            ...data,
            pk,
            sk
        }
    };
    
    const response = await DB.put(params).promise();
    console.info(response);
    return {
        message: "success"
    }
}

export const getItems = async (pk: string, itemType: string, table?: string) => {
    const params = {
        TableName: table || TABLE,
        KeyConditionExpression: 'pk = :pk and begins_with (sk, :itemType)',
        ExpressionAttributeValues: {
            ':pk': pk,
            ':itemType': itemType
        }
    };
  
    const response = await DB.query(params).promise();
    console.info(response)
    
    return response.Items
}

export const deleteItem = async (pk: string, sk: string, table?: string) => {
    const params = {
        TableName: table || TABLE,
        Key: {
            pk: pk,
            sk: sk
        }
    };
  
    const response = await DB.delete(params).promise();
    console.info(response)
    return {
        'message': 'success',
        ...response
    }
}

const parseParams = (data: any) => {
    let expr = ''
    let values: any = {};
    Object.entries(data).forEach(([key, val]) => {
        expr+= `, ${key} = :${key}`;
        values[`:${key}`] = val;
    })

    return [expr, values];
}

export const updateItem = async (pk: string, sk: string, updateData: any, table?: string) => {
    if (isEmpty(pk) || isEmpty(sk)){
        return
    }
    const unix = moment().unix();
    const [updateExpSuffix, attributeValues] = parseParams(updateData);
    const UpdateExpression = 'SET updatedAt= :updatedAt '+ updateExpSuffix;
    const ExpressionAttributeValues = {
        ':updatedAt': unix,
        ...attributeValues
    }

    var params = {
        TableName: table || TABLE,
        Key: { pk, sk },
        UpdateExpression,
        ExpressionAttributeValues
    };
    console.info(params);
    const response = await DB.update(params).promise();
    console.info(response);
    return {
        message: "success"
    }
}
