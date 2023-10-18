import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { FormModel } from 'src/app/models/formModel';
import { FirebaseService } from './firebase.service';
import { CharacterService } from './character.service';
import { doc, setDoc } from 'firebase/firestore';
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
      this.nestedPatchValue(tempForm, character);
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

  public async completeForm(charId: string, form: FormGroup): Promise<void> {
    const docRef = doc(this.firebaseService.database, 'characters', charId);
    return await setDoc(docRef, {
      ...form.value,
      status: {
        draft: false,
        complete: true
      }
    }, {
      merge:true
    });
  }


  public async uploadImage(event: any): Promise<string> {
    const file: File = event.target.files[0];
    const imageRef = ref(this.firebaseService.storage, 'characterImages/' + file.name);
    return await uploadBytes(imageRef, file).then(async () => {
      return await getDownloadURL(imageRef).then((url) => {
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

  private nestedPatchValue(form: FormGroup, character: any) {
    Object.keys(character).forEach(key => {
      const control = form.get(key);
      if (control) {
        if (control instanceof FormGroup) {
          this.nestedPatchValue(control, character[key]);
        } else if (control instanceof FormArray) {
          character[key].forEach((m: any) => {
            const group = this.createFormGroup(m);
            control.push(group);

            // control.push(this.fb.group(m));
          });
        } else {
          control!.patchValue(character[key]);
        }
      }
    });
  }

  public createFormGroup(model: any) {
    const formGroup = this.fb.group({});
    Object.keys(model).forEach(key => {
      // if (model[key] instanceof Array) {
      //   formGroup.setControl(key, this.fb.array(model[key].map((m: any) => this.createFormGroup(m))));
      if (model[key] instanceof Array) {
        const array = this.fb.array(model[key].map((m: any) => this.createFormGroup(m)));
        formGroup.addControl(key, array);
      } else if (model[key] instanceof Object) {
        formGroup.setControl(key, this.createFormGroup(model[key]));
      } else {
        formGroup.setControl(key, this.fb.control(model[key]));
      }
    });
    return formGroup;
  }

}
