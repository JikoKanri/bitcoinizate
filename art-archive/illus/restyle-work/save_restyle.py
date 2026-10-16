import sys, os, shutil
from PIL import Image
# usage: save_restyle.py "<downloaded filename in /home/box/Downloads>" <cardId> <attemptN>
src_name, card, n = sys.argv[1], sys.argv[2], sys.argv[3]
src = os.path.join('/home/box/Downloads', src_name)
im = Image.open(src)
print('src', src_name, im.format, im.size, im.mode)
im = im.convert('RGB')
out = f'/workspace/illus/restyle-work/restyle-attempts/{card}_a{n}.png'
os.makedirs(os.path.dirname(out), exist_ok=True)
im.save(out, format='PNG', optimize=False)
chk = Image.open(out)
print('saved', out, chk.format, chk.size, round(chk.size[0]/chk.size[1], 4))
shutil.move(src, f'/workspace/illus/restyle-work/restyle-attempts/orig_{card}_a{n}_' + src_name.replace(' ', '_'))
