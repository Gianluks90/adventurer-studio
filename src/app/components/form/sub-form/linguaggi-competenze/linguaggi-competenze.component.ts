import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-linguaggi-competenze',
  templateUrl: './linguaggi-competenze.component.html',
  styleUrls: ['./linguaggi-competenze.component.scss']
})
export class LinguaggiCompetenzeComponent {
  public group: FormGroup | null = null;

  constructor(public formService: FormService) {}

  ngOnInit(): void {
    this.formService.formSubject.subscribe((form: any) => {
      if (form) {
        this.group = form.get('altreCompetenze') as FormGroup;
      }
    });
  }
}
