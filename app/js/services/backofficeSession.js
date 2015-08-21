'use strict';

angular.module('QMetric.internal.questionsetPOC').service('backofficeSession', function(configuration, $http, $q, backofficeEnquiryFactory) {
    var Session = function(sessionData) {
        var thisSession = this;
        angular.extend(this, sessionData);

        // jscs:disable
        this.id = this._id;
        // jscs:enable

        this.updateSequenceNumber = function(response) {
            if (response.data.sequenceNumber) {
                thisSession.sequenceNumber = response.data.sequenceNumber;
                console.log('sequence is now ' + thisSession.sequenceNumber);
            }
            return response;
        };
    };

    var SESSION_ENDPOINT = configuration.backoffice.secured.session;
    var currentSession;
    var sessions = [];

    var newSession = function() {
        var deferredStart = $q.defer();

        var fail = function(failure) {
            console.log(failure);
            deferredStart.reject(failure);
        };

        $http({
            method: 'POST',
            url: SESSION_ENDPOINT
        }).then(function(response) {
            $http.get(configuration.backoffice.secured.session + '/' + response.data.aggregate).then(function(response) {
                currentSession = new Session(response.data);
                sessions[currentSession.id] = currentSession;
                deferredStart.resolve(currentSession);
            }).catch(fail);
        }).catch(fail);

        return deferredStart.promise;
    };

    var loadSession = function(sessionId) {
        var deferred = $q.defer();

        if (sessions[sessionId]) {
            currentSession = sessions[sessionId];
            deferred.resolve();
        } else {
            $http.get(SESSION_ENDPOINT + '/' + sessionId).then(function(response) {
                sessions[sessionId] = currentSession = new Session(response.data);
                deferred.resolve();
            });
        }

        return deferred.promise;
    };

    var getSession = function() {
        if (!currentSession) {
            return newSession();
        } else {
            var deferredGetSession = $q.defer();
            deferredGetSession.resolve(currentSession);
            return deferredGetSession.promise;
        }
    };

    var currentEnquiry;

    var getEnquiry = function(businessLine) {
        var deferred = $q.defer();

        if (currentEnquiry) {
            deferred.resolve(currentEnquiry);
        } else {
            backofficeEnquiryFactory.new(currentSession.id, businessLine, currentSession.sequenceNumber)
            .then(currentSession.updateSequenceNumber)
            .then(function(response) {
                currentEnquiry = response.data;
                currentSession.enquiries = currentSession.enquiries || [];
                currentSession.enquiries.push(currentEnquiry);
                deferred.resolve(currentEnquiry);
            });
        }

        return deferred.promise;
    };

    var submitEnquiry = function(businessLine, version, answers) {
        var deferred = $q.defer();

        getSession().then(function() {
            var enquiriesEndpoint = SESSION_ENDPOINT + '/' + currentSession.id + '/enquiries';
            return getEnquiry(businessLine).then(function(enquiry) {
                return $http({
                    method: 'PUT',
                    url: enquiriesEndpoint + '/' + enquiry.enquiryIndex,
                    data: {
                        sequence: currentSession.sequenceNumber,
                        applicationForm: {
                            version: version,
                            answers: answers
                        }
                    }
                });
            });
        }).then(currentSession.updateSequenceNumber).then(function(response) {
            var event = JSON.parse(response.data.eventJson);
            var validationResult = event.applicationForm.validationResult;
            console.log(event);

            if (Object.keys(validationResult.errors).length === 0 && validationResult.globalErrors.length === 0) {
                deferred.resolve({
                    sessionId: currentSession.id,
                    enquiryIndex: currentEnquiry.enquiryIndex
                });
            } else {
                deferred.reject({errors: validationResult.errors});
            }
        });

        return deferred.promise;
    };

    var getQuotes = function(sessionId, enquiryIndex) {
        var deferred = $q.defer();

        loadSession(sessionId).then(function() {
            $http({
                method: 'POST',
                url: SESSION_ENDPOINT + '/' + sessionId + '/enquiries/' + enquiryIndex + '/quote/',
                data: {
                    sequence: currentSession.sequenceNumber
                }
            }).then(currentSession.updateSequenceNumber).then(function() {
                return $http.get(SESSION_ENDPOINT + '/' + sessionId + '/enquiries/' + enquiryIndex);
            }).then(function(response) {
                currentEnquiry = response.data;
                deferred.resolve(currentEnquiry);
            });
        });

        return deferred.promise;
    };

    return {
        submitEnquiry: submitEnquiry,
        getQuotes: getQuotes
    };
});

angular.module('QMetric.internal.questionsetPOC').service('backofficeEnquiryFactory', function(configuration, $http) {
    var SESSION_ENDPOINT = configuration.backoffice.secured.session;

    return {
        new: function(sessionId, businessLine, sequence) {
            var enquiriesEndpoint = SESSION_ENDPOINT + '/' + sessionId + '/enquiries';

            return $http({
                method: 'POST',
                url: enquiriesEndpoint,
                data: {
                    businessLine: businessLine,
                    sequence: sequence
                }
            });
        }
    };
});
