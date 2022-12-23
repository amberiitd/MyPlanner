

exports.handler = (event: any, context: any, callback: (data: any, event: any) => void) => {

    console.log(event)

    callback(null, event);
}