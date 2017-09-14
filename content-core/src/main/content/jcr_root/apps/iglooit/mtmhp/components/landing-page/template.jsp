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

        <ion-nav-title>Welcome to Telstra Media Home</ion-nav-title>

    </ion-nav-bar>
    <ion-nav-view name="menuContent"></ion-nav-view>
    <ion-content class="im-wrapper has-header ">
        <cq:include path="content-par" resourceType="foundation/components/parsys" />
    </ion-content>



