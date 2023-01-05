import { isEmpty, parseInt, uniqueId } from "lodash";
import moment from "moment";
import { createItem, getItem, updateItem } from "./util/commonDB";
import { FunctionMap, pathHandler } from "./util/util";


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

const functionMap: FunctionMap = {
    "/project-service/invite": {
        requiredParams: ['projectId', 'inviteEmails'],
        callback: projectInvite
    }
}

exports.handler = async (event: any, context: any) => {
    // TODO implement
    return pathHandler(event, context, functionMap);
}