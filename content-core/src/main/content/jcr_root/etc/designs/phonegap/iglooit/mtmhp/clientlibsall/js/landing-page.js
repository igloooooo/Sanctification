/**
 * Created by nicholaszhu on 4/9/17.
 */
angular.module('mtmhp')
    .controller('LandingPageCtrl', ['$scope', 'phonegapReady', function($scope, phonegapReady) {
        $scope.$watch("author", function(){
            if(!$scope.author) {
                setTimeout(function () {
                    $scope.$apply(function () {
                        $scope.go('/content/mobileapps/mtmhp/en/home/news');
                    });
                }, 8000);
            }
        });

    }]);