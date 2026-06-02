const { users } = require("../../config/database");

const AuthRepository = {
  findByEmail(email) {
    for (const user of users.values()) {
      if (user.email === email) return user;
    }
    return null;
  },

  findById(id) {
    return users.get(id) ?? null;
  },

  create(user) {
    users.set(user.id, user);
    return user;
  },
};

module.exports = AuthRepository;
