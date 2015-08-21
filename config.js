'use strict';

var BACKEND_PREFIX = '/secured/service/';
var WEBSITE_BACKEND_PREFIX = BACKEND_PREFIX + 'website/';

angular.module('QMetric.internal.questionsetPOC').constant('configuration', {
    serviceUrl: WEBSITE_BACKEND_PREFIX + 'enquiry',
    abiLookup: WEBSITE_BACKEND_PREFIX + 'lookup',
    postcode: WEBSITE_BACKEND_PREFIX + 'postcode',
    address: WEBSITE_BACKEND_PREFIX + 'address',

    backoffice: {
        secured: {
            questionset: BACKEND_PREFIX + 'business-line',
            referrers: BACKEND_PREFIX + 'referrer',
            rosserlookup: BACKEND_PREFIX + 'customer/email/',
            session: BACKEND_PREFIX + 'session'
        },
        serverConfig: BACKEND_PREFIX + 'application',
        login: BACKEND_PREFIX + 'oauth2callback/url?state='
    }
});
