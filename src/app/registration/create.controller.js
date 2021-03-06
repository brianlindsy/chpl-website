var zxcvbn = require('zxcvbn');
window.zxcvbn = zxcvbn;

(function () {
    'use strict';

    angular.module('chpl.registration')
        .controller('CreateController', CreateController);

    /** @ngInject */
    function CreateController ($location, $log, $stateParams, authService, networkService, utilService) {
        var vm = this;

        vm.authorizeUser = authorizeUser;
        vm.changeDisplayMode = changeDisplayMode;
        vm.createUser = createUser;
        vm.isAuthed = isAuthed;
        vm.isCreateAccountMode = isCreateAccountMode;
        vm.isCreateAccountSuccessMode = isCreateAccountSuccessMode;
        vm.isSignInMode = isSignInMode;
        vm.misMatchPasswords = misMatchPasswords;
        vm.passwordClass = utilService.passwordClass;
        vm.passwordTitle = utilService.passwordTitle;
        vm.setExtras = setExtras;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.userDetails = {user: {
                complianceTermsAccepted: true,
            }};
            vm.authorizeDetails = {};
            vm.userDetails.hash = $stateParams.hash;
            vm.authorizeDetails.hash = $stateParams.hash;
            vm.message = {value: '', success: null};
            if (vm.isAuthed) {
                vm.authorizeUser();
            }
            vm.extras = ['chpl'];
            changeDisplayMode('SIGN-IN');
        }

        function authorizeUser () {
            if ((vm.authorizeDetails.userName && vm.authorizeDetails.password) || vm.isAuthed()
                && vm.authorizeDetails.hash) {
                const username = vm.authorizeDetails.userName || authService.getUsername();
                networkService.authorizeUser(vm.authorizeDetails, username)
                    .then(function () {
                        $location.path('/admin');
                    },function (error) {
                        vm.message.value = error.data.error;
                        vm.authorizeDetails = {};
                        vm.authorizeUserForm.$setPristine();
                        vm.authorizeUserForm.$setUntouched();
                        vm.message.success = false;
                    });
            }
        }

        function changeDisplayMode (mode) {
            vm.displayMode = mode;
        }

        function createUser () {
            if (vm.validateUser()) {
                vm.userDetails.user.complianceTermsAccepted = true;
                networkService.createInvitedUser(vm.userDetails)
                    .then(function () {
                        vm.message.value = 'Your account has been created. Please check your email to confirm your account';
                        vm.userDetails = {user: {}};
                        changeDisplayMode('CREATE-ACCOUNT-SUCCESS');
                    },function (error) {
                        vm.message.value = error.data.errorMessages;
                    });
            }
        }

        function isAuthed () {
            return authService.isAuthed();
        }

        function isCreateAccountMode () {
            return vm.displayMode === 'CREATE-ACCOUNT';
        }

        function isCreateAccountSuccessMode () {
            return vm.displayMode === 'CREATE-ACCOUNT-SUCCESS';
        }

        function isSignInMode () {
            return vm.displayMode === 'SIGN-IN';
        }

        function misMatchPasswords () {
            return vm.userDetails.user.password !== vm.userDetails.user.passwordverify;
        }

        vm.validateUser = function () {
            var valid = true;
            valid = valid && vm.userDetails.hash && vm.userDetails.hash.length > 0;
            valid = valid && vm.userDetails.user.subjectName && vm.userDetails.user.subjectName.length > 0;
            valid = valid && vm.userDetails.user.password && vm.userDetails.user.password.length > 0;
            valid = valid && vm.userDetails.user.fullName && vm.userDetails.user.fullName.length > 0;
            valid = valid && vm.userDetails.user.email && vm.userDetails.user.email.length > 0;
            valid = valid && vm.userDetails.user.phoneNumber && vm.userDetails.user.phoneNumber.length > 0;
            valid = valid && vm.userDetails.user.password === vm.userDetails.user.passwordverify;
            return valid;
        };

        function setExtras () {
            let vals = ['chpl'];
            if (vm.userDetails.user.subjectName) { vals.push(vm.userDetails.user.subjectName); }
            if (vm.userDetails.user.fullName) { vals.push(vm.userDetails.user.fullName); }
            if (vm.userDetails.user.friendlyName) { vals.push(vm.userDetails.user.friendlyName); }
            if (vm.userDetails.user.email) { vals.push(vm.userDetails.user.email); }
            if (vm.userDetails.user.phoneNumber) { vals.push(vm.userDetails.user.phoneNumber); }
            vm.extras = vals;
        }
    }
})();
