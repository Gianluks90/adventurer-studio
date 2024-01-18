import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { getAuth } from 'firebase/auth';
import { CampaignService } from 'src/app/services/campaign.service';
import { CharacterService } from 'src/app/services/character.service';

export interface Character {
  name: string;
  id: string;
}

@Component({
  selector: 'app-ticket-campaign-dialog',
  templateUrl: './ticket-campaign-dialog.component.html',
  styleUrl: './ticket-campaign-dialog.component.scss'
})
export class TicketCampaignDialogComponent {


  public checked: boolean = false;
  public characters: Character[] = [];

  public campForm = this.fb.group({
    id: ['', [Validators.required, Validators.minLength(1)]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
  });

  public charForm = this.fb.group({
    selected: ['', Validators.required],
  });

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<TicketCampaignDialogComponent>, private campaignService: CampaignService, private characterService: CharacterService) { }

  public checkForm() {
    this.campaignService.checkCampaign(this.campForm.value.id, this.campForm.value.password).then((result) => {
      if (result) {
        this.checked = true;
        this.characterService.getCharactersByUserId(getAuth().currentUser.uid).then((result) => {
          result.map((character) => {
            this.characters.push({
              name: character.informazioniBase.nomePersonaggio,
              id: character.id
            });
          });
        });
      } else {
        this.campForm.controls.id.setErrors({ 'incorrect': true });
        this.campForm.controls.password.setErrors({ 'incorrect': true });
      }
    });
  }

  public confirm(): void {
    const userId = getAuth().currentUser.uid;
    const heroId = this.charForm.value.selected;
    this.campaignService.subscribeToCampaign(this.campForm.value.id, userId, heroId).then(() => {
      this.dialogRef.close({
        status: 'success'
      });
    });
  }

}
