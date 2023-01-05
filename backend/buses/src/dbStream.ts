const AWS = require('aws-sdk');

const eventbridge = new AWS.EventBridge({region: 'ap-south-1'});

exports.handler = async (event: any, context: any) => {
    for (let record of event['Records']){
        const event_detail: any = {
            'eventName': record.eventName,
            'NewImage': undefined,
            'OldImage': undefined,
            'item_type': undefined
        }
        if (record.dynamodb.NewImage){
            event_detail['NewImage'] = AWS.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage);
        }
        if (record.dynamodb.OldImage){
            event_detail['OldImage'] = AWS.DynamoDB.Converter.unmarshall(record.dynamodb.OldImage)
        }

        event_detail['item_type'] = event_detail['NewImage']? event_detail['NewImage'].itemType : event_detail['OldImage'].itemType;

        const eb_entry = [{
            'Source': "dynamo-stream",
            'DetailType': "dynamodb stream event",
            'Detail': JSON.stringify(event_detail),
            'EventBusName': process.env.EVENTBUS
        }]
        console.info({log_name:"event bridge push", eb_entry})
        console.info(await eventbridge.putEvents({Entries: eb_entry}).promise());
    }
    return {
        "status_code": 200,
        "success": true
    }
}
