import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';

export const adminLogin = async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  try {
    const admin = await Admin.findOne({});
    if (!admin) {
      return res.status(500).json({ message: 'Admin account not set up' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Load JWT_SECRET at runtime
    const JWT_SECRET = process.env.JWT_SECRET;
    console.log("JWT inside controller:", JWT_SECRET);

    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    return res.status(200).json({ token, message: 'Login successful' });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
