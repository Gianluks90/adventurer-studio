import { Injectable, WritableSignal, signal } from '@angular/core';
import { addDoc, arrayRemove, arrayUnion, doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { FirebaseService } from 'src/app/services/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class ResourcesService {

  constructor(private firebaseService: FirebaseService) { }

  public resources: WritableSignal<any> = signal(null);
  public getSignalResourcesByUserId(userId: string) {
    const docRef = doc(this.firebaseService.database, 'resources', userId);
    const unsub = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        this.resources.set({
          ...doc.data(),
          id: doc.id
        })
      }
    });
  }

  public async getResourcesByUserId(userId: string): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'resources', userId);
    const document = await getDoc(docRef);
    if (document.exists()) {
      return {
        ...document.data(),
        id: document.id
      };
    } else {
      return null;
    }
  }

  public async resourcesInit(userId: string): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'resources', userId);
    return await setDoc(docRef, {
      id: userId,
      addons: [],
      allies: [],
      organizations: [],
      spells: [],
      items: [],
      status: {
        limit: userId === 'VW7xs0JqZrf5TIvpIqoE6lDviXf2' ? -1 : 100 // 100 is the default value, -1 unlimited
      }
    })
  }

  public async getUserCharactersAndCampaigns(userId: string): Promise<any> {
    const result: any = {
      characters: [],
      campaigns: []
    };
  
    try {
      const userRef = doc(this.firebaseService.database, 'users', userId);
      const userDoc = await getDoc(userRef);
  
      if (userDoc.exists()) {
        const userData = userDoc.data();
  
        const charactersPromises = userData['characters'].map(async (charId: any) => {
          const charRef = doc(this.firebaseService.database, 'characters', charId);
          const charDoc = await getDoc(charRef);
          if (charDoc.exists()) {
            return {
              ...charDoc.data(),
              id: charDoc.id
            };
          }
          return null; // Return null if character doesn't exist
        });
  
        const campaignsPromises = userData['createdCampaigns'].map(async (campId: any) => {
          const campRef = doc(this.firebaseService.database, 'campaigns', campId);
          const campDoc = await getDoc(campRef);
          if (campDoc.exists()) {
            return {
              ...campDoc.data(),
              id: campDoc.id
            };
          }
          return null; // Return null if campaign doesn't exist
        });
  
        result.characters = (await Promise.all(charactersPromises)).filter(char => char !== null);
        result.campaigns = (await Promise.all(campaignsPromises)).filter(camp => camp !== null);
      }
    } catch (error) {
      console.error("Error fetching user characters and campaigns:", error);
    }
  
    return result;
  }
  
  public async updateResources(userId: string, resources: any): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'resources', userId);
    return await setDoc(docRef, {
      ...resources
    }, { merge: true });
  }

  public async addResource(userId: string, type: string, resource: any): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'resources', userId);
    return await setDoc(docRef, {
      [type]: arrayUnion(resource)
    }, { merge: true });
  }

  public async removeResource(userId: string, type: string, resource: any): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'resources', userId);
    return await setDoc(docRef, {
      [type]: arrayRemove(resource)
    });
  }
}
