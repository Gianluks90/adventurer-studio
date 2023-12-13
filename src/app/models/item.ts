export class Item {
    name: string;
    icon: string;
    filtered: boolean;
    quantity: number;
    description?: string;
    cost?: number;

    constructor(name: string, icon: string, filtered: boolean, quantity: number, description?: string, cost?: number) {
        this.name = name;
        this.icon = icon;
        this.filtered = filtered;
        this.quantity = quantity;
        this.description = description;
        this.cost = cost;
    }

    static createEmpty() {
        return new Item('', '', false, 0, '');
    }

    static create(name: string, icon: string, filtered: boolean, quantity: number, description?: string, cost?: number) {
        return new Item(name, icon, filtered, quantity, description, cost);
    }

    static createFrom(item: Item) {
        return new Item(item.name, item.icon, item.filtered, item.quantity, item.description, item.cost);
    }
}