"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoStructures = exports.InvalidToken = exports.ConnectionFailed = exports.parseUser = exports.parseJettison = exports.parseSystemLocation = exports.parseListing = exports.parseShipType = exports.parseGood = exports.parseStructureType = exports.parseLoan = exports.parseLoanType = exports.parseWarp = exports.parseFlightPlan = exports.ShipNotFound = exports.parseMiscData = exports.parsePurchaseLocation = exports.ExitConnection = exports.parseShip = exports.parseTransfer = exports.parseDeposit = exports.parseStructure = exports.parsePartialSystem = exports.parseSystem = exports.parseMarketShip = void 0;
const dataclasses_1 = require("./dataclasses");
function parseMarketShip(data) {
    let locations = [];
    data.purchaseLocations.forEach((location) => {
        locations.push(parsePurchaseLocation(location));
    });
    return new dataclasses_1.MarketShip(data.type, data.class, data.maxCargo, data.loadingSpeed, data.speed, data.manufacturer, data.plating, data.weapons, locations, data.restrictedGoods);
}
exports.parseMarketShip = parseMarketShip;
function parseSystem(locations, system) {
    return new dataclasses_1.System(system.name, system.symbol, locations);
}
exports.parseSystem = parseSystem;
function parsePartialSystem(data) {
    return new dataclasses_1.PartialSystem(data.name, data.symbol);
}
exports.parsePartialSystem = parsePartialSystem;
function parseStructure(data) {
    return new dataclasses_1.Structure(data.active, data.consumes, data.id, data.inventory, data.location, data.ownedBy.username, data.produces, data.status, data.type);
}
exports.parseStructure = parseStructure;
function parseDeposit(data) {
    return new dataclasses_1.Deposit(data.good, data.quantity);
}
exports.parseDeposit = parseDeposit;
function parseTransfer(data) {
    return new dataclasses_1.Transfer(data.good, data.quantity);
}
exports.parseTransfer = parseTransfer;
function parseShip(data) {
    return new dataclasses_1.Ship(data.id || null, data.location || null, data.x || null, data.y || null, data.cargo || null, data.spaceAvailable || null, data.type || null, data.maxCargo || null, data.loadingSpeed || null, data.speed || null, data.manufacturer || null, data.plating || null, data.weapons || null);
}
exports.parseShip = parseShip;
class ExitConnection extends Error {
    constructor(message = 'Connection Closed') {
        super(message);
        this.name = 'ExitConnection';
    }
}
exports.ExitConnection = ExitConnection;
function parsePurchaseLocation(data) {
    return new dataclasses_1.PurchaseLocation(data.system, data.location, data.price);
}
exports.parsePurchaseLocation = parsePurchaseLocation;
function parseMiscData(data) {
    return new dataclasses_1.MiscData(data);
}
exports.parseMiscData = parseMiscData;
class ShipNotFound extends Error {
    constructor(ship) {
        const message = `Ship ${ship} was not found`;
        super(message);
        this.name = 'ShipNotFound';
    }
}
exports.ShipNotFound = ShipNotFound;
function parseFlightPlan(data) {
    return new dataclasses_1.FlightPlan(data.id, data.shipId, data.createdAt, data.arrivesAt, data.destination, data.departure, data.distance, data.fuelConsumed, data.fuelRemaining, data.terminatedAt, data.timeRemainingInSeconds);
}
exports.parseFlightPlan = parseFlightPlan;
function parseWarp(data) {
    return new dataclasses_1.Warp(data.id, data.spiId, data.createdAt, data.arrivesAt, data.destination, data.departure, data.distance, data.fuelConsumed, data.fuelRemaining, data.terminatedAt, data.timeRemaingInSeconds);
}
exports.parseWarp = parseWarp;
function parseLoanType(data) {
    return new dataclasses_1.LoanType(data.type, data.amount, data.rate, data.termInDays, data.collateralRequired);
}
exports.parseLoanType = parseLoanType;
function parseLoan(data, loans) {
    for (const loan of loans) {
        if (loan.type == data.type) {
            return new dataclasses_1.Loan(data.repaymentAmount, loan.collateralRequired, loan.rate, loan.term, loan.type, data.due, data.id, data.status, data.repaymentAmount);
        }
    }
}
exports.parseLoan = parseLoan;
function parseStructureType(data) {
    return new dataclasses_1.StructureType(data.type, data.name, data.price, data.allowedLocationTypes, data.allowedPlanetTraits, data.consumes, data.produces);
}
exports.parseStructureType = parseStructureType;
function parseGood(data) {
    return new dataclasses_1.Good(data.name, data.symbol, data.volume);
}
exports.parseGood = parseGood;
function parseShipType(data) {
    return new dataclasses_1.ShipType(data.class, data.type, data.maxCargo, data.loadingSpeed, data.speed, data.manufacturer, data.plating, data.weapons);
}
exports.parseShipType = parseShipType;
function parseListing(data) {
    return new dataclasses_1.Listing(data.symbol, data.volumePerUnit, data.pricePerUnit, data.spread, data.purchasePricePerUnit, data.sellPricePerUnit, data.quantityAvailable);
}
exports.parseListing = parseListing;
function parseSystemLocation(data) {
    return new dataclasses_1.SystemLocation(data.symbol, data.type, data.name, data.x, data.y, data.allowsConstruction, data.traits || null, data.messages || null);
}
exports.parseSystemLocation = parseSystemLocation;
function parseJettison(data) {
    return new dataclasses_1.Jettison(data.good, data.quantityRemaining, data.shipId);
}
exports.parseJettison = parseJettison;
function parseUser(data, client) {
    return new dataclasses_1.User(data.username, data.shipCount, data.structureCount, data.joinedAt, data.credits, client.token);
}
exports.parseUser = parseUser;
class ConnectionFailed extends Error {
    constructor(message = 'Connection Failed') {
        super(message);
        this.name = 'ConnectionFailed';
    }
}
exports.ConnectionFailed = ConnectionFailed;
class InvalidToken extends Error {
    constructor(message = 'Invalid Token') {
        super(message);
        this.name = 'InvalidToken';
    }
}
exports.InvalidToken = InvalidToken;
class NoStructures extends Error {
    constructor(message = 'User has no structures') {
        super(message);
        this.name = 'NoStructures';
    }
}
exports.NoStructures = NoStructures;
