// Q6 — bài làm ngây thơ
db.suat.updateMany({}, [{ $set: { soGheTrong: { $size: '$ghe' } } }]);
