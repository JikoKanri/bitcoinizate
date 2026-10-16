import sys, numpy as np
from PIL import Image
# usage: coinmeasure.py img x0 y0 x1 y1  -> estimates coin circle (orange-gold widest row/col) and white B bbox center
img = np.asarray(Image.open(sys.argv[1]).convert('RGB')).astype(int)
x0,y0,x1,y1 = map(int, sys.argv[2:6])
sub = img[y0:y1, x0:x1]
r,g,b = sub[...,0], sub[...,1], sub[...,2]
orange = (r>200)&(g>110)&(g<215)&(b<140)&(r-b>110)
white = (r>235)&(g>235)&(b>235)
# coin extents: rows/cols with orange counts
rows = orange.sum(axis=1); cols = orange.sum(axis=0)
yy = np.nonzero(rows > 0.25*rows.max())[0]; xx = np.nonzero(cols > 0.25*cols.max())[0]
print('orange row-range (thick rows):', yy.min()+y0, yy.max()+y0, ' center_y~', (yy.min()+yy.max())/2+y0)
print('orange col-range (thick cols):', xx.min()+x0, xx.max()+x0, ' center_x~', (xx.min()+xx.max())/2+x0)
# B: white pixels inside the coin's core region
wy, wx = np.nonzero(white)
if len(wx):
    print('white bbox:', wx.min()+x0, wx.max()+x0, wy.min()+y0, wy.max()+y0, ' center', (wx.min()+wx.max())/2+x0, (wy.min()+wy.max())/2+y0)
