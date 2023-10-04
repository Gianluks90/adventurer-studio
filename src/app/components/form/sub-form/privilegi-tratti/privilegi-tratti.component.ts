import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-privilegi-tratti',
  templateUrl: './privilegi-tratti.component.html',
  styleUrls: ['./privilegi-tratti.component.scss']
})
export class PrivilegiTrattiComponent {
  public group: FormGroup | null = null;
  public group2: FormGroup | null = null;

  constructor(public formService: FormService) {}

  ngOnInit(): void {
    this.formService.formSubject.subscribe((form: any) => {
      if (form) {
        this.group = form.get('privilegiTratti') as FormGroup;
        console.log(this.group.value);

      }
    });
  }
}
