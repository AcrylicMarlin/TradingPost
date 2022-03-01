import {Deposit, FlightPlan, Good, Jettison, Listing, Loan, LoanType, MarketShip, MiscData, PartialSystem, PurchaseLocation, Ship, ShipType, Structure, StructureType, System, SystemLocation, Transfer, User, Warp} from './dataclasses'


export function parseMarketShip (data:any) {
    let locations: PurchaseLocation[] = [];
    data.purchaseLocations.forEach((location:any) => {
        locations.push(parsePurchaseLocation(location));
    })
    return new MarketShip(
        data.type,
        data.class,
        data.maxCargo,
        data.loadingSpeed,
        data.speed,
        data.manufacturer,
        data.plating,
        data.weapons,
        locations,
        data.restrictedGoods
    )
}
export function parseSystem (locations:Location[], system:PartialSystem) {
    return new System(system.name, system.symbol, locations);
}
export function parsePartialSystem (data:any) {
    return new PartialSystem(data.name, data.symbol);
}
export function parseStructure (data:any) {
    return new Structure(
        data.active,
        data.consumes,
        data.id,
        data.inventory,
        data.location,
        data.ownedBy.username,
        data.produces,
        data.status,
        data.type
    );
}
export function parseDeposit (data:any) {
    return new Deposit(
        data.good,
        data.quantity
    );
}
export function parseTransfer (data:any) {
    return new Transfer(
        data.good,
        data.quantity
    );
}
export function parseShip (data:any) {
    return new Ship(
        data.id || null,
        data.location || null,
        data.x || null,
        data.y || null,
        data.cargo || null,
        data.spaceAvailable || null,
        data.type || null,
        data.maxCargo || null,
        data.loadingSpeed || null,
        data.speed || null,
        data.manufacturer || null,
        data.plating || null,
        data.weapons || null
    );
}

export class ExitConnection extends Error {
    public name:string;
    constructor(message = 'Connection Closed') {
        super(message);
        this.name = 'ExitConnection';
    }
}

export function parsePurchaseLocation (data:any) {
    return new PurchaseLocation(
        data.system,
        data.location,
        data.price
    )
}
export function parseMiscData (data:any) {
    return new MiscData(data);
}
export class ShipNotFound extends Error {
    public name:string;
    constructor(ship:string) {
        const message = `Ship ${ship} was not found`;
        super(message);
        this.name = 'ShipNotFound'
    }
}
export function parseFlightPlan (data:any) {
    return new FlightPlan(
        data.id,
        data.shipId,
        data.createdAt,
        data.arrivesAt,
        data.destination,
        data.departure,
        data.distance,
        data.fuelConsumed,
        data.fuelRemaining,
        data.terminatedAt,
        data.timeRemainingInSeconds
    );
}
export function parseWarp(data:any) {
    return new Warp(
        data.id,
        data.spiId,
        data.createdAt,
        data.arrivesAt,
        data.destination,
        data.departure,
        data.distance,
        data.fuelConsumed,
        data.fuelRemaining,
        data.terminatedAt,
        data.timeRemaingInSeconds
    );
}
export function parseLoanType(data:any) {
    return new LoanType(
        data.type,
        data.amount,
        data.rate,
        data.termInDays,
        data.collateralRequired
    );
}
export function parseLoan(data:any, loans:Loan[]) {
    for (const loan of loans) {
        if (loan.type == data.type) {
            return new Loan(
                data.repaymentAmount,
                loan.collateralRequired,
                loan.rate,
                loan.term,
                loan.type,
                data.due,
                data.id,
                data.status,
                data.repaymentAmount
            )
        }
    }

}
export function parseStructureType(data:any) {
    return new StructureType(
        data.type,
        data.name,
        data.price,
        data.allowedLocationTypes,
        data.allowedPlanetTraits,
        data.consumes,
        data.produces
    )
}
export function parseGood(data:any) {
    return new Good(
        data.name,
        data.symbol,
        data.volume
    )
}
export function parseShipType(data:any) {
    return new ShipType(
        data.class,
        data.type,
        data.maxCargo,
        data.loadingSpeed,
        data.speed,
        data.manufacturer,
        data.plating,
        data.weapons
    )
}
export function parseListing(data:any) {
    return new Listing(
        data.symbol,
        data.volumePerUnit,
        data.pricePerUnit,
        data.spread,
        data.purchasePricePerUnit,
        data.sellPricePerUnit,
        data.quantityAvailable
    );
}
export function parseSystemLocation(data:any) {
    return new SystemLocation(
        data.symbol,
        data.type,
        data.name,
        data.x,
        data.y,
        data.allowsConstruction,
        data.traits || null,
        data.messages || null
    )
}
export function parseJettison(data:any) {
    return new Jettison(
        data.good,
        data.quantityRemaining,
        data.shipId
    )
}
export function parseUser(data:any, client:any) {
    return new User(
        data.username,
        data.shipCount,
        data.structureCount,
        data.joinedAt,
        data.credits,
        client.token
    )
}
export class ConnectionFailed extends Error {
    constructor(message='Connection Failed') {
        super(message);
        this.name = 'ConnectionFailed'
    }
}
export class InvalidToken extends Error {
    constructor(message='Invalid Token') {
        super(message);
        this.name = 'InvalidToken'
    }
}
export class NoStructures extends Error {
    constructor(message='User has no structures') {
        super(message);
        this.name='NoStructures'
    }
}


