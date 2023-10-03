import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FormModel } from 'src/app/models/formModel';
import { CharacterService } from 'src/app/services/character.service';

@Component({
  selector: 'app-add-character-dialog',
  templateUrl: './add-character-dialog.component.html',
  styleUrls: ['./add-character-dialog.component.scss']
})
export class AddCharacterDialogComponent {

  constructor(
    private fb: FormBuilder,
    private characterService: CharacterService,
    public dialogRef: MatDialogRef<AddCharacterDialogComponent>,) { }

  public form: FormGroup = this.fb.group(FormModel.create(this.fb))
  public charForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(4)]]
  });

  public confirm() {
    this.form.get('informazioniBase')?.get('nomePersonaggio')?.setValue(this.charForm.value.name);
    this.characterService.createCharacter(this.form).then(() => {
    }).then(() => {
      this.dialogRef.close('confirm');
    })
  }
}
