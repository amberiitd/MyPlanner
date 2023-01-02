import { parseInt } from "lodash";
import moment from "moment";
import { HandlerResponse } from "./models/common";
import { createItem, getItem, updateItem } from "./util/commonDB";

exports.handler = async (event: any, context: any) => {
    // TODO implement
    console.info(event)

    const body = event.body;
    const uid = event.cognitoPoolClaims.sub;
    const projectId = body.projectId;
    const inviteEmail = body.inviteEmail;
    
    const invite = await getItem(`project:${projectId}`, `request:${inviteEmail}`);
    const unix = moment().unix();
    const tokenId = `token:${unix}`;
    const token = btoa(JSON.stringify({inviteEmail, projectId}))
    const pk = `project:${projectId}`;
    const sk = `invite:${inviteEmail}`;
    if(!invite){
        await createItem(pk, sk, {
            projectId,
            inviteEmail,
            token,
            tokenId,
            expiresAt: unix+ 60*60*24*7,
            itemType: 'project-invite'
        })
    }else if(parseInt(invite.expiresAt) < unix){
        await updateItem(pk, sk, {
            expiresAt: unix+ 60*60*24*7,
            inviteSent: false
        });
    }else{
        return {
            statusCode: 200,
            body: JSON.stringify({
                errorMessage: 'Invitation email has already been sent.'
            })
        } as HandlerResponse;
    }
    
    return {
        statusCode: 200,
        body: JSON.stringify({
        })
    } as HandlerResponse;
}