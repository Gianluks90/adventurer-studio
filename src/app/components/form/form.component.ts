import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CharacterService } from 'src/app/services/character.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  
  public form: FormGroup = new FormGroup({});

  constructor(private characterService: CharacterService) {}

  ngOnInit(): void {
    const characterId = window.location.href.split('/').pop();
    this.characterService.getCharacterById(characterId!).then((character) => {
      this.form.patchValue(character);
      console.log('FORM', this.form);
      console.log('CHAR', character);
    });
  }
}
