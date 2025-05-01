import {initializeApp,cert, getApps} from 'firebase-admin/app';
import {getAuth} from 'firebase-admin/auth';
import {getFirestore} from 'firebase-admin/firestore';

const initFirebaseAdmin = () => {
    const apps = getApps();

    if (!apps.length ) {
        initializeApp({
            credential: cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            })
        })
        // Initialize Firebase Admin SDK here
        // For example:
        // const admin = require('firebase-admin');
        // admin.initializeApp({
        //     credential: admin.credential.applicationDefault(),
        //     databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
        // });
    
    }


    return {
        auth: getAuth(),
        db: getFirestore()
    }

}

export const {auth, db} = initFirebaseAdmin()

