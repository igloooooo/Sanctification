<%@page session="false" %>
<ion-header-bar class="expanded">
    <img src="/etc/designs/phonegap/iglooit/mtmhp/clientlibsall/img/tm.png" class="avatar motion spin fade">
    <div class="menu-bottom" style="color:#000000">
        Telstra Media App
    </div>

</ion-header-bar>
<ion-content class="stable-bg has-expanded-header">
    <ion-list>
        <ion-item>
            <a class="item item-button-right" ng-click="updateApp()">
                Update
                <button class="button button-positive">
                    <i class="icon ion-ios-cloud-download"></i>
                </button>
            </a>
        </ion-item>
        <ion-item nav-clear menu-close href="https://www.my.telstra.com.au">
            Telstra My Account
        </ion-item>
        <ion-item nav-clear menu-close href="https://www.my.telstra.com.au">
            Help
        </ion-item>
        <ion-item nav-clear menu-close href="https://www.my.telstra.com.au">
            About Us
        </ion-item>
    </ion-list>
</ion-content>