import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-abilita',
  templateUrl: './abilita.component.html',
  styleUrls: ['./abilita.component.scss']
})
export class AbilitaComponent {
  public group: FormGroup | null = null;

  constructor(public formService: FormService) {}

  ngOnInit(): void {
    this.formService.formSubject.subscribe((form: any) => {
      if (form) {
        this.group = form.get('competenzaAbilita') as FormGroup;
      }
    });
  }
}
