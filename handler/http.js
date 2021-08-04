const serverless = require('serverless-http');
const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const dataProvider = require('../services/dataProvider');

app.use(bodyParser.json());

const EmailTemplate = require('email-templates');
const email = new EmailTemplate({
    views: {
        root: path.join(__dirname, '..', 'tpl')
    },
    message: {
        from: process.env.EMAIL_FROM
    },
    transport: nodemailer.createTransport(process.env.SMTP_CONFIGURATION),
    send: true,
    preview: false,
});

app.post('/send', (req, res) => {
    if (!dataProvider.hasOwnProperty(req.headers.scope)) {
        return res.status(404).json({
            message: `Data provider "${req.headers.scope}" was not found`
        })
    }

    dataProvider[req.headers.scope](req.body)
        .then(dataProvided => {
            console.log('Before send', {
                id: req.body.id,
                emailContent: JSON.stringify(dataProvided)
            })
            return email
                .send({
                    template: 'standard',
                    message: {
                        to: req.headers['email-to']
                    },
                    locals: {
                        content: dataProvided
                    }
                })
        })
        .then(data => {
            console.log('After send', { response: JSON.stringify(data) })
            res.json(data)
        })
        .catch(err => {
            console.error('Cannot send email', {
                scope: req.headers.scope,
                emailTo: req.headers['email-to'],
                documentId: req.body.id,
                error: err.message
            });
            res.status(500).json(err)
        });
});

module.exports.app = serverless(app);
