import sys
from PIL import Image
src, dst = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGB')
assert im.size == (1584, 672), im.size
im.save(dst, format='PNG', optimize=True)
with open(dst,'rb') as f: sig=f.read(8)
assert sig == b'\x89PNG\r\n\x1a\n'
print('ok', dst, im.size)
