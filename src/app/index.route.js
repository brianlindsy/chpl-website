(function () {
    'use strict';

    angular
        .module('chpl')
        .config(routeConfig);

    function routeConfig ($routeProvider) {
        $routeProvider
            .when('/admin/:section?/:subSection?/:productId?', {
                templateUrl: 'app/admin/admin.html',
                controller: 'AdminController',
                controllerAs: 'vm',
                title: 'CHPL Administration',
            })
            .when('/charts', {
                controller: 'ChartsController',
                controllerAs: 'vm',
                templateUrl: 'app/charts/charts.html',
                title: 'CHPL Charts',
            })
            .when('/collections/apiDocumentation', {
                controller: 'ApiDocumentationController',
                controllerAs: 'vm',
                templateUrl: 'app/collections/apiDocumentation/apiDocumentation.html',
                title: 'API Information for 2015 Edition Products',
            })
            .when('/collections/correctiveAction', {
                controller: 'CorrectiveActionController',
                controllerAs: 'vm',
                templateUrl: 'app/collections/correctiveAction/correctiveAction.html',
                title: 'Products: Corrective Action Status',
            })
            .when('/collections/developers', {
                controller: 'BannedDevelopersController',
                controllerAs: 'vm',
                templateUrl: 'app/collections/developers/developers.html',
                title: 'Banned Developers',
            })
            .when('/collections/inactive', {
                controller: 'InactiveCertificatesController',
                controllerAs: 'vm',
                templateUrl: 'app/collections/inactive/inactive.html',
                title: 'Inactive Certificates',
            })
            .when('/collections/products', {
                controller: 'DecertifiedProductsController',
                controllerAs: 'vm',
                templateUrl: 'app/collections/products/products.html',
                title: 'Decertified Products',
            })
            .when('/collections/sed', {
                controller: 'SedCollectionController',
                controllerAs: 'vm',
                templateUrl: 'app/collections/sed/sed.html',
                title: 'SED Information for 2014 &amp; 2015 Edition Products',
            })
            .when('/collections/transparencyAttestations', {
                controller: 'TransparencyAttestationsController',
                controllerAs: 'vm',
                templateUrl: 'app/collections/transparencyAttestations/transparencyAttestations.html',
                title: 'Transparency Attestations',
            })
            .when('/compare/:compareIds', {
                controller: 'CompareController',
                controllerAs: 'vm',
                templateUrl: 'app/compare/compare.html',
                title: 'CHPL Product Comparison',
            })
            .when('/product/:id/:initialPanel?', {
                templateUrl: 'app/product/product.html',
                controller: 'ProductController',
                controllerAs: 'vm',
                title: 'CHPL Product Details',
            })
            .when('/registration/create-user/:hash', {
                templateUrl: 'app/registration/create-user.html',
                controller: 'CreateController',
                controllerAs: 'vm',
                title: 'CHPL Registration',
            })
            .when('/registration/confirm-user/:hash', {
                templateUrl: 'app/registration/confirm-user.html',
                controller: 'ConfirmController',
                controllerAs: 'vm',
                title: 'CHPL Registration',
            })
            .when('/resources/chpl_api', {
                templateUrl: 'app/resources/chpl_api/chpl_api.html',
                controller: 'ChplApiController',
                controllerAs: 'vm',
                title: 'CHPL API',
            })
            .when('/resources/cms_lookup', {
                templateUrl: 'app/resources/cms_lookup/cms_lookup.html',
                controller: 'CmsLookupController',
                controllerAs: 'vm',
                title: 'CMS ID Reverse Lookup',
            })
            .when('/resources/download', {
                templateUrl: 'app/resources/download/download.html',
                controller: 'DownloadController',
                controllerAs: 'vm',
                title: 'Download the CHPL',
            })
            .when('/resources/overview', {
                templateUrl: 'app/resources/overview/overview.html',
                controller: 'OverviewController',
                controllerAs: 'vm',
                title: 'CHPL Overview',
            })
            .when('/search', {
                controller: 'SearchController',
                controllerAs: 'vm',
                templateUrl: 'app/search/search.html',
                title: 'CHPL Search',
            })
            .otherwise({
                redirectTo: '/search',
            });
    }
})();
