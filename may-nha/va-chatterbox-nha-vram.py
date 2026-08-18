import ast, sys, shutil, time
p = '/home/Cuong03dx/chatterbox/chatterbox_en.py'
shutil.copy2(p, f'{p}.bak2-{time.strftime("%Y%m%d-%H%M%S")}')
s = open(p).read()

cu = '''        with _nap_lock:
            if _m is None:
                continue
            _m = None
        _tra_bo_dem()'''
moi = '''        with _nap_lock:
            if _m is None:
                continue
            _m = None
            # `_conds_goc` la deepcopy cua `_m.conds` - cung la tensor GPU.
            # Bo `_m` ma giu no thi phan do khong bao gio ve.
            _conds_goc = None

        # ⚠️ `gc.collect()` PHAI CHAY TRUOC `empty_cache()`, KHONG DUOC BO.
        #
        # Do that 18/08/2026: bo `_m` xong, log in "da nha mo hinh" rat
        # thuyet phuc, ma `nvidia-smi` chi nha 66 MiB tren 2.714 - va
        # `/vram` van bao `dangDung_MB: 2367`. Tuc mo hinh VAN SONG.
        #
        # Vi `_ha_do_chinh_xac()` gan `m.prepare_conditionals = boc`, ma
        # `boc` la closure bat chinh `m`. Thanh vong: m -> boc -> m. Dem
        # tham chieu khong pha duoc vong, phai de bo don rac chu ky lam.
        # Va `empty_cache()` chi tra phan DA CHET - goi no khi mo hinh con
        # song thi khong tra duoc gi, nhung van in ra mot dong thanh cong.
        gc.collect()
        _tra_bo_dem()'''
assert cu in s, 'khong khop khoi cu'
s = s.replace(cu, moi, 1)

cu2 = '    global _m\n    while True:\n        time.sleep(30)'
assert cu2 in s, 'khong khop khai bao global'
s = s.replace(cu2, '    global _m, _conds_goc\n    while True:\n        time.sleep(30)', 1)

if 'import gc\n' not in s:
    s = s.replace('import json\n', 'import gc\nimport json\n', 1)
    assert 'import gc\n' in s, 'khong chen duoc import gc'

ast.parse(s)          # cu phap phai xanh TRUOC khi ghi de
open(p, 'w').write(s)
print('da va, cu phap XANH')
