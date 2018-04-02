'use strict';

console.log('Loading function');

const doc = require('dynamodb-doc');

const dynamo = new doc.DynamoDB();

exports.handler = (event, context, callback) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));

    const done = (err, res) => callback(null, {
        statusCode: err ? '400' : '200',
        body: err ? err.message : JSON.stringify(res),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    
    try {
        event.body = JSON.parse(event.body);
    } catch (e) {
        console.log("This is already parsed OR not valid json body.js json objects can not parsed more than once." +
        "Lambda test objects are already parsed But requests coming from api gateway is not parsed."+
        "If this error is thrown that means lambda invokation was done by lambda test framework.");
    }
    
    switch (event.httpMethod) {
        case 'DELETE':
            dynamo.deleteItem(event.body, done);
            break;
        case 'GET':
            
            if(event.queryStringParameters.IntRef  && event.queryStringParameters.MsgId) {
                console.log("this is to return intergration specific message id if exist");
                
                var params = {
                    TableName : event.queryStringParameters.TableName,
                    ProjectionExpression: "#intRef, #msgId",
                    FilterExpression: "#intRef = :intRef AND #msgId = :msgId",
                    ExpressionAttributeNames:{
                        "#intRef": "integrationReference",
                        "#msgId": "messageId"
                    },
                    ExpressionAttributeValues: {
                        ":intRef": event.queryStringParameters.IntRef,
                        ":msgId": event.queryStringParameters.MsgId
                    }
                };
                
                dynamo.scan( params, done);                

            } else {
                console.log("this is to retun full table scan result");
                dynamo.scan({ TableName: event.queryStringParameters.TableName }, done);                
            }
            
            break;
        case 'POST':
            dynamo.putItem(event.body, done);
            break;
        case 'PUT':
            dynamo.updateItem(JSON.parse(event.body), done);
            break;
        default:
            done(new Error(`Unsupported method "${event.httpMethod}"`));
    }
};
