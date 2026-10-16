const { getAuth } = require('../config/firebaseAdmin');

// Verifies the Firebase ID token and attaches the user to req.user
async function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  let auth;
  try {
    auth = getAuth();
  } catch {
    return res.status(503).json({ message: 'Authentication service is not configured.' });
  }

  try {
    const decoded = await auth.verifyIdToken(token);

    const name = decoded.name || '';
    const [firstName, ...rest] = name.split(' ').filter(Boolean);

    req.user = {
      uid: decoded.uid,
      id: decoded.uid,
      email: decoded.email || '',
      role: decoded.role === 'admin' ? 'admin' : 'client',
      firstName: decoded.firstName || firstName || '',
      lastName: decoded.lastName || rest.join(' ') || '',
      name,
    };
    return next();
  } catch {
    return res.status(401).json({ message: 'Session expired or invalid. Please sign in again.' });
  }
}

// Requires an authenticated user with the given role
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'You do not have permission to access this resource.' });
    }
    return next();
  };
}

module.exports = { authenticate, requireRole };
