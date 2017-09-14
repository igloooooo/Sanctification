/**
 * Created by nicholaszhu on 1/9/17.
 */

'use strict';

angular.module('topten-directives', [])
    .directive('topten', ['feedService', '$compile', '$templateCache', '$http', feedDirective]);

function feedDirective (feedService, $compile, $templateCache, $http) {

    return {
        restrict  : 'E',
        scope     : {
            summary     : '=summary',
            refreshAfter: '='
        },
        templateUrl: 'topten-list',
        controller: ['$scope', '$element', '$attrs', '$timeout', '$interval', feedDirectiveController]

    };

    function feedDirectiveController ($scope, $element, $attrs, $timeout, $interval) {

        $scope.$watch('finishedLoading', watchFinishedLoading);
        $attrs.$observe('refreshAfter', lookRefreshAttribute);
        $attrs.$observe('url', fetchFeed);
        $attrs.$observe('append', watchAppend);
        $scope.startIndex = 0;
        $scope.append = false;

        $scope.feeds = [];

        $scope.loadMore = function(){
            if ($scope.append) {
                fetchFeed($attrs.url)
            }
        };

        /**
         * go to extra link
         */
        $scope.GotoLink = function (url) {
            window.open(url,'_system');
        }

        // var spinner = $templateCache.get('feed-spinner.html');
        // var feedListTemplate = $templateCache.get('feed-list.html');
        var refreshIntervalId = null;

        // $element.append($compile(spinner)($scope));
        // $element.append($compile(feedListTemplate)($scope));
        // $element.on('$destroy', clearRefreshInterval);

        function renderTemplate (feedsObj) {
            // $scope.feeds = [];
            // $element.append($compile(templateHTML)($scope));
            if (feedsObj) {
                for (var i = 0; i < feedsObj.length; i++) {
                    $scope.feeds.push(feedsObj[i]);
                }
                $scope.startIndex = $scope.startIndex + feedsObj.length;
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

                renderTemplate(feedsObj);
            }, function (error) {
                console.error('Error loading feed ', error);
                $scope.error = error;
                // renderTemplate($templateCache.get('feed-list.html'));
            }).finally(function () {
                $element.find('.spinner').slideUp();
                $scope.$evalAsync('finishedLoading = true')
            });
        }

        function lookRefreshAttribute (refreshAfter) {

            if (isNaN(parseFloat(refreshAfter)) || !$attrs.url) {
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

angular.module('topten', ['topten-services', 'topten-directives']);
'use strict';

angular.module('topten-services', []);

angular
    .module('topten-services')
    .factory('toptenService', ['$window', '$q', '$sce', toptenService]);


function feedService ($window, $q, $sce) {

    return {
        getFeeds: getFeeds
    };

    function getFeeds (feedURL, count, startIndex) {
        var deferredFeedsFetch = $q.defer();

        if (count === 0) {
            console.warn('called getFeeds with count ' + count);
            setTimeout(deferredFeedsFetch.resolve, 400);
            return deferredFeedsFetch.promise;
        }

        fetchFeed(feedURL);

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


angular.module('feeds').run(['$templateCache', function($templateCache) {
    'use strict';

    $templateCache.put('feed-list.html',
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