const { dynamodbDocumentClient } = require('./client.aws');

module.exports.readSourceMappingByDiscriminatorAndAlisSourceCode = (discriminator, alisSourceCode) =>
    new Promise((resolve, reject) => {
        const params = {
            TableName: 'Transmitter_DataProvider_SourceMapping',
            IndexName: 'discriminator-alis-source-code-index',
            KeyConditionExpression: 'discriminator = :discriminator and alisSourceCode = :alisSourceCode',
            ExpressionAttributeValues: {
                ':discriminator': discriminator,
                ':alisSourceCode': alisSourceCode
            }
        }

        dynamodbDocumentClient.query(params, (err, data) => {
            if (err) {
                return reject(err);
            }

            if (data.Count === 0) {
                return resolve(null);
            }

            if (data.Count > 1) {
                return reject('Multiple versions founded');
            }

            resolve(data.Items[0]);
        })
    });