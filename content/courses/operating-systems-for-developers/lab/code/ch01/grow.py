# grow.py — cứ 50 MB một lần, không bao giờ trả lại
chunks = []
while True:
    chunks.append(bytearray(50_000_000))
    print(f"holding {len(chunks) * 50} MB", flush=True)
