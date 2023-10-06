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
  public groupVita: FormGroup | null = null;
  public modDestrezza: number = 0;

  constructor(public formService: FormService) {}

  ngOnInit(): void {
    this.formService.formSubject.subscribe((form: any) => {
      if (form) {
        this.group = form as FormGroup;
        this.groupVita = form.get('puntiFerita') as FormGroup;

        this.group.get('caratteristiche')?.valueChanges.subscribe((value: any) => {
          this.modDestrezza = Math.floor((value.destrezza - 10) / 2);
          this.group?.get('iniziativa')?.setValue(this.modDestrezza);
        });
      }
    });
  }
}
