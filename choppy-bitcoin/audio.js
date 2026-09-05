(() => {
  let ctx = null;
  let musicInterval = null;
  let musicStep = 0;
  let jukeTimer = null;
  let jukeOn = false;
  let jukeGen = 0;
  let muteTheme = false;
  let muteSfx = false;
  let muteVoice = false;
  localStorage.setItem("choppy-mute-theme", "0");
  localStorage.setItem("choppy-mute-sfx", "0");
  localStorage.setItem("choppy-mute-voice", "0");

  window.ArcadeAudio = {
    unlock() {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!ctx) ctx = new AC({ latencyHint: "interactive" });
      if (ctx.state === "suspended") ctx.resume();
      if (window.speechSynthesis) {
        window.speechSynthesis.getVoices();
        pickVoice();
      }
    },
    sfx: {}, speak() {}, cancelSpeech() {}, startMusic() {}, stopMusic() {},
    muteTheme() { return muteTheme; },
    muteSfx() { return muteSfx; },
    muteVoice() { return muteVoice; },
    setMuteTheme(v) {
      muteTheme = !!v;
      localStorage.setItem("choppy-mute-theme", muteTheme ? "1" : "0");
      if (muteTheme && musicInterval != null) { /* keep clock, skip notes */ }
    },
    setMuteSfx(v) {
      muteSfx = !!v;
      localStorage.setItem("choppy-mute-sfx", muteSfx ? "1" : "0");
    },
    setMuteVoice(v) {
      muteVoice = !!v;
      localStorage.setItem("choppy-mute-voice", muteVoice ? "1" : "0");
      if (muteVoice && window.speechSynthesis) speechSynthesis.cancel();
    },
    jukePlay() {}, jukeStop() {}, jukePlaying() { return jukeOn; },
  };
  function bus() { if (!ctx || muteSfx) return null; return ctx; }
  function toneBus() { if (!ctx) return null; return ctx; }
  function beep(freq, dur, type, gain, slide, delay, ch) {
    ch = ch || "sfx";
    if (ch === "sfx" && muteSfx) return;
    if (ch === "theme" && muteTheme) return;
    const ac = toneBus();
    if (!ac) return;
    gain = gain == null ? 0.08 : gain; delay = delay || 0;
    const now = ac.currentTime + delay;
    const osc = ac.createOscillator(); const g = ac.createGain();
    osc.type = type; osc.frequency.setValueAtTime(Math.max(30, freq), now);
    if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, slide), now + dur);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(gain, now + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    osc.connect(g); g.connect(ac.destination); osc.start(now); osc.stop(now + dur + 0.02);
  }
  const A = window.ArcadeAudio;
  A.sfx = {
    start: () => beep(220, 0.12, "square", 0.05),
    buy: () => { beep(440, 0.08, "square", 0.06); beep(660, 0.12, "triangle", 0.04); },
    sell: () => { beep(330, 0.08, "square", 0.06); beep(220, 0.14, "triangle", 0.04); },
    jump: () => beep(420, 0.09, "square", 0.05, 280),
    coin: () => beep(880, 0.07, "triangle", 0.045),
    hit: () => beep(90, 0.16, "sawtooth", 0.07, 50),
    die: () => beep(160, 0.35, "sawtooth", 0.08, 40),
    wave: () => beep(520, 0.18, "triangle", 0.05),
    power: () => beep(480, 0.14, "triangle", 0.05),
    count: () => beep(392, 0.12, "sine", 0.05),
    go: () => beep(523, 0.18, "triangle", 0.06),
    cap: () => {
      beep(523.25, 0.16, "sine", 0.05, undefined, 0);
      beep(659.25, 0.16, "sine", 0.05, undefined, 0.14);
      beep(783.99, 0.16, "sine", 0.05, undefined, 0.28);
      beep(1046.5, 0.42, "triangle", 0.06, undefined, 0.44);
    },
    iabud: () => {
      beep(1480, 0.05, "square", 0.035, 2100, 0);
      beep(2100, 0.07, "triangle", 0.04, 1320, 0.04);
      beep(880, 0.09, "sine", 0.03, 1760, 0.08);
    },
    boom: () => {
      const ac = bus();
      if (ac) {
        const now = ac.currentTime;
        const n = ac.createBuffer(1, Math.floor(ac.sampleRate * 0.62), ac.sampleRate);
        const d = n.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
        const src = ac.createBufferSource(); src.buffer = n;
        const f = ac.createBiquadFilter(); f.type = "lowpass";
        f.frequency.setValueAtTime(1800, now);
        f.frequency.exponentialRampToValueAtTime(40, now + 0.52);
        const g = ac.createGain();
        g.gain.setValueAtTime(0.58, now);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.58);
        src.connect(f); f.connect(g); g.connect(ac.destination); src.start(now);
      }
      beep(130, 0.32, "sawtooth", 0.2, 28);
      beep(55, 0.48, "square", 0.16, 18, 0.02);
      beep(38, 0.55, "sawtooth", 0.12, 16, 0.04);
    },
  };
  A.stopMusic = () => { if (musicInterval != null) { clearInterval(musicInterval); musicInterval = null; } };
  const BEAR = [98, 110, 87, 110, 73, 87, 65, 73];
  const BULL = [329, 392, 523, 659, 523, 659, 783, 1046];
  const IDLE = [146, 220, 293, 220, 164, 246, 329, 246];
  A.startMusic = (getPower, isPlaying) => {
    A.stopMusic(); musicStep = 0;
    musicInterval = setInterval(() => {
      if (!isPlaying()) return;
      if (muteTheme) { musicStep++; return; }
      const p = getPower();
      if (p === "BEAR") beep(BEAR[musicStep % 8], 0.22, "sawtooth", 0.06, null, 0, "theme");
      else if (p === "BULL") beep(BULL[musicStep % 8], 0.11, "square", 0.04, null, 0, "theme");
      else beep(IDLE[musicStep % 8], 0.18, "sine", 0.05, null, 0, "theme");
      musicStep++;
    }, 200);
  };


  const BONNY_ABC = `X:1
T:Bonny at Morn
C:Traditional Northumbrian
O:Northumberland
R:Slow air
M:3/4
L:1/8
Q:1/4=76
K:Em
%%MIDI program 73
E2 | "Em"B3 c BA | B2 E2 FG | "D"A3 G FE | D2 E2 F2 |
w: The sheep's in the mea-dows, the kye's in the corn,
w: The bird's in the nest,* the trout's in the burn,
w: We're all laid i-dle wi' keep-ing the bairn,
"Em"B3 c BA | B2 E2 FG | "D"A2 F2 D2 | "Em"E4 E2 |
w: Thou's ow-er lang in thy bed, bon-ny at morn.
w: Thou hin-ders thy mo-ther at ma-ny a turn.
w: The lad win-not work and the lass win-not lairn.
"Em"B3 c BA | B2 E2 FG | "D"A3 G FE | D2 E2 F2 |
w: Can-ny at night, bon-ny at morn, thou's ow-er lang
w: Can-ny at night, bon-ny at morn, thou's ow-er lang
w: Can-ny at night, bon-ny at morn, thou's ow-er lang
"Em"ED EF GA | B2 e2 d2 | "Bm"B d3 F2 | "Em"E6 |]
w: in thy bed, bon-ny at morn.
w: in thy bed, bon-ny at morn.
w: in thy bed, bon-ny at morn.`;

  function lyricsFromAbc(abc) {
    const inline = [];
    let take = true;
    String(abc || "").split(/\n/).forEach((l) => {
      if (/^w:/i.test(l)) {
        if (!take) return;
        const text = l.replace(/^w:\s*/i, "").replace(/[_*]/g, "").replace(/-/g, "").replace(/\s+/g, " ").trim();
        if (text) inline.push(text);
        take = false;
        return;
      }
      if (/^W:|^%%|^[XTCOMRLQKN]:/i.test(l) || !l.trim()) return;
      take = true;
    });
    const src = inline.length ? inline : String(abc || "").split(/\n/).map((l) => {
      const m = l.match(/^W:\s*(.*)$/);
      if (!m) return "";
      return m[1].replace(/[_*]/g, "").replace(/-/g, "").replace(/\s+/g, " ").trim();
    }).filter(Boolean);
    return src.map((text, i) => ({ p: src.length ? i / src.length : 0, text: text }));
  }

  function tune(id, title, genre, abc) {
    return { title: title, genre: genre, abc: abc, lyrics: lyricsFromAbc(abc) };
  }

  const SHADY_ABC = `X:1
T:Shady Grove
C:Traditional
O:Appalachia (Kentucky / North Carolina)
R:Play-party / air
M:4/4
L:1/8
Q:1/4=112
K:Edor
%%MIDI program 71
"Em"E2 G2 A2 B2 A2 G2 | "D"E2 D2 E4 E2 D2 |
w: Sha-dy Grove, my lit-tle love, Sha-dy Grove I
w: Cheeks as red as a bloom-ing rose, eyes of the
w: Went to see my Sha-dy Grove, she was stand-ing
w: Wish I had a big fine horse, corn to feed him
w: When I was a lit-tle boy I want-ed a
w: Peach-es in the sum-mer-time, ap-ples in the
"Em"E2 G2 A2 B2 A2 G2 | "D"A6 G2 |
w: say,
w: deep-est brown,
w: in the door,
w: on,
w: Bar-low knife,
w: fall,
"Em"E2 G2 A2 B2 A2 G2 | "D"E2 D2 E2 D2 |
w: Sha-dy Grove, my lit-tle love, I'm bound to
w: You are the dar-ling of my heart, stay till the
w: Shoes and stock-ings in her hand, lit-tle bare
w: Sha-dy Grove to stay at home, feed him when I'm
w: Now I want lit-tle Sha-dy Grove to say she'll
w: If I can't have lit-tle Sha-dy Grove I don't want
"Em"E2 G2 "D"F2 D2 "Em"E8 |]
w: go a-way.
w: sun goes down.
w: feet on the floor.
w: gone.
w: be my wife.
w: no gal at all.`;

  A.SONGS = {
    bonny: tune("bonny", "Bonny at Morn", "slow air", BONNY_ABC),
    shady: tune("shady", "Shady Grove", "play-party", SHADY_ABC),
    fisher: tune("fisher", "Fisher's Hornpipe", "hornpipe", `X:1
T:Fisher's Hornpipe
T:Hornpipe
C:James A. Fishar (London, 1778)
M:C|
L:1/8
Q:1/2=84
K:D
%%MIDI program 71
P:A
|: dc | "D"dAFA GBAG | FAFA GBAG | "D"FDFD "A"GEGE | "D"FDFD "A"E2 dc |
"D"dAFA GBAG | FAFA GBAG | "D"FAdf "A"gecA | "D"d2 d2 d2 :|
P:B
|: cd | "A"ecAc ecge | "D"fdAd fdaf | "A"ecAc ecgf | "A"edcB A2 A2 |
"G"BGDG BGdB | "D"AFDF AFdA | "G"BdcB "A"AGFE | "D"D2 D2 D2 :|`),
    hole: tune("hole", "Hole in the Wall", "hornpipe", `X:1
T:Hole in the Wall
C:Henry Purcell (1695)
O:England
R:Hornpipe
M:3/2
L:1/4
Q:1/2=84
K:G
%%MIDI program 71
P:A
|: "G"B>c B/c/d "D"Ad | "Em"G>A G/A/B "Bm"FB | "C"E>F E/F/G "G"DB | "Am"G2- "D"GF "G"G2 :|
P:B
"Em"g>f e/f/g "Am"fe | "B7"^d>e d/e/f Bf | "Em"g>f e/f/g "Am"fe | "B7"e2- e^d "Em"e2 |
"C"E>F E/F/G "D"F/G/A | "Em"G>A G/A/B "D"A/B/c | "G"B>c B/c/d "D"Dd | "Em"B2- "D"BA/B/ "G"G2 |]`),
    nightingale: tune("nightingale", "The Nightingale", "air", `X:1
T:The Nightingale
T:One Morning in May
C:Traditional
O:England / Appalachia
R:Air
M:4/4
L:1/8
Q:1/4=92
K:G
%%MIDI program 73
D2 |
"G"G2 G2 G2 B2 A2 G2 | "Em"E2 D2 E2 G2 "D"A2 D2 |
w: One morn-ing, one morn-ing, one morn-ing in May,
w: Good morn-ing, good morn-ing, good morn-ing to thee,
w: They had not been stand-ing but one hour or two,
w: Pret-ty la-dy, pret-ty la-dy, 'tis time to give o'er.
w: Pret-ty sol-dier, pret-ty sol-dier, will you mar-ry me?
w: I'll go back to Lon-don and stay there one year,
"G"G2 G2 G2 B2 A2 G2 | "Em"E2 D2 "D"D2 F2 "G"G2 D2 |
w: I met a fair coup-le a-mak-ing their way,
w: O where are you go-ing, my pret-ty la-dy?
w: When out of his knap-sack a fid-dle he drew.
w: O no, pret-ty sol-dier, please play one tune more.
w: O no, pret-ty la-dy, that nev-er can be;
w: And of-ten I'll think of you, my lit-tle dear;
"G"G2 G2 G2 B2 A2 G2 | "Em"E2 D2 E2 G2 "D"A2 D2 |
w: And one was a la-dy so neat and so fair,
w: O I'm go-ing a-walk-ing to the banks of the sea,
w: The tune that he played made the val-leys to ring.
w: I'd rath-er hear your fid-dle or the touch of one string,
w: I have a wife in Lon-don and chil-dren twice three;
w: If ev-er I re-turn, it will be in the spring,
"G"G2 G2 B2 A2 G2 E2 | "D"D2 G2 F2 A2 "G"G4 |]
w: The o-ther a sol-dier, a brave vo-lun-teer.
w: To see the wa-ters a-glid-ing, hear the night-in-gale sing.
w: O hear-ken, says the la-dy, how the night-in-gales sing.
w: Than see the wa-ters a-glid-ing, hear the night-in-gale sing.
w: Two wives in the ar-my's too man-y for me.
w: To see the wa-ters a-glid-ing, hear the night-in-gale sing.`),
    joeclark: tune("joeclark", "Old Joe Clark", "play-party", `X:1
T:Old Joe Clark
C:Traditional
O:Appalachia / American South
R:Breakdown / play-party
M:2/4
L:1/8
Q:1/4=120
K:Amix
%%MIDI program 71
P:A
|: "A"A2 A>B | c2 c>d | e2 d>c | "G"B2 A2 |
w: Old Joe Clark, the preach-er's son,
w: Once I lived on a moun-tain top,
w: Old Joe Clark he had a mule,
w: Old Joe Clark had a yel-low cat,
w: Old Joe Clark, he had a house
w: I went down to old Joe's house,
"A"A2 A>B | c2 c>d | e2 d>c | A4 :|
w: preached all o-ver the plain.
w: now I live in town.
w: his name was Mor-gan Brown,
w: she would nei-ther sing nor pray,
w: fif-teen stor-ies high,
w: he in-vit-ed me to sup-per.
P:B
|: "A"e2 e>f | g2 g>a | g2 f>e | "G"d2 c2 |
w: The on-ly text he ev-er knew
w: I'm stay-ing at a big ho-tel
w: And ev-ery tooth in that mule's head
w: She stuck her head in the but-ter-milk jar
w: And ev-ery stor-y in that house
w: I stubbed my toe on the ta-ble leg
"A"A2 A>B | c2 c>d | "G"e2 d>c | "A"A4 :|
w: was High, Low, Jack and the game.
w: court-in' Bet-sy Brown.
w: was six-teen inch-es 'round.
w: and washed her sins a-way.
w: was filled with chick-en pie.
w: and stuck my nose in the but-ter.
P:C
|: "A"A2 A>B | c2 c>d | e2 d>c | "G"B2 A2 |
w: Fare thee well, Old Joe Clark,
w: Fare thee well, Old Joe Clark,
w: Fare thee well, Old Joe Clark,
w: Fare thee well, Old Joe Clark,
w: Fare thee well, Old Joe Clark,
w: Fare thee well, Old Joe Clark,
"A"A2 A>B | c2 c>d | e2 d>c | A4 :|
w: fare thee well, I say,
w: fare thee well, I say,
w: fare thee well, I say,
w: fare thee well, I say,
w: fare thee well, I say,
w: fare thee well, I say,
|: "A"e2 e>f | g2 g>a | g2 f>e | "G"d2 c2 |
w: Fare thee well, Old Joe Clark,
w: Fare thee well, Old Joe Clark,
w: Fare thee well, Old Joe Clark,
w: Fare thee well, Old Joe Clark,
w: Fare thee well, Old Joe Clark,
w: Fare thee well, Old Joe Clark,
"A"A2 A>B | c2 c>d | "G"e2 d>c | "A"A4 :|
w: I'm a-go-in' a-way.
w: I'm a-go-in' a-way.
w: I'm a-go-in' a-way.
w: I'm a-go-in' a-way.
w: I'm a-go-in' a-way.
w: I'm a-go-in' a-way.`),
    pigfoot: tune("pigfoot", "Shove the Pig's Foot a Little Further into the Fire", "reel", `X:1
T:Shove the Pig's Foot a Little Further into the Fire
T:Little Fiddle
C:Traditional
M:C|
L:1/8
Q:1/2=92
K:G
%%MIDI program 71
P:A
|: "G"BcBA G2 EF | GAGE "D"D4 | "G"DG G2 B3 c | "D"B2 A2 A4 |
"G"BcBA G2 EF | GAGE "D"D4 | "G"DG G2 B2 G2 | "D"A2 "G"G2 G4 :|
P:B
|: "G"Bd de d4 | edBc d2 BA | Bd d2 g3 d | "C"e2 "G"d2 d4 |
"G"Bd de d4 | edBc d2 g2 | B3 c BAGB | "D"A2 "G"G2 G4 :|`),
    cavalry: tune("cavalry", "Jine the Cavalry", "march", `X:1
T:Jine the Cavalry
C:Traditional (American Civil War)
O:Virginia, c.1862
R:March
M:6/8
L:1/8
Q:3/8=108
K:D
%%MIDI program 71
P:A
"D"d2 d dcd | e2 e e2 f | "G"g2 f e2 d | "A"c2 B A2 A |
w: We're the boys that rode a-round Mc-Clel-lan,
w: We're the boys that crossed the Po-to-mac,
w: Then we went in-to Penn-syl-van-ia,
w: Ol' Joe Hook-er, won't you come out of the Wil-der-ness,
"D"d2 d dcd | e2 e e2 f | "G"g2 f "A"edc | "D"d3 d2 A |
w: rode a-round Mc-Clel-lan, rode a-round Mc-Clel-lan,
w: crossed the Po-to-mac, crossed the Po-to-mac,
w: in-to Penn-syl-van-ia, in-to Penn-syl-van-ia,
w: come out of the Wil-der-ness, come out of the Wil-der-ness,
"D"d2 d dcd | e2 e e2 f | "G"g2 f e2 d | "A"c2 B A3 |
w: We're the boys that rode a-round Mc-Clel-lan,
w: We're the boys that crossed the Po-to-mac,
w: Then we went in-to Penn-syl-van-ia,
w: Ol' Joe Hook-er, won't you come out of the Wil-der-ness,
"D"f2 f "A"e2 e | "D"d3 d3 |]
w: Bul-ly boys, hey! Bul-ly boys, ho!
w: Bul-ly boys, hey! Bul-ly boys, ho!
w: Bul-ly boys, hey! Bul-ly boys, ho!
w: Bul-ly boys, hey! Bul-ly boys, ho!
P:B
"D"d2 d dcd | e2 e e2 f | "G"g2 f e2 d | "A"c2 B A2 A |
w: If you want to have a good time, jine the cav-al-ry!
w: If you want to have a good time, jine the cav-al-ry!
w: If you want to have a good time, jine the cav-al-ry!
w: If you want to have a good time, jine the cav-al-ry!
"D"f2 f fef | "G"g2 g g2 a | "D"f2 a f2 d | "A"e3 e2 A |
w: Jine the cav-al-ry! Jine the cav-al-ry!
w: Jine the cav-al-ry! Jine the cav-al-ry!
w: Jine the cav-al-ry! Jine the cav-al-ry!
w: Jine the cav-al-ry! Jine the cav-al-ry!
"D"d2 d dcd | e2 e e2 f | "G"g2 f e2 d | "A"c2 B A3 |
w: If you want to catch the Dev-il, if you want to have fun,
w: If you want to catch the Dev-il, if you want to have fun,
w: If you want to catch the Dev-il, if you want to have fun,
w: If you want to catch the Dev-il, if you want to have fun,
"D"g2 f "A"edc | "D"d3 d3 |]
w: If you want to smell Hell, jine the cav-al-ry!
w: If you want to smell Hell, jine the cav-al-ry!
w: If you want to smell Hell, jine the cav-al-ry!
w: If you want to smell Hell, jine the cav-al-ry!`),
    blueridge: tune("blueridge", "My Home's Across the Blue Ridge Mountains", "air", `X:1
T:My Home's Across the Blue Ridge Mountains
T:Smoky Tune
C:Traditional
O:Southern Appalachia
R:Air
M:4/4
L:1/8
Q:1/4=96
K:G
%%MIDI program 73
D2 |
"G"G2 G2 B2 AG B2 G2 | "G"D2 D2 G4 G2 D2 |
w: My home's a-cross the Blue Ridge Moun-tains,
w: How can I keep from cry-ing,
w: I'm leav-ing here this Mon-day morn-ing,
w: Good-bye, my lit-tle dar-ling,
w: Don't the road look rough and rock-y?
w: I thought I heard a freight train blow-ing,
"G"G2 G2 B2 AG B2 G2 | "D"A6 G2 D2 |
w: My home's a-cross the Blue Ridge Moun-tains,
w: How can I keep from cry-ing,
w: I'm leav-ing here this Mon-day morn-ing,
w: Good-bye, my lit-tle dar-ling,
w: Don't the road look rough and rock-y?
w: I thought I heard a freight train blow-ing,
"G"G2 G2 B2 AG B2 G2 | "G"D2 D2 G4 G2 D2 |
w: My home's a-cross the Blue Ridge Moun-tains,
w: How can I keep from cry-ing,
w: I'm leav-ing here this Mon-day morn-ing,
w: Good-bye, my lit-tle dar-ling,
w: Don't the road look rough and rock-y?
w: I thought I heard a freight train blow-ing,
"D"A2 B2 A2 F2 "G"G4 |]
w: I nev-er ex-pect to see you an-y more.
w: I nev-er ex-pect to see you an-y more.
w: I nev-er ex-pect to see you an-y more.
w: I nev-er ex-pect to see you an-y more.
w: I nev-er ex-pect to see you an-y more.
w: I nev-er ex-pect to hear it blown no more.`),
    campaign: tune("campaign", "Success to the Campaign", "reel", `X:1
T:Success to the Campaign
T:The Successful Campaign
C:Traditional
M:C|
L:1/8
Q:1/2=88
K:G
%%MIDI program 71
P:A
|: "G"G2 GB "D"A2 Ac | "G"BGBd g4 | gfed edcB | "C"cBAG "D"GFED |
"G"G2 GB "D"A2 Ac | "G"BGBd g4 | gfed "A"efge | "D"fde^c d4 :|
P:B
|: "D"d2 d=f e2 d2 | "C"c2 B2 c2 A2 | c2 ce d2 c2 | "G"B2 A2 B2 G2 |
"G"G2 GB "D"A2 Ac | "G"BGBd g4 | gfed edcB | "D"AGAB "G"G4 :|`),
    morelli: tune("morelli", "Morelli's Lesson", "march", `X:1
T:Morelli's Lesson
C:Traditional
M:C
L:1/8
Q:1/4=108
K:G
%%MIDI program 72
P:A
|: D2 | "G"G2 G>G GBAc | B2 B>B Bdce | dgfe dcBA | G2 G>G G2 dB |
G2 G>G GBAc | B2 B>B Bdce | dgfe dcBA | G2 G>G G2 :|
P:B
|: Bc | "G"d2 d>d dgfe | d2 d>d d2 Bc | dBGB dBGB | "D"cAFA cAFA |
"Em"BGEG BGEG | "D"A2 A>A AcBA | "G"G2 G>G GBAc | B2 B>B Bdce |
dgfe dcBA | G2 G>G G2 :|`),
    boston: tune("boston", "Road to Boston", "march", `X:1
T:Road to Boston
T:We are on the march to Boston
C:Traditional
M:2/4
L:1/8
Q:1/4=100
K:G
%%MIDI program 72
P:A
|: "G"B2 B A/B/ | cB AG | "D"FG AB | G/F/G/A/ GA |
"G"B2 B A/B/ | cB AG | "D"FG AB | "G"G2 G2 :|
P:B
|: "G"d2 d c/d/ | ed cB | "C"c2 c B/c/ | dc BA |
"G"B2 B A/B/ | cB AG | "D"FG A/c/B/A/ | "G"G2 G2 :|`),
    york: tune("york", "York Fusiliers", "march", `X:1
T:York Fusiliers
C:Traditional
M:2/4
L:1/8
Q:1/4=96
K:D
%%MIDI program 72
P:A
|: "D"D2 FA | de/f/ ge | fd cd | "A"e/d/c/B/ A/G/F/E/ |
"D"D2 FA | de/f/ ge | fd "A"c/d/e/c/ | "D"d4 :|
P:B
|: "A"fe e2 | "D"fa a2 | fa fd | "A"e/d/c/B/ A/B/c/d/ |
fe e2 | "D"fa a2 | fa fd | "A"e4 :|
P:C
|: "D"DA A2 | DB B2 | AB A/G/F/E/ | Dd cd |
DA A2 | DB B2 | AB A/G/F/E/ | "A"E2 "D"D2 :|
P:D
|: "D"A>G Fd | A>G Fd | "G"BA GF | "A"E/D/E/F/ E2 |
"D"A>G Fd | A>G Fd | "G"Bg "A"f/d/e/c/ | "D"d4 :|`),
    artillery: tune("artillery", "Washington's Artillery March", "march", `X:1
T:Washington's Artillery March
C:Traditional
M:2/4
L:1/8
Q:1/4=100
K:D
%%MIDI program 72
P:A
|: f/e/ | "D"dd AA | BB Ad | "A"c/d/e/f/ gf | f2 e f/e/ |
"D"dd AA | BB Ad | "A"c/d/e/f/ g/f/e/d/ | e2 "D"d :|
P:B
|: A | "D"AA A/A/A | dA/A/ Af | "G"gg "D"ff | f2 e A |
AA A/A/A | dA/A/ Ad | "A"c/d/e/f/ g/e/d/c/ | e2 "D"d :|
P:C
|: A | "D"dA fA | dA/d/ fA | dA df | d2 ff |
"G"ge ea/g/ | "D"fd dd | "A"c/d/e/f/ g/e/d/c/ | e2 "D"d :|`),
    misty: tune("misty", "One Misty Moisty Morning", "air", `X:1
T:One Misty Moisty Morning
T:The Wiltshire Wedding
C:Traditional
O:England
R:Air
M:6/8
L:1/8
Q:3/8=96
K:G
%%MIDI program 73
D |
"G"G2 G GAB | "C"c2 B A2 G | "D"F2 G A2 B | "G"G3 G2 D |
w: One mis-ty mois-ty morn-ing when cloud-y was the wea-ther,
w: This rus-tic was a thresh-er as on his way he hied,
w: I went a lit-tle fur-ther and there I met a maid,
w: This maid, her name was Dol-ly, clothed in a gown of grey,
w: I said that I would mar-ried be and she would be my bride,
"G"G2 G GAB | "C"c2 B A2 G | "D"F2 G A2 B | "G"G3 G2 B |
w: I met with an old man a-cloth-ed all in leath-er.
w: And with a leath-er bot-tle fast buck-led by his side.
w: A-go-ing a-milk-ing, a-milk-ing, sir, she said.
w: I be-ing some-what jol-ly, per-suad-ed her to stay.
w: And long we should not tar-ry, and twen-ty things be-side.
"G"d2 d d2 B | "C"c2 B A2 G | "D"F2 G A2 B | "Em"G3 G2 D |
w: He was cloth-ed all in leath-er with a cap be-neath his chin,
w: He wore no shirt up-on his back but wool un-to his skin,
w: Then I be-gan to com-pli-ment and she be-gan to sing,
w: And straight I fell a-court-ing her in hopes her love to win,
w: I'll plough and sow and reap and mow and you shall sit and spin,
"G"G2 B d2 B | "C"c2 A "D"F2 D | "G"G2 B "D"A2 F | "G"G3 G2 |]
w: Sing-ing, How do you do and how do you do and how do you do a-gain.
w: Sing-ing, How do you do and how do you do and how do you do a-gain.
w: Say-ing, How do you do and how do you do and how do you do a-gain.
w: Sing-ing, How do you do and how do you do and how do you do a-gain.
w: Sing-ing, How do you do and how do you do and how do you do a-gain.`),
    toarms: tune("toarms", "To Arms", "duty call", `X:1
T:To Arms
C:Traditional (camp duty)
M:2/4
L:1/8
Q:1/4=100
K:G
%%MIDI program 72
P:A
|: "G"d2 d>B | "C"e2 e>c | "G"d2 d>B | "D"A2 G2 :|
P:B
|: "G"B2 B>G | "C"c2 c>A | "G"d2 d>B | "D"A2 G2 :|`),
    reveille: tune("reveille", "The Reveille", "duty call", `X:1
T:The Reveille
T:The Three Camps
C:Traditional (camp duty)
M:2/4
L:1/8
Q:1/4=108
K:G
%%MIDI program 72
P:A
|: c | "G"B2 A2 | G3 g | "D"f2 e2 | d/^c/d/e/ d>=c | "G"B2 A2 | G3 g | "D"f2 e2 | d3 :|
P:B
|: d | "G"gd BA/G/ | "C"e3 d | c2 B2 | "D"A3 c | "G"B2 A2 | G2 g2 | B2 "D"cA | "G"G3 :|`),
    bird: tune("bird", "The Bird Song", "air", `X:1
T:The Bird Song
T:The Birds' Courting Song
C:Traditional
O:England / Appalachia / Vermont
R:Air
M:4/4
L:1/8
Q:1/4=92
K:G
%%MIDI program 73
D2 |
"G"G2 G2 A2 B2 c2 B2 | "D"A2 G2 B2 A2 G2 E2 |
w: Hi! says the black-bird, sit-ting on a chair,
w: Hi! says the blue-jay as she flew,
w: Hi! says the lit-tle leath-er-wing-ed bat,
w: Hi! says the lit-tle mourn-ing dove,
w: Hi! said the wood-peck-er sit-ting on a fence,
"G"D6 D2 G2 G2 | "D"A2 B2 c2 B2 A2 G2 |
w: Once I court-ed a la-dy fair;
w: If I was a young man I'd have two;
w: I will tell you the rea-son that,
w: I'll tell you how to gain her love;
w: Once I court-ed a hand-some wench;
"Em"B2 A2 G2 E2 D4 | "G"G2 G2 A2 B2 c2 B2 |
w: She proved fick-le and turned her back,
w: If one proved fick-le and chanced for to go,
w: The rea-son that I fly in the night
w: Court her night and court her day,
w: She proved fick-le and from me fled,
"D"A2 F2 "G"G6 |]
w: And ev-er since then I'm dressed in black.
w: I'd have a new string to my bow.
w: Is be-cause I lost my heart's de-light.
w: Nev-er give her time to say O nay.
w: And ev-er since then my head's been red.`),
  };
  A.JUKE_TIERS = [
    ["bonny", "shady", "fisher", "hole"],
    ["nightingale", "joeclark", "pigfoot", "cavalry"],
    ["blueridge", "campaign", "morelli", "boston"],
    ["york", "artillery", "misty", "toarms"],
    ["reveille", "bird"],
  ];
  A.JUKE_CORE = A.JUKE_TIERS.flat();
  A.jukePool = (tier) => {
    const n = Math.max(1, Math.min(A.JUKE_TIERS.length, tier || 1));
    return A.JUKE_TIERS.slice(0, n).flat();
  };
  A.jukeSize = () => A.JUKE_CORE.length;
  A.onJukeEnd = null;

  let abcVisual = null;
  let abcSynth = null;
  let abcPaused = false;
  let abcStart = 0;
  let abcElapsed = 0;
  let abcDur = 0;
  let abcWant = false;
  let abcId = "bonny";

  function abcLib() { return window.ABCJS || null; }
  function songAbc(id) {
    return (A.SONGS[id] && A.SONGS[id].abc) || BONNY_ABC;
  }
  function hiddenPaper() {
    let el = document.getElementById("abc-hold");
    if (!el) {
      el = document.createElement("div");
      el.id = "abc-hold";
      el.setAttribute("aria-hidden", "true");
      el.style.cssText = "position:absolute;left:-9999px;width:640px;height:1px;overflow:hidden;";
      document.body.appendChild(el);
    }
    return el;
  }
  function renderTune(id) {
    const lib = abcLib();
    if (!lib) return null;
    const el = hiddenPaper();
    el.innerHTML = "";
    try {
      const vis = lib.renderAbc("abc-hold", songAbc(id), { add_classes: false, staffwidth: 640, paddingtop: 1, paddingbottom: 1 });
      abcVisual = vis && vis[0] ? vis[0] : null;
      abcId = id;
      return abcVisual;
    } catch (err) {
      abcVisual = null;
      return null;
    }
  }

  function armJukeEnd(dur, gen) {
    if (jukeTimer != null) { clearTimeout(jukeTimer); jukeTimer = null; }
    const ms = Math.max(400, (dur || abcDur || 8) * 1000 + 120);
    const g = gen == null ? jukeGen : gen;
    jukeTimer = setTimeout(() => {
      jukeTimer = null;
      if (g !== jukeGen || !abcWant || abcPaused) return;
      jukeOn = false;
      abcElapsed = abcDur;
      if (typeof A.onJukeEnd === "function") A.onJukeEnd();
    }, ms);
  }

  function stopJukeTimer() {
    if (jukeTimer != null) { clearTimeout(jukeTimer); jukeTimer = null; }
    if (abcSynth && abcSynth.stop) try { abcSynth.stop(); } catch (e) {}
    jukeOn = false;
    abcPaused = false;
    abcWant = false;
    abcElapsed = 0;
    abcStart = 0;
  }
  A.jukeStop = () => stopJukeTimer();
  A.jukePlaying = () => jukeOn && !abcPaused;
  A.jukePaused = () => abcPaused;
  A.jukeProgress = () => {
    let t = abcElapsed;
    if (jukeOn && !abcPaused && ctx) t += Math.max(0, ctx.currentTime - abcStart);
    t = Math.max(0, Math.min(abcDur || t, t));
    return { t: t, dur: abcDur, pct: abcDur ? Math.min(1, t / abcDur) : 0 };
  };

  async function ensureSynth(id) {
    const lib = abcLib();
    if (!lib || !lib.synth || !lib.synth.supportsAudio()) return null;
    A.unlock();
    id = id || abcId || "bonny";
    if (!abcVisual || abcId !== id) renderTune(id);
    if (!abcVisual) return null;
    const synth = new lib.synth.CreateSynth();
    await synth.init({
      visualObj: abcVisual,
      audioContext: ctx,
      millisecondsPerMeasure: abcVisual.millisecondsPerMeasure ? abcVisual.millisecondsPerMeasure() : 1800
    });
    const primed = await synth.prime();
    abcDur = (primed && primed.duration) || synth.duration || 0;
    if (!abcDur && abcVisual.millisecondsPerMeasure) {
      const bars = (abcVisual.getTotalBeats && abcVisual.getTotalBeats()) || 32;
      abcDur = (abcVisual.millisecondsPerMeasure() * Math.max(8, bars / 3)) / 1000;
    }
    abcSynth = synth;
    return synth;
  }

  A.jukePlay = (id) => {
    A.unlock();
    abcWant = true;
    abcPaused = false;
    const gen = ++jukeGen;
    const run = async () => {
      try {
        if (abcSynth && abcSynth.stop) try { abcSynth.stop(); } catch (e) {}
        const synth = await ensureSynth(id || "bonny");
        if (!synth || !abcWant || gen !== jukeGen) return;
        jukeOn = true;
        abcElapsed = 0;
        abcStart = ctx ? ctx.currentTime : 0;
        armJukeEnd(abcDur, gen);
        const done = synth.start();
        if (done && typeof done.then === "function") {
          done.then(() => {
            if (gen !== jukeGen || !abcWant || abcPaused) return;
            if (jukeTimer != null) { clearTimeout(jukeTimer); jukeTimer = null; }
            jukeOn = false;
            abcElapsed = abcDur;
            if (typeof A.onJukeEnd === "function") A.onJukeEnd();
          });
        }
      } catch (err) {
        jukeOn = false;
      }
    };
    run();
  };

  A.jukePause = () => {
    if (!jukeOn || abcPaused) return;
    abcPaused = true;
    if (jukeTimer != null) { clearTimeout(jukeTimer); jukeTimer = null; }
    if (ctx) abcElapsed += Math.max(0, ctx.currentTime - abcStart);
    if (abcSynth && abcSynth.pause) try { abcSynth.pause(); } catch (e) {}
  };

  A.jukeResume = () => {
    if (!abcPaused) {
      if (!jukeOn) A.jukePlay(abcId || "bonny");
      return;
    }
    abcPaused = false;
    abcWant = true;
    jukeOn = true;
    abcStart = ctx ? ctx.currentTime : 0;
    armJukeEnd(Math.max(0.2, (abcDur || 0) - abcElapsed));
    if (abcSynth && abcSynth.resume) try { abcSynth.resume(); } catch (e) { A.jukePlay(abcId || "bonny"); }
  };

  A.SWAN = ["Black swan!","Cold storage lost!","Oh oh, Funds not SAFU!","Coldcard randomness!","China ban!","In before oceans evaporation!","You got F. T. X.'d!"];
  A.BULL = ["Bull market!","To the moon!","We are SO back!","Luke, I am your spammer","Bitcoin C.E.O. to increase prices","Going up forever Laura!"];
  A.LASER = ["Laser eyes!","Nothing stops this train","Conviction addiction","There is no second best","Stay humble stack Sats","Have fun staying poor!","Fix the money fix the world!","Unconfiscable power!","Do it for Scottie Pippen"];
  A.HALVE_SOON = ["Halving in sight!","Tick tock, next block"];
  A.BEAR = ["Bear market! Crash!","Quantum conundrum!","Bukele all-in ethereum","Bitcoin Depravement Proposals"];
  A.SELL = ["You are now a nocoiner","Bitcoin sold","Short it!","Exit all crypto markets"];
  A.BUY = ["Long it!","Bitcoin bought","All-in corn!"];
  A.HALVE_MISS = ["Halving aborted","The grinch stole the halving","Bitcoin C.E.O to cancel halving","Gary Gensler stole the halving","Oh no, Peter Schiff stole the halving","Faketoshi stole the halving","No halving soup for you!","Halving missed"];
  let cachedVoice = null;
  function scoreVoice(v) {
    const n = (v.name || "").toLowerCase();
    const lang = (v.lang || "").toLowerCase();
    if (lang.startsWith("es")) return -1000;
    if (n.includes("spanish") || n.includes("español") || n.includes("mexico") || n.includes("argentina")) return -1000;
    let s = 0;
    if (lang.startsWith("en")) s += 40;
    if (lang === "en-us" || lang === "en_us") s += 20;
    if (n.includes("fred")) s += 120;
    if (n.includes("ralph")) s += 90;
    if (n.includes("daniel")) s += 70;
    if (n.includes("alex")) s += 45;
    if (n.includes("google us english")) s += 85;
    if (n.includes("english united states") || n.includes("us english")) s += 70;
    if (n.includes("google uk english male")) s += 75;
    if (n.includes("microsoft david") || n.includes("microsoft mark")) s += 55;
    if (n.includes("samsung") && n.includes("english")) s += 50;
    if (n.includes("compact") || n.includes("novelty") || n.includes("robot") || n.includes("espeak")) s += 40;
    if (n.includes("male")) s += 10;
    if (n.includes("female") || n.includes("samantha") || n.includes("zira") || n.includes("karen")) s -= 25;
    return s;
  }
  function pickVoice() {
    if (!window.speechSynthesis) return cachedVoice;
    const voices = speechSynthesis.getVoices();
    if (!voices.length) return cachedVoice;
    const ranked = voices.slice().sort((a, b) => scoreVoice(b) - scoreVoice(a));
    const best = ranked[0] && scoreVoice(ranked[0]) > 0 ? ranked[0] : null;
    if (best) cachedVoice = best;
    return cachedVoice;
  }
  if (typeof speechSynthesis !== "undefined") {
    speechSynthesis.addEventListener("voiceschanged", pickVoice);
    pickVoice();
  }
  A.cancelSpeech = () => { if (window.speechSynthesis) speechSynthesis.cancel(); };
  A.speak = (line, urgent) => {
    if (muteVoice || !window.speechSynthesis) return;
    if (urgent) speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(line);
    u.lang = "en-US";
    u.rate = 0.78;
    u.pitch = 0.18;
    u.volume = 1;
    const v = pickVoice();
    if (v) { u.voice = v; u.lang = v.lang && v.lang.startsWith("en") ? v.lang : "en-US"; }
    speechSynthesis.speak(u);
  };
})();
