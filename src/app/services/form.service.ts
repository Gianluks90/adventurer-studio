import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { FormModel } from 'src/app/models/formModel';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  public form: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private fb: FormBuilder, private firebaseService: FirebaseService) {
    this.form.next(this.fb.group(FormModel.create(this.fb)));
    this.createForm();
  }

  public createForm(): any {
    return this.form.value;
  }

  
}
