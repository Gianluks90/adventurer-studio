import { Injectable } from '@angular/core';
import { initializeApp } from "firebase/app";
import { Firestore, collection, doc, getDoc, getDocs, getFirestore, setDoc } from 'firebase/firestore';
import { FirebaseStorage, getStorage } from 'firebase/storage';
import { BehaviorSubject } from 'rxjs';
import { UserData } from '../models/userData';
import { getAuth, User } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBRWnovU0y_fyAfb2v1VnIlznd7OF9vL-0",
  authDomain: "dnd-character-sheet-2023.firebaseapp.com",
  projectId: "dnd-character-sheet-2023",
  storageBucket: "dnd-character-sheet-2023.appspot.com",
  messagingSenderId: "321826372250",
  appId: "1:321826372250:web:c7807266f90beed2117d23"
};

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  public database: Firestore;
  public storage: FirebaseStorage;

  public user = new BehaviorSubject<UserData | null>(null);
  public isAuth = new BehaviorSubject<boolean>(false);

  constructor() {
    const app = initializeApp(firebaseConfig);
    this.database = getFirestore(app);
    this.storage = getStorage(app);

    getAuth().onAuthStateChanged(async user => {
      if (user) {
        this.checkUser(user);
        // localStorage.setItem('dndCS-2023-logged', 'true');
      } else {
        // localStorage.setItem('dndCS-2023-logged', 'false');
        this.isAuth.next(false);
      }
    });
   }

  public async checkUser(user: User): Promise<boolean> {
    return await this.getUser(user).then(userSnap => {
      if (userSnap.exists()) {
        const userResult = UserData.parseUser(user, userSnap.data());
        this.user.next(userResult);
        this.isAuth.next(true);
        return true;
      } else {
        getAuth().signOut();
        this.isAuth.next(false);
        return false;
      }
    })
  }

  public async getUser(user: User) {
    const q = doc(this.database, 'users', user.uid);
    const docSnap = await getDoc(q);
    return docSnap;
  }

  public async getUserById(id: string) {
    const q = doc(this.database, 'users', id);
    const docSnap = await getDoc(q);
    return docSnap;
  }

  public async getThenUpdateAllUsers(): Promise<any> {
    const q = collection(this.database, 'users');
    const docs = await getDocs(q);
    const result: UserData[] = [];
    docs.forEach(async doc => {
      await this.updateUser(doc.id);
    });
    return result;
  }

  public async updateUser(id: string) {
    const userRef = doc(this.database, 'users', id);
    return await setDoc(userRef, {
      createdCampaigns: [],
      campaignProgressive: 0,
      campaignsAsPartecipant: [],
    }, { merge: true })
  }

  public async updateUserDddice(token:string, slug: string) {
    const userRef = doc(this.database, 'users', getAuth().currentUser.uid);
    return await setDoc(userRef, {
      dddiceToken: token,
      privateSlug: slug
    }, { merge: true })
  }

  public async getUserDDDiceToken(): Promise<string> {
    const user = getAuth().currentUser!;
    const q = doc(this.database, 'users', user.uid);
    const docSnap = await getDoc(q);
    if (docSnap.exists() && docSnap.data()['dddiceToken']){
      return docSnap.data()['dddiceToken'];
    } else {
      return "";
    }
  }
}

