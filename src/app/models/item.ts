export class Item {
    name: string;
    icon: string;
    filtered: boolean;
    quantity: number;
    rarity: string;
    category: string;
    description?: string;
    value?: string;
    weight?: number;
    cursed?: boolean;
    cursedDescription?: string;
    traits: Trait[];
    attunementRequired?: boolean;
    attuned?: boolean;
    artifactProperties?: string[];
    reference?: string;

    constructor(name: string, icon: string, filtered: boolean, quantity: number, rarity: string, category: string, description?: string, value?: string, weight?: number, cursed?: boolean, cursedDescription?: string, traits?: Trait[], attunementRequired?: boolean, attuned?: boolean, artifactProperties?: string[], reference?: string) {
        this.name = name;
        this.icon = icon;
        this.filtered = filtered;
        this.quantity = quantity;
        this.rarity = rarity;
        this.category = category;
        this.description = description;
        this.value = value;
        this.weight = weight;
        this.cursed = cursed;
        this.cursedDescription = cursedDescription;
        this.traits = traits;
        this.attunementRequired = attunementRequired;
        this.attuned = attuned;
        this.artifactProperties = artifactProperties;
        this.reference = reference;
    }

    static parseFromData(data: any): Item {
        return new Item(data.name, data.icon, data.filtered, data.quantity, data.rarity, data.category, data.description, data.value, data.weight, data.cursed, data.cursedDescription, data.traits, data.attunementRequired, data.attuned, data.artifactProperties, data.reference);
    }
}

export class Trait {
    title: string;
    description: string;
}

export class Armor extends Item {
    CA: number;
    stelthDisadvantage: boolean;

    constructor(name: string, icon: string, filtered: boolean, quantity: number, rarity: string, category: string, description?: string, value?: string, weight?: number, cursed?: boolean, cursedDescription?: string, traits?: Trait[], attunementRequired?: boolean, attuned?: boolean, artifactProperties?: string[], reference?: string, CA?: number, stelthDisadvantage?: boolean) {
        super(name, icon, filtered, quantity, rarity, category, description, value, weight, cursed, cursedDescription, traits, attunementRequired, attuned, artifactProperties, reference);
        this.CA = CA;
        this.stelthDisadvantage = stelthDisadvantage;
    }
}

export class Weapon extends Item {
    damageFormula: string;
    damageType: string;
    weaponProperties: string[];

    constructor(name: string, icon: string, filtered: boolean, quantity: number, rarity: string, category: string, description?: string, value?: string, weight?: number, cursed?: boolean, cursedDescription?: string, traits?: Trait[], attunementRequired?: boolean, attuned?: boolean, artifactProperties?: string[], reference?: string, damageFormula?: string, damageType?: string, weaponProperties?: string[]) {
        super(name, icon, filtered, quantity, rarity, category, description, value, weight, cursed, cursedDescription, traits, attunementRequired, attuned, artifactProperties, reference);
        this.damageFormula = damageFormula;
        this.damageType = damageType;
        this.weaponProperties = weaponProperties;
    }
}