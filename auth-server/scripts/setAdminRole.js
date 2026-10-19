require('dotenv').config();
const { getAuth } = require('../config/firebaseAdmin');

// One-off helper: grant a Firebase user the "admin" role via a custom claim.
//
// Usage:  node scripts/setAdminRole.js <email>
//         (or: npm run grant-admin -- <email>)
//
// After running it, sign out and back in so the ID token picks up the claim.
async function main() {
  const email = (process.argv[2] || '').trim().toLowerCase();

  if (!email) {
    console.error('Usage: node scripts/setAdminRole.js <email>');
    process.exit(1);
  }

  let auth;
  try {
    auth = getAuth();
  } catch (err) {
    console.error(err.message);
    console.error('Set FIREBASE_SERVICE_ACCOUNT in auth-server/.env first.');
    process.exit(1);
  }

  let user;
  try {
    user = await auth.getUserByEmail(email);
  } catch (err) {
    console.error(`No Firebase user found for "${email}".`);
    console.error(err.message);
    process.exit(1);
  }

  await auth.setCustomUserClaims(user.uid, { ...(user.customClaims || {}), role: 'admin' });

  console.log(`"${email}" (${user.uid}) is now an admin.`);
  console.log('Sign out and back in for the role to take effect.');
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
