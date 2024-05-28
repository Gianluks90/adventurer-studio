import { Injectable, WritableSignal, effect, signal } from '@angular/core';
import { initializeApp } from "firebase/app";
import { Firestore, collection, doc, getDoc, getDocs, getFirestore, onSnapshot, setDoc } from 'firebase/firestore';
import { FirebaseStorage, getStorage } from 'firebase/storage';
import { BehaviorSubject } from 'rxjs';
import { UserData } from '../models/userData';
import { getAuth } from 'firebase/auth';
import { AdventurerUser } from '../models/adventurerUser';

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

  // public user = new BehaviorSubject<UserData | null>(null);
  public userSignal: WritableSignal<AdventurerUser> = signal(null);
  public userData: any;
  
  constructor() {
    const app = initializeApp(firebaseConfig);
    this.database = getFirestore(app);
    this.storage = getStorage(app);

    getAuth().onAuthStateChanged(async user => {
      if (user) {
        this.getSignalUser();
      } else {
        getAuth().signOut();
      }
    });

    effect(() => {
      this.userData = this.userSignal();
    });
  }

  public async getSignalUser() {
    const authUser = getAuth().currentUser!;
    const docRef = doc(this.database, 'users', authUser.uid);
    const unsub = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        const user: AdventurerUser = AdventurerUser.parseUser(doc.id, doc.data());
        user.photoURL = authUser.photoURL;
        this.userSignal.set(user);
      }
    })
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

  public async updateUserDddice(token: string, slug: string) {
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
    if (docSnap.exists() && docSnap.data()['dddiceToken']) {
      return docSnap.data()['dddiceToken'];
    } else {
      return "";
    }
  }
}

