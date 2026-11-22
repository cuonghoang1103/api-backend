ls -lh web/
head -n 2 web/access.log | cut -c1-90
tail -n 2 web/access.log | cut -c1-90
sed -n '2000,2001p' web/access.log | cut -c1-90
zcat web/access.log.1.gz | wc -l
zgrep -c ' 404 ' web/access.log.1.gz
zcat -f web/access.log web/access.log.1.gz | wc -l
