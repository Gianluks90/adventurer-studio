import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-tiri-salvezza',
  templateUrl: './tiri-salvezza.component.html',
  styleUrls: ['./tiri-salvezza.component.scss']
})
export class TiriSalvezzaComponent {

  public group: FormGroup | null = null;
  public group2: FormGroup | null = null;

  constructor(public formService: FormService) {}

  ngOnInit(): void {
    this.formService.formSubject.subscribe((form: any) => {
      if (form) {
        this.group = form.get('bonusCompetenza') as FormGroup;
        this.group2 = form.get('caratteristiche') as FormGroup;
      }
    });
  }
}
