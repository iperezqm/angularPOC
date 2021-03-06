'use strict';

angular.module('QMetric.internal.questionsetPOC').service('backofficeSession', function(configuration, $http, $q) {
    var Session = function(sessionData) {
        var Enquiry = function(enquiryData) {
            var thisEnquiry = this;
            angular.extend(thisEnquiry, enquiryData);
            var ENQUIRY_ENDPOINT = SESSIONS_ENDPOINT + '/' + thisSession.id + '/enquiries' + '/' + this.enquiryIndex;

            angular.forEach(enquiryData.quotes, function(quote) {
                angular.extend(quote, {
                    getDetails: function() {
                        if (!quote.details) {
                            $http.get(ENQUIRY_ENDPOINT + '/quoteDetail/' + quote.id).then(function(response) {
                                angular.extend(quote, {
                                    details: response.data
                                });
                            });
                        }
                    }
                });
            });

            this.submitAnswers = function(answers, version) {
                return $http({
                    method: 'PUT',
                    url: ENQUIRY_ENDPOINT,
                    data: {
                        sequence: thisSession.sequenceNumber,
                        applicationForm: {
                            version: version,
                            answers: answers
                        }
                    }
                }).then(thisSession.updateSequenceNumber).then(function(response) {
                    var event = JSON.parse(response.data.eventJson);
                    var validationResult = event.applicationForm.validationResult;
                    console.log(event);

                    if (Object.keys(validationResult.errors).length === 0 && validationResult.globalErrors.length === 0) {
                        return $q.resolve({
                            sessionId: thisSession.id,
                            enquiryIndex: thisEnquiry.enquiryIndex
                        });
                    } else {
                        return $q.reject({errors: validationResult.errors});
                    }
                });
            };

            this.quote = function() {
                return $http({
                    method: 'POST',
                    url: ENQUIRY_ENDPOINT + '/quote/',
                    data: {
                        sequence: thisSession.sequenceNumber
                    }
                }).then(thisSession.updateSequenceNumber).then(function() {
                    return $http.get(ENQUIRY_ENDPOINT);
                }).then(function(response) {
                    return $q.resolve(new Enquiry(response.data));
                });
            };
        };

        var thisSession = this;
        angular.extend(this, sessionData);

        // jscs:disable
        this.id = this._id;
        // jscs:enable

        if (this.enquiries) {
            this.enquiries = _.map(this.enquiries, function(enquiryData) {
                return new Enquiry(enquiryData);
            });
        }

        this.updateSequenceNumber = function(response) {
            if (response.data.sequenceNumber) {
                thisSession.sequenceNumber = response.data.sequenceNumber;
                console.log('sequence is now ' + thisSession.sequenceNumber);
            }
            return response;
        };

        this.newEnquiry = function(businessLine) {
            return $http({
                method: 'POST',
                url: SESSIONS_ENDPOINT + '/' + thisSession.id + '/enquiries',
                data: {
                    businessLine: businessLine,
                    sequence: thisSession.sequenceNumber
                }
            }).then(thisSession.updateSequenceNumber).then(function(response) {
                var newEnquiry = new Enquiry(response.data);
                thisSession.enquiries = thisSession.enquiries || [];
                thisSession.enquiries.push(newEnquiry);
                return $q.resolve(newEnquiry);
            });
        };

        this.getEnquiryByIndex = function(enquiryIndex) {
            return thisSession.enquiries[enquiryIndex - 1];
        };

        this.quoteEnquiryByIndex = function(enquiryIndex) {
            return thisSession.getEnquiryByIndex(enquiryIndex).quote().then(function(updatedEnquiry) {
                thisSession.enquiries[enquiryIndex - 1] = updatedEnquiry;
                return $q.resolve(updatedEnquiry);
            });
        };

        this.addToBasket = function(enquiryIndex, product) {
            var basketUrl = SESSIONS_ENDPOINT + '/' + thisSession.id + '/basket';
            return $http({
                method: 'POST',
                url: basketUrl,
                data: {
                    enquiryIndex: enquiryIndex,
                    product: product,
                    sequence: thisSession.sequenceNumber
                }
            }).then(thisSession.updateSequenceNumber).then(function() {
                return $http.get(basketUrl);
            }).then(function(response) {
                angular.extend(thisSession.basket, response.data);
            });
        };

        this.purchaseWithCard = function() {
            return $http({
                method: 'POST',
                url: SESSIONS_ENDPOINT + '/' + thisSession.id + '/purchaseWithCard',
                data: {
                    sequence: thisSession.sequenceNumber
                }
            }).then(thisSession.updateSequenceNumber).then(function(response) {
                var payment = response.data.paymentRequest;
                var paymentParameters = [];
                //jshint -W107
                payment.parameters.nbx_success_redirect_url = payment.parameters.nbx_success_redirect_url.replace('/sales?session=', '/poc/redirect-to-orders.html#/backoffice/orders/').replace('&order=', '/');
                //jshint +W107
                angular.forEach(payment.parameters, function(value, key) {
                    paymentParameters.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
                });

                return $q.resolve(payment.paymentUrl + '?' + paymentParameters.join('&'));
            });
        };
    };

    var SESSIONS_ENDPOINT = configuration.backoffice.secured.session;

    var sessions = [];

    var newSession = function() {
        return $http({
            method: 'POST',
            url: SESSIONS_ENDPOINT
        }).then(function(response) {
            return loadSession(response.data.aggregate);
        });
    };

    var loadSession = function(sessionId) {
        if (sessions[sessionId]) {
            return $q.resolve(sessions[sessionId]);
        } else {
            return $http.get(SESSIONS_ENDPOINT + '/' + sessionId).then(function(response) {
                return $q.resolve(sessions[sessionId] = new Session(response.data));
            });
        }
    };

    return {
        new: newSession,
        loadSession: loadSession
    };
});
