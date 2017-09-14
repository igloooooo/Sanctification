<%@page session="false" %><%
%><%@include file="/libs/foundation/global.jsp" %><%
    String headerText = currentPage.getTitle();
%><%
%>
    <%--<ion-header-bar class="bar bar-header bar-positive">--%>
        <%--<a ng-click="toggleMenu()" class="button icon-left ion-navicon-round button-clear" ng-class="{'hidden': !atRootPage}"></a>--%>
        <%--<a ng-click="back()" class="button icon-left ion-chevron-left button-clear" ng-class="{'hidden': atRootPage}"></a>--%>
        <%--<h1 class="title"><%= xssAPI.encodeForHTML(headerText) %></h1>--%>
    <%--</ion-header-bar>--%>
    <ion-nav-bar class="bar-assertive">
        <ion-nav-back-button class="no-text">
        </ion-nav-back-button>
        <ion-nav-buttons side="left">
            <button class="button button-icon button-clear ion-navicon" menu-toggle="left"></button>


        </ion-nav-buttons>
        <ion-nav-title >
            <ion-scroll direction="x" scrollbar-x="false">
                <button class="button button-clear" style="width: 80px; max-width: 80px" ng-click="go('/content/mobileapps/mtmhp/en/home/technology')">Home</button>
                <button class="button button-clear" style="width: 80px; max-width: 80px" ng-click="go('/content/mobileapps/mtmhp/en/home/world')">World</button>
                <button class="button button-clear" style="width: 90px; max-width: 90px" ng-click="go('/content/mobileapps/mtmhp/en/home/business')">Business</button>
                <button class="button button-clear" style="width: 80px; max-width: 80px" ng-click="go('/content/mobileapps/mtmhp/en/home/technology')">Tech</button>
                <button class="button button-clear" style="width: 80px; max-width: 80px" ng-click="go('/content/mobileapps/mtmhp/en/home/technology')">Sports</button>
            </ion-scroll>
        </ion-nav-title>
        <ion-nav-buttons side="right">
            <button class="button button-icon button-clear ion-android-more-vertical" id="menu-popover" ng-click="popover.show($event)"></button>
        </ion-nav-buttons>
    </ion-nav-bar>

    <ion-nav-view name="menuContent"></ion-nav-view>
    <ion-content class="im-wrapper has-header ">
        <div style="width: 100%; height: 40px"></div>
        <cq:include path="content-par" resourceType="foundation/components/parsys" />
        <ion-infinite-scroll
                on-infinite="onInfinite()"
                distance="1%">
        </ion-infinite-scroll>
    </ion-content>



