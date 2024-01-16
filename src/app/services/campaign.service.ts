import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {

  constructor(private firebaseService: FirebaseService) { }

  public async addCampaign(title: string, password: string, ownerId: string): Promise<any> {
    const ref = collection(this.firebaseService.database, 'campaigns');
    return await addDoc(ref, {
      title: title,
      password: password,
      ownerId: ownerId,
      partecipants: [],
      heroes: [],
      imgUrl:'',
      createdAt: new Date()
    });
  }

  public async deleteCampaignById(id: string): Promise<any>{
    const ref = doc(this.firebaseService.database, 'campaigns', id);
    return await deleteDoc(ref);
  }

  public async getCampaignsByOwnerID(ownerId: string): Promise<any[]>{
    const ref = collection(this.firebaseService.database,'campaigns');
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
}
