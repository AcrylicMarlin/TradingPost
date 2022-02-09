
/**
 * Represents a partial ship
 * Usually from ship listings
 */
class PartialShip {
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
     * @param {String} type - Type of ship
     * @param {number} maxCargo - Maximum amount of cargo ship can hold
     * @param {number} loadingSpeed - Speed of loading cargo
     * @param {number} speed - Speed of travel
     * @param {string} manufacturer - Manufacturer of ship
     * @param {number} plating - Amount of armor plating on ship
     * @param {number} weapons - Number of weapons on ship
     */
    constructor(type, maxCargo, loadingSpeed, speed, manufacturer, plating, weapons) {
        this.#type = type;
        this.#maxCargo = maxCargo;
        this.#loadingSpeed = loadingSpeed;
        this.#speed = speed;
        this.#manufacturer = manufacturer;
        this.#plating = plating;
        this.#weapons = weapons;
    }
    get type() {
        return this.#type;
    }
    get maxCargo() {
        return this.#maxCargo;
    }
    get loadingSpeed() {
        return this.#loadingSpeed;
    }
    get speed() {
        return this.#speed;
    }
    get manufacturer() {
        return this.#manufacturer;
    }
    get plating() {
        return this.#plating;
    }
    get weapons() {
        return this.#weapons;
    }
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
     * @param {string} id - ID of ship
     * @param {string} location - Symbol of current location
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
    get id() {
        return this.#id;
    }
    get location() {
        return this.#location;
    }
    get coordinates() {
        return this.#coordinates;
    }
    get cargo() {
        return this.#cargo;
    }
    get space() {
        return this.#space;
    }
    
}




class MarketShip extends PartialShip {
    #purchaseLocations;
    #restrictedGoods;
    #class;
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
     * @param {Array} purchaseLocations - Array of listings
     * @param {Array} restrictedGoods - Array of goods ship cannot carry
     */
    constructor(type, ship_class, maxCargo, loadingSpeed, speed, manufacturer, plating, weapons, purchaseLocations, restrictedGoods) {
        super(type, maxCargo, loadingSpeed, speed, manufacturer, plating, weapons);
        this.#class = ship_class;
        this.#purchaseLocations = purchaseLocations;
        this.#restrictedGoods = restrictedGoods;

    }
    get purchaseLocations() {
        return this.#purchaseLocations;
    }
    get restrictedGoods() {
        return this.#restrictedGoods;
    }
    get class() {
        return this.#class;
    }
}
module.exports = {
    Ship,
    PartialShip,
    MarketShip
};