exports.getProfile = (req, res) => {
  res.json({ success: true, message: "Profile fetched successfully" });
};

exports.updateProfile = (req, res) => {
  res.json({ success: true, message: "Profile updated successfully" });
};
