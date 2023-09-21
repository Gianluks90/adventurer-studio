import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { FormGroup } from '@angular/forms';
import { DocumentData, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  constructor(private firebaseService: FirebaseService) { }

  public async getCharacterById(id: string): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  }

  public async getCharactersByUserId(id: string): Promise<any[]> {
    const docRef = collection(this.firebaseService.database, 'characters');
    const q = query(docRef, where('userId', '==', id));
    const docs = await getDocs(q);
    const result: any[] = [];
    docs.forEach(doc => {
      result.push(doc.data());
    });
    return result;
  }

  public async createCharacter(form: FormGroup): Promise<any> {
    const user = this.firebaseService.user.value!;
    const newCharacterId = user.id + '-' + (user.progressive + 1);
    const docRef = doc(this.firebaseService.database, 'characters', newCharacterId);
    return await setDoc(docRef, {
      ...form.value,
      status: {
        creationDate: new Date(),
        userId: user.id,
        author: user.displayName,
      }
    }).then(() => {
      const userRef = doc(this.firebaseService.database, 'users', user.id);
      setDoc(userRef, {
        characters: arrayUnion(newCharacterId),
        progressive: user.progressive + 1
      }, { merge: true });
    });
  }

  public async deleteCharacterById(id: string): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await deleteDoc(docRef).then(() => {
      const userRef = doc(this.firebaseService.database, 'users', this.firebaseService.user.value!.id);
      setDoc(userRef, {
        characters: arrayRemove(id)
      }, { merge: true });
    });
   }

  public async updateCharacterById(id: string, form: FormGroup): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(docRef, form.value, { merge: true });
  }
}
