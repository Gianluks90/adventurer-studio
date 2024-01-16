import { Injectable } from '@angular/core';
import { DddiceService } from './dddice.service';
import { NotificationService } from './notification.service';
import { ThreeDDiceRollEvent } from 'dddice-js';

@Injectable({
  providedIn: 'root'
})
export class RollDiceService {

  // public diceTheme: string = "dddice-black";
  public diceTheme: string = "dungeonscompanion2023-enemy-lp882vo8";

  constructor(private dddice: DddiceService, private notification: NotificationService) { }

  public async rollDice(dices: string[], modifier?: number): Promise<any> {
    const DDDICE = this.dddice.dddice;
    if (DDDICE) {
      DDDICE.roll(
        dices.map((dice) => {
          return {
            theme: this.diceTheme != '' ? this.diceTheme : 'dddice-black',
            type: dice,
          }
        })
      ).then((result) => {
        // this.notification.dismissSnackBar();
        DDDICE.on(ThreeDDiceRollEvent.RollFinished, () => {
          const message = (result.data.values.map((value: any) => (modifier) ? value.value + modifier : value.value).join(", ")) + (result.data.values.length > 1 ? " = " + result.data.total_value : "");
          this.notification.openDiceSnackBar("Ottenuto: " + message, "casino");
        });
      });
    }
  }

  public async rollSpecificDice(dice: string, modifier?: number): Promise<any> {
    const DDDICE = this.dddice.dddice;
    if (DDDICE) {
      DDDICE.roll(
        [{
          theme: this.diceTheme != '' ? this.diceTheme : 'dddice-black',
          type: dice,
        }]
      ).then((result) => {
        // this.notification.dismissSnackBar();
        DDDICE.on(ThreeDDiceRollEvent.RollFinished, () => {
          const message = (Number(result.data.total_value) + modifier);
          this.notification.openDiceSnackBar("Ottenuto: " + message, "casino");
        });
      });
    }
  }

  public async rollD100(modifier?: number): Promise<any> {
    const DDDICE = this.dddice.dddice;
    if (DDDICE) {
      DDDICE.roll(
        [{
          theme: this.diceTheme != '' ? this.diceTheme : 'dddice-black',
          type: "d10",
        }, {
          theme: this.diceTheme != '' ? this.diceTheme : 'dddice-black',
          type: "d10x",
        }]
      ).then((result) => {
        // this.notification.dismissSnackBar();
        DDDICE.on(ThreeDDiceRollEvent.RollFinished, () => {
          const message = (Number(result.data.total_value) + modifier);
          this.notification.openDiceSnackBar("Ottenuto: " + message, "casino");
        });
      });
    }
  }

  public async rollAdvantageDisadvantage(mode: string, modifier?: number): Promise<any> {
    const DDDICE = this.dddice.dddice;
    if (DDDICE) {
      DDDICE.roll(
        [{
          theme: this.diceTheme != '' ? this.diceTheme : 'dddice-black',
          type: "d20", 
        },
        {
          theme: this.diceTheme != '' ? this.diceTheme : 'dddice-black',
          type: "d20", 
        }
      ]).then((result) => {
        let rollResult = 0;
        if (mode === "adv") {
          result.data.values.map(value => {
            rollResult = value.value;
            value.value > rollResult ? rollResult = value.value : rollResult = rollResult
          });
          this.notification.openSnackBar("Ottenuto: " + rollResult, "casino");
        } else {
          result.data.values.map(value => {
            rollResult = value.value;
            value.value < rollResult ? rollResult = value.value : rollResult = rollResult
          });
          this.notification.openSnackBar("Ottenuto: " + rollResult, "casino");
        }
      });
    }
  }


}
