import sys, os, shutil
from PIL import Image
# usage: save_attempt.py "<downloaded filename>" <cardId> <attemptTag>
src_name, card, tag = sys.argv[1], sys.argv[2], sys.argv[3]
src = os.path.join('/home/box/Downloads', src_name)
im = Image.open(src)
print('src', src_name, im.format, im.size, im.mode)
im = im.convert('RGB')
out = f'/workspace/illus/restyle-work/{card}_{tag}.png'
im.save(out, format='PNG', optimize=False)
chk = Image.open(out)
print('saved', out, chk.format, chk.size, round(chk.size[0]/chk.size[1], 4))
shutil.copy(src, f'/workspace/illus/restyle-work/orig/{card}_{tag}_' + src_name.replace(' ', '_'))
