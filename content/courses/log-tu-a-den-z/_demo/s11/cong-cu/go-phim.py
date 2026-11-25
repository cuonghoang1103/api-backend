#!/usr/bin/env python3
# go-phim.py "<chuỗi>" — gõ chuỗi vào máy ảo win qua qemu monitor (sendkey), bàn phím US; in ra lệnh monitor cho socat.
import sys, time
M = {' ':'spc','-':'minus','.':'dot',';':'semicolon',"'":'apostrophe','\\':'backslash','/':'slash',',':'comma','=':'equal','[':'bracket_left',']':'bracket_right','`':'grave_accent'}
S = {':':'semicolon','"':'apostrophe','_':'minus','(':'9',')':'0','$':'4','|':'backslash','{':'bracket_left','}':'bracket_right','*':'8','@':'2','>':'dot','<':'comma','+':'equal','!':'1','&':'7','%':'5','#':'3','?':'slash','~':'grave_accent','^':'6'}
def k(c):
    if c.isalpha(): return ('shift-' if c.isupper() else '') + c.lower()
    if c.isdigit(): return c
    if c in M: return M[c]
    return 'shift-' + S[c]
for a in sys.argv[1:]:
    if a.startswith('@'): print('sendkey ' + a[1:]); print('', flush=True); continue
    for c in a: print('sendkey ' + k(c), flush=True)
