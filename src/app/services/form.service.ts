import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { FormModel } from 'src/app/models/formModel';
import { FirebaseService } from './firebase.service';
import { CharacterService } from './character.service';
import { doc, setDoc, updateDoc } from 'firebase/firestore';

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

}
