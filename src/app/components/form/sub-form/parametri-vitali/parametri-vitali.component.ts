import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-parametri-vitali',
  templateUrl: './parametri-vitali.component.html',
  styleUrls: ['./parametri-vitali.component.scss']
})
export class ParametriVitaliComponent {
  public group: FormGroup | null = null;
  public group2: FormGroup | null = null;
  public group3: FormGroup | null = null;
  public group4: FormGroup | null = null;

  constructor(public formService: FormService) {}

  ngOnInit(): void {
    this.formService.formSubject.subscribe((form: any) => {
      if (form) {
        this.group = form.get('CA') as FormGroup;
        this.group2 = form.get('iniziativa') as FormGroup;
        this.group3 = form.get('velocita') as FormGroup;
        this.group4 = form.get('puntiFerita') as FormGroup;
      }
    });
  }
}
