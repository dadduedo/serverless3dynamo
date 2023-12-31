const moment = require('moment-timezone');
const db = require('./db');

module.exports.standard = async ({ id, raw: lead }) => {
    const mappingInfopoint = await db.readSourceMappingByDiscriminatorAndAlisSourceCode('infopoint', lead.source);
    const mappingWebsource = await db.readSourceMappingByDiscriminatorAndAlisSourceCode('websource', lead.source);

    const leadType = lead.typeOfSource || lead.channelType || null;
    const cpgSuffix = leadType ? leadType.toLowerCase().charAt(0).toUpperCase() + leadType.substring(1, leadType.length) : '';

    return {
        directory: 'ITA',
        workflow: 'ITA_Front',
        init_cpg: 'ITA_BkC2C' + cpgSuffix,
        ContactProfile: {
            ssupplier: lead.supplier,
            sidnavweb: lead.consolidationKey,
            dwebcreationdate: moment().tz('Europe/Rome').format(),
            HomePhone: lead.phoneNumber,
            sresource: 'RESTD',
            sprospectreferencecode: lead.source || null,
            homePostalCode: lead.zipCode || null,
            FirstName: lead.firstName || "",
            LastName: lead.lastName || "",
            comments: lead.comments || "",
            homeCity: lead.homeCity || "",
            email1: lead.email || lead.email1 || "",
            homeStateProvince: lead.homeStateProvince || "",
            sweborigin: mappingInfopoint ? mappingInfopoint.code : null,
            snomereferente: lead.snomereferente || "",
            scognomereferente: lead.scognomereferente || "",
            sbox1: lead.sbox1 || "",
            sbox2: lead.sbox2 || "",
            scodicepartner: lead.scodicepartner || "",
            // websource: mappingWebsource ? mappingWebsource.code : null
        },
        tuples: [
            {
                tag: 'alis_id',
                value: id,
                category: '-custom_info',
                sort: null
            }
        ]
    };
}

module.exports.all = async ({ id, raw: lead }) => {
    const mappingInfopoint = await db.readSourceMappingByDiscriminatorAndAlisSourceCode('infopoint', lead.source);
    const mappingWebsource = await db.readSourceMappingByDiscriminatorAndAlisSourceCode('websource', lead.source);

    const leadType = lead.typeOfSource || lead.channelType || null;
    const cpgSuffix = leadType ? leadType.toLowerCase().charAt(0).toUpperCase() + leadType.substring(1, leadType.length) : '';

    return {
        directory: 'ITA',
        workflow: 'ITA_Front',
        init_cpg: 'ITA_Bk' + (lead.sourceType === 'funnel' ? 'Funnel' : 'C2C') + cpgSuffix,
        ContactProfile: {
            ssupplier: lead.supplier,
            sidnavweb: lead.consolidationKey,
            dwebcreationdate: moment().tz('Europe/Rome').format(),
            HomePhone: lead.phoneNumber,
            sweborigin: mappingInfopoint ? mappingInfopoint.code : null,
            // websource: mappingWebsource ? mappingWebsource.code : null,
            sresource: 'RESTD',
            sprospectreferencecode: lead.origin+(lead.sourceType === 'funnel' ? '_calcola' : ''),
            homePostalCode: lead.zipCode,
            homeCity: lead.city || null,
            FirstName: "",
            LastName: ""
        },
        tuples: [
            {
                tag: 'alis_id',
                value: id,
                category: '-custom_info',
                sort: null
            },
            {
                tag: 'client_id',
                value: lead.hasOwnProperty('clientIdentity') && lead.clientIdentity.hasOwnProperty('clientId') ? lead.clientIdentity.clientId : null,
                category: '-custom_info',
                sort: null
            },
            {
                tag: 'survey_id',
                value: lead.hasOwnProperty('survey') && lead.survey.hasOwnProperty('id') ? lead.survey.id : null,
                category: '-custom_info',
                sort: null
            },
            {
                tag: 'click_id',
                value: lead.hasOwnProperty('queryParameters') && lead.queryParameters.hasOwnProperty('click_id') ? lead.queryParameters.click_id : null,
                category: '-custom_info',
                sort: null
            },
            {
                tag: 'msclkid',
                value: lead.hasOwnProperty('queryParameters') && lead.queryParameters.hasOwnProperty('msclkid') ? lead.queryParameters.msclkid : null,
                category: '-custom_info',
                sort: null
            },
            {
                tag: 'funnel_id',
                value: lead.hasOwnProperty('funnel') && lead.funnel.hasOwnProperty('id') ? lead.funnel.id : null,
                category: '-funnel_info',
                sort: null
            },
            {
                tag: 'funnel_name',
                value: lead.hasOwnProperty('funnel') && lead.funnel.hasOwnProperty('name') ? lead.funnel.name : null,
                category: 'funnel_info',
                sort: null
            },
            {
                tag: 'funnel_slug',
                value: lead.hasOwnProperty('funnel') && lead.funnel.hasOwnProperty('slug') ? lead.funnel.slug : null,
                category: '-funnel_info',
                sort: null
            },
            {
                tag: 'funnel_is_embed',
                value: lead.hasOwnProperty('isEmbed') ? (lead.isEmbed ? 'true' : 'false') : null,
                category: '-funnel_info',
                sort: null
            },
            ...(lead.hasOwnProperty('answers')
                    ? Object.keys(lead.answers).map((q, sort) => ({
                        tag: q,
                        value: lead.answers[q],
                        category: 'funnel_questions',
                        sort: lead.answersSorting[q] === undefined
                            ? sort
                            : lead.answersSorting[q]
                    }))
                    : []
            )
        ].filter(t => t.value !== null)
    };
}

module.exports.from_out_of_area = async ({ id, raw: lead }) => {
    const mappingInfopoint = await db.readSourceMappingByDiscriminatorAndAlisSourceCode('infopoint', lead.source);
    const mappingWebsource = await db.readSourceMappingByDiscriminatorAndAlisSourceCode('websource', lead.source);

    const leadType = lead.typeOfSource || lead.channelType || null;
    const cpgSuffix = leadType ? leadType.toLowerCase().charAt(0).toUpperCase() + leadType.substring(1, leadType.length) : '';

    return {
        directory: 'ITA',
        workflow: 'ITA_Front',
        init_cpg: 'ITA_Bk' + (lead.sourceType === 'funnel' ? 'Funnel' : 'C2C') + cpgSuffix,
        ContactProfile: {
            ssupplier: lead.supplier,
            sidnavweb: lead.consolidationKey,
            dwebcreationdate: moment().tz('Europe/Rome').format(),
            HomePhone: lead.phoneNumber,
            sweborigin: mappingInfopoint ? mappingInfopoint.code : null,
            // websource: mappingWebsource ? mappingWebsource.code : null,
            sresource: 'RESTD',
            sprospectreferencecode: lead.origin+(lead.sourceType === 'funnel' ? '_calcola' : ''),
            homePostalCode: lead.hasOwnProperty('outOfAreaInfo') && lead.outOfAreaInfo.hasOwnProperty('zipCode') ? lead.outOfAreaInfo.zipCode : null,
            homeCity: lead.hasOwnProperty('outOfAreaInfo') && lead.outOfAreaInfo.hasOwnProperty('city') ? lead.outOfAreaInfo.city : null,
            FirstName: "",
            LastName: ""
        },
        tuples: [
            {
                tag: 'alis_id',
                value: id,
                category: '-custom_info',
                sort: null
            },
            {
                tag: 'client_id',
                value: lead.hasOwnProperty('clientIdentity') && lead.clientIdentity.hasOwnProperty('clientId') ? lead.clientIdentity.clientId : null,
                category: '-custom_info',
                sort: null
            },
            {
                tag: 'survey_id',
                value: lead.hasOwnProperty('survey') && lead.survey.hasOwnProperty('id') ? lead.survey.id : null,
                category: '-custom_info',
                sort: null
            },
            {
                tag: 'click_id',
                value: lead.hasOwnProperty('queryParameters') && lead.queryParameters.hasOwnProperty('click_id') ? lead.queryParameters.click_id : null,
                category: '-custom_info',
                sort: null
            },
            {
                tag: 'msclkid',
                value: lead.hasOwnProperty('queryParameters') && lead.queryParameters.hasOwnProperty('msclkid') ? lead.queryParameters.msclkid : null,
                category: '-custom_info',
                sort: null
            },
            {
                tag: 'funnel_id',
                value: lead.hasOwnProperty('funnel') && lead.funnel.hasOwnProperty('id') ? lead.funnel.id : null,
                category: '-funnel_info',
                sort: null
            },
            {
                tag: 'funnel_name',
                value: lead.hasOwnProperty('funnel') && lead.funnel.hasOwnProperty('name') ? lead.funnel.name : null,
                category: 'funnel_info',
                sort: null
            },
            {
                tag: 'funnel_slug',
                value: lead.hasOwnProperty('funnel') && lead.funnel.hasOwnProperty('slug') ? lead.funnel.slug : null,
                category: '-funnel_info',
                sort: null
            },
            {
                tag: 'funnel_is_embed',
                value: lead.hasOwnProperty('isEmbed') ? (lead.isEmbed ? 'true' : 'false') : null,
                category: '-funnel_info',
                sort: null
            },
            ...(lead.hasOwnProperty('answers')
                    ? Object.keys(lead.answers).map((q, sort) => ({
                        tag: q,
                        value: lead.answers[q],
                        category: 'funnel_questions',
                        sort: lead.answersSorting[q] === undefined
                            ? sort
                            : lead.answersSorting[q]
                    }))
                    : []
            )
        ].filter(t => t.value !== null)
    };
}