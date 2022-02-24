
/**
 * Represents a partial ship
 */
export class ShipType {
    public ship_class: string;
    public type: string;
    public maxCargo: number;
    public loadingSpeed: number;
    public speed: number;
    public manufacturer:string;
    public plating: number;
    public weapons: number;
    constructor(ship_class:string, type:string, maxCargo:number, loadingSpeed:number, speed:number, manufacturer:string, plating:number, weapons:number) {
        this.ship_class = ship_class;
        this.type = type;
        this.maxCargo = maxCargo;
        this.loadingSpeed = loadingSpeed;
        this.speed = speed;
        this.manufacturer = manufacturer;
        this.plating = plating;
        this.weapons = weapons;
    }
}



/**
 * Ship dataclass
 */
export class Ship extends ShipType{
    public id:string;
    public location: any[];
    public coordinates:number[];
    public cargo: any[];
    public space: number;
    constructor(id:string, location:any[], x_pos:number, y_pos:number, cargo:any[], spaceAvailable:number, type:string, maxCargo:number, loadingSpeed:number, speed:number, manufacturer:string, plating:number, weapons:number) {
        const ship_class = type.slice(3);
        super(ship_class, type, maxCargo, loadingSpeed, speed, manufacturer, plating, weapons)
        this.id = id;
        this.location = location;
        this.coordinates = [x_pos, y_pos];
        this.cargo = cargo;
        this.space = spaceAvailable;

    }
    
}




export class MarketShip extends ShipType {
    public purchaseLocations: any[];
    public restrictedGoods:any[];
    constructor(type:string, ship_class:string, maxCargo:number, loadingSpeed:number, speed:number, manufacturer:string, plating:number, weapons:number, purchaseLocations:any[], restrictedGoods:any[]) {
        super(ship_class, type, maxCargo, loadingSpeed, speed, manufacturer, plating, weapons);
        this.purchaseLocations = purchaseLocations;
        this.restrictedGoods = restrictedGoods;

    }
}



export class SystemLocation {
    public type:string;
    public symbol:string;
    public name:string;
    public coordinates:number[];
    public allowsConstruction:boolean;
    public traits:string[];
    public dockedShips:any[];
    public messages: string[];
    constructor(symbol: string, type: string, name: string, x_pos: number, y_pos: number, allowsConstruction: boolean, traits: string[], dockedShips: any[], messages: string[]) {
        this.symbol = symbol;
        this.type = type;
        this.name = name;
        this.coordinates = [x_pos, y_pos];
        this.allowsConstruction = allowsConstruction;
        this.traits = traits;
        this.dockedShips = dockedShips;
        this.messages = messages;
    }

}
export class PurchaseLocation {
    public system:string | SystemLocation;
    public location:string | Location;
    public price:number;
    constructor(system: string | SystemLocation, location: string | Location, price: number) {
        this.system = system;
        this.location = location;
        this.price = price;
    }
}
/**
 * Representation of a good
 */
export class Good {
    public name:string;
    public symbol:string;
    public volume:number;
    constructor(name: string, symbol: string, volume: number) {
        this.name = name;
        this.volume = volume;
        this.symbol = symbol;
    }
}
/**
 * Representation of a loan
 */
export class LoanType {
    public type:string;
    public amount:number;
    public rate: number;
    public term:number;
    public collateralRequired:boolean;
    constructor(type: string, amount: number, rate: number, termInDays: number, collateralRequired: boolean) {
        this.type = type;
        this.amount = amount;
        this.rate = rate;
        this.term = termInDays;
        this.collateralRequired = collateralRequired;
    }
}
export class Listing {
    public symbol:string;
    public volumePerUnit:number;
    public pricePerUnit:number;
    public spread:number;
    public purchasePricePerUnit:number;
    public sellPricePerUnit:number;
    public quantityAvailable:number;
    constructor(symbol: string, volumePerUnit: number, pricePerUnit: number, spread: number, purchasePricePerUnit: number, sellPricePerUnit: number, quantityAvailable: number) {
        this.symbol = symbol;
        this.volumePerUnit = volumePerUnit;
        this.pricePerUnit = pricePerUnit;
        this.spread = spread;
        this.purchasePricePerUnit = purchasePricePerUnit;
        this.sellPricePerUnit = sellPricePerUnit;
        this.quantityAvailable = quantityAvailable;
    }
}
export class StructureType {
    public type:string;
    public name:string;
    public price:number;
    public allowedLocationTypes:string[];
    public allowedPlanetTraits:string[];
    public consumes:string[];
    public produces:string[];
    constructor(type: string, name: string, price: number, allowedLocationTypes: string[], allowedPlanetTraits: string[], consumes: string[], produces: string[]) {
        this.type = type;
        this.name = name;
        this.price = price;
        this.allowedLocationTypes = allowedLocationTypes;
        this.allowedPlanetTraits = allowedPlanetTraits;
        this.consumes = consumes;
        this.produces = produces;
    }
}
export class PartialSystem {
    public name:string;
    public symbol:string;
    constructor(name: string, symbol: string) {
        this.name = name;
        this.symbol = symbol;
    }
}

export class UserFlightPlan {
    public id:string;
    public shipId:string;
    public createdAt:string;
    public arrivesAt:string;
    public destination:string;
    public departure:string;
    public username:string;
    public shipType:string;
    constructor(id: string, shipId: string, createdAt: string, arrivesAt: string, destination: string, departure: string, username: string, shipType: string) {
        this.id = id;
        this.shipId = shipId;
        this.createdAt = createdAt;
        this.arrivesAt = arrivesAt;
        this.destination = destination;
        this.departure = departure,
        this.username = username;
        this.shipType = shipType;
    }

}
export class FlightPlan extends UserFlightPlan {
    public distance:number;
    public fuelConsumed:number;
    public fuelRemaining:number;
    public terminatedAt:string;
    public timeRemainingInSeconds:number;
    constructor(id: string, shipId: string, createdAt: string, arrivesAt: string, destination: string, departure: string, distance: number, fuelConsumed: number, fuelRemaining: number, terminatedAt: string, timeRemaingInSeconds: number) {
        super(id, shipId, createdAt, arrivesAt, destination, departure, null, null);
        this.distance = distance;
        this.fuelConsumed = fuelConsumed;
        this.fuelRemaining = fuelRemaining;
        this.terminatedAt = terminatedAt;
        this.timeRemainingInSeconds = timeRemaingInSeconds;
    }

}
export class Order {
    public good:string;
    public quantity:number;
    public pricePerUnit:number;
    public total:number;
    constructor(good, quantity, pricePerUnit, total) {
        this.good = good;
        this.quantity = quantity;
        this.pricePerUnit = pricePerUnit;
        this.total = total;
    }
}

export class MarketOrder {
    public credits:number;
    public order:Order;
    public ship:Ship;
    constructor(credits: number, order: Order, ship: Ship) {
        this.credits = credits;
        this.order = order;
        this.ship = ship;
    }
}

export class User {
    public username:string;
    public shipCount:number;
    public structureCount:number;
    public joinedAt:string;
    public credits:number;
    public token:string;
    constructor(username: string, shipCount: number, structureCount: number, joinedAt: string, credits: number, token: string) {
        this.username = username;
        this.shipCount = shipCount;
        this.structureCount = structureCount;
        this.joinedAt = joinedAt;
        this.credits = credits;
        this.token = token
    }
}
export class Jettison {
    public good:string;
    public quantityRemaining:number;
    public shipId:string;
    constructor(good: string, quantityRemaining: number, shipId: string) {
        this.good = good;
        this.quantityRemaining = quantityRemaining;
        this.shipId = shipId;
    }
}
export class System extends PartialSystem {
    public locations:Location[];
    constructor(name: string, symbol: string, locations: Location[]) {
        super(name, symbol)
        this.locations = locations;
    }
}
export class Structure {
    public active:string;
    public consumes:string[];
    public id:string;
    public inventory:any[];
    public location:string[];
    public ownedBy:string;
    public produces:string[];
    public status:string;
    public type:string;
    constructor(active: string, consumes: string[], id: string, inventory: any[], location: string[], ownedBy: string, produces: string[], status: string, type: string) {
        this.active = active;
        this.consumes = consumes;
        this.id = id,
        this.inventory = inventory;
        this.location = location;
        this.ownedBy = ownedBy;
        this.produces = produces;
        this.status = status;
        this.type = type;
    }
}
export class Loan extends LoanType {
    public due:string;
    public id:string;
    public status:string;
    public repaymentAmount:number;
    constructor(amount: number, collateralRequired: boolean, rate: number, termInDays: number, type: string, due: string, id: string, status: string, repaymentAmount: number) {
        super(type, amount, rate, termInDays, collateralRequired);
        this.due = due;
        this.id = id;
        this.status = status;
        this.repaymentAmount = repaymentAmount;
    }
}
export class Deposit {
    public good:string;
    public quantity:string;
    constructor(good: string, quanitity: string) {
        this.good = good;
        this.quantity = quanitity;
    }
}
export class Transfer extends Deposit{
    constructor(good: string, quanitity: string) {
        super(good, quanitity);
    }
}
/**
 * This is for data that can't really be put in a data class, like success messages
 */
export class MiscData {
    public data:any;
    constructor(data) {
        this.data = data;
    }
}
export class Warp extends FlightPlan {
    constructor(id: string, shipId: string, createdAt: string, arrivesAt: string, destination: string, departure: string, distance: number, fuelConsumed: number, fuelRemaining: number, terminatedAt: string, timeRemaingInSeconds: number) {
        super(id, shipId, createdAt, arrivesAt, destination, departure, distance, fuelConsumed, fuelRemaining, terminatedAt, timeRemaingInSeconds);
    }
}