import { isEmpty, parseInt, uniqueId } from "lodash";
import moment from "moment";
import { createItem, getItem, updateItem } from "./util/commonDB";
import { FunctionMap, pathHandler } from "./util/util";
const AWS = require('aws-sdk');

const DB = new AWS.DynamoDB.DocumentClient();
const TABLE = 'dev-mainTable';

const isOwner = async (uid: string, projectId: string) => {
    const project = await getItem(`uid:${uid}`, `project:${projectId}`);
    return !isEmpty(project)
}
const projectInvite = async (data: any) => {
    const projectId = data.projectId;
    const inviteEmails: string[] = data.inviteEmails;
    const owns = await isOwner(data.identity.uid, projectId);
    if (!owns){
        return {
            errorMessage: 'InvitationForbidden'
        }
    }
    const unix = moment().unix();
    const pk = `project:${projectId}`;

    for (let i=0; i< inviteEmails.length; i++){
        const inviteEmail = inviteEmails[i];
        const invite = await getItem(`project:${projectId}`, `request:${inviteEmail}`);
        const tokenId = `token:${uniqueId()}:${unix}`;
        const sk = `invite:${inviteEmail}`;
        if(!invite){
            await createItem(pk, sk, {
                projectId,
                inviteEmail,
                invitedBy: data.identity.email,
                tokenId,
                expiresAt: unix+ 60*60*24*7,
                itemType: 'project-invite'
            })
        }else if(parseInt(invite.expiresAt) < unix){
            await updateItem(pk, sk, {
                expiresAt: unix+ 60*60*24*7,
                inviteSent: false
            });
        }
    }
    return {message: "success"}
}

const newJoiner = async (data: any) => {
    const joinee = data.identity.email;
    const token = data.token;

    if (!token) return {errorMessage: 'InvalidToken'};
    const tokenInfo = JSON.parse(Buffer.from(token, 'base64').toString());
    console.info({tokenInfo});
    const pk = `uid:${data.identity.uid}:project:${tokenInfo.projectId}`;
    const sk = 'project_policy';
    const policy = await getItem(pk, sk);
    if (policy) return {message: "success"};

    const inviteTokenItem = await getItem(`project:${tokenInfo.projectId}`, `invite:${tokenInfo.inviteEmail}`);
    if (
        isEmpty(inviteTokenItem)
        || tokenInfo.tokenId !== inviteTokenItem.tokenId
        || tokenInfo.expiresAt < moment().unix()
        || isEmpty(tokenInfo.projectId)
        || tokenInfo.inviteEmail !== joinee
    ) return {errorMessage: 'Forbidden'};
    
    await createItem(pk, sk, {
        pk,
        sk,
        uid: data.identity.uid,
        projectId: tokenInfo.projectId,
        scopes: ['read', 'write'],
        gsi_pk_1: `project:${tokenInfo.projectId}`,
        gsi_sk_1: `project_policy`,
        gsi_pk_2: `uid:${data.identity.uid}`,
        gsi_sk_2: `project_policy`,
    })

    return {message: "success"} 
}

const getJoinedProjects = async (data: any)=>{
    let params: any = {
        TableName: TABLE,
        IndexName: "gsi_2",
        KeyConditionExpression: 'gsi_pk_2 = :gsi_pk_2',
        ExpressionAttributeValues: {
            ':gsi_pk_2': `uid:${data.identity.uid}`,
        }
    };
    
    let response = await DB.query(params).promise();
    console.info({response, params});
    if (!response.Items || response.Items.length === 0){
        return {
            'message': 'success',
            'data': []
        }
    }else{
        params = {
            TableName: TABLE,
            IndexName: "gsi_2",
            FilterExpression: "contains(:projectId, #projectId)",
            ExpressionAttributeNames: {
                '#projectId': 'id'
            },
            KeyConditionExpression: 'gsi_pk_2 = :gsi_pk_2',
            ExpressionAttributeValues: {
                ':gsi_pk_2': `project_table`,
                ':projectId': response.Items.map((p: any) => p.projectId)
            }
        };
        
        const response2 = await DB.query(params).promise();
        console.info({response: response2, params});
        return {
            'message': 'success',
            'data': response2.Items
        }
    }
}

const getActivePeople = async (data: any)=>{
    let params: any = {
        TableName: TABLE,
        IndexName: "gsi_1",
        KeyConditionExpression: 'gsi_pk_1 = :gsi_pk_1 and gsi_sk_1= :gsi_sk_1',
        ExpressionAttributeValues: {
            ':gsi_pk_1': `project:${data.projectId}`,
            ':gsi_sk_1': 'project_policy'
        }
    };
    
    let response = await DB.query(params).promise();
    console.info({response, params});
    if (!response.Items || response.Items.length === 0){
        return {
            'message': 'success',
            'data': []
        }
    }else{
        params = {
            TableName: TABLE,
            IndexName: "gsi_2",
            FilterExpression: "contains(:uids, #uid)",
            ExpressionAttributeNames: {
                '#uid': 'uid'
            },
            KeyConditionExpression: 'gsi_pk_2 = :gsi_pk_2',
            ExpressionAttributeValues: {
                ':gsi_pk_2': `user_table`,
                ':uids': response.Items.map((p: any) => p.uid)
            }
        };
        
        const response2 = await DB.query(params).promise();
        console.info({response: response2, params});
        return {
            'message': 'success',
            'data': response2.Items.map((u: any) => ({email: u.email, fullName: u.fullName}))
        }
    }
}

const functionMap: FunctionMap = {
    "/project-service/invite": {
        requiredParams: ['projectId', 'inviteEmails'],
        callback: projectInvite
    },
    "/project-service/newjoiner": {
        requiredParams: ['token'],
        callback: newJoiner
    },
    "/project-service/projects": {
        requiredParams: [],
        callback: getJoinedProjects
    },
    "/project-service/people": {
        requiredParams: ['projectId'],
        callback: getActivePeople
    },
}

exports.handler = async (event: any, context: any) => {
    // TODO implement
    return pathHandler(event, context, functionMap);
}