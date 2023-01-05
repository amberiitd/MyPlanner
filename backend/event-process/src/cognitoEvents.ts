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
        gsi_sk_1: 'user',
        gsi_pk_2: 'user_table',
        gsi_sk_2: 'data'
    })

    callback(null, event);
}