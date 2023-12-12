import { FormArray, FormBuilder } from "@angular/forms";
import { Item } from "./item";

/** 
 * Modello per Armature e Scudi
 */
export class Armor extends Item {
    CA?: number;
    stregthRequest?: number;
    stealthAdvantage?: boolean;
    weight?: number;

    constructor(name: string, icon: string, filtered: boolean, quantity: number, description?: string, CA?: number, stregthRequest?: number, stealthAdvantage?: boolean, weight?: number) {
        super(name, icon, filtered, quantity, description);
        this.CA = CA;
        this.stregthRequest = stregthRequest;
        this.stealthAdvantage = stealthAdvantage;
        this.weight = weight;
    }

    static override createEmpty() {
        return new Armor('', '', false, 0, '', 0, 0, false, 0);
    }

    static override create(name: string, icon: string, filtered: boolean, quantity: number, description?: string, CA?: number, stregthRequest?: number, stealthAdvantage?: boolean, weight?: number) {
        return new Armor(name, icon, filtered, quantity, description, CA, stregthRequest, stealthAdvantage, weight);
    }

    static override createFrom(item: Item) {
        return new Armor(item.name, item.icon, item.filtered, item.quantity, item.description);
    }
}

/**
 * Modello per Armi
 */
export class Weapon extends Item {
    weaponType?: string;
    damageFormula?: string;
    damageType?: string;
    weight?: number;
    properties?: string[];

    constructor(name: string, icon: string, filtered: boolean, quantity: number, description?: string, weaponType?: string, damageFormula?: string, damageType?: string, weight?: number, properties?: string[]) {
        super(name, icon, filtered, quantity, description);
        this.weaponType = weaponType;
        this.damageFormula = damageFormula;
        this.damageType = damageType;
        this.weight = weight;
        this.properties = properties;
    }

    static override createEmpty() {
        return new Weapon('', '', false, 0, '', '', '', '', 0, []);
    }

    static override create(name: string, icon: string, filtered: boolean, quantity: number, description?: string, weaponType?: string, damageFormula?: string, damageType?: string, weight?: number, properties?: string[]) {
        return new Weapon(name, icon, filtered, quantity, description, weaponType, damageFormula, damageType, weight, properties);
    }

    static override createFrom(item: Item) {
        return new Weapon(item.name, item.icon, item.filtered, item.quantity, item.description);
    }
}

/**
 * Modello per Oggetti Magici e Artefatti
 */
export class MagicItem extends Item {
    ref?: string;
    rarity?: string;
    attunementRequired?: boolean;
    weight?: number;
    properties?: FormArray;

    constructor(private fb: FormBuilder, name: string, icon: string, filtered: boolean, quantity: number, ref?: string, description?: string, rarity?: string, attunementRequired?: boolean, weight?: number) {
        super(name, icon, filtered, quantity, description);
        this.ref = ref;
        this.rarity = rarity;
        this.attunementRequired = attunementRequired;
        this.weight = weight;
        this.properties = this.fb.array([]);
    }

    static addProperty(fb: FormBuilder, properties: FormArray, name: string, description: string) {
        properties.push(fb.group({
            name: [name],
            description: [description]
        }));
    }

    static deleteProperty(properties: FormArray, index: number) {
        properties.removeAt(index);
    }
}

