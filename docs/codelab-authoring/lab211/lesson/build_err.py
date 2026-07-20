import kit, error_ref, collections
error_ref.build()
n=kit.dump('blocks_err.json'); j=kit.dump_java('java_err.json')
print('khối:',n,'| java:',j,'|',dict(collections.Counter(b['type'] for b in kit.BLOCKS)))
