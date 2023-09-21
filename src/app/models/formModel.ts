import { FormArray, FormBuilder, FormGroup } from "@angular/forms";

export class FormModel {

  constructor() { }

  static create(builder: FormBuilder) {
    return {
      basicInformation: FormModel.basicInformation(builder),
      abilityScores: FormModel.abilityScores(builder),
      proficiencyBonus: 2,
      savingThrows: FormModel.savingThrows(builder),
      // skills: FormModel.skills(builder),
      status: {
        statusCode: '' // B - Bozza, C - Completata
      }
    }
  }

  static basicInformation(builder: FormBuilder) {
    return builder.group({
      playerName:'',
      classLevel: '',
      background: '',
      race: '',
      alignment: '',
      characterName:''
    })
  }

  static abilityScores(builder: FormBuilder) {
    return builder.group({
      strength: '',
      dexterity: '',
      constitution: '',
      intelligence: '',
      wisdom: '',
      charisma: ''
    })
  }

  static savingThrows(builder: FormBuilder) {
    return builder.group({
      strength: false,
      dexterity: false,
      constitution: false,
      intelligence: false,
      wisdom: false,
      charisma: false
    })
  }

  // static skills(builder: FormBuilder) {
  //   return builder.group({

  //   })
  // }
}
