import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-basic-information',
  templateUrl: './basic-information.component.html',
  styleUrls: ['./basic-information.component.scss']
})
export class BasicInformationComponent {
  public group: FormGroup | null = null;
  constructor(public formService: FormService) { }

  ngOnInit(): void {
    this.formService.formSubject.subscribe((form: any) => {
      this.group = form.get('informazioniBase') as FormGroup;
     });
  }
}
