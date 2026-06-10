import re

with open('/tmp/upload_body.bin', 'rb') as f:
    body = f.read()

boundary = b'----FormBoundary7MA4YWxkTrZu0gW'
boundary_start = b'--' + boundary
boundary_end = b'--' + boundary + b'--'

print(f'Body length: {len(body)} bytes')

parts = []
pos = 0
while pos < len(body):
    b_idx = body.find(boundary_start, pos)
    if b_idx == -1:
        break

    p = b_idx + len(boundary_start)
    if body[p] == 0x0d and body[p+1] == 0x0a:
        p += 2

    next_b = body.find(boundary_start, p)
    end_b = body.find(boundary_end, p)
    if end_b != -1 and (next_b == -1 or end_b < next_b):
        next_b = end_b
    if next_b == -1:
        next_b = len(body)

    raw_part = body[p:next_b]

    if len(raw_part) >= 2:
        possible_boundary_start = next_b - 4
        if b_idx < possible_boundary_start and raw_part[-2] == 0x0d and raw_part[-1] == 0x0a:
            raw_part = raw_part[:-2]

    header_end = raw_part.find(b'\r\n\r\n')
    if header_end != -1:
        header_block = raw_part[:header_end].decode('utf8')
        body_data = raw_part[header_end + 4:]
    else:
        crlf = raw_part.find(b'\r\n')
        if crlf != -1:
            header_block = raw_part[:crlf].decode('utf8')
            body_data = raw_part[crlf + 2:]
        else:
            header_block = raw_part.decode('utf8')
            body_data = b''

    name_match = re.search(r'name="([^"]+)"', header_block)
    filename_match = re.search(r'filename="([^"]+)"', header_block)
    ct_match = re.search(r'Content-Type:\s*([^\r\n]+)', header_block, re.IGNORECASE)

    if name_match:
        fname = filename_match.group(1) if filename_match else None
        ctype = ct_match.group(1).strip() if ct_match else None
        print(f'  name={name_match.group(1)}, filename={fname}, ct={ctype}, bodyLen={len(body_data)}')
        parts.append({
            'name': name_match.group(1),
            'filename': fname,
            'contentType': ctype,
            'data': body_data
        })

    pos = next_b + len(boundary_start)

print(f'Total parts: {len(parts)}')
print('Part names:', [p['name'] + (f'({p["filename"]})' if p['filename'] else '') for p in parts])
