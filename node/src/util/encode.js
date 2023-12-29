function toHex(s) {
  const h = [];
  for (let i = 0; i < s.length; i++) {
    const hexStr = s.charCodeAt(i).toString(16);
    h.push(parseInt(`0x${hexStr}`, 16));
  }

  return h;
}

function fromHex(h) {
  let s = "";
  for (let i = 0; i < h.length; i += 1) {
    hexNum = h[i];

    if (hexNum !== 0) s += String.fromCharCode(hexNum);
  }
  return decodeURIComponent(s);
}

module.exports = {
  toHex,
  fromHex,
};
