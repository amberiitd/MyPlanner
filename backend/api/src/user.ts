import { FunctionMap, pathHandler } from "./util/util"
const AWS = require('aws-sdk');

const DB = new AWS.DynamoDB.DocumentClient();
const TABLE = 'dev-mainTable';

const searchUser = async (data: any) => {
    const params = {
        TableName: TABLE,
        IndexName: "gsi_2",
        Limit: 5,
        KeyConditionExpression: 'gsi_pk_2 = :gsi_pk_2',
        FilterExpression: 'contains(email, :search) or contains(fullName, :search)',
        ExpressionAttributeValues: {
            ':gsi_pk_2': 'user_table',
            ':search': data.searchText
        }
    };
    
    const response = await DB.query(params).promise();
    console.info({response, params})

    return {
        'message': 'success',
        'data': response.Items || []
    }
}

const functionMap: FunctionMap = {
    "/user/search": {
        requiredParams: ['searchText'],
        callback: searchUser
    }
}

exports.handler = (event: any, context: any) => {
    return pathHandler(event, context, functionMap);
}