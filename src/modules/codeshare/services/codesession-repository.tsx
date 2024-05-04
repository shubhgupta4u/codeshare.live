import { child, ref, set, get } from "firebase/database";
import { database } from './database'
import { Code } from "../models/code";
import SessionCodeProvider from "@/common/services/session-code-provider";


// Get the reference of the database.
// const database = getDatabase();
// Setting the data.
export default class CodeSessionRepository {
   static async createCodeSession(code: string) {
      const sessionCode = SessionCodeProvider.get(5);
      localStorage.setItem("sessionCode",JSON.stringify(sessionCode));
      await CodeSessionRepository.save(sessionCode, new Code(code, new Date(),new Date()));
      return sessionCode;
   }
   static async updateCodeSession(sessionCode: string, code: Code) {
      CodeSessionRepository.save(sessionCode, new Code(code.code, code.created??new Date(), new Date()));
      return sessionCode;
   }
   private static save(sessionCode: string, code: Code):any {
      return new Promise((resolve, reject) => {
         set(ref(database, 'session/' + sessionCode), code).then(() => {
            // Success.
            console.log("Data Saved: " +sessionCode);
            resolve(sessionCode);
         }).catch((error) => {
            console.log(error);
            reject(error);
         });
      });
   }
   static readSession(sessionCode: string) {
      return new Promise((resolve, reject) => {
         get(child(ref(database), 'session/' + sessionCode)).then((snapshot) => {
            if (snapshot.exists()) {
               let data = snapshot.val();
               resolve(data);
               console.log(data);
            } else {
               console.log("Data not available");
               reject("Data not available");
            }
         }).catch((error) => {
            console.log(error);
            reject(error);
         });
      });


   }
}
