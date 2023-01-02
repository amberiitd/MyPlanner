exports.projectInvitationHandler = async (event: any, context: any) => {
    console.log('project invitation event', event);
    return {
        statusCode: 200,
        body: JSON.stringify({
        })
    }
}