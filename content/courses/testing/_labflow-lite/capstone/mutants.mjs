// Twelve real bugs for US-11 "My bookings" (Chapter 11): used by scripts/cham-cuoi-khoa.mjs (the final grader)
// and scripts/ma-tran-bat-loi.mjs (which layer catches which bug). Each `from` appears exactly once in its file.
export const MUTANTS = [
  ['src/rules/cancel.js', 'if (!isAdmin && !canCancel(', 'if (!canCancel(', 'admins are refused inside the last hour too (AC6)'],
  ['src/rules/cancel.js', 'booking.userId !== user.id && !isAdmin', "booking.userId !== user.id && user.role === 'STUDENT'", "a lecturer can cancel anyone's booking (AC3)"],
  ['src/rules/cancel.js', "':00+07:00'", "':00Z'", 'start read as UTC: cancelling stays open 7 hours too long (Lite-3)'],
  ['src/booking/service.js', "b.status !== 'CANCELLED' && ", '', 'a cancelled slot stays blocked (AC5)'],
  ['src/booking/myBookings.js', 'const booking = await repo.cancel(id);', 'await repo.cancel(id);\n  const booking = await repo.findById(id);', 'two cancels at the same moment both succeed (AC4)'],
  ['db/schema.sql', "  ) WHERE (status <> 'CANCELLED')", '  )', 'PostgreSQL still blocks a cancelled slot (AC5)'],
  ['src/booking/pgRepo.js', "to_char(date, 'YYYY-MM-DD') AS date", 'date', 'dates come back from PostgreSQL as JS Dates (AC1)'],
  ['src/booking/pgRepo.js', "WHERE id = $1 AND status <> 'CANCELLED' RETURNING", 'WHERE id = $1 RETURNING', 'the cancel UPDATE is not atomic: both win (AC4)'],
  ['src/api/myBookings.js', 'listMyBookings(repo, req.user.id)', 'repo.list()', 'My bookings shows everyone’s bookings (AC1)'],
  ['src/api/myBookings.js', 'TOO_LATE_TO_CANCEL: 422', 'TOO_LATE_TO_CANCEL: 409', 'too late answered as 409, not 422 (AC2)'],
  ['web/MyBookings.jsx', 'disabled={busyId !== null}', 'disabled={busyId === b.id}', 'other rows stay clickable during a cancel'],
  ['web/api.js', "'/cancel')", "'/cancellation')", 'the screen calls a URL the API does not have'],
];
