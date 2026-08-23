const getAdminDashboard = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Welcome to the admin dashboard",
    data: {
      admin: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    },
  });
};

module.exports = {
  getAdminDashboard,
};