// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;

export const protectAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') throw new Error('Not admin');
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized' });
  }
};
