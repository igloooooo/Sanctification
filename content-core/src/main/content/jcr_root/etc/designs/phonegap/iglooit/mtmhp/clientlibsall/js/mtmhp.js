/**
 * Created by nicholaszhu on 1/9/17.
 */
;(function (angular, document, undefined) {

    angular.module('mtmhp', ['ngRoute', 'ionic', 'ngAnimate', 'ngResource', 'btford.phonegap.ready', 'feeds', 'youtube-embed'])
        .run(['$ionicPlatform', function($ionicPlatform) {
            $ionicPlatform.ready(function() {
                if (window.AdMob) {
                    var adMobId;
                    if (ionic.Platform.isIOS()) {
                        adMobId = {
                            banner: 'ca-app-pub-4766450360913648/5183267209',
                            interstitial: 'ca-app-pub-4766450360913648/5183267209'
                        };
                    } else if (ionic.Platform.isAndroid()) {
                        adMobId = {
                            banner: 'ca-app-pub-4766450360913648/7810743629',
                            interstitial: 'ca-app-pub-4766450360913648/7810743629'
                        };
                    }

                    if (adMobId) {
                        // Banner
                        AdMob.createBanner({
                            adId: adMobId.banner,
                            autoShow: true,
                            adSize:'SMART_BANNER',
                            overlap:true,
                            position:AdMob.AD_POSITION.POS_XY, x:0, y:130,

                            isTesting: localStorage.getItem('mtmhp_showTestAd') === 'true' || false,

                            success: function () {
                                console.log("createBanner success!")
                            },
                            error: function (err) {
                                console.log("createBanner fail!", err)
                            }
                        });

                        //full screen
                        AdMob.prepareInterstitial({
                            adId: adMobId.interstitial,
                            autoShow: false
                        });

                    }
                    else {
                        console.log("AdMob is null");
                    }
                }
            });
        }])
}(angular, document));