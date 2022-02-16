const ApiCom = require('./TradingPost');
const dc = require('./dataclasses')
/**
 * @param {*} data 
 * @param {ApiCom} client
 * @returns {dc.Ship}
 */
module.exports.parseShip = async (data, client, systems) => {
    const goods = await getGoods(client);
    const locations = await getLocations(client, data.location.slice(0, 2));
    let cargo = [];
    for (const good of goods) {
        for (const item of data.cargo) {
            if (good.name == item.name)
            cargo.push(good);
        }
    }
    let shipLocation = null;
    for (const location of locations) {
        if (location.symbol === data.location)
        shipLocation = location;
    } 
    return new dc.Ship(
        data.id,
        shipLocation,
        data.x,
        data.y,
        cargo,
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
/**
 * @param {*} data 
 * @param {ApiCom} client 
 * @returns {dc.MarketShip}
 */
module.exports.parseMarketShip = async (data, system, client) => {
    const systemLocations = await client.getSystemLocations(system);
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
        locations,
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