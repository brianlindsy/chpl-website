export class NetworkService {
    constructor ($http, $log, $q, API) {
        'ngInject';
        this.$http = $http;
        this.$log = $log;
        this.$q = $q;
        this.API = API;
        this.store = {
            certifiedProducts: {
                data: undefined,
                lastUpdated: -1,
                details: { },
            },
            searchOptions: {
                data: undefined,
                lastUpdated: -1,
            },
        };
    }

    addRole (payload) {
        return this.apiPOST('/users/' + payload.subjectName + '/roles/' + payload.role);
    }

    authorizeUser (userAuthorization, username) {
        return this.apiPOST('/users/' + username + '/authorize', userAuthorization);
    }

    changePassword (userObj) {
        let url;
        if (userObj.userName && userObj.userName.length > 0) {
            url = '/auth/change_expired_password';
        } else {
            url = '/auth/change_password';
        }
        return this.apiPOST(url, userObj);
    }

    confirmPendingCp (pendingCp) {
        return this.apiPOST('/certified_products/pending/' + pendingCp.id + '/confirm', pendingCp);
    }

    confirmPendingSurveillance (surveillance) {
        return this.apiPOST('/surveillance/pending/confirm', surveillance);
    }

    confirmUser (userObject) {
        return this.apiPOST('/users/confirm', userObject);
    }

    createACB (acb) {
        return this.apiPOST('/acbs', acb);
    }

    createATL (atl) {
        return this.apiPOST('/atls', atl);
    }

    createAnnouncement (announcement) {
        return this.apiPOST('/announcements/create', announcement);
    }

    createCmsId (ids) {
        return this.apiPOST('/certification_ids?ids=' + ids.join(','), {});
    }

    createInvitedUser (contactDetails) {
        return this.apiPOST('/users/create', contactDetails);
    }

    createScheduleTrigger (trigger) {
        return this.apiPOST('/schedules/triggers', trigger);
    }

    deleteAnnouncement (announcementId) {
        return this.apiDELETE('/announcements/' + announcementId);
    }

    deleteScheduleTrigger (trigger) {
        return this.apiDELETE('/schedules/triggers/' + trigger.group + '/' + trigger.name);
    }

    deleteSurveillance (surveillanceId, reason) {
        return this.apiDELETE('/surveillance/' + surveillanceId, {
            reason: reason,
        });
    }

    deleteSurveillanceDocument (survId, docId) {
        return this.apiDELETE('/surveillance/' + survId + '/document/' + docId);
    }

    deleteUser (userId) {
        return this.apiDELETE('/users/' + userId);
    }

    getAcbActivity (activityRange) {
        var call = '/activity/acbs';
        return this.getActivity(call, activityRange);
    }

    getAcbs (editable) {
        return this.apiGET('/acbs?editable=' + editable);
    }

    getAccessibilityStandards () {
        return this.apiGET('/data/accessibility_standards');
    }

    getAgeRanges () {
        return this.apiGET('/data/age_ranges');
    }

    getAll () {
        const EXPIRATION_TIME = 5; // in minutes
        if (!this.store.certifiedProducts.data || (Date.now() - this.store.certifiedProducts.lastUpdated > (1000 * 60 * EXPIRATION_TIME))) {
            this.store.certifiedProducts.data = this.apiGET('/collections/certified_products');
            this.store.certifiedProducts.lastUpdated = Date.now();
        }
        return this.store.certifiedProducts.data;
    }

    getAnnouncement (announcementId) {
        return this.apiGET('/announcements/' + announcementId);
    }

    getAnnouncementActivity (activityRange) {
        var call = '/activity/announcements';
        return this.getActivity(call, activityRange);
    }

    getAnnouncements (pending) {
        return this.apiGET('/announcements?future=' + pending);
    }

    getApiActivity (options) {
        var params = [];
        var queryParams = '';
        if (angular.isDefined(options.pageNumber)) { params.push('pageNumber=' + options.pageNumber); }
        if (options.pageSize) { params.push('pageSize=' + options.pageSize); }
        if (options.startDate) { params.push('start=' + options.startDate.getTime()); }
        if (options.endDate) { params.push('end=' + options.endDate.getTime()); }
        if (options.dateAscending) { params.push('dateAscending=' + options.dateAscending); }
        if (options.filter) {
            var tmp = 'filter=';
            if (!options.showOnly) { tmp += '!' }
            tmp += options.filter
            params.push(tmp);
        }
        if (params.length > 0) { queryParams = '?' + params.join('&'); }
        return this.apiGET('/key/activity' + queryParams);
    }

    getApiDocumentationDate () {
        return this.apiGET('/files/api_documentation/details');
    }

    getApiUserActivity (activityRange) {
        var call = '/activity/api_keys';
        return this.getActivity(call, activityRange);
    }

    getApiUsers () {
        return this.apiGET('/key');
    }

    getAtlActivity (activityRange) {
        var call = '/activity/atls';
        return this.getActivity(call, activityRange);
    }

    getAtls (editable) {
        return this.apiGET('/atls?editable=' + editable);
    }

    getCertBodies () {
        return this.apiGET('/data/certification_bodies');
    }

    getCertificationStatuses () {
        return this.apiGET('/data/certification_statuses');
    }

    getCertifiedProductActivity (activityRange) {
        var call = '/activity/certified_products';
        return this.getActivity(call, activityRange);
    }

    getCriterionProductStatistics () {
        return this.apiGET('/statistics/criterion_product');
    }

    getCmsDownload () {
        return this.apiGET('/certification_ids');
    }

    getCmsId (key, includeCriteria) {
        return this.apiGET('/certification_ids/' + key + '?includeCriteria=' + (includeCriteria ? 'true' : 'false'));
    }

    getCmsIds (ids) {
        return this.apiGET('/certification_ids/search?ids=' + ids);
    }

    getCollection (type) {
        switch (type) {
        case 'apiDocumentation':
            return this.apiGET('/collections/certified_products?fields=id,edition,developer,product,version,chplProductNumber,certificationStatus,criteriaMet,apiDocumentation,transparencyAttestationUrl');
        case 'bannedDevelopers':
            return this.apiGET('/decertifications/developers');
        case 'correctiveAction':
            return this.apiGET('/collections/certified_products?fields=id,edition,developer,product,version,chplProductNumber,certificationStatus,acb,surveillanceCount,openNonconformityCount,closedNonconformityCount');
        case 'decertifiedProducts':
        case 'inactiveCertificates':
            return this.apiGET('/collections/certified_products?fields=id,edition,developer,product,version,chplProductNumber,acb,decertificationDate,certificationStatus,numMeaningfulUse,numMeaningfulUseDate');
        case 'sed':
            return this.apiGET('/collections/certified_products?fields=id,edition,developer,product,version,chplProductNumber,acb,certificationStatus,criteriaMet');
        case 'transparencyAttestations':
            return this.apiGET('/collections/developers');
            //no default
        }
    }

    getCorrectiveActionPlanActivity (activityRange) {
        var call = '/activity/corrective_action_plans';
        return this.getActivity(call, activityRange);
    }

    getDeveloper (developerId) {
        return this.apiGET('/developers/' + developerId);
    }

    getDeveloperActivity (activityRange) {
        var call = '/activity/developers';
        return this.getActivity(call, activityRange);
    }

    getDevelopers (showDeleted) {
        if (showDeleted) {
            return this.apiGET('/developers?showDeleted=true');
        } else {
            return this.apiGET('/developers');
        }
    }

    getEditions () {
        return this.apiGET('/data/certification_editions');
    }

    getEducation () {
        return this.apiGET('/data/education_types');
    }

    getFuzzyTypes () {
        return this.apiGET('/data/fuzzy_choices');
    }

    getIncumbentDevelopersStatistics () {
        return this.apiGET('/statistics/incumbent_developers');
    }

    getJobTypes () {
        return this.apiGET('/data/job_types');
    }

    getJobs () {
        return this.apiGET('/jobs');
    }

    getIcsFamily (id) {
        return this.apiGET('/certified_products/' + id + '/ics_relationships');
    }

    getListingCountStatistics () {
        return this.apiGET('/statistics/listing_count');
    }

    getNonconformityStatisticsCount () {
        return this.apiGET('/statistics/nonconformity_criteria_count');
    }

    getScheduleTriggers () {
        return this.apiGET('/schedules/triggers');
    }

    getScheduleJobs () {
        return this.apiGET('/schedules/jobs');
    }

    getParticipantAgeStatistics () {
        return this.apiGET('/statistics/participant_age_count');
    }

    getParticipantComputerExperienceStatistics () {
        return this.apiGET('/statistics/participant_computer_experience_count');
    }

    getParticipantEducationStatistics () {
        return this.apiGET('/statistics/participant_education_count');
    }

    getParticipantGenderStatistics () {
        return this.apiGET('/statistics/participant_gender_count');
    }

    getParticipantProductExperienceStatistics () {
        return this.apiGET('/statistics/participant_product_experience_count');
    }

    getParticipantProfessionalExperienceStatistics () {
        return this.apiGET('/statistics/participant_professional_experience_count');
    }

    getPractices () {
        return this.apiGET('/data/practice_types');
    }

    getProduct (productId) {
        const EXPIRATION_TIME = 15; // in minutes
        if (!this.store.certifiedProducts.details[productId] || !this.store.certifiedProducts.details[productId].data || (Date.now() - this.store.certifiedProducts.details[productId].lastUpdated > (1000 * 60 * EXPIRATION_TIME))) {
            this.store.certifiedProducts.details[productId] = {
                data: this.apiGET('/certified_products/' + productId + '/details'),
                lastUpdated: Date.now(),
            };
        }
        return this.store.certifiedProducts.details[productId].data;
    }

    getProductActivity (activityRange) {
        var call = '/activity/products';
        return this.getActivity(call, activityRange);
    }

    getProductsByDeveloper (developerId) {
        return this.apiGET('/products?developerId=' + developerId);
    }

    getProductsByVersion (versionId, editable) {
        return this.apiGET('/certified_products?versionId=' + versionId + '&editable=' + editable);
    }

    getQmsStandards () {
        return this.apiGET('/data/qms_standards');
    }

    getRelatedListings (productId) {
        return this.apiGET('/products/' + productId + '/listings');
    }

    getSearchOptions () {
        const EXPIRATION_TIME = 5; // in minutes
        if (!this.store.searchOptions.data || (Date.now() - this.store.searchOptions.lastUpdated > (1000 * 60 * EXPIRATION_TIME))) {
            this.store.searchOptions.data = this.apiGET('/data/search_options');
            this.store.searchOptions.lastUpdated = Date.now();
        }
        return this.store.searchOptions.data;
    }

    getSedParticipantStatisticsCount () {
        return this.apiGET('/statistics/sed_participant_count');
    }

    getSimpleProduct (productId) {
        return this.apiGET('/products/' + productId);
    }

    getSingleCertifiedProductActivity (productId) {
        return this.apiGET('/activity/certified_products/' + productId);
    }

    getSurveillanceLookups () {
        var data = {};
        this.apiGET('/data/surveillance_types')
            .then(function (response) {
                data.surveillanceTypes = response;
            });
        this.apiGET('/data/surveillance_requirement_types')
            .then(function (response) {
                data.surveillanceRequirementTypes = response;
            });
        this.apiGET('/data/surveillance_result_types')
            .then(function (response) {
                data.surveillanceResultTypes = response;
            });
        this.apiGET('/data/nonconformity_status_types')
            .then(function (response) {
                data.nonconformityStatusTypes = response;
            });
        this.apiGET('/data/surveillance_requirements')
            .then(function (response) {
                data.surveillanceRequirements = response;
            });
        this.apiGET('/data/nonconformity_types')
            .then(function (response) {
                data.nonconformityTypes = response;
            });
        return data;
    }

    getTargetedUsers () {
        return this.apiGET('/data/targeted_users');
    }

    getTestData () {
        return this.apiGET('/data/test_data');
    }

    getTestFunctionality () {
        return this.apiGET('/data/test_functionality');
    }

    getTestProcedures () {
        return this.apiGET('/data/test_procedures');
    }

    getTestStandards () {
        return this.apiGET('/data/test_standards');
    }

    getTestTools () {
        return this.apiGET('/data/test_tools');
    }

    getUcdProcesses () {
        return this.apiGET('/data/ucd_processes');
    }

    getUploadingCps () {
        return this.apiGET('/certified_products/pending');
    }

    getUploadingSurveillances () {
        return this.apiGET('/surveillance/pending');
    }

    getUploadTemplateVersions () {
        return this.apiGET('/data/upload_template_versions');
    }

    getUserActivities (activityRange) {
        var call = '/activity/user_activities';
        return this.getActivity(call, activityRange);
    }

    getUserActivity (activityRange) {
        var call = '/activity/users';
        return this.getActivity(call, activityRange);
    }

    getUserByUsername (uname) {
        return this.apiGET('/users/' + uname + '/details');
    }

    getUsers () {
        return this.apiGET('/users');
    }

    getUsersAtAcb (acbId) {
        return this.apiGET('/acbs/' + acbId + '/users');
    }

    getUsersAtAtl (atlId) {
        return this.apiGET('/atls/' + atlId + '/users');
    }

    getVersion (versionId) {
        return this.apiGET('/versions/' + versionId);
    }

    getVersionActivity (activityRange) {
        var call = '/activity/versions';
        return this.getActivity(call, activityRange);
    }

    getVersionsByProduct (productId) {
        return this.apiGET('/versions?productId=' + productId);
    }

    initiateSurveillance (surveillance) {
        return this.apiPOST('/surveillance', surveillance);
    }

    inviteUser (invitationObject) {
        return this.apiPOST('/users/invite', invitationObject);
    }

    keepalive () {
        return this.apiGET('/auth/keep_alive');
    }

    login (userObj) {
        return this.apiPOST('/auth/authenticate', userObj);
    }

    lookupCertificationId (certId) {
        return this.apiGET('/certification_ids/' + certId);
    }

    massRejectPendingListings (ids) {
        return this.apiDELETE('/certified_products/pending', {ids: ids});
    }

    massRejectPendingSurveillance (ids) {
        return this.apiDELETE('/surveillance/pending', {ids: ids});
    }

    modifyACB (acb) {
        return this.apiPUT('/acbs/' + acb.id, acb);
    }

    modifyATL (atl) {
        return this.apiPUT('/atls/' + atl.id, atl);
    }

    modifyAnnouncement (announcement) {
        return this.apiPUT('/announcements/' + announcement.id, announcement);
    }

    registerApi (user) {
        return this.apiPOST('/key', user);
    }

    rejectPendingCp (cpId) {
        return this.apiDELETE('/certified_products/pending/' + cpId);
    }

    rejectPendingSurveillance (survId) {
        return this.apiDELETE('/surveillance/pending/' + survId);
    }

    removeUserFromAcb (userId, acbId) {
        return this.apiDELETE('/acbs/' + acbId + '/users/' + userId);
    }

    removeUserFromAtl (userId, atlId) {
        return this.apiDELETE('/atls/' + atlId + '/users/' + userId);
    }

    resetPassword (userObj) {
        return this.apiPOST('/auth/reset_password_request', userObj);
    }

    emailResetPassword (userObj) {
        return this.apiPOST('/auth/email_reset_password', userObj);
    }

    revokeApi (user) {
        return this.apiDELETE('/key/' + user.key);
    }

    revokeRole (payload) {
        return this.apiDELETE('/users/' + payload.subjectName + '/roles/' + payload.role);
    }

    search (queryObj) {
        return this.apiPOST('/search', queryObj);
    }

    splitProduct (productObject) {
        return this.apiPOST('/products/' + productObject.oldProduct.productId + '/split', productObject);
    }

    updateCP (cpObject) {
        if (this.store.certifiedProducts.details[cpObject.listing.id]) {
            this.store.certifiedProducts.details[cpObject.listing.id] = {
                data: undefined,
                lastUpdated: -1,
            };
        }
        return this.apiPUT('/certified_products/' + cpObject.listing.id, cpObject);
    }

    updateDeveloper (developerObject) {
        return this.apiPUT('/developers', developerObject);
    }

    updateFuzzyType (fuzzyType) {
        return this.apiPUT('/data/fuzzy_choices/' + fuzzyType.id, fuzzyType);
    }

    updateJob (job) {
        return this.apiPUT('/schedules/jobs', job);
    }

    updateProduct (productObject) {
        return this.apiPUT('/products', productObject);
    }

    updateScheduleTrigger (trigger) {
        return this.apiPUT('/schedules/triggers', trigger);
    }

    updateSurveillance (surveillance) {
        return this.apiPUT('/surveillance/' + surveillance.id, surveillance);
    }

    updateUser (user) {
        return this.apiPUT('/users/' + user.userId, user);
    }

    updateVersion (versionObject) {
        return this.apiPUT('/versions', versionObject);
    }

    ////////////////////////////////////////////////////////////////////

    apiDELETE (endpoint, deleteObject) {
        return this.$http.delete(this.API + endpoint, {data: deleteObject, headers: {'Content-Type': 'application/json;charset=utf-8'}})
            .then(response => response, response => this.$q.reject(response));
    }

    apiGET (endpoint) {
        return this.$http.get(this.API + endpoint)
            .then(response => {
                if (angular.isObject(response.data)) {
                    return response.data;
                } else {
                    return this.$q.reject(response.data);
                }
            }, response => this.$q.reject(response.data));
    }

    apiPOST (endpoint, postObject) {
        return this.$http.post(this.API + endpoint, postObject)
            .then(response => {
                if (angular.isObject(response.data)) {
                    return response.data;
                } else {
                    return this.$q.reject(response);
                }
            }, response => this.$q.reject(response));
    }

    apiPUT (endpoint, postObject) {
        return this.$http.put(this.API + endpoint, postObject)
            .then(response => {
                if (angular.isObject(response.data)) {
                    return response.data;
                } else {
                    return this.$q.reject(response);
                }
            }, response => this.$q.reject(response));
    }

    getActivity (call, activityRange) {
        var params = [];
        if (activityRange.startDate) {
            params.push('start=' + activityRange.startDate.getTime());
        }
        if (activityRange.endDate) {
            params.push('end=' + activityRange.endDate.getTime());
        }
        if (params.length > 0) {
            call += '?' + params.join('&');
        }
        return this.apiGET(call);
    }
}

angular.module('chpl.services')
    .service('networkService', NetworkService);
