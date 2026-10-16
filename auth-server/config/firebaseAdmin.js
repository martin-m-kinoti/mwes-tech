const admin = require('firebase-admin');
const fs = require('fs');

// Initialises the Firebase Admin SDK.
function initFirebaseAdmin() {
  if (admin.apps.length) return;

  try {
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT;
    const serviceAccount = fs.readFileSync(serviceAccountPath, 'utf8');

    if (serviceAccount) {
      const credentials = JSON.parse(serviceAccount);
      if (credentials.private_key) {
        credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
      }
      admin.initializeApp({ credential: admin.credential.cert(credentials) });
    } else {
      admin.initializeApp({ credential: admin.credential.applicationDefault() });
    }
  } catch (err) {
    console.error(
      'Firebase Admin SDK could not be initialised. Set FIREBASE_SERVICE_ACCOUNT or GOOGLE_APPLICATION_CREDENTIALS.',
      err.message
    );
  }
}

initFirebaseAdmin();

// Returns the Firebase Auth instance, or throws if the SDK is not configured.
function getAuth() {
  if (!admin.apps.length) {
    throw new Error('Firebase Admin SDK is not configured.');
  }
  return admin.auth();
}

module.exports = { admin, getAuth };
