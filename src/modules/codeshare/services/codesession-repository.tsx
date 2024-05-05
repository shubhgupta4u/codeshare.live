import { child, ref, set, get, query, orderByChild, onValue } from "firebase/database";
import { Code } from "../models/code";
import SessionCodeProvider from "@/common/services/session-code-provider";
import { database } from "./database";

export default class CodeSessionRepository {

   static async createCodeSession(code: string) {
      const sessionCode = SessionCodeProvider.get(5);
      const writeAccessCode = SessionCodeProvider.get(5);
      const request = new Code(code, new Date(), new Date());
      request.writeAccessCode=writeAccessCode;

      return new Promise(async (resolve, reject) => {
         try {           
            await CodeSessionRepository.saveCodeSession(sessionCode, request);
            localStorage.setItem("writeAccessCode", JSON.stringify(writeAccessCode));      
            localStorage.setItem("sessionCode", JSON.stringify(sessionCode));
            resolve({ sessionCode: sessionCode, writeAccessCode: writeAccessCode });
         } catch (e) {
            reject("Error occured while saving new Code Session");
         }
      });
   }

   static async updateCodeSession(sessionCode: string, code: Code) {
      const request = new Code(code.code, undefined, new Date());
      request.writeAccessCode=code.writeAccessCode;
      request.created=code.created ?? JSON.stringify(new Date());
      
      return new Promise(async (resolve, reject) => {
         try {           
            await CodeSessionRepository.saveCodeSession(sessionCode, request);
            resolve({ sessionCode: sessionCode, writeAccessCode: request.writeAccessCode });
         } catch (e) {
            reject("Error occured while saving new Code Session");
         }
      });
   }

   private static saveCodeSession(sessionCode: string, code: Code): any {
      return new Promise((resolve, reject) => {       
         set(ref(database,`session/${sessionCode}`), code).then(() => {
            // Success.
            resolve(sessionCode);
         }).catch((error) => {
            reject(error);
         });
      });
   }
   static readSession(sessionCode: string,writeAccessCode:string|null) {
      return new Promise((resolve, reject) => {
         const dbRef = ref(database);
         get(child(dbRef, `session/${sessionCode}`)).then((snapshot) => {
            if (snapshot.exists()) {
               let data = snapshot.val();
               if(writeAccessCode !=data.writeAccessCode){
                  data.writeAccessCode=undefined;
               }
               resolve(data);
            } else {
               reject("Data not available");
            }
         }).catch((error) => {
            reject(error);
         });
      });


   }
}
