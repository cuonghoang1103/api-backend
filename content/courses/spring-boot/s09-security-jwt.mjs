/**
 * spring-boot/s09-security-jwt.mjs — Chương 9: Spring Security + JWT (soạn 20/11/2026, agent sb).
 * Mọi output là chạy thật: Spring Boot 4.1.2 / Spring Security 7.1.2 (spring-boot-starter-security, -security-oauth2-resource-server) /
 * Nimbus JOSE+JWT 10.9.1 / Bouncy Castle 1.80 trên Temurin 21.0.12.1, PostgreSQL 16.15 (container sb-c9-pg); Node 22 + bcryptjs 3 để so sánh.
 * Cổng 41920 trên máy đo được ghi thành 8080 trong bài.
 * Mã demo: scratchpad/sb/lab/c9/sec (c9.a/b/c/d), lab/c9/lab9/{starter,giai,chay.sh,cham.sh}; output: ~/.rtq-sb/c9/o (lọc ⇒ o/web bằng lab/c9/web-out.sh).
 * Hằng MA.. / OUT.. sinh bằng tam/s09/build.sh + gen-ma.mjs.
 */
import { java, sql, bash, props, xml, js, out, tl, giai } from './_chung.mjs';

// ===== Bài 9.1 =====
const MA91_A = java("@SpringBootApplication\npublic class App {\n    public static void main(String[] args) { SpringApplication.run(App.class, args); }\n}\n\n@RestController\nclass LabApi {\n    @GetMapping(\"/labs\")\n    List<String> labs() { return List.of(\"IOT-01\", \"NET-02\", \"AI-03\"); }\n}");
const OUT91_START = out("WARN .s.a.UserDetailsServiceAutoConfiguration : \nUsing generated security password: df8abdf4-6a6b-4055-adb9-73d2c67c73f2\nThis generated password is for development use only. Your security configuration must be updated before running your application in production.\nDEBUG o.s.s.web.DefaultSecurityFilterChain     : Will secure any request with filters: DisableEncodeUrlFilter, WebAsyncManagerIntegrationFilter, SecurityContextHolderFilter, HeaderWriterFilter, CsrfFilter, LogoutFilter, UsernamePasswordAuthenticationFilter, DefaultResourcesFilter, DefaultLoginPageGeneratingFilter, DefaultLogoutPageGeneratingFilter, BasicAuthenticationFilter, RequestCacheAwareFilter, SecurityContextHolderAwareRequestFilter, AnonymousAuthenticationFilter, ExceptionTranslationFilter, AuthorizationFilter");
const OUT91_CURL = out("$ curl -i localhost:8080/labs\nHTTP/1.1 401 \nSet-Cookie: JSESSIONID=1E239463090D6C673C2EB9EF827B17D6; Path=/; HttpOnly\nWWW-Authenticate: Basic realm=\"Realm\", charset=\"UTF-8\"\nX-Content-Type-Options: nosniff\nX-XSS-Protection: 0\nCache-Control: no-cache, no-store, max-age=0, must-revalidate\nPragma: no-cache\nExpires: 0\nX-Frame-Options: DENY\nContent-Length: 0\n\n$ curl -i -H \"Accept: text/html\" localhost:8080/labs\nHTTP/1.1 302 \nSet-Cookie: JSESSIONID=CC5C24287B0E8907CF7FCA0CEBF98413; Path=/; HttpOnly\nX-Content-Type-Options: nosniff\nX-XSS-Protection: 0\nCache-Control: no-cache, no-store, max-age=0, must-revalidate\nPragma: no-cache\nExpires: 0\nX-Frame-Options: DENY\nLocation: http://localhost:8080/login\nContent-Length: 0\n\n$ curl -i -u user:<mật khẩu sinh ra> localhost:8080/labs\nHTTP/1.1 200 \nX-Content-Type-Options: nosniff\nX-XSS-Protection: 0\nCache-Control: no-cache, no-store, max-age=0, must-revalidate\nPragma: no-cache\nExpires: 0\nX-Frame-Options: DENY\nContent-Type: application/json\nContent-Length: 27\n\n[\"IOT-01\",\"NET-02\",\"AI-03\"]\n\n$ curl -i -u user:<mật khẩu sinh ra> -X POST localhost:8080/labs\nHTTP/1.1 401");
const OUT91_POST = out("DEBUG o.s.security.web.FilterChainProxy        : Securing POST /labs\nDEBUG o.s.security.web.csrf.CsrfFilter         : Invalid CSRF token found for http://localhost:8080/labs\nDEBUG o.s.s.w.access.AccessDeniedHandlerImpl   : Responding with 403 status code\nDEBUG o.s.security.web.FilterChainProxy        : Securing GET /error\nDEBUG o.s.s.w.a.AnonymousAuthenticationFilter  : Set SecurityContextHolder to anonymous SecurityContext\nDEBUG o.s.s.w.s.HttpSessionRequestCache        : Saved request http://localhost:8080/error?continue to session\nDEBUG s.w.a.DelegatingAuthenticationEntryPoint : Trying to match using And [Not [RequestHeaderRequestMatcher [expectedHeaderName=X-Requested-With, expectedHeaderValue=XMLHttpRequest]], MediaTypeRequestMatcher [contentNegotiationStrategy=org.springframework.web\nDEBUG s.w.a.DelegatingAuthenticationEntryPoint : Trying to match using Or [RequestHeaderRequestMatcher [expectedHeaderName=X-Requested-With, expectedHeaderValue=XMLHttpRequest], And [Not [MediaTypeRequestMatcher [contentNegotiationStrategy=org.springframework.\nDEBUG s.w.a.DelegatingAuthenticationEntryPoint : Match found! Executing org.springframework.security.web.authentication.DelegatingAuthenticationEntryPoint@54c622a7\nDEBUG s.w.a.DelegatingAuthenticationEntryPoint : Trying to match using RequestHeaderRequestMatcher [expectedHeaderName=X-Requested-With, expectedHeaderValue=XMLHttpRequest]\nDEBUG s.w.a.DelegatingAuthenticationEntryPoint : No match found. Using default entry point org.springframework.security.web.authentication.www.BasicAuthenticationEntryPoint@2044559e");
const MA91_B = java("@Bean @Profile(\"!sai\")\nSecurityFilterChain chain(HttpSecurity http, Environment env) throws Exception {\n    http.authorizeHttpRequests(a -> a\n            .requestMatchers(HttpMethod.GET, \"/labs\").permitAll()\n            .requestMatchers(\"/admin/**\").hasRole(\"ADMIN\")\n            .anyRequest().authenticated())\n        .httpBasic(Customizer.withDefaults())\n        .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))\n        .addFilterBefore(new GhiNhat(), AuthorizationFilter.class);\n    if (!env.matchesProfiles(\"csrf\")) http.csrf(c -> c.disable());   // API không dùng cookie phiên ⇒ tắt CSRF (bài 10.4)\n    return http.build();\n}");
const MA91_USERS = java("@Bean\nUserDetailsService users(PasswordEncoder pe) {\n    return new InMemoryUserDetailsManager(\n        User.withUsername(\"an\").password(pe.encode(\"an-123456\")).roles(\"STUDENT\").build(),\n        User.withUsername(\"admin\").password(pe.encode(\"admin-123456\")).roles(\"ADMIN\").build());\n}\n\n@Bean\nPasswordEncoder passwordEncoder() { return PasswordEncoderFactories.createDelegatingPasswordEncoder(); }");
const MA91_GHI = java("/** Filter tự viết: in ra ai đang gọi ở đúng vị trí của nó trong chuỗi. */\nclass GhiNhat extends OncePerRequestFilter {\n    @Override\n    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)\n            throws ServletException, IOException {\n        Authentication a = SecurityContextHolder.getContext().getAuthentication();\n        System.out.println(\"[GhiNhat] \" + req.getMethod() + \" \" + req.getRequestURI() + \" ⇒ \"\n                + (a == null ? \"chưa có Authentication\" : a.getClass().getSimpleName() + \" \" + a.getName() + \" \" + a.getAuthorities()));\n        chain.doFilter(req, res);\n        System.out.println(\"[GhiNhat] trả về \" + res.getStatus());\n    }\n}");
const OUT91_CHAIN = out("Will secure any request with filters: DisableEncodeUrlFilter, WebAsyncManagerIntegrationFilter, SecurityContextHolderFilter, HeaderWriterFilter, LogoutFilter, BasicAuthenticationFilter, RequestCacheAwareFilter, SecurityContextHolderAwareRequestFilter, AnonymousAuthenticationFilter, SessionManagementFilter, ExceptionTranslationFilter, GhiNhat, AuthorizationFilter");
const OUT91_BCURL = out("$ curl localhost:8080/labs\n[\"IOT-01\",\"NET-02\",\"AI-03\"]  ⇒ HTTP 200\n$ curl localhost:8080/bookings\n  ⇒ HTTP 401\n$ curl -u an:$MAT_KHAU_AN localhost:8080/bookings\nlượt đặt của an [ROLE_STUDENT, FactorGrantedAuthority [authority=FACTOR_PASSWORD, issuedAt=…]]  ⇒ HTTP 200\n$ curl -u an:sai-mat-khau localhost:8080/bookings\n  ⇒ HTTP 401\n$ curl -u an:$MAT_KHAU_AN localhost:8080/admin/stats\n{\"timestamp\":\"2026-11-20T02:17:57.733Z\",\"status\":403,\"error\":\"Forbidden\",\"path\":\"/admin/stats\"}  ⇒ HTTP 403\n$ curl -u admin:admin-123456 localhost:8080/admin/stats\nchỉ ADMIN thấy dòng này  ⇒ HTTP 200\n$ curl -u an:$MAT_KHAU_AN -X POST localhost:8080/bookings\nđã đặt cho an  ⇒ HTTP 200");
const OUT91_GHI = out("[GhiNhat] GET /labs ⇒ AnonymousAuthenticationToken anonymousUser [ROLE_ANONYMOUS]\n[GhiNhat] trả về 200\n[GhiNhat] GET /bookings ⇒ AnonymousAuthenticationToken anonymousUser [ROLE_ANONYMOUS]\n[GhiNhat] GET /bookings ⇒ UsernamePasswordAuthenticationToken an [ROLE_STUDENT, FactorGrantedAuthority [authority=FACTOR_PASSWORD, issuedAt=…]]\n[GhiNhat] trả về 200\n[GhiNhat] GET /admin/stats ⇒ UsernamePasswordAuthenticationToken an [ROLE_STUDENT, FactorGrantedAuthority [authority=FACTOR_PASSWORD, issuedAt=…]]\n[GhiNhat] GET /admin/stats ⇒ UsernamePasswordAuthenticationToken admin [ROLE_ADMIN, FactorGrantedAuthority [authority=FACTOR_PASSWORD, issuedAt=…]]\n[GhiNhat] trả về 200\n[GhiNhat] POST /bookings ⇒ UsernamePasswordAuthenticationToken an [ROLE_STUDENT, FactorGrantedAuthority [authority=FACTOR_PASSWORD, issuedAt=…]]\n[GhiNhat] trả về 200");
const OUT91_BAY = out("$ curl -u an:$MAT_KHAU_AN -X POST localhost:8080/bookings      # profile csrf: CSRF để mặc định (bật)\nHTTP 401\n$ curl -u an:$MAT_KHAU_AN localhost:8080/bookings              # profile trung: GhiNhat còn là @Bean\nHTTP 200\n[GhiNhat] GET /bookings ⇒ UsernamePasswordAuthenticationToken an [ROLE_STUDENT, …]\n[GhiNhat] GET /bookings ⇒ UsernamePasswordAuthenticationToken an [ROLE_STUDENT, …]\n[GhiNhat] trả về 200\n[GhiNhat] trả về 200");
const MA91_SAI = java("@Bean @Profile(\"sai\")\nSecurityFilterChain chainSai(HttpSecurity http) throws Exception {\n    http.authorizeHttpRequests(a -> a\n            .anyRequest().authenticated()\n            .requestMatchers(HttpMethod.GET, \"/labs\").permitAll())\n        .httpBasic(Customizer.withDefaults());\n    return http.build();\n}");
const OUT91_SAI = out("Caused by: java.lang.IllegalStateException: Can't configure requestMatchers after anyRequest");
const MA91_CU = java("import org.springframework.security.config.annotation.web.builders.HttpSecurity;\nimport org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;\n\npublic class CauHinhCu extends WebSecurityConfigurerAdapter {   // công thức Spring Security 5 trên StackOverflow\n    @Override\n    protected void configure(HttpSecurity http) throws Exception {\n        http.authorizeRequests().antMatchers(\"/labs\").permitAll().anyRequest().authenticated();\n    }\n}");
const OUT91_CU = out("CauHinhCu.java:2: error: cannot find symbol\nimport org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;\n                                                                       ^\n  symbol:   class WebSecurityConfigurerAdapter\n  location: package org.springframework.security.config.annotation.web.configuration\nCauHinhCu.java:4: error: cannot find symbol\npublic class CauHinhCu extends WebSecurityConfigurerAdapter {   // công thức Spring Security 5 trên StackOverflow\n                               ^\n  symbol: class WebSecurityConfigurerAdapter\nCauHinhCu.java:5: error: method does not override or implement a method from a supertype\n    @Override\n    ^\nCauHinhCu.java:7: error: cannot find symbol\n        http.authorizeRequests().antMatchers(\"/labs\").permitAll().anyRequest().authenticated();\n            ^\n  symbol:   method authorizeRequests()\n  location: variable http of type HttpSecurity\n4 errors");

const L91_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
<h2>The Spring Security filter chain</h2>
<p class="lead">Until now every LabFlow endpoint answered anyone. This chapter puts a door in front of it. Before writing a single login form we add one dependency and read exactly what it did: a generated password, 16 filters in a fixed order, a 401 for curl and a 302 for a browser. Then we replace the defaults with our own <code>SecurityFilterChain</code> bean (Spring Security 7, the version that ships with Spring Boot 4.1.2), place our own filter inside the chain, and hit three traps that cost students hours on StackOverflow.</p>

<h3>In everyday life first</h3>
<p>Think of the security desk of a university building. Everyone passes the same row of checkpoints in the same order: the guard checks the card, the scanner reads it, the receptionist looks up which floors the card opens, and only then does the elevator move. If the card is missing you are sent to the "get a card" counter (401: who are you?). If the card is valid but does not open floor 9 you are turned back (403: I know you, but no). Spring Security is that row of checkpoints. Each checkpoint is a servlet <em>filter</em>; the row is the <em>filter chain</em>; your controller is the elevator.</p>

<h3>Experiment 1: add the starter, configure nothing</h3>
<p>A controller with one endpoint, plus <code>spring-boot-starter-security</code> in the POM (nothing else changed):</p>
${MA91_A}
<p>The startup log, with <code>logging.level.org.springframework.security.web.DefaultSecurityFilterChain=DEBUG</code> to see the chain:</p>
${OUT91_START}
<ul>
  <li>Spring Boot created one user, <code>user</code>, with a random password printed once. It is only a placeholder: the WARN says so.</li>
  <li>"Will secure any request with filters" lists the 16 filters every request now passes, in order. You never wrote them; auto-configuration did.</li>
</ul>
<p>Now the same endpoint from curl, from a "browser" (<code>Accept: text/html</code>), with the password, and a POST:</p>
${OUT91_CURL}
<ul>
  <li><strong>curl</strong> gets <code>401</code> with <code>WWW-Authenticate: Basic</code>: "tell me who you are, using HTTP Basic".</li>
  <li><strong>A browser</strong> gets <code>302</code> to <code>/login</code>, a login page Spring generates for you. Same filter chain; the entry point chooses by the <code>Accept</code> header.</li>
  <li>Even the 401 carries security headers (<code>X-Frame-Options: DENY</code>, <code>X-Content-Type-Options: nosniff</code>, no-cache) written by <code>HeaderWriterFilter</code>.</li>
  <li>With the right password, <code>GET</code> works. <code>POST</code> with the same password is refused. Why? The next experiment.</li>
</ul>

<h3>Experiment 2: why the POST with a correct password got 401</h3>
<p>Same request with <code>logging.level.org.springframework.security=DEBUG</code>:</p>
${OUT91_POST}
<p>Read it top to bottom. <code>CsrfFilter</code> (5th in the chain) found no CSRF token and answered 403. It runs <em>before</em> <code>BasicAuthenticationFilter</code> (11th), so the user was never authenticated. The 403 is rendered by forwarding to <code>/error</code>, and <code>/error</code> is itself secured: the anonymous request to <code>/error</code> gets the Basic entry point, so the client sees <strong>401</strong>. Two lessons: the order of filters decides what happens, and an error page that requires login turns every error into a 401. Keep both in mind; they come back in 9.3.</p>

<h3>The chain from the outside in</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">DelegatingFilterProxy</span><span class="v">The one filter Spring Boot registers in Tomcat (named <code>springSecurityFilterChain</code>). It forwards to a Spring bean.</span></div>
  <div class="kv"><span class="k">FilterChainProxy</span><span class="v">That bean. It holds one or more <code>SecurityFilterChain</code>s and picks the first whose matcher fits the request.</span></div>
  <div class="kv"><span class="k">SecurityFilterChain</span><span class="v">An ordered list of security filters for a set of URLs. This is what you declare as a <code>@Bean</code>.</span></div>
  <div class="kv"><span class="k">SecurityContextHolder</span><span class="v">Thread-local box holding the current <code>Authentication</code>. Authentication filters fill it; <code>AuthorizationFilter</code> and your controller read it.</span></div>
  <div class="kv"><span class="k">ExceptionTranslationFilter</span><span class="v">Turns "not authenticated" into the entry point (401/302) and "authenticated but denied" into 403.</span></div>
  <div class="kv"><span class="k">AuthorizationFilter</span><span class="v">Last in the chain: applies your URL rules (<code>permitAll</code>, <code>hasRole</code>, <code>authenticated</code>).</span></div>
</div>

<h3>Experiment 3: our own SecurityFilterChain</h3>
<p>In Spring Security 5 you extended <code>WebSecurityConfigurerAdapter</code>. That class is gone. The current way is a bean that receives <code>HttpSecurity</code> and returns a chain:</p>
${MA91_B}
${MA91_USERS}
<p>Rules are read top to bottom and the <strong>first match wins</strong>: <code>GET /labs</code> is public, <code>/admin/**</code> needs <code>ROLE_ADMIN</code>, everything else needs any logged-in user. <code>STATELESS</code> means no HTTP session is created, so every request must carry its credentials. CSRF is disabled because this API does not rely on a session cookie (Chapter 10.4 explains when that is safe). Passwords are stored encoded (lesson 9.2). The chain the application built:</p>
${OUT91_CHAIN}
<p>Compare with the default: <code>CsrfFilter</code>, the form-login filters and the generated login/logout pages are gone, <code>SessionManagementFilter</code> appeared, and our <code>GhiNhat</code> sits exactly where we asked, just before <code>AuthorizationFilter</code>. The requests:</p>
${OUT91_BCURL}
<p>401 = no or wrong credentials. 403 = credentials fine, role insufficient. Note the authorities of <code>an</code>: besides <code>ROLE_STUDENT</code> there is <code>FACTOR_PASSWORD</code>. Spring Security 7 records <em>which factor</em> was used to log in (password, bearer token, one-time token…) so that rules like "this action needs a second factor" can be written. Keep it in mind: code that blindly turns every authority into a role name will break (we hit exactly that in 9.3).</p>

<h3>Seeing the chain from inside: a filter of our own</h3>
${MA91_GHI}
<p>What it printed for the seven requests above:</p>
${OUT91_GHI}
<ul>
  <li>For <code>GET /labs</code> the user is <code>anonymousUser</code> with <code>ROLE_ANONYMOUS</code>: <code>AnonymousAuthenticationFilter</code> fills the context so that later code never sees <code>null</code>.</li>
  <li>The wrong password never reached <code>GhiNhat</code>: <code>BasicAuthenticationFilter</code> stopped it earlier.</li>
  <li>For the 401 on <code>/bookings</code> and the 403 on <code>/admin/stats</code> there is a first line but no "trả về" line: <code>AuthorizationFilter</code> (after us) threw, the exception travelled back through <code>GhiNhat</code>, and <code>ExceptionTranslationFilter</code> (before us) wrote the response.</li>
</ul>

<h3>Three traps we measured</h3>
${OUT91_BAY}
<ol>
  <li><strong>CSRF left on in a stateless API</strong> (profile <code>csrf</code>): every POST/PUT/PATCH/DELETE fails, and because of the secured <code>/error</code>, it fails as 401 rather than 403. The symptom "GET works, POST says unauthorized" is almost always this.</li>
  <li><strong>Declaring the filter as a <code>@Bean</code></strong> (profile <code>trung</code>): Spring Boot registers every <code>Filter</code> bean in Tomcat too, so it runs twice — once inside the security chain, once as a plain servlet filter. Either do not make it a bean, or add a <code>FilterRegistrationBean</code> with <code>setEnabled(false)</code>.</li>
  <li><strong>Rules in the wrong order</strong> (profile <code>sai</code>):</li>
</ol>
${MA91_SAI}
${OUT91_SAI}
<p>The mistake is caught at startup with a clear message, which is far better than a rule that silently never applies. Read the message: it names the method that came too late.</p>

<h3>The Spring Security 5 recipe no longer compiles</h3>
${MA91_CU}
${OUT91_CU}
<p><code>WebSecurityConfigurerAdapter</code> was deprecated in 5.7 and removed in 6.0; <code>authorizeRequests()</code> and <code>antMatchers()</code> went with it. If a tutorial extends that class, it was written before 2022. SWP391 projects that still run Spring Boot 2 use it — read them, but write new code in the bean style.</p>

<h3>🕵️ Hacker corner — a regex that forgot one character</h3>
<p>In May 2022 Spring published CVE-2022-22978 (CVSS 9.8). Applications that protected URLs with <code>RegexRequestMatcher</code> and a pattern containing <code>.</code> could be bypassed: in Java regex the dot does not match a line break, so a URL with an encoded newline (<code>%0a</code>) slipped past a rule like <code>/admin/.*</code> and reached the controller unauthenticated. The fix (5.5.7, 5.6.4) compiled patterns with <code>DOTALL</code>. The general lessons hold in Spring Security 7:</p>
<ul>
  <li>Prefer the simple path matchers (<code>requestMatchers("/admin/**")</code>) over hand-written regex.</li>
  <li>Default-deny: end with <code>anyRequest().authenticated()</code> (or <code>denyAll()</code>) so a URL you forgot is closed, not open.</li>
  <li>Do not rely only on URL rules for sensitive actions; also check in the method (<code>@PreAuthorize</code>, lesson 9.6). Two locks, two different mechanisms.</li>
  <li>Subscribe to the Spring security advisories and upgrade patch versions quickly.</li>
</ul>

<h3>Compared with Node.js</h3>
<p>In Express the chain is the order of <code>app.use()</code> calls: <code>helmet()</code> for headers (like <code>HeaderWriterFilter</code>), a session or JWT middleware (like the authentication filters), then a function that returns 401/403 before the route runs. Nothing is on by default — an Express app is open until you add middleware — while Spring Security is closed the moment the dependency appears. Passport.js plays the role of the authentication providers. The interview line: "Spring Security is a servlet filter chain in front of the DispatcherServlet; Express auth is middleware ordering".</p>

<h3>In real life and at work</h3>
<ul>
  <li>In a team, the first pull request after adding the starter usually breaks the frontend: every call returns 401. Agree on the public endpoints first (login, register, health, static schedule) and write them in one place.</li>
  <li>When a request "mysteriously" returns 401 or 403, switch <code>org.springframework.security</code> to DEBUG for one run. The log names the filter that decided, as in Experiment 2.</li>
  <li>The generated password is never for production. A real project defines its own <code>UserDetailsService</code> or uses tokens (9.3).</li>
</ul>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"How does a request reach your controller in a Spring Security app?"</strong> — Tomcat → <code>DelegatingFilterProxy</code> → <code>FilterChainProxy</code> → the first matching <code>SecurityFilterChain</code> (headers, authentication filters, anonymous, exception translation, authorization) → <code>DispatcherServlet</code> → controller.</li>
  <li><strong>"401 or 403?"</strong> — 401: we do not know who you are (missing/invalid credentials, comes with <code>WWW-Authenticate</code>). 403: we know you, you may not do this.</li>
  <li><strong>"Why does my POST fail while GET works?"</strong> — CSRF protection is on; for a stateless token API disable it, for a cookie-session app send the token.</li>
  <li><strong>"WebSecurityConfigurerAdapter?"</strong> — Removed in Spring Security 6; declare <code>SecurityFilterChain</code> beans. Rules are ordered, first match wins, <code>anyRequest()</code> last.</li>
</ol>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
  <li>Run the custom chain above. Before each command, write down the status you expect: <code>GET /labs</code> anonymous, <code>GET /bookings</code> anonymous, <code>GET /admin/stats</code> as <code>an</code>, as <code>admin</code>, <code>POST /bookings</code> as <code>an</code>.</li>
  <li>Start it again with CSRF left on and repeat the POST. Explain the status from the DEBUG log.</li>
  <li>Make <code>GhiNhat</code> a <code>@Bean</code> and count how many lines one request prints.</li>
</ol>
<p><strong>Done when:</strong> your five predictions match, you can name the filter that answered the CSRF POST and why the client saw 401, and you can explain the doubled lines.</p></div>
${giai('Show the expected results', `<p>200, 401, 403, 200, 200 — the outputs under Experiment 3. With CSRF on, <code>CsrfFilter</code> answers 403 before <code>BasicAuthenticationFilter</code> runs; the forward to the secured <code>/error</code> turns it into 401 (Experiment 2). As a bean the filter is registered twice and prints two lines per pass (the trap output above).</p>`)}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Filter chain</span><span class="v">Ordered list of servlet filters every request passes before the controller.</span></div>
  <div class="kv"><span class="k">Authentication</span><span class="v">Proving who you are (password, token). Result: an <code>Authentication</code> in the security context.</span></div>
  <div class="kv"><span class="k">Authorization</span><span class="v">Deciding whether that identity may do this request.</span></div>
  <div class="kv"><span class="k">Entry point</span><span class="v">What to send when authentication is missing: 401 + <code>WWW-Authenticate</code>, or a redirect to a login page.</span></div>
  <div class="kv"><span class="k">CSRF</span><span class="v">Cross-site request forgery: a foreign site making the browser send a request with your cookies.</span></div>
  <div class="kv"><span class="k">Stateless</span><span class="v">No server session; every request carries its own credentials.</span></div>
  <div class="kv"><span class="k">Factor authority</span><span class="v">Spring Security 7 authority like <code>FACTOR_PASSWORD</code> recording how the user authenticated.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>One dependency closes every endpoint: generated user, 16 filters, 401 for API clients, 302 to <code>/login</code> for browsers.</li>
  <li>Order matters: CSRF runs before authentication, and a secured <code>/error</code> turns errors into 401.</li>
  <li>Declare a <code>SecurityFilterChain</code> bean; rules top to bottom, first match wins, <code>anyRequest()</code> last (checked at startup).</li>
  <li>401 = unknown caller, 403 = known caller without permission; <code>ExceptionTranslationFilter</code> decides which.</li>
  <li>Own filters go in with <code>addFilterBefore/After</code>; do not also expose them as beans.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://docs.spring.io/spring-security/reference/servlet/architecture.html', '🍃', 'Spring Security — Servlet architecture', 'DelegatingFilterProxy, FilterChainProxy, SecurityFilterChain, filter order.')}
${tl('https://docs.spring.io/spring-security/reference/servlet/authorization/authorize-http-requests.html', '🔐', 'Authorize HttpServletRequests', 'requestMatchers, rule order, default deny.')}
${tl('https://spring.io/security/cve-2022-22978', '🕵️', 'CVE-2022-22978', 'Authorization bypass in RegexRequestMatcher.')}

<h3>Sources</h3>
<ul>
  <li>Outputs above: <code>c9.a.App</code> (only spring-boot-starter-security on the classpath) and <code>c9.b.App</code> in <code>lab/c9/sec</code>, Spring Boot 4.1.2, Spring Security 7.1.2, Tomcat 11.0.27, Java 21.0.12.1 (20/11/2026). Port 41920 on the host is shown as 8080.</li>
  <li>Spring Security advisory CVE-2022-22978, 16/05/2022.</li>
</ul>
</div>
`;

const L91_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1</span>
<h2>Chuỗi filter của Spring Security</h2>
<p class="lead">Tới giờ mọi endpoint của LabFlow trả lời bất kỳ ai. Chương này đặt một cánh cửa phía trước. Trước khi viết form đăng nhập nào, ta thêm đúng một phụ thuộc rồi đọc xem nó đã làm gì: một mật khẩu sinh ngẫu nhiên, 16 filter theo thứ tự cố định, curl nhận 401 còn trình duyệt nhận 302. Sau đó ta thay mặc định bằng bean <code>SecurityFilterChain</code> của mình (Spring Security 7, bản đi kèm Spring Boot 4.1.2), cài filter riêng vào giữa chuỗi, và gặp ba cái bẫy từng làm sinh viên mất hàng giờ trên StackOverflow.</p>

<h3>Đời thường trước đã</h3>
<p>Hãy nghĩ tới quầy an ninh của một toà nhà trường. Ai cũng đi qua cùng một hàng chốt theo cùng thứ tự: bảo vệ xem thẻ, máy quét đọc thẻ, lễ tân tra thẻ mở được tầng nào, rồi thang máy mới chạy. Không có thẻ thì bị chỉ sang quầy "làm thẻ" (401: bạn là ai?). Thẻ hợp lệ nhưng không mở tầng 9 thì bị mời quay lại (403: tôi biết bạn, nhưng không được). Spring Security chính là hàng chốt đó. Mỗi chốt là một <em>filter</em> của servlet; cả hàng là <em>chuỗi filter</em>; controller của bạn là thang máy.</p>

<h3>Thí nghiệm 1: thêm starter, không cấu hình gì</h3>
<p>Một controller với một endpoint, cộng thêm <code>spring-boot-starter-security</code> trong POM (không đổi gì khác):</p>
${MA91_A}
<p>Log khởi động, bật <code>logging.level.org.springframework.security.web.DefaultSecurityFilterChain=DEBUG</code> để thấy chuỗi:</p>
${OUT91_START}
<ul>
  <li>Spring Boot tạo sẵn một người dùng <code>user</code> với mật khẩu ngẫu nhiên in ra đúng một lần. Nó chỉ là đồ tạm: dòng WARN nói rõ như vậy.</li>
  <li>"Will secure any request with filters" liệt kê 16 filter mà mọi request từ giờ phải đi qua, theo thứ tự. Bạn không viết filter nào; auto-configuration làm hết.</li>
</ul>
<p>Giờ gọi cùng endpoint bằng curl, bằng "trình duyệt" (<code>Accept: text/html</code>), kèm mật khẩu, và một lệnh POST:</p>
${OUT91_CURL}
<ul>
  <li><strong>curl</strong> nhận <code>401</code> kèm <code>WWW-Authenticate: Basic</code>: "hãy cho biết bạn là ai, bằng HTTP Basic".</li>
  <li><strong>Trình duyệt</strong> nhận <code>302</code> sang <code>/login</code>, trang đăng nhập Spring tự sinh. Cùng một chuỗi filter; entry point chọn cách trả lời theo header <code>Accept</code>.</li>
  <li>Ngay cả phản hồi 401 cũng mang header bảo mật (<code>X-Frame-Options: DENY</code>, <code>X-Content-Type-Options: nosniff</code>, không cache) do <code>HeaderWriterFilter</code> ghi.</li>
  <li>Có đúng mật khẩu thì <code>GET</code> chạy. <code>POST</code> cùng mật khẩu lại bị từ chối. Vì sao? Xem thí nghiệm kế.</li>
</ul>

<h3>Thí nghiệm 2: vì sao POST đúng mật khẩu vẫn nhận 401</h3>
<p>Cùng request đó với <code>logging.level.org.springframework.security=DEBUG</code>:</p>
${OUT91_POST}
<p>Đọc từ trên xuống. <code>CsrfFilter</code> (thứ 5 trong chuỗi) không thấy CSRF token nên trả 403. Nó chạy <em>trước</em> <code>BasicAuthenticationFilter</code> (thứ 11), nên người dùng chưa hề được xác thực. Lỗi 403 được hiển thị bằng cách chuyển tiếp sang <code>/error</code>, mà <code>/error</code> cũng bị bảo vệ: request ẩn danh tới <code>/error</code> gặp entry point Basic, nên client thấy <strong>401</strong>. Hai bài học: thứ tự filter quyết định chuyện gì xảy ra, và trang lỗi đòi đăng nhập sẽ biến mọi lỗi thành 401. Nhớ cả hai; chúng quay lại ở bài 9.3.</p>

<h3>Chuỗi filter, từ ngoài vào trong</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">DelegatingFilterProxy</span><span class="v">Filter duy nhất Spring Boot đăng ký vào Tomcat (tên <code>springSecurityFilterChain</code>). Nó chuyển tiếp sang một bean của Spring.</span></div>
  <div class="kv"><span class="k">FilterChainProxy</span><span class="v">Chính bean đó. Nó giữ một hay nhiều <code>SecurityFilterChain</code> và chọn chuỗi đầu tiên khớp với request.</span></div>
  <div class="kv"><span class="k">SecurityFilterChain</span><span class="v">Danh sách filter bảo mật có thứ tự cho một nhóm URL. Đây là thứ bạn khai báo bằng <code>@Bean</code>.</span></div>
  <div class="kv"><span class="k">SecurityContextHolder</span><span class="v">Chiếc hộp theo luồng (thread-local) giữ <code>Authentication</code> hiện tại. Filter xác thực bỏ vào; <code>AuthorizationFilter</code> và controller đọc ra.</span></div>
  <div class="kv"><span class="k">ExceptionTranslationFilter</span><span class="v">Đổi "chưa xác thực" thành entry point (401/302), và "đã xác thực nhưng bị từ chối" thành 403.</span></div>
  <div class="kv"><span class="k">AuthorizationFilter</span><span class="v">Đứng cuối chuỗi: áp các luật URL của bạn (<code>permitAll</code>, <code>hasRole</code>, <code>authenticated</code>).</span></div>
</div>

<h3>Thí nghiệm 3: SecurityFilterChain của chính mình</h3>
<p>Ở Spring Security 5 bạn kế thừa <code>WebSecurityConfigurerAdapter</code>. Lớp đó đã bị gỡ. Cách hiện nay là một bean nhận <code>HttpSecurity</code> rồi trả về một chuỗi:</p>
${MA91_B}
${MA91_USERS}
<p>Luật được đọc từ trên xuống và <strong>luật khớp đầu tiên thắng</strong>: <code>GET /labs</code> công khai, <code>/admin/**</code> cần <code>ROLE_ADMIN</code>, mọi thứ còn lại cần một người dùng đã đăng nhập bất kỳ. <code>STATELESS</code> nghĩa là không tạo phiên HTTP, nên request nào cũng phải tự mang thông tin xác thực. CSRF bị tắt vì API này không dựa vào cookie phiên (bài 10.4 giải thích khi nào tắt là an toàn). Mật khẩu được lưu đã mã hoá (bài 9.2). Chuỗi mà ứng dụng dựng ra:</p>
${OUT91_CHAIN}
<p>So với mặc định: <code>CsrfFilter</code>, các filter đăng nhập bằng form và trang login/logout tự sinh đã biến mất, <code>SessionManagementFilter</code> xuất hiện, và <code>GhiNhat</code> của ta nằm đúng chỗ đã yêu cầu, ngay trước <code>AuthorizationFilter</code>. Các request:</p>
${OUT91_BCURL}
<p>401 = thiếu hoặc sai thông tin đăng nhập. 403 = đăng nhập đúng nhưng vai trò không đủ. Để ý danh sách quyền của <code>an</code>: ngoài <code>ROLE_STUDENT</code> còn có <code>FACTOR_PASSWORD</code>. Spring Security 7 ghi lại <em>yếu tố nào</em> đã dùng để đăng nhập (mật khẩu, bearer token, mã một lần…) để có thể viết luật kiểu "thao tác này cần thêm yếu tố thứ hai". Nhớ điều này: mã nào đổi mù quáng mọi quyền thành tên vai trò sẽ hỏng (ta gặp đúng chuyện đó ở bài 9.3).</p>

<h3>Nhìn chuỗi từ bên trong: một filter của riêng ta</h3>
${MA91_GHI}
<p>Nó in ra gì cho bảy request ở trên:</p>
${OUT91_GHI}
<ul>
  <li>Với <code>GET /labs</code> người dùng là <code>anonymousUser</code> mang <code>ROLE_ANONYMOUS</code>: <code>AnonymousAuthenticationFilter</code> lấp đầy context để mã phía sau không bao giờ gặp <code>null</code>.</li>
  <li>Lần sai mật khẩu không hề tới <code>GhiNhat</code>: <code>BasicAuthenticationFilter</code> đã chặn từ trước.</li>
  <li>Với 401 ở <code>/bookings</code> và 403 ở <code>/admin/stats</code> có dòng đầu nhưng không có dòng "trả về": <code>AuthorizationFilter</code> (đứng sau ta) ném exception, exception đi ngược qua <code>GhiNhat</code>, và <code>ExceptionTranslationFilter</code> (đứng trước ta) ghi phản hồi.</li>
</ul>

<h3>Ba cái bẫy đã đo</h3>
${OUT91_BAY}
<ol>
  <li><strong>Để CSRF bật trong API stateless</strong> (profile <code>csrf</code>): mọi POST/PUT/PATCH/DELETE đều hỏng, và vì <code>/error</code> bị bảo vệ nên nó hỏng dưới dạng 401 chứ không phải 403. Triệu chứng "GET chạy, POST báo chưa xác thực" gần như luôn là chuyện này.</li>
  <li><strong>Khai filter thành <code>@Bean</code></strong> (profile <code>trung</code>): Spring Boot đăng ký mọi bean <code>Filter</code> vào Tomcat nữa, nên nó chạy hai lần — một lần trong chuỗi bảo mật, một lần như filter servlet thường. Hoặc đừng biến nó thành bean, hoặc thêm <code>FilterRegistrationBean</code> với <code>setEnabled(false)</code>.</li>
  <li><strong>Luật sai thứ tự</strong> (profile <code>sai</code>):</li>
</ol>
${MA91_SAI}
${OUT91_SAI}
<p>Lỗi này bị bắt ngay lúc khởi động với thông báo rõ ràng — tốt hơn nhiều so với một luật lặng lẽ không bao giờ được áp. Đọc thông báo: nó gọi tên phương thức đã đến quá muộn.</p>

<h3>Công thức Spring Security 5 không còn biên dịch được</h3>
${MA91_CU}
${OUT91_CU}
<p><code>WebSecurityConfigurerAdapter</code> bị đánh dấu lỗi thời ở 5.7 và bị gỡ ở 6.0; <code>authorizeRequests()</code> và <code>antMatchers()</code> đi theo. Hướng dẫn nào còn kế thừa lớp đó là viết trước năm 2022. Đồ án SWP391 còn chạy Spring Boot 2 vẫn dùng nó — đọc được, nhưng mã mới hãy viết kiểu bean.</p>

<h3>🕵️ Góc hacker — một regex quên một ký tự</h3>
<p>Tháng 5/2022 Spring công bố CVE-2022-22978 (CVSS 9.8). Ứng dụng nào bảo vệ URL bằng <code>RegexRequestMatcher</code> với mẫu có dấu <code>.</code> đều có thể bị vượt: trong regex Java, dấu chấm không khớp ký tự xuống dòng, nên URL chứa ký tự xuống dòng đã mã hoá (<code>%0a</code>) lọt qua luật kiểu <code>/admin/.*</code> và tới thẳng controller mà không cần đăng nhập. Bản vá (5.5.7, 5.6.4) biên dịch mẫu với cờ <code>DOTALL</code>. Bài học chung vẫn đúng với Spring Security 7:</p>
<ul>
  <li>Ưu tiên matcher đường dẫn đơn giản (<code>requestMatchers("/admin/**")</code>) thay vì regex tự viết.</li>
  <li>Mặc định là cấm: kết thúc bằng <code>anyRequest().authenticated()</code> (hoặc <code>denyAll()</code>) để URL bị quên là URL đóng, không phải mở.</li>
  <li>Thao tác nhạy cảm đừng chỉ dựa vào luật URL; kiểm thêm trong phương thức (<code>@PreAuthorize</code>, bài 9.6). Hai ổ khoá, hai cơ chế khác nhau.</li>
  <li>Theo dõi thông báo bảo mật của Spring và nâng bản vá sớm.</li>
</ul>

<h3>So với Node.js</h3>
<p>Trong Express, chuỗi chính là thứ tự các lệnh <code>app.use()</code>: <code>helmet()</code> cho header (giống <code>HeaderWriterFilter</code>), middleware phiên hoặc JWT (giống filter xác thực), rồi một hàm trả 401/403 trước khi route chạy. Không có gì bật sẵn — ứng dụng Express mở toang tới khi bạn thêm middleware — còn Spring Security đóng lại ngay khi phụ thuộc xuất hiện. Passport.js đóng vai các authentication provider. Câu trả lời phỏng vấn: "Spring Security là chuỗi filter servlet đứng trước DispatcherServlet; xác thực trong Express là thứ tự middleware".</p>

<h3>Đời thường và đi làm</h3>
<ul>
  <li>Trong nhóm, pull request đầu tiên sau khi thêm starter thường làm frontend vỡ: gọi gì cũng 401. Thống nhất trước các endpoint công khai (đăng nhập, đăng ký, health, lịch phòng) và viết chúng ở một chỗ.</li>
  <li>Khi một request "bí ẩn" trả 401 hay 403, bật <code>org.springframework.security</code> lên DEBUG trong một lần chạy. Log gọi tên filter đã quyết định, như thí nghiệm 2.</li>
  <li>Mật khẩu tự sinh không bao giờ dùng cho production. Dự án thật tự khai <code>UserDetailsService</code> hoặc dùng token (bài 9.3).</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Trong ứng dụng có Spring Security, request đi tới controller thế nào?"</strong> — Tomcat → <code>DelegatingFilterProxy</code> → <code>FilterChainProxy</code> → <code>SecurityFilterChain</code> khớp đầu tiên (header, filter xác thực, ẩn danh, dịch exception, phân quyền) → <code>DispatcherServlet</code> → controller.</li>
  <li><strong>"401 hay 403?"</strong> — 401: chưa biết bạn là ai (thiếu/sai thông tin xác thực, kèm <code>WWW-Authenticate</code>). 403: biết bạn rồi, nhưng bạn không được làm việc này.</li>
  <li><strong>"Vì sao POST hỏng trong khi GET chạy?"</strong> — Bảo vệ CSRF đang bật; API token stateless thì tắt, ứng dụng dùng cookie phiên thì gửi kèm token.</li>
  <li><strong>"WebSecurityConfigurerAdapter?"</strong> — Đã bị gỡ ở Spring Security 6; khai bean <code>SecurityFilterChain</code>. Luật có thứ tự, khớp đầu tiên thắng, <code>anyRequest()</code> đứng cuối.</li>
</ol>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
  <li>Chạy chuỗi tự khai ở trên. Trước mỗi lệnh, ghi ra mã trạng thái bạn đoán: <code>GET /labs</code> ẩn danh, <code>GET /bookings</code> ẩn danh, <code>GET /admin/stats</code> với <code>an</code>, với <code>admin</code>, <code>POST /bookings</code> với <code>an</code>.</li>
  <li>Khởi động lại với CSRF để bật rồi gửi lại lệnh POST. Giải thích mã trạng thái bằng log DEBUG.</li>
  <li>Biến <code>GhiNhat</code> thành <code>@Bean</code> rồi đếm một request in ra bao nhiêu dòng.</li>
</ol>
<p><strong>Đạt khi:</strong> năm dự đoán đều khớp, bạn gọi đúng tên filter đã trả lời lệnh POST bị CSRF chặn và vì sao client thấy 401, và giải thích được vì sao dòng log bị nhân đôi.</p></div>
${giai('Xem kết quả mong đợi', `<p>200, 401, 403, 200, 200 — output ở thí nghiệm 3. Khi CSRF bật, <code>CsrfFilter</code> trả 403 trước khi <code>BasicAuthenticationFilter</code> chạy; lần chuyển tiếp sang <code>/error</code> bị bảo vệ biến nó thành 401 (thí nghiệm 2). Khi là bean, filter được đăng ký hai lần và in hai dòng mỗi lượt (output bẫy ở trên).</p>`)}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Chuỗi filter</span><span class="v">Danh sách filter servlet có thứ tự mà mọi request đi qua trước khi tới controller.</span></div>
  <div class="kv"><span class="k">Xác thực (authentication)</span><span class="v">Chứng minh bạn là ai (mật khẩu, token). Kết quả: một <code>Authentication</code> trong security context.</span></div>
  <div class="kv"><span class="k">Phân quyền (authorization)</span><span class="v">Quyết định danh tính đó có được làm request này không.</span></div>
  <div class="kv"><span class="k">Entry point</span><span class="v">Thứ gửi về khi thiếu xác thực: 401 + <code>WWW-Authenticate</code>, hoặc chuyển hướng sang trang đăng nhập.</span></div>
  <div class="kv"><span class="k">CSRF</span><span class="v">Giả mạo request liên trang: một trang lạ khiến trình duyệt gửi request kèm cookie của bạn.</span></div>
  <div class="kv"><span class="k">Stateless</span><span class="v">Không có phiên ở server; mỗi request tự mang thông tin xác thực.</span></div>
  <div class="kv"><span class="k">Quyền yếu tố (factor)</span><span class="v">Quyền kiểu <code>FACTOR_PASSWORD</code> của Spring Security 7, ghi lại người dùng đã xác thực bằng cách nào.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Một phụ thuộc đóng mọi endpoint: người dùng tự sinh, 16 filter, client API nhận 401, trình duyệt nhận 302 sang <code>/login</code>.</li>
  <li>Thứ tự quan trọng: CSRF chạy trước xác thực, và <code>/error</code> bị bảo vệ biến lỗi thành 401.</li>
  <li>Khai bean <code>SecurityFilterChain</code>; luật từ trên xuống, khớp đầu tiên thắng, <code>anyRequest()</code> cuối cùng (kiểm lúc khởi động).</li>
  <li>401 = chưa biết người gọi, 403 = biết nhưng không có quyền; <code>ExceptionTranslationFilter</code> quyết định cái nào.</li>
  <li>Filter tự viết cài bằng <code>addFilterBefore/After</code>; đừng đồng thời khai nó thành bean.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.spring.io/spring-security/reference/servlet/architecture.html', '🍃', 'Spring Security — Servlet architecture', 'DelegatingFilterProxy, FilterChainProxy, SecurityFilterChain, thứ tự filter.')}
${tl('https://docs.spring.io/spring-security/reference/servlet/authorization/authorize-http-requests.html', '🔐', 'Authorize HttpServletRequests', 'requestMatchers, thứ tự luật, mặc định cấm.')}
${tl('https://spring.io/security/cve-2022-22978', '🕵️', 'CVE-2022-22978', 'Vượt phân quyền ở RegexRequestMatcher.')}

<h3>Nguồn</h3>
<ul>
  <li>Output ở trên: <code>c9.a.App</code> (classpath chỉ có spring-boot-starter-security) và <code>c9.b.App</code> trong <code>lab/c9/sec</code>, Spring Boot 4.1.2, Spring Security 7.1.2, Tomcat 11.0.27, Java 21.0.12.1 (20/11/2026). Cổng 41920 trên máy được ghi thành 8080.</li>
  <li>Thông báo bảo mật Spring CVE-2022-22978, 16/05/2022.</li>
</ul>
</div>
`;

// ===== Bài 9.2 =====
const MA92_COST = java("static void cost() {\n    System.out.println(\"== BCrypt: thời gian một lần encode theo cost (trung vị) ==\");\n    for (int c : new int[] {4, 8, 10, 12, 13, 14}) {\n        BCryptPasswordEncoder e = new BCryptPasswordEncoder(c);\n        e.encode(PW);                                   // làm nóng JIT\n        int n = c <= 10 ? 15 : c == 12 ? 7 : 5;\n        long ms = trungVi(() -> e.encode(PW), n);\n        System.out.printf(\"cost %2d  (2^%-2d = %6d vòng)  %5d ms%n\", c, c, 1 << c, ms);\n    }\n}");
const OUT92_BAM = out("== BCrypt: thời gian một lần encode theo cost (trung vị) ==\ncost  4  (2^4  =     16 vòng)      1 ms\ncost  8  (2^8  =    256 vòng)     15 ms\ncost 10  (2^10 =   1024 vòng)     59 ms\ncost 12  (2^12 =   4096 vòng)    240 ms\ncost 13  (2^13 =   8192 vòng)    479 ms\ncost 14  (2^14 =  16384 vòng)    945 ms\n== Cùng một mật khẩu, encode hai lần ==\nh1 = $2a$10$VvrZpKsSUQoU/U7uXGhlYe8K6H3tihXPtoGY9.KUeSgmmiujcJ8FK\nh2 = $2a$10$1A7ffG7UmokHdRPOsncpRuTKIu/rNFE/mziXqAh4OXXlIhRtZZSgm\nh1.equals(h2)      = false\nmatches(PW, h1)    = true\nmatches(PW, h2)    = true\nmatches(sai, h1)   = false\nphiên bản  = $2a$   cost = 10   muối (22 ký tự) = VvrZpKsSUQoU/U7uXGhlYe   băm (31 ký tự) = 8K6H3tihXPtoGY9.KUeSgmmiujcJ8FK\nđộ dài = 60\n== DelegatingPasswordEncoder ==\nencode         = {bcrypt}$2a$10$aLG6mUjJsWvrwQLgC9Ic5eM0lPYDB2sb98zfiDPOflNGhiVO7PjLG\nbcrypt cost 10  matches=true  upgradeEncoding=false   {bcrypt}$2a$10$aLG6mUjJsWvrwQLgC9Ic5eM0lPYDB2sb98zfiDPOflNGh…\nnoop            matches=true  upgradeEncoding=true   {noop}LabFlow-2026!\nSHA-256         matches=true  upgradeEncoding=true   {SHA-256}{Cbin+JUFVESMQcfeFgU68RqDSf+vt5UMLms2pkU3cuU=}17336…\nbcrypt cost 4   matches=true  upgradeEncoding=true   {bcrypt}$2a$04$hd0PKYGXBOPPDyNnzLfR..aW9LenNgM0SQOciTWfUiv98…\nkhông có {id}  ⇒ IllegalArgumentException: Given that there is no default password encoder configured, each password must have a password encoding prefix. Please either prefix this password with '{noop}' or set a default password encoder in `DelegatingPasswordEncoder`.\nBCrypt(12).upgradeEncoding(hash cost 10) = true\n== Các encoder khác (mặc định khuyến nghị của Spring Security 5.8+) ==\nbcrypt (cost 10)     59 ms   $2a$10$4fAPvhM1ije.9C3uPSjvBOfjYNTyXkwDdWgrXNWNHP8e4la36kd8C\npbkdf2 v5_8          67 ms   cb3bf58b28374277fbaaefcbc1f1de228bc5e8f5d186271fa693f5cfb3a6622542fc2a…\nscrypt v5_8         148 ms   $100801$SNKyYyR1uxPiri4uInW8Og==$uUXG/NYjYFCrDKM6V3q8LDMeSBqnaEsT5FLtq…\nargon2 v5_8          25 ms   $argon2id$v=19$m=16384,t=2,p=1$+ARkT89nH2PgIh4rdTo8Rw$jEtWOoY2Vw/VjijG…\n== Giới hạn 72 byte của BCrypt ==\n72 byte  ⇒ encode OK, độ dài hash 60\n73 byte  ⇒ IllegalArgumentException: password cannot be more than 72 bytes\n\"Mật khẩu tiếng Việt có dấu: \" = 28 ký tự nhưng 39 byte UTF-8\n== Băm nhanh vs băm chậm: số lần thử mỗi giây trên MỘT luồng ==\nSHA-256          14,061,979 lần/giây\nBCrypt cost 10         16.8 lần/giây\nchênh lệch          836,124 lần");
const MA92_PE = java("@Bean\nPasswordEncoder passwordEncoder() { return PasswordEncoderFactories.createDelegatingPasswordEncoder(); }");
const OUT92_TG = out("endpoint               trường hợp              trung vị 25 lần (giây)\n/auth/login-ngay-tho   tên CÓ, sai mật khẩu   0.061705\n/auth/login-ngay-tho   tên KHÔNG có              0.002884\n/auth/login            tên CÓ, sai mật khẩu   0.061073\n/auth/login            tên KHÔNG có              0.060451");
const MA92_NGAY = java("/** BẢN NGÂY THƠ (chỉ để đo thời gian): không thấy tên ⇒ trả 401 NGAY, không băm gì. */\n@PostMapping(\"/login-ngay-tho\")\nResponseEntity<?> ngayTho(@RequestBody DangNhap r) {\n    var h = db.sql(\"select password_hash from users where username = ?\").param(r.username()).query(String.class).optional();\n    if (h.isEmpty() || !pe.matches(r.password(), h.get())) return loi401(\"sai tên đăng nhập hoặc mật khẩu\");\n    return ResponseEntity.ok(Map.of(\"ok\", true));\n}");
const OUT92_NODE = out("bcryptjs hash  = $2b$10$Ny4/1qpDKtvNwUOHFQbTMej0e9fDxlLKfPsudj3hsI7ZdA3pDkvX6\nthời gian      = 79 ms\ncompare đúng   = true");
const MA92_KIEMNODE = java("import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;\nimport org.springframework.security.crypto.factory.PasswordEncoderFactories;\n\npublic class KiemNode {\n    public static void main(String[] a) {\n        String tuNode = a[0];                                   // hash do bcryptjs (Node.js) tạo\n        System.out.println(\"BCrypt.matches            = \" + new BCryptPasswordEncoder().matches(\"LabFlow-2026!\", tuNode));\n        System.out.println(\"Delegating {bcrypt}+hash  = \" + PasswordEncoderFactories.createDelegatingPasswordEncoder().matches(\"LabFlow-2026!\", \"{bcrypt}\" + tuNode));\n    }\n}");
const OUT92_NODEJ = out("BCrypt.matches            = true\nDelegating {bcrypt}+hash  = true");

const L92_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.2</span>
<h2>Password hashing with PasswordEncoder</h2>
<p class="lead">The database will be stolen one day — by an SQL injection, a leaked backup, a laptop left on a bus. The only question is what the thief can do with the <code>password_hash</code> column. This lesson measures it: BCrypt cost from 4 to 14 in milliseconds, SHA-256 against BCrypt in guesses per second (a factor of 836,124 on our machine), the <code>{bcrypt}</code> prefix of <code>DelegatingPasswordEncoder</code>, the 72-byte limit that bit Okta in 2024, and a login endpoint that tells an attacker which usernames exist just by answering faster.</p>

<h3>In everyday life first</h3>
<p>A hotel does not keep your room key at reception; it keeps a way to <em>check</em> a key. Hashing is that: the server keeps a fingerprint of the password, never the password, and at login it fingerprints what you typed and compares. A good password fingerprint is deliberately <em>slow</em> to take — like a lock that needs one second to turn. For you, one second at login is nothing. For a thief trying ten million guesses, one second each is four months.</p>

<h3>Experiment 1: BCrypt cost, measured</h3>
${MA92_COST}
${OUT92_BAM}
<p>Read the four blocks that matter:</p>
<ul>
  <li><strong>Cost:</strong> each +1 doubles the work (2<sup>cost</sup> rounds): 59 ms at the default 10, 240 ms at 12, 945 ms at 14 on one core of our machine. OWASP's guidance is to pick the highest cost that keeps login acceptable on <em>your</em> hardware, typically a few hundred milliseconds. Measure on the production machine; numbers on a laptop mean little.</li>
  <li><strong>Salt:</strong> the same password encoded twice gives two different strings, and both match. The 22 characters after <code>$2a$10$</code> are a random salt stored inside the hash; the last 31 are the hash. Two students with the password <code>123456</code> therefore have different rows, and a precomputed "rainbow table" is useless.</li>
  <li><strong>Fast vs slow:</strong> SHA-256 ran 14 million times per second on one thread; BCrypt cost 10 ran 16.8 times. That ratio is what you buy: the thief's GPU farm is 836,124 times less effective.</li>
  <li><strong>72 bytes:</strong> BCrypt only reads the first 72 bytes of input. Spring Security 7 refuses longer input with <code>IllegalArgumentException</code> instead of silently ignoring the rest. Vietnamese text costs more bytes than characters: 28 characters here are 39 bytes.</li>
</ul>

<h3>DelegatingPasswordEncoder: the {id} prefix</h3>
${MA92_PE}
<p>The encoder Spring recommends is not BCrypt itself but a <em>delegating</em> encoder: new hashes are written with the current default (<code>{bcrypt}</code>), and old hashes are checked by whatever algorithm their prefix names. That is how a ten-year-old system moves from SHA-256 to BCrypt to Argon2 without forcing anyone to reset a password:</p>
<ul>
  <li>Every old format still <code>matches</code>; <code>upgradeEncoding</code> says <code>true</code> for anything that is not the current default — the signal to re-hash at the next successful login (Spring does it for you when your <code>UserDetailsService</code> also implements <code>UserDetailsPasswordService</code>).</li>
  <li>A hash without a prefix is rejected with a long explanatory exception. When you import users from an old system, add the prefix during migration (<code>{bcrypt}</code> for <code>$2a$/$2b$</code> rows).</li>
  <li>A plain <code>BCryptPasswordEncoder(12)</code> also reports <code>upgradeEncoding=true</code> for a cost-10 hash, so raising the cost later is painless.</li>
</ul>

<h3>The other algorithms</h3>
<p>The second block of output above ran the "v5_8" defaults Spring Security recommends: PBKDF2 67 ms, SCrypt 148 ms, Argon2id 25 ms (16 MiB memory, 2 passes). Argon2id and SCrypt are <em>memory-hard</em>: they also need RAM per guess, which hurts GPUs more than CPUs. Both need Bouncy Castle on the classpath (<code>bcprov-jdk18on</code>). BCrypt remains the safe default in Spring; Argon2id is what OWASP lists first today. Do not invent your own (<code>sha256(salt + password)</code> is still fast).</p>

<h3>Experiment 2: the login that leaks usernames</h3>
<p>A login written "naturally": if the username does not exist, answer immediately.</p>
${MA92_NGAY}
<p>25 attempts each, median time:</p>
${OUT92_TG}
<p>The naive endpoint answers an unknown name in 3 ms and a known name in 62 ms. The error message is identical, but the clock is not: an attacker can test a list of student codes and learn which have accounts, then attack only those. Spring's <code>DaoAuthenticationProvider</code> (used by <code>/auth/login</code>, lesson 9.3) runs a BCrypt comparison against a dummy hash when the user is missing: 60 ms either way. Same message, same time, same status. That is also why <code>BadCredentialsException</code> hides <code>UsernameNotFoundException</code> by default.</p>

<h3>🕵️ Hacker corner — three real leaks</h3>
<ul>
  <li><strong>RockYou, December 2009:</strong> 32 million passwords stored in <em>plain text</em> leaked through SQL injection. The list ("rockyou.txt") is still the first dictionary every cracking tool loads.</li>
  <li><strong>LinkedIn, June 2012:</strong> 6.5 million password hashes posted online — SHA-1, <em>no salt</em>. Most were cracked within days. In 2016 the full set turned up: about 117 million accounts. A fast hash without salt is barely better than plain text.</li>
  <li><strong>Okta, October 2024:</strong> Okta's AD/LDAP delegated authentication cached logins under a BCrypt hash of <em>user id + username + password</em>. For usernames of 52 characters or more, the password fell beyond BCrypt's 72 bytes, so any password matched a cached entry. Okta's advisory of 01/11/2024 switched the key to PBKDF2. Lesson: know the limits of your primitive — the reason Spring Security now throws on long input.</li>
</ul>
<p>Defence in this chapter: BCrypt or Argon2id through <code>DelegatingPasswordEncoder</code>, a minimum length (we require 10) rather than composition rules, and identical time and message for every login failure. Lesson 10.5 adds rate limiting.</p>

<h3>Compared with Node.js</h3>
<p>In Node the usual libraries are <code>bcrypt</code> (native) or <code>bcryptjs</code> (pure JS). Hashes are interchangeable with Spring's, which matters when a Node service is rewritten in Spring Boot (or the reverse) and the users table must survive:</p>
${OUT92_NODE}
${MA92_KIEMNODE}
${OUT92_NODEJ}
<p><code>$2b$</code> (Node) and <code>$2a$</code> (Spring default) are both accepted. In a migration, prefix existing rows with <code>{bcrypt}</code> and no user notices.</p>

<h3>In real life and at work</h3>
<ul>
  <li>Never log the request body of <code>/auth/login</code> or <code>/auth/register</code>; a debug log of JSON bodies is a plain-text password file.</li>
  <li>Hashing is CPU work on the request thread. A login storm at 08:00 on registration day is a CPU storm: size the cost with that in mind and measure under load (Chapter 16).</li>
  <li>A password reset never e-mails the old password — the system does not have it. If a site can send you your password, it stores it wrongly.</li>
</ul>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"Why not SHA-256 for passwords?"</strong> — It is designed to be fast: 14 million guesses per second per core here, against 16.8 for BCrypt cost 10. Password hashing must be slow, salted and tunable.</li>
  <li><strong>"Where is the salt stored?"</strong> — Inside the BCrypt string itself (22 characters after the cost), so no extra column is needed.</li>
  <li><strong>"How do you change the algorithm without a password reset?"</strong> — <code>DelegatingPasswordEncoder</code> with <code>{id}</code> prefixes; check old hashes, re-hash on successful login when <code>upgradeEncoding</code> is true.</li>
  <li><strong>"How can a login endpoint leak which users exist?"</strong> — Different message, status or timing. Return one message and keep the timing equal (dummy hash for unknown users).</li>
</ol>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok"><ol>
  <li>Predict, then measure on your machine: the time of one <code>encode</code> at cost 10, 12 and 14. Pick the cost you would use for LabFlow and justify it in one sentence.</li>
  <li>Given <code>{bcrypt}$2a$04$…</code>, <code>{noop}abc</code> and <code>{bcrypt}$2a$10$…</code>, which does <code>upgradeEncoding</code> flag with the default delegating encoder?</li>
  <li>Explain why the naive login is fast for unknown names and how <code>DaoAuthenticationProvider</code> removes the difference.</li>
</ol>
<p><strong>Done when:</strong> your times roughly double per step, you flag exactly the cost-4 and noop hashes, and your explanation mentions the dummy hash.</p></div>
${giai('Show the answers', `<p>About ×4 per two steps (59 → 240 → 945 ms here). <code>upgradeEncoding</code>: noop true, bcrypt cost 4 true, bcrypt cost 10 false (output above). The naive version skips <code>matches</code> when the row is missing; <code>DaoAuthenticationProvider</code> calls <code>matches</code> on a prepared dummy BCrypt hash, so both paths cost one BCrypt comparison (60 ms vs 61 ms in the table).</p>`)}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Hash</span><span class="v">One-way fingerprint: easy to compute, infeasible to reverse.</span></div>
  <div class="kv"><span class="k">Salt</span><span class="v">Random value mixed into each hash so equal passwords give different hashes.</span></div>
  <div class="kv"><span class="k">Cost / work factor</span><span class="v">BCrypt's tuning knob: 2<sup>cost</sup> rounds; +1 doubles the time.</span></div>
  <div class="kv"><span class="k">Memory-hard</span><span class="v">Algorithms (SCrypt, Argon2) that also need RAM per guess, slowing GPUs.</span></div>
  <div class="kv"><span class="k">DelegatingPasswordEncoder</span><span class="v">Encoder that writes <code>{id}hash</code> and verifies any known <code>{id}</code>.</span></div>
  <div class="kv"><span class="k">User enumeration</span><span class="v">Learning which accounts exist from differences in responses or timing.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Store only slow, salted hashes: BCrypt (default, cost 10 = 59 ms here) or Argon2id.</li>
  <li>SHA-256 is 836,124 times faster to guess than BCrypt cost 10 — fast hashes are the wrong tool.</li>
  <li><code>PasswordEncoderFactories.createDelegatingPasswordEncoder()</code>: <code>{bcrypt}</code> prefix, old formats still verify, <code>upgradeEncoding</code> tells you when to re-hash.</li>
  <li>BCrypt reads 72 bytes; Spring Security 7 throws beyond that (Okta 2024 is why it matters).</li>
  <li>Login failures: one message, one status, equal time.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html', '🛡️', 'OWASP Password Storage Cheat Sheet', 'Argon2id, scrypt, bcrypt, PBKDF2 parameters.')}
${tl('https://docs.spring.io/spring-security/reference/features/authentication/password-storage.html', '🍃', 'Spring Security — Password Storage', 'DelegatingPasswordEncoder, {id} format, upgrade.')}
${tl('https://trust.okta.com/security-advisories/okta-ad-ldap-delegated-authentication-username/', '🕵️', 'Okta security advisory (2024)', 'Usernames of 52+ characters and the BCrypt cache key.')}

<h3>Sources</h3>
<ul>
  <li>Outputs above: <code>c9.c.Bam</code> (one CPU core, <code>--cpus 1</code>), <code>c9.d.App</code> for the timing table, <code>bcryptjs</code> 3 on Node 22 — Spring Security 7.1.2, Bouncy Castle 1.80, Java 21.0.12.1 (20/11/2026). The machine was under load; compare numbers with each other, not with other machines.</li>
  <li>Okta advisory 01/11/2024; LinkedIn disclosures 06/2012 and 05/2016; RockYou breach 12/2009.</li>
</ul>
</div>
`;

const L92_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.2</span>
<h2>Băm mật khẩu với PasswordEncoder</h2>
<p class="lead">Một ngày nào đó CSDL sẽ bị lấy cắp — qua SQL injection, một bản sao lưu bị lộ, một chiếc laptop bỏ quên trên xe buýt. Câu hỏi duy nhất là kẻ trộm làm được gì với cột <code>password_hash</code>. Bài này đo điều đó: cost của BCrypt từ 4 tới 14 tính bằng mili giây, SHA-256 so với BCrypt tính bằng số lần đoán mỗi giây (chênh 836.124 lần trên máy đo), tiền tố <code>{bcrypt}</code> của <code>DelegatingPasswordEncoder</code>, giới hạn 72 byte đã làm Okta dính lỗi năm 2024, và một endpoint đăng nhập để lộ tên tài khoản nào tồn tại chỉ vì trả lời nhanh hơn.</p>

<h3>Đời thường trước đã</h3>
<p>Khách sạn không giữ chìa khoá phòng của bạn ở lễ tân; họ giữ một cách để <em>kiểm</em> chìa khoá. Băm là như vậy: server giữ dấu vân tay của mật khẩu, không bao giờ giữ mật khẩu, và lúc đăng nhập nó lấy vân tay của thứ bạn gõ rồi so. Một dấu vân tay mật khẩu tốt được cố ý làm <em>chậm</em> — như ổ khoá cần một giây mới xoay được. Với bạn, một giây lúc đăng nhập chẳng là gì. Với kẻ trộm thử mười triệu lần, mỗi lần một giây là bốn tháng.</p>

<h3>Thí nghiệm 1: đo cost của BCrypt</h3>
${MA92_COST}
${OUT92_BAM}
<p>Đọc bốn khối quan trọng:</p>
<ul>
  <li><strong>Cost:</strong> mỗi lần +1 thì công việc gấp đôi (2<sup>cost</sup> vòng): 59 ms ở mặc định 10, 240 ms ở 12, 945 ms ở 14 trên một nhân của máy đo. Hướng dẫn của OWASP là chọn cost cao nhất mà thời gian đăng nhập vẫn chấp nhận được trên <em>phần cứng của bạn</em>, thường vài trăm mili giây. Đo trên máy production; số trên laptop không nói lên nhiều.</li>
  <li><strong>Muối (salt):</strong> cùng mật khẩu encode hai lần cho hai chuỗi khác nhau, và cả hai đều khớp. 22 ký tự sau <code>$2a$10$</code> là muối ngẫu nhiên nằm ngay trong chuỗi băm; 31 ký tự cuối là phần băm. Vì vậy hai sinh viên cùng mật khẩu <code>123456</code> có hai dòng khác nhau, và "bảng cầu vồng" tính sẵn trở nên vô dụng.</li>
  <li><strong>Nhanh và chậm:</strong> SHA-256 chạy 14 triệu lần mỗi giây trên một luồng; BCrypt cost 10 chạy 16,8 lần. Tỉ lệ đó là thứ bạn mua được: dàn GPU của kẻ trộm kém hiệu quả đi 836.124 lần.</li>
  <li><strong>72 byte:</strong> BCrypt chỉ đọc 72 byte đầu của đầu vào. Spring Security 7 từ chối đầu vào dài hơn bằng <code>IllegalArgumentException</code> thay vì lặng lẽ bỏ phần còn lại. Chữ tiếng Việt tốn nhiều byte hơn số ký tự: 28 ký tự ở đây là 39 byte.</li>
</ul>

<h3>DelegatingPasswordEncoder: tiền tố {id}</h3>
${MA92_PE}
<p>Encoder Spring khuyên dùng không phải bản thân BCrypt mà là một encoder <em>uỷ quyền</em>: hash mới được ghi bằng thuật toán mặc định hiện tại (<code>{bcrypt}</code>), còn hash cũ được kiểm bằng thuật toán mà tiền tố của nó chỉ ra. Nhờ vậy một hệ thống mười năm tuổi chuyển từ SHA-256 sang BCrypt rồi Argon2 mà không bắt ai đặt lại mật khẩu:</p>
<ul>
  <li>Mọi định dạng cũ vẫn <code>matches</code>; <code>upgradeEncoding</code> báo <code>true</code> cho mọi thứ không phải mặc định hiện tại — tín hiệu để băm lại ở lần đăng nhập thành công kế tiếp (Spring tự làm khi <code>UserDetailsService</code> của bạn cài thêm <code>UserDetailsPasswordService</code>).</li>
  <li>Hash không có tiền tố bị từ chối với một exception giải thích dài. Khi nhập người dùng từ hệ thống cũ, hãy thêm tiền tố lúc migration (<code>{bcrypt}</code> cho các dòng <code>$2a$/$2b$</code>).</li>
  <li><code>BCryptPasswordEncoder(12)</code> thường cũng báo <code>upgradeEncoding=true</code> cho hash cost 10, nên nâng cost về sau không hề đau.</li>
</ul>

<h3>Các thuật toán khác</h3>
<p>Khối output thứ hai ở trên chạy các mặc định "v5_8" Spring Security khuyến nghị: PBKDF2 67 ms, SCrypt 148 ms, Argon2id 25 ms (bộ nhớ 16 MiB, 2 lượt). Argon2id và SCrypt là loại <em>tốn bộ nhớ</em> (memory-hard): mỗi lần đoán cần cả RAM, gây khó cho GPU hơn CPU. Cả hai cần Bouncy Castle trên classpath (<code>bcprov-jdk18on</code>). BCrypt vẫn là mặc định an toàn của Spring; Argon2id là thứ OWASP xếp đầu hiện nay. Đừng tự chế (<code>sha256(salt + password)</code> vẫn là nhanh).</p>

<h3>Thí nghiệm 2: endpoint đăng nhập để lộ tên tài khoản</h3>
<p>Một endpoint đăng nhập viết "tự nhiên": tên không tồn tại thì trả lời ngay.</p>
${MA92_NGAY}
<p>Mỗi trường hợp 25 lần, lấy trung vị:</p>
${OUT92_TG}
<p>Bản ngây thơ trả lời tên lạ trong 3 ms và tên có thật trong 62 ms. Câu báo lỗi giống hệt, nhưng đồng hồ thì không: kẻ tấn công thử một danh sách mã sinh viên là biết mã nào có tài khoản, rồi chỉ tấn công những mã đó. <code>DaoAuthenticationProvider</code> của Spring (dùng cho <code>/auth/login</code>, bài 9.3) chạy một lần so BCrypt với một hash giả khi không có người dùng: 60 ms cả hai đường. Cùng câu báo, cùng thời gian, cùng mã trạng thái. Đó cũng là lý do <code>BadCredentialsException</code> mặc định che <code>UsernameNotFoundException</code>.</p>

<h3>🕵️ Góc hacker — ba vụ lộ có thật</h3>
<ul>
  <li><strong>RockYou, tháng 12/2009:</strong> 32 triệu mật khẩu lưu <em>dạng chữ thường</em> bị lộ qua SQL injection. Danh sách đó ("rockyou.txt") đến giờ vẫn là từ điển đầu tiên mọi công cụ bẻ mật khẩu nạp vào.</li>
  <li><strong>LinkedIn, tháng 6/2012:</strong> 6,5 triệu hash mật khẩu bị đăng lên mạng — SHA-1, <em>không muối</em>. Đa số bị bẻ trong vài ngày. Năm 2016 cả bộ xuất hiện: khoảng 117 triệu tài khoản. Hash nhanh không muối chỉ hơn chữ thường một chút.</li>
  <li><strong>Okta, tháng 10/2024:</strong> tính năng xác thực uỷ quyền AD/LDAP của Okta lưu đệm lần đăng nhập dưới khoá là hash BCrypt của <em>user id + username + mật khẩu</em>. Với tên đăng nhập từ 52 ký tự trở lên, mật khẩu rơi ra ngoài 72 byte của BCrypt, nên mật khẩu nào cũng khớp mục đã lưu đệm. Thông báo của Okta ngày 01/11/2024 đổi khoá sang PBKDF2. Bài học: hiểu giới hạn của công cụ — chính là lý do Spring Security giờ ném lỗi khi đầu vào quá dài.</li>
</ul>
<p>Phòng thủ trong chương này: BCrypt hoặc Argon2id qua <code>DelegatingPasswordEncoder</code>, độ dài tối thiểu (ta đòi 10) thay vì luật "phải có chữ hoa ký tự đặc biệt", và mọi lần đăng nhập hỏng có cùng thời gian, cùng câu báo. Bài 10.5 thêm giới hạn tần suất.</p>

<h3>So với Node.js</h3>
<p>Ở Node thư viện thường dùng là <code>bcrypt</code> (native) hoặc <code>bcryptjs</code> (JS thuần). Hash dùng chung được với Spring, điều quan trọng khi một dịch vụ Node được viết lại bằng Spring Boot (hoặc ngược lại) mà bảng người dùng phải giữ nguyên:</p>
${OUT92_NODE}
${MA92_KIEMNODE}
${OUT92_NODEJ}
<p><code>$2b$</code> (Node) và <code>$2a$</code> (mặc định của Spring) đều được chấp nhận. Khi chuyển hệ thống, thêm tiền tố <code>{bcrypt}</code> cho các dòng có sẵn là không người dùng nào nhận ra.</p>

<h3>Đời thường và đi làm</h3>
<ul>
  <li>Đừng bao giờ ghi log thân request của <code>/auth/login</code> hay <code>/auth/register</code>; log debug in JSON chính là một tệp mật khẩu dạng chữ thường.</li>
  <li>Băm là việc của CPU trên luồng xử lý request. Một đợt đăng nhập ồ ạt lúc 08:00 ngày đăng ký môn là một đợt bão CPU: chọn cost có tính tới chuyện đó và đo dưới tải (Chương 16).</li>
  <li>Quên mật khẩu thì không bao giờ gửi lại mật khẩu cũ qua email — hệ thống không có nó. Trang nào gửi lại được mật khẩu cho bạn là trang đang lưu sai.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Sao không dùng SHA-256 cho mật khẩu?"</strong> — Nó được thiết kế để nhanh: 14 triệu lần đoán mỗi giây mỗi nhân ở đây, so với 16,8 của BCrypt cost 10. Băm mật khẩu phải chậm, có muối và chỉnh được.</li>
  <li><strong>"Muối lưu ở đâu?"</strong> — Ngay trong chuỗi BCrypt (22 ký tự sau cost), nên không cần thêm cột.</li>
  <li><strong>"Đổi thuật toán mà không bắt đặt lại mật khẩu thế nào?"</strong> — <code>DelegatingPasswordEncoder</code> với tiền tố <code>{id}</code>; kiểm hash cũ, băm lại khi đăng nhập thành công nếu <code>upgradeEncoding</code> là true.</li>
  <li><strong>"Endpoint đăng nhập có thể để lộ người dùng nào tồn tại ra sao?"</strong> — Khác câu báo, khác mã trạng thái hoặc khác thời gian. Trả một câu duy nhất và giữ thời gian bằng nhau (hash giả cho tên không có).</li>
</ol>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok"><ol>
  <li>Đoán, rồi đo trên máy bạn: thời gian một lần <code>encode</code> ở cost 10, 12 và 14. Chọn cost bạn sẽ dùng cho LabFlow và giải thích bằng một câu.</li>
  <li>Với <code>{bcrypt}$2a$04$…</code>, <code>{noop}abc</code> và <code>{bcrypt}$2a$10$…</code>, encoder uỷ quyền mặc định đánh dấu <code>upgradeEncoding</code> cho cái nào?</li>
  <li>Giải thích vì sao bản đăng nhập ngây thơ nhanh với tên lạ, và <code>DaoAuthenticationProvider</code> xoá chênh lệch đó thế nào.</li>
</ol>
<p><strong>Đạt khi:</strong> thời gian của bạn gần gấp đôi mỗi bậc, bạn đánh dấu đúng hash cost 4 và noop, và lời giải thích có nhắc tới hash giả.</p></div>
${giai('Xem đáp án', `<p>Khoảng ×4 sau mỗi hai bậc (59 → 240 → 945 ms ở đây). <code>upgradeEncoding</code>: noop true, bcrypt cost 4 true, bcrypt cost 10 false (output ở trên). Bản ngây thơ bỏ qua <code>matches</code> khi không có dòng; <code>DaoAuthenticationProvider</code> gọi <code>matches</code> với một hash BCrypt giả chuẩn bị sẵn, nên cả hai đường đều tốn một lần so BCrypt (60 ms và 61 ms trong bảng).</p>`)}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Hash (băm)</span><span class="v">Dấu vân tay một chiều: dễ tính, không thể đảo ngược trên thực tế.</span></div>
  <div class="kv"><span class="k">Salt (muối)</span><span class="v">Giá trị ngẫu nhiên trộn vào mỗi hash để mật khẩu giống nhau cho hash khác nhau.</span></div>
  <div class="kv"><span class="k">Cost (hệ số công việc)</span><span class="v">Núm chỉnh của BCrypt: 2<sup>cost</sup> vòng; +1 là thời gian gấp đôi.</span></div>
  <div class="kv"><span class="k">Tốn bộ nhớ (memory-hard)</span><span class="v">Thuật toán (SCrypt, Argon2) mỗi lần đoán cần cả RAM, làm GPU chậm lại.</span></div>
  <div class="kv"><span class="k">DelegatingPasswordEncoder</span><span class="v">Encoder ghi <code>{id}hash</code> và kiểm được mọi <code>{id}</code> đã biết.</span></div>
  <div class="kv"><span class="k">Dò tên tài khoản (user enumeration)</span><span class="v">Biết tài khoản nào tồn tại nhờ khác biệt trong phản hồi hoặc thời gian.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Chỉ lưu hash chậm có muối: BCrypt (mặc định, cost 10 = 59 ms ở đây) hoặc Argon2id.</li>
  <li>Đoán SHA-256 nhanh hơn BCrypt cost 10 tới 836.124 lần — hash nhanh là sai công cụ.</li>
  <li><code>PasswordEncoderFactories.createDelegatingPasswordEncoder()</code>: tiền tố <code>{bcrypt}</code>, định dạng cũ vẫn kiểm được, <code>upgradeEncoding</code> báo khi nào cần băm lại.</li>
  <li>BCrypt đọc 72 byte; Spring Security 7 ném lỗi nếu dài hơn (Okta 2024 cho thấy vì sao quan trọng).</li>
  <li>Đăng nhập hỏng: một câu báo, một mã trạng thái, thời gian bằng nhau.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html', '🛡️', 'OWASP Password Storage Cheat Sheet', 'Tham số Argon2id, scrypt, bcrypt, PBKDF2.')}
${tl('https://docs.spring.io/spring-security/reference/features/authentication/password-storage.html', '🍃', 'Spring Security — Password Storage', 'DelegatingPasswordEncoder, định dạng {id}, nâng cấp.')}
${tl('https://trust.okta.com/security-advisories/okta-ad-ldap-delegated-authentication-username/', '🕵️', 'Thông báo bảo mật của Okta (2024)', 'Tên đăng nhập từ 52 ký tự và khoá đệm BCrypt.')}

<h3>Nguồn</h3>
<ul>
  <li>Output ở trên: <code>c9.c.Bam</code> (một nhân CPU, <code>--cpus 1</code>), <code>c9.d.App</code> cho bảng thời gian, <code>bcryptjs</code> 3 trên Node 22 — Spring Security 7.1.2, Bouncy Castle 1.80, Java 21.0.12.1 (20/11/2026). Máy đo đang tải; so các số với nhau, đừng so với máy khác.</li>
  <li>Thông báo của Okta 01/11/2024; công bố của LinkedIn 06/2012 và 05/2016; vụ RockYou 12/2009.</li>
</ul>
</div>
`;

// ===== Bài 9.3 =====
const MA93_KEY = java("// ---- Khoá ký: HS256 (mặc định) hoặc RS256 (profile \"rs\")\n@Bean @Profile(\"!rs\")\nSecretKey hmacKey(@Value(\"${c9.secret}\") String secret) {\n    return new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), \"HmacSHA256\");\n}\n@Bean @Profile(\"!rs\")\nJwtEncoder hsEncoder(SecretKey k) { return new NimbusJwtEncoder(new ImmutableSecret<>(k)); }\n@Bean @Profile(\"!rs\")\nJwtDecoder hsDecoder(SecretKey k, @Value(\"${c9.skew:PT60S}\") Duration skew) {\n    NimbusJwtDecoder d = NimbusJwtDecoder.withSecretKey(k).build();\n    d.setJwtValidator(new DelegatingOAuth2TokenValidator<>(new JwtTimestampValidator(skew), new JwtIssuerValidator(\"labflow\")));\n    return d;\n}");
const MA93_TOKEN = java("String access(String username, List<String> roles) {\n    Instant now = Instant.now();\n    JwtClaimsSet claims = JwtClaimsSet.builder()\n        .issuer(\"labflow\")\n        .subject(username)\n        .issuedAt(now)\n        .expiresAt(now.plus(ttl))\n        .claim(\"roles\", roles)\n        .build();\n    JwsHeader header = rs ? JwsHeader.with(SignatureAlgorithm.RS256).keyId(\"labflow-2026-11\").build()\n                          : JwsHeader.with(MacAlgorithm.HS256).build();\n    return enc.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();\n}");
const MA93_LOGIN = java("@PostMapping(\"/login\")\nResponseEntity<?> dangNhap(@RequestBody DangNhap r) {\n    Authentication a = am.authenticate(UsernamePasswordAuthenticationToken.unauthenticated(r.username(), r.password()));\n    // Spring Security 7 thêm FACTOR_PASSWORD (yếu tố đã dùng để đăng nhập) vào authorities ⇒ chỉ lấy quyền bắt đầu bằng ROLE_\n    List<String> roles = a.getAuthorities().stream().map(x -> x.getAuthority())\n        .filter(x -> x.startsWith(\"ROLE_\")).map(x -> x.substring(\"ROLE_\".length())).toList();\n    String rt = refresh.cap(a.getName(), UUID.randomUUID());\n    return traToken(a.getName(), roles, rt);\n}");
const MA93_UDS = java("@Bean\nUserDetailsService userDetailsService(JdbcClient db) {\n    return username -> db.sql(\"select username, password_hash, role from users where username = ?\").param(username)\n        .query((rs, i) -> User.withUsername(rs.getString(1)).password(rs.getString(2)).roles(rs.getString(3)).build())\n        .optional().orElseThrow(() -> new UsernameNotFoundException(username));\n}\n\n@Bean\nAuthenticationManager authenticationManager(UserDetailsService uds, PasswordEncoder pe) {\n    DaoAuthenticationProvider p = new DaoAuthenticationProvider(uds);\n    p.setPasswordEncoder(pe);\n    return new ProviderManager(p);\n}");
const OUT93_DK = out("$ curl -X POST localhost:8080/auth/register -d {\"username\":\"lan\",\"password\":\"Lan-LabFlow-2026\",\"role\":\"ADMIN\"}\n{\"role\":\"STUDENT\",\"username\":\"lan\"}  ⇒ HTTP 201\n$ curl -X POST localhost:8080/auth/register -d {\"username\":\"binh\",\"password\":\"Binh-LabFlow-2026\"}\n{\"role\":\"STUDENT\",\"username\":\"binh\"}  ⇒ HTTP 201\n$ curl -X POST localhost:8080/auth/register -d {\"username\":\"lan\",\"password\":\"Khac-LabFlow-2026\"}\n{\"detail\":\"tên đã có người dùng\",\"instance\":\"/auth/register\",\"status\":409,\"title\":\"Conflict\"}  ⇒ HTTP 409\n$ curl -X POST localhost:8080/auth/register -d {\"username\":\"chi\",\"password\":\"123456\"}\n{\"detail\":\"tên 3–50 ký tự [a-z0-9._-], mật khẩu ≥ 10 ký tự\",\"instance\":\"/auth/register\",\"status\":400,\"title\":\"Bad Request\"}  ⇒ HTTP 400\n$ psql: select username, role, password_hash from users\n username |  role   |                            password_hash                             \n----------+---------+----------------------------------------------------------------------\n admin    | ADMIN   | {bcrypt}$2a$10$HSzOvAR.4YG9IB8duwXN..uJkdKrOjheUyg7YQWWL3KtlqBpUyZsy\n lan      | STUDENT | {bcrypt}$2a$10$dDw79W8ijFx5vZcubfO0qOIuYnq.nFBR3SYTBCPp5FYHVxEwhhUM.\n binh     | STUDENT | {bcrypt}$2a$10$KR3kQKtuEY1j8dXQRtX2Qu4zOpQPZAaFslt4qjbCc5NgnPGxYxWEW\n(3 rows)");
const OUT93_LOGIN = out("$ curl -i -X POST localhost:8080/auth/login -d {\"username\":\"lan\",\"password\":\"Lan-LabFlow-2026\"}\nHTTP/1.1 200 \nSet-Cookie: rt=hOI6183FUehQweHOv_FKpLrLyZn3-wAoneUM36fguBk; Path=/auth; Max-Age=604800; Expires=Fri, 27 Nov 2026 02:19:34 GMT; Secure; HttpOnly; SameSite=Strict\nContent-Type: application/json\n{\"token_type\":\"Bearer\",\"expires_in\":900,\"access_token\":\"eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsYWJmbG93Iiwic3ViIjoibGFuIiwiZXhwIjoxNzk1MTQyMDc0LCJpYXQiOjE3OTUxNDExNzQsInJvbGVzIjpbIlNUVURFTlQiLCJSX1BBU1NXT1JEIl19.MLqUxxwm9e2Xh0fZJ11RvzVYyXHo-NYgvL8G_KAcMoc\"}\n$ curl -X POST localhost:8080/auth/login -d {\"username\":\"lan\",\"password\":\"sai-mat-khau\"}\n{\"detail\":\"sai tên đăng nhập hoặc mật khẩu\",\"instance\":\"/auth/login\",\"status\":401,\"title\":\"Unauthorized\"}  ⇒ HTTP 401\n$ curl -X POST localhost:8080/auth/login -d {\"username\":\"khong-co-ai\",\"password\":\"sai-mat-khau\"}\n{\"detail\":\"sai tên đăng nhập hoặc mật khẩu\",\"instance\":\"/auth/login\",\"status\":401,\"title\":\"Unauthorized\"}  ⇒ HTTP 401\n[login] thất bại: BadCredentialsException — Bad credentials\n[login] thất bại: BadCredentialsException — Bad credentials");
const OUT93_GM = out("token = eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsYWJmbG93Iiwic3ViIjoibGFuIiwiZXhwIjoxNzk1MTQyMTA5LCJpYXQiOjE3OTUxNDEyMDksInJvbGVzIjpbIlNUVURFTlQiXX0.GQQGwNDZ460IFElpZxiX2l7NOck0vOP9dV6bbotDdfc\nphần 1 (header)  = {\"alg\":\"HS256\"}\nphần 2 (payload) = {\"iss\":\"labflow\",\"sub\":\"lan\",\"exp\":1795142109,\"iat\":1795141209,\"roles\":[\"STUDENT\"]}\nphần 3 (chữ ký)  = GQQGwNDZ460IFElpZxiX2l7NOck0vOP9dV6bbotDdfc   (43 ký tự base64url = 32 byte HMAC-SHA256)\nđộ dài token = 176 ký tự");
const OUT93_NODE = out("chữ ký tính lại = GQQGwNDZ460IFElpZxiX2l7NOck0vOP9dV6bbotDdfc\nkhớp            = true\npayload         = {\n  iss: 'labflow',\n  sub: 'lan',\n  exp: 1795142109,\n  iat: 1795141209,\n  roles: [ 'STUDENT' ]\n}");
const OUT93_FACTOR = out("token = eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsYWJmbG93Iiwic3ViIjoibGFuIiwiZXhwIjoxNzk1MTQyMDc0LCJpYXQiOjE3OTUxNDExNzQsInJvbGVzIjpbIlNUVURFTlQiLCJSX1BBU1NXT1JEIl19.MLqUxxwm9e2Xh0fZJ11RvzVYyXHo-NYgvL8G_KAcMoc\nphần 1 (header)  = {\"alg\":\"HS256\"}\nphần 2 (payload) = {\"iss\":\"labflow\",\"sub\":\"lan\",\"exp\":1795142074,\"iat\":1795141174,\"roles\":[\"STUDENT\",\"R_PASSWORD\"]}\nphần 3 (chữ ký)  = MLqUxxwm9e2Xh0fZJ11RvzVYyXHo-NYgvL8G_KAcMoc   (43 ký tự base64url = 32 byte HMAC-SHA256)\nđộ dài token = 193 ký tự");
const OUT93_NGAN = out("DEBUG o.s.security.web.FilterChainProxy        : Securing POST /auth/login\nDEBUG o.s.security.web.FilterChainProxy        : Secured POST /auth/login\nERROR o.a.c.c.C.[.[.[/].[dispatcherServlet]    : Servlet.service() for servlet [dispatcherServlet] in context with path [] threw exception [Request processing failed: org.springframework.security.oauth2.jwt.JwtEncodingException: An error occurred while attempting to encode the Jwt: Failed to create a JWS Signer -> The secret len\ncom.nimbusds.jose.KeyLengthException: The secret length must be at least 256 bits\nDEBUG o.s.security.web.FilterChainProxy        : Securing GET /error");
const OUT93_NGAN2 = out("# sau khi thêm \"/error\" vào permitAll\n$ curl -X POST localhost:8080/auth/login -d {\"username\":\"lan\",\"password\":\"Lan-LabFlow-2026\"}\n{\"timestamp\":\"2026-11-20T02:21:49.545Z\",\"status\":500,\"error\":\"Internal Server Error\",\"path\":\"/auth/login\"}  ⇒ HTTP 500");
const OUT93_RS = out("header (RS256)  = {\"kid\":\"labflow-2026-11\",\"alg\":\"RS256\"}\nchữ ký = 342 ký tự base64url (256 byte RSA-2048)\nđộ dài token = 507 ký tự\n$ curl -i -H \"Authorization: Bearer $AT\" localhost:8080/me\nHTTP/1.1 200 \n{\"name\":\"lan\",\"expiresAt\":\"2026-11-20T02:35:55Z\",\"thread\":\"http-nio-8080-exec-2\",\"authenticationClass\":\"JwtAuthenticationToken\",\"sameAsContextHolder\":true,\"authorities\":[\"ROLE_STUDENT\",\"FactorGrantedAuthority [authority=FACTOR_BEARER, issuedAt=…]\"]}");
const MA93_RSKEY = java("@Bean @Profile(\"rs\")\nKeyPair rsaKeyPair() throws Exception {\n    KeyPairGenerator g = KeyPairGenerator.getInstance(\"RSA\");\n    g.initialize(2048);\n    return g.generateKeyPair();\n}\n@Bean @Profile(\"rs\")\nRSAKey rsaJwk(KeyPair kp) { return new RSAKey.Builder((RSAPublicKey) kp.getPublic()).privateKey(kp.getPrivate()).keyID(\"labflow-2026-11\").build(); }\n@Bean @Profile(\"rs\")\nJwtEncoder rsEncoder(RSAKey k) { return new NimbusJwtEncoder(new ImmutableJWKSet<>(new JWKSet(k))); }\n@Bean @Profile(\"rs\")\nJwtDecoder rsDecoder(KeyPair kp, @Value(\"${c9.skew:PT60S}\") Duration skew) {\n    NimbusJwtDecoder d = NimbusJwtDecoder.withPublicKey((RSAPublicKey) kp.getPublic()).build();\n    d.setJwtValidator(new DelegatingOAuth2TokenValidator<>(new JwtTimestampValidator(skew), new JwtIssuerValidator(\"labflow\")));\n    return d;\n}");

const L93_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.3</span>
<h2>Login and issuing JWTs</h2>
<p class="lead">HTTP Basic sends the password with every request; a React app or a mobile client should send it once. This lesson builds <code>POST /auth/login</code>: users in PostgreSQL, passwords checked by <code>AuthenticationManager</code>, and a signed JSON Web Token in the response. We take the token apart by hand, verify its signature in Node.js with no library, sign with HS256 and RS256, and hit two traps on the way — a role called <code>R_PASSWORD</code> and a 500 that came back as 401.</p>

<h3>In everyday life first</h3>
<p>At a festival you show your ID once at the gate, and they put a wristband on you. For the rest of the day the staff only look at the wristband: its colour says which areas you may enter, the printed date says until when, and a hologram makes it hard to fake. Nobody phones the gate again. A JWT is that wristband: the server checks the password once (login), then hands out a token that says <em>who</em> (<code>sub</code>), <em>what</em> (<code>roles</code>) and <em>until when</em> (<code>exp</code>), with a signature that only the server can produce.</p>

<h3>Users in the database, checked by Spring</h3>
${MA93_UDS}
<p><code>UserDetailsService</code> loads a user by name; <code>DaoAuthenticationProvider</code> compares the password with <code>PasswordEncoder</code> (lesson 9.2) and runs the dummy hash for unknown names. In Spring Security 7 the provider receives the <code>UserDetailsService</code> in its constructor (the old no-argument constructor and setter are gone). Registration, with a body that tries to sneak in a role:</p>
${OUT93_DK}
<p>The request record only has <code>username</code> and <code>password</code>, so <code>"role":"ADMIN"</code> has nowhere to land; the account is <code>STUDENT</code>. A duplicate name is 409, a 6-character password 400. The table stores <code>{bcrypt}</code> hashes only.</p>

<h3>The login endpoint</h3>
${MA93_LOGIN}
${OUT93_LOGIN}
<p>Wrong password and unknown user produce the same 401 body (and, from 9.2, the same time). Success returns an access token in the JSON body, and a refresh token in an <code>HttpOnly</code> cookie limited to <code>/auth</code> — lesson 9.5 is about that cookie.</p>

<h3>Signing the token: HS256</h3>
${MA93_KEY}
${MA93_TOKEN}
<p><code>NimbusJwtEncoder</code> is Spring Security's encoder (built on the Nimbus JOSE+JWT library that comes with the resource-server starter). HS256 means HMAC-SHA256 with one shared secret: the same key signs and verifies. The header must name the algorithm explicitly (<code>MacAlgorithm.HS256</code>); the encoder's default is RS256.</p>

<h3>Experiment 1: take the token apart</h3>
${OUT93_GM}
<p>A JWT is three Base64URL parts joined by dots: header, payload, signature. The first two are <strong>only encoded, not encrypted</strong> — anyone holding the token can read the username and roles. Never put a phone number, an e-mail or a grade in a token. The signature is 32 bytes of HMAC over <code>header.payload</code>; change one character of the payload and the signature no longer matches (lesson 9.4 tries exactly that).</p>
<p>Because JWT is a standard (RFC 7519), any language can verify it. Node.js with only its built-in <code>crypto</code> module:</p>
${OUT93_NODE}
<p>That is also the warning: whoever knows the HS256 secret can mint tokens for anyone. The secret belongs in an environment variable, never in Git, and it must be at least 256 bits.</p>

<h3>Experiment 2: a secret that is too short</h3>
<p>The same application started with <code>c9.secret=ngan-qua-16-byte</code> (128 bits). Login answered 401 — wrong status, and nothing to do with the password. The log:</p>
${OUT93_NGAN}
<p>Nimbus refuses HMAC keys under 256 bits (<code>KeyLengthException</code>), the controller threw, Tomcat forwarded to <code>/error</code>, and <code>/error</code> was protected — the trap from 9.1 again: a server bug disguised as "unauthorized". Opening <code>/error</code> in the chain shows the truth:</p>
${OUT93_NGAN2}
<p>Add <code>"/error"</code> to the <code>permitAll()</code> list in every chain you write. Better still, validate the secret length at startup so the application refuses to start (the Lab 9 solution does).</p>

<h3>Experiment 3: the role called R_PASSWORD</h3>
<p>The first version of our login built the <code>roles</code> claim by stripping <code>ROLE_</code> from every authority. The token it produced:</p>
${OUT93_FACTOR}
<p>Spring Security 7 adds <code>FACTOR_PASSWORD</code> to the authorities after a password login (9.1); cutting five characters off it gave <code>R_PASSWORD</code>. Filter first: keep only authorities that start with <code>ROLE_</code>, as in the corrected code above. When you upgrade from Security 6, search your code for <code>getAuthorities()</code>.</p>

<h3>RS256: sign with a private key, verify with a public one</h3>
${MA93_RSKEY}
${OUT93_RS}
<p>With RS256 only the authorization server holds the private key; every other service verifies with the public key, which can be published (usually as a JWKS document at a <code>/.well-known/</code> URL). The <code>kid</code> header says which key signed, so keys can be rotated. The price: tokens grow from 176 to 507 characters here. Rule of thumb: HS256 when one application signs and verifies; RS256 (or ES256) as soon as a second service, a gateway or a partner must verify tokens without being able to create them.</p>

<h3>How long should a token live?</h3>
<ul>
  <li>An access token cannot be recalled once issued (9.4 and 9.5 show why). Keep it short: 5–15 minutes. Ours: <code>expires_in: 900</code>.</li>
  <li>The user should not log in every 15 minutes, so a long-lived <em>refresh token</em> (days) buys new access tokens. That one is stored in the database and can be revoked.</li>
  <li><code>iss</code> (issuer) names who issued the token; the decoder in 9.4 rejects tokens from another issuer.</li>
</ul>

<h3>🕵️ Hacker corner — "alg": "none" (2015)</h3>
<p>On 31 March 2015 Tim McLean published "Critical vulnerabilities in JSON Web Token libraries". Several popular libraries trusted the <code>alg</code> field of the token itself. Two attacks followed: set <code>"alg":"none"</code>, delete the signature, and the library accepted the token as valid; or take a server that verifies RS256 with a public key, switch the header to HS256, and sign with the <em>public</em> key as if it were an HMAC secret. Node's <code>jsonwebtoken</code> before 4.2.2 was affected (CVE-2015-9235). Spring's decoder pins the algorithm to the key you configure: lesson 9.4 sends an <code>alg: none</code> token and gets "Unsupported algorithm of none". Rules: the server decides the algorithm, never the token; keep libraries up to date; use separate keys per purpose.</p>

<h3>Compared with Node.js</h3>
<p>The Express equivalent is <code>jwt.sign({ sub, roles }, secret, { algorithm: 'HS256', expiresIn: '15m' })</code> from <code>jsonwebtoken</code> after a <code>bcrypt.compare</code>. Same three parts, same claims, interchangeable tokens — you saw Node verify a Spring token above. Spring's difference is structure: <code>AuthenticationManager</code> and <code>UserDetailsService</code> are standard interfaces, so switching from a database to LDAP or an external identity provider (Keycloak, Google) changes configuration, not controllers.</p>

<h3>In real life and at work</h3>
<ul>
  <li>Production projects often do not issue tokens themselves: an identity provider (Keycloak, Auth0, Cognito, Microsoft Entra) does, and Spring Boot is only the <em>resource server</em> of 9.4. Writing <code>/auth/login</code> once yourself is how you understand what those products do.</li>
  <li>Paste a token into jwt.io to read it — and remember that is exactly what an attacker can do too.</li>
  <li>The secret is rotated when someone leaves the team. With HS256 that logs everyone out; plan for it.</li>
</ul>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"What is inside a JWT?"</strong> — Header (algorithm, key id), payload (claims: <code>sub</code>, <code>exp</code>, <code>iat</code>, <code>iss</code>, custom roles), signature over the first two. Encoded, not encrypted.</li>
  <li><strong>"HS256 or RS256?"</strong> — HS256: one shared secret, sign = verify, one application. RS256: private key signs, public key verifies, many services; supports key rotation with <code>kid</code>.</li>
  <li><strong>"JWT or server session?"</strong> — Session: state on the server, easy logout, needs sticky sessions or a shared store. JWT: stateless, scales horizontally, but cannot be revoked before <code>exp</code> — so keep it short and pair it with a revocable refresh token.</li>
  <li><strong>"What is alg none?"</strong> — An unsigned token. A server must never let the token choose the algorithm.</li>
</ol>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
  <li>Log in, copy the access token, and decode its first two parts with <code>base64 -d</code> (add <code>=</code> padding, swap <code>-_</code> for <code>+/</code>). Compute <code>exp − iat</code>.</li>
  <li>Verify the signature yourself in Node.js or Java with the secret from <code>application.properties</code>.</li>
  <li>Start the application with a 16-byte secret and explain the status code you get from <code>/auth/login</code>; then make it a 500.</li>
</ol>
<p><strong>Done when:</strong> you read <code>sub</code>, <code>roles</code> and an <code>exp − iat</code> of 900, your computed signature equals the third part, and you can name the exception and the filter rule that changed 500 into 401.</p></div>
${giai('Show the solution', `<p>Decoding gives the header and payload of Experiment 1; 1795142109 − 1795141209 = 900 seconds. The Node.js check printed <code>khớp = true</code>. A 16-byte secret raises <code>KeyLengthException</code> inside <code>JwtEncodingException</code>; the forward to the protected <code>/error</code> returns 401; adding <code>"/error"</code> to <code>permitAll()</code> returns the real 500.</p>`)}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">JWT</span><span class="v">JSON Web Token (RFC 7519): signed, URL-safe set of claims.</span></div>
  <div class="kv"><span class="k">Claim</span><span class="v">One statement in the payload: <code>sub</code>, <code>exp</code>, <code>iat</code>, <code>iss</code>, <code>roles</code>.</span></div>
  <div class="kv"><span class="k">HS256</span><span class="v">HMAC-SHA256 signature with one shared secret (≥ 256 bits).</span></div>
  <div class="kv"><span class="k">RS256</span><span class="v">RSA-SHA256 signature: private key signs, public key verifies.</span></div>
  <div class="kv"><span class="k">JWKS / kid</span><span class="v">Published set of public keys; the key id in the header picks one.</span></div>
  <div class="kv"><span class="k">AuthenticationManager</span><span class="v">Spring entry point that checks credentials through providers.</span></div>
  <div class="kv"><span class="k">Access token</span><span class="v">Short-lived token sent on every API call (<code>Authorization: Bearer …</code>).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li><code>/auth/login</code>: <code>AuthenticationManager.authenticate</code> → JWT with <code>sub</code>, <code>roles</code>, <code>iss</code>, <code>iat</code>, <code>exp</code>.</li>
  <li>A JWT is readable by anyone; the signature only prevents changes. Keep personal data out.</li>
  <li>HS256 needs a secret of at least 256 bits from the environment; RS256 when others must verify.</li>
  <li>Permit <code>/error</code>, or server errors look like 401.</li>
  <li>Spring Security 7 adds <code>FACTOR_*</code> authorities: filter <code>ROLE_</code> before building claims.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://www.rfc-editor.org/rfc/rfc7519', '📜', 'RFC 7519 — JSON Web Token', 'Registered claims and format.')}
${tl('https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html', '🍃', 'Spring Security — OAuth 2.0 Resource Server JWT', 'JwtDecoder, NimbusJwtEncoder, validators.')}
${tl('https://auth0.com/blog/critical-vulnerabilities-in-json-web-token-libraries/', '🕵️', 'Critical vulnerabilities in JSON Web Token libraries (2015)', 'alg none and key confusion.')}

<h3>Sources</h3>
<ul>
  <li>Outputs above: <code>c9.d.App</code> in <code>lab/c9/sec</code> (users in PostgreSQL 16.15), Spring Boot 4.1.2, Spring Security 7.1.2, Nimbus JOSE+JWT 10.9.1; Node 22 built-in <code>crypto</code> (20/11/2026).</li>
  <li>Tim McLean, Auth0 blog, 31/03/2015; CVE-2015-9235.</li>
</ul>
</div>
`;

const L93_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.3</span>
<h2>Đăng nhập và phát JWT</h2>
<p class="lead">HTTP Basic gửi mật khẩu theo mọi request; một ứng dụng React hay ứng dụng di động chỉ nên gửi nó một lần. Bài này dựng <code>POST /auth/login</code>: người dùng nằm trong PostgreSQL, mật khẩu do <code>AuthenticationManager</code> kiểm, và phản hồi là một JSON Web Token đã ký. Ta tháo rời token bằng tay, kiểm chữ ký bằng Node.js không cần thư viện, ký bằng HS256 và RS256, và gặp hai cái bẫy dọc đường — một vai trò tên <code>R_PASSWORD</code> và một lỗi 500 quay về dưới dạng 401.</p>

<h3>Đời thường trước đã</h3>
<p>Ở một lễ hội, bạn đưa căn cước đúng một lần ở cổng, rồi được đeo vòng tay. Suốt ngày hôm đó nhân viên chỉ nhìn vòng tay: màu cho biết bạn được vào khu nào, ngày in trên vòng cho biết tới khi nào, còn tem ba chiều khiến khó làm giả. Không ai gọi lại cổng nữa. JWT chính là chiếc vòng tay đó: server kiểm mật khẩu một lần (đăng nhập), rồi phát một token nói <em>ai</em> (<code>sub</code>), <em>được gì</em> (<code>roles</code>) và <em>tới khi nào</em> (<code>exp</code>), kèm chữ ký chỉ server mới tạo được.</p>

<h3>Người dùng trong CSDL, do Spring kiểm</h3>
${MA93_UDS}
<p><code>UserDetailsService</code> nạp người dùng theo tên; <code>DaoAuthenticationProvider</code> so mật khẩu bằng <code>PasswordEncoder</code> (bài 9.2) và chạy hash giả cho tên không tồn tại. Ở Spring Security 7, provider nhận <code>UserDetailsService</code> qua constructor (constructor không tham số và setter cũ đã bị gỡ). Đăng ký, với một thân request cố lén cài vai trò:</p>
${OUT93_DK}
<p>Record nhận request chỉ có <code>username</code> và <code>password</code>, nên <code>"role":"ADMIN"</code> không có chỗ nào để rơi vào; tài khoản là <code>STUDENT</code>. Tên trùng ⇒ 409, mật khẩu 6 ký tự ⇒ 400. Bảng chỉ lưu hash <code>{bcrypt}</code>.</p>

<h3>Endpoint đăng nhập</h3>
${MA93_LOGIN}
${OUT93_LOGIN}
<p>Sai mật khẩu và không có tên cho cùng một thân 401 (và, theo bài 9.2, cùng thời gian). Thành công thì trả access token trong thân JSON, còn refresh token nằm trong cookie <code>HttpOnly</code> chỉ gửi tới <code>/auth</code> — bài 9.5 nói về cookie đó.</p>

<h3>Ký token: HS256</h3>
${MA93_KEY}
${MA93_TOKEN}
<p><code>NimbusJwtEncoder</code> là encoder của Spring Security (dựng trên thư viện Nimbus JOSE+JWT đi kèm starter resource-server). HS256 là HMAC-SHA256 với một bí mật dùng chung: cùng một khoá vừa ký vừa kiểm. Header phải ghi rõ thuật toán (<code>MacAlgorithm.HS256</code>); mặc định của encoder là RS256.</p>

<h3>Thí nghiệm 1: tháo rời token</h3>
${OUT93_GM}
<p>JWT là ba phần Base64URL nối bằng dấu chấm: header, payload, chữ ký. Hai phần đầu <strong>chỉ được mã hoá dạng chữ, không được mã hoá bí mật</strong> — ai cầm token cũng đọc được tên và vai trò. Đừng bao giờ bỏ số điện thoại, email hay điểm số vào token. Chữ ký là 32 byte HMAC tính trên <code>header.payload</code>; đổi một ký tự của payload là chữ ký không còn khớp (bài 9.4 thử đúng việc đó).</p>
<p>Vì JWT là chuẩn (RFC 7519), ngôn ngữ nào cũng kiểm được. Node.js chỉ với module <code>crypto</code> có sẵn:</p>
${OUT93_NODE}
<p>Đó cũng là lời cảnh báo: ai biết bí mật HS256 là đúc được token cho bất kỳ ai. Bí mật phải nằm trong biến môi trường, không bao giờ trong Git, và dài ít nhất 256 bit.</p>

<h3>Thí nghiệm 2: bí mật quá ngắn</h3>
<p>Cùng ứng dụng, khởi động với <code>c9.secret=ngan-qua-16-byte</code> (128 bit). Đăng nhập trả 401 — sai mã, và chẳng liên quan gì tới mật khẩu. Log:</p>
${OUT93_NGAN}
<p>Nimbus từ chối khoá HMAC dưới 256 bit (<code>KeyLengthException</code>), controller ném lỗi, Tomcat chuyển tiếp sang <code>/error</code>, và <code>/error</code> bị bảo vệ — lại cái bẫy của bài 9.1: lỗi của server đội lốt "chưa xác thực". Mở <code>/error</code> trong chuỗi là thấy sự thật:</p>
${OUT93_NGAN2}
<p>Thêm <code>"/error"</code> vào danh sách <code>permitAll()</code> của mọi chuỗi bạn viết. Tốt hơn nữa, kiểm độ dài bí mật ngay lúc khởi động để ứng dụng từ chối chạy (lời giải Lab 9 làm vậy).</p>

<h3>Thí nghiệm 3: vai trò tên R_PASSWORD</h3>
<p>Bản đầu tiên của endpoint đăng nhập dựng claim <code>roles</code> bằng cách cắt <code>ROLE_</code> khỏi mọi quyền. Token nó sinh ra:</p>
${OUT93_FACTOR}
<p>Spring Security 7 thêm <code>FACTOR_PASSWORD</code> vào danh sách quyền sau khi đăng nhập bằng mật khẩu (bài 9.1); cắt năm ký tự đầu của nó ra <code>R_PASSWORD</code>. Lọc trước: chỉ giữ quyền bắt đầu bằng <code>ROLE_</code>, như mã đã sửa ở trên. Khi nâng từ Security 6, hãy tìm trong mã mọi chỗ gọi <code>getAuthorities()</code>.</p>

<h3>RS256: ký bằng khoá riêng, kiểm bằng khoá công khai</h3>
${MA93_RSKEY}
${OUT93_RS}
<p>Với RS256 chỉ server cấp phép giữ khoá riêng; mọi dịch vụ khác kiểm bằng khoá công khai, thứ có thể công bố (thường dưới dạng tài liệu JWKS ở một URL <code>/.well-known/</code>). Header <code>kid</code> cho biết khoá nào đã ký, nên xoay khoá được. Cái giá: token dài từ 176 lên 507 ký tự ở đây. Quy tắc nhanh: HS256 khi một ứng dụng vừa ký vừa kiểm; RS256 (hoặc ES256) ngay khi có dịch vụ thứ hai, một gateway hay một đối tác cần kiểm token mà không được phép tạo token.</p>

<h3>Token nên sống bao lâu?</h3>
<ul>
  <li>Access token đã phát thì không thu hồi được (bài 9.4 và 9.5 cho thấy vì sao). Để nó ngắn: 5–15 phút. Của ta: <code>expires_in: 900</code>.</li>
  <li>Người dùng không nên đăng nhập lại mỗi 15 phút, nên một <em>refresh token</em> sống lâu (vài ngày) dùng để đổi lấy access token mới. Refresh token được lưu trong CSDL và thu hồi được.</li>
  <li><code>iss</code> (issuer) ghi ai đã phát token; bộ giải mã ở bài 9.4 từ chối token của bên phát khác.</li>
</ul>

<h3>🕵️ Góc hacker — "alg": "none" (2015)</h3>
<p>Ngày 31/03/2015 Tim McLean công bố "Critical vulnerabilities in JSON Web Token libraries". Nhiều thư viện phổ biến tin vào trường <code>alg</code> nằm ngay trong token. Từ đó có hai kiểu tấn công: đặt <code>"alg":"none"</code>, xoá chữ ký, và thư viện coi token là hợp lệ; hoặc với server kiểm RS256 bằng khoá công khai, đổi header sang HS256 rồi ký bằng chính <em>khoá công khai</em> như thể đó là bí mật HMAC. Thư viện <code>jsonwebtoken</code> của Node trước bản 4.2.2 dính lỗi (CVE-2015-9235). Bộ giải mã của Spring khoá cứng thuật toán theo khoá bạn cấu hình: bài 9.4 gửi một token <code>alg: none</code> và nhận "Unsupported algorithm of none". Quy tắc: server quyết định thuật toán, không bao giờ để token quyết; cập nhật thư viện; mỗi mục đích một khoá riêng.</p>

<h3>So với Node.js</h3>
<p>Bản tương đương trong Express là <code>jwt.sign({ sub, roles }, secret, { algorithm: 'HS256', expiresIn: '15m' })</code> của <code>jsonwebtoken</code> sau một lần <code>bcrypt.compare</code>. Cùng ba phần, cùng claim, token dùng lẫn được — bạn vừa thấy Node kiểm token của Spring ở trên. Khác biệt của Spring là cấu trúc: <code>AuthenticationManager</code> và <code>UserDetailsService</code> là interface chuẩn, nên đổi từ CSDL sang LDAP hay một nhà cung cấp danh tính bên ngoài (Keycloak, Google) là đổi cấu hình, không đổi controller.</p>

<h3>Đời thường và đi làm</h3>
<ul>
  <li>Dự án production thường không tự phát token: một nhà cung cấp danh tính (Keycloak, Auth0, Cognito, Microsoft Entra) làm việc đó, còn Spring Boot chỉ là <em>resource server</em> của bài 9.4. Tự viết <code>/auth/login</code> một lần là cách hiểu những sản phẩm đó làm gì.</li>
  <li>Dán token vào jwt.io để đọc — và nhớ rằng kẻ tấn công cũng làm được y như vậy.</li>
  <li>Bí mật được thay khi có người rời nhóm. Với HS256 việc đó đăng xuất tất cả mọi người; hãy lên kế hoạch.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Trong JWT có gì?"</strong> — Header (thuật toán, id khoá), payload (claim: <code>sub</code>, <code>exp</code>, <code>iat</code>, <code>iss</code>, vai trò tuỳ biến), chữ ký trên hai phần đầu. Mã hoá dạng chữ, không bí mật.</li>
  <li><strong>"HS256 hay RS256?"</strong> — HS256: một bí mật dùng chung, ký = kiểm, một ứng dụng. RS256: khoá riêng ký, khoá công khai kiểm, nhiều dịch vụ; xoay khoá được nhờ <code>kid</code>.</li>
  <li><strong>"JWT hay session trên server?"</strong> — Session: trạng thái ở server, đăng xuất dễ, cần sticky session hoặc kho chung. JWT: stateless, mở rộng ngang dễ, nhưng không thu hồi được trước <code>exp</code> — nên để ngắn và đi kèm một refresh token thu hồi được.</li>
  <li><strong>"alg none là gì?"</strong> — Token không chữ ký. Server không bao giờ được để token tự chọn thuật toán.</li>
</ol>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
  <li>Đăng nhập, chép access token, giải mã hai phần đầu bằng <code>base64 -d</code> (thêm dấu <code>=</code> cho đủ, đổi <code>-_</code> thành <code>+/</code>). Tính <code>exp − iat</code>.</li>
  <li>Tự kiểm chữ ký bằng Node.js hoặc Java với bí mật trong <code>application.properties</code>.</li>
  <li>Khởi động ứng dụng với bí mật 16 byte và giải thích mã trạng thái nhận được từ <code>/auth/login</code>; rồi làm cho nó thành 500.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đọc được <code>sub</code>, <code>roles</code> và <code>exp − iat</code> bằng 900, chữ ký bạn tính bằng phần thứ ba, và bạn gọi đúng tên exception cùng luật filter đã đổi 500 thành 401.</p></div>
${giai('Xem lời giải', `<p>Giải mã ra đúng header và payload của thí nghiệm 1; 1795142109 − 1795141209 = 900 giây. Bản kiểm bằng Node.js in <code>khớp = true</code>. Bí mật 16 byte gây <code>KeyLengthException</code> bên trong <code>JwtEncodingException</code>; lần chuyển tiếp sang <code>/error</code> bị bảo vệ trả 401; thêm <code>"/error"</code> vào <code>permitAll()</code> thì trả đúng 500.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">JWT</span><span class="v">JSON Web Token (RFC 7519): tập claim đã ký, an toàn khi đặt trong URL.</span></div>
  <div class="kv"><span class="k">Claim</span><span class="v">Một mệnh đề trong payload: <code>sub</code>, <code>exp</code>, <code>iat</code>, <code>iss</code>, <code>roles</code>.</span></div>
  <div class="kv"><span class="k">HS256</span><span class="v">Chữ ký HMAC-SHA256 với một bí mật dùng chung (≥ 256 bit).</span></div>
  <div class="kv"><span class="k">RS256</span><span class="v">Chữ ký RSA-SHA256: khoá riêng ký, khoá công khai kiểm.</span></div>
  <div class="kv"><span class="k">JWKS / kid</span><span class="v">Bộ khoá công khai được công bố; id khoá trong header chọn một khoá.</span></div>
  <div class="kv"><span class="k">AuthenticationManager</span><span class="v">Cửa vào của Spring để kiểm thông tin đăng nhập qua các provider.</span></div>
  <div class="kv"><span class="k">Access token</span><span class="v">Token ngắn hạn gửi theo mọi lời gọi API (<code>Authorization: Bearer …</code>).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li><code>/auth/login</code>: <code>AuthenticationManager.authenticate</code> → JWT có <code>sub</code>, <code>roles</code>, <code>iss</code>, <code>iat</code>, <code>exp</code>.</li>
  <li>Ai cũng đọc được JWT; chữ ký chỉ ngăn sửa. Đừng bỏ dữ liệu cá nhân vào.</li>
  <li>HS256 cần bí mật ≥ 256 bit lấy từ biến môi trường; RS256 khi bên khác cần kiểm token.</li>
  <li>Mở <code>/error</code>, nếu không lỗi server sẽ trông như 401.</li>
  <li>Spring Security 7 thêm quyền <code>FACTOR_*</code>: lọc <code>ROLE_</code> trước khi dựng claim.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://www.rfc-editor.org/rfc/rfc7519', '📜', 'RFC 7519 — JSON Web Token', 'Các claim đã đăng ký và định dạng.')}
${tl('https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html', '🍃', 'Spring Security — OAuth 2.0 Resource Server JWT', 'JwtDecoder, NimbusJwtEncoder, validator.')}
${tl('https://auth0.com/blog/critical-vulnerabilities-in-json-web-token-libraries/', '🕵️', 'Critical vulnerabilities in JSON Web Token libraries (2015)', 'alg none và nhầm lẫn khoá.')}

<h3>Nguồn</h3>
<ul>
  <li>Output ở trên: <code>c9.d.App</code> trong <code>lab/c9/sec</code> (người dùng trong PostgreSQL 16.15), Spring Boot 4.1.2, Spring Security 7.1.2, Nimbus JOSE+JWT 10.9.1; module <code>crypto</code> có sẵn của Node 22 (20/11/2026).</li>
  <li>Tim McLean, blog Auth0, 31/03/2015; CVE-2015-9235.</li>
</ul>
</div>
`;

// ===== Bài 9.4 =====
const MA94_CHAIN = java("@Bean\nSecurityFilterChain chain(HttpSecurity http, JwtAuthenticationConverter conv) throws Exception {\n    http.csrf(c -> c.disable())\n        .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))\n        .authorizeHttpRequests(a -> a\n            .requestMatchers(\"/auth/**\", \"/.well-known/**\", \"/error\").permitAll()   // /error mở: lỗi 500 không bị đổi thành 401\n            .requestMatchers(HttpMethod.GET, \"/labs\").permitAll()\n            .anyRequest().authenticated())\n        .oauth2ResourceServer(o -> o.jwt(j -> j.jwtAuthenticationConverter(conv)));\n    return http.build();\n}\n\n/** Claim \"roles\" ⇒ ROLE_STUDENT / ROLE_ADMIN. Profile \"scope\": giữ mặc định của Spring (claim scope ⇒ SCOPE_…). */\n@Bean\nJwtAuthenticationConverter jwtAuthenticationConverter(Environment env) {\n    JwtGrantedAuthoritiesConverter g = new JwtGrantedAuthoritiesConverter();\n    if (!env.matchesProfiles(\"scope\")) {\n        g.setAuthoritiesClaimName(\"roles\");\n        g.setAuthorityPrefix(\"ROLE_\");\n    }\n    JwtAuthenticationConverter c = new JwtAuthenticationConverter();\n    c.setJwtGrantedAuthoritiesConverter(g);\n    return c;\n}");
const MA94_ME = java("@GetMapping(\"/me\")\nMap<String, Object> me(Authentication a, @AuthenticationPrincipal Jwt jwt) {\n    return Map.of(\n        \"name\", a.getName(),\n        \"authorities\", a.getAuthorities().stream().map(Object::toString).toList(),\n        \"authenticationClass\", a.getClass().getSimpleName(),\n        \"sameAsContextHolder\", a == SecurityContextHolder.getContext().getAuthentication(),\n        \"thread\", Thread.currentThread().getName(),\n        \"expiresAt\", String.valueOf(jwt.getExpiresAt()));\n}");
const OUT94_KIEM = out("$ curl -i localhost:8080/me\nHTTP/1.1 401 \nWWW-Authenticate: Bearer resource_metadata=\"http://localhost:8080/.well-known/oauth-protected-resource\"\n\n$ curl -i -H \"Authorization: Bearer $AT\" localhost:8080/me\nHTTP/1.1 200 \n{\"expiresAt\":\"2026-11-20T02:35:09Z\",\"thread\":\"http-nio-8080-exec-4\",\"authenticationClass\":\"JwtAuthenticationToken\",\"sameAsContextHolder\":true,\"authorities\":[\"ROLE_STUDENT\",\"FactorGrantedAuthority [authority=FACTOR_BEARER, issuedAt=…]\"],\"name\":\"lan\"}\n\n# payload sửa thành \"roles\":[\"ADMIN\"], giữ nguyên chữ ký cũ\npayload mới = {\"iss\":\"labflow\",\"sub\":\"lan\",\"exp\":1795142109,\"iat\":1795141209,\"roles\":[\"ADMIN\"]}\n$ curl -i -H \"Authorization: Bearer <header>.<payload sửa>.<chữ ký cũ>\" localhost:8080/admin/users\nHTTP/1.1 401 \nWWW-Authenticate: Bearer error=\"invalid_token\", error_description=\"An error occurred while attempting to decode the Jwt: Signed JWT rejected: Invalid signature\", error_uri=\"https://tools.ietf.org/html/rfc6750#section-3.1\", resource_metadata=\"http://localhost:8080/.well-known/oauth-protected-resource\"\n\n# header {\"alg\":\"none\"}, payload sửa, KHÔNG có chữ ký\n$ curl -i -H \"Authorization: Bearer <none>.<payload sửa>.\" localhost:8080/admin/users\nHTTP/1.1 401 \nWWW-Authenticate: Bearer error=\"invalid_token\", error_description=\"Unsupported algorithm of none\", error_uri=\"https://tools.ietf.org/html/rfc6750#section-3.1\", resource_metadata=\"http://localhost:8080/.well-known/oauth-protected-resource\"\n\n# kẻ gian tự ký bằng bí mật của hắn\n$ curl -i -H \"Authorization: Bearer <header>.<payload sửa>.<chữ ký của kẻ gian>\" localhost:8080/admin/users\nHTTP/1.1 401 \nWWW-Authenticate: Bearer error=\"invalid_token\", error_description=\"An error occurred while attempting to decode the Jwt: Signed JWT rejected: Invalid signature\", error_uri=\"https://tools.ietf.org/html/rfc6750#section-3.1\", resource_metadata=\"http://localhost:8080/.well-known/oauth-protected-resource\"\n\n$ curl -i -H \"Authorization: Bearer khong-phai-jwt\" localhost:8080/me\nHTTP/1.1 401 \nWWW-Authenticate: Bearer error=\"invalid_token\", error_description=\"An error occurred while attempting to decode the Jwt: Malformed token\", error_uri=\"https://tools.ietf.org/html/rfc6750#section-3.1\", resource_metadata=\"http://localhost:8080/.well-known/oauth-protected-resource\"\n\n$ curl -i -H \"Authorization: Bearer $AT\" localhost:8080/admin/users      # token thật của lan (STUDENT)\nHTTP/1.1 403 \nWWW-Authenticate: Bearer error=\"insufficient_scope\", error_description=\"The request requires higher privileges than provided by the access token.\", error_uri=\"https://tools.ietf.org/html/rfc6750#section-3.1\"");
const OUT94_HAN = out("# access-ttl=3 giây, clock skew = PT60S\n$ curl -i -H \"Authorization: Bearer $AT\" localhost:8080/me   # ngay sau khi đăng nhập\nHTTP/1.1 200 \n{\"name\":\"lan\",\"expiresAt\":\"2026-11-20T02:20:35Z\",\"thread\":\"http-nio-8080-exec-2\",\"authenticationClass\":\"JwtAuthenticationToken\",\"sameAsContextHolder\":true,\"authorities\":[\"ROLE_STUDENT\",\"FactorGrantedAuthority [authority=FACTOR_BEARER, issuedAt=…]\"]}\n$ sleep 5; curl -i -H \"Authorization: Bearer $AT\" localhost:8080/me\nHTTP/1.1 200 \n{\"name\":\"lan\",\"expiresAt\":\"2026-11-20T02:20:35Z\",\"thread\":\"http-nio-8080-exec-4\",\"authenticationClass\":\"JwtAuthenticationToken\",\"sameAsContextHolder\":true,\"authorities\":[\"ROLE_STUDENT\",\"FactorGrantedAuthority [authority=FACTOR_BEARER, issuedAt=…]\"]}\n\n# access-ttl=3 giây, clock skew = PT0S\n$ curl -i -H \"Authorization: Bearer $AT\" localhost:8080/me   # ngay sau khi đăng nhập\nHTTP/1.1 200 \n{\"name\":\"lan\",\"authorities\":[\"ROLE_STUDENT\",\"FactorGrantedAuthority [authority=FACTOR_BEARER, issuedAt=…]\"],\"sameAsContextHolder\":true,\"authenticationClass\":\"JwtAuthenticationToken\",\"thread\":\"http-nio-8080-exec-2\",\"expiresAt\":\"2026-11-20T02:20:44Z\"}\n$ sleep 5; curl -i -H \"Authorization: Bearer $AT\" localhost:8080/me\nHTTP/1.1 401 \nWWW-Authenticate: Bearer error=\"invalid_token\", error_description=\"An error occurred while attempting to decode the Jwt: Jwt expired at 2026-11-20T02:20:44Z\", error_uri=\"https://tools.ietf.org/html/rfc6750#section-3.1\", resource_metadata=\"http://localhost:8080/.well-known/oauth-protected-resource\"");
const OUT94_TRACE = out("DEBUG o.s.security.web.FilterChainProxy        : Securing GET /me\nTRACE o.s.security.web.FilterChainProxy        : Invoking DisableEncodeUrlFilter (1/13)\nTRACE o.s.security.web.FilterChainProxy        : Invoking WebAsyncManagerIntegrationFilter (2/13)\nTRACE o.s.security.web.FilterChainProxy        : Invoking SecurityContextHolderFilter (3/13)\nTRACE o.s.security.web.FilterChainProxy        : Invoking HeaderWriterFilter (4/13)\nTRACE o.s.security.web.FilterChainProxy        : Invoking LogoutFilter (5/13)\nTRACE o.s.security.web.FilterChainProxy        : Invoking OAuth2ProtectedResourceMetadataFilter (6/13)\nTRACE o.s.security.web.FilterChainProxy        : Invoking BearerTokenAuthenticationFilter (7/13)\nDEBUG o.s.s.o.s.r.a.JwtAuthenticationProvider  : Authenticated token\nDEBUG .s.r.w.a.BearerTokenAuthenticationFilter : Set SecurityContextHolder to JwtAuthenticationToken […]\nTRACE o.s.security.web.FilterChainProxy        : Invoking RequestCacheAwareFilter (8/13)\nTRACE o.s.security.web.FilterChainProxy        : Invoking SecurityContextHolderAwareRequestFilter (9/13)\nTRACE o.s.security.web.FilterChainProxy        : Invoking AnonymousAuthenticationFilter (10/13)\nTRACE o.s.security.web.FilterChainProxy        : Invoking SessionManagementFilter (11/13)\nTRACE o.s.s.w.a.AnonymousAuthenticationFilter  : Did not set SecurityContextHolder since already authenticated JwtAuthenticationToken […]\nTRACE o.s.security.web.FilterChainProxy        : Invoking ExceptionTranslationFilter (12/13)\nTRACE o.s.security.web.FilterChainProxy        : Invoking AuthorizationFilter (13/13)\nTRACE estMatcherDelegatingAuthorizationManager : Authorizing …\nTRACE estMatcherDelegatingAuthorizationManager : Checking authorization on GET /me using org.springframework.security.authorization.AuthenticatedAuthorizationManager@5de0\nDEBUG o.s.security.web.FilterChainProxy        : Secured GET /me");

const L94_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.4</span>
<h2>Verifying JWTs on every request</h2>
<p class="lead">Issuing a token is half the job; the other half runs on every request: read the <code>Authorization</code> header, check the signature, the issuer and the expiry, turn the claims into authorities, and put the result in the <code>SecurityContext</code> before the controller runs. Spring Security does this as an OAuth 2.0 <em>resource server</em>. We trace the 13 filters of one request, attack the server with five forged tokens, and find out why a token that expired five seconds ago was still accepted.</p>

<h3>In everyday life first</h3>
<p>Back to the festival wristband. At every stage door a steward looks at it: is the hologram real (signature)? was it issued by this festival, not the one next door (issuer)? is today's date printed on it (expiry)? which colour (roles)? A fake hologram gets you sent back to the gate (401). A real band of the wrong colour gets you a polite "not this area" (403). The steward never calls the gate — that is what makes it fast, and also why a band cannot be cancelled once it is on someone's wrist.</p>

<h3>The configuration</h3>
${MA94_CHAIN}
<p><code>oauth2ResourceServer().jwt()</code> adds <code>BearerTokenAuthenticationFilter</code> and uses the <code>JwtDecoder</code> bean from 9.3 (secret key, a timestamp validator and an issuer validator). The converter maps our <code>roles</code> claim to <code>ROLE_…</code> authorities; lesson 9.6 shows what happens without it. A controller can read the result in two ways:</p>
${MA94_ME}

<h3>Experiment 1: one request, thirteen filters</h3>
<p><code>GET /me</code> with a valid token and <code>logging.level.org.springframework.security=TRACE</code>:</p>
${OUT94_TRACE}
<ul>
  <li><code>BearerTokenAuthenticationFilter</code> is 7th. It extracts the token, calls <code>JwtAuthenticationProvider</code> (decode + validate + convert), and stores a <code>JwtAuthenticationToken</code> in <code>SecurityContextHolder</code>.</li>
  <li><code>AnonymousAuthenticationFilter</code> sees someone is already authenticated and does nothing.</li>
  <li><code>AuthorizationFilter</code> (13th) checks the URL rule — here <code>authenticated()</code>.</li>
  <li><code>OAuth2ProtectedResourceMetadataFilter</code> is new in Spring Security 7: it serves <code>/.well-known/oauth-protected-resource</code> (RFC 9728) so a client can discover how to obtain a token. You will see its URL in every 401 below.</li>
</ul>
<p>And what the controller received:</p>
${OUT94_KIEM}
<p>The first two calls: without a header, 401 with <code>WWW-Authenticate: Bearer</code>; with the token, 200. The authentication object is a <code>JwtAuthenticationToken</code>, it is the same object <code>SecurityContextHolder</code> returns (<code>sameAsContextHolder: true</code>), and the thread name is Tomcat's worker: the context is bound to that thread for the duration of the request, then cleared. Code that hops to another thread (<code>@Async</code>, a <code>CompletableFuture</code>) does not see it unless you propagate it (Chapter 14).</p>

<h3>Experiment 2: five forged tokens</h3>
<p>The rest of the output above, one attack at a time:</p>
<ol>
  <li><strong>Edit the payload</strong> (<code>"roles":["ADMIN"]</code>) and keep the old signature: "Invalid signature". The signature covers every byte of header and payload.</li>
  <li><strong><code>"alg":"none"</code></strong>, no signature: "Unsupported algorithm of none" — the 2015 attack from 9.3 does not work, because the decoder decides the algorithm.</li>
  <li><strong>Sign with the attacker's own secret</strong>: "Invalid signature". Only the server's key counts.</li>
  <li><strong>Garbage</strong> instead of a JWT: "Malformed token".</li>
  <li><strong>A real STUDENT token on an ADMIN endpoint</strong>: 403 with <code>error="insufficient_scope"</code>. The token is valid; the permission is missing.</li>
</ol>
<p>All failures carry RFC 6750 error codes in <code>WWW-Authenticate</code>: <code>invalid_token</code> → 401 (log in again or refresh), <code>insufficient_scope</code> → 403 (do not retry). A frontend can branch on them.</p>

<h3>Experiment 3: a token that expired and still worked</h3>
<p>Access tokens of 3 seconds, a request immediately and another after 5 seconds, first with the default clock skew (60 s), then with zero:</p>
${OUT94_HAN}
<p>With the default validator, a token 2 seconds past its <code>exp</code> was accepted: <code>JwtTimestampValidator</code> allows 60 seconds of clock difference between servers. With <code>PT0S</code> the same wait gives 401 "Jwt expired at …". 60 seconds is reasonable in production (clocks drift); in tests set it to zero, or your "expired token" test will pass for the wrong reason. The effective lifetime of a token is <code>exp + skew</code>.</p>

<h3>What the resource server does NOT check</h3>
<ul>
  <li>Whether the user still exists, is locked, or changed role — the token is self-contained until it expires. A student promoted to ADMIN gets the new role at the next login or refresh; a fired admin keeps the old one for up to 15 minutes plus skew.</li>
  <li>Whether the user logged out. Lesson 9.5 measures it: an access token still answers 200 after logout.</li>
  <li>The audience (<code>aud</code>) unless you add a validator for it — important when one identity provider issues tokens for several APIs.</li>
</ul>
<p>Those are the trade-offs of stateless tokens: short lifetimes, a revocable refresh token, and for truly sensitive actions a database check in the method itself (9.6).</p>

<h3>🕵️ Hacker corner — Psychic Signatures (CVE-2022-21449)</h3>
<p>In April 2022 Neil Madden disclosed that Java 15 to 18 accepted an <em>empty</em> ECDSA signature: a signature with both values equal to zero verified against any message and any public key. A JWT signed with ES256 could be forged by anyone — header, payload, and a signature of zeros — and Java would say "valid". Oracle fixed it in the Critical Patch Update of 19/04/2022 (17.0.3, 18.0.1). Java 11 and earlier, which used older native code, were not affected. The lessons go beyond ES256:</p>
<ul>
  <li>Security depends on the JDK too: keep the runtime patched (base images in Chapter 17), not just your Maven dependencies.</li>
  <li>Test the negative path: our Experiment 2 is a cheap regression test you can keep in CI (Chapter 11).</li>
  <li>Prefer well-reviewed libraries (Nimbus, used by Spring) over hand-written verification.</li>
</ul>

<h3>Compared with Node.js</h3>
<p>Express typically uses <code>express-jwt</code> or <code>passport-jwt</code>: a middleware that verifies the header, sets <code>req.auth</code> / <code>req.user</code>, and calls <code>next(err)</code> on failure; you write the 401/403 handler. Spring does the same in <code>BearerTokenAuthenticationFilter</code>, with the standard <code>WWW-Authenticate</code> errors built in. One difference worth saying in an interview: in Node the user is attached to the request object; in Spring it lives in a thread-bound <code>SecurityContext</code>, which is why thread hopping matters.</p>

<h3>In real life and at work</h3>
<ul>
  <li>When an identity provider issues the tokens, the whole configuration is one property: <code>spring.security.oauth2.resourceserver.jwt.issuer-uri</code>. Spring downloads the public keys (JWKS) and validates <code>iss</code> for you.</li>
  <li>Clock skew bites in tests and on servers without NTP. "Token expired" errors only on one machine usually mean its clock is wrong.</li>
  <li>Never log full tokens; they are passwords for 15 minutes. Log the <code>sub</code> and the token's <code>jti</code> or first characters.</li>
</ul>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"What happens to a request with a Bearer token?"</strong> — <code>BearerTokenAuthenticationFilter</code> extracts it, <code>JwtDecoder</code> checks signature and claims (exp, nbf, iss), the converter builds authorities, the <code>Authentication</code> goes into the <code>SecurityContextHolder</code>, then <code>AuthorizationFilter</code> applies the rules.</li>
  <li><strong>"invalid_token vs insufficient_scope?"</strong> — 401 vs 403: bad/expired token vs valid token without the needed authority.</li>
  <li><strong>"Can you revoke a JWT?"</strong> — Not by itself; it is valid until <code>exp</code> (+ clock skew). Use short lifetimes, refresh tokens, or a denylist checked per request (which brings state back).</li>
  <li><strong>"Where is the current user stored?"</strong> — In a thread-local <code>SecurityContext</code>; it is cleared after the request and not inherited by other threads by default.</li>
</ol>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
  <li>Get a token, change one letter in its payload, and call <code>/me</code>. Copy the <code>error_description</code>.</li>
  <li>Start the application with <code>c9.access-ttl=PT3S</code>. Predict the status of a request sent 5 seconds after login with the default skew and with <code>c9.skew=PT0S</code>, then check.</li>
  <li>With TRACE logging, find the position of <code>BearerTokenAuthenticationFilter</code> and the line where the security context is set.</li>
</ol>
<p><strong>Done when:</strong> you saw "Invalid signature", your two predictions are 200 then 401, and you located filter 7/13 and the "Set SecurityContextHolder" line.</p></div>
${giai('Show the expected results', `<p>Editing the payload gives "Signed JWT rejected: Invalid signature" (attack 1 above). With the default 60-second skew the 5-second-old token is accepted (200); with zero skew it is rejected with "Jwt expired at …" (Experiment 3). The TRACE output shows "Invoking BearerTokenAuthenticationFilter (7/13)" followed by "Set SecurityContextHolder to JwtAuthenticationToken".</p>`)}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Resource server</span><span class="v">An API that accepts access tokens issued by someone (itself or an identity provider).</span></div>
  <div class="kv"><span class="k">Bearer token</span><span class="v">Whoever holds it may use it: <code>Authorization: Bearer &lt;token&gt;</code> (RFC 6750).</span></div>
  <div class="kv"><span class="k">JwtDecoder</span><span class="v">Parses, verifies the signature and runs validators on a JWT.</span></div>
  <div class="kv"><span class="k">Clock skew</span><span class="v">Tolerance for clock differences when checking <code>exp</code>/<code>nbf</code>; 60 s by default.</span></div>
  <div class="kv"><span class="k">SecurityContext</span><span class="v">Holds the current <code>Authentication</code>; bound to the request thread.</span></div>
  <div class="kv"><span class="k">insufficient_scope</span><span class="v">RFC 6750 error for a valid token lacking permission (403).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li><code>oauth2ResourceServer().jwt()</code> + a <code>JwtDecoder</code> = every request verified; filter 7 of 13 sets the context.</li>
  <li>Edited payload, <code>alg none</code>, foreign key, garbage: all 401 <code>invalid_token</code>; valid token without role: 403 <code>insufficient_scope</code>.</li>
  <li>Default skew of 60 s keeps an expired token alive briefly; set <code>PT0S</code> in tests.</li>
  <li>The resource server cannot know about logout or role changes until the token expires.</li>
  <li>Keep the JDK patched: CVE-2022-21449 accepted empty ECDSA signatures in Java 15–18.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html', '🍃', 'Spring Security — Resource Server JWT', 'Decoder, validators, authorities conversion.')}
${tl('https://www.rfc-editor.org/rfc/rfc6750', '📜', 'RFC 6750 — Bearer Token Usage', 'WWW-Authenticate error codes.')}
${tl('https://neilmadden.blog/2022/04/19/psychic-signatures-in-java/', '🕵️', 'Psychic Signatures in Java (2022)', 'CVE-2022-21449 explained by its finder.')}

<h3>Sources</h3>
<ul>
  <li>Outputs above: <code>c9.d.App</code> in <code>lab/c9/sec</code>, Spring Boot 4.1.2, Spring Security 7.1.2, Nimbus JOSE+JWT 10.9.1, forged tokens built with <code>base64</code> and <code>openssl dgst -hmac</code> (20/11/2026).</li>
  <li>Neil Madden, 19/04/2022; Oracle Critical Patch Update April 2022.</li>
</ul>
</div>
`;

const L94_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.4</span>
<h2>Kiểm JWT trên mọi request</h2>
<p class="lead">Phát token mới là một nửa công việc; nửa kia chạy ở mọi request: đọc header <code>Authorization</code>, kiểm chữ ký, bên phát và hạn dùng, đổi claim thành quyền, rồi đặt kết quả vào <code>SecurityContext</code> trước khi controller chạy. Spring Security làm việc này với vai trò <em>resource server</em> của OAuth 2.0. Ta lần theo 13 filter của một request, tấn công server bằng năm token giả, và tìm ra vì sao một token đã hết hạn năm giây vẫn được chấp nhận.</p>

<h3>Đời thường trước đã</h3>
<p>Quay lại chiếc vòng tay lễ hội. Ở mỗi cửa sân khấu, một nhân viên nhìn nó: tem ba chiều có thật không (chữ ký)? có phải do lễ hội này phát, không phải lễ hội bên cạnh (bên phát)? có in ngày hôm nay không (hạn dùng)? màu gì (vai trò)? Tem giả thì bị mời về cổng (401). Vòng thật nhưng sai màu thì được nhắc khéo "khu này không dành cho bạn" (403). Nhân viên không bao giờ gọi về cổng — vì thế mà nhanh, và cũng vì thế mà vòng đã đeo lên tay thì không huỷ được.</p>

<h3>Cấu hình</h3>
${MA94_CHAIN}
<p><code>oauth2ResourceServer().jwt()</code> thêm <code>BearerTokenAuthenticationFilter</code> và dùng bean <code>JwtDecoder</code> của bài 9.3 (khoá bí mật, một validator thời gian và một validator bên phát). Converter đổi claim <code>roles</code> của ta thành quyền <code>ROLE_…</code>; bài 9.6 cho thấy chuyện gì xảy ra khi thiếu nó. Controller đọc kết quả theo hai cách:</p>
${MA94_ME}

<h3>Thí nghiệm 1: một request, mười ba filter</h3>
<p><code>GET /me</code> với token hợp lệ và <code>logging.level.org.springframework.security=TRACE</code>:</p>
${OUT94_TRACE}
<ul>
  <li><code>BearerTokenAuthenticationFilter</code> đứng thứ 7. Nó lấy token ra, gọi <code>JwtAuthenticationProvider</code> (giải mã + kiểm + chuyển đổi), và cất một <code>JwtAuthenticationToken</code> vào <code>SecurityContextHolder</code>.</li>
  <li><code>AnonymousAuthenticationFilter</code> thấy đã có người được xác thực nên không làm gì.</li>
  <li><code>AuthorizationFilter</code> (thứ 13) kiểm luật URL — ở đây là <code>authenticated()</code>.</li>
  <li><code>OAuth2ProtectedResourceMetadataFilter</code> là filter mới của Spring Security 7: nó phục vụ <code>/.well-known/oauth-protected-resource</code> (RFC 9728) để client tự tìm cách lấy token. Bạn sẽ thấy URL đó trong mọi phản hồi 401 dưới đây.</li>
</ul>
<p>Và thứ controller nhận được:</p>
${OUT94_KIEM}
<p>Hai lời gọi đầu: không có header ⇒ 401 kèm <code>WWW-Authenticate: Bearer</code>; có token ⇒ 200. Đối tượng xác thực là <code>JwtAuthenticationToken</code>, chính là đối tượng mà <code>SecurityContextHolder</code> trả về (<code>sameAsContextHolder: true</code>), và tên luồng là luồng làm việc của Tomcat: context được gắn vào luồng đó suốt thời gian xử lý request, rồi bị xoá. Mã nào nhảy sang luồng khác (<code>@Async</code>, một <code>CompletableFuture</code>) sẽ không thấy nó trừ khi bạn truyền theo (Chương 14).</p>

<h3>Thí nghiệm 2: năm token giả</h3>
<p>Phần còn lại của output trên, từng đòn một:</p>
<ol>
  <li><strong>Sửa payload</strong> (<code>"roles":["ADMIN"]</code>) và giữ chữ ký cũ: "Invalid signature". Chữ ký phủ từng byte của header và payload.</li>
  <li><strong><code>"alg":"none"</code></strong>, không chữ ký: "Unsupported algorithm of none" — đòn năm 2015 ở bài 9.3 không ăn, vì bộ giải mã tự quyết thuật toán.</li>
  <li><strong>Ký bằng bí mật riêng của kẻ tấn công</strong>: "Invalid signature". Chỉ khoá của server mới tính.</li>
  <li><strong>Rác</strong> thay vì JWT: "Malformed token".</li>
  <li><strong>Token STUDENT thật gọi endpoint ADMIN</strong>: 403 kèm <code>error="insufficient_scope"</code>. Token hợp lệ; chỉ thiếu quyền.</li>
</ol>
<p>Mọi lỗi đều mang mã lỗi RFC 6750 trong <code>WWW-Authenticate</code>: <code>invalid_token</code> → 401 (đăng nhập lại hoặc refresh), <code>insufficient_scope</code> → 403 (đừng thử lại). Frontend có thể rẽ nhánh theo mã đó.</p>

<h3>Thí nghiệm 3: token đã hết hạn mà vẫn chạy</h3>
<p>Access token sống 3 giây, gửi một request ngay lập tức và một request sau 5 giây, lần đầu với độ lệch đồng hồ mặc định (60 giây), lần sau với độ lệch bằng không:</p>
${OUT94_HAN}
<p>Với validator mặc định, token đã quá <code>exp</code> 2 giây vẫn được nhận: <code>JwtTimestampValidator</code> cho phép đồng hồ giữa các server lệch nhau 60 giây. Với <code>PT0S</code>, cùng thời gian chờ đó cho 401 "Jwt expired at …". 60 giây là hợp lý ở production (đồng hồ có trôi); trong test hãy đặt bằng không, nếu không bài test "token hết hạn" sẽ đạt vì lý do sai. Thời gian sống thật của token là <code>exp + skew</code>.</p>

<h3>Những gì resource server KHÔNG kiểm</h3>
<ul>
  <li>Người dùng còn tồn tại không, có bị khoá không, có đổi vai trò không — token tự chứa mọi thứ cho tới khi hết hạn. Sinh viên được nâng lên ADMIN chỉ có vai trò mới ở lần đăng nhập hay refresh kế tiếp; một admin bị cho nghỉ vẫn giữ vai trò cũ tối đa 15 phút cộng độ lệch.</li>
  <li>Người dùng đã đăng xuất chưa. Bài 9.5 đo điều đó: access token vẫn trả 200 sau khi đăng xuất.</li>
  <li>Đối tượng nhận (<code>aud</code>), trừ khi bạn thêm validator cho nó — quan trọng khi một nhà cung cấp danh tính phát token cho nhiều API.</li>
</ul>
<p>Đó là cái giá của token stateless: thời gian sống ngắn, một refresh token thu hồi được, và với thao tác thật sự nhạy cảm thì kiểm thêm CSDL ngay trong phương thức (bài 9.6).</p>

<h3>🕵️ Góc hacker — Psychic Signatures (CVE-2022-21449)</h3>
<p>Tháng 4/2022 Neil Madden công bố rằng Java 15 tới 18 chấp nhận một chữ ký ECDSA <em>rỗng</em>: chữ ký có cả hai giá trị bằng không vẫn qua kiểm với mọi thông điệp và mọi khoá công khai. Một JWT ký bằng ES256 có thể bị bất kỳ ai làm giả — header, payload, và một chữ ký toàn số không — mà Java vẫn nói "hợp lệ". Oracle vá lỗi trong bản Critical Patch Update ngày 19/04/2022 (17.0.3, 18.0.1). Java 11 trở về trước dùng mã native cũ nên không dính. Bài học vượt ra ngoài ES256:</p>
<ul>
  <li>An toàn còn phụ thuộc cả JDK: giữ runtime luôn được vá (ảnh nền ở Chương 17), không chỉ các phụ thuộc Maven.</li>
  <li>Test cả đường thất bại: thí nghiệm 2 của ta là một bài test hồi quy rẻ tiền có thể giữ trong CI (Chương 11).</li>
  <li>Dùng thư viện đã được soát kỹ (Nimbus, thứ Spring dùng) thay vì tự viết phần kiểm chữ ký.</li>
</ul>

<h3>So với Node.js</h3>
<p>Express thường dùng <code>express-jwt</code> hoặc <code>passport-jwt</code>: một middleware kiểm header, gán <code>req.auth</code> / <code>req.user</code>, và gọi <code>next(err)</code> khi hỏng; bạn tự viết hàm xử lý 401/403. Spring làm y như vậy trong <code>BearerTokenAuthenticationFilter</code>, có sẵn các lỗi <code>WWW-Authenticate</code> chuẩn. Một khác biệt đáng nói khi phỏng vấn: ở Node người dùng được gắn vào đối tượng request; ở Spring nó nằm trong <code>SecurityContext</code> gắn với luồng, nên chuyện nhảy luồng mới quan trọng.</p>

<h3>Đời thường và đi làm</h3>
<ul>
  <li>Khi một nhà cung cấp danh tính phát token, cả cấu hình chỉ còn một thuộc tính: <code>spring.security.oauth2.resourceserver.jwt.issuer-uri</code>. Spring tự tải khoá công khai (JWKS) và kiểm <code>iss</code> giúp bạn.</li>
  <li>Độ lệch đồng hồ hay cắn trong test và trên server không có NTP. Lỗi "token hết hạn" chỉ xảy ra trên một máy thường nghĩa là đồng hồ máy đó sai.</li>
  <li>Đừng bao giờ ghi log nguyên token; trong 15 phút nó chính là mật khẩu. Hãy ghi <code>sub</code> và <code>jti</code> hoặc vài ký tự đầu của token.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Một request có Bearer token đi qua những gì?"</strong> — <code>BearerTokenAuthenticationFilter</code> lấy token, <code>JwtDecoder</code> kiểm chữ ký và claim (exp, nbf, iss), converter dựng danh sách quyền, <code>Authentication</code> vào <code>SecurityContextHolder</code>, rồi <code>AuthorizationFilter</code> áp luật.</li>
  <li><strong>"invalid_token khác insufficient_scope thế nào?"</strong> — 401 và 403: token hỏng/hết hạn, so với token hợp lệ nhưng thiếu quyền cần thiết.</li>
  <li><strong>"Có thu hồi được JWT không?"</strong> — Tự nó thì không; nó hợp lệ tới <code>exp</code> (+ độ lệch). Dùng thời gian sống ngắn, refresh token, hoặc một danh sách cấm kiểm ở mọi request (lại mang trạng thái quay về).</li>
  <li><strong>"Người dùng hiện tại được lưu ở đâu?"</strong> — Trong <code>SecurityContext</code> theo luồng; nó bị xoá sau request và mặc định không được luồng khác kế thừa.</li>
</ol>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
  <li>Lấy một token, đổi một chữ cái trong payload, rồi gọi <code>/me</code>. Chép lại <code>error_description</code>.</li>
  <li>Khởi động ứng dụng với <code>c9.access-ttl=PT3S</code>. Đoán mã trạng thái của request gửi 5 giây sau khi đăng nhập, với độ lệch mặc định và với <code>c9.skew=PT0S</code>, rồi kiểm.</li>
  <li>Bật log TRACE, tìm vị trí của <code>BearerTokenAuthenticationFilter</code> và dòng đặt security context.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn thấy "Invalid signature", hai dự đoán là 200 rồi 401, và bạn chỉ ra filter 7/13 cùng dòng "Set SecurityContextHolder".</p></div>
${giai('Xem kết quả mong đợi', `<p>Sửa payload cho "Signed JWT rejected: Invalid signature" (đòn 1 ở trên). Với độ lệch mặc định 60 giây, token quá hạn 5 giây vẫn được nhận (200); độ lệch bằng không thì bị từ chối với "Jwt expired at …" (thí nghiệm 3). Output TRACE có "Invoking BearerTokenAuthenticationFilter (7/13)" rồi tới "Set SecurityContextHolder to JwtAuthenticationToken".</p>`)}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Resource server</span><span class="v">API nhận access token do ai đó phát (chính nó hoặc một nhà cung cấp danh tính).</span></div>
  <div class="kv"><span class="k">Bearer token</span><span class="v">Ai cầm thì người đó dùng được: <code>Authorization: Bearer &lt;token&gt;</code> (RFC 6750).</span></div>
  <div class="kv"><span class="k">JwtDecoder</span><span class="v">Phân tích, kiểm chữ ký và chạy các validator trên một JWT.</span></div>
  <div class="kv"><span class="k">Độ lệch đồng hồ (clock skew)</span><span class="v">Khoảng dung sai cho chênh lệch đồng hồ khi kiểm <code>exp</code>/<code>nbf</code>; mặc định 60 giây.</span></div>
  <div class="kv"><span class="k">SecurityContext</span><span class="v">Giữ <code>Authentication</code> hiện tại; gắn với luồng xử lý request.</span></div>
  <div class="kv"><span class="k">insufficient_scope</span><span class="v">Mã lỗi RFC 6750 cho token hợp lệ nhưng thiếu quyền (403).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li><code>oauth2ResourceServer().jwt()</code> + một <code>JwtDecoder</code> = mọi request đều được kiểm; filter thứ 7 trên 13 đặt context.</li>
  <li>Payload bị sửa, <code>alg none</code>, khoá lạ, rác: đều 401 <code>invalid_token</code>; token hợp lệ thiếu vai trò: 403 <code>insufficient_scope</code>.</li>
  <li>Độ lệch mặc định 60 giây giữ token hết hạn sống thêm một lúc; trong test đặt <code>PT0S</code>.</li>
  <li>Resource server không biết chuyện đăng xuất hay đổi vai trò cho tới khi token hết hạn.</li>
  <li>Giữ JDK được vá: CVE-2022-21449 làm Java 15–18 chấp nhận chữ ký ECDSA rỗng.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html', '🍃', 'Spring Security — Resource Server JWT', 'Decoder, validator, chuyển đổi quyền.')}
${tl('https://www.rfc-editor.org/rfc/rfc6750', '📜', 'RFC 6750 — Bearer Token Usage', 'Các mã lỗi trong WWW-Authenticate.')}
${tl('https://neilmadden.blog/2022/04/19/psychic-signatures-in-java/', '🕵️', 'Psychic Signatures in Java (2022)', 'CVE-2022-21449 do chính người phát hiện giải thích.')}

<h3>Nguồn</h3>
<ul>
  <li>Output ở trên: <code>c9.d.App</code> trong <code>lab/c9/sec</code>, Spring Boot 4.1.2, Spring Security 7.1.2, Nimbus JOSE+JWT 10.9.1; token giả dựng bằng <code>base64</code> và <code>openssl dgst -hmac</code> (20/11/2026).</li>
  <li>Neil Madden, 19/04/2022; Oracle Critical Patch Update tháng 4/2022.</li>
</ul>
</div>
`;

// ===== Bài 9.5 =====
const MA95_SQL = sql("create table refresh_tokens (\n  id         bigint generated always as identity primary key,\n  user_id    bigint      not null references users,\n  token_hash char(64)    not null unique,\n  family     uuid        not null,\n  expires_at timestamptz not null,\n  used_at    timestamptz,\n  revoked_at timestamptz\n);");
const MA95_XOAY = java("@Transactional\nKetQua xoay(String t) {\n    Optional<Dong> d = db.sql(\"\"\"\n            select r.id, u.username, u.role, r.family, r.expires_at as het, r.used_at as da_dung, r.revoked_at as thu_hoi\n            from refresh_tokens r join users u on u.id = r.user_id where r.token_hash = ? for update of r\"\"\")\n        .param(sha256(t)).query(Dong.class).optional();\n    if (d.isEmpty()) return new KetQua(\"KHONG_CO\", null, null, null);\n    Dong r = d.get();\n    if (r.thuHoi() != null) return new KetQua(\"DA_THU_HOI\", r.username(), null, null);\n    if (r.het().toInstant().isBefore(Instant.now())) return new KetQua(\"HET_HAN\", r.username(), null, null);\n    if (xoay && r.daDung() != null) {\n        int n = db.sql(\"update refresh_tokens set revoked_at = now() where family = ? and revoked_at is null\").param(r.family()).update();\n        System.out.println(\"[refresh] token đã xoay bị DÙNG LẠI (user \" + r.username() + \") ⇒ thu hồi cả họ \" + r.family() + \": \" + n + \" token\");\n        if (nem) throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED, \"token đã bị dùng lại\");\n        return new KetQua(\"DUNG_LAI\", r.username(), null, null);\n    }\n    if (!xoay) return new KetQua(\"OK\", r.username(), r.role(), t);           // bản không xoay: một token dùng mãi tới hết hạn\n    db.sql(\"update refresh_tokens set used_at = now() where id = ?\").param(r.id()).update();\n    return new KetQua(\"OK\", r.username(), r.role(), cap(r.username(), r.family()));\n}");
const MA95_API = java("@PostMapping(\"/refresh\")\nResponseEntity<?> lamMoi(@CookieValue(name = \"rt\", required = false) String rt) {\n    if (rt == null) return loi401(\"thiếu refresh token\");\n    Refresh.KetQua k = refresh.xoay(rt);\n    if (!k.trangThai().equals(\"OK\")) return loi401(\"refresh token không dùng được: \" + k.trangThai());\n    return traToken(k.username(), List.of(k.role()), k.tokenMoi());\n}\n\n@PostMapping(\"/logout\")\nResponseEntity<?> dangXuat(@CookieValue(name = \"rt\", required = false) String rt) {\n    int n = rt == null ? 0 : refresh.thuHoi(rt);\n    System.out.println(\"[logout] thu hồi \" + n + \" refresh token\");\n    return ResponseEntity.noContent().header(HttpHeaders.SET_COOKIE, cookie(\"\", Duration.ZERO)).build();\n}");
const MA95_COOKIE = java("private static String cookie(String v, Duration age) {\n    return ResponseCookie.from(\"rt\", v).httpOnly(true).secure(true).sameSite(\"Strict\").path(\"/auth\").maxAge(age).build().toString();\n}");
const OUT95_RF = out("# đăng nhập ⇒ refresh token RT1 = 5hk14PwjnT8p…\n$ curl -i -X POST localhost:8080/auth/refresh -H \"Cookie: rt=$RT1\"\nHTTP/1.1 200 \nSet-Cookie: rt=QEOQ1y15TXy9…; Path=/auth; Max-Age=604800; Expires=Fri, 27 Nov 2026 02:29:18 GMT; Secure; HttpOnly; SameSite=Strict\n{\"token_type\":\"Bearer\",\"expires_in\":900,\"access_token\":\"eyJhbGciOiJIUzI1NiJ9…\"}\n\n# RT2 = QEOQ1y15TXy9…  (RT1 ≠ RT2: đúng)\n$ psql: select id, family, used_at is not null as da_dung, revoked_at is not null as thu_hoi from refresh_tokens\n id |  token_hash   |                family                | da_dung | thu_hoi \n----+---------------+--------------------------------------+---------+---------\n  1 | 35bd17092a4a… | 7b8280a0-c057-4570-b7bf-2ea57a666d19 | t       | f\n  2 | 64524a1b1605… | 7b8280a0-c057-4570-b7bf-2ea57a666d19 | f       | f\n(2 rows)\n\n# kẻ gian có bản sao RT1 (đã xoay) và dùng nó:\n$ curl -X POST localhost:8080/auth/refresh -H \"Cookie: rt=$RT1\"\n{\"detail\":\"refresh token không dùng được: DUNG_LAI\",\"instance\":\"/auth/refresh\",\"status\":401,\"title\":\"Unauthorized\"}  ⇒ HTTP 401\n# chủ thật dùng RT2 (chưa từng dùng):\n$ curl -X POST localhost:8080/auth/refresh -H \"Cookie: rt=$RT2\"\n{\"detail\":\"refresh token không dùng được: DA_THU_HOI\",\"instance\":\"/auth/refresh\",\"status\":401,\"title\":\"Unauthorized\"}  ⇒ HTTP 401\n id |                family                | da_dung | thu_hoi \n----+--------------------------------------+---------+---------\n  1 | 7b8280a0-c057-4570-b7bf-2ea57a666d19 | t       | t\n  2 | 7b8280a0-c057-4570-b7bf-2ea57a666d19 | f       | t\n(2 rows)\n\n[refresh] token đã xoay bị DÙNG LẠI (user lan) ⇒ thu hồi cả họ 7b8280a0-c057-4570-b7bf-2ea57a666d19: 2 token\n\n# đăng nhập lại ⇒ RT3 + access token AT3; rồi đăng xuất\n$ curl -i -X POST localhost:8080/auth/logout -H \"Cookie: rt=$RT3\"\nHTTP/1.1 204 \nSet-Cookie: rt=; Path=/auth; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; HttpOnly; SameSite=Strict\n[logout] thu hồi 1 refresh token\n$ curl -X POST localhost:8080/auth/refresh -H \"Cookie: rt=$RT3\"\n{\"detail\":\"refresh token không dùng được: DA_THU_HOI\",\"instance\":\"/auth/refresh\",\"status\":401,\"title\":\"Unauthorized\"}  ⇒ HTTP 401\n$ curl -H \"Authorization: Bearer $AT3\" localhost:8080/me      # access token cũ SAU khi đăng xuất\nHTTP 200");
const OUT95_KX = out("# c9.xoay=false: một refresh token dùng mãi tới khi hết hạn 7 ngày\nchủ thật refresh bằng RT1 ⇒ HTTP 200\nkẻ gian refresh bằng RT1 ⇒ HTTP 200\nchủ thật refresh bằng RT1 ⇒ HTTP 200\nkẻ gian refresh bằng RT1 ⇒ HTTP 200");
const OUT95_NEM = out("# c9.nem=true: phát hiện dùng lại thì NÉM ResponseStatusException(401) ngay trong @Transactional\n$ curl -X POST localhost:8080/auth/refresh -H \"Cookie: rt=$RT1\"      # kẻ gian dùng lại RT1\nHTTP 401\n[refresh] token đã xoay bị DÙNG LẠI (user lan) ⇒ thu hồi cả họ 0dda49c7-a876-4b15-9524-d1aa71335d01: 2 token\n id | da_dung | thu_hoi \n----+---------+---------\n  1 | t       | f\n  2 | f       | f\n(2 rows)\n\n$ curl -X POST localhost:8080/auth/refresh -H \"Cookie: rt=$RT2\"      # kẻ gian (hoặc chủ) dùng RT2\nHTTP 200");

const L95_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.5</span>
<h2>Refresh tokens and logout</h2>
<p class="lead">A 15-minute access token is safe but annoying; a 7-day one is convenient and dangerous. The standard answer is two tokens: a short JWT for API calls and a long-lived, random, revocable <em>refresh token</em> kept in the database. This lesson stores only its SHA-256, rotates it on every use, detects a stolen copy when it is replayed and revokes the whole family, puts it in an <code>HttpOnly</code> cookie, and measures the uncomfortable truth about logout: the access token still works afterwards.</p>

<h3>In everyday life first</h3>
<p>A gym gives you a day pass (access token) at the desk each morning, and a membership card (refresh token) that you show to get a new day pass. The desk keeps a list of member cards. Every time you show your card they punch a new one and cut the old one in half. If someone ever shows a card that was already cut, the desk knows one of the two people holding "your" card is a thief — so it blocks every card in your name and asks you to come in with ID. Losing the day pass costs one day; the card can be cancelled at any time.</p>

<h3>The table</h3>
${MA95_SQL}
<ul>
  <li><code>token_hash</code>, not the token: a leaked database or backup does not give usable tokens. A refresh token is random (256 bits), so a fast SHA-256 is enough here — unlike passwords, there is no dictionary to try.</li>
  <li><code>family</code>: every token created by rotation from the same login shares it, so one update can revoke the whole chain.</li>
  <li><code>used_at</code> and <code>revoked_at</code> instead of deleting rows: you keep the evidence for an incident review.</li>
</ul>

<h3>Rotation and reuse detection</h3>
${MA95_XOAY}
<p>Note the shape: the method never throws. It returns a status, and the controller decides on 401. Throwing inside <code>@Transactional</code> would roll back the <code>update … revoked_at</code> — the one line that matters when a theft is detected (the propagation trap of lesson 6.5, in a security setting). <code>for update of r</code> locks the row so two parallel refreshes with the same token cannot both succeed.</p>
${MA95_API}
${MA95_COOKIE}

<h3>Experiment 1: rotate, replay, revoke</h3>
${OUT95_RF}
<p>Step by step:</p>
<ol>
  <li>Login gives RT1. <code>/auth/refresh</code> with RT1 returns a new access token and a new cookie RT2. Rows 1 and 2 share one family; row 1 is now <code>da_dung = t</code>.</li>
  <li>An attacker who copied RT1 earlier replays it: 401 <code>DUNG_LAI</code>, and the server revokes every token of the family — the log line says 2 tokens.</li>
  <li>The real user, holding the brand-new RT2, is now also refused (<code>DA_THU_HOI</code>). That is intended: the server cannot tell which of the two is the thief, so both must log in again with the password, which only the real user has.</li>
  <li>Logout revokes the family and clears the cookie (<code>Max-Age=0</code>); the refresh token is dead.</li>
  <li><strong>But</strong> the access token issued before logout still answers <strong>200</strong>. It is a self-contained JWT; nothing on the resource server knows about the logout. It dies at <code>exp</code> (+ 60 s skew).</li>
</ol>
<p>Without rotation (profile <code>c9.xoay=false</code>, the way many tutorials do it):</p>
${OUT95_KX}
<p>The owner and the attacker refresh with the same token forever, and the server never notices. Rotation turns a silent theft into a detected one.</p>

<h3>Experiment 2: the same detection, but throwing</h3>
<p>Profile <code>c9.nem=true</code> changes one line: after the revoking <code>update</code>, the service throws <code>ResponseStatusException(401)</code> instead of returning a status.</p>
${OUT95_NEM}
<p>The client still gets 401 and the log still says "2 token" were revoked — yet the table shows nothing revoked, and the next token in the family answers 200. The exception left the <code>@Transactional</code> method, Spring rolled the transaction back, and the revocation disappeared with it. A log line is not a commit.</p>

<h3>Where should the browser keep the tokens?</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Access token</span><span class="v">In memory (a JavaScript variable). Lost on page reload — that is fine, a refresh gets a new one.</span></div>
  <div class="kv"><span class="k">Refresh token</span><span class="v"><code>HttpOnly</code> cookie: JavaScript cannot read it, so an XSS bug cannot steal it. <code>Secure</code>: HTTPS only. <code>SameSite=Strict</code>: not sent by requests started from other sites. <code>Path=/auth</code>: not sent with ordinary API calls.</span></div>
  <div class="kv"><span class="k">localStorage</span><span class="v">Readable by any script on the page. One XSS (Chapter 10) and every token is gone. Avoid for refresh tokens.</span></div>
  <div class="kv"><span class="k">Mobile app</span><span class="v">No cookies needed: the platform's secure storage (Keychain, Android Keystore), refresh token sent in the body.</span></div>
</div>
<p>A cookie brings back the CSRF question of 9.1. Here it is contained: the cookie only goes to <code>/auth/refresh</code> and <code>/auth/logout</code>, <code>SameSite=Strict</code> blocks cross-site sending, and the refresh response (a new access token) is readable only by the page that made the request. Lesson 10.4 covers the general case.</p>

<h3>What logout can and cannot do</h3>
<ul>
  <li>Can: revoke the refresh family (no new access tokens), clear the cookie, and the frontend drops the in-memory access token.</li>
  <li>Cannot: invalidate an access token already copied elsewhere. Options, in order of cost: keep access tokens short (5–15 min); keep a denylist of <code>jti</code> values until they expire (checked per request — state again); or a per-user "tokens issued before T are invalid" timestamp checked in a custom validator.</li>
  <li>For "log out of all devices" (password change, stolen phone): revoke every family of the user — one <code>update … where user_id = ?</code>.</li>
</ul>

<h3>🕵️ Hacker corner — stolen tokens, April 2022</h3>
<p>On 15/04/2022 GitHub reported that an attacker had used <em>OAuth user tokens</em> stolen from two integrators, Heroku and Travis CI, to list and download private repositories of dozens of organisations, npm among them. The tokens were valid, long-lived, and not tied to the device that received them, so GitHub's servers saw ordinary authorised requests. GitHub, Heroku and Travis CI revoked the tokens in bulk. What applies to our design:</p>
<ul>
  <li>Long-lived tokens are passwords: store only hashes, give them an expiry, and make bulk revocation one query.</li>
  <li>Rotation plus reuse detection turns a quietly copied token into an alarm (Experiment 1).</li>
  <li>Log every refresh with user, family and IP so a review can answer "which tokens were used, from where".</li>
</ul>

<h3>Compared with Node.js</h3>
<p>Nothing here is Spring-specific: <code>jsonwebtoken</code> signs the access token, <code>crypto.randomBytes(32)</code> creates the refresh token, <code>res.cookie('rt', t, { httpOnly: true, secure: true, sameSite: 'strict', path: '/auth' })</code> sets the cookie, and a <code>refresh_tokens</code> table in Prisma stores the hash and family. Neither ecosystem gives you rotation for free unless you use an identity provider (Keycloak, Auth0 and Cognito all implement refresh-token rotation and reuse detection). The design is the interview answer, not the library.</p>

<h3>In real life and at work</h3>
<ul>
  <li>Two browser tabs refreshing at the same moment send the same refresh token; with strict reuse detection the second one logs the user out. Real systems allow a short grace period (a few seconds) or let one tab refresh for all.</li>
  <li>Clean up expired rows with a scheduled job (Chapter 14), or the table grows with every login.</li>
  <li>Show users their active sessions ("Chrome on Windows, last used 2 hours ago") — that is just the families table.</li>
</ul>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"Why two tokens?"</strong> — The access token is checked statelessly on every call and must be short-lived; the refresh token is checked against the database only at <code>/auth/refresh</code>, so it can be long-lived and revocable.</li>
  <li><strong>"What is refresh token rotation?"</strong> — Every refresh returns a new refresh token and invalidates the old one. A replay of an old one means theft: revoke the family.</li>
  <li><strong>"Does logout invalidate the JWT?"</strong> — No: measured here, it still answers 200 until <code>exp</code>. Logout revokes the refresh token; short access lifetimes limit the window.</li>
  <li><strong>"Cookie or localStorage?"</strong> — Refresh token in an <code>HttpOnly; Secure; SameSite=Strict</code> cookie scoped to <code>/auth</code>; access token in memory.</li>
</ol>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
  <li>Log in, refresh twice, and draw the family table (ids, <code>used_at</code>, <code>revoked_at</code>) before running the SQL.</li>
  <li>Replay the first refresh token. Predict what the latest token does afterwards.</li>
  <li>Change the service so it throws an exception instead of returning <code>DUNG_LAI</code>, replay again, and look at <code>revoked_at</code>.</li>
</ol>
<p><strong>Done when:</strong> your drawing matches the query, you predicted that the latest token is also refused, and you can explain why the throwing version leaves <code>revoked_at</code> empty.</p></div>
${giai('Show the reasoning', `<p>After two refreshes: three rows in one family, the first two <code>used_at</code> set, none revoked. Replaying the first sets <code>revoked_at</code> on every row of the family, so the latest token gets 401 too (Experiment 1). An exception thrown out of the <code>@Transactional</code> method marks the transaction for rollback, so the revoking <code>update</code> is undone and the stolen chain stays alive: Experiment 2 measured <code>thu_hoi = f</code> on both rows and 200 for the next token.</p>`)}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Refresh token</span><span class="v">Long-lived, random, server-stored credential used only to obtain new access tokens.</span></div>
  <div class="kv"><span class="k">Rotation</span><span class="v">Issuing a new refresh token on every use and invalidating the old one.</span></div>
  <div class="kv"><span class="k">Token family</span><span class="v">All refresh tokens descended from one login; revoked together on reuse.</span></div>
  <div class="kv"><span class="k">Reuse detection</span><span class="v">Treating the second use of a rotated token as theft.</span></div>
  <div class="kv"><span class="k">HttpOnly / SameSite</span><span class="v">Cookie flags: invisible to JavaScript / not sent on cross-site requests.</span></div>
  <div class="kv"><span class="k">Revocation</span><span class="v">Making a credential unusable before it expires.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Short JWT for calls, long random refresh token for renewal; store only its SHA-256.</li>
  <li>Rotate on every refresh; a replayed old token revokes the family (measured: thief and owner both 401).</li>
  <li>Do not throw inside the transaction that revokes; return a status (measured: throwing silently undid the revocation).</li>
  <li><code>HttpOnly; Secure; SameSite=Strict; Path=/auth</code> cookie for the refresh token, memory for the access token.</li>
  <li>Logout kills the refresh token; the access token lives until <code>exp</code> (+ skew).</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics', '📜', 'OAuth 2.0 Security Best Current Practice', 'Refresh token rotation and sender-constraining.')}
${tl('https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html', '🛡️', 'OWASP JWT for Java Cheat Sheet', 'Storage, revocation, token sidejacking.')}
${tl('https://github.blog/news-insights/company-news/security-alert-stolen-oauth-user-tokens/', '🕵️', 'GitHub — Security alert: stolen OAuth user tokens (2022)', 'Heroku and Travis CI tokens used against private repositories.')}

<h3>Sources</h3>
<ul>
  <li>Outputs above: <code>c9.d.App</code> (<code>Refresh</code>, <code>AuthApi</code>) in <code>lab/c9/sec</code>, PostgreSQL 16.15, Spring Boot 4.1.2, Spring Security 7.1.2 (20/11/2026). Token values are shortened with "…".</li>
  <li>GitHub blog, 15/04/2022.</li>
</ul>
</div>
`;

const L95_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.5</span>
<h2>Refresh token và đăng xuất</h2>
<p class="lead">Access token 15 phút thì an toàn nhưng phiền; token 7 ngày thì tiện nhưng nguy hiểm. Câu trả lời chuẩn là hai token: một JWT ngắn hạn cho lời gọi API, và một <em>refresh token</em> ngẫu nhiên, sống lâu, thu hồi được, lưu trong CSDL. Bài này chỉ lưu SHA-256 của nó, xoay vòng nó mỗi lần dùng, phát hiện bản sao bị đánh cắp khi bị dùng lại và thu hồi cả họ, đặt nó vào cookie <code>HttpOnly</code>, và đo một sự thật khó chịu về đăng xuất: access token sau đó vẫn chạy.</p>

<h3>Đời thường trước đã</h3>
<p>Phòng tập đưa bạn một vé ngày (access token) ở quầy mỗi sáng, và một thẻ hội viên (refresh token) để đổi lấy vé ngày mới. Quầy giữ danh sách thẻ hội viên. Mỗi lần bạn đưa thẻ, họ bấm một thẻ mới và cắt đôi thẻ cũ. Nếu có ai đó đưa ra một tấm thẻ đã bị cắt, quầy biết một trong hai người đang cầm thẻ "của bạn" là kẻ trộm — nên họ khoá mọi thẻ đứng tên bạn và mời bạn mang căn cước tới. Mất vé ngày chỉ thiệt một ngày; còn thẻ thì huỷ được bất cứ lúc nào.</p>

<h3>Bảng dữ liệu</h3>
${MA95_SQL}
<ul>
  <li><code>token_hash</code>, không phải token: CSDL hay bản sao lưu bị lộ cũng không cho ra token dùng được. Refresh token là chuỗi ngẫu nhiên (256 bit), nên SHA-256 nhanh là đủ — khác mật khẩu, không có từ điển nào để thử.</li>
  <li><code>family</code>: mọi token sinh ra do xoay vòng từ cùng một lần đăng nhập dùng chung giá trị này, nên một câu update là thu hồi được cả chuỗi.</li>
  <li><code>used_at</code> và <code>revoked_at</code> thay vì xoá dòng: giữ lại bằng chứng để soát lại khi có sự cố.</li>
</ul>

<h3>Xoay vòng và phát hiện dùng lại</h3>
${MA95_XOAY}
<p>Để ý hình dạng: phương thức không bao giờ ném exception. Nó trả về một trạng thái, và controller quyết định trả 401. Ném lỗi bên trong <code>@Transactional</code> sẽ rollback câu <code>update … revoked_at</code> — đúng dòng quan trọng nhất khi phát hiện bị trộm (cái bẫy lan truyền của bài 6.5, giờ trong bối cảnh bảo mật). <code>for update of r</code> khoá dòng để hai lần refresh song song cùng một token không thể cùng thành công.</p>
${MA95_API}
${MA95_COOKIE}

<h3>Thí nghiệm 1: xoay, dùng lại, thu hồi</h3>
${OUT95_RF}
<p>Từng bước:</p>
<ol>
  <li>Đăng nhập cho RT1. <code>/auth/refresh</code> với RT1 trả access token mới và cookie mới RT2. Dòng 1 và 2 cùng một họ; dòng 1 giờ có <code>da_dung = t</code>.</li>
  <li>Kẻ tấn công đã chép RT1 từ trước đem dùng lại: 401 <code>DUNG_LAI</code>, và server thu hồi mọi token của họ đó — dòng log ghi 2 token.</li>
  <li>Người dùng thật, đang cầm RT2 mới tinh, giờ cũng bị từ chối (<code>DA_THU_HOI</code>). Đó là chủ ý: server không biết ai trong hai người là kẻ trộm, nên cả hai phải đăng nhập lại bằng mật khẩu, thứ chỉ người dùng thật có.</li>
  <li>Đăng xuất thu hồi cả họ và xoá cookie (<code>Max-Age=0</code>); refresh token đã chết.</li>
  <li><strong>Nhưng</strong> access token phát ra trước khi đăng xuất vẫn trả <strong>200</strong>. Nó là JWT tự chứa; resource server không biết gì về lần đăng xuất. Nó chỉ chết ở <code>exp</code> (+ 60 giây độ lệch).</li>
</ol>
<p>Không xoay vòng (profile <code>c9.xoay=false</code>, cách nhiều bài hướng dẫn vẫn làm):</p>
${OUT95_KX}
<p>Chủ thật và kẻ trộm cùng refresh bằng một token mãi mãi, và server không bao giờ nhận ra. Xoay vòng biến một vụ trộm im lặng thành một vụ bị phát hiện.</p>

<h3>Thí nghiệm 2: cùng cách phát hiện, nhưng ném exception</h3>
<p>Profile <code>c9.nem=true</code> đổi đúng một dòng: sau câu <code>update</code> thu hồi, service ném <code>ResponseStatusException(401)</code> thay vì trả về trạng thái.</p>
${OUT95_NEM}
<p>Client vẫn nhận 401 và log vẫn ghi đã thu hồi "2 token" — vậy mà bảng cho thấy không dòng nào bị thu hồi, và token kế tiếp của họ đó trả 200. Exception đã ra khỏi phương thức <code>@Transactional</code>, Spring rollback giao dịch, và lệnh thu hồi biến mất theo. Một dòng log không phải là một lần commit.</p>

<h3>Trình duyệt nên giữ token ở đâu?</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Access token</span><span class="v">Trong bộ nhớ (một biến JavaScript). Mất khi tải lại trang — không sao, refresh là có token mới.</span></div>
  <div class="kv"><span class="k">Refresh token</span><span class="v">Cookie <code>HttpOnly</code>: JavaScript không đọc được, nên lỗi XSS không lấy cắp được. <code>Secure</code>: chỉ qua HTTPS. <code>SameSite=Strict</code>: không gửi theo request khởi phát từ trang khác. <code>Path=/auth</code>: không gửi theo các lời gọi API thường.</span></div>
  <div class="kv"><span class="k">localStorage</span><span class="v">Mọi script trên trang đều đọc được. Một lỗi XSS (Chương 10) là mất sạch token. Tránh dùng cho refresh token.</span></div>
  <div class="kv"><span class="k">Ứng dụng di động</span><span class="v">Không cần cookie: kho bảo mật của nền tảng (Keychain, Android Keystore), refresh token gửi trong thân request.</span></div>
</div>
<p>Cookie mang câu hỏi CSRF của bài 9.1 quay lại. Ở đây nó được khoanh vùng: cookie chỉ đi tới <code>/auth/refresh</code> và <code>/auth/logout</code>, <code>SameSite=Strict</code> chặn việc gửi từ trang khác, và phản hồi của refresh (một access token mới) chỉ trang đã gửi request mới đọc được. Bài 10.4 bàn trường hợp tổng quát.</p>

<h3>Đăng xuất làm được gì và không làm được gì</h3>
<ul>
  <li>Làm được: thu hồi cả họ refresh (không phát thêm access token), xoá cookie, và frontend bỏ access token trong bộ nhớ.</li>
  <li>Không làm được: vô hiệu một access token đã bị chép đi nơi khác. Các lựa chọn, theo chi phí tăng dần: giữ access token thật ngắn (5–15 phút); giữ danh sách cấm theo <code>jti</code> tới khi chúng hết hạn (kiểm ở mọi request — lại có trạng thái); hoặc một mốc "token phát trước thời điểm T đều vô hiệu" cho từng người, kiểm trong một validator tự viết.</li>
  <li>Với "đăng xuất mọi thiết bị" (đổi mật khẩu, mất điện thoại): thu hồi mọi họ của người dùng — một câu <code>update … where user_id = ?</code>.</li>
</ul>

<h3>🕵️ Góc hacker — token bị trộm, tháng 4/2022</h3>
<p>Ngày 15/04/2022 GitHub thông báo kẻ tấn công đã dùng <em>OAuth user token</em> lấy cắp từ hai bên tích hợp là Heroku và Travis CI để liệt kê và tải về kho mã riêng tư của hàng chục tổ chức, trong đó có npm. Các token đó hợp lệ, sống lâu, và không gắn với thiết bị đã nhận chúng, nên server của GitHub chỉ thấy những request bình thường có quyền. GitHub, Heroku và Travis CI thu hồi token hàng loạt. Điều áp được vào thiết kế của ta:</p>
<ul>
  <li>Token sống lâu chính là mật khẩu: chỉ lưu hash, đặt hạn dùng, và làm cho việc thu hồi hàng loạt chỉ là một câu truy vấn.</li>
  <li>Xoay vòng cộng phát hiện dùng lại biến một token bị chép lặng lẽ thành một hồi chuông báo động (thí nghiệm 1).</li>
  <li>Ghi log mọi lần refresh kèm người dùng, họ token và IP để khi soát lại trả lời được "token nào đã được dùng, từ đâu".</li>
</ul>

<h3>So với Node.js</h3>
<p>Không có gì ở đây là riêng của Spring: <code>jsonwebtoken</code> ký access token, <code>crypto.randomBytes(32)</code> tạo refresh token, <code>res.cookie('rt', t, { httpOnly: true, secure: true, sameSite: 'strict', path: '/auth' })</code> đặt cookie, và một bảng <code>refresh_tokens</code> trong Prisma lưu hash và họ. Không hệ sinh thái nào cho sẵn xoay vòng, trừ khi bạn dùng nhà cung cấp danh tính (Keycloak, Auth0 và Cognito đều cài sẵn xoay vòng refresh token và phát hiện dùng lại). Câu trả lời phỏng vấn là thiết kế, không phải thư viện.</p>

<h3>Đời thường và đi làm</h3>
<ul>
  <li>Hai tab trình duyệt refresh cùng một lúc sẽ gửi cùng một refresh token; với phát hiện dùng lại nghiêm ngặt, tab thứ hai làm người dùng bị đăng xuất. Hệ thống thật cho một khoảng ân hạn ngắn (vài giây) hoặc để một tab refresh hộ mọi tab.</li>
  <li>Dọn các dòng hết hạn bằng tác vụ hẹn giờ (Chương 14), nếu không bảng phình ra theo mỗi lần đăng nhập.</li>
  <li>Cho người dùng xem các phiên đang hoạt động ("Chrome trên Windows, dùng lần cuối 2 giờ trước") — đó chính là bảng các họ token.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Vì sao cần hai token?"</strong> — Access token được kiểm stateless ở mọi lời gọi nên phải ngắn hạn; refresh token chỉ được đối chiếu CSDL ở <code>/auth/refresh</code>, nên sống lâu được và thu hồi được.</li>
  <li><strong>"Xoay vòng refresh token là gì?"</strong> — Mỗi lần refresh trả một refresh token mới và vô hiệu token cũ. Token cũ bị dùng lại nghĩa là bị trộm: thu hồi cả họ.</li>
  <li><strong>"Đăng xuất có vô hiệu JWT không?"</strong> — Không: đã đo ở đây, nó vẫn trả 200 tới <code>exp</code>. Đăng xuất thu hồi refresh token; thời gian sống ngắn của access token thu hẹp khoảng hở.</li>
  <li><strong>"Cookie hay localStorage?"</strong> — Refresh token trong cookie <code>HttpOnly; Secure; SameSite=Strict</code> giới hạn ở <code>/auth</code>; access token trong bộ nhớ.</li>
</ol>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
  <li>Đăng nhập, refresh hai lần, và vẽ bảng của họ token (id, <code>used_at</code>, <code>revoked_at</code>) trước khi chạy SQL.</li>
  <li>Dùng lại refresh token đầu tiên. Đoán xem sau đó token mới nhất sẽ ra sao.</li>
  <li>Sửa service cho nó ném exception thay vì trả <code>DUNG_LAI</code>, dùng lại lần nữa, rồi xem cột <code>revoked_at</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> hình vẽ của bạn khớp kết quả truy vấn, bạn đoán đúng là token mới nhất cũng bị từ chối, và bạn giải thích được vì sao bản ném exception để <code>revoked_at</code> trống.</p></div>
${giai('Xem lập luận', `<p>Sau hai lần refresh: ba dòng cùng một họ, hai dòng đầu có <code>used_at</code>, chưa dòng nào bị thu hồi. Dùng lại token đầu tiên đặt <code>revoked_at</code> cho mọi dòng của họ, nên token mới nhất cũng nhận 401 (thí nghiệm 1). Exception ném ra khỏi phương thức <code>@Transactional</code> đánh dấu giao dịch phải rollback, nên câu <code>update</code> thu hồi bị huỷ và chuỗi token bị trộm vẫn sống: thí nghiệm 2 đo được <code>thu_hoi = f</code> ở cả hai dòng và token kế tiếp trả 200.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Refresh token</span><span class="v">Thông tin xác thực sống lâu, ngẫu nhiên, lưu ở server, chỉ dùng để lấy access token mới.</span></div>
  <div class="kv"><span class="k">Xoay vòng (rotation)</span><span class="v">Phát refresh token mới mỗi lần dùng và vô hiệu token cũ.</span></div>
  <div class="kv"><span class="k">Họ token (family)</span><span class="v">Mọi refresh token sinh ra từ một lần đăng nhập; bị thu hồi cùng nhau khi dùng lại.</span></div>
  <div class="kv"><span class="k">Phát hiện dùng lại</span><span class="v">Coi lần dùng thứ hai của một token đã xoay là bị trộm.</span></div>
  <div class="kv"><span class="k">HttpOnly / SameSite</span><span class="v">Cờ cookie: JavaScript không thấy / không gửi theo request liên trang.</span></div>
  <div class="kv"><span class="k">Thu hồi (revocation)</span><span class="v">Làm thông tin xác thực hết dùng được trước khi nó hết hạn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>JWT ngắn cho lời gọi, refresh token ngẫu nhiên sống lâu để gia hạn; chỉ lưu SHA-256 của nó.</li>
  <li>Xoay vòng mỗi lần refresh; token cũ bị dùng lại thì thu hồi cả họ (đã đo: kẻ trộm và chủ thật đều 401).</li>
  <li>Đừng ném exception trong giao dịch có câu thu hồi; trả về trạng thái (đã đo: ném lỗi làm lệnh thu hồi lặng lẽ bị huỷ).</li>
  <li>Cookie <code>HttpOnly; Secure; SameSite=Strict; Path=/auth</code> cho refresh token, bộ nhớ cho access token.</li>
  <li>Đăng xuất giết refresh token; access token sống tới <code>exp</code> (+ độ lệch).</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics', '📜', 'OAuth 2.0 Security Best Current Practice', 'Xoay vòng refresh token và ràng buộc người gửi.')}
${tl('https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html', '🛡️', 'OWASP JWT for Java Cheat Sheet', 'Lưu trữ, thu hồi, đánh cắp token.')}
${tl('https://github.blog/news-insights/company-news/security-alert-stolen-oauth-user-tokens/', '🕵️', 'GitHub — Security alert: stolen OAuth user tokens (2022)', 'Token của Heroku và Travis CI bị dùng để tải kho mã riêng tư.')}

<h3>Nguồn</h3>
<ul>
  <li>Output ở trên: <code>c9.d.App</code> (<code>Refresh</code>, <code>AuthApi</code>) trong <code>lab/c9/sec</code>, PostgreSQL 16.15, Spring Boot 4.1.2, Spring Security 7.1.2 (20/11/2026). Giá trị token được rút gọn bằng "…".</li>
  <li>Blog GitHub, 15/04/2022.</li>
</ul>
</div>
`;

// ===== Bài 9.6 =====
const MA96_API = java("/** Chủ lượt đặt LẤY TỪ TOKEN; trường owner trong body bị bỏ qua. */\n@PostMapping(\"/bookings\") @ResponseStatus(HttpStatus.CREATED)\nLuotDat dat(@RequestBody DatPhong r, @AuthenticationPrincipal Jwt jwt) {\n    return db.sql(\"insert into bookings (owner, lab_code) values (?, ?) returning id, owner, lab_code, status\")\n        .params(jwt.getSubject(), r.labCode()).query(LuotDat.class).single();\n}\n\n@GetMapping(\"/bookings/{id}\")\n@PreAuthorize(\"@quyen.chuHoacAdmin(#id, authentication)\")\nLuotDat xem(@PathVariable long id) { return motLuot(id); }\n\n@PatchMapping(\"/bookings/{id}/cancel\")\n@PreAuthorize(\"@quyen.chuHoacAdmin(#id, authentication)\")\nLuotDat huy(@PathVariable long id) { return doiTrangThai(id, \"CANCELLED\"); }\n\n/** BẢN CÓ LỖ (IDOR): chỉ cần đăng nhập, không kiểm chủ — để so sánh trong bài 9.6. */\n@PatchMapping(\"/v0/bookings/{id}/cancel\")\nLuotDat huyCoLo(@PathVariable long id) { return doiTrangThai(id, \"CANCELLED\"); }\n\n@PatchMapping(\"/bookings/{id}/approve\")\n@PreAuthorize(\"hasRole('ADMIN')\")\nLuotDat duyet(@PathVariable long id) { return doiTrangThai(id, \"APPROVED\"); }");
const MA96_QUYEN = java("/** Bean dùng trong SpEL: @quyen.chuHoacAdmin(#id, authentication). Không có lượt đặt ⇒ false (403, không lộ là id có tồn tại hay không). */\n@Component(\"quyen\")\nclass Quyen {\n    private final JdbcClient db;\n    Quyen(JdbcClient db) { this.db = db; }\n\n    public boolean chuHoacAdmin(long id, Authentication a) {\n        if (a.getAuthorities().stream().anyMatch(g -> g.getAuthority().equals(\"ROLE_ADMIN\"))) return true;\n        return db.sql(\"select owner from bookings where id = ?\").param(id).query(String.class).optional()\n            .map(o -> o.equals(a.getName())).orElse(false);\n    }\n}");
const MA96_CONV = java("/** Claim \"roles\" ⇒ ROLE_STUDENT / ROLE_ADMIN. Profile \"scope\": giữ mặc định của Spring (claim scope ⇒ SCOPE_…). */\n@Bean\nJwtAuthenticationConverter jwtAuthenticationConverter(Environment env) {\n    JwtGrantedAuthoritiesConverter g = new JwtGrantedAuthoritiesConverter();\n    if (!env.matchesProfiles(\"scope\")) {\n        g.setAuthoritiesClaimName(\"roles\");\n        g.setAuthorityPrefix(\"ROLE_\");\n    }\n    JwtAuthenticationConverter c = new JwtAuthenticationConverter();\n    c.setJwtGrantedAuthoritiesConverter(g);\n    return c;\n}");
const OUT96_Q = out("# lan đặt phòng, cố ghi owner là binh trong body\nlan    POST /bookings {\"labCode\":\"IOT-01\",\"owner\":\"binh\"} ⇒ {\"id\":1,\"owner\":\"lan\",\"labCode\":\"IOT-01\",\"status\":\"PENDING\"}  HTTP 201\nbinh   GET /bookings/1                                  ⇒   HTTP 403\nlan    GET /bookings/1                                  ⇒ {\"id\":1,\"owner\":\"lan\",\"labCode\":\"IOT-01\",\"status\":\"PENDING\"}  HTTP 200\nadmin  GET /bookings/1                                  ⇒ {\"id\":1,\"owner\":\"lan\",\"labCode\":\"IOT-01\",\"status\":\"PENDING\"}  HTTP 200\nbinh   GET /bookings/999                                ⇒   HTTP 403\n# bản có lỗ /v0: chỉ cần đăng nhập\nbinh   PATCH /v0/bookings/1/cancel                      ⇒ {\"id\":1,\"owner\":\"lan\",\"labCode\":\"IOT-01\",\"status\":\"CANCELLED\"}  HTTP 200\n# bản có @PreAuthorize(\"@quyen.chuHoacAdmin(#id, authentication)\")\nbinh   PATCH /bookings/1/cancel                         ⇒   HTTP 403\nlan    PATCH /bookings/1/cancel                         ⇒ {\"id\":1,\"owner\":\"lan\",\"labCode\":\"IOT-01\",\"status\":\"CANCELLED\"}  HTTP 200\n# duyệt: @PreAuthorize(\"hasRole('ADMIN')\")\nlan    PATCH /bookings/1/approve                        ⇒   HTTP 403\nadmin  PATCH /bookings/1/approve                        ⇒ {\"id\":1,\"owner\":\"lan\",\"labCode\":\"IOT-01\",\"status\":\"APPROVED\"}  HTTP 200");
const OUT96_SCOPE = out("# profile scope: để JwtGrantedAuthoritiesConverter MẶC ĐỊNH (đọc claim \"scope\"/\"scp\", tiền tố SCOPE_)\n$ curl -H \"Authorization: Bearer $AD\" localhost:8080/me\n{\"name\":\"admin\",\"authorities\":[\"FactorGrantedAuthority [authority=FACTOR_BEARER, issuedAt=…]\"]}\n$ curl -X PATCH -H \"Authorization: Bearer $AD\" localhost:8080/admin/users\nHTTP/1.1 403 \nWWW-Authenticate: Bearer error=\"insufficient_scope\", error_description=\"The request requires higher privileges than prov");
const OUT96_AUTH = out("# token của admin (authorities: ROLE_ADMIN, FACTOR_BEARER)\nhasAuthority('ADMIN')          ⇒   HTTP 403\nhasAuthority('ROLE_ADMIN')     ⇒ hasAuthority('ROLE_ADMIN') cho qua  HTTP 200\nhasRole('ROLE_ADMIN')          ⇒ hasRole('ROLE_ADMIN') cho qua  HTTP 200");

const L96_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.6</span>
<h2>Roles and method-level authorization</h2>
<p class="lead">Authentication answers "who are you"; this lesson answers "may you do <em>this</em>, to <em>this</em> booking". URL rules are not enough: <code>/bookings/1/cancel</code> and <code>/bookings/2/cancel</code> match the same pattern but belong to different students. We switch on method security, write <code>@PreAuthorize</code> rules with SpEL, call a Spring bean from inside a rule to check ownership in the database, and measure three things: an IDOR that lets one student cancel another's booking, a booking request that tries to set its own owner, and an ADMIN token that gets 403 because of a prefix.</p>

<h3>In everyday life first</h3>
<p>A student card opens the building (authentication) and the library floor (role). It does not open another student's locker, even though every locker is on the same floor. The locker checks <em>whose</em> it is. Roles are the floor; ownership is the locker. Most real authorization bugs are lockers, not floors.</p>

<h3>From claims to authorities</h3>
${MA96_CONV}
<p>The token carries <code>"roles":["STUDENT"]</code>. The converter reads that claim and adds the prefix <code>ROLE_</code>, so the authentication holds <code>ROLE_STUDENT</code>. That prefix is what makes the two expressions differ:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">hasRole('ADMIN')</span><span class="v">Checks the authority <code>ROLE_ADMIN</code> (the prefix is added for you).</span></div>
  <div class="kv"><span class="k">hasAuthority('ADMIN')</span><span class="v">Checks the exact string <code>ADMIN</code> — false for <code>ROLE_ADMIN</code>.</span></div>
  <div class="kv"><span class="k">hasAuthority('SCOPE_bookings:write')</span><span class="v">The usual form for OAuth scopes, which Spring prefixes with <code>SCOPE_</code>.</span></div>
</div>
<p>Three endpoints guarded three ways, called with the ADMIN's token:</p>
${OUT96_AUTH}
<p><code>hasAuthority('ADMIN')</code> fails because the string is <code>ROLE_ADMIN</code>. Spring Security 7 also accepts <code>hasRole('ROLE_ADMIN')</code> (it does not add the prefix twice), but write one style across the project.</p>
<p>What happens with Spring's <em>default</em> converter (profile <code>scope</code>, i.e. without the two setter lines):</p>
${OUT96_SCOPE}
<p>The default reads the <code>scope</code>/<code>scp</code> claim, which our token does not have. The ADMIN's authentication ends up with only the factor authority, and every <code>hasRole('ADMIN')</code> says no. No error at startup, no warning — just 403 for the one user who should pass. If an ADMIN gets 403, print the authorities first (that is why our <code>/me</code> returns them).</p>

<h3>Rules on the methods</h3>
${MA96_API}
${MA96_QUYEN}
<ul>
  <li><code>@EnableMethodSecurity</code> (on the application class in 9.3) turns <code>@PreAuthorize</code> on. Without it the annotations are silently ignored.</li>
  <li>Spring wraps the controller in a proxy (Chapter 3.5) that evaluates the expression <em>before</em> the method runs. <code>#id</code> is the method parameter, <code>authentication</code> the current user, <code>@quyen</code> a bean by name.</li>
  <li><code>dat</code> takes the owner from <code>jwt.getSubject()</code>, never from the body. Whatever the client puts in <code>owner</code> is ignored.</li>
  <li><code>chuHoacAdmin</code> answers <code>false</code> when the booking does not exist, so a stranger cannot tell "not yours" from "does not exist" — both are 403.</li>
</ul>

<h3>Experiment: three users, one booking</h3>
<p><code>lan</code> and <code>binh</code> are students, <code>admin</code> is ADMIN. Each line: who, request, result.</p>
${OUT96_Q}
<ol>
  <li><code>lan</code> sends <code>"owner":"binh"</code>; the booking is created for <code>lan</code>. The client cannot choose whose booking it is.</li>
  <li><code>binh</code> reading booking 1: 403. <code>lan</code> (owner) and <code>admin</code>: 200. A non-existent id: 403, not 404.</li>
  <li>The unprotected <code>/v0/…/cancel</code> needs only a valid token: <code>binh</code> cancelled <code>lan</code>'s booking. That is an <strong>IDOR</strong> (insecure direct object reference): authenticated, but no ownership check.</li>
  <li>The protected cancel: <code>binh</code> 403, <code>lan</code> 200.</li>
  <li>Approve: <code>lan</code> 403, <code>admin</code> 200.</li>
</ol>

<h3>URL rules or method rules?</h3>
<ul>
  <li><strong>URL rules</strong> in the filter chain (9.1): coarse and cheap, good for "everything under <code>/admin/**</code> needs ADMIN" and for the public list. They see only the path and method.</li>
  <li><strong>Method rules</strong> with <code>@PreAuthorize</code>: see the parameters, can call beans, live next to the code they protect, and protect the method no matter which URL (or which future controller) calls it.</li>
  <li>Use both: default-deny URLs, plus a method rule on every action that touches one specific object. Keep the ownership query in one bean so it is written once and tested once.</li>
  <li>Putting the check in the service (<code>if (!owner.equals(user)) throw …</code>) is also valid and easier to unit-test; what matters is that every path goes through it.</li>
</ul>

<h3>🕵️ Hacker corner — 60 million accounts behind one missing check</h3>
<p>On 21/11/2018 Brian Krebs reported that the US Postal Service's "Informed Visibility" API let any logged-in usps.com user query the account details of other users — e-mail, user name, address, phone — simply by changing a search parameter, and in some cases modify them. About 60 million accounts were exposed; a researcher had reported it a year earlier. Authentication was fine. The API never asked "does this record belong to the caller?". It is the same bug as our <code>/v0</code> cancel, and it tops the OWASP API Security Top 10 as <em>Broken Object Level Authorization</em>. Defence: owner from the token, an ownership rule on every object endpoint, 403 for "not yours", and a test that tries user B's token on user A's id (Chapter 11 automates it; Chapter 10.2 attacks it).</p>

<h3>Compared with Node.js</h3>
<p>In Express this is a middleware per route: <code>requireRole('ADMIN')</code> or a handler that loads the booking and compares <code>booking.owner</code> with <code>req.user.sub</code>. CASL or similar libraries add a policy layer. The concepts map one to one: Spring's <code>@PreAuthorize</code> is a declarative guard evaluated by a proxy; Express guards are functions you must remember to put in front of each route. Forgetting one is exactly the <code>/v0</code> bug in either stack.</p>

<h3>In real life and at work</h3>
<ul>
  <li>In SWP391 projects the classic bug is <code>GET /api/orders?userId=5</code>: the frontend sends its own id and the backend trusts it. Read the user from the token.</li>
  <li>Teaching assistants, lab managers, department heads: roles multiply. Keep them in data (a role column or table), not in <code>if</code>s spread across controllers.</li>
  <li>Review checklist for every new endpoint: who may call it, which object does it touch, where is the ownership check, what does a stranger get (403, not the data).</li>
</ul>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"hasRole vs hasAuthority?"</strong> — <code>hasRole('X')</code> checks <code>ROLE_X</code>; <code>hasAuthority('X')</code> checks <code>X</code> exactly. With JWTs, the converter decides which strings exist.</li>
  <li><strong>"How do you make sure only the owner can cancel?"</strong> — Owner taken from the token at creation; <code>@PreAuthorize("@bean.isOwner(#id, authentication)")</code> or a service check on every object action; 403 for non-owners.</li>
  <li><strong>"What is IDOR?"</strong> — Access to an object by its id without checking it belongs to the caller. Authenticated is not authorized.</li>
  <li><strong>"Why return 403 instead of 404 for someone else's booking?"</strong> — Either is defensible; the point is to answer the same way for "not yours" and "does not exist" so ids cannot be probed.</li>
</ol>

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok"><ol>
  <li>Predict the status of each of the 10 requests in the experiment before running them.</li>
  <li>Start with the default converter (profile <code>scope</code>) and explain the ADMIN's 403 from the output of <code>/me</code>.</li>
  <li>Change <code>hasRole('ADMIN')</code> to <code>hasAuthority('ADMIN')</code> on approve and predict what <code>admin</code> gets.</li>
</ol>
<p><strong>Done when:</strong> all predictions match, you can point to the missing <code>ROLE_ADMIN</code> in the authorities list, and you predict 403 for <code>hasAuthority('ADMIN')</code> because the authority is <code>ROLE_ADMIN</code>.</p></div>
${giai('Show the answers', `<p>201, 403, 200, 200, 403, 200 (IDOR), 403, 200, 403, 200 — the experiment output (owner forced to <code>lan</code>). With the default converter the ADMIN holds only <code>FACTOR_BEARER</code>, so <code>hasRole('ADMIN')</code> is false (output of profile <code>scope</code>). <code>hasAuthority('ADMIN')</code> compares with the exact string <code>ADMIN</code>, which no one has — 403 for <code>admin</code> too (measured above: <code>/admin/a1</code>); use <code>hasRole('ADMIN')</code> or <code>hasAuthority('ROLE_ADMIN')</code>.</p>`)}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Role</span><span class="v">A coarse group (STUDENT, ADMIN); in Spring an authority with prefix <code>ROLE_</code>.</span></div>
  <div class="kv"><span class="k">Authority</span><span class="v">Any string permission in <code>Authentication.getAuthorities()</code>.</span></div>
  <div class="kv"><span class="k">@PreAuthorize</span><span class="v">Method guard: a SpEL expression evaluated before the method runs.</span></div>
  <div class="kv"><span class="k">SpEL</span><span class="v">Spring Expression Language: <code>#param</code>, <code>authentication</code>, <code>@bean.method()</code>.</span></div>
  <div class="kv"><span class="k">IDOR / BOLA</span><span class="v">Object accessed by id without checking ownership (OWASP API #1).</span></div>
  <div class="kv"><span class="k">Default deny</span><span class="v">Anything not explicitly allowed is refused.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>The JWT converter decides the authorities: map <code>roles</code> → <code>ROLE_…</code>, or <code>hasRole</code> fails silently (ADMIN 403 measured).</li>
  <li><code>@EnableMethodSecurity</code> + <code>@PreAuthorize</code>: rules next to the code, with parameters and beans.</li>
  <li>The owner comes from the token, never from the body.</li>
  <li>Every object endpoint needs an ownership check; without it, <code>binh</code> cancelled <code>lan</code>'s booking.</li>
  <li>Answer "not yours" and "does not exist" the same way.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://docs.spring.io/spring-security/reference/servlet/authorization/method-security.html', '🍃', 'Spring Security — Method Security', '@PreAuthorize, @PostAuthorize, SpEL, custom beans.')}
${tl('https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/', '🛡️', 'OWASP API1:2023 Broken Object Level Authorization', 'IDOR in APIs, examples and prevention.')}
${tl('https://krebsonsecurity.com/2018/11/usps-site-exposed-data-on-60-million-users/', '🕵️', 'USPS site exposed data on 60 million users (2018)', 'Krebs on Security.')}

<h3>Sources</h3>
<ul>
  <li>Outputs above: <code>c9.d.App</code> (<code>Api</code>, <code>Quyen</code>, profile <code>scope</code>) in <code>lab/c9/sec</code>, Spring Boot 4.1.2, Spring Security 7.1.2, PostgreSQL 16.15 (20/11/2026).</li>
  <li>Brian Krebs, 21/11/2018.</li>
</ul>
</div>
`;

const L96_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.6</span>
<h2>Vai trò và phân quyền cấp phương thức</h2>
<p class="lead">Xác thực trả lời "bạn là ai"; bài này trả lời "bạn có được làm <em>việc này</em>, với <em>lượt đặt này</em> không". Luật URL là chưa đủ: <code>/bookings/1/cancel</code> và <code>/bookings/2/cancel</code> khớp cùng một mẫu nhưng thuộc về hai sinh viên khác nhau. Ta bật bảo mật cấp phương thức, viết luật <code>@PreAuthorize</code> bằng SpEL, gọi một bean Spring ngay trong luật để kiểm quyền sở hữu trong CSDL, và đo ba chuyện: một lỗi IDOR cho phép sinh viên này huỷ lượt đặt của sinh viên khác, một request đặt phòng cố tự chọn chủ, và một token ADMIN bị 403 chỉ vì một tiền tố.</p>

<h3>Đời thường trước đã</h3>
<p>Thẻ sinh viên mở cửa toà nhà (xác thực) và tầng thư viện (vai trò). Nó không mở tủ đồ của sinh viên khác, dù mọi tủ đều ở cùng tầng. Cái tủ kiểm xem <em>nó là của ai</em>. Vai trò là tầng; quyền sở hữu là cái tủ. Đa số lỗi phân quyền ngoài đời là lỗi ở tủ, không phải ở tầng.</p>

<h3>Từ claim tới quyền</h3>
${MA96_CONV}
<p>Token mang <code>"roles":["STUDENT"]</code>. Converter đọc claim đó và thêm tiền tố <code>ROLE_</code>, nên đối tượng xác thực có <code>ROLE_STUDENT</code>. Chính tiền tố đó làm hai biểu thức khác nhau:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">hasRole('ADMIN')</span><span class="v">Kiểm quyền <code>ROLE_ADMIN</code> (tiền tố được thêm giúp bạn).</span></div>
  <div class="kv"><span class="k">hasAuthority('ADMIN')</span><span class="v">Kiểm đúng chuỗi <code>ADMIN</code> — sai với <code>ROLE_ADMIN</code>.</span></div>
  <div class="kv"><span class="k">hasAuthority('SCOPE_bookings:write')</span><span class="v">Dạng thường dùng cho scope OAuth, thứ Spring thêm tiền tố <code>SCOPE_</code>.</span></div>
</div>
<p>Ba endpoint được chặn theo ba cách, gọi bằng token của ADMIN:</p>
${OUT96_AUTH}
<p><code>hasAuthority('ADMIN')</code> hỏng vì chuỗi thật là <code>ROLE_ADMIN</code>. Spring Security 7 cũng nhận <code>hasRole('ROLE_ADMIN')</code> (nó không thêm tiền tố hai lần), nhưng cả dự án nên viết một kiểu thống nhất.</p>
<p>Chuyện gì xảy ra với converter <em>mặc định</em> của Spring (profile <code>scope</code>, tức là bỏ hai dòng setter):</p>
${OUT96_SCOPE}
<p>Mặc định đọc claim <code>scope</code>/<code>scp</code>, thứ token của ta không có. Đối tượng xác thực của ADMIN chỉ còn quyền yếu tố, và mọi <code>hasRole('ADMIN')</code> đều nói không. Không lỗi lúc khởi động, không cảnh báo — chỉ có 403 cho đúng người lẽ ra phải qua. ADMIN mà bị 403 thì việc đầu tiên là in danh sách quyền ra (đó là lý do <code>/me</code> của ta trả về chúng).</p>

<h3>Luật đặt trên phương thức</h3>
${MA96_API}
${MA96_QUYEN}
<ul>
  <li><code>@EnableMethodSecurity</code> (đặt trên lớp ứng dụng ở bài 9.3) bật <code>@PreAuthorize</code>. Thiếu nó, các annotation bị lặng lẽ bỏ qua.</li>
  <li>Spring bọc controller trong một proxy (Chương 3.5) để tính biểu thức <em>trước khi</em> phương thức chạy. <code>#id</code> là tham số của phương thức, <code>authentication</code> là người dùng hiện tại, <code>@quyen</code> là một bean theo tên.</li>
  <li><code>dat</code> lấy chủ lượt đặt từ <code>jwt.getSubject()</code>, không bao giờ từ thân request. Client điền gì vào <code>owner</code> cũng bị bỏ qua.</li>
  <li><code>chuHoacAdmin</code> trả <code>false</code> khi lượt đặt không tồn tại, nên người lạ không phân biệt được "không phải của bạn" với "không tồn tại" — cả hai đều 403.</li>
</ul>

<h3>Thí nghiệm: ba người dùng, một lượt đặt</h3>
<p><code>lan</code> và <code>binh</code> là sinh viên, <code>admin</code> là ADMIN. Mỗi dòng: ai, request, kết quả.</p>
${OUT96_Q}
<ol>
  <li><code>lan</code> gửi <code>"owner":"binh"</code>; lượt đặt vẫn được tạo cho <code>lan</code>. Client không được chọn lượt đặt là của ai.</li>
  <li><code>binh</code> đọc lượt đặt 1: 403. <code>lan</code> (chủ) và <code>admin</code>: 200. Một id không tồn tại: 403, không phải 404.</li>
  <li>Endpoint không bảo vệ <code>/v0/…/cancel</code> chỉ cần token hợp lệ: <code>binh</code> đã huỷ lượt đặt của <code>lan</code>. Đó là lỗi <strong>IDOR</strong> (tham chiếu trực tiếp tới đối tượng không an toàn): đã xác thực, nhưng không kiểm quyền sở hữu.</li>
  <li>Endpoint huỷ có bảo vệ: <code>binh</code> 403, <code>lan</code> 200.</li>
  <li>Duyệt: <code>lan</code> 403, <code>admin</code> 200.</li>
</ol>

<h3>Luật URL hay luật phương thức?</h3>
<ul>
  <li><strong>Luật URL</strong> trong chuỗi filter (bài 9.1): thô và rẻ, hợp với "mọi thứ dưới <code>/admin/**</code> cần ADMIN" và danh sách công khai. Nó chỉ thấy đường dẫn và phương thức HTTP.</li>
  <li><strong>Luật phương thức</strong> với <code>@PreAuthorize</code>: thấy được tham số, gọi được bean, nằm cạnh đoạn mã nó bảo vệ, và bảo vệ phương thức bất kể URL nào (hay controller nào sau này) gọi tới.</li>
  <li>Dùng cả hai: URL mặc định cấm, cộng một luật phương thức trên mọi thao tác chạm vào một đối tượng cụ thể. Đặt câu truy vấn kiểm chủ vào một bean để viết một lần và test một lần.</li>
  <li>Kiểm ngay trong service (<code>if (!owner.equals(user)) throw …</code>) cũng hợp lệ và dễ viết unit test hơn; điều quan trọng là mọi đường đi đều phải qua nó.</li>
</ul>

<h3>🕵️ Góc hacker — 60 triệu tài khoản sau một chỗ thiếu kiểm</h3>
<p>Ngày 21/11/2018 Brian Krebs đưa tin API "Informed Visibility" của Bưu điện Hoa Kỳ (USPS) cho phép bất kỳ người dùng nào đã đăng nhập usps.com tra thông tin tài khoản của người khác — email, tên đăng nhập, địa chỉ, số điện thoại — chỉ bằng cách đổi một tham số tìm kiếm, có trường hợp còn sửa được. Khoảng 60 triệu tài khoản bị lộ; một nhà nghiên cứu đã báo lỗi từ một năm trước. Xác thực thì không sao. API chỉ không bao giờ hỏi "bản ghi này có thuộc về người gọi không?". Đó chính là lỗi của endpoint huỷ <code>/v0</code>, và nó đứng đầu OWASP API Security Top 10 dưới tên <em>Broken Object Level Authorization</em>. Phòng thủ: chủ lấy từ token, luật sở hữu trên mọi endpoint đối tượng, 403 cho "không phải của bạn", và một bài test dùng token của người B gọi id của người A (Chương 11 tự động hoá nó; bài 10.2 tấn công nó).</p>

<h3>So với Node.js</h3>
<p>Trong Express đây là một middleware cho từng route: <code>requireRole('ADMIN')</code> hoặc một handler nạp lượt đặt rồi so <code>booking.owner</code> với <code>req.user.sub</code>. CASL hay các thư viện tương tự thêm một tầng chính sách. Khái niệm khớp một đối một: <code>@PreAuthorize</code> của Spring là một chốt chặn khai báo do proxy tính; chốt chặn của Express là các hàm bạn phải nhớ đặt trước từng route. Quên một cái chính là lỗi <code>/v0</code>, ở stack nào cũng vậy.</p>

<h3>Đời thường và đi làm</h3>
<ul>
  <li>Trong đồ án SWP391 lỗi kinh điển là <code>GET /api/orders?userId=5</code>: frontend tự gửi id của mình và backend tin luôn. Hãy đọc người dùng từ token.</li>
  <li>Trợ giảng, quản lý phòng lab, trưởng bộ môn: vai trò sinh sôi. Hãy giữ chúng trong dữ liệu (một cột hay bảng vai trò), đừng rải <code>if</code> khắp các controller.</li>
  <li>Danh sách soát cho mỗi endpoint mới: ai được gọi, nó chạm vào đối tượng nào, kiểm chủ ở đâu, người lạ nhận được gì (403, không phải dữ liệu).</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"hasRole khác hasAuthority thế nào?"</strong> — <code>hasRole('X')</code> kiểm <code>ROLE_X</code>; <code>hasAuthority('X')</code> kiểm đúng <code>X</code>. Với JWT, converter quyết định những chuỗi nào tồn tại.</li>
  <li><strong>"Làm sao đảm bảo chỉ chủ mới huỷ được?"</strong> — Chủ lấy từ token lúc tạo; <code>@PreAuthorize("@bean.isOwner(#id, authentication)")</code> hoặc kiểm trong service ở mọi thao tác trên đối tượng; người không phải chủ nhận 403.</li>
  <li><strong>"IDOR là gì?"</strong> — Truy cập một đối tượng bằng id mà không kiểm nó có thuộc về người gọi không. Đã xác thực chưa chắc đã được phép.</li>
  <li><strong>"Vì sao trả 403 thay vì 404 cho lượt đặt của người khác?"</strong> — Cả hai đều bảo vệ được; điều cốt lõi là trả lời giống nhau cho "không phải của bạn" và "không tồn tại" để không ai dò được id.</li>
</ol>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
  <li>Đoán mã trạng thái của từng request trong 10 request của thí nghiệm trước khi chạy.</li>
  <li>Khởi động với converter mặc định (profile <code>scope</code>) và giải thích lỗi 403 của ADMIN bằng output của <code>/me</code>.</li>
  <li>Đổi <code>hasRole('ADMIN')</code> thành <code>hasAuthority('ADMIN')</code> ở endpoint duyệt và đoán xem <code>admin</code> nhận gì.</li>
</ol>
<p><strong>Đạt khi:</strong> mọi dự đoán đều khớp, bạn chỉ ra được <code>ROLE_ADMIN</code> bị thiếu trong danh sách quyền, và bạn đoán 403 cho <code>hasAuthority('ADMIN')</code> vì quyền thật là <code>ROLE_ADMIN</code>.</p></div>
${giai('Xem đáp án', `<p>201, 403, 200, 200, 403, 200 (IDOR), 403, 200, 403, 200 — output của thí nghiệm (chủ bị ép thành <code>lan</code>). Với converter mặc định, ADMIN chỉ có <code>FACTOR_BEARER</code>, nên <code>hasRole('ADMIN')</code> sai (output của profile <code>scope</code>). <code>hasAuthority('ADMIN')</code> so với đúng chuỗi <code>ADMIN</code>, thứ không ai có — <code>admin</code> cũng nhận 403 (đã đo ở trên: <code>/admin/a1</code>); hãy dùng <code>hasRole('ADMIN')</code> hoặc <code>hasAuthority('ROLE_ADMIN')</code>.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Vai trò (role)</span><span class="v">Một nhóm thô (STUDENT, ADMIN); trong Spring là quyền có tiền tố <code>ROLE_</code>.</span></div>
  <div class="kv"><span class="k">Quyền (authority)</span><span class="v">Bất kỳ chuỗi quyền nào trong <code>Authentication.getAuthorities()</code>.</span></div>
  <div class="kv"><span class="k">@PreAuthorize</span><span class="v">Chốt chặn phương thức: biểu thức SpEL được tính trước khi phương thức chạy.</span></div>
  <div class="kv"><span class="k">SpEL</span><span class="v">Spring Expression Language: <code>#tham_so</code>, <code>authentication</code>, <code>@bean.method()</code>.</span></div>
  <div class="kv"><span class="k">IDOR / BOLA</span><span class="v">Truy cập đối tượng theo id mà không kiểm quyền sở hữu (OWASP API #1).</span></div>
  <div class="kv"><span class="k">Mặc định cấm</span><span class="v">Thứ gì không được cho phép rõ ràng thì bị từ chối.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Converter JWT quyết định danh sách quyền: đổi <code>roles</code> → <code>ROLE_…</code>, nếu không <code>hasRole</code> hỏng lặng lẽ (đã đo: ADMIN 403).</li>
  <li><code>@EnableMethodSecurity</code> + <code>@PreAuthorize</code>: luật nằm cạnh mã, dùng được tham số và bean.</li>
  <li>Chủ lượt đặt lấy từ token, không bao giờ từ thân request.</li>
  <li>Mọi endpoint đối tượng đều cần kiểm chủ; thiếu nó, <code>binh</code> đã huỷ lượt đặt của <code>lan</code>.</li>
  <li>Trả lời "không phải của bạn" và "không tồn tại" như nhau.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.spring.io/spring-security/reference/servlet/authorization/method-security.html', '🍃', 'Spring Security — Method Security', '@PreAuthorize, @PostAuthorize, SpEL, bean tuỳ biến.')}
${tl('https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/', '🛡️', 'OWASP API1:2023 Broken Object Level Authorization', 'IDOR trong API, ví dụ và cách phòng.')}
${tl('https://krebsonsecurity.com/2018/11/usps-site-exposed-data-on-60-million-users/', '🕵️', 'USPS site exposed data on 60 million users (2018)', 'Krebs on Security.')}

<h3>Nguồn</h3>
<ul>
  <li>Output ở trên: <code>c9.d.App</code> (<code>Api</code>, <code>Quyen</code>, profile <code>scope</code>) trong <code>lab/c9/sec</code>, Spring Boot 4.1.2, Spring Security 7.1.2, PostgreSQL 16.15 (20/11/2026).</li>
  <li>Brian Krebs, 21/11/2018.</li>
</ul>
</div>
`;

// ===== Bài 9.7 =====
const MA97_V4 = sql("-- V4: tài khoản đăng nhập + refresh token. Sinh viên đăng nhập bằng mã sinh viên; mật khẩu chỉ lưu dạng băm.\ncreate table accounts (\n  id            bigint generated by default as identity primary key,\n  username      varchar(50)  not null unique,\n  password_hash varchar(255) not null,\n  role          varchar(20)  not null default 'STUDENT' check (role in ('STUDENT', 'ADMIN')),\n  student_id    bigint unique references students\n);\ncreate table refresh_tokens (\n  id         bigint generated by default as identity primary key,\n  account_id bigint      not null references accounts,\n  token_hash char(64)    not null unique,\n  family     uuid        not null,\n  expires_at timestamptz not null,\n  used_at    timestamptz,\n  revoked_at timestamptz\n);\ncreate index refresh_tokens_family on refresh_tokens (family);");
const MA97_PROPS = props("# Lab 9: bí mật ký JWT (≥ 32 byte) và mật khẩu ADMIN đầu tiên CHỈ đến từ biến môi trường\nlabflow.jwt.secret=${LABFLOW_JWT_SECRET}\nlabflow.jwt.access-ttl=PT15M\nlabflow.jwt.clock-skew=PT60S\nlabflow.jwt.refresh-ttl=P7D\nlabflow.admin.password=${LABFLOW_ADMIN_PASSWORD:}");
const MA97_BAOMAT = java("@Configuration\n@EnableMethodSecurity\nclass BaoMat {\n    @Bean\n    SecurityFilterChain chain(HttpSecurity http, JwtAuthenticationConverter conv) throws Exception {\n        http.csrf(c -> c.disable())                       // API không dùng cookie phiên cho xác thực; cookie rt chỉ đi tới /auth (SameSite=Strict)\n            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))\n            .authorizeHttpRequests(a -> a\n                .requestMatchers(\"/auth/**\", \"/error\").permitAll()\n                .requestMatchers(HttpMethod.GET, \"/labs\", \"/labs/*/bookings\").permitAll()\n                .anyRequest().authenticated())\n            .oauth2ResourceServer(o -> o.jwt(j -> j.jwtAuthenticationConverter(conv)));\n        return http.build();\n    }\n\n    /** Claim \"roles\": [\"STUDENT\"] ⇒ ROLE_STUDENT (để hasRole dùng được). */\n    @Bean\n    JwtAuthenticationConverter jwtAuthenticationConverter() {\n        JwtGrantedAuthoritiesConverter g = new JwtGrantedAuthoritiesConverter();\n        g.setAuthoritiesClaimName(\"roles\");\n        g.setAuthorityPrefix(\"ROLE_\");\n        JwtAuthenticationConverter c = new JwtAuthenticationConverter();\n        c.setJwtGrantedAuthoritiesConverter(g);\n        return c;\n    }\n\n    @Bean\n    SecretKey jwtKey(@Value(\"${labflow.jwt.secret}\") String s) {\n        byte[] b = s.getBytes(StandardCharsets.UTF_8);\n        if (b.length < 32) throw new IllegalStateException(\"labflow.jwt.secret phải dài ít nhất 32 byte (đang \" + b.length + \")\");\n        return new SecretKeySpec(b, \"HmacSHA256\");\n    }\n\n    @Bean\n    JwtEncoder jwtEncoder(SecretKey k) { return new NimbusJwtEncoder(new ImmutableSecret<>(k)); }\n\n    @Bean\n    JwtDecoder jwtDecoder(SecretKey k, @Value(\"${labflow.jwt.clock-skew}\") Duration skew) {\n        NimbusJwtDecoder d = NimbusJwtDecoder.withSecretKey(k).build();\n        d.setJwtValidator(new DelegatingOAuth2TokenValidator<>(new JwtTimestampValidator(skew), new JwtIssuerValidator(\"labflow\")));\n        return d;\n    }\n\n    @Bean\n    PasswordEncoder passwordEncoder() { return PasswordEncoderFactories.createDelegatingPasswordEncoder(); }\n\n    @Bean\n    UserDetailsService userDetailsService(JdbcClient db) {\n        return u -> db.sql(\"select username, password_hash, role from accounts where username = ?\").param(u)\n            .query((rs, i) -> User.withUsername(rs.getString(1)).password(rs.getString(2)).roles(rs.getString(3)).build())\n            .optional().orElseThrow(() -> new UsernameNotFoundException(u));\n    }\n\n    @Bean\n    AuthenticationManager authenticationManager(UserDetailsService uds, PasswordEncoder pe) {\n        DaoAuthenticationProvider p = new DaoAuthenticationProvider(uds);\n        p.setPasswordEncoder(pe);\n        return new ProviderManager(p);\n    }\n\n    /** ADMIN đầu tiên: chỉ tạo khi có biến môi trường và chưa có ADMIN nào. */\n    @Bean\n    CommandLineRunner adminDauTien(JdbcClient db, PasswordEncoder pe, @Value(\"${labflow.admin.password}\") String pw) {\n        return a -> {\n            if (pw.isBlank()) return;\n            db.sql(\"insert into accounts (username, password_hash, role) select 'admin', ?, 'ADMIN' where not exists (select 1 from accounts where role = 'ADMIN')\")\n                .param(pe.encode(pw)).update();\n        };\n    }\n}");
const MA97_AUTH = java("@RestController\n@RequestMapping(\"/auth\")\nclass AuthController {\n    record DangKy(String studentCode, String password) { }           // không có trường role ⇒ gửi \"role\" cũng vô ích\n    record DangNhap(String username, String password) { }\n\n    private final AuthenticationManager am; private final JwtEncoder enc; private final RefreshTokens rts;\n    private final JdbcClient db; private final PasswordEncoder pe; private final Duration ttl;\n    AuthController(AuthenticationManager am, JwtEncoder enc, RefreshTokens rts, JdbcClient db, PasswordEncoder pe,\n                   @Value(\"${labflow.jwt.access-ttl}\") Duration ttl) {\n        this.am = am; this.enc = enc; this.rts = rts; this.db = db; this.pe = pe; this.ttl = ttl;\n    }\n\n    @PostMapping(\"/register\")\n    ResponseEntity<?> dangKy(@RequestBody DangKy r) {\n        if (r.studentCode() == null || r.password() == null || r.password().length() < 10)\n            return loi(HttpStatus.BAD_REQUEST, \"cần studentCode và mật khẩu ≥ 10 ký tự\");\n        Long sid = db.sql(\"select id from students where student_code = ?\").param(r.studentCode()).query(Long.class).optional().orElse(null);\n        if (sid == null) return loi(HttpStatus.NOT_FOUND, \"sinh viên \" + r.studentCode() + \" không tồn tại\");\n        try {\n            db.sql(\"insert into accounts (username, password_hash, role, student_id) values (?, ?, 'STUDENT', ?)\")\n                .params(r.studentCode(), pe.encode(r.password()), sid).update();\n        } catch (DuplicateKeyException e) { return loi(HttpStatus.CONFLICT, \"sinh viên này đã có tài khoản\"); }\n        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(\"username\", r.studentCode(), \"role\", \"STUDENT\"));\n    }\n\n    @PostMapping(\"/login\")\n    ResponseEntity<?> dangNhap(@RequestBody DangNhap r) {\n        Authentication a = am.authenticate(UsernamePasswordAuthenticationToken.unauthenticated(r.username(), r.password()));\n        String role = a.getAuthorities().stream().map(g -> g.getAuthority()).filter(g -> g.startsWith(\"ROLE_\"))\n            .map(g -> g.substring(5)).findFirst().orElseThrow();\n        return token(a.getName(), role, rts.cap(a.getName(), UUID.randomUUID()));\n    }\n\n    @PostMapping(\"/refresh\")\n    ResponseEntity<?> lamMoi(@CookieValue(name = \"rt\", required = false) String rt) {\n        if (rt == null) return loi(HttpStatus.UNAUTHORIZED, \"thiếu refresh token\");\n        RefreshTokens.KetQua k = rts.xoay(rt);\n        if (!k.ok()) return loi(HttpStatus.UNAUTHORIZED, \"refresh token không còn dùng được, hãy đăng nhập lại\");\n        return token(k.username(), k.role(), k.tokenMoi());\n    }\n\n    @PostMapping(\"/logout\")\n    ResponseEntity<?> dangXuat(@CookieValue(name = \"rt\", required = false) String rt) {\n        if (rt != null) rts.thuHoi(rt);\n        return ResponseEntity.noContent().header(HttpHeaders.SET_COOKIE, cookie(\"\", Duration.ZERO)).build();\n    }\n\n    @ExceptionHandler(AuthenticationException.class)\n    ResponseEntity<?> saiMatKhau(AuthenticationException e) { return loi(HttpStatus.UNAUTHORIZED, \"sai tên đăng nhập hoặc mật khẩu\"); }\n\n    private ResponseEntity<?> token(String username, String role, String rt) {\n        Instant now = Instant.now();\n        JwtClaimsSet c = JwtClaimsSet.builder().issuer(\"labflow\").subject(username).issuedAt(now).expiresAt(now.plus(ttl))\n            .claim(\"roles\", List.of(role)).build();\n        String at = enc.encode(JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(), c)).getTokenValue();\n        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie(rt, Duration.ofDays(7)))\n            .body(Map.of(\"access_token\", at, \"token_type\", \"Bearer\", \"expires_in\", ttl.toSeconds()));\n    }\n\n    private static String cookie(String v, Duration age) {\n        return ResponseCookie.from(\"rt\", v).httpOnly(true).secure(true).sameSite(\"Strict\").path(\"/auth\").maxAge(age).build().toString();\n    }\n\n    private static ResponseEntity<?> loi(HttpStatus s, String detail) {\n        return ResponseEntity.status(s).body(ProblemDetail.forStatusAndDetail(s, detail));\n    }\n}");
const MA97_RT = java("/** KHÔNG ném exception ở đây: ném ⇒ rollback ⇒ mất luôn lệnh thu hồi cả họ. */\n@Transactional\nKetQua xoay(String t) {\n    var d = db.sql(\"\"\"\n            select r.id, a.username, a.role, r.family, r.expires_at as het, r.used_at as da_dung, r.revoked_at as thu_hoi\n            from refresh_tokens r join accounts a on a.id = r.account_id where r.token_hash = ? for update of r\"\"\")\n        .param(sha256(t)).query(Dong.class).optional();\n    if (d.isEmpty()) return new KetQua(false, null, null, null);\n    Dong r = d.get();\n    if (r.thuHoi() != null || r.het().toInstant().isBefore(Instant.now())) return new KetQua(false, r.username(), null, null);\n    if (r.daDung() != null) {\n        db.sql(\"update refresh_tokens set revoked_at = now() where family = ? and revoked_at is null\").param(r.family()).update();\n        return new KetQua(false, r.username(), null, null);\n    }\n    db.sql(\"update refresh_tokens set used_at = now() where id = ?\").param(r.id()).update();\n    return new KetQua(true, r.username(), r.role(), cap(r.username(), r.family()));\n}");
const MA97_QUYEN = java("/** Dùng trong @PreAuthorize: ADMIN, hoặc đúng sinh viên sở hữu lượt đặt. Không có lượt đặt ⇒ false (403, không lộ id có tồn tại). */\n@Component(\"quyen\")\nclass Quyen {\n    private final JdbcClient db;\n    Quyen(JdbcClient db) { this.db = db; }\n\n    static boolean laAdmin(Authentication a) { return a.getAuthorities().stream().anyMatch(g -> g.getAuthority().equals(\"ROLE_ADMIN\")); }\n\n    public boolean chuHoacAdmin(long bookingId, Authentication a) {\n        if (laAdmin(a)) return true;\n        return db.sql(\"select s.student_code from bookings b join students s on s.id = b.student_id where b.id = ?\")\n            .param(bookingId).query(String.class).optional().map(a.getName()::equals).orElse(false);\n    }\n\n    public boolean chinhMinhHoacAdmin(String studentCode, Authentication a) { return laAdmin(a) || a.getName().equals(studentCode); }\n}");
const MA97_CTRL = java("/** Sinh viên chỉ đặt cho CHÍNH MÌNH: studentCode lấy từ token, giá trị trong body bị thay. ADMIN đặt hộ được. */\nstatic BookingRequest choChinhMinh(BookingRequest r, Authentication a) {\n    return Quyen.laAdmin(a) ? r : new BookingRequest(r.labCode(), a.getName(), r.startAt(), r.endAt());\n}\n\n@PostMapping(\"/bookings\") @ResponseStatus(HttpStatus.CREATED)\nBookingView dat(@RequestBody BookingRequest r, Authentication a) { return svc.dat(choChinhMinh(r, a)); }\n\n@PostMapping(\"/bookings/batch\") @ResponseStatus(HttpStatus.CREATED)\nList<BookingView> datLo(@RequestBody List<BookingRequest> ds, Authentication a) {\n    return svc.datLo(ds.stream().map(r -> choChinhMinh(r, a)).toList());\n}\n\n@PatchMapping(\"/bookings/{id}/cancel\")\n@PreAuthorize(\"@quyen.chuHoacAdmin(#id, authentication)\")\nBookingView huy(@PathVariable Long id) { return svc.huy(id); }");
const OUT97_ST = out("FAIL 1 công khai / cần đăng nhập — GET /labs 200 · POST không token 201 · header Bearer: 0\nFAIL 2 đăng ký — lần 1 404/? · trùng 404 · mã lạ 404 · băm: không thấy\nFAIL 3 đăng nhập — sai 404 · hai câu lỗi giống nhau: có · JWT 0 dấu chấm · cookie:  · admin: \nFAIL 4 chủ lượt đặt lấy từ token — HTTP 201 · studentCode ghi: SE180124\nFAIL 5 phân quyền theo chủ — xem 200 · huỷ 200 · liệt kê 200 · chủ huỷ 200 · trạng thái CANCELLED\nFAIL 6 duyệt theo vai trò — STUDENT 200 · ADMIN 409\nFAIL 7 token giả — sửa payload 200 · alg none 200\nFAIL 8 token hết hạn — app UP · ngay 200 · sau 3 giây 200\nFAIL 9 refresh xoay vòng — token mới:  (TRÙNG token cũ) · dùng lại token cũ 404 · token mới sau đó 404\nFAIL 10 đăng xuất — logout 404 · refresh sau đó 404\nĐIỂM: 0/10");
const OUT97_G1 = out("PASS 1 GET /labs công khai 200; POST /bookings không token ⇒ 401 + WWW-Authenticate: Bearer\nPASS 2 đăng ký: 201 STUDENT dù gửi role ADMIN, trùng 409, mã lạ 4xx, mật khẩu lưu {bcrypt}\nPASS 3 đăng nhập: sai ⇒ 401 cùng một câu, đúng ⇒ JWT 3 phần + cookie rt HttpOnly; admin đăng nhập được\nPASS 4 sinh viên đặt phòng: chủ lượt đặt lấy từ token (gửi SE180124 ⇒ ghi SE180123)\nPASS 5 người khác xem/huỷ/liệt kê lượt đặt ⇒ 403; chủ huỷ ⇒ 200\nPASS 6 duyệt: STUDENT ⇒ 403, ADMIN ⇒ 200\nPASS 7 token sửa payload ⇒ 401, alg none ⇒ 401\nPASS 8 access-ttl=PT2S, clock-skew=PT0S: ngay ⇒ 200, sau 3 giây ⇒ 401\nPASS 9 refresh xoay vòng: token mới khác cũ; dùng lại token cũ ⇒ 401 và thu hồi luôn token mới\nPASS 10 đăng xuất ⇒ refresh token đó 401\nĐIỂM: 10/10");
const OUT97_BODY = out("PASS 1 GET /labs công khai 200; POST /bookings không token ⇒ 401 + WWW-Authenticate: Bearer\nPASS 2 đăng ký: 201 STUDENT dù gửi role ADMIN, trùng 409, mã lạ 4xx, mật khẩu lưu {bcrypt}\nPASS 3 đăng nhập: sai ⇒ 401 cùng một câu, đúng ⇒ JWT 3 phần + cookie rt HttpOnly; admin đăng nhập được\nFAIL 4 chủ lượt đặt lấy từ token — HTTP 201 · studentCode ghi: SE180124\nFAIL 5 phân quyền theo chủ — xem 200 · huỷ 200 · liệt kê 403 · chủ huỷ 403 · trạng thái CANCELLED\nPASS 6 duyệt: STUDENT ⇒ 403, ADMIN ⇒ 200\nPASS 7 token sửa payload ⇒ 401, alg none ⇒ 401\nPASS 8 access-ttl=PT2S, clock-skew=PT0S: ngay ⇒ 200, sau 3 giây ⇒ 401\nPASS 9 refresh xoay vòng: token mới khác cũ; dùng lại token cũ ⇒ 401 và thu hồi luôn token mới\nPASS 10 đăng xuất ⇒ refresh token đó 401\nĐIỂM: 8/10");
const OUT97_KX = out("PASS 1 GET /labs công khai 200; POST /bookings không token ⇒ 401 + WWW-Authenticate: Bearer\nPASS 2 đăng ký: 201 STUDENT dù gửi role ADMIN, trùng 409, mã lạ 4xx, mật khẩu lưu {bcrypt}\nPASS 3 đăng nhập: sai ⇒ 401 cùng một câu, đúng ⇒ JWT 3 phần + cookie rt HttpOnly; admin đăng nhập được\nPASS 4 sinh viên đặt phòng: chủ lượt đặt lấy từ token (gửi SE180124 ⇒ ghi SE180123)\nPASS 5 người khác xem/huỷ/liệt kê lượt đặt ⇒ 403; chủ huỷ ⇒ 200\nPASS 6 duyệt: STUDENT ⇒ 403, ADMIN ⇒ 200\nPASS 7 token sửa payload ⇒ 401, alg none ⇒ 401\nPASS 8 access-ttl=PT2S, clock-skew=PT0S: ngay ⇒ 200, sau 3 giây ⇒ 401\nFAIL 9 refresh xoay vòng — token mới: có (TRÙNG token cũ) · dùng lại token cũ 200 · token mới sau đó 200\nPASS 10 đăng xuất ⇒ refresh token đó 401\nĐIỂM: 9/10");
const OUT97_SCOPE = out("PASS 1 GET /labs công khai 200; POST /bookings không token ⇒ 401 + WWW-Authenticate: Bearer\nPASS 2 đăng ký: 201 STUDENT dù gửi role ADMIN, trùng 409, mã lạ 4xx, mật khẩu lưu {bcrypt}\nPASS 3 đăng nhập: sai ⇒ 401 cùng một câu, đúng ⇒ JWT 3 phần + cookie rt HttpOnly; admin đăng nhập được\nPASS 4 sinh viên đặt phòng: chủ lượt đặt lấy từ token (gửi SE180124 ⇒ ghi SE180123)\nPASS 5 người khác xem/huỷ/liệt kê lượt đặt ⇒ 403; chủ huỷ ⇒ 200\nFAIL 6 duyệt theo vai trò — STUDENT 403 · ADMIN 403\nPASS 7 token sửa payload ⇒ 401, alg none ⇒ 401\nPASS 8 access-ttl=PT2S, clock-skew=PT0S: ngay ⇒ 200, sau 3 giây ⇒ 401\nPASS 9 refresh xoay vòng: token mới khác cũ; dùng lại token cũ ⇒ 401 và thu hồi luôn token mới\nPASS 10 đăng xuất ⇒ refresh token đó 401\nĐIỂM: 9/10");

const L97_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.7 · Lab</span>
<h2>Chapter 9 lab: register, log in and authorize LabFlow</h2>
<p class="lead">LabFlow after Lab 8 has a clean schema history and a booking API that anyone can call — including <code>PATCH /bookings/{id}/approve</code>. In this lab you put the whole chapter on it: student accounts with BCrypt, JWT login, refresh tokens with rotation, owner-only actions and an ADMIN role. A grader with 10 checks runs against your code over HTTP. The starting point scores 0/10; the reference solution 10/10 three times in a row; three tempting shortcuts lose 1–2 checks each.</p>

<h3>The situation</h3>
<p>The faculty wants LabFlow open to students next week. Every student in <code>students</code> may create an account with their student code. Students book labs for themselves only, see and cancel only their own bookings. The lab manager (ADMIN) approves bookings and may book on behalf of anyone. The security team asks for short-lived tokens, revocable sessions, and no password or secret anywhere in Git.</p>

<h3>Your tasks</h3>
<div class="callout ok"><ol>
  <li>Start from the Lab 8 solution (<code>lab9/starter</code>, main class <code>labflow.Lab9App</code>). Add <code>spring-boot-starter-security</code> and <code>spring-boot-starter-security-oauth2-resource-server</code>.</li>
  <li>Migration <code>V4</code>: an accounts table (unique username, password hash, role STUDENT/ADMIN, link to the student) and a refresh token table (hash, family, expiry, used, revoked).</li>
  <li><code>POST /auth/register {studentCode, password}</code>: 201 with role STUDENT whatever else the body contains; 409 if the student already has an account; 4xx for an unknown student code; password stored with <code>DelegatingPasswordEncoder</code>.</li>
  <li><code>POST /auth/login {username, password}</code>: 200 with an HS256 JWT (<code>iss=labflow</code>, <code>sub</code>, <code>roles</code>, <code>exp</code>) and a refresh token cookie <code>rt</code> (<code>HttpOnly; Secure; SameSite=Strict; Path=/auth</code>); the same 401 body for every failure.</li>
  <li><code>POST /auth/refresh</code> (cookie): rotate; a reused old token revokes the family. <code>POST /auth/logout</code>: revoke, clear the cookie.</li>
  <li>Public: <code>GET /labs</code>, <code>GET /labs/{code}/bookings</code>, <code>/auth/**</code>, <code>/error</code>. Everything else needs a valid token (401 with <code>WWW-Authenticate: Bearer</code>).</li>
  <li>A STUDENT's booking always belongs to the token's student code. View, cancel and list are owner-or-ADMIN (403 otherwise). Approve is ADMIN-only.</li>
  <li>Configuration: <code>labflow.jwt.secret=\${LABFLOW_JWT_SECRET}</code> (refuse to start under 32 bytes), <code>labflow.jwt.access-ttl</code> (default PT15M), <code>labflow.jwt.clock-skew</code> (default PT60S), <code>labflow.jwt.refresh-ttl</code>, and the first ADMIN's password from <code>LABFLOW_ADMIN_PASSWORD</code>.</li>
</ol></div>

<h3>Rubric (the grader, <code>cham.sh</code>)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">1</span><span class="v"><code>GET /labs</code> without a token: 200. <code>POST /bookings</code> without a token: 401 with <code>WWW-Authenticate: Bearer</code>.</span></div>
  <div class="kv"><span class="k">2</span><span class="v">Register with <code>"role":"ADMIN"</code> in the body ⇒ 201 STUDENT; duplicate 409; unknown code 4xx; hash stored as <code>{bcrypt}$2a…</code>.</span></div>
  <div class="kv"><span class="k">3</span><span class="v">Login: wrong password and unknown user give 401 with identical bodies; success gives a 3-part JWT and an <code>HttpOnly</code> <code>rt</code> cookie; the ADMIN can log in.</span></div>
  <div class="kv"><span class="k">4</span><span class="v">A student books with <code>studentCode</code> of someone else in the body ⇒ the booking belongs to the token's student.</span></div>
  <div class="kv"><span class="k">5</span><span class="v">Another student: view 403, cancel 403, list 403. The owner cancels: 200, status CANCELLED.</span></div>
  <div class="kv"><span class="k">6</span><span class="v">Approve: STUDENT 403, ADMIN 200.</span></div>
  <div class="kv"><span class="k">7</span><span class="v">Token with edited payload (<code>roles</code> ⇒ ADMIN) ⇒ 401; <code>alg: none</code> ⇒ 401.</span></div>
  <div class="kv"><span class="k">8</span><span class="v">Restarted with <code>access-ttl=PT2S</code>, <code>clock-skew=PT0S</code>: 200 at once, 401 after 3 seconds.</span></div>
  <div class="kv"><span class="k">9</span><span class="v">Refresh returns a different token; replaying the old one ⇒ 401, and the new one is revoked too ⇒ 401.</span></div>
  <div class="kv"><span class="k">10</span><span class="v">After logout, refresh with that token ⇒ 401.</span></div>
</div>
${bash(`bash ~/vbg-dp/scratchpad/sb/lab/c9/run.sh net              # PostgreSQL sb-c9-pg, port 41920 for the app
bash lab9/chay.sh $PWD/lab9/starter                        # build
bash lab9/cham.sh $PWD/lab9/starter                        # grade (database lf9, profile dev)`)}

<h3>Done when</h3>
<p><code>cham.sh</code> prints <code>ĐIỂM: 10/10</code> on three consecutive runs, <code>git grep</code> finds no secret or password in the repository, and you can explain each of the ten checks in one sentence.</p>

<h3>What the starting point and the solution scored</h3>
<p>The starting point (Lab 8, no security at all):</p>
${OUT97_ST}
<p>Note check 4 and 5: without security a student can book in someone else's name and cancel anyone's booking — the API simply trusts the body and the URL. The reference solution, first of three identical runs:</p>
${OUT97_G1}

<h3>Three shortcuts we graded</h3>
<p><strong>1. Trusting <code>studentCode</code> from the body</strong> (authentication is there, ownership on creation is not):</p>
${OUT97_BODY}
<p>Check 4 fails directly, and check 5 follows: the booking now belongs to SE180124, so the "other student" is the owner and the real booker gets 403. One line of trust breaks two features.</p>
<p><strong>2. No rotation</strong> (one refresh token reused until it expires):</p>
${OUT97_KX}
<p>Everything works for the user, which is why this shortcut survives code review. The grader's attacker replays the token and keeps getting new access tokens.</p>
<p><strong>3. Default JWT converter</strong> (forgot the two lines that map <code>roles</code> to <code>ROLE_</code>):</p>
${OUT97_SCOPE}
<p>Students are correctly refused, so it looks secure; but the ADMIN is refused too. Check 5 still passes because the ownership bean compares the subject, not a role.</p>

<h3>Scoring out of 10</h3>
<ul>
  <li>1 point per grader check (10).</li>
  <li>Deduct 2 if any secret, admin password or JWT key is committed, even in <code>application-dev.properties</code>.</li>
  <li>Deduct 1 if login logs the request body or a full token.</li>
  <li>Deduct 1 if a 500 inside <code>/auth/**</code> reaches the client as 401 (check: <code>/error</code> is permitted).</li>
</ul>

${giai('Show the reference solution', `<p>Migration and configuration:</p>
${MA97_V4}
${MA97_PROPS}
<p>Security configuration, keys, users and the first ADMIN:</p>
${MA97_BAOMAT}
<p>Register, login, refresh, logout:</p>
${MA97_AUTH}
<p>Rotation with reuse detection (no exception inside the transaction):</p>
${MA97_RT}
<p>Ownership bean and the controller changes:</p>
${MA97_QUYEN}
${MA97_CTRL}`)}

<h3>🎤 What the interviewer will ask (Chapter 9)</h3>
<ol>
  <li><strong>"Walk me through what happens when a user logs in and calls an API with your setup."</strong> — <code>/auth/login</code> → <code>AuthenticationManager</code> → <code>DaoAuthenticationProvider</code> + BCrypt → JWT (15 min) + refresh cookie; then every call: <code>BearerTokenAuthenticationFilter</code> → <code>JwtDecoder</code> (signature, exp, iss) → authorities → <code>@PreAuthorize</code>.</li>
  <li><strong>"How do you prevent a student from cancelling someone else's booking?"</strong> — Owner from the token at creation, an ownership check on every object action, 403 for non-owners; tested with two users.</li>
  <li><strong>"How do you log a user out if JWTs are stateless?"</strong> — Revoke the refresh family; the access token expires within minutes; for immediate kill, a denylist or a per-user "valid after" timestamp.</li>
  <li><strong>"Where do you keep the JWT secret?"</strong> — Environment variable or secret manager, ≥ 256 bits, checked at startup; rotate it with a plan (everyone logs in again) or move to RS256 with key ids.</li>
  <li><strong>"What changed from Spring Security 5 to 7 that broke tutorials?"</strong> — <code>WebSecurityConfigurerAdapter</code> removed, lambda DSL with <code>requestMatchers</code>, <code>@EnableMethodSecurity</code> instead of the deprecated <code>@EnableGlobalMethodSecurity</code> (still in 7.1.2, but do not use it in new code), <code>DaoAuthenticationProvider</code> constructor, factor authorities like <code>FACTOR_PASSWORD</code> in Security 7.</li>
</ol>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Account vs student</span><span class="v">The login identity (accounts) is separate from the domain record (students) and linked by id.</span></div>
  <div class="kv"><span class="k">Bootstrap admin</span><span class="v">The first ADMIN created from an environment variable at startup, only if none exists.</span></div>
  <div class="kv"><span class="k">Ownership check</span><span class="v">Verifying that the object in the URL belongs to the caller.</span></div>
  <div class="kv"><span class="k">Grader</span><span class="v">The black-box script that tests the running API over HTTP, like a reviewer would.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Lab 9 turns the open Lab 8 API into one with accounts, JWT, refresh rotation, roles and ownership.</li>
  <li>Measured: starter 0/10, solution 10/10 ×3; trusting the body 8/10, no rotation 9/10, default converter 9/10.</li>
  <li>The bugs that survive are the ones where everything still "works" for the normal user.</li>
</ul>

<h3>Sources</h3>
<ul>
  <li><code>lab/c9/lab9/{starter,giai,chay.sh,cham.sh}</code>; shortcut variants in <code>~/.rtq-sb/c99/bay/{body,khongxoay,scope}</code>. Spring Boot 4.1.2, Spring Security 7.1.2, Flyway 12.4.0, PostgreSQL 16.15 (20/11/2026).</li>
</ul>
</div>
`;

const L97_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.7 · Lab</span>
<h2>Lab chương 9: đăng ký, đăng nhập và phân quyền cho LabFlow</h2>
<p class="lead">LabFlow sau Lab 8 có lịch sử schema sạch sẽ và một API đặt phòng mà ai cũng gọi được — kể cả <code>PATCH /bookings/{id}/approve</code>. Trong lab này bạn đặt cả chương lên nó: tài khoản sinh viên băm BCrypt, đăng nhập bằng JWT, refresh token có xoay vòng, thao tác chỉ dành cho chủ, và vai trò ADMIN. Một bộ chấm 10 mục chạy trên mã của bạn qua HTTP. Điểm xuất phát được 0/10; lời giải mẫu 10/10 ba lần liền; ba lối tắt hấp dẫn mất 1–2 mục mỗi cái.</p>

<h3>Tình huống</h3>
<p>Khoa muốn mở LabFlow cho sinh viên từ tuần sau. Mọi sinh viên trong bảng <code>students</code> được tạo tài khoản bằng mã sinh viên của mình. Sinh viên chỉ đặt phòng cho chính mình, chỉ xem và huỷ lượt đặt của mình. Người quản lý phòng lab (ADMIN) duyệt lượt đặt và được đặt hộ bất kỳ ai. Nhóm bảo mật yêu cầu token sống ngắn, phiên thu hồi được, và không có mật khẩu hay bí mật nào trong Git.</p>

<h3>Việc của bạn</h3>
<div class="callout ok"><ol>
  <li>Bắt đầu từ lời giải Lab 8 (<code>lab9/starter</code>, lớp chính <code>labflow.Lab9App</code>). Thêm <code>spring-boot-starter-security</code> và <code>spring-boot-starter-security-oauth2-resource-server</code>.</li>
  <li>Migration <code>V4</code>: bảng tài khoản (username duy nhất, hash mật khẩu, vai trò STUDENT/ADMIN, liên kết tới sinh viên) và bảng refresh token (hash, họ, hạn dùng, đã dùng, đã thu hồi).</li>
  <li><code>POST /auth/register {studentCode, password}</code>: 201 với vai trò STUDENT bất kể thân request còn chứa gì; 409 nếu sinh viên đã có tài khoản; 4xx với mã sinh viên lạ; mật khẩu lưu bằng <code>DelegatingPasswordEncoder</code>.</li>
  <li><code>POST /auth/login {username, password}</code>: 200 kèm JWT HS256 (<code>iss=labflow</code>, <code>sub</code>, <code>roles</code>, <code>exp</code>) và cookie refresh token <code>rt</code> (<code>HttpOnly; Secure; SameSite=Strict; Path=/auth</code>); mọi lần hỏng cùng một thân 401.</li>
  <li><code>POST /auth/refresh</code> (cookie): xoay vòng; token cũ bị dùng lại thì thu hồi cả họ. <code>POST /auth/logout</code>: thu hồi, xoá cookie.</li>
  <li>Công khai: <code>GET /labs</code>, <code>GET /labs/{code}/bookings</code>, <code>/auth/**</code>, <code>/error</code>. Mọi thứ khác cần token hợp lệ (401 kèm <code>WWW-Authenticate: Bearer</code>).</li>
  <li>Lượt đặt của STUDENT luôn thuộc về mã sinh viên trong token. Xem, huỷ và liệt kê chỉ dành cho chủ hoặc ADMIN (còn lại 403). Duyệt chỉ ADMIN.</li>
  <li>Cấu hình: <code>labflow.jwt.secret=\${LABFLOW_JWT_SECRET}</code> (từ chối khởi động nếu dưới 32 byte), <code>labflow.jwt.access-ttl</code> (mặc định PT15M), <code>labflow.jwt.clock-skew</code> (mặc định PT60S), <code>labflow.jwt.refresh-ttl</code>, và mật khẩu ADMIN đầu tiên lấy từ <code>LABFLOW_ADMIN_PASSWORD</code>.</li>
</ol></div>

<h3>Rubric (bộ chấm <code>cham.sh</code>)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">1</span><span class="v"><code>GET /labs</code> không token: 200. <code>POST /bookings</code> không token: 401 kèm <code>WWW-Authenticate: Bearer</code>.</span></div>
  <div class="kv"><span class="k">2</span><span class="v">Đăng ký có <code>"role":"ADMIN"</code> trong thân ⇒ 201 STUDENT; trùng 409; mã lạ 4xx; hash lưu dạng <code>{bcrypt}$2a…</code>.</span></div>
  <div class="kv"><span class="k">3</span><span class="v">Đăng nhập: sai mật khẩu và tên không tồn tại cho 401 với thân giống hệt; thành công cho JWT 3 phần và cookie <code>rt</code> <code>HttpOnly</code>; ADMIN đăng nhập được.</span></div>
  <div class="kv"><span class="k">4</span><span class="v">Sinh viên đặt phòng với <code>studentCode</code> của người khác trong thân ⇒ lượt đặt thuộc về sinh viên trong token.</span></div>
  <div class="kv"><span class="k">5</span><span class="v">Sinh viên khác: xem 403, huỷ 403, liệt kê 403. Chủ huỷ: 200, trạng thái CANCELLED.</span></div>
  <div class="kv"><span class="k">6</span><span class="v">Duyệt: STUDENT 403, ADMIN 200.</span></div>
  <div class="kv"><span class="k">7</span><span class="v">Token bị sửa payload (<code>roles</code> ⇒ ADMIN) ⇒ 401; <code>alg: none</code> ⇒ 401.</span></div>
  <div class="kv"><span class="k">8</span><span class="v">Khởi động lại với <code>access-ttl=PT2S</code>, <code>clock-skew=PT0S</code>: ngay lập tức 200, sau 3 giây 401.</span></div>
  <div class="kv"><span class="k">9</span><span class="v">Refresh trả token khác; dùng lại token cũ ⇒ 401, và token mới cũng bị thu hồi ⇒ 401.</span></div>
  <div class="kv"><span class="k">10</span><span class="v">Sau khi đăng xuất, refresh bằng token đó ⇒ 401.</span></div>
</div>
${bash(`bash ~/vbg-dp/scratchpad/sb/lab/c9/run.sh net              # PostgreSQL sb-c9-pg, cổng 41920 cho ứng dụng
bash lab9/chay.sh $PWD/lab9/starter                        # build
bash lab9/cham.sh $PWD/lab9/starter                        # chấm (CSDL lf9, profile dev)`)}

<h3>Đạt khi</h3>
<p><code>cham.sh</code> in <code>ĐIỂM: 10/10</code> ba lần chạy liền, <code>git grep</code> không tìm thấy bí mật hay mật khẩu nào trong kho mã, và bạn giải thích được từng mục trong mười mục bằng một câu.</p>

<h3>Điểm xuất phát và lời giải được bao nhiêu</h3>
<p>Điểm xuất phát (Lab 8, chưa có bảo mật gì):</p>
${OUT97_ST}
<p>Để ý mục 4 và 5: không có bảo mật, sinh viên đặt phòng dưới tên người khác và huỷ lượt đặt của bất kỳ ai — API cứ thế tin thân request và URL. Lời giải mẫu, lần đầu trong ba lần chạy giống hệt nhau:</p>
${OUT97_G1}

<h3>Ba lối tắt chúng tôi đã chấm</h3>
<p><strong>1. Tin <code>studentCode</code> trong thân request</strong> (có xác thực, nhưng không ép chủ lúc tạo):</p>
${OUT97_BODY}
<p>Mục 4 hỏng trực tiếp, và mục 5 hỏng theo: lượt đặt giờ thuộc về SE180124, nên "sinh viên khác" lại là chủ còn người đặt thật nhận 403. Một dòng tin tưởng làm hỏng hai tính năng.</p>
<p><strong>2. Không xoay vòng</strong> (một refresh token dùng lại tới khi hết hạn):</p>
${OUT97_KX}
<p>Với người dùng mọi thứ vẫn chạy, vì thế lối tắt này hay lọt qua review. Kẻ tấn công trong bộ chấm dùng lại token và cứ thế nhận access token mới.</p>
<p><strong>3. Converter JWT mặc định</strong> (quên hai dòng đổi <code>roles</code> thành <code>ROLE_</code>):</p>
${OUT97_SCOPE}
<p>Sinh viên bị từ chối đúng, nên trông có vẻ an toàn; nhưng ADMIN cũng bị từ chối. Mục 5 vẫn đạt vì bean kiểm chủ so <code>sub</code>, không so vai trò.</p>

<h3>Thang 10 điểm</h3>
<ul>
  <li>Mỗi mục của bộ chấm 1 điểm (10).</li>
  <li>Trừ 2 nếu có bí mật, mật khẩu admin hay khoá JWT nào bị commit, kể cả trong <code>application-dev.properties</code>.</li>
  <li>Trừ 1 nếu đăng nhập ghi log thân request hay nguyên token.</li>
  <li>Trừ 1 nếu lỗi 500 bên trong <code>/auth/**</code> tới client dưới dạng 401 (kiểm: <code>/error</code> được mở).</li>
</ul>

${giai('Xem lời giải mẫu', `<p>Migration và cấu hình:</p>
${MA97_V4}
${MA97_PROPS}
<p>Cấu hình bảo mật, khoá, người dùng và ADMIN đầu tiên:</p>
${MA97_BAOMAT}
<p>Đăng ký, đăng nhập, refresh, đăng xuất:</p>
${MA97_AUTH}
<p>Xoay vòng có phát hiện dùng lại (không ném exception trong giao dịch):</p>
${MA97_RT}
<p>Bean kiểm chủ và phần controller thay đổi:</p>
${MA97_QUYEN}
${MA97_CTRL}`)}

<h3>🎤 Phỏng vấn viên sẽ hỏi (Chương 9)</h3>
<ol>
  <li><strong>"Kể lại chuyện gì xảy ra khi người dùng đăng nhập rồi gọi API trong thiết kế của bạn."</strong> — <code>/auth/login</code> → <code>AuthenticationManager</code> → <code>DaoAuthenticationProvider</code> + BCrypt → JWT (15 phút) + cookie refresh; rồi mỗi lời gọi: <code>BearerTokenAuthenticationFilter</code> → <code>JwtDecoder</code> (chữ ký, exp, iss) → danh sách quyền → <code>@PreAuthorize</code>.</li>
  <li><strong>"Làm sao ngăn sinh viên huỷ lượt đặt của người khác?"</strong> — Chủ lấy từ token lúc tạo, kiểm chủ ở mọi thao tác trên đối tượng, người không phải chủ nhận 403; test bằng hai người dùng.</li>
  <li><strong>"JWT stateless thì đăng xuất người dùng thế nào?"</strong> — Thu hồi cả họ refresh; access token hết hạn trong vài phút; cần chặn ngay thì dùng danh sách cấm hoặc mốc "chỉ nhận token phát sau thời điểm" cho từng người.</li>
  <li><strong>"Bí mật JWT giữ ở đâu?"</strong> — Biến môi trường hoặc kho bí mật, ≥ 256 bit, kiểm lúc khởi động; thay khoá có kế hoạch (mọi người đăng nhập lại) hoặc chuyển sang RS256 với id khoá.</li>
  <li><strong>"Từ Spring Security 5 lên 7 thay đổi gì làm hỏng các bài hướng dẫn?"</strong> — Gỡ <code>WebSecurityConfigurerAdapter</code>, DSL lambda với <code>requestMatchers</code>, <code>@EnableMethodSecurity</code> thay cho <code>@EnableGlobalMethodSecurity</code> đã lỗi thời (vẫn còn trong 7.1.2, nhưng mã mới đừng dùng), constructor của <code>DaoAuthenticationProvider</code>, và quyền yếu tố như <code>FACTOR_PASSWORD</code> ở Security 7.</li>
</ol>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Tài khoản và sinh viên</span><span class="v">Danh tính đăng nhập (accounts) tách khỏi bản ghi nghiệp vụ (students), nối bằng id.</span></div>
  <div class="kv"><span class="k">Admin khởi đầu</span><span class="v">ADMIN đầu tiên được tạo từ biến môi trường lúc khởi động, chỉ khi chưa có ADMIN nào.</span></div>
  <div class="kv"><span class="k">Kiểm chủ</span><span class="v">Xác minh đối tượng trong URL thuộc về người gọi.</span></div>
  <div class="kv"><span class="k">Bộ chấm</span><span class="v">Script hộp đen test API đang chạy qua HTTP, như một người review.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Lab 9 biến API mở của Lab 8 thành API có tài khoản, JWT, refresh xoay vòng, vai trò và kiểm chủ.</li>
  <li>Đã đo: điểm xuất phát 0/10, lời giải 10/10 ×3; tin thân request 8/10, không xoay vòng 9/10, converter mặc định 9/10.</li>
  <li>Lỗi sống sót là những lỗi mà với người dùng bình thường mọi thứ vẫn "chạy".</li>
</ul>

<h3>Nguồn</h3>
<ul>
  <li><code>lab/c9/lab9/{starter,giai,chay.sh,cham.sh}</code>; các bản lối tắt ở <code>~/.rtq-sb/c99/bay/{body,khongxoay,scope}</code>. Spring Boot 4.1.2, Spring Security 7.1.2, Flyway 12.4.0, PostgreSQL 16.15 (20/11/2026).</li>
</ul>
</div>
`;

const Q = (question, options, correctIndex) => ({ question, options, correctIndex, points: 1 });
const QUIZ9 = [
  Q('With only spring-boot-starter-security added and CSRF left on, a POST with the correct Basic password got 401. Why?|||Chỉ thêm spring-boot-starter-security và để CSRF bật, một lệnh POST đúng mật khẩu Basic nhận 401. Vì sao?', [
    'The password is only valid for GET|||Mật khẩu chỉ dùng được cho GET',
    'CsrfFilter rejected it before BasicAuthenticationFilter ran, and the forward to the protected /error became 401|||CsrfFilter từ chối trước khi BasicAuthenticationFilter chạy, và lần chuyển tiếp sang /error bị bảo vệ thành 401',
    'POST requires the ADMIN role by default|||POST mặc định cần vai trò ADMIN',
    'The generated password expired|||Mật khẩu tự sinh đã hết hạn',
  ], 1),
  Q('A filter is added with addFilterBefore(...) AND declared as a @Bean. What did one request print?|||Một filter được cài bằng addFilterBefore(...) VÀ được khai báo là @Bean. Một request in ra gì?', [
    'One line, Spring removes duplicates|||Một dòng, Spring tự bỏ trùng',
    'Nothing, the bean replaces the chain filter|||Không gì, bean thay thế filter trong chuỗi',
    'Two lines: once in the security chain, once as a servlet filter|||Hai dòng: một lần trong chuỗi bảo mật, một lần như filter servlet',
    'The application refuses to start|||Ứng dụng từ chối khởi động',
  ], 2),
  Q('BCrypt cost 10 took 59 ms here. Roughly how long does cost 12 take?|||BCrypt cost 10 mất 59 ms ở đây. Cost 12 mất khoảng bao lâu?', [
    '61 ms|||61 ms', '118 ms|||118 ms', 'About 240 ms (×4)|||Khoảng 240 ms (×4)', 'About 6 seconds|||Khoảng 6 giây',
  ], 2),
  Q('Why did the naive login endpoint leak which usernames exist?|||Vì sao endpoint đăng nhập ngây thơ để lộ tên tài khoản nào tồn tại?', [
    'Different error messages|||Câu báo lỗi khác nhau',
    'It answered an unknown name in 3 ms and a known name in 62 ms|||Nó trả lời tên lạ trong 3 ms và tên có thật trong 62 ms',
    'It returned 404 for unknown names|||Nó trả 404 cho tên lạ',
    'It logged the password|||Nó ghi log mật khẩu',
  ], 1),
  Q('What protects a JWT payload from being read by others?|||Thứ gì bảo vệ payload của JWT khỏi bị người khác đọc?', [
    'The signature|||Chữ ký', 'Base64URL encoding|||Mã hoá Base64URL', 'Nothing: it is only encoded, keep personal data out|||Không gì cả: nó chỉ được mã hoá dạng chữ, đừng bỏ dữ liệu cá nhân vào', 'HS256|||HS256',
  ], 2),
  Q('Login returned 401 although the password was right; the log showed KeyLengthException. What was wrong?|||Đăng nhập trả 401 dù đúng mật khẩu; log có KeyLengthException. Sai ở đâu?', [
    'The HS256 secret was under 256 bits, and the protected /error turned the 500 into 401|||Bí mật HS256 dưới 256 bit, và /error bị bảo vệ biến lỗi 500 thành 401',
    'BCrypt rejected the password|||BCrypt từ chối mật khẩu',
    'The token was expired|||Token đã hết hạn',
    'The user had no role|||Người dùng không có vai trò',
  ], 0),
  Q('An access token with a 3-second lifetime is sent 5 seconds after login, with Spring\'s default validator. Result?|||Access token sống 3 giây được gửi 5 giây sau khi đăng nhập, với validator mặc định của Spring. Kết quả?', [
    '401 Jwt expired|||401 Jwt expired', '200, because the default clock skew is 60 seconds|||200, vì độ lệch đồng hồ mặc định là 60 giây', '403 insufficient_scope|||403 insufficient_scope', '500|||500',
  ], 1),
  Q('An attacker replays a refresh token that was already rotated. What did our server do?|||Kẻ tấn công dùng lại một refresh token đã được xoay. Server của ta làm gì?', [
    'Issued a new access token to the attacker only|||Chỉ phát access token mới cho kẻ tấn công',
    'Returned 401 and revoked the whole family, so the real user\'s newest token failed too|||Trả 401 và thu hồi cả họ, nên token mới nhất của người dùng thật cũng hỏng',
    'Returned 401 and kept the newest token valid|||Trả 401 và giữ token mới nhất còn hiệu lực',
    'Logged the event only|||Chỉ ghi log',
  ], 1),
  Q('With Spring\'s default JwtGrantedAuthoritiesConverter and a token carrying "roles":["ADMIN"], what does @PreAuthorize("hasRole(\'ADMIN\')") return?|||Với JwtGrantedAuthoritiesConverter mặc định của Spring và token mang "roles":["ADMIN"], @PreAuthorize("hasRole(\'ADMIN\')") trả gì?', [
    '200 — roles are read automatically|||200 — vai trò được đọc tự động', '403 — the default reads scope/scp, so there is no ROLE_ADMIN|||403 — mặc định đọc scope/scp, nên không có ROLE_ADMIN', '401|||401', 'Startup error|||Lỗi lúc khởi động',
  ], 1),
  Q('The /v0 cancel endpoint only required a valid token. What did student binh manage to do?|||Endpoint huỷ /v0 chỉ cần token hợp lệ. Sinh viên binh đã làm được gì?', [
    'Nothing, authentication blocks him|||Không gì, xác thực chặn cậu ấy', 'Cancel lan\'s booking (IDOR)|||Huỷ lượt đặt của lan (IDOR)', 'Become ADMIN|||Trở thành ADMIN', 'Read the JWT secret|||Đọc được bí mật JWT',
  ], 1),
];
const L = (n, slug, en, vi, description, content) => ({
  title: `9.${n} — ${en}|||9.${n} — ${vi}`, slug, type: 'LESSON', isFreePreview: false, description, content,
});

export default {
  title: 'Chapter 9 — Spring Security + JWT|||Chương 9 — Spring Security + JWT',
  description: 'Spring Security 7 đo thật: 16 filter mặc định, SecurityFilterChain tự khai, CSRF và /error biến lỗi thành 401, BCrypt cost 4–14, SHA-256 nhanh hơn 836.124 lần, DelegatingPasswordEncoder, giới hạn 72 byte, dò tên qua thời gian; đăng nhập phát JWT HS256/RS256, kiểm JWT mỗi request (13 filter, 5 token giả, clock skew 60 giây), refresh token xoay vòng thu hồi cả họ, @PreAuthorize kiểm chủ; Lab 9 bộ chấm 10 mục.',
  lessons: [
    L(1, 'sb-9-1-security-filter-chain', 'The Spring Security filter chain', 'Chuỗi filter của Spring Security',
      'Thêm starter: người dùng tự sinh, 16 filter, curl 401 / trình duyệt 302; POST đúng mật khẩu vẫn 401 vì CsrfFilter đứng trước BasicAuthenticationFilter và /error bị bảo vệ; SecurityFilterChain tự khai, filter riêng trong chuỗi, FACTOR_PASSWORD của Security 7; ba bẫy (CSRF, filter là @Bean chạy hai lần, anyRequest đứng trước); WebSecurityConfigurerAdapter không còn; CVE-2022-22978.',
      L91_EN + L91_VI),
    L(2, 'sb-9-2-password-encoder', 'Password hashing with PasswordEncoder', 'Băm mật khẩu với PasswordEncoder',
      'BCrypt cost 4–14 đo bằng ms, muối nằm trong chuỗi hash, SHA-256 nhanh hơn BCrypt 836.124 lần, DelegatingPasswordEncoder và upgradeEncoding, PBKDF2/SCrypt/Argon2, giới hạn 72 byte (Okta 2024), đăng nhập ngây thơ lộ tên qua thời gian 3 ms vs 62 ms; RockYou 2009, LinkedIn 2012; hash bcryptjs của Node dùng được trong Spring.',
      L92_EN + L92_VI),
    L(3, 'sb-9-3-dang-nhap-jwt', 'Login and issuing JWTs', 'Đăng nhập và phát JWT',
      'UserDetailsService + DaoAuthenticationProvider (constructor của Security 7), đăng ký chặn "role":"ADMIN", /auth/login phát JWT HS256 bằng NimbusJwtEncoder, tháo rời token, Node kiểm chữ ký bằng crypto, bí mật 16 byte ⇒ KeyLengthException hiện thành 401, bẫy R_PASSWORD, RS256 với kid; alg none 2015.',
      L93_EN + L93_VI),
    L(4, 'sb-9-4-jwt-filter', 'Verifying JWTs on every request', 'Kiểm JWT trên mọi request',
      'oauth2ResourceServer().jwt(): 13 filter của một request, BearerTokenAuthenticationFilter thứ 7, SecurityContext theo luồng; năm token giả (sửa payload, alg none, khoá lạ, rác, thiếu quyền) ⇒ invalid_token / insufficient_scope; token hết hạn vẫn chạy vì clock skew 60 giây; Psychic Signatures CVE-2022-21449.',
      L94_EN + L94_VI),
    L(5, 'sb-9-5-refresh-token', 'Refresh tokens and logout', 'Refresh token và đăng xuất',
      'Refresh token ngẫu nhiên 256 bit chỉ lưu SHA-256, xoay vòng mỗi lần dùng, dùng lại token cũ ⇒ thu hồi cả họ (kẻ trộm và chủ đều 401), ném exception trong giao dịch làm mất lệnh thu hồi (đã đo), không xoay ⇒ kẻ trộm dùng mãi; cookie HttpOnly/SameSite; access token vẫn 200 sau đăng xuất; GitHub OAuth token 2022.',
      L95_EN + L95_VI),
    L(6, 'sb-9-6-phan-quyen-role', 'Roles and method-level authorization', 'Vai trò và phân quyền cấp phương thức',
      'Converter roles ⇒ ROLE_, hasRole vs hasAuthority đo thật, converter mặc định làm ADMIN 403; @EnableMethodSecurity + @PreAuthorize với bean kiểm chủ; chủ lượt đặt lấy từ token; IDOR /v0 cho binh huỷ lượt đặt của lan; 403 cho id không tồn tại; USPS 2018.',
      L96_EN + L96_VI),
    L(7, 'sb-9-7-lab-9', 'Chapter 9 lab + interview questions', 'Lab chương 9 + câu hỏi phỏng vấn',
      'Đăng ký/đăng nhập/refresh/phân quyền cho LabFlow trên lời giải Lab 8: bộ chấm 10 mục qua HTTP (khởi đầu 0/10, lời giải 10/10 ×3); ba lối tắt: tin studentCode trong body 8/10, không xoay refresh 9/10, converter mặc định 9/10; thang 10 điểm, câu phỏng vấn chương 9.',
      L97_EN + L97_VI),
    {
      title: '9.8 — Chapter 9 quiz|||9.8 — Kiểm tra chương 9',
      slug: 'sb-9-8-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về chuỗi filter và /error bị bảo vệ, filter là @Bean, cost BCrypt, dò tên qua thời gian, payload JWT, bí mật quá ngắn, clock skew, xoay vòng refresh token, converter mặc định và IDOR.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Every answer is something you saw run in this chapter — a POST that came back 401, a filter that printed twice, 3 ms against 62 ms, a token that outlived its expiry, an ADMIN refused by a prefix. If you miss one, rerun that lesson's experiment and read the output again.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Đáp án nào cũng là điều bạn đã thấy chạy trong chương — một lệnh POST quay về 401, một filter in hai lần, 3 ms so với 62 ms, một token sống quá hạn, một ADMIN bị từ chối vì một tiền tố. Sai câu nào thì chạy lại thí nghiệm của bài đó và đọc lại output.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ9 },
    },
  ],
};
