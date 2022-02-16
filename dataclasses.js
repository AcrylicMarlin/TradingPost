
/**
 * Represents a partial ship
 * Usually from ship listings
 */
class PartialShip {
    #class;
    #type;
    #maxCargo;
    #loadingSpeed;
    #speed;
    #manufacturer;
    #plating;
    #weapons;
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
        this.#class = ship_class;
        this.#type = type;
        this.#maxCargo = maxCargo;
        this.#loadingSpeed = loadingSpeed;
        this.#speed = speed;
        this.#manufacturer = manufacturer;
        this.#plating = plating;
        this.#weapons = weapons;
    }
    get class() { return this.#class; }
    get type() { return this.#type; }
    get maxCargo() { return this.#maxCargo; }
    get loadingSpeed() { return this.#loadingSpeed; }
    get speed() { return this.#speed; }
    get manufacturer() { return this.#manufacturer; }
    get plating() { return this.#plating; }
    get weapons() { return this.#weapons; }
}



/**
 * Ship dataclass
 */
 class Ship extends PartialShip{
    #id;
    #location;
    #coordinates;
    #cargo;
    #space;
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
        this.#id = id;
        this.#location = location;
        this.#coordinates = [x_pos, y_pos];
        this.#cargo = cargo;
        this.#space = spaceAvailable;

    }
    get id() { return this.#id; }
    get location() { return this.#location; }
    get coordinates() { return this.#coordinates; }
    get cargo() { return this.#cargo; }
    get space() { return this.#space; }
    
}




class MarketShip extends PartialShip {
    #purchaseLocations;
    #restrictedGoods;
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
     * @param {Location[]} purchaseLocations - Array of listings
     * @param {any[]} restrictedGoods - Array of goods ship cannot carry
     */
    constructor(type, ship_class, maxCargo, loadingSpeed, speed, manufacturer, plating, weapons, purchaseLocations, restrictedGoods) {
        super(ship_class, type, maxCargo, loadingSpeed, speed, manufacturer, plating, weapons);
        this.#purchaseLocations = purchaseLocations;
        this.#restrictedGoods = restrictedGoods;

    }
    get purchaseLocations() { return this.#purchaseLocations; }
    get restrictedGoods() { return this.#restrictedGoods; }
}



class Location {
    #symbol;
    #type;
    #name;
    #coordinates
    #allowsConstruction;
    #traits;
    #dockedShips;
    #messages;
    #price;
    /**
     * Location representation constructor
     * @param {string} symbol - Symbol of location
     * @param {string} type - type of location
     * @param {string} name - name of location
     * @param {number} x_pos - X coordinate of location
     * @param {number} y_pos - Y coordinate of location
     * @param {boolean} allowsConstruction - If construction is allowed
     * @param {stirng[]} traits - traits of location
     * @param {number} - number of docked ships
     * @param {string[]} messages - messages attached to location
     */
    constructor(symbol, type, name, x_pos, y_pos, allowsConstruction, traits, dockedShips, messages) {
        this.#symbol = symbol;
        this.#type = type;
        this.#name = name;
        this.#coordinates = [x_pos, y_pos];
        this.#allowsConstruction = allowsConstruction;
        this.#traits = traits;
        this.#dockedShips = dockedShips;
        this.#messages = messages;
    }
    get symbol() { return this.#symbol }
    get type() { return this.#type }
    get name() { return this.#name }
    get coordinates() { return this.#coordinates }
    get allowsConstruction() { return this.#allowsConstruction }
    get traits() { return this.#traits }
    get dockedShips() { return this.#dockedShips }
    get messages() { return this.#messages }
    get price() { return this.#price }

    set price(price) { this.#price = price;}
}
/**
 * Representation of a good
 */
class Good {
    #name;
    #symbol;
    #volume;
    /**
     * Good constructor
     * @param {string} name - Name of good
     * @param {string} symbol - Symbol of good
     * @param {number} volume - Volume of good per unit
     */
    constructor(name, symbol, volume) {
        this.#name = name;
        this.#volume = volume;
        this.#symbol = symbol;
    }
    get name() { return this.#name; }
    get symbol() { return this.#symbol; }
    get volume() { return this.#volume }
}
/**
 * Representation of a loan
 */
class Loan {
    #type;
    #amount;
    #rate;
    #term;
    #collateralRequired;
    /**
     * Loan Representation Constructor
     * @param {string} type - Type of loan
     * @param {number} amount - amount in loan
     * @param {number} rate - rate of loan
     * @param {number} termInDays - Payment term
     * @param {boolean} collateralRequired - If collateral is required
     */
    constructor(type, amount, rate, termInDays, collateralRequired) {
        this.#type = type;
        this.#amount = amount;
        this.#rate = rate;
        this.#term = termInDays;
        this.#collateralRequired = collateralRequired;
    }
    get type() { return this.#type; }
    get amount() { return this.#amount; }
    get rate() { return this.#rate }
    get term() { return this.#term }
    get collateralRequired() { return this.#collateralRequired }
}
class Listing {
    #symbol;
    #volumePerUnit;
    #pricePerUnit;
    #spread;
    #purchasePricePerUnit;
    #sellPricePerUnit;
    #quantityAvailable;
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
        this.#symbol = symbol;
        this.#volumePerUnit = volumePerUnit;
        this.#pricePerUnit = pricePerUnit;
        this.#spread = spread;
        this.#purchasePricePerUnit = purchasePricePerUnit;
        this.#sellPricePerUnit = sellPricePerUnit;
        this.#quantityAvailable = quantityAvailable;
    }
    get symbol() { return this.#symbol }
    get volumePerUnit() { return this.#volumePerUnit }
    get pricePerUnit() { return this.#pricePerUnit }
    get spread() { return this.#spread }
    get purchasePricePerUnit() { return this.#purchasePricePerUnit }
    get sellPricePerUnit() { return this.#sellPricePerUnit }
    get quantityAvailable() { return this.#quantityAvailable }
}
class Structure {
    #type;
    #name;
    #price;
    #allowedLocationTypes;
    #allowedPlanetTraits;
    #consumes;
    #produces;
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
        this.#type = type;
        this.#name = name;
        this.#price = price;
        this.#allowedLocationTypes = allowedLocationTypes;
        this.#allowedPlanetTraits = allowedPlanetTraits;
        this.#consumes = consumes;
        this.#produces = produces;
    }
    get type() { return this.#type }
    get name() { return this.#name }
    get price() { return this.#price }
    get allowedLocationTypes() { return this.#allowedLocationTypes }
    get allowedPlanetTraits() { return this.#allowedPlanetTraits }
    get consumes() { return this.#consumes }
    get produces() { return this.#produces }
}
class PartialSystem {
    #name;
    #symbol;
    constructor(name, symbol) {
        this.#name = name;
        this.#symbol = symbol;
    }
    get name() { return this.#name }
    get symbol() { return this.#symbol }
}

class UserFlightPlan {
    #id;
    #shipId;
    #createdAt;
    #arrivesAt;
    #destination;
    #departure;
    #username;
    #shipType;
    constructor(id, shipId, createdAt, arrivesAt, destination, departure, username, shipType) {
        this.#id = id;
        this.#shipId = shipId;
        this.#createdAt = createdAt;
        this.#arrivesAt = arrivesAt;
        this.#destination = destination;
        this.#departure = departure,
        this.#username = username;
        this.#shipType = shipType;
    }
    get id() { return this.#id }
    get shipId() { return this.#shipId }
    get createdAt() { return this.#createdAt }
    get arrivesAt() {return this.#arrivesAt }
    get destination() { return this.#destination }
    get departure() { return this.#departure }
    get username() { return this.#username }
    get shipType() { return this.#shipType }

}
class FlightPlan extends UserFlightPlan {
    #distance;
    #fuelConsumed;
    #fuelRemaining;
    #terminatedAt;
    #timeRemainingInSeconds;
    constructor(id, shipId, createdAt, arrivesAt, destination, departure, distance, fuelConsumed, fuelRemaining, terminatedAt, timeRemaingInSeconds) {
        super(id, shipId, createdAt, arrivesAt, destination, departure, null, null);
        this.#distance = distance;
        this.#fuelConsumed = fuelConsumed;
        this.#fuelRemaining = fuelRemaining;
        this.#terminatedAt = terminatedAt;
        this.#timeRemainingInSeconds = timeRemaingInSeconds;
    }
    get distance() { return this.#distance }
    get fuelConsumed() { return this.#fuelConsumed }
    get fuelRemaining() { return this.#fuelRemaining }
    get terminatedAt() { return this.#terminatedAt }
    get timeRemaingInSeconds() { return this.#timeRemainingInSeconds }
}
class Order {
    #good;
    #quanitity;
    #pricePerUnit;
    #total;
    constructor(good, quantity, pricePerUnit, total) {
        this.#good = good;
        this.#quanitity = quantity;
        this.#pricePerUnit = pricePerUnit;
        this.#total = total;
    }
    get good() { return this.#good }
    get quantity() { return this.#quanitity }
    get pricePerUnit() { return this.#pricePerUnit }
    get total() { return this.#total }
}

class MarketOrder {
    #credits;
    #order;
    #ship;
    constructor(credits, order, ship) {
        this.#credits = credits;
        this.#order = order;
        this.#ship = ship;
    }
    get credits() { return this.#credits }
    get order() { return this.#order }
    get ship() { return this.#ship }
}

class User {
    #username;
    #shipCount;
    #structureCount;
    #joinedAt;
    #credits;
    #token;
    /**
     * 
     * @param {string} username 
     * @param {number} shipCount 
     * @param {number} structureCount 
     * @param {string} joinedAt 
     * @param {string} credits 
     */
    constructor(username, shipCount, structureCount, joinedAt, credits, token) {
        this.#username = username;
        this.#shipCount = shipCount;
        this.#structureCount = structureCount;
        this.#joinedAt = joinedAt;
        this.#credits = credits;
        this.#token = token
    }
    get username() { return this.#username }
    get shipCount() { return this.#shipCount }
    get structureCount() { return this.#structureCount }
    get joinedAt() { return this.#joinedAt }
    get credits() { return this.#credits}
    get token() { return this.#token }
}
class Jettison {
    #good;
    #quantityRemaining;
    #shipId;
    /**
     * Representation of a Jettison repsonse
     * @param {string | Good} good 
     * @param {number} quantityRemaining 
     * @param {ship | Ship} shipId 
     */
    constructor(good, quantityRemaining, shipId) {
        this.#good = good;
        this.#quantityRemaining = quantityRemaining;
        this.#shipId = shipId;
    }
    get good() { return this.#good }
    get quantityRemaining() { return this.#quantityRemaining }
    get shipId() { return this.#shipId }
}
class System extends PartialSystem {
    #locations
    constructor(name, symbol, locations) {
        super(name, symbol)
        this.#locations = locations;
    }
    get locations() { return this.#locations }
}
module.exports = {
    Ship,
    PartialShip,
    MarketShip,
    Location,
    Good,
    Loan,
    Listing,
    Structure,
    PartialSystem,
    System,
    UserFlightPlan,
    FlightPlan,
    Order,
    MarketOrder,
    User,
    Jettison,

};