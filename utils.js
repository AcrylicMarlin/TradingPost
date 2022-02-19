const ApiCom = require('./TradingPost');
const dc = require('./dataclasses')
/**
 * @param {*} data 
 * @param {ApiCom} client 
 * @returns {dc.MarketShip}
 */
module.exports.parseMarketShip = (data, system) => {
    const locations = [];
    data.purchaseLocations.forEach((location) => {
        locations.push(this.parsePurchaseLocation(location));
    })
    return new dc.MarketShip(
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
/**
 * @param {ApiCom} client 
 * @param {dc.Location[]} locations 
 * @param {dc.PartialSystem} system 
 * @returns {dc.System}
 */
module.exports.parseSystem = (client, locations, system) => {
    return new dc.System(system.name, system.symbol, locations);
}
/**
 * @param {*} data 
 * @returns {dc.PartialSystem}
 */
module.exports.parsePartialSystem = (data) => {
    return new dc.PartialSystem(data.name, data.symbol);
}
module.exports.parseStructure = (data) => {
    return new dc.Structure(
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
module.exports.parseStructureType = (data) => {
    return new dc.StructureType(
        data.type,
        data.name,
        data.price,
        data.allowedLocationTypes,
        data.allowedPlanetTraits,
        data.consumes,
        data.produces
    );
}
module.exports.parseDeposit = (data) => {
    return new dc.Deposit(
        data.good,
        data.quantity
    );
}
module.exports.parseTransfer = (data) => {
    return new dc.Transfer(
        data.good,
        data.quantity
    );
}
module.exports.parseShip = (data) => {
    return new dc.Ship(
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

module.exports.ExitConnection = class ExitConnection extends Error {
    constructor(message = 'Connection Closed') {
        super(message);
        this.name = 'ExitConnection';
    }
}

module.exports.parsePurchaseLocation = (data) => {
    return new dc.PurchaseLocation(
        data.system,
        data.location,
        data.price
    )
}
module.exports.parseMiscData = (data) => {
    return new dc.MiscData(data);
}
module.exports.ShipNotFound = class ShipNotFound extends Error {
    constructor(ship) {
        const message = `Ship ${ship} was not found`;
        super(message);
        this.name = 'ShipNotFound'
    }
}