const { dynamodbDocumentClient } = require('./client.aws');

module.exports.readSource = code => new Promise((resolve, reject) => {
    dynamodbDocumentClient.get({
        TableName: 'Transmitter_DataProvider_Altitude_Source',
        Key: { code }
    }, ((err, data) => {
        if (err) reject(err)
        else resolve(data.Item || null);
    }))
});

module.exports.readMapping = alisSourceCode => new Promise((resolve, reject) => {
    dynamodbDocumentClient.get({
        TableName: 'Transmitter_DataProvider_Altitude_Mapping',
        Key: { alisSourceCode }
    }, ((err, data) => {
        if (err) reject(err)
        else resolve(data.Item || null);
    }))
});

module.exports.readMappingByAltitudeSourceCode = altitudeSourceCode => new Promise((resolve, reject) => {
    dynamodbDocumentClient.query({
        TableName: 'Transmitter_DataProvider_Altitude_Mapping',
        IndexName: 'altitude-source-code-index',
        KeyConditionExpression: 'altitudeSourceCode = :altitudeSourceCode',
        ExpressionAttributeValues: {
            ':altitudeSourceCode': altitudeSourceCode,
        },
    }, ((err, data) => {
        if (err) {
            reject(err);
            return;
        }

        if (data.Count === 0) {
            resolve(null);
            return;
        }

        if (data.Count > 1) {
            reject('Multiple versions founded');
            return;
        }

        resolve(data.Items[0]);
    }))
});

module.exports.scanSource = nextToken => new Promise((resolve, reject) => {
    dynamodbDocumentClient.scan({
        TableName: 'Transmitter_DataProvider_Altitude_Source',
        ExclusiveStartKey: nextToken || null
    }, (err, data) => {
        if (err) {
            reject(err);
        } else {
            resolve({
                items: data.Items,
                nextToken: data.LastEvaluatedKey ? data.LastEvaluatedKey : null
            });
        }
    })
});

module.exports.scanMapping = nextToken => new Promise((resolve, reject) => {
    dynamodbDocumentClient.scan({
        TableName: 'Transmitter_DataProvider_Altitude_Mapping',
        ExclusiveStartKey: nextToken || null,
    }, (err, data) => {
        if (err) {
            reject(err);
        } else {
            resolve({
                items: data.Items,
                nextToken: data.LastEvaluatedKey ? data.LastEvaluatedKey : null
            });
        }
    })
});