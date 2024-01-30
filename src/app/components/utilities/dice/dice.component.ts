import { Component } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { RollDiceService } from 'src/app/services/roll-dice.service';

@Component({
  selector: 'app-dice',
  templateUrl: './dice.component.html',
  styleUrls: ['./dice.component.scss']
})
export class DiceComponent {

  constructor(
    private _diceSelector: MatBottomSheetRef<DiceComponent>,
    private dddiceRollService: RollDiceService
  ) { }

  public open: boolean = false;
  public dices: any = [
    {
      icon: "./assets/dice/dice-d4.svg",
      value: "d4",
    },
    {
      icon: "./assets/dice/dice-d6.svg",
      value: "d6",
    },
    {
      icon: "./assets/dice/dice-d8.svg",
      value: "d8",
    },
    {
      icon: "./assets/dice/dice-d10.svg",
      value: "d10",
    },
    {
      icon: "./assets/dice/dice-d10x.svg",
      value: "d10x",
    },
    {
      icon: "./assets/dice/dice-d12.svg",
      value: "d12",
    },
    {
      icon: "./assets/dice/dice-d20.svg",
      value: "d20",
    }
  ];
  public modifiers: any =
    {
      positive: [
        {
          name: "+5",
          value: 5
        },
        {
          name: "+3",
          value: 3
        },
        {
          name: "+1",
          value: 1
        }
      ],
      negative: [
        {
          name: "-1",
          value: -1
        },
        {
          name: "-3",
          value: -3
        },
        {
          name: "-5",
          value: -5
        },

      ],
      special: [
        {
          name: "adv",
          value: "adv",
          icon: "./assets/dice/adv.png"
        },
        {
          name: "dis",
          value: "dis",
          icon: "./assets/dice/dis.png"
        },
      ]
    };

  public dicesSelected: string[] = [];
  public selectedDices: string = "";
  public isRollActive: boolean = false;
  public rollType: string = "";

  public modifiersLabel: string = "";
  private modTotal: number = 0;


  public addDiceToRoll(diceValue: string,) {
    if (diceValue === "d10x") {
      this.rollType = "d10x";
      this.isRollActive = true;
      this.selectedDices = "1d100";
      this.countDice();
    } else {
      this.isRollActive = false;
      if (this.dicesSelected.length < 20) {
        this.dicesSelected.push(diceValue);
      }
      this.selectedDices = "";
      this.countDice();
    }

  }

  private countDice() {
    let count = this.dicesSelected.reduce(function (acc, curr) {
      return (
        acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc
      );
    }, {});
    for (const key in count) {
      if (this.selectedDices.length > 0) {
        this.selectedDices += " + "
      }
      this.selectedDices += count[key] + key;
      this.isRollActive = true;
    }
  }

  public addModifier(mod: number) {
    this.modifiersLabel = "";
    this.modTotal += mod;
    this.modifiersLabel += (this.modTotal < 0 ? " - " : " + ") + Math.abs(this.modTotal);
  }

  public addSpecialModifier(modValue: string) {
    modValue == "adv" ? this.selectedDices = "Tiro con Vantaggio" : this.selectedDices = "Tiro con Svantaggio";
    this.rollType = modValue; // adv or dis
    this.isRollActive = true
  }

  public rollDice(event: any) {
    this.closeDiceSheet(event);
    switch (this.rollType) {
      case "adv":
        this.dddiceRollService.rollAdvantageDisadvantage(this.rollType, this.modTotal);
        break;
      case "dis":
        this.dddiceRollService.rollAdvantageDisadvantage(this.rollType, this.modTotal);
        break;
      case "d10x":
        this.dddiceRollService.rollD100(this.modTotal);
        break;
      default:
        this.dddiceRollService.rollDice(this.dicesSelected, (this.selectedDices + this.modifiersLabel), this.modTotal);
        break;
    }

    // if (this.rollType !== '') {
    //   this.dddiceRollService.rollAdvantageDisadvantage(this.rollType, this.modTotal);
    // } else {
    //   this.dddiceRollService.rollDice(this.dicesSelected, (this.selectedDices + this.modifiersLabel), this.modTotal);
    // }
  }

  public closeDiceSheet(event: any) {
    this._diceSelector.dismiss();
    event.preventDefault();
  }
}