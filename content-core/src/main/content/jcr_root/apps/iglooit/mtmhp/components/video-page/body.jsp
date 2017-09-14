<%@page session="false"
        import="com.day.cq.wcm.api.WCMMode,
	            com.adobe.cq.mobile.angular.data.util.FrameworkContentExporterUtils" %><%
%><%@include file="/libs/foundation/global.jsp" %><%
    // Remove invalid characters for JS function names
    String controllerNameStripped = currentPage.getPath().replaceAll("[^A-Za-z0-9]", "");
    pageContext.setAttribute("controllerNameStripped", controllerNameStripped);

    String relativePathToRoot = FrameworkContentExporterUtils.getRelativePathToRootLevel(currentPage.adaptTo(Resource.class));
%><c:set var="wcmMode"><%= WCMMode.fromRequest(request) != WCMMode.DISABLED %></c:set><%
%>
<body ng-controller="AppController">
<div id="appWrap" ng-controller="AppNavigationController" ng-cloak>
    <ion-side-menus enable-menu-with-back-views="false">
        <ion-side-menu side="left">
            <cq:include script="menu.jsp"/>
        </ion-side-menu>

        <ion-side-menu-content>
            <c:choose>
                <c:when test="${wcmMode}">
                    <%-- Render the content in a way that does not break
                        author mode --%>
                    <div ng-controller="<c:out value="${controllerNameStripped}"/>">
                        <cq:include script="template.jsp"/>
                    </div>

                </c:when>
                <c:otherwise>

                    <div ng-view class="view-animate" ng-class="transition"></div>

                    <script type="text/javascript" src="<%= xssAPI.getValidHref( relativePathToRoot ) %>cordova.js"></script>

                </c:otherwise>
            </c:choose>
            <ion-footer-bar class="bar-assertive">
                <!-- Tabs Striped -->
                <div class="tabs-striped tabs-color-assertive" style="position: static; margin-bottom: 15px; width: 100%">
                    <div class="tabs" style="position: static;">
                        <a class="tab-item " data-ink-color="#ef473a" data-ink-opacity=".35" ng-click="go('/content/mobileapps/mtmhp/en/home/news')">
                            <i class="icon ion-home"></i> Home
                        </a>
                        <a class="tab-item active" data-ink-color="#ef473a" data-ink-opacity=".35" ng-click="go('/content/mobileapps/mtmhp/en/home/videohome')">
                            <i class="icon ion-play"></i> Video
                        </a>
                        <a class="tab-item" data-ink-color="#ef473a" data-ink-opacity=".35">
                            <i class="icon ion-gear-a"></i> Setting
                        </a>
                    </div>
                </div>
            </ion-footer-bar>
        </ion-side-menu-content>
    </ion-side-menus>

    <cq:include script="footer.jsp"/>
</div>
<script src="https://www.youtube.com/iframe_api"></script>
<cq:includeClientLib js="iglooit.ionic-1.1.0"/>
<script src="<c:out value='${currentPage.name}'/>.angular-app-module.js"></script>
<script src="<c:out value='${currentPage.name}'/>.angular-app-controllers.js"></script>
<cq:include script="js_clientlibs.jsp"/>
</body>
