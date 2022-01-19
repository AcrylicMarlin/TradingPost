const axios = require('axios').default


/**
 * ApiCom
 * The communicator for the spacetraders api
 * (For use with discord.js)
 * @author - Justin Cardenas
 * @version - 1.0.0
 */

class ApiCom {
    /**
     * Builds the api communicator for SpaceTraders
     * @param {String} token - The Bearer token of the user
     * @param {String} username - Username of the user
     */
    constructor(token, username) {
        this._token = token;
        this._username = username;
        this._base_url = "http://api.spacetraders.io";
    }

    get getToken() {
        return this._token;
    }
    get getUsername() {
        return this._username;
    }
    set setToken(token) {
        this._token = token;
    }
    set setUsername(username) {
        this._username = username;
    }
    /**
     * Gets the status of game servers
     * @returns - The http response. (I will convert to a discord embed later)
     */
    async getStatus() {
        const res = await axios({
            method:'get',
            url:`${this._base_url}/game/status`
        })
        .catch(err => { throw new Error(err.response.data.error.message) });
        console.log(`http code: ${ res.status }\nStatus: ${ res.data.status }`);

    }
    /**
     * Gets the users account
     * @returns - The Users account information as http data (will convert to discord embed later)
     */
    async getAccount() {
        const res = await axios({
            method:'get',
            url:this._base_url + '/my/account',
            headers:{
                "Authorization":this._token
            }
        })
        console.log(res.data)
    }
    /**
     * buy a thing
     * @param {String} location - Location of the ship
     * @param {String} symbol - symbol of the ship to buy
     * @returns - http response (will convert to discord embed later)
     */
    async buyShip(location, symbol) {
        const res = await axios.post(`${this._base_url}/my/ships`, {}, {
            headers:{
                "Authorization": this._token
            },
            params: {
                "location":location,
                "type": symbol
            }
        })
        .then(res => { return res })
        .catch(err => { throw err });
        return res;
    }

    /**
     * Gets information on a system
     * @param {String} symbol - symbol of system
     */
    async getSystemInfo(symbol) {
        const res = await axios.get(`${this._base_url}/systems/${symbol.toUpperCase()}`, {
            headers:{
                "Authorization":this._token
            }
        })
        .then(res => { return res })
        .catch(err => { throw err });
        return res;
    }
    /**
     * Gets the ship listings of the system
     * @param {String} symbol - Symbol of system
     * @param {String} ship_class - Class of ships (defaults to null)
     * @returns - http request
     */
    async getSystemShipListings(symbol, ship_class) {
        if (typeof ship_class === 'undefined') {
            ship_class = null;
        }
        const res = await axios.get(`${this._base_url}/systems/${symbol.toUpperCase()}/ship-listings`, {
            headers:{
                "Authorization":this._token
            },
            params:{
                "class":ship_class
            }
        })
        .then(res => { return res })
        .catch(err => { throw err });
        return res;
    }
    async getUserShips() {
        const res = await axios({
            method:'get',
            url:`${this._base_url}/my/ships`,
            headers:{
                "Authorization":this._token
            }
        });
        console.log(res.data);
    }
    /**
     * Gets the buy location of the ship specifed in the system
     * @param {String} symbol - symbol of the ship to look for
     * @param {String} system - system to look in
     * @returns - Array containing the Listings as objects
     */
    async getBuyLocation(symbol, system) {
        const res = await axios({
            method: 'get',
            url:`${this._base_url}/systems/${system}/ship-listings`,
            headers:{
                "Authorization":this._token
            }
        })
        .catch(err => { throw new Error(err.response.data.error.message)});
        
        let i = 0;
        for (const listing of res.data.shipListings) {
            if (listing.type === symbol) {
                i++;
                for (const location of listing.purchaseLocations) {
                    console.log(location);
                    
                }
                break;
            }
        }
        if (i === 0) {
            throw new Error('Ship does not exist')
        }
    
        
    }
    
}

module.exports = {
    ApiCom
}