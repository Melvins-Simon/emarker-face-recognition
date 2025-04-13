function toTitleCase(str) {
  return (
    str.toLowerCase().split(" ")[0].charAt(0).toUpperCase() +
    str.toLowerCase().split(" ")[0].slice(1)
  );
}

export default toTitleCase;
