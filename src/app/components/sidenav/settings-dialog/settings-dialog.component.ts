import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CharacterService } from 'src/app/services/character.service';
import { DddiceService } from 'src/app/services/dddice.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { RollDiceService } from 'src/app/services/roll-dice.service';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrl: './settings-dialog.component.scss'
})
export class SettingsDialogComponent {

  public activationCode: string = "";
  private activationResult: any = null;

  constructor(
    private dialogRef: MatDialogRef<SettingsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { dddiceToken: string, privateSlug: string },
    public dddice: DddiceService,
    public firebaseService: FirebaseService, private characterService: CharacterService) { }

    ngOnInit() {
      // if(this.data.dddiceToken) {
      //   this.dddice.dddiceInit(this.data.dddiceToken).then((dddice) => {
      //     this.dddice.authenticated.next(true);
      //     if (this.data.privateSlug) {
      //       dddice.connect(this.data.privateSlug);

      //     }
      //   }).catch((error) => { this.dddice.authenticated.next(false); })
      // }
    }

    public getActivationCode() {
      this.dddice.getActivationCode().then((result) => {
        this.activationCode = result.data.code;
        const myInterval = setInterval(() => {
          if (this.activationResult == null) {
            this.dddice.readActivationCode(result.data.code, result.data.secret).then((response) => {
              this.activationResult = response.data.token === undefined ? null : response;
            });
          } else {
            clearInterval(myInterval);
            this.dddice.dddiceInit(this.activationResult.data.token).then((dddice) => {
              this.dddice.createRoom(this.activationResult.data.token).then((room) => {
                dddice.connect(room.data.slug);
                this.firebaseService.updateUserDddice(this.activationResult.data.token, room.data.slug);
              });
              this.dddice.authenticated.next(true);
              this.activationCode = "";
            }).catch((error) => { this.dddice.authenticated.next(false); })
          }
        }, 5000);
      }).catch((error) => console.log(error));
    }

    public resetStatusAllCharacter(){
      let allcharacters = []
      this.characterService.getCharacters().then((characters)=>{
        allcharacters = characters;
        // allcharacters.push(characters[0]);
        allcharacters.forEach(character => {
          this.characterService.updateCharacterStatus(character.id);
        });
      });

    }
}
