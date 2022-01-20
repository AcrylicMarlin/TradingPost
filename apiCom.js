/* eslint-disable @typescript-eslint/no-var-requires */
const axios = require('axios').default;
const qs = require('qs');


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
		this._base_url = 'https://api.spacetraders.io';
		this.axios_client = axios.create({
			baseURL:this._base_url,
			headers:{
				'Authorization':this._token
			}
		});
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
	 */
	async getStatus() {
		const res = await axios({
			method:'get',
			url:`${this._base_url}/game/status`
		})
			.catch(err => { throw new Error(err.response.data.error.message); });
		console.log(`http code: ${ res.status }\nStatus: ${ res.data.status }`);

	}
	/**
	 * Gets the users account
	 */
	async getAccount() {
		const res = await this.axios_client.request({
			method:'GET',
			url:'/my/account',
		})
			.catch(err => { throw new Error(err.response.data.error.message); });
		console.log(res);
	}
	/**
	 * buy a thing
	 * @param {String} locationSymbol - Location of the ship
	 * @param {String} shipSymbol - symbol of the ship to buy
	 */
	async buyShip(locationSymbol, shipSymbol) {
		const res = await axios({
			method:'POST',
			url:'/my/ships',
			params:{
				location:locationSymbol,
				type:shipSymbol
			},
			paramsSerializer: params => {
				return qs.stringify(params);
			}
		})
			.catch(err => { throw new Error(err.response.data.error.message); });
		console.log(res.data);
	}
	

	/**
	 * Gets information on a system
	 * @param {String} symbol - symbol of system
	 */
	async getSystemInfo(symbol) {
		const res = await this.axios_client.request({
			method:'GET',
			url:`/systems/${symbol.toUpperCase()}`
		})
			.catch(err => { throw new Error(err.response.data.error.message); });
		console.log(res.data);
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
		const res = await axios({
			method:'get',
			url:`/systems/${symbol.toUpperCase()}/ship-listings`,
			params:{
				'class':ship_class
			},
			paramsSerializer: params => {
				return qs.stringify(params);
			}
		})
			.catch(err => { throw new Error(err.response.data.error.message); });
		console.log(res.data);
	}
	/**
	 * Gets the users ships
	 */
	async getUserShips() {
		const res = await axios({
			method:'get',
			url:'/my/ships',
		});
		console.log(res.data);
	}
	/**
	 * Gets the buy location of the ship specifed in the system
	 * @param {String} symbol - symbol of the ship to look for
	 * @param {String} system - system to look in
	 */
	async getBuyLocation(symbol, system) {
		const res = await axios({
			method: 'get',
			url:`/systems/${system}/ship-listings`,
		})
			.catch(err => { throw new Error(err.response.data.error.message);});
		
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
			throw new Error('Ship does not exist');
		}
	
		
	}
	async getAvailableShips(ship_class) {
		if (typeof ship_class === 'undefined') {
			ship_class = null;
		}
		const res = await axios({
			method:'get',
			url:'/types/ships',
			params:{
				'class':ship_class
			},
			paramsSerializer: params => {
				return qs.stringify(params);
			}
		})
			.catch(err => { throw new Error(err.response.data.error.message); });

		console.log(res.data);
	}
	
}

module.exports = {
	ApiCom
};