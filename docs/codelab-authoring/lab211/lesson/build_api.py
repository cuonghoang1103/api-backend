#!/usr/bin/env python3
"""Build the API-reference module on its own (separate lesson from the main one)."""
import kit, api_ref, collections
api_ref.build()
n = kit.dump('blocks_api.json'); j = kit.dump_java('java_api.json')
chars = sum(len(b.get(k) or '') for b in kit.BLOCKS for k in ('text','textVi','html','htmlVi','code','codeVi'))
print('khối:', n, '| ký tự:', chars, '| java:', j, '|', dict(collections.Counter(b['type'] for b in kit.BLOCKS)))
