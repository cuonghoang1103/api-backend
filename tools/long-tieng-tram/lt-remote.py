#!/usr/bin/env python3
"""Phần chạy trên máy có GPU (máy nhà hoặc vast7) của trạm CT Lồng Tiếng — trạm gọi qua bash (cục bộ) hoặc ssh (vast7).
  tach <in.wav> <thư mục ra>                    Demucs htdemucs 2 phần: vocals.wav (giọng gốc) + no_vocals.wav (nhạc/hiệu ứng);
                                                video dài ⇒ tách từng đoạn LT_DEMUCS_DOAN_GIAY (900 s) rồi nối (đỡ RAM)
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


def demucs(vao, ra):
    subprocess.run([sys.executable, "-m", "demucs", "--two-stems=vocals", "-n", "htdemucs", "-o", ra, vao], check=True)


if mode == "tach":
    # Video dài (18/11/2026): Demucs nạp CẢ tệp vào RAM (3 giờ stereo 44,1 kHz float ≈ 3,8 GB, nhân vài lần khi xử lý)
    # ⇒ quá LT_DEMUCS_DOAN_GIAY×1,5 thì cắt đoạn (mặc định 15 phút, cắt PCM nên khớp từng mẫu), tách từng đoạn, nối lại
    # đúng chỗ trạm chờ: <ra>/htdemucs/<tên>/{vocals,no_vocals}.wav. Đoạn đã tách giữ lại ⇒ chạy lại thì làm tiếp.
    import shutil
    src, ra = sys.argv[2], sys.argv[3]
    doan = int(os.environ.get("LT_DEMUCS_DOAN_GIAY", "900"))
    dai = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", src],
                               capture_output=True, text=True, check=True).stdout.strip() or 0)
    if dai <= doan * 1.5:
        demucs(src, ra)
    else:
        ten = os.path.splitext(os.path.basename(src))[0]
        tam = os.path.join(ra, "_doan")
        os.makedirs(tam, exist_ok=True)
        if not any(f.startswith("p") and f.endswith(".wav") for f in os.listdir(tam)):
            subprocess.run(["ffmpeg", "-nostdin", "-loglevel", "error", "-y", "-i", src, "-f", "segment", "-segment_time", str(doan),
                            "-c", "copy", os.path.join(tam, "p%04d.wav")], check=True)
        phan = sorted(f for f in os.listdir(tam) if f.startswith("p") and f.endswith(".wav"))
        for k, f in enumerate(phan):
            if os.path.exists(os.path.join(tam, "out", "htdemucs", f[:-4], "no_vocals.wav")):
                continue
            print(f"[lt-remote] tách đoạn {k + 1}/{len(phan)}", file=sys.stderr)
            demucs(os.path.join(tam, f), os.path.join(tam, "out"))
        out = os.path.join(ra, "htdemucs", ten)
        os.makedirs(out, exist_ok=True)
        for stem in ("vocals", "no_vocals"):
            ds = os.path.join(tam, f"{stem}.txt")
            with open(ds, "w") as fh:
                for f in phan:
                    fh.write("file '" + os.path.join(tam, "out", "htdemucs", f[:-4], stem + ".wav").replace("'", "'\\''") + "'\n")
            subprocess.run(["ffmpeg", "-nostdin", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", ds, "-c", "copy",
                            os.path.join(out, stem + ".wav")], check=True)
        shutil.rmtree(tam, ignore_errors=True)
        print(f"tach xong: {len(phan)} đoạn × {doan}s")
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
