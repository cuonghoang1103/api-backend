// Bài 5.5 — đọc explain của một aggregation pipeline cho gọn (khoá MongoDB, cuongthai.com).
// Dùng trong mongosh:  load('/demo/ke-pipeline.js'); ke(db.don, [ ...pipeline... ])
// In: các stage còn lại SAU khi bộ tối ưu sắp xếp lại, chuỗi kế hoạch phần đọc dữ liệu (đọc từ dưới lên),
// index được dùng, số khoá / tài liệu đã xem, số trả về, thời gian, và có tràn đĩa không.
function ke(coll, pipeline, opts = {}) {
  const x = coll.explain('executionStats').aggregate(pipeline, opts);
  const c = x.stages ? x.stages[0].$cursor : x;              // pipeline đẩy hết xuống tầng truy vấn thì không có "stages"
  const plan = c.queryPlanner.winningPlan.queryPlan || c.queryPlanner.winningPlan;
  const chuoi = []; let ix;
  const di = (p) => { if (!p) return; chuoi.push(p.stage); ix = ix || p.indexName; di(p.inputStage); (p.inputStages || []).forEach(di); };
  di(plan);
  const e = c.executionStats;
  const tran = (x.stages || []).some((s) => s.usedDisk || (s.spills > 0)) || JSON.stringify(e).includes('"usedDisk":true');
  return {
    stageConLai: x.stages ? x.stages.map((s) => Object.keys(s).find((k) => k.startsWith('$'))) : ['(đẩy hết xuống tầng truy vấn)'],
    keHoach: chuoi.join(' ← '), index: ix || '—',
    keys: e.totalKeysExamined, docs: e.totalDocsExamined, n: e.nReturned, ms: e.executionTimeMillis, tranDia: tran,
  };
}
