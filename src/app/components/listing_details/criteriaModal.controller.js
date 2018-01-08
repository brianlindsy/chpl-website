(function () {
    'use strict';

    angular.module('chpl')
        .controller('EditCertificationCriteriaController', EditCertificationCriteriaController);

    /** @ngInject */
    function EditCertificationCriteriaController ($log, $uibModal, $uibModalInstance, cert, hasIcs, resources, utilService) {
        var vm = this;

        vm.addNewValue = utilService.addNewValue;
        vm.cancel = cancel;
        vm.extendSelect = utilService.extendSelect;
        vm.isToolAvailable = isToolAvailable;
        vm.save = save;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.certSave = angular.copy(cert);
            vm.cert = cert;
            vm.options = [
                {name: 'True', value: true},
                {name: 'False', value: false},
                {name: 'N/A', value: null},
            ];
            vm.allMeasures = [
                {abbreviation: 'MD'},
                {abbreviation: 'LP'},
            ];
            vm.cert.metViaAdditionalSoftware = vm.cert.additionalSoftware && vm.cert.additionalSoftware.length > 0;
            vm.hasIcs = hasIcs;
            vm.resources = resources;
            _getAvailableTestOptions();
        }

        function cancel () {
            vm.cert = angular.copy(vm.certSave);
            $uibModalInstance.dismiss('cancelled');
        }

        function isToolAvailable (tool) {
            return vm.hasIcs || !tool.retired;
        }

        function save () {
            $uibModalInstance.close();
        }

        ////////////////////////////////////////////////////////////////////

        function _getAvailableTestOptions () {
            vm.availableTestProcedures = vm.resources.testProcedures.data
                .filter(function (procedure) {
                    return procedure.criteria.number === vm.cert.number;
                });
            vm.availableTestData = vm.resources.testData.data
                .filter(function (data) {
                    return data.criteria.number === vm.cert.number;
                });
        }
    }
})();
