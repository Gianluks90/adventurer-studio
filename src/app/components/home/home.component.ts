import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { getAuth } from 'firebase/auth';
import { FormModel } from 'src/app/models/formModel';
import { CharacterService } from 'src/app/services/character.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  public form : FormGroup = this.fb.group(FormModel.create(this.fb))

  constructor(public firebaseService: FirebaseService, private charService: CharacterService, private fb:FormBuilder, private router:Router) {}

  public logout() {
    getAuth().signOut();
    // window.location.reload();
  }

  public createCharacter(){
      this.charService.createCharacter(this.form).then(()=> {
        this.router.navigate(['/edit', this.firebaseService.user.value!.id + '-' + (this.firebaseService.user.value!.progressive + 1)]);
        console.log('Character created');
      })
  }
}
