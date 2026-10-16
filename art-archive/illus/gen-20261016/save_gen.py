import sys, os, glob, shutil
from PIL import Image
card, n = sys.argv[1], sys.argv[2]
exts = ['*.png','*.jpg','*.jpeg','*.webp']
cands = []
for e in exts: cands += glob.glob('/home/box/Downloads/' + e)
src = max(cands, key=os.path.getmtime)
im = Image.open(src)
print('src', os.path.basename(src), im.format, im.size, im.mode)
im = im.convert('RGB')
out = f'/workspace/illus/gen-20261016/{card}_g{n}.png'
im.save(out, format='PNG')
chk = Image.open(out); print('saved', out, chk.format, chk.size, round(chk.size[0]/chk.size[1], 3))
os.makedirs('/workspace/illus/gen-20261016/orig', exist_ok=True)
shutil.move(src, f'/workspace/illus/gen-20261016/orig/{card}_g{n}_' + os.path.basename(src))
