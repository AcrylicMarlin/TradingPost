
/**
 * Represents a partial ship
 * Usually from ship listings
 */
class ShipType {
    /**
     * Represents a partial ship
     * Usually from available ships
     * @param {string} ship_class -Class of ship
     * @param {string} type - Type of ship
     * @param {number} maxCargo - Maximum amount of cargo ship can hold
     * @param {number} loadingSpeed - Speed of loading cargo
     * @param {number} speed - Speed of travel
     * @param {string} manufacturer - Manufacturer of ship
     * @param {number} plating - Amount of armor plating on ship
     * @param {number} weapons - Number of weapons on ship
     */
    constructor(ship_class, type, maxCargo, loadingSpeed, speed, manufacturer, plating, weapons) {
        this.class = ship_class;
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
 class Ship extends ShipType{
    /**
     * Ship data class constructor
     * @param {string} class - Ship Class
     * @param {string} id - ID of ship
     * @param {Location} location - Symbol of current location
     * @param {number} x_pos - X postion of ship
     * @param {number} y_pos - Y position of ship
     * @param {Array} cargo - Cargo being carried
     * @param {number} spaceAvailable - space left over
     */
    constructor(id, location, x_pos, y_pos, cargo, spaceAvailable, type, maxCargo, loadingSpeed, speed, manufacturer, plating, weapons) {
        super(type, maxCargo, loadingSpeed, speed, manufacturer, plating, weapons)
        this.id = id;
        this.location = location;
        this.coordinates = [x_pos, y_pos];
        this.cargo = cargo;
        this.space = spaceAvailable;

    }
    
}




class MarketShip extends ShipType {
    /**
     * Represents a ship on the market
     * @param {string} type - Type of ship
     * @param {string} ship_class - Class of ship
     * @param {number} maxCargo - Maximum amount of cargo ship can hold
     * @param {number} loadingSpeed - Speed of loading cargo
     * @param {number} speed - Speed of travel
     * @param {string} manufacturer - Manufacturer of ship
     * @param {number} plating - Amount of armor plating on ship
     * @param {number} weapons - Number of weapons on ship
     * @param {PurchaseLocation[]} purchaseLocations - Array of listings
     * @param {any[]} restrictedGoods - Array of goods ship cannot carry
     */
    constructor(type, ship_class, maxCargo, loadingSpeed, speed, manufacturer, plating, weapons, purchaseLocations, restrictedGoods) {
        super(ship_class, type, maxCargo, loadingSpeed, speed, manufacturer, plating, weapons);
        this.purchaseLocations = purchaseLocations;
        this.restrictedGoods = restrictedGoods;

    }
}



class Location {
    /**
     * Location representation constructor
     * @param {string} symbol - Symbol of location
     * @param {string} type - type of location
     * @param {string} name - name of location
     * @param {number} x_pos - X coordinate of location
     * @param {number} y_pos - Y coordinate of location
     * @param {boolean} allowsConstruction - If construction is allowed
     * @param {string[]} traits - traits of location
     * @param {number} dockedShips - number of docked ships
     * @param {string[]} messages - messages attached to location
     */
    constructor(symbol, type, name, x_pos, y_pos, allowsConstruction, traits, dockedShips, messages) {
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
class PurchaseLocation {
    constructor(system, location, price) {
        this.system = system;
        this.location = location;
        this.price = price;
    }
}
/**
 * Representation of a good
 */
class Good {
    /**
     * Good constructor
     * @param {string} name - Name of good
     * @param {string} symbol - Symbol of good
     * @param {number} volume - Volume of good per unit
     */
    constructor(name, symbol, volume) {
        this.name = name;
        this.volume = volume;
        this.symbol = symbol;
    }
}
/**
 * Representation of a loan
 */
class LoanType {
    /**
     * Loan Representation Constructor
     * @param {string} type - Type of loan
     * @param {number} amount - amount in loan
     * @param {number} rate - rate of loan
     * @param {number} termInDays - Payment term
     * @param {boolean} collateralRequired - If collateral is required
     */
    constructor(type, amount, rate, termInDays, collateralRequired, due, id, status, repaymentAmount) {
        this.type = type;
        this.amount = amount;
        this.rate = rate;
        this.term = termInDays;
        this.collateralRequired = collateralRequired;
        this.due = due;
        this.id = id;
        this.status = status;
        this.repaymentAmount = repaymentAmount;
    }
}
class Listing {
    /**
     * Listing Representation Constructor
     * @param {string} symbol 
     * @param {number} volumePerUnit 
     * @param {number} pricePerUnit 
     * @param {number} spread 
     * @param {number} purchasePricePerUnit 
     * @param {number} sellPricePerUnit 
     * @param {number} quantityAvailable 
     */
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
class StructureType {
    /**
     * Structure Representation constructor
     * @param {string} type 
     * @param {string} name 
     * @param {string} price 
     * @param {string[]} allowedLocationTypes 
     * @param {string[]} allowedPlanetTraits 
     * @param {string[]} consumes 
     * @param {string[]} produces 
     */
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
class PartialSystem {
    /**
     * @param {string} name 
     * @param {string} symbol 
     */
    constructor(name, symbol) {
        this.name = name;
        this.symbol = symbol;
    }
}

class UserFlightPlan {
    /**
     * @param {string} id 
     * @param {string} shipId 
     * @param {string} createdAt 
     * @param {string} arrivesAt 
     * @param {string} destination 
     * @param {string} departure 
     * @param {string} username 
     * @param {string} shipType 
     */
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
class FlightPlan extends UserFlightPlan {
    /**
     * @param {string} id 
     * @param {string} shipId 
     * @param {string} createdAt 
     * @param {string} arrivesAt 
     * @param {string} destination 
     * @param {string} departure 
     * @param {string} distance 
     * @param {string} fuelConsumed 
     * @param {string} fuelRemaining 
     * @param {string} terminatedAt 
     * @param {string} timeRemaingInSeconds 
     */
    constructor(id, shipId, createdAt, arrivesAt, destination, departure, distance, fuelConsumed, fuelRemaining, terminatedAt, timeRemaingInSeconds) {
        super(id, shipId, createdAt, arrivesAt, destination, departure, null, null);
        this.distance = distance;
        this.fuelConsumed = fuelConsumed;
        this.fuelRemaining = fuelRemaining;
        this.terminatedAt = terminatedAt;
        this.timeRemainingInSeconds = timeRemaingInSeconds;
    }

}
class Order {
    /**
     * @param {string} good 
     * @param {string} quantity 
     * @param {string} pricePerUnit 
     * @param {string} total 
     */
    constructor(good, quantity, pricePerUnit, total) {
        this.good = good;
        this.quanitity = quantity;
        this.pricePerUnit = pricePerUnit;
        this.total = total;
    }
}

class MarketOrder {
    /**
     * @param {string} credits 
     * @param {string} order 
     * @param {string} ship 
     */
    constructor(credits, order, ship) {
        this.credits = credits;
        this.order = order;
        this.ship = ship;
    }
}

class User {
    /**
     * 
     * @param {string} username 
     * @param {number} shipCount 
     * @param {number} structureCount 
     * @param {string} joinedAt 
     * @param {string} credits 
     */
    constructor(username, shipCount, structureCount, joinedAt, credits, token) {
        this.username = username;
        this.shipCount = shipCount;
        this.structureCount = structureCount;
        this.joinedAt = joinedAt;
        this.credits = credits;
        this.token = token
    }
}
class Jettison {
    /**
     * Representation of a Jettison repsonse
     * @param {string | Good} good 
     * @param {number} quantityRemaining 
     * @param {string | Ship} shipId 
     */
    constructor(good, quantityRemaining, shipId) {
        this.good = good;
        this.quantityRemaining = quantityRemaining;
        this.shipId = shipId;
    }
}
class System extends PartialSystem {
    /**
     * @param {string} name 
     * @param {string} symbol 
     * @param {Location[]} locations 
     */
    constructor(name, symbol, locations) {
        super(name, symbol)
        this.locations = locations;
    }
}
class Structure {
    /**
     * @param {string} active 
     * @param {string} consumes 
     * @param {string} id 
     * @param {string} inventory 
     * @param {string} location 
     * @param {string} ownedBy 
     * @param {string} produces 
     * @param {string} status 
     * @param {string} type 
     */
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
class Loan extends LoanType {
    /**
     * @param {string} amount 
     * @param {string} collateralRequired 
     * @param {string} rate 
     * @param {string} termInDays 
     * @param {string} type 
     * @param {string} due 
     * @param {string} id 
     * @param {string} status 
     * @param {string} repaymentAmount 
     */
    constructor(amount, collateralRequired, rate, termInDays, type, due, id, status, repaymentAmount) {
        super(amount, collateralRequired, rate, termInDays, type);
        this.due = due;
        this.id = id;
        this.status = status;
        this.repaymentAmount = repaymentAmount;
    }
}
class Deposit {
    constructor(good, quanitity) {
        this.good = good;
        this.quanitity = quanitity;
    }
}
class Transfer extends Deposit{
    constructor(good, quanitity) {
        super(good, quanitity);
    }
}
/**
 * This is for data that can't really be put in a data class, like success messages
 */
class MiscData {
    constructor(data) {
        this.data = data;
    }
}
module.exports = {
    Ship,
    ShipType,
    MarketShip,
    Location,
    Good,
    LoanType,
    Loan,
    Listing,
    StructureType,
    Structure,
    PartialSystem,
    System,
    UserFlightPlan,
    FlightPlan,
    Order,
    MarketOrder,
    User,
    Jettison,
    Deposit,
    Transfer,
    PurchaseLocation,
    MiscData
};