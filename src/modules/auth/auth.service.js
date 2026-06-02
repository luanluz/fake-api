const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const config = require("../../config/app.config");
const AuthRepository = require("./auth.repository");
const {
  ConflictError,
  UnauthorizedError,
  NotFoundError,
  UnprocessableEntityError,
} = require("../../shared/errors/http-errors");

const AuthService = {
  register({ name, email, password }) {
    const validationErrors = [];
    if (!name?.trim()) validationErrors.push({ field: "name", message: "Name is required" });
    if (!email?.trim()) validationErrors.push({ field: "email", message: "Email is required" });
    if (!password) validationErrors.push({ field: "password", message: "Password is required" });
    if (password && password.length < 6)
      validationErrors.push({ field: "password", message: "Password must be at least 6 characters" });

    if (validationErrors.length > 0) {
      throw new UnprocessableEntityError("Validation failed", validationErrors);
    }

    if (AuthRepository.findByEmail(email)) {
      throw new ConflictError(`Email '${email}' is already in use`);
    }

    const now = new Date().toISOString();
    const user = {
      id: uuidv4(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: bcrypt.hashSync(password, 10),
      createdAt: now,
      updatedAt: now,
    };

    AuthRepository.create(user);
    const token = _signToken(user);
    return { token, user: _sanitize(user) };
  },

  login({ email, password }) {
    if (!email || !password) {
      throw new UnprocessableEntityError("Validation failed", [
        ...(!email ? [{ field: "email", message: "Email is required" }] : []),
        ...(!password ? [{ field: "password", message: "Password is required" }] : []),
      ]);
    }

    const user = AuthRepository.findByEmail(email.toLowerCase());
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const token = _signToken(user);
    return { token, user: _sanitize(user) };
  },

  getProfile(userId) {
    const user = AuthRepository.findById(userId);
    if (!user) throw new NotFoundError("User not found");
    return _sanitize(user);
  },
};

function _signToken(user) {
  return jwt.sign({ userId: user.id, email: user.email }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
}

function _sanitize(user) {
  const { password: _, ...safe } = user;
  return safe;
}

module.exports = AuthService;
