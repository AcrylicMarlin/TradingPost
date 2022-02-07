
/* eslint-disable linebreak-style */
/* eslint-disable @typescript-eslint/no-var-requires */

const axios = require('axios').default;
const qs = require('qs');
const { EventEmitter } = require('events');

/**
 * ApiCom
 * The communicator for the spacetraders api
 * (For use with discord.js)
 * @author - Justin Cardenas
 * @version - 1.0.0
 */
class ApiCom extends EventEmitter {
	/**
	 * Builds the api communicator for SpaceTraders
	 * @param {String} token - The Bearer token of the user
	 * @param {String} username - Username of the user
	 */
	constructor(token, username) {
		super();
		this._token = token;
		this._username = username;
		this._base_url = 'https://api.spacetraders.io';
		this.axios_client = axios.create({
			baseURL: this._base_url,
			headers: {
				'Authorization': this._token
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
	//Miscellaneous Requests
	/**
	 * Gets the status of game servers
	 */
	async getStatus() {
		const res = await this.axios_client.request({
			method: 'get',
			url: `${this._base_url}/game/status`
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; });
		if (!res) return;
		console.log(`http code: ${res.status}\nStatus: ${res.data.status}`);
	}
	/**
	 * Gets the users account
	 */
	async getAccount() {
		const res = await this.axios_client.request({
			method: 'GET',
			url: '/my/account',
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; });

		if (!res) return;
		console.log(res.data);
	}


	// System Requests
	/**
	 * Gets information on a system
	 * @param {string} symbol - symbol of system
	 */
	async getSystemInfo(symbol) {
		const res = await this.axios_client.request({
			method: 'GET',
			url: `/systems/${symbol.toUpperCase()}`
		})
			.catch(err => { this.emit('error',new Error(err.response.data.error.message)); return false; });
		if (!res) return;
		console.log(res.data);
	}
	/**
	 * Gets the locations in a system
	 * @param {string} symbol - symbol of location
	 */
	async getSystemLocations(symbol) {
		const res = await this.axios_client.request({
			method: 'GET',
			url: `/systems/${symbol}/locations`
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; });
		if (!res) return;
		console.log(res.data);
	}
	/**
	 * Gets all of the flight plans
	 * @param {string} symbol - Symbol of the system 
	 */
	async getFlightsInSystem(symbol) {
		const res = await this.axios_client.request({
			method:'GET',
			url:`/systems/${symbol}/flight-plans`
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; });
		
		if (!res) return;
		console.log(res.data);
	}
	/**
	 * Gets all of the docked ships in a system
	 * @param {string} symbol - Symbol of the system
	 */
	async getDockedShipsInSystem(symbol) {
		const res = this.axios_client.request({
			method:'GET',
			url:`/systems/${symbol}/ships`
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; });
		if (!res) return;
		console.log(res.data);
	}







	// Ship Requests
	/**
	 * buy a thing
	 * @param {string} location_symbol - Location of the ship
	 * @param {string} ship_symbol - symbol of the ship to buy
	 */
	async buyShip(location_symbol, ship_symbol) {
		const res = await axios({
			method: 'POST',
			url: '/my/ships',
			params: {
				location: location_symbol,
				type: ship_symbol
			},
			paramsSerializer: params => {
				return qs.stringify(params);
			}
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; });
		if (!res) return;
		console.log(res.data);
	}
	/**
	 * Gets the ship listings of the system
	 * @param {string} symbol - Symbol of system
	 * @param {string} ship_class - Class of ships (defaults to null)
	 * @returns - http request
	 */
	async getSystemShipListings(symbol, ship_class) {
		if (typeof ship_class === 'undefined') {
			ship_class = null;
		}
		const res = await axios({
			method: 'get',
			url: `/systems/${symbol.toUpperCase()}/ship-listings`,
			params: {
				'class': ship_class
			},
			paramsSerializer: params => {
				return qs.stringify(params);
			}
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; });
		if (!res) return;
		console.log(res.data);
	}
	/**
	 * Gets the users ships
	 */
	async getUserShips() {
		const res = await axios({
			method: 'get',
			url: '/my/ships',
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; });
		if (!res) return;
		console.log(res.data);
	}
	/**
	 * Gets the buy location of the ship specifed in the system
	 * @param {string} symbol - symbol of the ship to look for
	 * @param {string} system - system to look in
	 */
	async getBuyLocation(symbol, system) {
		const res = await axios({
			method: 'get',
			url: `/systems/${system}/ship-listings`,
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; });
		if (!res) return;

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
			this.emit('error', new Error('This ship does not exist'));
		}
	}

	/**
	 * Gets information on given ship
	 * @param {string} shipID - actual id of the ship
	 */
	async getShipInfo(shipID) {
		const res = await this.axios_client.request({
			method: 'GET',
			url: `/my/ships/${shipID}`
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; });
		if (!res) return;
		console.log(res.data);
	}
	/**
	 * Gets users ships
	 */
	async getShips() {
		const res = await this.axios_client.request({
			method: 'GET',
			url: '/my/ships'
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; });
		if (!res) return;
		console.log(res.data);
	}
	/**
	 * Jettisons cargo into space
	 * @param {string} id - ID of ship
	 * @param {string} good - Symbol of the good
	 * @param {number} quantity - Amount of goods to jettison
	 */
	async jettison(id, good, quantity) {
		const res = await this.axios_client.request({
			method:'POST',
			url:`/my/ships/${id}/jettison`,
			params:{
				good:good,
				quantity:quantity
			},
			paramsSerializer: params => {
				return qs.stringify(params);
			}
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; });
		if (!res) return;
		console.log(res.data);
	}
	/**
	 * Scraps ship for credits
	 * @param {string} id - ID of ship
	 */
	async scrap(id) {
		const res = await this.axios_client.request({
			method:'DELETE',
			url:`/my/ships/${id}`
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; });
		if (!res) return;
		console.log(res.data);
	}
	async transfer(fromID, toID, good, quantity) {
		const res = await this.axios_client.request({
			method:'POST',
			url:`/my/ships/${fromID}/transfer`,
			params:{
				toShipID:toID,
				good:good,
				quantity:quantity
			},
			paramsSerializer:params => {
				return qs.stringify(params);
			}
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; });
		if (!res) return;
		console.log(res.data);
	}
	// Loans Requests
	/**
	 * get loans you have taken out
	 */
	async getUserLoans() {
		const res = await this.axios_client.request({
			method: 'GET',
			url: '/my/loans'
		})
			.catch(err => { this.emit('httpError', err); return false; });
		if (!res) return;
		console.log(res.data);
	}
	/**
	 * Take a loan
	 * @param {string} type - Type of loan to take
	 */
	async takeLoan(type) {
		const res = await this.axios_client.request({
			method: 'POST',
			url: '/my/loans',
			params: {
				type: type.toUpperCase()
			},
			paramsSerializer: params => {
				return qs.stringify(params);
			}
		})
			.catch(err => { this.emit('httpError', err); return false; });
		if (!res) return;
		console.log(res.data);
	}

	/**
	 *
	 * @param {string} loanID - id of the loan (NOT TYPE)
	 */
	async payLoan(loanID) {
		const res = await this.axios_client.request({
			method: 'PUT',
			url: `/my/loans/${loanID}`,
		})
			.catch(err => { this.emit('httpError', err); return false; });
		if (!res) return;
		console.log(res.data);
	}

	
	



	// Location Requests
	/**
	 * Gets Location Info
	 * @param {string} location - location symbol
	 */
	async getLocationInfo(location) {
		const res = await this.axios_client.request({
			method:'GET',
			url:`/locations/${location}`
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; });
		
		if (!res) return;
		console.log(res.data);
	}
	/**
	 * Gets all ships docked at location
	 * @param {string} location - Location symbol
	 */
	async getLocationShips(location) {
		const res = await this.axios_client.request({
			method:'GET',
			url:`/locations/${location}/ships`
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; });
		if (!res) return;
		console.log(res.data);
	}
	/**
	 * Gets the marketplace listings for a location
	 * @param {string} location - Location symbol
	 * @returns 
	 */
	async getLocationMarket(location) {
		const res = await this.axios_client.request({
			method:'GET',
			url:`/locations/${location}`
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; });
		if (!res) return false;
		console.log(res.data);
	}

	// Types Requests
	/**
	 * Gets all available ships
	 * @param {string} ship_class - Sort by class (optional)
	 */
	async getAvailableShips(ship_class) {
		if (typeof ship_class === 'undefined') {
			ship_class = null;
		}
		const res = await axios({
			method: 'get',
			url: '/types/ships',
			params: {
				'class': ship_class
			},
			paramsSerializer: params => {
				return qs.stringify(params);
			}
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; });
		if (!res) return;
		console.log(res.data);
	}

	/**
	 * Gets all goods
	 */
	async getGoodsTypes() {
		const res = await this.axios_client.request({
			method:'GET',
			url:'types/goods'
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false;});
		if (!res) return;
		console.log(res.data);
	}
	/**
	 * Gets all structures
	 */
	async getStructures() {
		const res = await this.axios_client.request({
			method:'GET',
			url:'/types/structures'
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; });
		if (!res) return;
		console.log(res.data);
	}
	/**
	 * get all loans available
	 */
	async getLoans() {
		const res = await this.axios_client.request({
			method: 'GET',
			url: '/types/loans'
		})
			.catch(err => { this.emit('httpError', err); return false; });
		if (!res) return;
		console.log(res.data);
	}

	// Structure requests
	async buyStructure(location, type) {
		const res = await this.axios_client.request({
			method:'POST',
			url:'/my/structures',
			params:{
				location:location,
				type:type
			},
			paramsSerializer: params => {
				return qs.stringify(params);
			}
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; });
		if (!res) return;
		console.log(res.data);
	}
	/**
	 * Deposits goods to a structure from a ship
	 * @param {string} structure - Strucuture ID
	 * @param {string} ship - Ship's ID
	 * @param {string} good - Type of good
	 * @param {number|string} quantity - Quantity of transfer
	 */
	async depositToOwnStructure(structure, ship, good, quantity) {
		const res = await this.axios_client.request({
			method:'POST',
			url:`/my/structures/${structure}/deposit`,
			params:{
				shipId:ship,
				good:good,
				quantity:quantity
			},
			paramsSerializer:params => {
				return qs.stringify(params);
			}
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; });
		if (!res) return;
		console.log(res.data);
	}
	/**
	 * Deposits goods to a structure from a ship
	 * @param {string} structure - Strucuture ID
	 * @param {string} ship - Ship's ID
	 * @param {string} good - Type of good
	 * @param {number|string} quantity - Quantity of transfer
	 */
	async depositToAStructure(structure, ship, good, quantity) {
		const res = await this.axios_client.request({
			method:'GET',
			url:`/structures/${structure}/deposit`,
			params:{
				shipId:ship,
				good:good,
				quantity:quantity
			},
			paramsSerializer:params => {
				return qs.stringify(params);
			}

		})
			.catch(err => { this.emit('error', new Error(err.reponse.data.error.message)); return false; });
		if (!res) return;
		console.log(res.data);
	}
	/**
	 * Gets information about a structure
	 * @param {string} structure - Structure's ID
	 */
	async getStructureInfo(structure) {
		const res = await this.axios_client.request({
			method:'GET',
			url:`/structures/${structure}`
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; });
		if (!res) return;
		console.log(res.data);
	}
	/**
	 * Transfers goods from the structure to the ship
	 * @param {string} structure - Structure's ID
	 * @param {string} ship - Ship's ID
	 * @param {string} good - Type of good
	 * @param {number|string} quantity - quantity to transfer
	 */
	async transferGoods(structure, ship, good, quantity) {
		const res = await this.axios_client.request({
			method:'POST',
			url:`/my/structures/${structure}/transfer`,
			params:{
				shipId:ship,
				good:good,
				quantity:quantity
			},
			paramsSerializer: params => {
				return qs.stringify(params);
			}
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; });
		if (!res) return;
		console.log(res.data);
	}
	/**
	 * 
	 * @param {string} structure 
	 * @returns 
	 */
	async getOwnedStructureInfo(structure) {
		const res = this.axios_client.request({
			method:'GET',
			url:`/my/structures/${structure}`
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; });
		if (!res) return;
		console.log(res.data);
	}
	/**
	 * Gets information on all owned structures
	 */
	async getOwnedStructures() {
		const res = await this.axios_client.request({
			method:'GET',
			url:'/my/structures'
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; });
		if (!res) return;
		console.log(res.data);
	}

}

module.exports = {
	ApiCom
};


