import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  const token = req.cookies.token; // ✅ read from cookie
  console.log("cookies:", req.cookies);

  if (!token) {
    return res.status(401).json({ message: 'No token' });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

req.user = { id: decoded.id };
next();
};