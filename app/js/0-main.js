'use strict';

angular.module('QMetric.internal.questionsetPOC', [
    'ui.router',
    'ui.bootstrap',
    'angularSpinner',
    'ngCookies',
    'ngMessages'
], function($locationProvider, $tooltipProvider) {
    $locationProvider.html5Mode({
        enabled: false,
        requireBase: false
    });

    $tooltipProvider.options({
        appendToBody: true
    });
});

angular.module('QMetric.internal.questionsetPOC').config(function($stateProvider) {
    $stateProvider.state('homepage', {
        url: '',
        views: {
            mainsection: {
                template: '<div class="jumbotron">' +
                    '<div class="container">' +
                    '<h1>...why not?</h1>' +
                    '<p>Angular + Bootstrap PoC</p>' +
                    '<h3>Website:</h3>' +
                    '<p>' +
                    '<a class="btn btn-primary btn-lg" href="#/home2" role="button">Home</a> ' +
                    '<a class="btn btn-primary btn-lg" href="#/Car" role="button">Car</a>' +
                    '</p>' +
                    '<h3>Backoffice:</h3>' +
                    '<p>' +
                    '<a class="btn btn-primary btn-lg" href="#/backoffice/home2" role="button">Home</a> ' +
                    '<a class="btn btn-primary btn-lg" href="#/backoffice/Car" role="button">Car</a>' +
                    '</p>' +
                    '</div>' +
                    '</div>'
            }
        }
    });

    $stateProvider.state('backofficeQuotes', {
        url: '/backoffice/quotes/:sessionId/:enquiryIndex',
        views: {
            mainsection: {
                templateUrl: 'uiviews/backofficeQuotes.tpl.html'
            }
        }
    });

    $stateProvider.state('backofficeAmendEnquiry', {
        url: '/backoffice/amendEnquiry/:sessionId/:enquiryIndex',
        views: {
            mainsection: {
                templateUrl: 'uiviews/backofficeQuestionset.tpl.html'
            }
        }
    });

    $stateProvider.state('backofficeQuestionset', {
        url: '/backoffice/:businessLine',
        views: {
            mainsection: {
                templateUrl: 'uiviews/backofficeQuestionset.tpl.html'
            }
        }
    });

    $stateProvider.state('quotes', {
        url: '/quotes/:businessLine/:enquiryId/:sequence',
        views: {
            mainsection: {
                templateUrl: 'uiviews/quotes.tpl.html'
            }
        }
    });

    $stateProvider.state('amendEnquiry', {
        url: '/:businessLine/:enquiryId',
        views: {
            mainsection: {
                templateUrl: 'uiviews/questionset.tpl.html'
            }
        }
    });

    $stateProvider.state('questionset', {
        url: '/:businessLine',
        views: {
            mainsection: {
                templateUrl: 'uiviews/questionset.tpl.html'
            }
        }
    });

    $stateProvider.state('404', {
        url: '*route',
        views: {
            mainsection: {
                template: '<div class="jumbotron">' +
                    '<div class="container text-center">' +
                    '<h1>Mr Superman No Home</h1>' +
                    '<p>' +
                    '<img src="https://bobtheunicorn069.files.wordpress.com/2013/05/20130530-135206.jpg">' +
                    '<br>' +
                    '<a class="btn btn-primary btn-lg" href="#" role="button">Go Home!</a> ' +
                    '</p>' +
                    '</div>' +
                    '</div>'
            }
        }
    });
});
