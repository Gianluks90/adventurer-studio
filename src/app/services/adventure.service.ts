import { Injectable, WritableSignal, effect, signal } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { AdventurerUser } from '../models/adventurerUser';
import { arrayUnion, collection, doc, getDocs, onSnapshot, query, setDoc, where } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class AdventureService {

  public user: AdventurerUser | null = null;
  public adventure: WritableSignal<any> = signal({});

  constructor(private firebaseService: FirebaseService) {
    effect(() => {
      this.user = this.firebaseService.userSignal();
    });
  }

  public async addAdventure(adventure: any): Promise<any> {
    const newAdventureId = this.user.id + '_A_' + (this.user.adventuresProgressive + 1);
    const docRef = doc(this.firebaseService.database, 'adventures', newAdventureId);
    return await setDoc(docRef, {
      id: newAdventureId,
      title: adventure.title,
      chapters: [],
      status: {
        userId: this.user.id,
        statusMessage: 'Bozza',
        createdAt: new Date(),
        lastUpdate: new Date()
      }
    }).then(() => {
      const userRef = doc(this.firebaseService.database, 'users', this.user.id);
      setDoc(userRef, {
        adventures: arrayUnion(newAdventureId),
        adventuresProgressive: this.user.adventuresProgressive + 1
      }, { merge: true });
    });
  }

  public getSignalAdventure(adventureId: string): void {
    const docRef = doc(this.firebaseService.database, 'adventures', adventureId);
    const unsub = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        const adventure = {
          id: doc.id,
          ...doc.data()
        }
        this.adventure.set(adventure);
      }
    });
  }

  public async getAdventuresByUserId(): Promise<any> {
    const ref = collection(this.firebaseService.database, 'adventures');
    const q = query(ref, where('status.userId', '==', this.user.id));
    const docs = await getDocs(q);
    const result: any[] = [];
    docs.forEach(doc => {
      const adventure = {
        id: doc.id,
        ...doc.data()
      }
      result.push(adventure);
    });
    return result;
  }

  public async addChapter(adventureId: string, chapter: any): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'adventures', adventureId);
    const chapterData: any = {
      id: this.randomId(),
      ...chapter,
      elements: [],
      bookmarked: false
    };
    return await setDoc(docRef, {
      chapters: arrayUnion(chapterData),
      status: {
        lastUpdate: new Date()
      }
    }, { merge: true });
  }

  public async updateChapters(adventureId: string, chapters: any[]): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'adventures', adventureId);
    return await setDoc(docRef, {
      chapters: chapters,
      status: {
        lastUpdate: new Date()
      }
    }, { merge: true });
  }

  private randomId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}
