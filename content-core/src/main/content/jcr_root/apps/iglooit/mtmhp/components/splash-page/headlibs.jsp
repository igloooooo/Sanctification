<%@page session="false"%>
<!-- Enable all requests, inline styles, and eval() -->
<!-- TODO: set a more restrictive CSP for production -->
<meta http-equiv="Content-Security-Policy" content="default-src 'self' http://www.youtube.com gap://ready; style-src 'self' 'unsafe-inline'; script-src 'self' https://s.ytimg.com https://www.youtube.com http://query.yahooapis.com 'unsafe-inline' 'unsafe-eval'; connect-src *;">