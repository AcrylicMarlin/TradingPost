'use strict';

const axios = require('axios').default;
const { AxiosResponse } = require('axios');
const qs = require('qs');
const { EventEmitter } = require('events');
const { Ship, PartialShip, MarketShip, Location, Good, Loan, Listing, Structure, System, UserFlightPlan, FlightPlan, Order, MarketOrder, User, PartialSystem, Jettison, StructureType, ShipType } = require('./dataclasses');
const utils = require('./utils');
const fs = require('fs');
const { default: Bottleneck } = require('bottleneck');


/**
 * Trading Post
 * The communicator for the spacetraders api
 * @author AcrylicMarlin
 * @version 1.0.0-Beta
 */
module.exports = class TradingPost extends EventEmitter {

	constructor() {
		super();
		this.User;
		this.token = null;
		this.axios_client = null;
		this.systems = [];		
		this.goods = null;
		this.limit = 2;
		this.current = 0;
		this.limiter = new Bottleneck({minTime:500, maxConcurrent:1})
		this.status = null;
	}
	async #getUser() {
		return await this.getAccount();
	}
	/**
	 * Generates the client session
	 * @param {string} token token of user
	 */
	async start_client(token) {
		this.token = token;

		this.axios_client = axios.create({
			baseURL:'https://api.spacetraders.io',
			headers: {
				'Authorization':token
			}
		});
		await this.getStatus();
		if (!this.status) {
			return;
		}
		this.User = await this.#getUser();
		await this.#gatherData();
		if (this.#checkIfReady()) {
			this.emit('ready');
		} else {
			this.emit('error', new Error('Connection Failed'));
			this.stop_client();
		}
		// this.emit('ready');
		

		
		
	}

	
	async stop_client() {
		throw new utils.ExitConnection();
	}
	async #gatherData() {
		const systems = ['OE', 'XV', 'NA7', 'ZY1']
		for (const item of systems) {
			const locations = await this.getSystemLocations(item);
			const system = await this.getSystemInfo(item);
			this.systems.push(utils.parseSystem(this, locations, system))
		}
		this.goods = await this.getGoodsTypes()
		this.ships = await this.getAvailableShips()
		this.loans = await this.getLoans();


	}
	#checkIfReady() {
		const status = this.systems.length !== 0
		&& this.User instanceof User
		&& this.token !== null
		&& this.axios_client !== null
		&& this.goods.length !== 0
		&& this.ships.length !== 0;
		return status;
	}

	
	//Miscellaneous Requests
	/**
	 * Gets the status of game servers
	 * @returns {AxiosResponse}
	 */
	async getStatus() {
		const status = await this.limiter.schedule(async () => { const res = await this.axios_client.request({
			method: 'get',
			url: '/game/status'
		})
		.then(res => { return res })
		return res;
		})
		.catch(err => { 
			let error = new Error(err.response.data.error.message);
			error.name = err.response.data.error.code;
			this.emit('error', error); return false; })
		.then(res => {
			// console.log(res);
			if (res.status === 200) {
				console.log(res.data.status);
				this.status = true;
			} else {
				this.emit('error', new Error('The API is currently down or under maintenance. Go to https://api.spacetraders.io for more information'));
				this.status = false;
			}
		});
		if (!status) return;
		return status;


	}

	/**
	 * Gets the users account
	 * @returns {User} - User object containing user data
	 */
	async getAccount() {
		const user = this.limiter.schedule(async () => { const res = await this.axios_client.request({
			method: 'GET',
			url: '/my/account',
			})
			.then((res) => { return res; })
			.catch(err => { throw new Error(err) });
			return res;
		})

		.catch(err => { 
			const error = null;
			try {
				error = new Error(err.response.data.error.message);
			} catch (error) {
				error = new Error(err);
			}
			this.emit('error', err); return false; })
		
		.then(res => { return new User(
			res.data.user.username,
			res.data.user.shipCount,
			res.data.user.structureCount,
			res.data.user.joinedAt,
			res.data.user.credits,
			this.token); });

		if (!user) return;
		this.emit('request');
		return user;
		
	}


	// System Requests
	/**
	 * Gets information on a system
	 * @param {string} symbol - symbol of system
	 * @returns {AxiosResponse} - Https Response
	 */
	async getSystemInfo(symbol) {
		const system = this.limiter.schedule(async () => { const res = await this.axios_client.request({
			method: 'GET',
			url: `/systems/${symbol.toUpperCase()}`
		})
		.then(res => { return res })
		.catch(err => { throw new Error(err)})
		return res;
	})

		.catch(err => { 
			let error = new Error(err.message.response.data.error.message);
			error.name = err.message.response.data.error.code;
			this.emit('error', error); return false; })

		.then(res => { return new PartialSystem(res.data.system.name, res.data.system.symbol)});

		this.emit('request');
		if (!system) return;
		return system;
	}
	/**
	 * Gets the locations in a system
	 * @param {string} symbol - symbol of system
	 * @returns {Location[]} - Array of locations
	 */
	async getSystemLocations(symbol) {
		const locations = this.limiter.schedule(async () => { const res = await this.axios_client.request({
			method: 'GET',
			url: `/systems/${symbol.toUpperCase()}/locations`
		})
		.then(res => { return res })
		.catch(err => { throw new Error(err)});
		return res;
	})
		.catch(err => { 
			let error = new Error(err.message.response.data.error.message);
			error.name = err.message.response.data.error.code;
			this.emit('error', error); return false;
		})
		.then(res => {
			let locations = [];
			res.data.locations.forEach(location => {
				locations.push(new Location(
					location.symbol,
					location.type,
					location.name,
					location.x,
					location.y,
					location.allowsConstruction,
					location.traits || null,
					location.messages || null
				));
			});
			return locations;
		});
		if (!locations) return;
		return locations;
		
	}
	/**
	 * Gets all of the flight plans
	 * @param {string} symbol - Symbol of the system 
	 * @returns {UserFlightPlan[]} - Https Response
	 */
	async getFlightsInSystem(symbol) {
		const flights = await this.limiter.schedule(async () => { const res = await this.axios_client.request({
			method:'GET',
			url:`/systems/${symbol}/flight-plans`
		})
		.then(res => { return res })
		.catch(err => { throw new Error(err) });
		return res;
	})
			.catch(err => {
				const error = new Error(err.message.response.data.error.message);
				error.name = err.message.response.data.error.status;
				this.emit('error', error); return false; })
			.then(res => { 
				let flights = [];
				res.data.flightPlans.forEach(plan => {
					flights.push(new UserFlightPlan(
						plan.id,
						plan.shipId,
						plan.createdAt,
						plan.arrivesAt,
						plan.destination,
						plan.departure,
						plan.username,
						plan.shipType
					));
					
				});
				return flights;
			});
		
		if (!flights) return;
		return flights;
	}








	// Ship Requests
	/**
	 * buy a thing
	 * @param {string} location_symbol - Location to buy from
	 * @param {string} ship_symbol - symbol of the ship to buy
	 * @returns {Ship & User} - Https Response
	 */
	async buyShip(location_symbol, ship_symbol) {
		const result = await this.limiter.schedule(async () => { const res = await this.axios_client.request({
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
		.then(res => { return res })
		.catch(err => { throw new Error(err) });
		return res;
	})
		.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; })
		.then(async res => {
			const user = await this.getAccount();
			const ship = res.data.ship;
			const newShip = new Ship(
				ship.id,
				ship.location,
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
			)
			return {newShip:newShip, user:user};
		});
		if (!result) return;
		return result;
	}
	/**
	 * Gets a ship that is for sale
	 * @param {string} ship - Symbol of ship
	 * @param {string} system - symbol of system to search in
	 * @returns {MarketShip} MarketShip
	 */
	async getMarketShip(ship, system) {
		const mShip = await this.limiter.schedule(async () => { const res = await this.axios_client.request({
			method: 'get',
			url: `/systems/${system.toUpperCase()}/ship-listings`,
		})
		.then(res => { return res })
		.catch(err => { throw new Error(err)});
		return res;
	})
			.catch(err => { 
				let error = new Error(err.message.response.data.error.message);
				error.name = err.message.response.data.error.code;
				this.emit('error', error); return false; })
			.then(res => {
				let mShip = null;
				for (const listing of res.data.shipListings) {
					if (listing.type === ship) {
						mShip = utils.parseMarketShip(listing, system, this);
						break;
					}
					
				}
				if (!mShip) {
					this.emit('error', new Error(`Ship "${ship}" was not found.`));
					this.stop_client();
				}
				return mShip;
			});
		if (!mShip) return;
		return mShip;
	}
	/**
	 * Gets the users ships
	 * @returns {Ship[]} - Array of Ships
	 */
	async getUserShips() {
		const ships = await this.limiter.schedule(async () => { const res = await this.axios_client.request({
			method: 'get',
			url: '/my/ships',
		})
		.then(res => { return res })
		.catch(err => { throw new Error(err) });
		return res;
	})
			.catch(err => {
				const error = new Error(err.message.response.data.error.message);
				error.name = err.message.response.data.error.status;
				this.emit('error', error); return false; })
			.then(res => {
				let ships = [];
				for (const ship of res.data.ships) {
					ships.push(utils.parseShip(ship));
				}
				return ships
			});
		if (!ships) return;
		return ships;
	}

	/**
	 * Gets information on given ship
	 * @param {string} shipID - actual id of the ship
	 * @returns {AxiosResponse} - Https Response
	 */
	async getShipInfo(shipID) {
		const ship = await this.limiter.schedule(async () => { const res = await this.axios_client.request({
			method: 'GET',
			url: `/my/ships/${shipID}`
		})
		.then(res => { return res })
		.catch(err => { throw new Error(err) });
		return res;
	})
		.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; })
		.then(res => {
			const ship = res.data.ship;
			return new Ship(
				ship.id,
				ship.location,
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
			)
		});
		if (!ship) return;
		return ship;
	}
	/**
	 * Jettisons cargo into space
	 * @param {string} id - ID of ship
	 * @param {string} good - Symbol of the good
	 * @param {number} quantity - Amount of goods to jettison
	 * @returns {AxiosResponse} - Https Response
	 */
	async jettison(id, good, quantity) {
		const jettison = await this.limiter.schedule(async () => { const res = await this.axios_client.request({
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
		.then(res => { return res })
		.catch(err => {throw new Error(err) });
		return res;
	})
		.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; })
		.then(res => {
			let item = res.data.good;
			for (const good of this.goods) {
				if (good.symbol == item) {
					item = good;
					break;
				}
			}
			return new Jettison(
				item,
				res.data.quantityRemaining,
				res.data.shipId
			)
		});
		if (!jettison) return;
		return jettison;
	}
	/**
	 * Scraps ship for credits
	 * @param {string} id - ID of ship
	 * @returns {AxiosResponse} - Https Response
	 */
	async scrap(id) {
		const success = this.limiter.schedule(async () => { const res = await this.axios_client.request({
			method:'DELETE',
			url:`/my/ships/${id}`
		})
		.then(res => { return res })
		.catch(err => { throw new Error(err) });
		return res;
	})
		.catch(err => { 
			const error = new Error(err.message.response.data.error.message);
			error.name = err.message.response.data.error.status;
			this.emit('error', error); return false; })
		.then(success => { return utils.parseMiscData(success) });
		if (!success) return;
		return success;
	}
	/**
	 * Transfers goods from one ship to another
	 * @param {string} fromID - Starting Ship
	 * @param {string} toID - Ship to transfer to
	 * @param {string} good - Type of good
	 * @param {number | string} quantity - Quantity to transfer
	 * @returns {{ toShip:Ship, fromShip:Ship }}
	 */
	async transfer(fromID, toID, good, quantity) {
		const transfer = await this.limiter.schedule(async () => { const res = await this.axios_client.request({
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
		.then(res => { return res })
		.catch(err => { throw new Error(err) });
		return res;
	})

		.catch(err => {
			const error = new Error(err.message.response.data.error.message);
			error.name = err.message.response.data.error.message;
			this.emit('error', error); return false; })
		
		.then(res => {
			const toShipData = res.data.toShip;
			const fromShipData = res.data.fromShip;
			
			const toShip = utils.parseShip(toShipData);
			const fromShip = utils.parseShip(fromShipData);
			return {toShip:toShip, fromShip:fromShip}
		});
		if (!transfer) return;
		return transfer;
	}
	// Loans Requests
	/**
	 * get loans you have taken out
	 * @returns {AxiosResponse} - Https Response
	 */
	async getUserLoans() {
		const loans = await this.axios_client.request({
			method: 'GET',
			url: '/my/loans'
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; })
			.then(res => {
				let loans = [];
				for (const loan of res.data.loans) {
					loans.push(new Loan(
						loan.type,
						this.loans.at(0).amount,
						this.loans.at(0).rate,
						this.loans.at(0).term,
						this.loans.at(0).collateralRequired,
						loan.due,
						loan.id,
						loan.status,
						loan.repaymentAmount
					))
				}
				return loans;
			})
		if (!loans) return;
		return loans;
	}
	/**
	 * Take a loan
	 * @param {string} type - Type of loan to take
	 * @returns {AxiosResponse} - Https Response
	 */
	async takeLoan(type) {
		const loan = await this.axios_client.request({
			method: 'POST',
			url: '/my/loans',
			params: {
				type: type.toUpperCase()
			},
			paramsSerializer: params => {
				return qs.stringify(params);
			}
		})
			.catch(err => { this.emit('httpError', err); return false; })
			.then(res => {
				const loanData = res.data.loan;
				return new Loan(
					loanData.type,
					this.loans.at(0).amount,
					this.loans.at(0).rate,
					this.loans.at(0).term,
					this.loans.at(0).collateralRequired,
					loanData.due,
					loanData.id,
					loanData.status,
					loanData.repaymentAmount
				);

			});
		if (!loan) return;
		return loan;
	}

	/**
	 *
	 * @param {string} loanID - id of the loan (NOT TYPE)
	 * @returns {AxiosResponse} - Https Response
	 */
	async payLoan(loanID) {
		const loan = await this.axios_client.request({
			method: 'PUT',
			url: `/my/loans/${loanID}`,
		})
			.catch(err => { this.emit('httpError', err); return false; })
			.then(res => {
				const loanData = res.data.loans[0];
				return new Loan(
					loanData.type,
					this.loans.at(0).amount,
					this.loans.at(0).rate,
					this.loans.at(0).term,
					this.loans.at(0).collateralRequired,
					loanData.due,
					loanData.id,
					loanData.status,
					loanData.repaymentAmount
				);

			});
		if (!loan) return;
		return loan;
	}

	
	




	/**
	 * Gets Location Info
	 * @param {string} symbol - location symbol
	 * @returns {AxiosResponse} - Https Response
	 */
	async getLocationInfo(symbol) {
		const location = await this.axios_client.request({
			method:'GET',
			url:`/locations/${symbol}`
		})
		.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; })
		.then(res => {
			const location = res.data.location;
			return new Location(
				location.symbol,
				location.type,
				location.name,
				location.x,
				location.y,
				location.allowsConstruction,
				location.traits,
				location.dockedShips,
				location.messages || null
			);
		});
		if (!location) return;
		return location;
	}
	/**
	 * Gets the marketplace listings for a location
	 * @param {string} location - Location symbol
	 * @returns {AxiosResponse} - Https Response
	 */
	async getLocationMarket(location) {
		const listings = await this.axios_client.request({
			method:'GET',
			url:`/locations/${location}/marketplace`
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; })
			.then(res => {
				let listings = [];
				const market = res.data.marketplace;
				for (const item of market) {
					listings.push(new Listing(
						item.symbol,
						item.volumePerUnit,
						item.pricePerUnit,
						item.spread,
						item.purchasePricePerUnit,
						item.sellPricePerUnit,
						item.quantityAvailable
					));
				}
				return listings;
			});
		if (!listings) return false;
		return listings;
	}

	// Types Requests
	/**
	 * Gets all available ships
	 * @param {string} ship_class - Sort by class (optional)
	 * @returns {PartialShip[]} - Array of Ship Objects
	 */
	async getAvailableShips(ship_class=null) {
		const ships = await this.limiter.schedule(async () => { const res = await this.axios_client.request({
			method: 'get',
			url: '/types/ships',
			params: {
				'class': ship_class
			},
			paramsSerializer: params => {
				return qs.stringify(params);
			}
		})
		.then(res => { return res; })
		.catch(err => { return err; });
		return res;
	})
		.catch(err => { 
		let error = new Error(err.response.data.error.message);
		error.name = err.response.data.error.code;
		this.emit('error', error); return false; })
		.then(res => {
			let ships = [];
			for (const ship of res.data.ships) {
				ships.push(new ShipType(
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
	 * @returns {Good[]} - Array of Goods
	 */
	async getGoodsTypes() {
		const goods = await this.limiter.schedule(async () => { const res = await this.axios_client.request({
			method:'GET',
			url:'types/goods'
		})
		.then(res => { return res })
		.catch(err => { throw new Error(err) })
		return res;
	})
			.catch(err => { 
				let error = new Error(err.message.response.data.error.message);
				error.name = err.message.response.data.error.code;
				this.emit('error', error); return false; })
			.then(res => {
				const goods = [];
				res.data.goods.forEach(good => {
					goods.push(new Good(
						good.name,
						good.symbol,
						good.volume
					));
				});
				return goods;
			});
		if (!goods) return;
		return goods;
	}
	/**
	 * Gets all structures
	 * @returns {AxiosResponse} - Https Response
	 */
	async getStructures() {
		const structures = await this.axios_client.request({
			method:'GET',
			url:'/types/structures'
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; })
			.then(res => {
				let structures = [];
				const structureData = res.data.structures;
				for (const structure of structureData) {
					structures.push(new StructureType(
						structure.type,
						structure.name,
						structure.price,
						structure.allowedLocationTypes,
						structure.allowedPlanetTraits,
						structure.consumes,
						structure.produces
					));
				}
				return structures;
			})
		if (!structures) return;
		
	}
	/**
	 * get all loans available
	 * @returns {Loan[]} - Array of loans
	 */
	async getLoans() {
		const loans = await this.limiter.schedule(async () => { const res = await this.axios_client.request({
			method: 'GET',
			url: '/types/loans'
		})
		.then(res => { return res })
		.catch(err => { throw new Error(err) });
		return res;
	})
		.catch(err => {
			const error = new Error(err.message.response.data.error.message);
			error.name = err.message.response.error.status;
			this.emit('error', error); return false; })
		.then(res => {
			let loans = [];
			res.data.loans.forEach(loan => {
				loans.push(new Loan(
					loan.type,
					loan.amount,
					loan.rate,
					loan.termInDays,
					loan.collateralRequired
				));
			});
			return loans;
		})
		if (!loans) return;
		return loans;
	}

	// Structure requests
	/**
	 * Buys a structure
	 * @param {string} location - location to build
	 * @param {string} type - type of structure
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
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; })
			.then(res => {
				return utils.parseStructure(res.data.structure);
			});
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
		const deposit = await this.axios_client.request({
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
			.catch(err => { this.emit('error', new Error(err.reponse.data.error.message)); return false; })
			.then(res => {
				const structure = utils.parseStructure(res.data.structure);
				const deposit = utils.parseDeposit(res.data.deposit);
				const ship = utils.parseShip(res.data.ship);
				return {structure:structure, deposit:deposit, ship:ship}
			});
		if (!deposit) return;
		return deposit;
	}
	/**
	 * Gets information about a structure
	 * @param {string} structure - Structure's ID
	 * @returns {AxiosResponse} - Https Response
	 */
	async getStructureInfo(structure) {
		const info = await this.axios_client.request({
			method:'GET',
			url:`/my/structures/${structure}`
		})
			.catch(err => { this.emit('error', new Error(err.response.data.error.message)); return false; })
			.then(res => {
				return utils.parseStructure(res.data.structure);
			});
		if (!info) return;
		return info;
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
		console.log(res.data);
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
		console.log(res.data);
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




