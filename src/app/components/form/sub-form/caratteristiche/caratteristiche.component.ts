import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-caratteristiche',
  templateUrl: './caratteristiche.component.html',
  styleUrls: ['./caratteristiche.component.scss']
})
export class CaratteristicheComponent {
  public group: FormGroup | null = null;

  constructor(public formService: FormService) {}

  ngOnInit(): void {
    this.formService.formSubject.subscribe((form: any) => {
      if (form) {
        this.group = form.get('tiriSalvezza') as FormGroup;
      }
    });
  }
}
