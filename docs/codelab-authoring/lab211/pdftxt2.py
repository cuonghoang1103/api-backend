import re, sys, zlib
def extract(path):
    data=open(path,'rb').read()
    streams=[]
    for m in re.finditer(rb'stream\r?\n', data):
        s=m.end(); e=data.find(b'endstream', s)
        if e<0: continue
        try: streams.append(zlib.decompress(data[s:e]))
        except Exception: pass
    out=[]
    TOK=rb'\((?:[^()\\]|\\.)*\)|<[0-9A-Fa-f\s]+>|(-?[\d.]+)\s+(-?[\d.]+)\s+(Td|TD)|T\*|ET|BT'
    for st in streams:
        if b'Tj' not in st and b'TJ' not in st: continue
        for m in re.finditer(TOK, st):
            tok=m.group(0)
            if m.group(3):                      # x y Td
                out.append('\n' if abs(float(m.group(2)))>0.01 else ' ')
            elif tok in (b'T*', b'ET', b'BT'):
                out.append('\n')
            elif tok.startswith(b'('):
                s=tok[1:-1].decode('latin-1')
                out.append(re.sub(r'\\([()\\])', r'\1', s))
            elif tok.startswith(b'<'):
                h=re.sub(rb'\s',b'',tok[1:-1]).decode()
                if len(h)%4==0:
                    out.append(''.join(chr(int(h[i:i+4],16)) for i in range(0,len(h),4)))
    txt=''.join(out)
    txt=re.sub(r'[ \t]+',' ',txt)
    txt=re.sub(r' *\n *','\n',txt)
    txt=re.sub(r'\n{3,}','\n\n',txt)
    return txt.strip()
if __name__=='__main__':
    t=extract(sys.argv[1]); print(f'--- {len(t)} ký tự ---'); print(t[:2200])
