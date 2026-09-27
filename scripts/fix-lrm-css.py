from pathlib import Path
p = Path("choppy-bitcoin/style.css")
s = p.read_text()
old = """.def-aa{\n  position:absolute;left:42px;bottom:154px;width:72px;height:72px;z-index:27;"""
new = """.def-aa{\n  position:absolute;left:50%;bottom:16px;width:76px;height:76px;z-index:27;\n  transform:translateX(-50%);"""
if old not in s:
    raise SystemExit("def-aa start not found")
s = s.replace(old, new, 1)
needle = ".def-aa.armed{"
insert = ".def-aa.charging{border-color:#ffe14a;box-shadow:0 0 0 3px rgba(255,225,74,.4), 0 6px 14px rgba(0,0,0,.45);}\n"
if ".def-aa.charging" not in s:
    s = s.replace(needle, insert + needle, 1)
p.write_text(s)
print("ok", p.stat().st_size)
