const formatUser = (user) => {
  if (!user) return null;
  
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    profilePicture: user.profilePicture,
    name: user.name
  };
};

module.exports = { formatUser };