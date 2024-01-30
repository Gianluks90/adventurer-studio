import { FormBuilder, Validators } from "@angular/forms";

export class Attack {

    public name: string;
    public attackBonus: number;
    public damage: string;
    public damageType: string;
    public range: string;
    public notes: string;
    public cost: string;
    public icon: string;
    public filtered: boolean;

    constructor(name: string, attackBonus: number, damage: string, damageType: string, range: string, notes: string, cost: string, icon: string, filtered: boolean) {
        this.name = name;
        this.attackBonus = attackBonus;
        this.damage = damage;
        this.damageType = damageType;
        this.range = range;
        this.notes = notes;
        this.cost = cost;
        this.icon = icon;
        this.filtered = filtered;
    }

    static create(builder: FormBuilder) {
        return {
            name: ['', Validators.required],
            attackBonus: [0, Validators.required],
            damage: ['', Validators.required],
            damageType: ['', Validators.required],
            range: ['', Validators.required],
            notes: '',
            cost: '',
            icon: '',
            filtered: false
        }
    }
}
