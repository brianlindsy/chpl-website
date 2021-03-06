(function () {
    'use strict';
    angular.module('chpl.components')
        .filter('customFilter', CustomFilter);

    /** @ngInject */
    function CustomFilter ($filter, $log, cfpLoadingBar) {
        var filterFilter = $filter('filter');
        var standardComparator = function standardComparator (obj, text) {
            text = ('' + text).toLowerCase();
            return ('' + obj).toLowerCase().indexOf(text) > -1;
        };

        return function customFilter (array, expression) {

            function customComparator (actual, expected) {
                var isBeforeActivated = expected.before;
                var isAfterActivated = expected.after;
                var isLower = expected.lower;
                var isHigher = expected.higher;
                var higherLimit;
                var lowerLimit;
                var itemDate;
                var queryDate;
                var i,ret;
                var separator = expected.separator ? expected.separator : '';
                var closed, closedNC, open, openNC;

                if (angular.isObject(expected)) {
                    //exact match
                    if (expected.distinct) {
                        if (!actual || actual.toLowerCase() !== expected.distinct.toLowerCase()) {
                            return false;
                        }

                        return true;
                    }

                    //surveillance match
                    if (expected.surveillance) {
                        if (!actual) {
                            return false;
                        }
                        var surv = angular.fromJson(actual);
                        if (expected.surveillance === 'never') {
                            ret = surv.surveillanceCount === 0;
                        } else {
                            ret = surv.surveillanceCount !== 0;
                            if (expected.NC) {
                                var never = expected.NC.never;
                                open = expected.NC.open;
                                closed = expected.NC.closed;
                                openNC = surv.openNonconformityCount > 0;
                                closedNC = surv.closedNonconformityCount > 0;
                                /*
                                 * matching one of the posibles
                                 */
                                if (never && !open && !closed) {
                                    ret = ret && !openNC && !closedNC;
                                } else if (!never && open && !closed) {
                                    ret = ret && openNC
                                } else if (!never && !open && closed) {
                                    ret = ret && closedNC
                                    /*
                                     * if matching more than one, need to know if matchAll is true or not
                                     * if true, only valid "multiple" is !never && open && closed
                                     */
                                } else if (expected.matchAll && !never && open && closed) {
                                    ret = ret && openNC && closedNC;
                                } else if (expected.matchAll) {
                                    ret = false;
                                    /*
                                     * now matching "matchAny" with multiples
                                     */
                                } else if (never && open && !closed) {
                                    ret = ret && openNC && !closedNC;
                                } else if (never && !open && closed) {
                                    ret = ret && !openNC && closedNC;
                                } else if (!never && open && closed) {
                                    ret = ret && (openNC || closedNC);
                                }
                                /*
                                 * triple multiples on matchAny
                                 * never && open && closed
                                 * !never && !open && !closed
                                 * fall back to "all", and the original return value
                                 */
                            }
                        }
                        return ret;
                    }

                    //nonconformities match
                    if (expected.nonconformities) {
                        if (!actual) {
                            return false;
                        }
                        var nc = angular.fromJson(actual);
                        open = expected.nonconformities.open;
                        closed = expected.nonconformities.closed;
                        openNC = nc.openNonconformityCount > 0;
                        closedNC = nc.closedNonconformityCount > 0;
                        if (expected.nonconformities.matchAll) {
                            ret = (open === openNC) && (closed === closedNC);
                        } else {
                            if (!open && !closed) {
                                ret = true;
                            } else {
                                ret = (open && openNC) || (closed && closedNC)
                            }
                        }
                        return ret;
                    }

                    //matchAny
                    if (expected.matchAny) {
                        if (expected.matchAny.all) {
                            return true;
                        }

                        if (!actual) {
                            return false;
                        }

                        for (i = 0; i < expected.matchAny.items.length; i++) {
                            if (
                                (actual + separator).toLowerCase() === (expected.matchAny.items[i] + separator).toLowerCase()
                                    ||
                                    (
                                        !expected.matchAny.matchFull
                                            &&
                                            (actual + separator).toLowerCase().indexOf((expected.matchAny.items[i] + separator).toLowerCase()) > -1
                                    )
                            ) {
                                return true;
                            }
                        }

                        return false;
                    }

                    //matchAll
                    if (expected.matchAll) {
                        if (expected.matchAll.all) {
                            return true;
                        }

                        if (!actual) {
                            return false;
                        }

                        ret = true;
                        for (i = 0; i < expected.matchAll.items.length; i++) {
                            ret = ret && ((actual + separator).toLowerCase() === (expected.matchAll.items[i] + separator).toLowerCase()
                                          || (actual + separator).toLowerCase().indexOf((expected.matchAll.items[i] + separator).toLowerCase()) > -1);
                        }

                        return ret;
                    }

                    //date range
                    if (expected.before || expected.after) {
                        try {
                            if (isBeforeActivated) {
                                higherLimit = expected.before;

                                itemDate = new Date(actual);
                                queryDate = new Date(higherLimit);
                                if (itemDate > queryDate) {
                                    return false;
                                }
                            }

                            if (isAfterActivated) {
                                lowerLimit = expected.after;

                                itemDate = new Date(actual);
                                queryDate = new Date(lowerLimit);
                                if (itemDate < queryDate) {
                                    return false;
                                }
                            }

                            return true;
                        } catch (e) {
                            return false;
                        }

                    } else if (isLower || isHigher) {
                        //number range
                        if (isLower) {
                            higherLimit = expected.lower;

                            if (actual > higherLimit) {
                                return false;
                            }
                        }

                        if (isHigher) {
                            lowerLimit = expected.higher;
                            if (actual < lowerLimit) {
                                return false;
                            }
                        }

                        return true;
                    }
                    //etc

                    return true;

                }
                return standardComparator(actual, expected);
            }

            var output;
            cfpLoadingBar.start();
            output = filterFilter(array, expression, customComparator);
            cfpLoadingBar.complete()
            return output;
        };
    }
})();
