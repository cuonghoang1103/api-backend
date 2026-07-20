import fitz, os, sys, json
src=os.path.expanduser('~/Documents/Lab211')
for lab in ['J1.L.P0013','J1.L.P0014','J1.L.P0015']:
    pdf=[f for f in os.listdir(f'{src}/{lab}') if f.endswith('.pdf')][0]
    d=fitz.open(f'{src}/{lab}/{pdf}')
    txt='\n'.join(p.get_text() for p in d)
    nimg=sum(len(p.get_images(full=True)) for p in d)
    os.makedirs(f'out/media/{lab}', exist_ok=True)
    saved=0
    for pi,page in enumerate(d):
        for ii,info in enumerate(page.get_images(full=True)):
            xref=info[0]
            im=d.extract_image(xref)
            fn=f'out/media/{lab}/p{pi+1}_{ii+1}.{im["ext"]}'
            open(fn,'wb').write(im['image']); saved+=1
    open(f'out/{lab}.txt','w').write(txt)
    print(f'{lab}: {d.page_count} trang, {len(txt)} ký tự, {nimg} ảnh -> lưu {saved}')
