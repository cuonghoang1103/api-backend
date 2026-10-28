# @ Chương 16 — đối chiếu lần hai bằng bộ máy mô phỏng /os-lab (frontend/src/components/os-lab/engine gắn chỉ-đọc ở /engine).
node --experimental-strip-types kiem-engine.mts 2>&1 | grep -v ExperimentalWarning | tail -12
