const AWS = require('aws-sdk');

const sesClient = new AWS.SES();
const DB = new AWS.DynamoDB.DocumentClient();
const TABLE = 'dev-mainTable';

const getInviter = async (email: string) => {
    const params = {
        TableName: TABLE,
        IndexName: "gsi_1",
        Limit: 5,
        KeyConditionExpression: 'gsi_pk_1 = :gsi_pk_1 and gsi_sk_1 = :gsi_sk_1',
        ExpressionAttributeValues: {
            ':gsi_pk_1': `email:${email}`,
            ':gsi_sk_1': 'user'
        }
    };
    
    const response = await DB.query(params).promise();
    console.info({response, params})
    if (response.Items)
        return response.Items[0];
    else return undefined;
}
// "http://localhost:3000/myp/projects?user_as=${newImage.inviteEmail}&invite_token=${token}"
exports.projectInvitationHandler = async (event: any, context: any) => {
    console.log('project invitation event', event);
    for (let record of event['Records']){
        const body = JSON.parse(record.body);
        const newImage = body.detail.NewImage;
        const oldImage = body.detail.OldImage;
        if (!newImage.inviteSent){
            const inviter = await getInviter(newImage.invitedBy);
            if (!inviter) continue;

            const token = Buffer.from(JSON.stringify({
                inviteEmail: newImage.inviteEmail, 
                projectId: newImage.projectId, 
                tokenId: newImage.tokenId,
            })).toString('base64');
            var params = {
                Destination: {
                    BccAddresses: [
                    ], 
                    CcAddresses: [
                    ], 
                    ToAddresses: [
                        newImage.inviteEmail,
                    ]
                }, 
                Message: {
                    Body: {
                        Html: {
                            Charset: "UTF-8", 
                            Data: `
<!DOCTYPE html>
<html lang="en">
  <head>

  </head>
  <body >
    <div style="padding-left: 5rem; padding-right: 5rem;">
        <div style="padding-top:10px;padding-bottom:10px;vertical-align:top;text-align:center">
            <a href="http://localhost:3000/myp" style="cursor: pointer;"> 
                <img src="https://myplanner-3dbe9.web.app/app-logo.png" style="height: 4em;"/>
            </a>
        </div>
        <hr />
        <div style="display: flex; justify-content: center;">
            <div>
                <h5 style="margin-left: 2rem; margin-right: 2rem; font-size: large;">Your are invited to join a project</h5>
                <div style="display: flex; margin-left: 2rem; margin-right: 2rem; ">
                    <button style="border: none; background-color: rgb(201, 56, 3); height: 2.2em; width: 2.2em; border-radius: 50%; color: white; font-size: 200%">
                        ${(inviter.fullName || '').split(' ').slice(0, 2).map((part: string) => part[0]).join() || 'AB'}
                    </button>
                    
                    <div style="margin-left: 2rem; margin-right: 2rem;">
                        <div style="font-weight: 645; font-size: medium;">
                            ${inviter.fullName} has invited you to collaborate on <a href="http://localhost:3000/myp" style="cursor: pointer; text-decoration: none; color: rgb(53, 53, 249)">MyPlanner.com</a>
                        </div>
                        <div style="margin-top: 1rem; margin-bottom: 1rem;">
                            <a href="http://localhost:3000/myp/projects?user_as=${newImage.inviteEmail}&invite_token=${token}" style="background-color: rgb(201, 56, 3); text-decoration: none; border-radius: 5px; color: white; padding: 0.5rem;">
                                Join Project
                            </a>
                        </div>
                    </div>
                </div>
                <div style="margin: 2rem;">
                    <p>Cheers,</p>
                    <p>Myplanner.com</p>
                </div>
            </div>
        </div>
        <hr />
    </div>
  </body>
</html>

                            `
                        }, 
                        // Text: {
                        //     Charset: "UTF-8", 
                        //     Data: "This is the message body in text format."
                        // }
                    }, 
                    Subject: {
                        Charset: "UTF-8", 
                        Data: `${inviter.fullName} is waiting for you to join them`
                    }
                }, 
                // ReplyToAddresses: [
                // ], 
                // ReturnPath: "", 
                // ReturnPathArn: "", 
                Source: "amberiitd15@gmail.com", 
                // SourceArn: ""
            };
            console.info(await sesClient.sendEmail(params).promise());
        }
    }
    return {
        statusCode: 200,
        body: JSON.stringify({
        })
    }
}