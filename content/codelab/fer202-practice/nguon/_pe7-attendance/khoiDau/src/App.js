// src/App.js — Câu 1: cấu hình route bằng react-router-dom v6.
//   /subjects                                   ⇒ <SubjectList />     (Câu 1 — Subject List)
//   /subjects/:subjectId/attendance?classId=xxx ⇒ <BulkAttendance />  (Câu 2 — Bulk Attendance)
//   "/"                                         ⇒ chuyển hướng về /subjects
//
// Gợi ý: tạo src/pages/SubjectList.js và src/pages/BulkAttendance.js, rồi dựng <Routes> ở đây.
import React from 'react';

function App() {
  return (
    <div className="container mt-4">
      <h3>FER202 PE — TODO</h3>
      <p>Cấu hình router (Câu 1) rồi dựng hai trang Subject List và Bulk Attendance.</p>
    </div>
  );
}

export default App;
