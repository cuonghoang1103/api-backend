// lib/views.js — PROVIDED by the practice grader. Small, faithful stand-ins for the two template engines of
// the lesson: EJS (<%= escaped %>, <%- raw %>, <% code %>, <%# comment %>, -%> and <%_ _%> trimming) and
// Handlebars ({{escaped}}, {{{raw}}}, {{#each}} with @index/@first/@last/this/../, {{#if}}/{{else}},
// {{#unless}}, {{#with}}, {{! comments }}, registerHelper). Same escaping rules as the real libraries.
(function (G) {
  'use strict';
  var MODS = G.__modules;

  /* ═══ EJS ═══ */
  var EJS_ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&#34;', "'": '&#39;' };
  function ejsEscape(v) { return v === undefined || v === null ? '' : String(v).replace(/[&<>"']/g, function (c) { return EJS_ESC[c]; }); }
  function ejsCompile(tpl) {
    var src = 'var __out = "";\nwith (locals || {}) {\n';
    var re = /<%([_=\-#]?)([\s\S]*?)([-_]?)%>/g;
    var last = 0; var m; var trimNext = false; var slurpNext = false;
    var text = function (t) {
      if (trimNext) { t = t.replace(/^\r?\n/, ''); trimNext = false; }
      if (slurpNext) { t = t.replace(/^[ \t]*\r?\n?/, ''); slurpNext = false; }
      if (t) src += '__out += ' + JSON.stringify(t) + ';\n';
    };
    while ((m = re.exec(tpl))) {
      var before = tpl.slice(last, m.index);
      if (m[1] === '_') before = before.replace(/[ \t]*$/, '');
      text(before);
      var code = m[2];
      if (m[1] === '=') src += '__out += __esc(' + code + ');\n';
      else if (m[1] === '-') src += '__out += ((' + code + ') == null ? "" : (' + code + '));\n';
      else if (m[1] === '#') { /* comment */ }
      else src += code + '\n';
      if (m[3] === '-') trimNext = true;
      if (m[3] === '_') slurpNext = true;
      last = re.lastIndex;
    }
    text(tpl.slice(last));
    src += '}\nreturn __out;';
    var fn = new Function('locals', '__esc', src); // eslint-disable-line no-new-func
    return function (data) { return fn(data || {}, ejsEscape); };
  }
  var ejs = { render: function (tpl, data) { return ejsCompile(String(tpl))(data); }, compile: function (tpl) { return ejsCompile(String(tpl)); }, escapeXML: ejsEscape };
  MODS.ejs = ejs;

  /* ═══ Handlebars ═══ */
  var HB_ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '`': '&#x60;', '=': '&#x3D;' };
  function SafeString(s) { this.string = s; }
  SafeString.prototype.toString = SafeString.prototype.toHTML = function () { return String(this.string); };
  function hbEscape(v) {
    if (v instanceof SafeString) return v.toString();
    if (v === undefined || v === null || v === false) return v === false ? 'false' : '';
    return String(v).replace(/[&<>"'`=]/g, function (c) { return HB_ESC[c]; });
  }
  var helpers = {};
  function parseHb(tpl) {
    var re = /\{\{(~?)(\{?)([#\/!>^]?)\s*([\s\S]*?)\s*(\}?)(~?)\}\}/g;
    var root = { kind: 'root', body: [] }; var stack = [root]; var last = 0; var m;
    var cur = function () { return stack[stack.length - 1]; };
    var push = function (n) { var c = cur(); (c.inElse ? c.elseBody : c.body).push(n); };
    while ((m = re.exec(tpl))) {
      if (m.index > last) push({ kind: 'text', v: tpl.slice(last, m.index) });
      last = re.lastIndex;
      var sigil = m[3]; var inner = m[4];
      if (sigil === '!' || /^!/.test(inner)) continue;
      if (sigil === '#') { var parts = inner.split(/\s+/); var node = { kind: 'block', name: parts[0], args: parts.slice(1), body: [], elseBody: [], inElse: false }; push(node); stack.push(node); continue; }
      if (sigil === '/') { if (cur().name !== inner) throw new Error(inner + " doesn't match " + cur().name); stack.pop(); continue; }
      if (sigil === '' && inner === 'else' && stack.length > 1) { cur().inElse = true; continue; }
      push({ kind: m[2] ? 'raw' : 'var', expr: inner });
    }
    if (last < tpl.length) push({ kind: 'text', v: tpl.slice(last) });
    if (stack.length > 1) throw new Error('Parse error: missing {{/' + cur().name + '}}');
    return root;
  }
  function lookup(expr, ctx) {
    if (expr === 'this' || expr === '.') return ctx.self;
    if (/^"[\s\S]*"$|^'[\s\S]*'$/.test(expr)) return expr.slice(1, -1);
    if (/^-?\d+(\.\d+)?$/.test(expr)) return Number(expr);
    if (expr === 'true') return true; if (expr === 'false') return false;
    if (expr.charAt(0) === '@') return ctx.data[expr.slice(1)];
    var c = ctx; var e = expr;
    while (e.indexOf('../') === 0) { c = c.parent || c; e = e.slice(3); }
    var parts = e.replace(/^this\./, '').split('.');
    var v = c.self;
    for (var i = 0; i < parts.length; i++) { if (v === undefined || v === null) return undefined; v = v[parts[i]]; }
    return v;
  }
  function truthy(v) { return !(v === undefined || v === null || v === false || v === '' || v === 0 || (Array.isArray(v) && v.length === 0)); }
  function callExpr(expr, ctx) {
    var parts = expr.match(/"[^"]*"|'[^']*'|\S+/g) || [];
    var name = parts[0];
    if (parts.length > 1 || helpers[name]) {
      var h = helpers[name];
      if (!h) throw new Error('Missing helper: "' + name + '"');
      return h.apply(ctx.self, parts.slice(1).map(function (a) { return lookup(a, ctx); }).concat([{ data: ctx.data, hash: {} }]));
    }
    return lookup(name, ctx);
  }
  function renderNodes(nodes, ctx) {
    return nodes.map(function (n) {
      if (n.kind === 'text') return n.v;
      if (n.kind === 'var') return hbEscape(callExpr(n.expr, ctx));
      if (n.kind === 'raw') { var r = callExpr(n.expr, ctx); return r === undefined || r === null ? '' : String(r); }
      var arg = n.args.length ? lookup(n.args[0], ctx) : undefined;
      if (n.name === 'if') return renderNodes(truthy(arg) ? n.body : n.elseBody, ctx);
      if (n.name === 'unless') return renderNodes(!truthy(arg) ? n.body : n.elseBody, ctx);
      if (n.name === 'with') return truthy(arg) ? renderNodes(n.body, { self: arg, parent: ctx, data: ctx.data }) : renderNodes(n.elseBody, ctx);
      if (n.name === 'each') {
        if (arg && typeof arg === 'object') {
          var keys = Array.isArray(arg) ? arg.map(function (x, i) { return i; }) : Object.keys(arg);
          if (!keys.length) return renderNodes(n.elseBody, ctx);
          return keys.map(function (k, i) { return renderNodes(n.body, { self: arg[k], parent: ctx, data: { index: i, key: k, first: i === 0, last: i === keys.length - 1, root: ctx.data.root } }); }).join('');
        }
        return renderNodes(n.elseBody, ctx);
      }
      var h = helpers[n.name];
      if (!h) throw new Error('Missing helper: "' + n.name + '"');
      return h.apply(ctx.self, n.args.map(function (a) { return lookup(a, ctx); }).concat([{ fn: function (c) { return renderNodes(n.body, { self: c, parent: ctx, data: ctx.data }); }, inverse: function (c) { return renderNodes(n.elseBody, { self: c, parent: ctx, data: ctx.data }); }, data: ctx.data, hash: {} }]));
    }).join('');
  }
  var Handlebars = {
    compile: function (tpl) { var ast = parseHb(String(tpl)); return function (data) { return renderNodes(ast.body, { self: data || {}, parent: null, data: { root: data } }); }; },
    registerHelper: function (name, fn) { helpers[name] = fn; },
    unregisterHelper: function (name) { delete helpers[name]; },
    SafeString: SafeString,
    escapeExpression: hbEscape,
  };
  MODS.handlebars = Handlebars; MODS.hbs = Handlebars; MODS['express-handlebars'] = { engine: function () { return function () {}; } };
})(globalThis);
