import { Injectable, WritableSignal, signal } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { FormGroup } from '@angular/forms';
import { arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, setDoc, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Item } from '../models/item';
import { FormModel } from '../models/formModel';
import { Spell } from '../models/spell';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  constructor(private firebaseService: FirebaseService) { 
    this.getSignalCharacters();
  }

  public campaignCharacters: WritableSignal<any[]> = signal([]);
  public character: WritableSignal<any> = signal(null);

  public async getCharacterById(id: string): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  }

  public getCharacterSignalById(id: string): void {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    const unsub = onSnapshot(docRef, (snapshot) => {
      this.character.set({
        id: snapshot.id,
        ...snapshot.data()
      });
    });
  }

  public async getCharacters(): Promise<any[]> {
    const docRef = collection(this.firebaseService.database, 'characters');
    const docs = await getDocs(docRef);
    const result: any[] = [];
    docs.forEach(doc => {
      const character = {
        id: doc.id,
        ...doc.data()
      }
      result.push(character);
    });

    return result;
  }

  public getSignalCharacters(): void {
    const docRef = collection(this.firebaseService.database, 'characters');
    const unsub = onSnapshot(docRef, (snapshot) => {
      const result: any[] = [];
      snapshot.forEach(doc => {
        const character = {
          id: doc.id,
          ...doc.data()
        }
        result.push(character);
      });
      this.campaignCharacters.set(result);
    });
  }
  
  // public getSignalCampaigns(): void {
  //   const docRef = collection(this.firebaseService.database, 'campaigns');
  //   const unsub = onSnapshot(docRef, (snapshot) => {
  //     const result: any[] = [];
  //     snapshot.forEach(doc => {
  //       const campaign = {
  //         id: doc.id,
  //         ...doc.data()
  //       }
  //       result.push(campaign);
  //     });
  //     this.campaigns.set(result);
  //   });
  // }

  public async getCharactersByUserId(id: string): Promise<any[]> {
    const docRef = collection(this.firebaseService.database, 'characters');
    const q = query(docRef, where('status.userId', '==', id));
    const docs = await getDocs(q);
    const result: any[] = [];
    docs.forEach(doc => {
      const character = {
        id: doc.id,
        ...doc.data()
      }
      result.push(character);
    });

    return result;
  }

  public async createCharacter(form: FormGroup): Promise<any> {
    const user = this.firebaseService.user.value!;
    const newCharacterId = user.id + '-' + (user.progressive + 1);
    const docRef = doc(this.firebaseService.database, 'characters', newCharacterId);
    return await setDoc(docRef, {
      ...form.value,
      id: newCharacterId,
      status: {
        creationDate: new Date(),
        lastUpdateDate: new Date(),
        userId: user.id,
        author: user.displayName,
        statusCode: 0,
        sheetColor: '#FFFFFF40'
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

  public async updateCharacterSheetColorById(id: string, color: string): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(docRef, {
      status: {
        sheetColor: color
      }
    }, { merge: true });
  }

  public async updateMoney(id: string, money: any): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(docRef, {
      denaro: {
        ...money
      }
    }, { merge: true });
  }

  public async updateCharacterPFById(id: string, form: any): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(docRef, {
      parametriVitali: {
        puntiFeritaAttuali: form.pf,
        puntiFeritaTemporaneiAttuali: form.pft,
        massimoPuntiFeritaTemporanei: form.pftMax
      }
    }, { merge: true });
  }

  public async updateCharacterDadiVitaById(id: string, form: FormGroup): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(docRef, {
      parametriVitali: {
        dadiVita: form.value.dadiVita
      }
    }, { merge: true });
  }

  // Cambiare i parametri da aggiornare su tutti i PG a piacere prima di lanciare il comando.
  public async adminCharUpdate(id: string): Promise<any> {
    const ref = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(ref, {
      // campaignId: ''
    }, { merge: true })
  }

  public async addItemInventory(id: string, form: any): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(docRef, {
      equipaggiamento: arrayUnion(form)
    }, { merge: true });
  }

  public async updateInventory(id: string, inventory: Item[]): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(docRef, {
      equipaggiamento: inventory
    }, { merge: true });
  }

  public async addSpell(id: string, form: FormGroup): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(docRef, {
      magia: {
        trucchettiIncantesimi: arrayUnion(form)
      }
    }, { merge: true });
  }

  public async updateSpells(id: string, spells: Spell[]): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(docRef, {
      magia: {
        trucchettiIncantesimi: spells
      }
    }, { merge: true });
  }

  public async addAttack(id: string, form: FormGroup): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(docRef, {
      attacchi: arrayUnion(form)
    }, { merge: true });
  }

  public async updateAttacks(id: string, attacks: any[]): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(docRef, {
      attacchi: attacks
    }, { merge: true });
  }

  public async updateAdditionalResources(id: string, resources: any[]) {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(docRef, {
      informazioniBase: {
        risorseAggiuntive: resources
      }
    }, { merge: true });
  }

  public async updateDadiVita(id: string, dadi: any[]): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(docRef, {
      parametriVitali: {
        dadiVita: dadi
      }
    }, { merge: true });
  }

  public async updateInspiration(id: string, value: boolean): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    setDoc(docRef, {
      ispirazione: value
    }, { merge: true });
  }

  public async updateSlotIncantesimi(id: string, slots: any[]): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(docRef, {
      magia: {
        slotIncantesimi: slots
      }
    }, { merge: true });
  }

  // public async updateAttacks(id: string, attacks: any[]): Promise<any> {
  //   const docRef = doc(this.firebaseService.database, 'characters', id);
  //   return await setDoc(docRef, {
  //     attacchi: attacks
  //   }, { merge: true });
  // }

  // ALLIES AND ORGANIZATIONS

  public async addAlly(id: string, form: FormGroup): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(docRef, {
      allies: arrayUnion(form)
    }, { merge: true });
  }

  public async updateAllies(id: string, allies: any[]): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(docRef, {
      allies: allies
    }, { merge: true });
  }

  public async addAddon(id: string, form: FormGroup): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(docRef, {
      addons: arrayUnion(form)
    }, { merge: true });
  }

  public async updateAddons(id: string, addons: any): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(docRef, {
      addons: addons
    }, { merge: true });
  }

  public async addOrganization(id: string, form: FormGroup): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(docRef, {
      organizations: arrayUnion(form)
    }, { merge: true });
  }

  public async updateOrganizations(id: string, organizations: any[]): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(docRef, {
      organizations: organizations
    }, { merge: true });
  }

  // ROOM DDDICE

  public async setRoom(slug: string) {
    const docRef = doc(this.firebaseService.database, 'users', getAuth().currentUser.uid);
    return await setDoc(docRef, {
      dddice_RoomSlug: slug
    }, { merge: true })
  }

  public async getRoom(): Promise<string> {
    const docRef = doc(this.firebaseService.database, 'users', getAuth().currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data()['dddice_RoomSlug'];
    } else {
      return '';
    }
  }

  public async destroyRoom() {
    const docRef = doc(this.firebaseService.database, 'users', getAuth().currentUser.uid);
    return await setDoc(docRef, {
      dddice_RoomSlug: ''
    }, { merge: true })
  }

  public async updateCharacterSpell(): Promise<any> {
    this.getCharacters().then((characters) => {
      characters.forEach((character) => {
        if (character.magia) {
          character.magia.trucchettiIncantesimi.forEach((spell: any) => {
            spell.preparato = false;
            spell.filtered = false;
            spell.icon = '';
          });

          characters.forEach((character) => {
            const docRef = doc(this.firebaseService.database, 'characters', character.id);
            setDoc(docRef, character, { merge: true });
          });
        }
      });
    });
  }

  public async getRollTheme(): Promise<string> {
    const userId = getAuth().currentUser.uid;
    const docRef = doc(this.firebaseService.database, 'users', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data()['rollTheme']) {
      return docSnap.data()['rollTheme'];
    } else {
      return 'dungeonscompanion2023-enemy-lp882vo8';
    }
  }

  public async setRollTheme(theme: string): Promise<any> {
    const userId = getAuth().currentUser.uid;
    const docRef = doc(this.firebaseService.database, 'users', userId);
    return await setDoc(docRef, {
      rollTheme: theme
    }, { merge: true });
  }
}
