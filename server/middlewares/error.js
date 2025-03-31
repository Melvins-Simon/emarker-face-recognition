export const createError = (code, message, res) => {
  return res.status(code).json({ success: false, message });
};
