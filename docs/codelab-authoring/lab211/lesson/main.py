#!/usr/bin/env python3
"""Assemble the bilingual LAB211 lesson and emit blocks + the javac worklist."""
import importlib, sys
import kit

PARTS = [
    'part1_intro', 'part2_core', 'part3_controlflow', 'part4_menu',
    'part5_validation', 'part6_collections', 'part7b_classbasics', 'part7_oop',
    'part8_algorithms', 'part8b_moresorts', 'part9_files', 'part11_defence',
]

for name in PARTS:
    importlib.import_module(name).build()

n = kit.dump('blocks.json')
j = kit.dump_java('java.json')
chars = 0
for b in kit.BLOCKS:
    for k in ('text', 'textVi', 'html', 'htmlVi', 'code', 'codeVi'):
        chars += len(b.get(k) or '')
import collections
print('khối:', n, '| ký tự:', chars, '| đoạn java cần biên dịch:', j)
print('theo loại:', dict(collections.Counter(b['type'] for b in kit.BLOCKS)))
