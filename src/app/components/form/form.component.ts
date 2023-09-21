import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormModel } from 'src/app/models/formModel';
import { CharacterService } from 'src/app/services/character.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  public form: FormGroup = this.fb.group(FormModel.create(this.fb))

  constructor(private characterService: CharacterService, private fb:FormBuilder) {}

  ngOnInit(): void {
    const characterId = window.location.href.split('/').pop();
    console.log('character',characterId);

    this.characterService.getCharacterById(characterId!).then((character) => {
      this.form.patchValue(character);
      // this.form.get('basicInformation')?.setValue(character.basicInformation)
      console.log('FORM', this.form);
      console.log('CHAR', character);
    });
  }
}
