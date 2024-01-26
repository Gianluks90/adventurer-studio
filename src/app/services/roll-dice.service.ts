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

  public async rollDice(dices: string[], diceFormula: string, modifier?: number): Promise<any> {
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
          const finalResult = Number(result.data.total_value) + modifier;
          this.notification.openDiceSnackBar("Ottenuto: " + diceFormula + " = " + finalResult, "casino");
        });
      });
    }
  }

  public async rollFromCharView(dice: string, message: string, modifier?: number): Promise<any> {
    const DDDICE = this.dddice.dddice;
    if (DDDICE) {
      DDDICE.roll(
        [{
          theme: this.diceTheme != '' ? this.diceTheme : 'dddice-black',
          type: dice,
        }]
      ).then((result) => {
        DDDICE.on(ThreeDDiceRollEvent.RollFinished, () => {
          const finalResult = Number(result.data.total_value) + (modifier || 0) ;
          let diceFormula = '';
          if (modifier) {
            diceFormula = dice + (modifier > 0 ? ' + ' + modifier : modifier);
          } else {
            diceFormula = dice;
          }
          this.notification.openDiceSnackBar(message + " (" + diceFormula + "), ottenuto: " + finalResult, "casino", 5000);
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

  public async rollAdvantageDisadvantage(rollType: string, modifier?: number): Promise<any> {
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
        let finalResult = 0;
        if (rollType === "adv") {
          rollResult = result.data.values[0].value > result.data.values[1].value ? result.data.values[0].value : result.data.values[1].value;
          finalResult = rollResult + modifier;
          DDDICE.on(ThreeDDiceRollEvent.RollFinished, () => {
            this.notification.openSnackBar("Ottenuto: " + rollResult + (modifier > 0 ? ' + ' + modifier : modifier) + " = " + finalResult, "casino");
          });
        } else {
          rollResult = result.data.values[0].value < result.data.values[1].value ? result.data.values[0].value : result.data.values[1].value;
          finalResult = rollResult + modifier;
          DDDICE.on(ThreeDDiceRollEvent.RollFinished, () => {
            this.notification.openSnackBar("Ottenuto: " + rollResult + (modifier > 0 ? ' + ' + modifier : modifier) + " = " + finalResult, "casino");
          });
        }
      });
    }
  }


}
