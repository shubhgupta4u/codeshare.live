import { initializeApp } from 'firebase/app';
import { getDatabase } from "firebase/database";
// var admin = require("firebase-admin");

var serviceAccount = {
    "type": "service_account",
    "project_id": "codeshare-live",
    "private_key_id": "e567a6798e8140e3fc037408b051a8414ae59765",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC0qc3ybKR3fY9K\nzxY437gFDhXMk9nkcM/K6RB8bI+ZbBVEM8S5YRWctrvqeWpSkEHgHTTPQrmUmfnp\nnIrdPv1NKfBwXdyOJ7siyMATTHfjRSJr+LTBSdnhzulsswsHMRo696XeWvj+jRs0\nATo4mhlYhFvDtwjKfgfCm7J7HGsa97CH5sTo8ozMMEYTW4R0fROFJ4YHatr5pnRU\nZS+Kv46yarFwmGpSJR0QBwE9hCKjD0o4NZqKjYAoVUKtIP0QW1Qq0S56cX26QZc0\nDmrsFVX0gOSm+X+JXrGTFFUD8Ty8OjgflJPFP7m4r9QuFrq7wgTzQ5p11d2zqVQv\nQm5eAw3VAgMBAAECggEAA24S4SajY7pgSVMPsLI8p+npy4nGEgJ7S3arz7Tu8AJ/\nj90sv7lCZAiLHktCU8F14rejPEkfxVy8BC2q7ELpI7knXbbGfHNwJ9uoW+VwhEHY\ngrTE18ObbaBUSbJHhBIwVYzEmylef1S1/sGENbVlREs1A8z6j3+fjZgPpis2tFsV\n1ZY6DcBEai3gBC8sYUjamNutGNNw80UlbmSio2AOG8kvH8gahq4OIRd2TXkYWLO3\nFCzHizxggTQGvA0oB3/TkaFF3qvBv12g06D8Itkx8RClspwObGQp5YNbzri16qVm\nvWS5PxUnfgBt0sqTFFoNqfpdn44fcf1QjMSzaBdmUQKBgQDcIVXB+fYFOI4HLBUy\nRbzrPEMWnu8Fq+XOU1fcxaBXA5bcnarIXmQodyXAQ7Gy9TK76AhP3nQUVXbEmYun\no3AY5wXKdCJ47emeXPUzIlzA8NbdYVGVoTmP+M3k3AL0HUhxRT15iz/PhrzIjOav\newIpXpzt4E47w7QIrs7hOUSqRQKBgQDSGh58EkHiKuaQkpItQoFt1biRqhvmB1Di\n//VLxcA3qgj73xJl3gff1oiZTk1N0vxwtVSYfiGZ/03QaRfqJeojJmfCD/PjzVi0\nOOsTgg2ZOuOIK7sk6lbCguv/fkoEprKIgKRvMDIZ/8NzfHuhg7FMRZY+u1YmhI53\nDS6J8h5WUQKBgBJsY84JSpLjSdfF07xSY95YO9Ev2hdibKhZB1h93c6KiVzLgVil\ntcJBPpKZ18x/gxCA+fkdSB/Pi1Im+647Go2rACwSjjQKzWuoogj2jkbDoWgD1h0s\n0jF/hFPsKf8eWErKnbuHcP7Aaxpp2IDFTcgCmCW8iS+tUGsNnljxPxL1AoGAHkUJ\nE1MGDvGjWjzjtoWYZByghMv/TPrM2oeJ7arF8L8coD0ZR3ffpo4gDAZN+OJm4E4f\nrACwEqHHsjkR6vgfbYUA+eKWfsF9ACobJCpejy7+zQWP5tekPE3kdmDZhSYHHsd5\n6VMGRNymaiMLJM/2YUi9RrhyxwXeCKTriZBKcqECgYEAywJd4XH+nqBKwE822Cu5\nXgeJLO/MXZfOWj5mB7QNgnBFES1yte98Jm5ebC+oYX+EOey/3Fs9UEf4fOVZ95sQ\nSb4FqvTZmUIWvg7QeHR7VdDDAFDoOFRAGMd4NX7fJs8cgrG+tG7XvYDXZiaq7mWR\noDMgZ20ay1en/T6t8/ZnBDw=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-11a8k@codeshare-live.iam.gserviceaccount.com",
    "client_id": "109219002832303929028",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-11a8k%40codeshare-live.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
  }

const firebaseConfig = {
    // apiKey: "AIzaSyAAx_knJ_qqxPkJQ_xoIZnxt_c6gb6Wdys",
    authDomain: "odeshare-live.firebaseapp.com",
    projectId: "odeshare-live",
    storageBucket: "odeshare-live.appspot.com",
    messagingSenderId: "288513680516",
    // appId: "1:1072574112522:web:65fc4e184aed9894dc90f3",
    // credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://codeshare-live-default-rtdb.asia-southeast1.firebasedatabase.app"  
};
console.log(firebaseConfig);
// Initialize firebase app.
const app = initializeApp(firebaseConfig);
console.log(app.name);
// Initialize firebase database and get the reference of firebase database object.
export const database = getDatabase(app);
