import { Injectable, WritableSignal, signal } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, setDoc, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {

  public campaigns: WritableSignal<any[]> = signal([]);

  constructor(private firebaseService: FirebaseService) {
    this.getSignalCampaigns();
  }

  public async addCampaign(infoCampaign: any): Promise<any> {
    const user = this.firebaseService.user.value!;
    const newCampaignId = user.id + '-C-' + (user.campaignProgressive + 1);
    const docRef = doc(this.firebaseService.database, 'campaigns', newCampaignId);
    return await setDoc(docRef, {
      title: infoCampaign.title,
      password: infoCampaign.password,
      ownerId: user.id,
      dmName: infoCampaign.dmName,
      partecipants: [],
      characters: [],
      imgUrl: '',
      description: infoCampaign.description || '',
      createdAt: new Date(),
      lastUpdate: new Date(),
      story: [],
      quests: [],
      npcs: [],
      achievements: [],
      status: {
        statusCode: 0,
        statusMessage: 'Nuova'
      }
    }).then(() => {
      const userRef = doc(this.firebaseService.database, 'users', user.id);
      setDoc(userRef, {
        createdCampaigns: arrayUnion(newCampaignId),
        campaignProgressive: user.campaignProgressive + 1
      }, { merge: true });
    });
  }

  public async deleteCampaignById(id: string): Promise<any> {
    const ref = doc(this.firebaseService.database, 'campaigns', id);
    return await deleteDoc(ref).then(() => {
      const userRef = doc(this.firebaseService.database, 'users', this.firebaseService.user.value!.id);
      setDoc(userRef, {
        createdCampaigns: arrayRemove(id)
      }, { merge: true });
    });
  }

  public async getUserCampaigns(): Promise<any> {
    const user = getAuth().currentUser!;
    const asOwner = await this.getCampaignsByOwnerID(user.uid);
    const asPartecipant = await this.getCampaignsByPartecipantID(user.uid);
    return {
      asOwner: asOwner,
      asPartecipant: asPartecipant
    }
  }

  public async getCampaignsByOwnerID(ownerId: string): Promise<any[]> {
    const ref = collection(this.firebaseService.database, 'campaigns');
    const q = query(ref, where('ownerId', '==', ownerId));
    const docs = await getDocs(q);
    const result: any[] = [];
    docs.forEach(doc => {
      const campaign = {
        id: doc.id,
        ...doc.data()
      }
      result.push(campaign);
    });

    return result;
  }

  public async getCampaignsByPartecipantID(partecipantId: string): Promise<any[]> {
    const ref = collection(this.firebaseService.database, 'campaigns');
    const q = query(ref, where('partecipants', 'array-contains', partecipantId));
    const docs = await getDocs(q);
    const result: any[] = [];
    docs.forEach(doc => {
      const campaign = {
        id: doc.id,
        ...doc.data()
      }
      result.push(campaign);
    });

    return result;
  }

  public async getCampaignById(id: string): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'campaigns', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
  }

  public getSignalCampaigns(): void {
    const docRef = collection(this.firebaseService.database, 'campaigns');
    const unsub = onSnapshot(docRef, (snapshot) => {
      const result: any[] = [];
      snapshot.forEach(doc => {
        const campaign = {
          id: doc.id,
          ...doc.data()
        }
        result.push(campaign);
      });
      this.campaigns.set(result);
    });
  }

  public async checkCampaign(id: string, password: string): Promise<boolean> {
    const docRef = doc(this.firebaseService.database, 'campaigns', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.data()['ownerId'] === this.firebaseService.user.value!.id) {
      return false;
    }
    if (docSnap.exists()) {
      const campaign = docSnap.data();
      return campaign['password'] === password;
    }
    return false;
  }

  public async subscribeToCampaign(campId: string, userId: string, heroId: string): Promise<any> {
    let character;
    const heroRef = doc(this.firebaseService.database, 'characters', heroId);
    const heroSnap = await getDoc(heroRef).then(async char => {
      character = {
        id: char.id,
        basicInfo: char.data()['informazioniBase'],
        money: char.data()['denaro'],
        inspiration: char.data()['ispirazione'],
        healthParameter: char.data()['parametriVitali'],
        status: char.data()['status'],
      }

      await setDoc(heroRef, {
        campaignId: campId
      }, { merge: true });

      const docRef = doc(this.firebaseService.database, 'campaigns', campId);
      return await setDoc(docRef, {
        characters: arrayUnion(character),
        partecipants: arrayUnion(userId),
        lastUpdate: new Date(),
        status: {
          statusCode: 1,
          statusMessage: 'In preparazione'
        }
      }, { merge: true }).then(() => {
        const userRef = doc(this.firebaseService.database, 'users', userId);
        setDoc(userRef, {
          campaignsAsPartecipant: arrayUnion(campId)
        }, { merge: true });
      });;
    });
  }

  public async addStory(campId: string, story: any): Promise<void> {
    const docRef = doc(this.firebaseService.database, 'campaigns', campId);
    return await setDoc(docRef, {
      story: arrayUnion(story),
      lastUpdate: new Date()
    }, { merge: true });
  }

  public async updateCampaignStory(campId: string, stories: any[]): Promise<void> {
    const docRef = doc(this.firebaseService.database, 'campaigns', campId);
    return await setDoc(docRef, {
      story: stories,
      lastUpdate: new Date()
    }, { merge: true });
  }

  public async addQuest(campId: string, quest: any): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'campaigns', campId);
    return await setDoc(docRef, {
      quests: arrayUnion(quest),
      lastUpdate: new Date()
    }, { merge: true });
  }

  public async updateCampaignQuest(campId: string, quests: any[]): Promise<void> {
    console.log('updateCampaignQuest', quests);
    const docRef = doc(this.firebaseService.database, 'campaigns', campId);
    return await setDoc(docRef, {
      quests: quests,
      lastUpdate: new Date()
    }, { merge: true });
  }
}
