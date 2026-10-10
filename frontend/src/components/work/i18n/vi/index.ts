import type { en as En } from '../en';
import type { Strings } from '../core';
import { common } from './common';
import { agents } from './agents';
import { ai } from './ai';
import { audit } from './audit';
import { backlog } from './backlog';
import { board } from './board';
import { chat } from './chat';
import { classroom } from './classroom';
import { contrib } from './contrib';
import { cover } from './cover';
import { collab } from './collab';
import { create } from './create';
import { desk } from './desk';
import { detail } from './detail';
import { dev } from './dev';
import { diagram } from './diagram';
import { docs } from './docs';
import { editor } from './editor';
import { errors } from './errors';
import { fields } from './fields';
import { finance } from './finance';
import { fpt } from './fpt';
import { git } from './git';
import { gov } from './gov';
import { home } from './home';
import { invite } from './invite';
import { issues } from './issues';
import { modup } from './modup';
import { notify } from './notify';
import { onboard } from './onboard';
import { palette } from './palette';
import { pchat } from './pchat';
import { pexport } from './pexport';
import { pimport } from './pimport';
import { releases } from './releases';
import { school } from './school';
import { settings } from './settings';
import { share } from './share';
import { shell } from './shell';
import { sprint } from './sprint';
import { srs } from './srs';
import { swr } from './swr';
import { status } from './status';
import { studio } from './studio';
import { teacher } from './teacher';
import { tests } from './tests';
import { time } from './time';
import { timeline } from './timeline';
import { trash } from './trash';
import { pboard } from './pboard';
import { pfields } from './pfields';
import { pspec } from './pspec';
import { ptypes } from './ptypes';
import { wf } from './wf';
import { pagents } from './pagents';
import { pstudio } from './pstudio';
import { auto } from './auto';
import { rep } from './rep';
import { portal } from './portal';
import { res } from './res';
import { pf } from './pf';
import { wl } from './wl';
import { gs } from './gs';
import { jql } from './jql';
import { dash } from './dash';
import { pages } from './pages';
import { uat } from './uat';
import { tpl } from './tpl';
import { nav } from './nav';
import { charts } from './charts'; // UX-B
import { meeting2 } from './meeting2';
import { elic } from './elic'; // CTW đợt 6b
import { srsx } from './srsx'; // CTW đợt 6b
import { table } from './table'; // UX-C
import { uxc } from './uxc'; // UX-C
import { q6 } from './q6'; // CTW đợt 6: chất lượng (review, baseline, test chuyên sâu)

/** Mọi miền và mọi khoá của bản tiếng Anh phải có ở đây (thiếu/thừa ⇒ lỗi tsc). */
export const vi: { [D in keyof typeof En]: Strings<(typeof En)[D]> } = { common, agents, ai, audit, backlog, board, chat, classroom, contrib, cover, collab, create, desk, detail, dev, diagram, docs, editor, errors, fields, finance, fpt, git, gov, home, invite, issues, modup, notify, onboard, palette, pchat, pexport, pimport, releases, school, settings, share, shell, sprint, srs, status, swr, studio, teacher, tests, time, timeline, trash, pboard, pfields, pspec, ptypes, wf, pagents, pstudio, auto, rep, portal, res, pf, wl, gs, jql, dash, pages, uat, tpl, nav, meeting2, elic, srsx, charts, table, uxc, q6 };
