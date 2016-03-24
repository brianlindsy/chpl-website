;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('ReportController', ['$log', '$filter', 'commonService', 'authService', function($log, $filter, commonService, authService) {
            var vm = this;
            vm.isAcbAdmin = authService.isAcbAdmin();
            vm.isChplAdmin = authService.isChplAdmin();
            vm.tab = 'cp';
            vm.activityRange = 7;

            vm.refreshActivity = refreshActivity;
            vm.changeTab = changeTab;
            vm.refreshCp = refreshCp;
            vm.refreshDeveloper = refreshDeveloper;
            vm.refreshProduct = refreshProduct;
            vm.refreshAcb = refreshAcb;
            vm.refreshAtl = refreshAtl;
            vm.refreshAnnouncement = refreshAnnouncement;
            vm.refreshUser = refreshUser;
            vm.refreshApi = refreshApi;
            vm.refreshVisitors = refreshVisitors;

            activate();

            ////////////////////////////////////////////////////////////////////
            // Functions

            function activate () {
                vm.visibleApiPage = 1;
                vm.apiKeyPageSize = 100;
                vm.refreshActivity();
                vm.refreshVisitors();
            }

            function refreshActivity () {
                vm.refreshCp();
                vm.refreshDeveloper();
                vm.refreshProduct();
                vm.refreshAcb();
                vm.refreshAtl();
                vm.refreshAnnouncement();
                vm.refreshUser();
                vm.refreshApi();
            }

            function refreshCp () {
                commonService.getCertifiedProductActivity(vm.activityRange)
                    .then(function (data) {
                        vm.searchedCertifiedProducts = interpretCps(data);
                        vm.displayedCertifiedProducts = [].concat(vm.searchedCertifiedProducts);
                    });
            }

            function refreshDeveloper () {
                commonService.getDeveloperActivity(vm.activityRange)
                    .then(function (data) {
                        vm.searchedDevelopers = vm.interpretDevelopers(data);
                        vm.displayedDevelopers = [].concat(vm.searchedDevelopers);
                    });
            }

            function refreshProduct () {
                commonService.getProductActivity(vm.activityRange)
                    .then(function (data) {
                        vm.searchedProducts = vm.interpretProducts(data);
                        vm.displayedProducts = [].concat(vm.searchedProducts);
                    });
            }

            function refreshAcb () {
                commonService.getAcbActivity(vm.activityRange)
                    .then(function (data) {
                        vm.searchedACBs = vm.interpretAcbs(data);
                        vm.displayedACBs = [].concat(vm.searchedACBs);
                    });
            }

            function refreshAtl () {
                commonService.getAtlActivity(vm.activityRange)
                    .then(function (data) {
                        vm.searchedATLs = vm.interpretAtls(data);
                        vm.displayedATLs = [].concat(vm.searchedATLs);
                    });
            }

            function refreshAnnouncement () {
                commonService.getAnnouncementActivity(vm.activityRange)
                    .then(function (data) {
                        vm.searchedAnnouncements = vm.interpretAnnouncements(data);
                        vm.displayedAnnouncements = [].concat(vm.searchedAnnouncements);
                    });
            }

            function refreshUser () {
                if (vm.isChplAdmin) {
                    commonService.getUserActivity(vm.activityRange)
                        .then(function (data) {
                            vm.searchedUsers = vm.interpretUsers(data);
                            vm.displayedUsers = [].concat(vm.searchedUsers);
                        });
                    commonService.getUserActivities(vm.activityRange)
                        .then(function (data) {
                            vm.searchedUserActivities = vm.interpretUserActivities(data);
                            vm.displayedUserActivities = [].concat(vm.searchedUserActivities);
                        });
                }
            }

            function refreshApi () {
                if (vm.isChplAdmin) {
                    commonService.getApiUserActivity(vm.activityRange)
                        .then(function (data) {
                            vm.searchedApiActivity = data;
                            vm.displayedApiActivity = [].concat(vm.searchedApiActivity);
                        });
                    vm.apiKeyPageNum = vm.visibleApiPage - 1;
                    commonService.getApiActivity(vm.apiKeyPageNum,vm.apiKeyPageSize)
                        .then(function (data) {
                            vm.searchedApi = data;
                        });
                }
            }

            function refreshVisitors () {
                commonService.externalApiCall('https://openchpl.appspot.com/query?id=agpzfm9wZW5jaHBschULEghBcGlRdWVyeRiAgICAvKGCCgw&format=data-table','')
                    .then(function (data) {
                        vm.browserVariety.data = data;
                    });
                commonService.externalApiCall('https://openchpl.appspot.com/query?id=agpzfm9wZW5jaHBschULEghBcGlRdWVyeRiAgICA2uOGCgw&format=data-table','')
                    .then(function (data) {
                        vm.country.data = data;
                        vm.map.data = data;
                    });
                commonService.externalApiCall('https://openchpl.appspot.com/query?id=agpzfm9wZW5jaHBschULEghBcGlRdWVyeRiAgICAmdKFCgw&format=data-table','')
                    .then(function (data) {
                        vm.cities.data = data;
                        vm.cityMap.data = data;
                    });
                commonService.externalApiCall('https://openchpl.appspot.com/query?id=agpzfm9wZW5jaHBschULEghBcGlRdWVyeRiAgICA7bGDCgw&format=data-table','')
                    .then(function (data) {
                        data.cols[0].type = 'date';
                        var date;
                        for (var i = 0; i < data.rows.length; i++) {
                            date = data.rows[i].c[0].v;
                            data.rows[i].c[0].v = new Date(date.substring(0,4),
                                                           parseInt(date.substring(4,6)) - 1,
                                                           date.substring(6,8));
                        }
                        vm.traffic.data = data;
                    });
            }

            function changeTab(newTab) {
                switch (newTab) {
                case 'cp':
                    vm.refreshCp();
                    break;
                case 'dev':
                    vm.refreshDeveloper();
                    break;
                case 'prod':
                    vm.refreshProduct();
                    break;
                case 'acb':
                    vm.refreshAcb();
                    break;
                case 'users':
                    vm.refreshUser();
                    break;
                case 'visitors':
                    vm.refreshVisitors();
                    break;
                }
                vm.tab = newTab;
            }

            ////////////////////////////////////////////////////////////////////
            // Chart options

            vm.browserVariety = {
                type: 'PieChart',
                options: {
                    is3D: true,
                    title: 'Visitors by browser (last 7 days)'
                }
            };
            vm.cities = {
                type: 'PieChart',
                options: {
                    is3D: true,
                    title: 'Visitors by city (last 7 days)'
                }
            };
            vm.country = {
                type: 'PieChart',
                options: {
                    is3D: true,
                    title: 'Visitors by country (last 7 days)'
                }
            };
            vm.traffic = {
                type: 'LineChart',
                options: {
                    legend: { position: 'none' },
                    hAxis: {
                        slantedText: true
                    },
                    title: 'Visitors for the last 14 days'
                }
            };
            vm.map = {
                type: 'GeoChart',
                options: {
                }
            };
            vm.cityMap = {
                type: 'GeoChart',
                options: {
                    region: 'US',
                    displayMode: 'markers'
                }
            };

            ////////////////////////////////////////////////////////////////////
            // Helper functions

            function interpretCps (data) {
                var simpleCpFields = [
                    {key: 'acbCertificationId', display: 'ACB Certification ID'},
                    {key: 'accessibilityCertified', display: 'accessibilityCertified'},
                    {key: 'additionalSoftwareCode', display: 'additionalSoftwareCode'},
                    {key: 'apiDocumentation', display: 'apiDocumentation'},
                    {key: 'certificationBodyId', display: 'certificationBodyId'},
                    {key: 'certificationDate', display: 'Certification Date', filter: 'date'},
                    {key: 'certificationEditionId', display: 'certificationEditionId'},
                    {key: 'certificationStatusId', display: 'certificationStatusId'},
                    {key: 'certifiedDateCode', display: 'certifiedDateCode'},
                    {key: 'chplProductNumber', display: 'CHPL Product Number'},
                    {key: 'chplProductNumberForActivity', display: 'chplProductNumberForActivity'},
                    {key: 'creationDate', display: 'creationDate', filter: 'date'},
                    {key: 'deleted', display: 'deleted'},
                    {key: 'ics', display: 'ics'},
                    {key: 'icsCode', display: 'icsCode'},
                    {key: 'id', display: 'id'},
                    {key: 'lastModifiedDate', display: 'lastModifiedDate', filter: 'date'},
                    {key: 'lastModifiedUser', display: 'lastModifiedUser'},
                    {key: 'otherAcb', display: 'otherAcb'},
                    {key: 'practiceTypeId', display: 'practiceTypeId'},
                    {key: 'productAdditionalSoftware', display: 'productAdditionalSoftware'},
                    {key: 'productClassificationTypeId', display: 'productClassificationTypeId'},
                    {key: 'productCode', display: 'productCode'},
                    {key: 'productVersionId', display: 'productVersionId'},
                    {key: 'qmsTesting', display: 'qmsTesting'},
                    {key: 'reportFileLocation', display: 'ATL Test Report File Location'},
                    {key: 'sedIntendedUserDescription', display: 'sedIntendedUserDescription'},
                    {key: 'sedReportFileLocation', display: 'sedReportFileLocation'},
                    {key: 'sedTesting', display: 'sedTesting'},
                    {key: 'sedTestingEnd', display: 'sedTestingEnd'},
                    {key: 'termsOfUse', display: 'termsOfUse'},
                    {key: 'testingLabId', display: 'testingLabId'},
                    {key: 'transparencyAttestation', display: 'transparencyAttestation'},
                    {key: 'transparencyAttestationUrl', display: 'transparencyAttestationUrl'},
                    {key: 'versionCode', display: 'versionCode'},
                    {key: 'visibleOnChpl', display: 'Visible on CHPL'}
                ];
                var ret = [];
                var change;

                for (var i = 0; i < data.length; i++) {
                    var activity = {
                        date: data[i].activityDate,
                        newId: data[i].id
                    };
                    if (data[i].description === 'Created a certified product') {
                        activity.action = 'Created certified product <a href="#/product/' + data[i].newData.id + '">' + data[i].newData.chplProductNumber + '</a>';
                    } else if (data[i].description.substring(0,7) === 'Updated') {
                        activity.action = 'Updated certified product <a href="#/product/' + data[i].newData.id + '">' + data[i].newData.chplProductNumber + '</a>';
                        activity.details = [];
                        for (var j = 0; j < simpleCpFields.length; j++) {
                            change = compareItem(data[i].originalData, data[i].newData, simpleCpFields[j].key, simpleCpFields[j].display, simpleCpFields[j].filter);
                            if (change) activity.details.push(change);
                        }
                        if (activity.details.length === 0) delete activity.details;
                    } else if (data[i].description.substring(0,14) === 'Certifications') {
                        activity.action = 'Updated certifications for certified product <a href="#/product/' + data[i].newData.id + '">' + data[i].newData.chplProductNumber + '</a>';
                        activity.details = [];
                        for (var j = 0; j < simpleCpFields.length; j++) {
                            change = compareItem(data[i].originalData, data[i].newData, simpleCpFields[j].key, simpleCpFields[j].display, simpleCpFields[j].filter);
                            if (change) activity.details.push(change);
                        }
                        var certChanges = compareCerts(data[i].originalData.certificationResults, data[i].newData.certificationResults);
                        for (var j = 0; j < certChanges.length; j++) {
                            activity.details.push('Certification "' + certChanges[j].number + '" changes<ul>' + certChanges[j].changes.join('') + '</ul>');
                        }
                        if (activity.details.length === 0) delete activity.details;
                    } else {
                        activity.action = data[i].description;
                    }
                    ret.push(activity);
                }
                return ret;
            }

            function compareCerts (prev, curr) {
                var ret = [];
                var change;
                var certKeys = [
                    {key: 'apiDocumentation', display: 'apiDocumentation'},
                    {key: 'g1Success', display: 'g1Success'},
                    {key: 'g2Success', display: 'g2Success'},
                    {key: 'gap', display: 'gap'},
                    {key: 'number', display: 'number'},
                    {key: 'privacySecurityFramework', display: 'privacySecurityFramework'},
                    {key: 'sed', display: 'sed'},
                    {key: 'success', display: 'success'},
                    {key: 'title', display: 'title'}
                ];
                prev.sort(function(a,b) {return (a.number > b.number) ? 1 : ((b.number > a.number) ? -1 : 0);} );
                curr.sort(function(a,b) {return (a.number > b.number) ? 1 : ((b.number > a.number) ? -1 : 0);} );
                for (var i = 0; i < prev.length; i++) {
                    var obj = { number: curr[i].number, changes: [] };
                    for (var j = 0; j < certKeys.length; j++) {
                        change = compareItem(prev[i], curr[i], certKeys[j].key, certKeys[j].display, certKeys[j].filter);
                        if (change) obj.changes.push('<li>' + change + '</li>');
                    }
                    var addlSwChanges = compareAddlSw(prev[i].additionalSoftware, curr[i].additionalSoftware);
                    for (var j = 0; j < addlSwChanges.length; j++) {
                        obj.changes.push('<li>Additional software "' + addlSwChanges[j].name + '" changes<ul>' + addlSwChanges[j].changes.join('') + '</ul></li>');
                    }
                    if (obj.changes.length > 0)
                        ret.push(obj);
                }
                return ret;
            }

            function compareAddlSw (prev, curr) {
                var ret = [];
                var change;
                var keys = [
                    {key: 'version', display: 'version'},
                    {key: 'grouping', display: 'grouping'},
                    {key: 'certifiedProductNumber', display: 'certifiedProductNumber'},
                    {key: 'justification', display: 'justification'}
                ];
                for (var i = 0; i < prev.length; i++) {
                    for (var j = 0; j < curr.length; j++) {
                        var obj = { name: curr[j].name, changes: [] };
                        if (prev[i].name === curr[j].name) {
                            for (var k = 0; k < keys.length; k++) {
                                change = compareItem(prev[i], curr[j], keys[k].key, keys[k].display);
                                if (change) obj.changes.push('<li>' + change + '</li>');
                            }
                            prev[i].evaluated = true;
                            curr[j].evaluated = true;
                        }
                        if (obj.changes.length > 0)
                            ret.push(obj);
                    }
                    if (!prev[i].evaluated) {
                        ret.push({ name: prev[i].name, changes: ['<li>' + prev[i].name + ' removed</li>']});
                    }
                }
                for (var i = 0; i < curr.length; i++) {
                    if (!curr[i].evaluated) {
                        ret.push({ name: curr[i].name, changes: ['<li>' + curr[i].name + ' added</li>']});
                    }
                }
                return ret;
            }

            vm.interpretDevelopers = function (data) {
                var ret = [];
                var change;

                for (var i = 0; i < data.length; i++) {
                    var activity = {date: data[i].activityDate};
                    if (data[i].originalData && !Array.isArray(data[i].originalData) && data[i].newData) { // both exist, originalData not an array: update
                        activity.name = data[i].newData.name;
                        activity.action = 'Update:<ul>';
                        change = compareItem(data[i].originalData, data[i].newData, 'name', 'Name');
                        if (change) activity.action += '<li>' + change + '</li>';
                        change = compareItem(data[i].originalData, data[i].newData, 'website', 'Website');
                        if (change) activity.action += '<li>' + change + '</li>';
                        vm.analyzeAddress(activity, data[i]);
                        activity.action += '</ul>';
                    } else {
                        vm.interpretNonUpdate(activity, data[i], 'developer');
                    }
                    ret.push(activity);
                }
                return ret;
            };

            vm.interpretProducts = function (data) {
                var ret = [];
                var change;

                for (var i = 0; i < data.length; i++) {
                    var activity = {date: data[i].activityDate};
                    if (data[i].originalData && !Array.isArray(data[i].originalData) && data[i].newData) { // both exist, originalData not an array: update
                        activity.name = data[i].newData.name;
                        activity.action = 'Update:<ul>';
                        change = compareItem(data[i].originalData, data[i].newData, 'name', 'Name');
                        if (change) activity.action += '<li>' + change + '</li>';
                        // check on developerId change
                        activity.action += '</ul>';
                    } else {
                        vm.interpretNonUpdate(activity, data[i], 'product');
                    }
                    ret.push(activity);
                }
                return ret;
            };

            vm.interpretAcbs = function (data) {
                var ret = [];
                var change;

                for (var i = 0; i < data.length; i++) {
                    var activity = {date: data[i].activityDate};
                    if (data[i].originalData && !Array.isArray(data[i].originalData) && data[i].newData) { // both exist, originalData not an array: update
                        activity.name = data[i].newData.name;
                        if (data[i].originalData.deleted !== data[i].newData.deleted) {
                            activity.action = data[i].newData.deleted ? 'ACB was deleted' : 'ACB was restored';
                        } else {
                            activity.action = 'Update:<ul>';
                            change = compareItem(data[i].originalData, data[i].newData, 'name', 'Name');
                            if (change) activity.action += '<li>' + change + '</li>';
                            change = compareItem(data[i].originalData, data[i].newData, 'website', 'Website');
                            if (change) activity.action += '<li>' + change + '</li>';
                            vm.analyzeAddress(activity, data[i]);
                            activity.action += '</ul>';
                        }
                    } else {
                        vm.interpretNonUpdate(activity, data[i], 'ACB');
                    }
                    ret.push(activity);
                }
                return ret;
            };

            vm.interpretAtls = function (data) {
                var ret = [];
                var change;

                for (var i = 0; i < data.length; i++) {
                    var activity = {date: data[i].activityDate};
                    if (data[i].originalData && !Array.isArray(data[i].originalData) && data[i].newData) { // both exist, originalData not an array: update
                        activity.name = data[i].newData.name;
                        if (data[i].originalData.deleted !== data[i].newData.deleted) {
                            activity.action = data[i].newData.deleted ? 'ATL was deleted' : 'ATL was restored';
                        } else {
                            activity.action = 'Update:<ul>';
                            change = compareItem(data[i].originalData, data[i].newData, 'name', 'Name');
                            if (change) activity.action += '<li>' + change + '</li>';
                            change = compareItem(data[i].originalData, data[i].newData, 'website', 'Website');
                            if (change) activity.action += '<li>' + change + '</li>';
                            vm.analyzeAddress(activity, data[i]);
                            activity.action += '</ul>';
                        }
                    } else {
                        vm.interpretNonUpdate(activity, data[i], 'ATL');
                    }
                    ret.push(activity);
                }
                return ret;
            };

            vm.interpretAnnouncements = function (data) {
                var ret = data;
                return ret;
            };

            vm.interpretUsers = function (data) {
                var ret = data;
                return ret;
            };

            vm.interpretUserActivities = function (data) {
                return data;
            };

            vm.interpretNonUpdate = function (activity, data, text) {
                if (data.originalData && !data.newData) { // no new data: deleted
                    activity.name = data.originalData.name;
                    activity.action = [activity.name + ' has been deleted'];
                }
                if (!data.originalData && data.newData) { // no old data: created
                    activity.name = data.newData.name;
                    activity.action = [activity.name + ' has been created'];
                }
                if (data.originalData && data.originalData.length > 1 && data.newData) { // both exist, more than one originalData: merge
                    activity.name = data.newData.name;
                    activity.action = ['Merged ' + data.originalData.length + ' ' + text + 's to form ' + text + ': ' + activity.name];
                }
            };

            vm.analyzeAddress = function (activity, data) {
                if (data.originalData.address !== data.newData.address) {
                    var change;
                    activity.action += '<li>Address changed:<ul>';
                    change = compareItem(data.originalData.address, data.newData.address, 'streetLineOne', 'Street Line 1');
                    if (change) activity.action += '<li>' + change + '</li>';
                    change = compareItem(data.originalData.address, data.newData.address, 'streetLineTwo', 'Street Line 2');
                    if (change) activity.action += '<li>' + change + '</li>';
                    change = compareItem(data.originalData.address, data.newData.address, 'city', 'City');
                    if (change) activity.action += '<li>' + change + '</li>';
                    change = compareItem(data.originalData.address, data.newData.address, 'state', 'State');
                    if (change) activity.action += '<li>' + change + '</li>';
                    change = compareItem(data.originalData.address, data.newData.address, 'zipcode', 'Zipcode');
                    if (change) activity.action += '<li>' + change + '</li>';
                    change = compareItem(data.originalData.address, data.newData.address, 'country', 'Country');
                    if (change) activity.action += '<li>' + change + '</li>';
                    activity.action += '</ul></li>';
                }
            };

            function compareItem (oldData, newData, key, display, filter) {
                if (oldData && oldData[key] && newData && newData[key] && oldData[key] !== newData[key]) {
                    if (filter)
                        return display + ' changed from ' + $filter(filter)(oldData[key]) + ' to ' + $filter(filter)(newData[key]);
                    else
                        return display + ' changed from ' + oldData[key] + ' to ' + newData[key];
                }
                if ((!oldData || !oldData[key]) && newData && newData[key]) {
                    if (filter)
                        return display + ' added: ' + $filter(filter)(newData[key]);
                    else
                        return display + ' added: ' + newData[key];
                }
                if (oldData && oldData[key] && (!newData || !newData[key])) {
                    if (filter)
                        return display + ' removed. Was: ' + $filter(filter)(oldData[key]);
                    else
                        return display + ' removed. Was: ' + oldData[key];
                }
            }

        }])
        .directive('aiReports', function () {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'admin/components/reports.html',
                bindToController: { workType: '='},
                scope: {triggerRefresh: '&'},
                controllerAs: 'vm',
                controller: 'ReportController',
                link: function (scope, element, attr, ctrl) {
                    var handler = scope.triggerRefresh({
                        handler: function () {
                            ctrl.refreshActivity();
                        }
                    });
                    scope.$on('$destroy', handler);
                }
            };
        });
})();
