# Tra 3 byte đầu (OUI) trong sổ đăng ký CÔNG KHAI của IEEE (oui.csv, ~3,9 MB) — 14/11/2026, trên máy Mac.
curl -sL -o /tmp/oui.csv https://standards-oui.ieee.org/oui/oui.csv; wc -l < /tmp/oui.csv
grep -iE "^MA-L,(F4D488|5CA6E6)," /tmp/oui.csv | sed -E 's/^MA-L,([0-9A-F]{6}),("[^"]*"|[^,]*).*/\1  \2/'
grep -ciE "^MA-L,26DF5A," /tmp/oui.csv
grep -iE "^MA-L,(A483E7|8C8D28|E86A64)," /tmp/oui.csv | sed -E 's/^MA-L,([0-9A-F]{6}),("[^"]*"|[^,]*).*/\1  \2/'
