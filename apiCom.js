'use strict';
/* eslint-disable linebreak-style */
/* eslint-disable @typescript-eslint/no-var-requires */

const axios = require('axios').default;
const { AxiosResponse } = require('axios');
const qs = require('qs');
const { EventEmitter } = require('events');
const { Ship, PartialShip, MarketShip } = require('./dataclasses');

/**
 * ApiCom
 * The communicator for the spacetraders api
 * (For use with discord.js)
 * It is noted that errors are thrown using an 'error' event,
 * so you should the client.on to catch them. 
 * @author - Justin Cardenas
 * @version - 1.0.3
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
	 * @returns {AxiosResponse}
	 */
	async getStatus() {
		const res = await this.axios_client.request({
			method: 'get',
			url: `${this._base_url}/game/status`
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; });
		if (!res) return;
		return res;
	}
	/**
	 * Gets the users account
	 * @returns {AxiosResponse} - Https Response
	 */
	async getAccount() {
		const res = await this.axios_client.request({
			method: 'GET',
			url: '/my/account',
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; });

		if (!res) return;
		return res;
	}


	// System Requests
	/**
	 * Gets information on a system
	 * @param {string} symbol - symbol of system
	 * @returns {AxiosResponse} - Https Response
	 */
	async getSystemInfo(symbol) {
		const res = await this.axios_client.request({
			method: 'GET',
			url: `/systems/${symbol.toUpperCase()}`
		})
			.catch(err => { this.emit('error',new Error(err.response.data.error.message)); return false; });
		if (!res) return;
		return res;
	}
	/**
	 * Gets the locations in a system
	 * @param {string} symbol - symbol of location
	 * @returns {AxiosResponse} - Https Response
	 */
	async getSystemLocations(symbol) {
		const res = await this.axios_client.request({
			method: 'GET',
			url: `/systems/${symbol}/locations`
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; });
		if (!res) return;
		return res;
	}
	/**
	 * Gets all of the flight plans
	 * @param {string} symbol - Symbol of the system 
	 * @returns {AxiosResponse} - Https Response
	 */
	async getFlightsInSystem(symbol) {
		const res = await this.axios_client.request({
			method:'GET',
			url:`/systems/${symbol}/flight-plans`
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; });
		
		if (!res) return;
		return res;
	}
	/**
	 * Gets all of the docked ships in a system
	 * @param {string} symbol - Symbol of the system
	 * @returns {AxiosResponse} - Https Response
	 */
	async getDockedShipsInSystem(symbol) {
		const res = await this.axios_client.request({
			method:'GET',
			url:`/systems/${symbol}/ships`
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; });
		if (!res) return;
		return res;
	}







	// Ship Requests
	/**
	 * buy a thing
	 * @param {string} location_symbol - Location of the ship
	 * @param {string} ship_symbol - symbol of the ship to buy
	 * @returns {AxiosResponse} - Https Response
	 */
	async buyShip(location_symbol, ship_symbol) {
		const res = await this.axios_client.request({
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
		return res;
	}
	/**
	 * Gets the ship listings of the system
	 * @param {string} symbol - Symbol of system
	 * @param {string} ship_class - Class of ships (defaults to null)
	 * @returns {MarketShip[]} - Array of MarketShips
	 */
	async getSystemShipListings(symbol, ship_class) {
		if (typeof ship_class === 'undefined') {
			ship_class = null;
		}
		const listings = await this.axios_client.request({
			method: 'get',
			url: `/systems/${symbol.toUpperCase()}/ship-listings`,
			params: {
				'class': ship_class
			},
			paramsSerializer: params => {
				return qs.stringify(params);
			}
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; })
			.then(res => {
				let listings = []
				for (const listing of res.data.shipListings) {
					listings.push(new MarketShip(
						listing.type,
						listing.class,
						listing.maxCargo,
						listing.loadingSpeed,
						listing.speed,
						listing.manufacturer,
						listing.plating,
						listing.weapons,
						listing.restrictedGoods || null,
						listing.purchaseLocations
					));
				return listings
				}
			});
		if (!listings) return;
		return listings;
	}
	/**
	 * Gets the users ships
	 * @returns {Ship[]} - Array of Ships
	 */
	async getUserShips() {
		const ships = await this.axios_client.request({
			method: 'get',
			url: '/my/ships',
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; })
			.then(res => {
				let ships = [];
				for (const ship of res.data.ships) {
					ships.push(new Ship(
						ship.id,
						ship.locaion,
						ship.x,
						ship.y,
						ship.cargo,
						ship.spaceAvailable,
						ship.type,
						ship.maxCargo,
						ship.loadingSpeed,
						ship.speed,
						ship.manufacturer,
						ship.plating,
						ship.weapons
					));
				}
				return ships
			});
		if (!ships) return;
		return ships;
	}
	/**
	 * Gets the buy location of the ship specifed in the system
	 * @param {string} symbol - symbol of the ship to look for
	 * @param {string} system - system to look in
	 * @returns {AxiosResponse} - Https Response
	 */
	async getBuyLocation(symbol, system) {
		const res = await this.axios_client.request({
			method: 'get',
			url: `/systems/${system}/ship-listings`,
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; });
		if (!res) return;

		return res;
	}

	/**
	 * Gets information on given ship
	 * @param {string} shipID - actual id of the ship
	 * @returns {AxiosResponse} - Https Response
	 */
	async getShipInfo(shipID) {
		const res = await this.axios_client.request({
			method: 'GET',
			url: `/my/ships/${shipID}`
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; });
		if (!res) return;
		return res;
	}
	/**
	 * Jettisons cargo into space
	 * @param {string} id - ID of ship
	 * @param {string} good - Symbol of the good
	 * @param {number} quantity - Amount of goods to jettison
	 * @returns {AxiosResponse} - Https Response
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
		return res;
	}
	/**
	 * Scraps ship for credits
	 * @param {string} id - ID of ship
	 * @returns {AxiosResponse} - Https Response
	 */
	async scrap(id) {
		const res = await this.axios_client.request({
			method:'DELETE',
			url:`/my/ships/${id}`
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; });
		if (!res) return;
		return res;
	}
	/**
	 * Transfers goods from one ship to another
	 * @param {string} fromID - Starting Ship
	 * @param {string} toID - Ship to transfer to
	 * @param {string} good - Type of good
	 * @param {number | string} quantity - Quantity to transfer
	 * @returns {AxiosResponse} - Https Response
	 */
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
		return res;
	}
	// Loans Requests
	/**
	 * get loans you have taken out
	 * @returns {AxiosResponse} - Https Response
	 */
	async getUserLoans() {
		const res = await this.axios_client.request({
			method: 'GET',
			url: '/my/loans'
		})
			.catch(err => { this.emit('httpError', err); return false; });
		if (!res) return;
		return res;
	}
	/**
	 * Take a loan
	 * @param {string} type - Type of loan to take
	 * @returns {AxiosResponse} - Https Response
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
		return res;
	}

	/**
	 *
	 * @param {string} loanID - id of the loan (NOT TYPE)
	 * @returns {AxiosResponse} - Https Response
	 */
	async payLoan(loanID) {
		const res = await this.axios_client.request({
			method: 'PUT',
			url: `/my/loans/${loanID}`,
		})
			.catch(err => { this.emit('httpError', err); return false; });
		if (!res) return;
		return res;
	}

	
	



	// Location Requests
	/**
	 * Gets Location Info
	 * @param {string} location - location symbol
	 * @returns {AxiosResponse} - Https Response
	 */
	async getLocationInfo(location) {
		const res = await this.axios_client.request({
			method:'GET',
			url:`/locations/${location}`
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; });
		
		if (!res) return;
		return res;
	}
	/**
	 * Gets all ships docked at location
	 * @param {string} location - Location symbol
	 * @returns {AxiosResponse} - Https Response
	 */
	async getLocationShips(location) {
		const res = await this.axios_client.request({
			method:'GET',
			url:`/locations/${location}/ships`
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; });
		if (!res) return;
		return res;
	}
	/**
	 * Gets the marketplace listings for a location
	 * @param {string} location - Location symbol
	 * @returns {AxiosResponse} - Https Response
	 */
	async getLocationMarket(location) {
		const res = await this.axios_client.request({
			method:'GET',
			url:`/locations/${location}`
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; });
		if (!res) return false;
		return res;
	}

	// Types Requests
	/**
	 * Gets all available ships
	 * @param {string} ship_class - Sort by class (optional)
	 * @returns {PartialShip[]} - Array of Ship Objects
	 */
	async getAvailableShips(ship_class) {
		if (typeof ship_class === 'undefined') {
			ship_class = null;
		}
		const ships = await this.axios_client.request({
			method: 'get',
			url: '/types/ships',
			params: {
				'class': ship_class
			},
			paramsSerializer: params => {
				return qs.stringify(params);
			}
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; })
			.then(res => {
				let ships = [];
				for (const ship of res.data.ships) {
					ships.push(new PartialShip(
						ship.type,
						ship.maxCargo,
						ship.loadingSpeed,
						ship.speed,
						ship.manufacturer,
						ship.plating,
						ship.weapons
					));
		
				}
				return ships;
			});
		if (!ships) return;
		
		
		return ships;
	}

	/**
	 * Gets all goods
	 * @returns {AxiosResponse} - Https Response
	 */
	async getGoodsTypes() {
		const res = await this.axios_client.request({
			method:'GET',
			url:'types/goods'
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false;});
		if (!res) return;
		return res;
	}
	/**
	 * Gets all structures
	 * @returns {AxiosResponse} - Https Response
	 */
	async getStructures() {
		const res = await this.axios_client.request({
			method:'GET',
			url:'/types/structures'
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; });
		if (!res) return;
		return res;
	}
	/**
	 * get all loans available
	 * @returns {AxiosResponse} - Https Response
	 */
	async getLoans() {
		const res = await this.axios_client.request({
			method: 'GET',
			url: '/types/loans'
		})
			.catch(err => { this.emit('httpError', err); return false; });
		if (!res) return;
		return res;
	}

	// Structure requests
	/**
	 * Buys a structure
	 * @param {*} location - location to build
	 * @param {*} type - type of structure
	 * @returns {AxiosResponse} - Https Response
	 */
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
		return res;
	}
	/**
	 * Deposits goods to a structure from a ship
	 * @param {string} structure - Strucuture ID
	 * @param {string} ship - Ship's ID
	 * @param {string} good - Type of good
	 * @param {number|string} quantity - Quantity of transfer
	 * @returns {AxiosResponse} - Https Response
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
		return res;
	}
	/**
	 * Deposits goods to a structure from a ship
	 * @param {string} structure - Strucuture ID
	 * @param {string} ship - Ship's ID
	 * @param {string} good - Type of good
	 * @param {number|string} quantity - Quantity of transfer
	 * @returns {AxiosResponse} - Https Response
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
		return res;
	}
	/**
	 * Gets information about a structure
	 * @param {string} structure - Structure's ID
	 * @returns {AxiosResponse} - Https Response
	 */
	async getStructureInfo(structure) {
		const res = await this.axios_client.request({
			method:'GET',
			url:`/structures/${structure}`
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; });
		if (!res) return;
		return res;
	}
	/**
	 * Transfers goods from the structure to the ship
	 * @param {string} structure - Structure's ID
	 * @param {string} ship - Ship's ID
	 * @param {string} good - Type of good
	 * @param {number|string} quantity - quantity to transfer
	 * @returns {AxiosResponse} - Https Response
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
		return res;
	}
	/**
	 * 
	 * @param {string} structure 
	 * @returns {AxiosResponse} - Https Response
	 */
	async getOwnedStructureInfo(structure) {
		const res = await this.axios_client.request({
			method:'GET',
			url:`/my/structures/${structure}`
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; });
		if (!res) return;
		return res;
	}
	/**
	 * Gets information on all owned structures
	 * @returns {AxiosResponse} - Https Response
	 */
	async getOwnedStructures() {
		const res = await this.axios_client.request({
			method:'GET',
			url:'/my/structures'
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; });
		if (!res) return;
		return res;
	}
	// Flight plan commands
	/**
	 * Gets information on a flight plan
	 * @param {string} flight_plan - ID of the flight plan
	 * @returns {AxiosResponse} - Https Response
	 */
	async getFlightPlanInfo(flight_plan) {
		const res = await this.axios_client.request({
			method:'GET',
			url:`/my/flight-plans/${flight_plan}`
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; });
		if (!res) return;
		return res;
	}
	/**
	 * 
	 * @param {string} destination - Symbol of the loction to travel to
	 * @param {string} ship - ID of the ship for travel
	 * @returns {AxiosResponse} - Https Response
	 */
	async startFlight(destination, ship) {
		const res = await this.axios_client.request({
			method:'POST',
			url:'my/flight-plans',
			params:{
				shipId:ship,
				destination:destination
			},
			paramsSerializer:params => {
				return qs.stringify(params);
			}
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; });
		if (!res) return;
		return res;
	}


	//Warp Jump Requests
	/**
	 * Attempts to warp to a new system
	 * @param {string} ship - ID of ship to attempt warp with
	 * @returns {AxiosResponse} - Https Response
	 */
	async attemptWarp(ship) {
		const res = await this.axios_client.request({
			method:'POST',
			url:'/my/warp-jumps',
			params:{
				shipId:ship,
			},
			paramsSerializer:params => {
				return qs.stringify(params);
			}
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; });
		if (!res) return;
		return res;
	}

}

module.exports = {
	ApiCom
};


