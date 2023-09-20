import { FormArray, FormBuilder, FormGroup } from "@angular/forms";

export class FormModel {

  constructor() { }

  static create(builder: FormBuilder) {
    return {
      basicInformation: FormModel.basicInformation(builder),
      status: {
        statusCode: '' // B - Bozza, C - Completata
      }
    }
  }

  // start basic information (organisational)
  static basicInformation(builder: FormBuilder) {
    return builder.group({
      name:'',
      characterName:''
    })
  }
}
