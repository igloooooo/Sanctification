/**
 * Created by nicholaszhu on 6/9/17.
 */
angular.module('mtmhp')
    .controller('SettingPageCtrl', ['$scope', 'phonegapReady', '$window', function($scope, phonegapReady, $window) {

        $scope.$watch('bNotification', function (newValue, oldValue) {
            localStorage.setItem('mtmhp_notification', newValue);
            $window.ga('send', 'event', '[setting]: change mtmhp_notification to [' + newValue + '].');
        });
        $scope.$watch('bAutoPlay', function (newValue, oldValue) {
            localStorage.setItem('mtmhp_autoPlay', newValue);
            $window.ga('send', 'event', '[setting]: change mtmhp_autoPlay to [' + newValue + '].');
        });
        $scope.$watch('bAutoRefreshFeed', function (newValue, oldValue) {
            localStorage.setItem('mtmhp_autoRefreshFeed', newValue);
            $window.ga('send', 'event', '[setting]: change mtmhp_autoRefreshFeed to [' + newValue + '].');
        });
        $scope.$watch('bDownloadInWifi', function (newValue, oldValue) {
            localStorage.setItem('mtmhp_downloadInWifi', newValue);
            $window.ga('send', 'event', '[setting]: change mtmhp_downloadInWifi to [' + newValue + '].');
        });
        $scope.$watch('bShowTestAd', function (newValue, oldValue) {
            localStorage.setItem('mtmhp_showTestAd', newValue);
            $window.ga('send', 'event', '[setting]: change mtmhp_showTestAd to [' + newValue + '].');
        });
        $scope.initValue = function () {
            $scope.bNotification = localStorage.getItem('mtmhp_notification') === 'true' || false;
            $scope.bAutoPlay = localStorage.getItem('mtmhp_autoPlay') === 'true' || false;
            $scope.bAutoRefreshFeed = localStorage.getItem('mtmhp_autoRefreshFeed') === 'true' || false;
            $scope.bDownloadInWifi = localStorage.getItem('mtmhp_downloadInWifi') === 'true' || false;
            $scope.bShowTestAd = localStorage.getItem('mtmhp_showTestAd') === 'true' || false;
        }
    }]);