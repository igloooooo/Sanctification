/**
 * Created by nicholaszhu on 9/9/17.
 */
// the default GA code, nothing to change
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

var fields = {
    // note: you can use a single tracking id for both the app and the website,
    // don't worry it won't mix the data. More about this in the 3rd section
    trackingId: 'UA-106154612-1'
};

// if we are in the app (the protocol will be file://)
if(document.URL.indexOf('http://') !== 0){

    // we store and provide the clientId ourselves in localstorage since there are no
    // cookies in Cordova
    fields.clientId = localStorage.getItem('ga:clientId');
    // disable GA's cookie storage functions
    fields.storage = 'none';

    // ga('create', fields);
    ga('create', 'UA-106154612-1', 'auto');

    // prevent tasks that would abort tracking
    ga('set', {
        // don't abort if the protocol is not http(s)
        checkProtocolTask: null,
        // don't expect cookies to be enabled
        checkStorageTask: null,
        transportUrl:'https://www.google-analytics.com/collect'
    });

    // a callback function to get the clientId and store it ourselves
    ga(function(tracker){
        localStorage.setItem('ga:clientId', tracker.get('clientId'));
    });

    ga('set', 'screenName', 'home');
    ga('send', 'screenview');

}
// if we are in a browser
else {

    ga('create', 'UA-106154612-1', {
        'cookieDomain': 'none'
    });

    ga('set', {
        // don't abort if the protocol is not http(s)
        checkProtocolTask: null,
        // don't expect cookies to be enabled
        checkStorageTask: null
    });

    // send a pageview event
    ga('send', {
        // this is required, there are optional properties too if you want them
        hitType: 'pageview',
        page: 'home'
    });
}