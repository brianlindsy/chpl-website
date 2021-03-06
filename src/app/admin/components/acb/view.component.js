export const AcbManagementComponent = {
    templateUrl: 'chpl.admin/components/acb/view.html',
    bindings: {
        workType: '@',
        acb: '<',
    },
    controller: class AcbManagementController {
        constructor ($log, $uibModal, authService) {
            'ngInject'
            this.$log = $log;
            this.$uibModal = $uibModal;
            this.authService = authService;
        }

        $onChanges (changes) {
            if (changes.acb) {
                this.acb = angular.copy(changes.acb.currentValue);
                this.workType = 'acb';
            }
        }

        $onInit () {
            this.isAcbAdmin = this.authService.isAcbAdmin();
            this.isChplAdmin = this.authService.isChplAdmin();
            if (!this.workType) {
                this.workType = 'acb';
            }
        }

        createAcb () {
            const isChplAdmin = this.isChplAdmin;
            this.modalInstance = this.$uibModal.open({
                templateUrl: 'chpl.admin/components/acb/modal.html',
                controller: 'ModalAcbController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    acb: () => ({ }),
                    action: () => 'create',
                    isChplAdmin: () => isChplAdmin,
                },
            });
            this.modalInstance.result.then(result => { this.acb = angular.copy(result); });
        }

        editAcb (acb) {
            const isChplAdmin = this.isChplAdmin;
            this.modalInstance = this.$uibModal.open({
                templateUrl: 'chpl.admin/components/acb/modal.html',
                controller: 'ModalAcbController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    acb: () => acb,
                    action: () => 'edit',
                    isChplAdmin: () => isChplAdmin,
                },
            });
            this.modalInstance.result.then(result => { this.acb = angular.copy(result); });
        }
    },
}

angular.module('chpl.admin')
    .component('aiAcbManagement', AcbManagementComponent);
