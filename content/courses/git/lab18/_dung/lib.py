import re, html
import os
S=os.path.join(os.path.dirname(os.path.abspath(__file__)),'out')+'/'
def esc(t):
    t=t.replace('\\','\\\\')   # JS template literal nuốt \ đơn (đồ thị git có |\ )
    t=html.escape(t,quote=False)
    return t.replace('`','&#96;').replace('${','\\${').replace('\\','\\\\') if False else t.replace('`','&#96;').replace('${','$&#123;')
def load(name):
    return open(S+name+'.txt',encoding='utf8').read().split('\n')
CMD=re.compile(r'^\[(An|Binh|Chi)\] \$ (.*)$')
NAME={'An':'An','Binh':'Bình','Chi':'Chi'}
def T(name,start,end=None,drop=(),skip=(),maxout=None,nth=0):
    """Lấy các lệnh từ dòng lệnh chứa `start` tới trước dòng lệnh chứa `end` (hoặc hết).
    drop: tiền tố dòng output bị gộp thành một dòng '…'. skip: lệnh bị bỏ qua (nguyên văn)."""
    L=load(name); i=[k for k,l in enumerate(L) if CMD.match(l) and start in l][nth]
    j=len(L)
    if end:
        j=next(k for k in range(i+1,len(L)) if CMD.match(L[k]) and end in L[k])
    seg=[l for l in L[i:j] if not l.startswith('# ')]
    while seg and seg[-1]=='' : seg.pop()
    out=[]; cmds=[]; cur=None; outl=[]
    def flush_out():
        nonlocal outl
        if outl:
            # gộp dòng drop
            res=[]; skipping=False
            for o in outl:
                if any(o.startswith(d) for d in drop):
                    if not skipping: res.append('…'); skipping=True
                else: res.append(o); skipping=False
            if maxout and len(res)>maxout: res=res[:maxout]+['…']
            out.append('<div class="out">'+esc('\n'.join(res)).replace('&lt;LAB&gt;','/tmp/lab18')+'</div>')
            outl=[]
    def flush_cmds():
        nonlocal cmds
        if cmds:
            out.append('<pre><code class="language-bash">'+'\n'.join(cmds)+'</code></pre>'); cmds=[]
    for l in seg:
        m=CMD.match(l)
        if m:
            if outl: flush_cmds(); flush_out()
            if m.group(2) in skip: continue
            p=m.group(1)
            if p!=cur:
                cmds.append('<span class="tok-comment"># — '+NAME[p]+' —</span>'); cur=p
            cmds.append(esc(m.group(2)))
        else:
            outl.append(l)
    flush_cmds(); flush_out()
    return '\n'.join(out)
def link(href,ico,title,sub):
    return f'<a class="link-card" href="{href}" target="_blank" rel="noopener">\n  <span class="lc-ico">{ico}</span>\n  <span class="lc-body"><span class="lc-title">{title}</span><span class="lc-sub">{sub}</span></span>\n</a>'
