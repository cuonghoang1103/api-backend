import re, sys, zlib
data = open(sys.argv[1],'rb').read()
# 1) tách toàn bộ stream, giải nén FlateDecode
streams=[]
for m in re.finditer(rb'stream\r?\n', data):
    s=m.end(); e=data.find(b'endstream', s)
    if e<0: continue
    raw=data[s:e]
    try: streams.append(zlib.decompress(raw))
    except Exception: pass
print('streams giải nén được:', len(streams), file=sys.stderr)
# 2) gom toán tử hiển thị text
out=[]
for st in streams:
    if b'Tj' not in st and b'TJ' not in st: continue
    for m in re.finditer(rb'\((?:[^()\\]|\\.)*\)|<[0-9A-Fa-f\s]+>|TJ|Tj|Td|TD|T\*|ET', st):
        tok=m.group(0)
        if tok in (b'Td',b'TD',b'T*',b'ET'): out.append('\n')
        elif tok.startswith(b'('):
            s=tok[1:-1].decode('latin-1')
            s=re.sub(r'\\([()\\])', r'\1', s)
            out.append(s)
        elif tok.startswith(b'<'):
            hexs=re.sub(rb'\s',b'',tok[1:-1]).decode()
            if len(hexs)%4==0:
                out.append(''.join(chr(int(hexs[i:i+4],16)) for i in range(0,len(hexs),4)))
txt=''.join(out)
txt=re.sub(r'\n{3,}','\n\n',txt)
print(txt[:1500])
