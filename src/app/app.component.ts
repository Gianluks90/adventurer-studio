import { Component } from '@angular/core';
import { FirebaseService } from './services/firebase.service';
import { FormService } from './services/form.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'dndCharacterSheet';

  constructor(public firebaseService: FirebaseService, private formService: FormService) {}

  public saveDraft(): void {
    const charId = window.location.href.split('/').pop();
    this.formService.saveDraft(charId!, this.formService.formSubject.value).then(() => {
      alert('Salvataggio effettuato');
    })
  }

}
