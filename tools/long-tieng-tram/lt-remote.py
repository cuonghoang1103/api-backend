#!/usr/bin/env python3
"""Phần chạy trên máy có GPU (máy nhà hoặc vast7) của trạm CT Lồng Tiếng — trạm gọi qua bash (cục bộ) hoặc ssh (vast7).
  tach <in.wav> <thư mục ra>                    Demucs htdemucs 2 phần: vocals.wav (giọng gốc) + no_vocals.wav (nhạc/hiệu ứng)
  nghe <vocals16.wav> <auto|zh|en> <ra.json>    faster-whisper large-v3 ⇒ đoạn lời có mốc giờ + mốc TỪNG TỪ (để tách đoạn > 8 s)
  nghe-vi <thư mục wav> <ra.json>               nghe lại bản đọc tiếng Việt (chấm điểm, như nghe-lo.py của video bài giảng)
Python chạy tệp này phải có demucs (tach) hoặc faster_whisper (nghe, nghe-vi). Biến LT_WHISPER_VI_MODEL đổi model nghe-vi (mặc định medium).
"""
import json, os, subprocess, sys

mode = sys.argv[1]


def nap_whisper(ten):
    from faster_whisper import WhisperModel
    try:
        m = WhisperModel(ten, device="cuda", compute_type="float16")
        import numpy as _np
        list(m.transcribe(_np.zeros(16000, dtype=_np.float32), language="vi")[0])  # lỗi thiếu cuDNN chỉ lộ lúc chạy
        return m
    except Exception as e:
        print(f"[lt-remote] GPU hỏng ({e}) ⇒ CPU", file=sys.stderr)
        return WhisperModel(ten, device="cpu", compute_type="int8", cpu_threads=4)


if mode == "tach":
    src, ra = sys.argv[2], sys.argv[3]
    subprocess.run([sys.executable, "-m", "demucs", "--two-stems=vocals", "-n", "htdemucs", "-o", ra, src], check=True)
elif mode == "nghe":
    src, lang, ra = sys.argv[2], sys.argv[3], sys.argv[4]
    m = nap_whisper("large-v3")
    goi_y = {"zh": "以下是普通话的句子，使用简体中文和标点。", "en": "The following is a technical explanation."}.get(lang)
    segs, info = m.transcribe(src, language=None if lang == "auto" else lang, vad_filter=True, beam_size=5,
                              initial_prompt=goi_y, condition_on_previous_text=False, word_timestamps=True)
    seg = []
    for s in segs:
        if not s.text.strip():
            continue
        w = [{"a": round(x.start, 3), "b": round(x.end, 3), "t": x.word.strip()} for x in (s.words or []) if x.word.strip()]
        seg.append({"a": round(s.start, 3), "b": round(s.end, 3), "t": s.text.strip(), "w": w})
    json.dump({"lang": info.language, "seg": seg}, open(ra, "w"), ensure_ascii=False)
    print(f"nghe xong: {info.language} · {len(seg)} đoạn")
elif mode == "nghe-vi":
    d, ra = sys.argv[2], sys.argv[3]
    m = nap_whisper(os.environ.get("LT_WHISPER_VI_MODEL", "medium"))
    kq = {}
    for f in sorted(os.listdir(d)):
        if not f.endswith(".wav"):
            continue
        segs, _ = m.transcribe(os.path.join(d, f), language="vi", beam_size=5, condition_on_previous_text=False)
        kq[f[:-4]] = {"text": " ".join(s.text.strip() for s in segs).strip()}
    json.dump(kq, open(ra, "w"), ensure_ascii=False)
    print(f"nghe-vi xong: {len(kq)} tệp")
else:
    sys.exit(f"không rõ lệnh {mode}")
