const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  let token = null;

  // 1. Try extracting token from cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } 
  // 2. Try extracting token from authorization header
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'አልተፈቀደልዎትም! እባክዎ መጀመሪያ ይግቡ።' }); // Access denied, please log in (Amharic)
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'agrovision_secret_key');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'የመግቢያ መረጃው ጊዜ አልፏል ወይም ትክክል አይደለም። እባክዎ እንደገና ይግቡ።' }); // Session expired or invalid (Amharic)
  }
};
