const AWS = require('aws-sdk');
AWS.config.update({region: process.env.REGION});

module.exports.dynamodb = new AWS.DynamoDB(process.env.STAGE === 'dev'
    ? { endpoint: new AWS.Endpoint(process.env.DB_ENDPOINT) }
    : {}
);

module.exports.dynamodbDocumentClient = new AWS.DynamoDB.DocumentClient(process.env.STAGE === 'dev'
    ? { service: module.exports.dynamodb }
    : {}
);