import re,sys
sys.path.insert(0,'.')
from lib import *
src=open(sys.argv[1],encoding='utf8').read()
src=re.sub(r'@@I\((.*?)\)@@',lambda m:open(m.group(1),encoding='utf8').read(),src)
def rep(m):
    try:
        return eval('T('+m.group(1)+')')
    except Exception as e:
        sys.exit('LỖI T('+m.group(1)+'): '+repr(e))
out=re.sub(r'@@T\((.*?)\)@@',rep,src,flags=re.S)
open(sys.argv[2],'w',encoding='utf8').write(out)
