import { createItem } from "./util/commonDB";


exports.handler = async (event: any, context: any, callback: (data: any, event: any) => void) => {

    console.log("cognito_event=", event);
    const uid = event.request.userAttributes.sub;
    const email = event.request.userAttributes.email;
    await createItem(`uid:${uid}`, 'user', {
        uid,
        email,
        fullName: event.request.userAttributes['custom:fullName'],
        itemType: 'user',
        gsi_pk_1: `email:${email}`,
        gsi_sk_1: 'user'
    })

    callback(null, event);
}