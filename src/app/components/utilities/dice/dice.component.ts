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
  public diceInformationList: any = [
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
      value: "d100",
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
  public modifierInformationList: any =
    {
      positive: [
        {
          name: "adv",
          value: "adv",
          icon: "./assets/dice/adv.png"
        },
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
        {
          name: "dis",
          value: "dis",
          icon: "./assets/dice/dis.png"
        },
      ]
    };

  public diceSelectedList: string[] = [];
  public selectedDiceResult: string = "";
  public modifier: string = "";
  private modTotal: number = 0;
  public typeOfLaunch: string = "";
  public activeRoll: boolean = false;


  public addDiceToRoll(diceValue: string,) {
    this.activeRoll = false;
    if (this.diceSelectedList.length < 20) {
      this.diceSelectedList.push(diceValue);
    }
    this.selectedDiceResult = "";
    this.countDice();
  }

  private countDice() {
    let count = this.diceSelectedList.reduce(function (value, value2) {
      return (
        value[value2] ? ++value[value2] : (value[value2] = 1), value
      );
    }, {});
    for (const key in count) {
      if (this.selectedDiceResult.length > 0) {
        this.selectedDiceResult += " + "
      }
      this.selectedDiceResult += count[key] + key;
      this.activeRoll = true;
    }
  }

  public addModifier(modValue: number | string) {
    if (modValue == "adv" || modValue == "dis") {
      this.typeOfLaunch = modValue;
      this.activeRoll = true
    } else if (typeof modValue == "number") {
      this.modifier = "";
      this.modTotal += modValue;
      this.modifier += (this.modTotal < 0 ? " - " : " + ") + Math.abs(this.modTotal);
    }
  }

  public rollDice(event: any) {
    this.closeDiceSheet(event);
    if (this.typeOfLaunch) {
      this.dddiceRollService.rollAdvantageDisadvantage(this.typeOfLaunch, this.modTotal);
    } else {
      this.dddiceRollService.rollDice(this.diceSelectedList, this.modTotal);
    }
  }

  public closeDiceSheet(event: any) {
    this._diceSelector.dismiss();
    event.preventDefault();
  }
}