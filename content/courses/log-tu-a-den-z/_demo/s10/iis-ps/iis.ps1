$PSStyle.OutputRendering = 'PlainText'
$f = 'windows/u_ex261120.log'
$cols = ((Get-Content $f -TotalCount 10 | Where-Object { $_ -like '#Fields:*' }) -replace '^#Fields: ' -split ' ')
Get-Content $f | Where-Object { $_ -notlike '#*' } |
  ConvertFrom-Csv -Delimiter ' ' -Header $cols |
  Where-Object { [int]$_.'sc-status' -ge 500 } |
  Group-Object 'cs-uri-stem' | Sort-Object Count -Descending | Select-Object Count, Name
