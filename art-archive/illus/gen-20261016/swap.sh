#!/bin/bash
# usage: swap.sh <cardId> <attemptN>
set -e
card="$1"; n="$2"
cd /workspace/illus/gen-20261016
python3 save_gen.py "$card" "$n"
cd /workspace/illus/out
test ! -e "${card}_superseded_torso.png"
mv "${card}.png" "${card}_superseded_torso.png"
cp "/workspace/illus/gen-20261016/${card}_g${n}.png" "${card}.png"
python3 -c "
from PIL import Image
im=Image.open('${card}.png'); print('OUT', '${card}.png', im.format, im.size, im.mode)
im2=Image.open('${card}_superseded_torso.png'); print('OLD', '${card}_superseded_torso.png', im2.format, im2.size)
"
