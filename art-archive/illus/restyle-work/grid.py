import sys
from PIL import Image, ImageDraw, ImageFont
img=Image.open(sys.argv[1]).convert('RGB')
x0,y0,x1,y1=map(int,sys.argv[2:6]); out=sys.argv[6]; z=int(sys.argv[7]) if len(sys.argv)>7 else 2
c=img.crop((x0,y0,x1,y1)).resize(((x1-x0)*z,(y1-y0)*z), Image.LANCZOS)
d=ImageDraw.Draw(c)
for x in range((x0//20+1)*20, x1, 20):
    X=(x-x0)*z; d.line([(X,0),(X,c.height)], fill=(0,255,255) if x%100==0 else (0,120,255), width=1)
    if x%100==0: d.text((X+2,2), str(x), fill=(255,255,255))
for y in range((y0//20+1)*20, y1, 20):
    Y=(y-y0)*z; d.line([(0,Y),(c.width,Y)], fill=(255,0,255) if y%100==0 else (160,0,160), width=1)
    if y%100==0: d.text((2,Y+2), str(y), fill=(255,255,255))
c.save(out)
