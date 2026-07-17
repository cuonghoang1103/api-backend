// Size-optimized highlight.js: the core engine + ONLY the grammars EXP_Hub
// uses, instead of the full build (~190 languages, ~280KB). Shared by the
// admin CodeEditor and the SSR /exp-hub/[slug] page so the code shows real
// VSCode-style token colors without bloating the bundle.

import hljs from 'highlight.js/lib/core';

import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';
import sql from 'highlight.js/lib/languages/sql';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';
import yaml from 'highlight.js/lib/languages/yaml';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import go from 'highlight.js/lib/languages/go';
import rust from 'highlight.js/lib/languages/rust';
import php from 'highlight.js/lib/languages/php';
import ruby from 'highlight.js/lib/languages/ruby';
import csharp from 'highlight.js/lib/languages/csharp';
import cpp from 'highlight.js/lib/languages/cpp';
import c from 'highlight.js/lib/languages/c';
import kotlin from 'highlight.js/lib/languages/kotlin';
import swift from 'highlight.js/lib/languages/swift';
import dart from 'highlight.js/lib/languages/dart';
import markdown from 'highlight.js/lib/languages/markdown';
import powershell from 'highlight.js/lib/languages/powershell';
import dockerfile from 'highlight.js/lib/languages/dockerfile';
import nginx from 'highlight.js/lib/languages/nginx';
import ini from 'highlight.js/lib/languages/ini';
import properties from 'highlight.js/lib/languages/properties';
import groovy from 'highlight.js/lib/languages/groovy';
import graphql from 'highlight.js/lib/languages/graphql';

const REGISTER: Record<string, Parameters<typeof hljs.registerLanguage>[1]> = {
  javascript, typescript, python, java, sql, bash, json, yaml, xml, css, go,
  rust, php, ruby, csharp, cpp, c, kotlin, swift, dart, markdown, powershell,
  dockerfile, nginx, ini, properties, groovy, graphql,
};

for (const [name, lang] of Object.entries(REGISTER)) hljs.registerLanguage(name, lang);

// Aliases so our stored language ids resolve (html→xml, toml→ini, etc.).
hljs.registerAliases(['html', 'svg'], { languageName: 'xml' });
hljs.registerAliases(['toml'], { languageName: 'ini' });
hljs.registerAliases(['sh', 'zsh', 'shell'], { languageName: 'bash' });
hljs.registerAliases(['yml'], { languageName: 'yaml' });
hljs.registerAliases(['gql'], { languageName: 'graphql' });
hljs.registerAliases(['gradle'], { languageName: 'groovy' });

export default hljs;
