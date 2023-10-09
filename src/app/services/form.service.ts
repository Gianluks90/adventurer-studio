import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { FormModel } from 'src/app/models/formModel';
import { FirebaseService } from './firebase.service';
import { CharacterService } from './character.service';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  public formSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private characterService: CharacterService) {
  }


  public initForm(charId: string): void {
    const tempForm = this.fb.group(FormModel.create(this.fb));
    this.characterService.getCharacterById(charId).then((character) => {
      tempForm.patchValue(character);
      this.formSubject.next(tempForm);
    });
  }

  public async saveDraft(charId: string, form: FormGroup): Promise<void> {
    const docRef = doc(this.firebaseService.database, 'characters', charId);
    return await setDoc(docRef, {
      ...form.value,
      status: {
        draft: true
      }
    }, {
      merge:true
    });
  }


  public async uploadImage(event: any): Promise<string> {
    console.log(event.target.files[0]);
    const file: File = event.target.files[0];
    const imageRef = ref(this.firebaseService.storage, 'characterImages/' + file.name);
    return await uploadBytes(imageRef, file).then(async () => {
      return await getDownloadURL(imageRef).then((url) => {
        console.log(url);
        return url;
      }).catch((error) => {
        console.log(error);
        alert('Errore nel caricamento dell\'immagine');
        return 'error';
      });
    }).catch((error) => {
      console.log(error);
      alert('Errore nel caricamento dell\'immagine');
      return 'error';
    });
  }

  public async deleteImage(nomeImmagine: string): Promise<string> {
    const imageRef = ref(this.firebaseService.storage, 'characterImages/' + nomeImmagine);
    return deleteObject(imageRef).then(() => {
      return 'success';
    }).catch((error) => {
      console.log(error);
      alert('Errore nell\'eliminazione dell\'immagine');
      return 'error';
    });
  }

}
