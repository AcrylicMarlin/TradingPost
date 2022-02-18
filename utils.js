const ApiCom = require('./TradingPost');
const dc = require('./dataclasses')
/**
 * @param {*} data 
 * @param {ApiCom} client 
 * @returns {dc.MarketShip}
 */
module.exports.parseMarketShip = (data, system, client) => {
    const index = client.systems.find(current => { return current.symbol === system})
    const systemLocations = client.systems[index].locations;
    const locations = [];
    for (const location of data.purchaseLocations) {
        for (const loc of systemLocations) {
            if (loc.symbol == location.location) {
                fullLocation = loc;
                break
            }
        }
        fullLocation.price = location.price;
        locations.push(fullLocation);
    }
    return new dc.MarketShip(
        data.type,
        data.class,
        data.maxCargo,
        data.loadingSpeed,
        data.speed,
        data.manufacturer,
        data.plating,
        data.weapons,
        locations || null,
        data.restrictedGoods
    )
}
/**
 * @param {ApiCom} client 
 * @param {dc.Location[]} locations 
 * @param {dc.PartialSystem} system 
 * @returns 
 */
module.exports.parseSystem = (client, locations, system) => {
    return new dc.System(system.name, system.symbol, locations);
}
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
        data.id,
        data.location,
        data.x,
        data.y,
        data.cargo,
        data.spaceAvailable,
        data.type,
        data.maxCargo,
        data.loadingSpeed,
        data.speed,
        data.manufacturer,
        data.plating,
        data.weapons
    );
}
module.exports.parseMarketShip = (data, locations) => {
    
}

module.exports.ExitConnection = class ExitConnection extends Error {
    constructor(message = 'Connection Closed') {
        super(message);
        this.name = 'ExitConnection';
    }
}
module.exports.sleep = async (ms) => {
    return new Promise(resolved => { setTimeout(resolved, ms); });
}