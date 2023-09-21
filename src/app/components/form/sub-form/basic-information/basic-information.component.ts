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
  public isError: boolean = false;

  constructor(public formService: FormService) { }

  ngOnInit(): void {
    this.formService.form.subscribe(form => {
      this.group = form.get('basicInformation') as FormGroup;
      console.log('grouop',this.group);

     });

  }
}
