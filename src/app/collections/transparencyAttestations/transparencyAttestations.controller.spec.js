(function () {
    'use strict';

    describe('chpl.collections.transparencyAttestations.controller', function () {

        var $log, commonService, scope, vm;

        beforeEach(function () {
            module('chpl.collections', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    return $delegate;
                });
            });

            inject(function ($controller, _$log_, $rootScope, _commonService_) {
                $log = _$log_;
                commonService = _commonService_;

                scope = $rootScope.$new();
                vm = $controller('TransparencyAttestationsController', {
                    $scope: scope,
                    commonService: commonService,
                });
                scope.$digest();
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                //console.log('Debug log, ' + $log.debug.logs.length + ' length:\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        it('should exist', function () {
            expect(vm).toBeDefined();
        });
    });
})();
