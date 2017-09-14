<%@page session="false" %><%
%><%@include file="/libs/foundation/global.jsp" %><%
%>
<cq:includeClientLib css="iglooit.ionic-1.1.0"/>
<cq:includeClientLib css="apps.iglooit.mtmhp.all"/>

<!-- Enable all requests, inline styles, and eval() -->
<!-- TODO: set a more restrictive CSP for production -->
<meta http-equiv="Content-Security-Policy" content="default-src 'self' http://www.youtube.com https://ssl.gstatic.com https://www.google-analytics.com gap://ready; style-src 'self' 'unsafe-inline'; script-src 'self' https://s.ytimg.com https://www.youtube.com http://query.yahooapis.com https://ssl.gstatic.com https://www.google-analytics.com 'unsafe-inline' 'unsafe-eval'; connect-src *; img-src *">