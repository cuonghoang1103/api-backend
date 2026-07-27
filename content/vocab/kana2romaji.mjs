// Kana -> romaji (wapuro/Hepburn-ish, matches existing DB style e.g. がっこう->gakkou, がくせい->gakusei)
const BASE = {
  'あ':'a','い':'i','う':'u','え':'e','お':'o',
  'か':'ka','き':'ki','く':'ku','け':'ke','こ':'ko',
  'が':'ga','ぎ':'gi','ぐ':'gu','げ':'ge','ご':'go',
  'さ':'sa','し':'shi','す':'su','せ':'se','そ':'so',
  'ざ':'za','じ':'ji','ず':'zu','ぜ':'ze','ぞ':'zo',
  'た':'ta','ち':'chi','つ':'tsu','て':'te','と':'to',
  'だ':'da','ぢ':'ji','づ':'zu','で':'de','ど':'do',
  'な':'na','に':'ni','ぬ':'nu','ね':'ne','の':'no',
  'は':'ha','ひ':'hi','ふ':'fu','へ':'he','ほ':'ho',
  'ば':'ba','び':'bi','ぶ':'bu','べ':'be','ぼ':'bo',
  'ぱ':'pa','ぴ':'pi','ぷ':'pu','ぺ':'pe','ぽ':'po',
  'ま':'ma','み':'mi','む':'mu','め':'me','も':'mo',
  'や':'ya','ゆ':'yu','よ':'yo',
  'ら':'ra','り':'ri','る':'ru','れ':'re','ろ':'ro',
  'わ':'wa','ゐ':'i','ゑ':'e','を':'o',
  'ん':'n',
  'ゔ':'vu',
};
const YOON = {
  'きゃ':'kya','きゅ':'kyu','きょ':'kyo',
  'ぎゃ':'gya','ぎゅ':'gyu','ぎょ':'gyo',
  'しゃ':'sha','しゅ':'shu','しょ':'sho',
  'じゃ':'ja','じゅ':'ju','じょ':'jo',
  'ちゃ':'cha','ちゅ':'chu','ちょ':'cho',
  'ぢゃ':'ja','ぢゅ':'ju','ぢょ':'jo',
  'にゃ':'nya','にゅ':'nyu','にょ':'nyo',
  'ひゃ':'hya','ひゅ':'hyu','ひょ':'hyo',
  'びゃ':'bya','びゅ':'byu','びょ':'byo',
  'ぴゃ':'pya','ぴゅ':'pyu','ぴょ':'pyo',
  'みゃ':'mya','みゅ':'myu','みょ':'myo',
  'りゃ':'rya','りゅ':'ryu','りょ':'ryo',
  // extended (loanword) digraphs
  'ふぁ':'fa','ふぃ':'fi','ふぇ':'fe','ふぉ':'fo',
  'てぃ':'ti','でぃ':'di','とぅ':'tu','どぅ':'du',
  'うぃ':'wi','うぇ':'we','うぉ':'wo',
  'ゔぁ':'va','ゔぃ':'vi','ゔぇ':'ve','ゔぉ':'vo',
  'じぇ':'je','ちぇ':'che','しぇ':'she',
  'つぁ':'tsa','つぃ':'tsi','つぇ':'tse','つぉ':'tso',
};
const SMALL_VOWELS = new Set(['ゃ','ゅ','ょ','ぁ','ぃ','ぅ','ぇ','ぉ']);

function toHiragana(s) {
  // katakana -> hiragana (unicode offset), keep ー and others
  return s.replace(/[ァ-ヶ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x60));
}

export function kanaToRomaji(input) {
  if (!input) return '';
  // strip decorations not part of reading
  const clean = input.replace(/[（）()～\/。.]/g, '');
  const s = toHiragana(clean);
  let out = '';
  let lastVowel = '';
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    const next = s[i + 1];
    if (c === 'ー') { out += lastVowel; continue; }
    if (c === 'っ') {
      const nn = s[i + 1];
      const nextRomaji = YOON[s.slice(i + 1, i + 3)] || BASE[nn];
      if (nextRomaji) {
        const firstLetter = nextRomaji[0] === 'c' ? 't' : nextRomaji[0]; // っち -> tchi
        out += firstLetter;
      }
      continue;
    }
    if (next && SMALL_VOWELS.has(next) && YOON[c + next]) {
      const r = YOON[c + next];
      out += r;
      lastVowel = r[r.length - 1];
      i++; // consume next
      continue;
    }
    if (BASE[c]) {
      const r = BASE[c];
      out += r;
      lastVowel = r[r.length - 1];
      continue;
    }
    // unknown char (e.g. latin letters like ATM), pass through lowercase
    out += c.toLowerCase();
    lastVowel = '';
  }
  return out;
}
