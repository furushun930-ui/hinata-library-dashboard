#!/usr/bin/env python3
"""Google Forms CSV -> JSON array. No network/API keys required."""
import argparse, csv, json
from pathlib import Path
p=argparse.ArgumentParser()
p.add_argument('csv_file', help='Google Forms/Sheets CSV export')
p.add_argument('-o','--output',default='historical_responses_import.json')
a=p.parse_args()
source=Path(a.csv_file)
for enc in ('utf-8-sig','cp932','utf-8'):
    try:
        with source.open('r',encoding=enc,newline='') as f:
            rows=list(csv.DictReader(f))
        break
    except UnicodeDecodeError:
        continue
if not rows:
    raise SystemExit('CSVの回答行が見つかりません。ファイルと文字コードを確認してください。')
with open(a.output,'w',encoding='utf-8') as f:
    json.dump(rows,f,ensure_ascii=False,indent=2)
print(f'{len(rows)} rows -> {a.output}')
