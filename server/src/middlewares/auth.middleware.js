import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
    let token;

    // 1. Priority: Authorization Header (Crucial for Vercel -> Render)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        // ✅ Added .trim() to remove any invisible spaces/newlines from the header
        token = authHeader.split(' ')[1].trim(); 
    }
    
    // 2. Fallback: Cookies (Keep for localhost support)
    if (!token && req.cookies) {
        token = req.cookies.token;
    }

    // 3. The "Undefined" Trap: Check if the string 'undefined' was sent
    if (!token || token === "undefined" || token === "null") {
        console.log("❌ No token found in request headers or cookies");
        return res.status(401).json({ message: 'No token' });
    }

    try {
        // 4. Verify using the secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Support both id and _id structures (MongoDB uses _id)
        req.user = { id: decoded.id || decoded._id }; 
        
        next();
    } catch (err) {
        // 🔍 This log in Render will tell us exactly why it failed
        console.error(`❌ JWT Verification Failed: ${err.message}`);
        return res.status(401).json({ message: 'Invalid token' });
    }
};