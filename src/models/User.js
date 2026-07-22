const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const toJSON = require('../utils/toJSON');

const userSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    senha: {
      type: String,
      required: true,
      minlength: 6,
      select: false
    }
  },
  { timestamps: true, toJSON, toObject: toJSON }
);

userSchema.pre('save', async function hashPassword() {
  if (!this.isModified('senha')) {
    return;
  }

  this.senha = await bcrypt.hash(this.senha, 10);
});

userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.senha);
};

module.exports = mongoose.model('User', userSchema);
