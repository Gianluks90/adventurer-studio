import { Component, Inject, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdventurerUser, Role } from 'src/app/models/adventurerUser';
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
  public isAdmin: boolean = false;

  public form: FormGroup = this.fb.group({
    rollTheme: ['dungeonscompanion2023-enemy-lp882vo8', Validators.required],
  });

  public user: AdventurerUser | null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { dddiceToken: string, privateSlug: string },
    public dddice: DddiceService,
    public rollService: RollDiceService,
    private firebaseService: FirebaseService,
    private characterService: CharacterService,
    private fb: FormBuilder) {
      effect(() => {
        this.user = this.firebaseService.userSignal();
        if (this.user && this.user.role === Role.ADMIN) {
          this.isAdmin = true;
        }
      });
    }

  ngOnInit() {
    this.getTheme();
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
            this.dddice.createRoom(this.activationResult.data.token, 'adventurerStudioUserRoom', "*******").then((room) => {
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

  public resetStatusAllCharacter() {
    let allcharacters = []
    this.characterService.getCharacters().then((characters) => {
      allcharacters = characters;
      // allcharacters.push(characters[0]);
      allcharacters.forEach(character => {
        this.characterService.adminCharUpdate(character.id);
      });
    });
  }

  public resetSpellCharacters() {
    this.characterService.updateCharacterSpell();
  }

  public updateUserCampaigns() {
    this.firebaseService.getThenUpdateAllUsers();
  }

  public getTheme() {
    this.characterService.getRollTheme().then((theme) => {
      this.form.patchValue({ rollTheme: theme });
    });
  }

  public setDiceTheme() {
    const diceTheme = this.form.value.rollTheme.split('/').pop();
    this.form.patchValue({ rollTheme: diceTheme });
    this.characterService.setRollTheme(diceTheme).then(() => {
      this.rollService.diceTheme = diceTheme;
      this.rollService.testRoll();
    });
  }

  public resetTheme() {
    this.form.patchValue({ rollTheme: 'dungeonscompanion2023-enemy-lp882vo8' });
    this.setDiceTheme();
  }
}
