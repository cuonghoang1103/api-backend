#!/usr/bin/env bash
# Lab 10.7 — chấm: so vân tay từng đơn của lab10.orders hiện tại với đáp án do lab10-su-co.sh lưu. Mã thoát 0 = đạt.
set -uo pipefail
L=/tmp/mgo-lab10
docker exec mgo-lab mongosh --quiet lab10 --eval "db.orders.find().forEach(d => print(d._id + ' ' + require('crypto').createHash('md5').update(EJSON.stringify(d, { relaxed: false })).digest('hex')))" > $L/.hien-tai
read dung thieu thua lech < <(awk 'NR == FNR { da[$1] = $2; next } { ht[$1] = $2 }
  END { for (k in da) { if (!(k in ht)) t++; else if (da[k] == ht[k]) d++; else l++ } for (k in ht) if (!(k in da)) th++;
        print d + 0, t + 0, th + 0, l + 0 }' $L/.dap-an $L/.hien-tai)
echo "đúng $dung / $(wc -l < $L/.dap-an) đơn | thiếu $thieu | thừa $thua | sai nội dung $lech"
[ "$thieu$thua$lech" = 000 ] && echo "ĐẠT: không mất đơn nào, không đơn nào sai trạng thái" && exit 0
echo "CHƯA ĐẠT"; exit 1
