import sys, numpy as np
from PIL import Image, ImageDraw
# usage: measure.py img.png x0 y0 x1 y1 out.png  (crop region in full-res px containing coin + bitcoin)
img = Image.open(sys.argv[1]).convert('RGB')
x0,y0,x1,y1 = map(int, sys.argv[2:6]); out = sys.argv[6]
a = np.asarray(img).astype(int)
R,G,B = a[...,0],a[...,1],a[...,2]
sub = a[y0:y1, x0:x1]
r,g,b = sub[...,0],sub[...,1],sub[...,2]
white = (r>225)&(g>225)&(b>225)
orange = (r>190)&(g>100)&(g<215)&(b<120)&(r-b>120)
ys,xs = np.nonzero(white)
if len(xs):
    bx0,bx1,by0,by1 = xs.min(),xs.max(),ys.min(),ys.max()
    print('bitcoin bbox (crop coords):', bx0,bx1,by0,by1, 'center', (bx0+bx1)/2,(by0+by1)/2)
ys2,xs2 = np.nonzero(orange)
if len(xs2):
    print('orange bbox:', xs2.min(), xs2.max(), ys2.min(), ys2.max())
    # per-row widths
    widths=[]
    for y in range(sub.shape[0]):
        row = np.nonzero(orange[y])[0]
        if len(row)>5: widths.append((y,row.min(),row.max(),row.max()-row.min()))
    w = sorted(widths, key=lambda t:-t[3])[:1]
    print('widest orange row (y,left,right,width):', w)
im2 = img.crop((x0,y0,x1,y1)).resize(((x1-x0)*2,(y1-y0)*2))
d = ImageDraw.Draw(im2)
if len(xs):
    cx=(bx0+bx1)/2*2; cy=(by0+by1)/2*2
    d.line([(cx,0),(cx,im2.height)], fill=(0,255,255), width=1)
    d.line([(0,cy),(im2.width,cy)], fill=(0,255,255), width=1)
im2.save(out)
