export const splitName = (username) => {
  const fullName = username;
  const arrName = fullName.split(" ");
  const fname = arrName[0].charAt(0);
  const userChar = fname.toUpperCase();
  const sliceName = arrName[0].slice(1);

  return `${userChar}${sliceName}`;
};
