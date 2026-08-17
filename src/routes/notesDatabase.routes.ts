/**
 * Notes Databases (Phase 5) — REST surface.
 *
 * Mounted at /api/v1/notes-databases. Every handler delegates authorization to
 * the service, which resolves the parent subject's share; nothing here trusts
 * a client-supplied role.
 */

import { Router, type Response } from 'express';
import { authenticate } from '../middleware/auth.js';
import type { ApiResponse } from '../types/index.js';
import {
  createDatabase,
  createProperty,
  createRow,
  createView,
  deleteDatabase,
  deleteProperty,
  deleteRow,
  deleteView,
  getDatabase,
  listDatabasePeople,
  listRelationOptions,
  setRowRelations,
  listDatabases,
  reorderProperties,
  reorderRows,
  updateDatabase,
  updateProperty,
  updateRow,
  updateView,
} from '../services/notesDatabase.service.js';
import { createTaskWorkspace, listMyTasks } from '../services/noteTaskWorkspace.js';
import { applyTemplate, listTemplates } from '../services/noteDatabaseTemplates.js';

const router = Router();
router.use(authenticate);

// ─── Databases ────────────────────────────────────────────────

// ─── Bộ khung quản lý công việc ───────────────────────────────
// Khai báo TRƯỚC '/:databaseId' để chuỗi 'my-tasks' không bị nuốt thành id.

router.get('/my-tasks', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const data = await listMyTasks(req.user.userId);
    res.json({ success: true, data });
  } catch (error) { next(error); }
});

router.get('/templates', async (_req: any, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: listTemplates() });
  } catch (error) { next(error); }
});

router.post('/templates/:key', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const data = await applyTemplate(req.user.userId, Number(req.body?.subjectId), String(req.params.key));
    res.status(201).json({ success: true, data });
  } catch (error) { next(error); }
});

router.post('/task-workspace', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const data = await createTaskWorkspace(req.user.userId, Number(req.body?.subjectId));
    res.status(201).json({ success: true, data });
  } catch (error) { next(error); }
});

router.get('/subject/:subjectId', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const data = await listDatabases(req.user.userId, Number(req.params.subjectId));
    res.json({ success: true, data });
  } catch (error) { next(error); }
});

router.post('/', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const data = await createDatabase(req.user.userId, req.body ?? {});
    res.status(201).json({ success: true, data });
  } catch (error) { next(error); }
});

// ─── Rows, properties and views ───────────────────────────────
// Declared before '/:databaseId' so those literal segments are not swallowed
// by the parameterised route.

router.get('/properties/:propertyId/relation-options', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const data = await listRelationOptions(req.user.userId, Number(req.params.propertyId), req.query.q as string | undefined);
    res.json({ success: true, data });
  } catch (error) { next(error); }
});

router.put('/rows/:rowId/relations/:propertyId', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const data = await setRowRelations(req.user.userId, Number(req.params.rowId), Number(req.params.propertyId), req.body?.targetRowIds);
    res.json({ success: true, data });
  } catch (error) { next(error); }
});

router.get('/:databaseId/people', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const data = await listDatabasePeople(req.user.userId, Number(req.params.databaseId));
    res.json({ success: true, data });
  } catch (error) { next(error); }
});

router.post('/:databaseId/properties', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const data = await createProperty(req.user.userId, Number(req.params.databaseId), req.body ?? {});
    res.status(201).json({ success: true, data });
  } catch (error) { next(error); }
});

router.patch('/:databaseId/properties/reorder', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const data = await reorderProperties(req.user.userId, Number(req.params.databaseId), req.body?.orderedIds);
    res.json({ success: true, data });
  } catch (error) { next(error); }
});

router.post('/:databaseId/rows', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const data = await createRow(req.user.userId, Number(req.params.databaseId), req.body ?? {});
    res.status(201).json({ success: true, data });
  } catch (error) { next(error); }
});

router.patch('/:databaseId/rows/reorder', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const data = await reorderRows(req.user.userId, Number(req.params.databaseId), req.body?.orderedIds);
    res.json({ success: true, data });
  } catch (error) { next(error); }
});

router.post('/:databaseId/views', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const data = await createView(req.user.userId, Number(req.params.databaseId), req.body ?? {});
    res.status(201).json({ success: true, data });
  } catch (error) { next(error); }
});

// ─── Single-entity routes (id is globally unique per table) ───

router.patch('/properties/:propertyId', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const data = await updateProperty(req.user.userId, Number(req.params.propertyId), req.body ?? {});
    res.json({ success: true, data });
  } catch (error) { next(error); }
});

router.delete('/properties/:propertyId', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const data = await deleteProperty(req.user.userId, Number(req.params.propertyId));
    res.json({ success: true, data });
  } catch (error) { next(error); }
});

router.patch('/rows/:rowId', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const data = await updateRow(req.user.userId, Number(req.params.rowId), req.body?.values);
    res.json({ success: true, data });
  } catch (error) { next(error); }
});

router.delete('/rows/:rowId', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const data = await deleteRow(req.user.userId, Number(req.params.rowId));
    res.json({ success: true, data });
  } catch (error) { next(error); }
});

router.patch('/views/:viewId', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const data = await updateView(req.user.userId, Number(req.params.viewId), req.body ?? {});
    res.json({ success: true, data });
  } catch (error) { next(error); }
});

router.delete('/views/:viewId', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const data = await deleteView(req.user.userId, Number(req.params.viewId));
    res.json({ success: true, data });
  } catch (error) { next(error); }
});

// ─── Parameterised database routes last ───────────────────────

router.get('/:databaseId', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const data = await getDatabase(req.user.userId, Number(req.params.databaseId));
    res.json({ success: true, data });
  } catch (error) { next(error); }
});

router.patch('/:databaseId', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const data = await updateDatabase(req.user.userId, Number(req.params.databaseId), req.body ?? {});
    res.json({ success: true, data });
  } catch (error) { next(error); }
});

router.delete('/:databaseId', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const data = await deleteDatabase(req.user.userId, Number(req.params.databaseId));
    res.json({ success: true, data });
  } catch (error) { next(error); }
});

export default router;
