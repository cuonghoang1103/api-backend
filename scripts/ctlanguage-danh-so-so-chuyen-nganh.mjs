// Đánh lại thuTu mọi bộ "Tiếng Anh theo đề thi" theo học kỳ SE (giữ bộ nghề 1–8, chỉ sửa đúng dòng thuTu). Thêm môn mới ⇒ thêm mã vào THU. Xem so-chuyen-nganh/_KHUON.md.
import fs from 'node:fs'; import path from 'node:path';
const SO=new URL('../content/ctlanguage/so-chuyen-nganh/en', import.meta.url).pathname;
const THU=['doc-de-thi','csi104','prf192','mae101','cea201','ssl101c','pro192','lab211','mad101','osg202','nwc203c','nwc204','ssg104','csd201','csd203','dbi202','wed201c','iot102','prj301','mas291','swr302','swt301','swd392','swe201c','ite302c','wdu203c','fer202','sdn302','pmg201c','prm392','mma301','prn212','prn222','prn232','hsf302','sba301','pru213','enw492c','swp391','wdp301','exe101','exe201','sep490'];
const ds=fs.readdirSync(SO).filter(f=>f.endsWith('.json')).map(f=>f.slice(0,-5)).filter(m=>/^[a-z]{3}\d{3}[a-z]?-\d+$|^doc-de-thi/.test(m));
const mon=m=>m.startsWith('doc-de-thi')?'doc-de-thi':m.replace(/-\d+$/,'');
const so=m=>m==='doc-de-thi'?1:Number(m.match(/-(\d+)$/)[1]);
const la=ds.filter(m=>!THU.includes(mon(m)));if(la.length){console.error('Môn chưa có trong thứ tự:',la);process.exit(1)}
ds.sort((a,b)=>THU.indexOf(mon(a))-THU.indexOf(mon(b))||so(a)-so(b));
ds.forEach((m,i)=>{const f=path.join(SO,m+'.json');const raw=fs.readFileSync(f,'utf8');const d=JSON.parse(raw);const t=i-1000; // -1000, -999, …
 if(d.thuTu!==t){const moi=raw.replace(/("thuTu"\s*:\s*)-?\d+/,'$1'+t);if(moi===raw)throw new Error('không thay được thuTu '+m);fs.writeFileSync(f,moi)}});
console.log(ds.length,'bộ; đầu',ds[0],'cuối',ds.at(-1));
