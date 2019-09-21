const toCamelCase = str => {
  if (!str) {
    return '';
  }
  str = str.trim().toLowerCase();
  while (str.indexOf(' ') > 0) {
    const spaceIndex = str.indexOf(' ');
    str =
      str.slice(0, spaceIndex) +
      str.charAt(spaceIndex + 1).toUpperCase() +
      (str.length > spaceIndex + 2 ? str.slice(spaceIndex + 2) : '');
  }
  return str;
};

module.exports = { toCamelCase };
