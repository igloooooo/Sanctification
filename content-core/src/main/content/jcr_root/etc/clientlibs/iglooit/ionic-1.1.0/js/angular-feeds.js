/**
 * Created by nicholaszhu on 1/9/17.
 */
/**
 * angular-feeds - v0.0.4 - 2017-03-14 8:09 AM
 * https://github.com/siddii/angular-feeds
 *
 * Copyright (c) 2017
 * Licensed MIT <https://github.com/siddii/angular-feeds/blob/master/LICENSE.txt>
 */
'use strict';

angular.module('feeds-directives', [])
    .directive('feed', ['feedService', '$compile', '$templateCache', '$http', '$window', feedDirective]);

function feedDirective (feedService, $compile, $templateCache, $http, $window) {

    return {
        restrict  : 'E',
        scope     : {
            summary     : '=summary',
            refreshAfter: '='
        },
        link : function (scope) {
            scope.$on("onInfinite", function (event, args) {
                scope.loadMore();

            });
        },
        controller: ['$scope', '$element', '$attrs', '$timeout', '$interval', '$window', feedDirectiveController]

    };

    function feedDirectiveController ($scope, $element, $attrs, $timeout, $interval, $window) {

        $scope.$watch('finishedLoading', watchFinishedLoading);
        $attrs.$observe('refreshAfter', lookRefreshAttribute);
        $attrs.$observe('url', fetchFeed);
        $attrs.$observe('append', watchAppend);
        $scope.startIndex = 0;
        $scope.append = false;
        $scope.loading = true;

        $scope.feeds = [];

        $scope.loadMore = function(){
            if ($scope.append) {
                fetchFeed($attrs.url);

            }
        };

        /**
         * go to extra link
         */
        $scope.GotoLink = function (url) {
            $window.ga('send', 'event', '[nav] app jump to: [' + url + '].');
            window.open(url,'_system');
        }

        var spinner = $templateCache.get('feed-spinner.html');
        var feedListTemplate = $templateCache.get('feed-list.html');
        var refreshIntervalId = null;

        $element.append($compile(spinner)($scope));
        $element.append($compile(feedListTemplate)($scope));
        $element.on('$destroy', clearRefreshInterval);

        function renderTemplate (templateHTML, feedsObj) {
            // $scope.feeds = [];
            // $element.append($compile(templateHTML)($scope));
            if (feedsObj) {
                for (var i = 0; i < feedsObj.length; i++) {
                    $scope.feeds.push(feedsObj[i]);
                }
                $scope.startIndex = $scope.startIndex + feedsObj.length;
                $scope.loading = false;
            }
        }

        function watchAppend(append) {
            $scope.append = append;
        }
        function watchFinishedLoading (value) {
            if ($attrs.postRender && value) {
                $timeout(function () {
                    new Function("element", $attrs.postRender + '(element);')($element);
                }, 0);
            }
        }

        function fetchFeed (url) {
            feedService.getFeeds(url, $attrs.count, $scope.startIndex).then(function (feedsObj) {
                if ($attrs.template && $templateCache.get($attrs.template)) {
                    renderTemplate($templateCache.get($attrs.template), feedsObj);
                } else if ($attrs.templateUrl) {
                    // if ($attrs.templateUrl.endsWith('html')) {
                        $http.get($attrs.templateUrl, {cache: $templateCache}).success(function (templateHtml) {
                            renderTemplate(templateHtml, feedsObj);
                        });
                    // } else {
                    //     renderTemplate(document.getElementById($attrs.templateUr), feedsObj);
                    // }
                }
                else {
                    renderTemplate($templateCache.get('feed-list.html'), feedsObj);
                }
            }, function (error) {
                console.error('Error loading feed ', error);
                $scope.error = error;
                renderTemplate($templateCache.get('feed-list.html'));
            }).finally(function () {
                $element.find('.spinner').slideUp();
                $scope.$evalAsync('finishedLoading = true')
            });
        }

        function lookRefreshAttribute (refreshAfter) {

            if (isNaN(parseFloat(refreshAfter)) || !$attrs.url || localStorage.getItem('mtmhp_autoRefreshFeed') !== 'true') {
                return;
            }

            setupRefreshInterval(refreshAfter);
        }

        function setupRefreshInterval (refreshAfter) {
            clearRefreshInterval();

            refreshIntervalId = $interval(function () {
                fetchFeed($attrs.url);
            }, refreshAfter);
        }

        function clearRefreshInterval () {
            refreshIntervalId && $interval.cancel(refreshIntervalId);
        }
    }
}

'use strict';

angular.module('feeds', ['feeds-services', 'feeds-directives']);
'use strict';

angular.module('feeds-services', []);

angular
    .module('feeds-services')
    .factory('feedService', ['$window', '$q', '$sce', 'feedCache', feedService]);
angular
    .module('feeds-services')
    .factory('feedCache', feedCache);

function feedService ($window, $q, $sce, feedCache) {

    return {
        getFeeds: getFeeds,
        clearCache: clearCache
    };

    function clearCache(forFeed) {
        if(feedCache.hasCache(forFeed)) {
            feedCache.unset(forFeed);
        }
    }

    function getFeeds (feedURL, count, startIndex) {
        var deferredFeedsFetch = $q.defer();

        if (count === 0) {
            console.warn('called getFeeds with count ' + count);
            setTimeout(deferredFeedsFetch.resolve, 400);
            return deferredFeedsFetch.promise;
        }

        feedCache.hasCache(feedURL)
            ? deferredFeedsFetch.resolve(sanitizeEntries(feedCache.get(feedURL)))
            : fetchFeed(feedURL);

        return deferredFeedsFetch.promise;

        function fetchFeed (feedURL) {
            try {
                YUI().use('yql', performYQLQuery(feedURL));
            } catch (ex) {
                deferredFeedsFetch.reject(ex);
            }
        }

        function performYQLQuery (feedURL) {
            return function (Y) {
                var query = 'select * from feed('+startIndex+',' + count + ') where url = "' + feedURL + '"',
                    href = $window.location && $window.location.href ? $window.location.href : null,
                    proto = href && (href.toLowerCase().indexOf('https') === 0) ? 'https' : 'http';

                Y.YQL(query, parseYQLResponse, {}, {proto: proto});
            };
        }

        function parseYQLResponse (rawResponse) {

            var response = [];

            if (rawResponse.query.count) {
                var itemsIndex = typeof rawResponse.query.results.item === 'undefined' ? 'entry' : 'item';
                var entries    = rawResponse.query.results[itemsIndex];
                feedCache.set(feedURL, entries);
                response = sanitizeEntries(entries);
            }

            resolve(response);
        }

        function resolve (withData) {
            deferredFeedsFetch.resolve(withData);
        }
    }

    function sanitizeFeedEntry (feedEntry) {
        var normalizedFeedEntry = {};

        var properties = [
            {indexName: 'content', possibleIndexNames: ['content']},
            {indexName: 'description', possibleIndexNames: ['description']},
            {indexName: 'title', possibleIndexNames: ['title']},
            {indexName: 'link', possibleIndexNames: ['link']},
            {indexName: 'thumbnail', possibleIndexNames: ['thumbnail']}
        ];

        properties.forEach(function (property) {
            property.possibleIndexNames.forEach(function (contentIndex) {
                if (feedEntry[contentIndex]) {
                    var content = typeof feedEntry[contentIndex] === 'string' ? feedEntry[contentIndex] : feedEntry[contentIndex].content;
                    if (!content) {
                        content = feedEntry[contentIndex];
                    }
                    normalizedFeedEntry[property.indexName] = content;
                }
            });
        });

        return normalizedFeedEntry;
    }

    function sanitizeEntries (entries) {
        var sanitezedEntries = [];
        for (var i = 0; i < entries.length; i++) {
            sanitezedEntries.push(sanitizeFeedEntry(entries[i]));
        }

        return sanitezedEntries;
    }
}

function feedCache () {
    var CACHE_INTERVAL = 1000 * 60 * 5; //5 minutes

    function cacheTimes () {
        if ('CACHE_TIMES' in localStorage) {
            return angular.fromJson(localStorage.getItem('CACHE_TIMES'));
        }
        return {};
    }

    function hasCache (name) {
        var CACHE_TIMES = cacheTimes();
        return name in CACHE_TIMES && name in localStorage && new Date().getTime() - CACHE_TIMES[name] < CACHE_INTERVAL;
    }

    return {
        set     : function (name, obj) {
            localStorage.setItem(name, angular.toJson(obj));
            var CACHE_TIMES   = cacheTimes();
            CACHE_TIMES[name] = new Date().getTime();
            localStorage.setItem('CACHE_TIMES', angular.toJson(CACHE_TIMES));
        },
        get     : function (name) {
            if (hasCache(name)) {
                return angular.fromJson(localStorage.getItem(name));
            }
            return null;
        },
        unset: function(name) {
            localStorage.removeItem(name);
        },
        hasCache: hasCache
    };
}

//angular.module('feeds-services')
//    .provider('yui', [yui])
//    .run(['yui', function (yuiLoader) {
//    }]);
//
//function yui () {
//    this.$get = ['$q', loadYuiScript];
//
//    function loadYuiScript ($q) {
//        var isNotLoadingScript = true, requests = [];
//        fetchScript();
//
//        return {
//            load: fetchScript
//        };
//
//        function fetchScript () {
//            var deferred = $q.defer();
//            requests.push(deferred);
//
//            if ((!document.querySelector('[src*="yui-min.js"]') && !document.querySelector('[src*="yui.js"]'))
//                && isNotLoadingScript) {
//                isNotLoadingScript = false;
//                var script         = document.createElement('script');
//                script.onload      = function () {
//                    isNotLoadingScript = true;
//                    requests.forEach(function (request) {
//                        request.resolve();
//                    });
//                };
//                script.src         = "http://yui.yahooapis.com/3.18.1/build/yui/yui-min.js";
//                document.getElementsByTagName('head')[0].appendChild(script);
//            } else if (isNotLoadingScript) {
//                deferred.resolve();
//            }
//
//            return deferred.promise;
//        }
//    }
//}
angular.module('feeds').run(['$templateCache', function($templateCache) {
    'use strict';

    $templateCache.put('feed-list.html',
        "<div class='skeleton' ng-show=\"loading\"></div>\n" +
        "<div class=''>\n" +
        "    <div ng-show=\"error\" class=\"alert alert-danger\">\n" +
        "        <h5 class=\"text-center\">Oops... Something bad happened, please try later :(</h5>\n" +
        "    </div>\n" +
        "\n" +
        "    <div class=\"list\">\n" +
        "        <a ng-repeat=\"feed in feeds | orderBy:publishedDate:reverse\" class=\"item item-thumbnail-left \" ng-click=\"GotoLink('{{feed.link}}')\">\n" +
        "                <img ng-src='{{feed.thumbnail.url}}'>\n" +
        "                <h2 class=\"media-heading\">{{feed.title}}</h2>\n" +
        "                <p ng-bind-html=\"feed.description[0]\"></p>\n" +
        "        </a>\n" +
        "        <hr ng-if=\"!$last\"/>\n" +
        "    </div>\n" +
        "</div>"
    );


    $templateCache.put('feed-spinner.html',
        "<div class=\"spinner\">\n" +
        "    <div class=\"bar1\"></div>\n" +
        "    <div class=\"bar2\"></div>\n" +
        "    <div class=\"bar3\"></div>\n" +
        "    <div class=\"bar4\"></div>\n" +
        "    <div class=\"bar5\"></div>\n" +
        "    <div class=\"bar6\"></div>\n" +
        "    <div class=\"bar7\"></div>\n" +
        "    <div class=\"bar8\"></div>\n" +
        "</div>\n"
    );

}]);