"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Warp = exports.MiscData = exports.Transfer = exports.Deposit = exports.Loan = exports.Structure = exports.System = exports.Jettison = exports.User = exports.MarketOrder = exports.Order = exports.FlightPlan = exports.UserFlightPlan = exports.PartialSystem = exports.StructureType = exports.Listing = exports.LoanType = exports.Good = exports.PurchaseLocation = exports.SystemLocation = exports.MarketShip = exports.Ship = exports.ShipType = void 0;
/**
 * Represents a partial ship
 */
class ShipType {
    constructor(ship_class, type, maxCargo, loadingSpeed, speed, manufacturer, plating, weapons) {
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
exports.ShipType = ShipType;
/**
 * Ship dataclass
 */
class Ship extends ShipType {
    constructor(id, location, x_pos, y_pos, cargo, spaceAvailable, type, maxCargo, loadingSpeed, speed, manufacturer, plating, weapons) {
        const ship_class = type.slice(3);
        super(ship_class, type, maxCargo, loadingSpeed, speed, manufacturer, plating, weapons);
        this.id = id;
        this.location = location;
        this.coordinates = [x_pos, y_pos];
        this.cargo = cargo;
        this.space = spaceAvailable;
    }
}
exports.Ship = Ship;
class MarketShip extends ShipType {
    constructor(type, ship_class, maxCargo, loadingSpeed, speed, manufacturer, plating, weapons, purchaseLocations, restrictedGoods) {
        super(ship_class, type, maxCargo, loadingSpeed, speed, manufacturer, plating, weapons);
        this.purchaseLocations = purchaseLocations;
        this.restrictedGoods = restrictedGoods;
    }
}
exports.MarketShip = MarketShip;
class SystemLocation {
    constructor(symbol, type, name, x_pos, y_pos, allowsConstruction, traits, messages) {
        this.symbol = symbol;
        this.type = type;
        this.name = name;
        this.coordinates = [x_pos, y_pos];
        this.allowsConstruction = allowsConstruction;
        this.traits = traits;
        this.messages = messages;
    }
}
exports.SystemLocation = SystemLocation;
class PurchaseLocation {
    constructor(system, location, price) {
        this.system = system;
        this.location = location;
        this.price = price;
    }
}
exports.PurchaseLocation = PurchaseLocation;
/**
 * Representation of a good
 */
class Good {
    constructor(name, symbol, volume) {
        this.name = name;
        this.volume = volume;
        this.symbol = symbol;
    }
}
exports.Good = Good;
/**
 * Representation of a loan
 */
class LoanType {
    constructor(type, amount, rate, termInDays, collateralRequired) {
        this.type = type;
        this.amount = amount;
        this.rate = rate;
        this.term = termInDays;
        this.collateralRequired = collateralRequired;
    }
}
exports.LoanType = LoanType;
class Listing {
    constructor(symbol, volumePerUnit, pricePerUnit, spread, purchasePricePerUnit, sellPricePerUnit, quantityAvailable) {
        this.symbol = symbol;
        this.volumePerUnit = volumePerUnit;
        this.pricePerUnit = pricePerUnit;
        this.spread = spread;
        this.purchasePricePerUnit = purchasePricePerUnit;
        this.sellPricePerUnit = sellPricePerUnit;
        this.quantityAvailable = quantityAvailable;
    }
}
exports.Listing = Listing;
class StructureType {
    constructor(type, name, price, allowedLocationTypes, allowedPlanetTraits, consumes, produces) {
        this.type = type;
        this.name = name;
        this.price = price;
        this.allowedLocationTypes = allowedLocationTypes;
        this.allowedPlanetTraits = allowedPlanetTraits;
        this.consumes = consumes;
        this.produces = produces;
    }
}
exports.StructureType = StructureType;
class PartialSystem {
    constructor(name, symbol) {
        this.name = name;
        this.symbol = symbol;
    }
}
exports.PartialSystem = PartialSystem;
class UserFlightPlan {
    constructor(id, shipId, createdAt, arrivesAt, destination, departure, username, shipType) {
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
exports.UserFlightPlan = UserFlightPlan;
class FlightPlan extends UserFlightPlan {
    constructor(id, shipId, createdAt, arrivesAt, destination, departure, distance, fuelConsumed, fuelRemaining, terminatedAt, timeRemaingInSeconds) {
        super(id, shipId, createdAt, arrivesAt, destination, departure, '', '');
        this.distance = distance;
        this.fuelConsumed = fuelConsumed;
        this.fuelRemaining = fuelRemaining;
        this.terminatedAt = terminatedAt;
        this.timeRemainingInSeconds = timeRemaingInSeconds;
    }
}
exports.FlightPlan = FlightPlan;
class Order {
    constructor(good, quantity, pricePerUnit, total) {
        this.good = good;
        this.quantity = quantity;
        this.pricePerUnit = pricePerUnit;
        this.total = total;
    }
}
exports.Order = Order;
class MarketOrder {
    constructor(credits, order, ship) {
        this.credits = credits;
        this.order = order;
        this.ship = ship;
    }
}
exports.MarketOrder = MarketOrder;
class User {
    constructor(username, shipCount, structureCount, joinedAt, credits, token) {
        this.username = username;
        this.shipCount = shipCount;
        this.structureCount = structureCount;
        this.joinedAt = joinedAt;
        this.credits = credits;
        this.token = token;
    }
}
exports.User = User;
class Jettison {
    constructor(good, quantityRemaining, shipId) {
        this.good = good;
        this.quantityRemaining = quantityRemaining;
        this.shipId = shipId;
    }
}
exports.Jettison = Jettison;
class System extends PartialSystem {
    constructor(name, symbol, locations) {
        super(name, symbol);
        this.locations = locations;
    }
}
exports.System = System;
class Structure {
    constructor(active, consumes, id, inventory, location, ownedBy, produces, status, type) {
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
exports.Structure = Structure;
class Loan extends LoanType {
    constructor(amount, collateralRequired, rate, termInDays, type, due, id, status, repaymentAmount) {
        super(type, amount, rate, termInDays, collateralRequired);
        this.due = due;
        this.id = id;
        this.status = status;
        this.repaymentAmount = repaymentAmount;
    }
}
exports.Loan = Loan;
class Deposit {
    constructor(good, quanitity) {
        this.good = good;
        this.quantity = quanitity;
    }
}
exports.Deposit = Deposit;
class Transfer extends Deposit {
    constructor(good, quanitity) {
        super(good, quanitity);
    }
}
exports.Transfer = Transfer;
/**
 * This is for data that can't really be put in a data class, like success messages
 */
class MiscData {
    constructor(data) {
        this.data = data;
    }
}
exports.MiscData = MiscData;
class Warp extends FlightPlan {
    constructor(id, shipId, createdAt, arrivesAt, destination, departure, distance, fuelConsumed, fuelRemaining, terminatedAt, timeRemaingInSeconds) {
        super(id, shipId, createdAt, arrivesAt, destination, departure, distance, fuelConsumed, fuelRemaining, terminatedAt, timeRemaingInSeconds);
    }
}
exports.Warp = Warp;
