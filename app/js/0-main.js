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

angular.module('QMetric.internal.questionsetPOC').config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when('', function($state) {
        $state.go('homepage', {}, { location: 'replace' });
        return true;
    });

    $stateProvider.state('homepage', {
        url: '/',
        views: {
            mainsection: {
                template: '<div class="jumbotron">' +
                    '<div class="container">' +
                    '<h1>...why not?</h1>' +
                    '<p>Angular + Bootstrap PoC</p>' +
                    '<h3>Website:</h3>' +
                    '<p>' +
                    '<a class="btn btn-primary btn-lg" href="#/Home" role="button">Home</a> ' +
                    '<a class="btn btn-primary btn-lg" href="#/Car" role="button">Car</a>' +
                    '</p>' +
                    '<h3>Backoffice:</h3>' +
                    '<p>' +
                    '<a class="btn btn-primary btn-lg" href="#/backoffice/Home" role="button">Home</a> ' +
                    '<a class="btn btn-primary btn-lg" href="#/backoffice/Car" role="button">Car</a> ' +
                    '<a class="btn btn-primary btn-lg" href="#/backoffice/search" role="button">Search</a>' +
                    '</p>' +
                    '</div>' +
                    '</div>'
            }
        }
    });

    $stateProvider.state('backofficeSearch', {
        url: '/backoffice/search?query',
        views: {
            mainsection: {
                templateUrl: 'uiviews/backoffice/search.tpl.html'
            }
        }
    });

    $stateProvider.state('backofficeBasket', {
        url: '/backoffice/basket/:sessionId',
        views: {
            mainsection: {
                templateUrl: 'uiviews/backoffice/basket.tpl.html'
            }
        }
    });

    $stateProvider.state('backofficePolicyDetail', {
        url: '/backoffice/policy-detail/:policyId',
        views: {
            mainsection: {
                templateUrl: 'uiviews/backoffice/policyDetails.tpl.html'
            }
        }
    });

    $stateProvider.state('backofficeOrders', {
        url: '/backoffice/orders/:sessionId/:orderId',
        views: {
            mainsection: {
                templateUrl: 'uiviews/backoffice/orders.tpl.html'
            }
        }
    });

    $stateProvider.state('backofficeQuotes', {
        url: '/backoffice/quotes/:sessionId/:enquiryIndex',
        views: {
            mainsection: {
                templateUrl: 'uiviews/backoffice/quotes.tpl.html'
            }
        }
    });

    $stateProvider.state('backofficeAmendEnquiry', {
        url: '/backoffice/amendEnquiry/:sessionId/:enquiryIndex',
        views: {
            mainsection: {
                templateUrl: 'uiviews/backoffice/questionset.tpl.html'
            }
        }
    });

    $stateProvider.state('backofficeQuestionset', {
        url: '/backoffice/:businessLine',
        views: {
            mainsection: {
                templateUrl: 'uiviews/backoffice/questionset.tpl.html'
            }
        }
    });

    $stateProvider.state('quotes', {
        url: '/quotes/:businessLine/:enquiryId/:sequence',
        views: {
            mainsection: {
                templateUrl: 'uiviews/website/quotes.tpl.html'
            }
        }
    });

    $stateProvider.state('amendEnquiry', {
        url: '/:businessLine/:enquiryId',
        views: {
            mainsection: {
                templateUrl: 'uiviews/website/questionset.tpl.html'
            }
        }
    });

    $stateProvider.state('questionset', {
        url: '/:businessLine',
        views: {
            mainsection: {
                templateUrl: 'uiviews/website/questionset.tpl.html'
            }
        }
    });

    $stateProvider.state('404', {
        url: '*route',
        views: {
            mainsection: {
                template: '<div class="container text-center">' +
                    '<img src="https://http.cat/404.jpg">' +
                    '</div>'
            }
        }
    });
});
