export const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('');

export const encode = (input, password) => {
  const outputArr = input.split('');
  const maxLen = Math.max(outputArr.length, password.length);
  for (let i = 0; i < maxLen; i++) {
    const inputPos = i % outputArr.length;
    const passwordPos = i % password.length;
    const charInputPos = chars.indexOf(outputArr[inputPos]);
    const charPasswordPos = chars.indexOf(password[passwordPos]);
    const charOutputPos = (charInputPos + charPasswordPos) % chars.length;
    outputArr[inputPos] = chars[charOutputPos];
  }
  return outputArr.join('');
};

export const decode = (output, password) => {
  const outputArr = output.split('');
  const maxLen = Math.max(outputArr.length, password.length);
  for (let i = 0; i < maxLen; i++) {
    const outputPos = i % outputArr.length;
    const passwordPos = i % password.length;
    const charOutputPos = chars.indexOf(outputArr[outputPos]);
    const charPasswordPos = chars.indexOf(password[passwordPos]);
    const charInputPos = (charOutputPos - charPasswordPos + chars.length) % chars.length;
    outputArr[outputPos] = chars[charInputPos];
  }
  return outputArr.join('');
};

export default {
  encode,
  decode,
  chars,
};
