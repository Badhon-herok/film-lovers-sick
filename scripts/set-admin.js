/**
 * Usage: node scripts/set-admin.js <USER_UID>
 *
 * Requirements:
 * - Download a Firebase service account JSON and save it as
 *   `scripts/serviceAccountKey.json` (keep it private).
 * - Run this script locally (do NOT commit the service account file).
 */
const admin = require('firebase-admin');
const path = require('path');

const keyPath = path.resolve(__dirname, 'serviceAccountKey.json');
if (!require('fs').existsSync(keyPath)) {
  console.error('Missing scripts/serviceAccountKey.json. Download from Firebase Console -> Project Settings -> Service accounts.');
  process.exit(1);
}

const serviceAccount = require(keyPath);
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const uid = process.argv[2];
if (!uid) {
  console.error('Usage: node scripts/set-admin.js <USER_UID>');
  process.exit(1);
}

(async () => {
  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    console.log(`Set admin claim for uid=${uid}`);
    process.exit(0);
  } catch (err) {
    console.error('Failed to set claim:', err.message || err);
    process.exit(1);
  }
})();
