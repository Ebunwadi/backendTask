import admin, { ServiceAccount } from 'firebase-admin'

import serviceAccount from './serviceAccount.json'

admin.initializeApp({
  credential: admin.credential.cert(<ServiceAccount>serviceAccount)
})
export const db = admin.firestore()
