import kit, algo_ref, collections
algo_ref.build()
n=kit.dump('blocks_algo.json'); j=kit.dump_java('java_algo.json')
print('khối:',n,'| java:',j,'|',dict(collections.Counter(b['type'] for b in kit.BLOCKS)))
