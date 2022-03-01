'use strict';
const axios = require('axios').default;
const qs = require('qs');
const { default: Bottleneck } = require('bottleneck');
const { EventEmitter } = require('events');
const { 
	Ship,
	MarketShip,
	SystemLocation,
	Good,
	Loan,
	Listing,
	Structure,
	System,
	UserFlightPlan,
	FlightPlan,
	Order,
	MarketOrder,
	User,
	PartialSystem,
	Jettison,
	StructureType,
	ShipType,
	Warp,
	Deposit,
	Transfer,
	MiscData
} = require('./utils/src/dataclasses');
const utils = require('./utils/src/utils');



/**
 * Trading Post
 * The communicator for the spacetraders api
 * @author AcrylicMarlin
 * @version 1.0.2-Beta
 */
module.exports = class TradingPost extends EventEmitter {

	constructor() {
		super();
		this.User=null;
		this.token=null;
		this.axios_client=null;
		this.systems=null;
		this.goods=null;
		this.limiter=null;
		this.status=null;
		this.structures=null;
	}
	async #getUser() {
		return await this.getAccount();
	}
	/**
	 * Generates the client session
	 * @param {string} token token of user
	 */
	async start_client(token) {
		if (!token) {
			this.emit('error', new utils.InvalidToken('No token provided'));
			return;
		}
		if (!token.startsWith('Bearer')) {
			token = 'Bearer ' + token;
		}
		this.token = token;
		this.limiter = new Bottleneck({minTime:750, maxConcurrent:1})
		this.axios_client = axios.create({
			baseURL:'https://api.spacetraders.io',
			headers: {
				'Authorization':token,
				'User-Agent':'tradingpost.js'
			},
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

		

		
		
	}

	
	async stop_client() {
		throw new utils.ExitConnection();
	}
	async #gatherData() {
		const systemsSymbols = ['OE', 'XV', 'NA7', 'ZY1']
		const systems = [];
		for (const item of systemsSymbols) {
			const locations = await this.getSystemLocations(item);
			const system = await this.getSystemInfo(item);
			systems.push(utils.parseSystem(locations, system))
		}
		this.systems = systems;
		this.goods = await this.getGoodsTypes()
		this.ships = await this.getShipTypes()
		this.structures = await this.getStructureTypes();
		this.loans = await this.getLoans();
		


	}
	#checkIfReady() {
		const status = this.systems.length !== 0
		&& this.User instanceof User
		&& typeof this.token !== null
		&& typeof this.axios_client !== null
		&& typeof this.goods.length !== null
		&& typeof this.ships.length !== null
		&& typeof this.structures !== null
		&& this.limiter instanceof Bottleneck
		return status;
	}

	
	//Miscellaneous Requests
	/**
	 * Gets the status of game servers
	 */
	async getStatus() {
		await this.limiter.schedule(async () => { const res = await this.axios_client.request({
			method: 'get',
			url: '/game/status'
		})
		.then(res => { return res })
		.catch(err => { throw err });
		return res;
		})
		.catch(err => { 
			const error = new Error(err.response.data.error.message);
			error.name = err.response.data.error.code;
			this.emit('error', error);
			return false;
		})
		.then(res => {
			console.log(res);
			if (res.status === 200) {
				this.status = true;
			} else {
				this.emit('error', new utils.ConnectionFailed('The API is currently down or under maintenance. Go to https://api.spacetraders.io for more information'));
				this.status = false;
			}
		});


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
			.catch(err => { throw err });
			return res;
		})

		.catch(err => { 
			const error = new Error(err.response.data.error.message);
			error.name = err.response.data.error.code;
			this.emit('error', error);
			return false;
		})
		
		.then(res => { return utils.parseUser(res.data.user, this)});

		if (!user) return;
		return user;
		
	}


	// System Requests
	/**
	 * Gets information on a system
	 * @param {string} symbol - symbol of system
	 * @returns {PartialSystem} - Https Response
	 */
	async getSystemInfo(symbol) {
		const system = this.limiter.schedule(async () => { const res = await this.axios_client.request({
			method: 'GET',
			url: `/systems/${symbol.toUpperCase()}`
		})
		.then(res => { return res })
		.catch(err => { throw err })
		return res;
	})

		.catch(err => { 
			const error = new Error(err.response.data.error.message);
			error.name = err.response.data.error.code;
			this.emit('error', error);
			return false;
		})

		.then(res => {return utils.parsePartialSystem(res.data.system)});
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
		.catch(err => { throw err });
		return res;
	})
		.catch(err => { 
			const error = new Error(err.response.data.error.message);
			error.name = err.response.data.error.code;
			this.emit('error', error);
			return false;
		})
		.then(res => {
			let locations = [];
			// console.log(res.data.locations);
			res.data.locations.forEach(location => {
				locations.push(utils.parseSystemLocation(location));
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
			.catch(err => { throw err });
			return res;
		})
			
		.then(res => { 
			let flights = [];
			res.data.flightPlans.forEach(plan => {
				flights.push(utils.parseFlightPlan(plan));
				
			});
			return flights;
		})
		.catch(err => {
			const error = new Error(err.response.data.error.message);
			error.name = err.response.data.error.code;
			this.emit('error', error);
			return false;
		})
		
		if (!flights) return;
		return flights;
	}








	// Ship Requests
	/**
	 * buy a thing
	 * @param {string} location_symbol - Location to buy from
	 * @param {string} ship_symbol - symbol of the ship to buy
	 * @returns {Ship} - New Ship
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
		.catch(err => { throw err });
		return res;
	})
		.catch(err => {
			const error = new Error(err.response.data.error.message);
			error.name = err.response.data.error.code;
			this.emit('error', error);
			return false;
		})
		.then(async res => {
			const ship = res.data.ship;
			const newShip = utils.parseShip(ship);
			return newShip;
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
			.catch(err => { throw err });
			return res;
		})

		.then(res => {
			let mShip = null;
			for (const listing of res.data.shipListings) {
				if (listing.type === ship) {
					mShip = utils.parseMarketShip(listing, system, this);
					break;
				}
				
			}
			if (!mShip) {
				this.emit('error', new utils.ShipNotFound(ship));
				return new MarketShip(null, null, null, null, null, null, null, null, [], []);
			}
			return mShip;
		})
		.catch(err => { 
			const error = new Error(err.response.data.error.message);
			error.name = err.response.data.error.code;
			this.emit('error', error);
			return false;
		})
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
		.catch(err => { throw err });
		return res;
	})
			.catch(err => {
				const error = new Error(err.response.data.error.message);
				error.name = err.response.data.error.code;
				this.emit('error', error);
				return false;
			})
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
	 * @returns {Ship} - Https Response
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
		.catch(err => {
			const error = new Error(err.response.data.error.message);
			error.name = err.response.data.error.code;
			this.emit('error', error);
			return false;
		})
		.then(res => {
			const ship = res.data.ship;
			return utils.parseShip(ship);
		});
		if (!ship) return;
		return ship;
	}
	/**
	 * Jettisons cargo into space
	 * @param {string} id - ID of ship
	 * @param {string} good - Symbol of the good
	 * @param {number} quantity - Amount of goods to jettison
	 * @returns {Jettison} - Https Response
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
		.catch(err => {throw err });
		return res;
	})
		.catch(err => {
			const error = new Error(err.response.data.error.message);
			error.name = err.response.data.error.code;
			this.emit('error', error);
			return false;
		})
		.then(res => {
			return utils.parseJettison(res.data);
		});
		if (!jettison) return;
		return jettison;
	}
	/**
	 * Scraps ship for credits
	 * @param {string} id - ID of ship
	 * @returns {MiscData} - Https Response
	 */
	async scrap(id) {
		const success = this.limiter.schedule(async () => { const res = await this.axios_client.request({
			method:'DELETE',
			url:`/my/ships/${id}`
		})
		.then(res => { return res })
		.catch(err => { throw err});
		return res;
	})
		.catch(err => { 
			const error = new Error(err.response.data.error.message);
			error.name = err.response.data.error.code;
			this.emit('error', error);
			return false;
		})
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
		.catch(err => { throw err });
		return res;
	})

		.catch(err => {
			const error = new Error(err.response.data.error.message);
			error.name = err.response.data.error.code;
			this.emit('error', error);
			return false;
		})
		
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
	 * @returns {Loan} - Https Response
	 */
	async getUserLoans() {
		const loans = await this.limiter.schedule(async () => { const res = await this.axios_client.request({
				method: 'GET',
				url: '/my/loans'
			})
			.then(res => { return res })
			.catch(err => { throw err });
			return res;
		})
		.catch(err => {
			const error = new Error(err.response.data.error.message);
			error.name = err.response.data.error.code;
			this.emit('error', error);
			return false;
		})
		.then(res => {
			let loans = [];
			for (const loan of res.data.loans) {
				loans.push(utils.parseLoan(loan, this.loans));
			}
			return loans;
		});
		if (!loans) return;
		return loans;
	}
	/**
	 * Take a loan
	 * @param {string} type - Type of loan to take
	 * @returns {Loan} - Https Response
	 */
	async takeLoan(type) {
		const loan = await this.limiter.schedule(async () => { const res = await this.axios_client.request({
				method: 'POST',
				url: '/my/loans',
				params: {
					type: type.toUpperCase()
				},
				paramsSerializer: params => {
					return qs.stringify(params);
				}
			})
			.then(res => { return res })
			.catch(err => { throw err });
			return res;
		})
		.catch(err => {
			const error = new Error(err.response.data.error.message);
			error.name = err.response.data.error.code;
			this.emit('error', error);
			return false;
		})
		.then(res => {
			const loanData = res.data.loan;
			return utils.parseLoan(loanData);
		});
		if (!loan) return;
		return loan;
	}

	/**
	 *
	 * @param {string} loanID - id of the loan (NOT TYPE)
	 * @returns {Loan} - Https Response
	 */
	async payLoan(loanID) {
		const loan = await this.limiter.schedule(async () => { const res = await this.axios_client.request({
				method: 'PUT',
				url: `/my/loans/${loanID}`,
			})
			.then(res => { return res;})
			.catch(err => { throw err });
			return res;
		})
		.catch(err => {
			const error = new Error(err.response.data.error.message);
			error.name = err.response.data.error.code;
			this.emit('error', error);
			return false;
		})
		.then(res => {
			const loanData = res.data.loans[0];
			return utils.parseLoan(loanData);
		});
		if (!loan) return;
		return loan;
	}

	
	




	/**
	 * Gets Location Info
	 * @param {string} symbol - location symbol
	 * @returns {SystemLocation} - Https Response
	 */
	async getLocationInfo(symbol) {
		const location = await this.limiter.schedule(async () => { const res = await this.axios_client.request({
				method:'GET',
				url:`/locations/${symbol}`
			})
			.then(res => { return res })
			.catch(err => { throw err });
			return res;
		})
		.catch(err => {
			const error = new Error(err.response.data.error.message);
			error.name = err.response.data.error.code;
			this.emit('error', error);
			return false;
		})
		.then(res => {
			const location = res.data.location;
			return utils.parseSystemLocation(location);
		});
		if (!location) return;
		return location;
	}
	/**
	 * Gets the marketplace listings for a location
	 * @param {string} location - Location symbol
	 * @returns {Listing} - Https Response
	 */
	async getLocationMarket(location) {
		const listings = await this.limiter.schedule(async () => { const res = await this.axios_client.request({
				method:'GET',
				url:`/locations/${location}/marketplace`
			})
			.then(res => { return res })
			.catch(err => { throw err });
			return res;
		})
		.then(res => {
			let listings = [];
			const market = res.data.marketplace;
			for (const item of market) {
				listings.push(utils.parseListing(item));
			}
			return listings;
		})
		.catch(err => {
			const error = new Error(err.response.data.error.message);
			error.name = err.response.data.error.code;
			this.emit('error', error);
			return false;
		})
		if (!listings) return;
		return listings;
	}

	// Types Requests
	/**
	 * Gets all available ships
	 * @param {string} ship_class - Sort by class (optional)
	 * @returns {ShipType[]} - Array of ShipType Objects
	 */
	async getShipTypes(ship_class=null) {
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
			.catch(err => { throw err });
			return res;
		})
		.catch(err => {
			const error = new Error(err.response.data.error.message);
			error.name = err.response.data.error.code;
			this.emit('error', error);
			return false;
		})
		.then(res => {
			let ships = [];
			for (const ship of res.data.ships) {
				ships.push(utils.parseShipType(ship));
	
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
			.catch(err => { throw err })
			return res;
		})
		.catch(err => {
			const error = new Error(err.response.data.error.message);
			error.name = err.response.data.error.code;
			this.emit('error', error);
			return false;
		})
		.then(res => {
			const goods = [];
			res.data.goods.forEach(good => {
				goods.push(utils.parseGood(good));
			});
			return goods;
		});
		if (!goods) return;
		return goods;
	}
	/**
	 * Gets all structures
	 * @returns {Structure[]} - Array of structures
	 */
	async getStructureTypes() {
		const structures = await this.limiter.schedule(async () => { const res = await this.axios_client.request({
				method:'GET',
				url:'/types/structures'
			})
			.then(res => { return res })
			.catch(err => { throw err });
			return res;
		})
		.catch(err => {
			const error = new Error(err.response.data.error.message);
			error.name = err.response.data.error.code;
			this.emit('error', error);
			return false;
		})
		.then(res => {
			let structures = [];
			const structureData = res.data.structures;
			for (const structure of structureData) {
				structures.push(utils.parseStructureType(structure));
			}
			return structures;
		})
		if (!structures) return;
		return structures;
		
	}
	/**
	 * get all loans available
	 * @returns {Loan[]} - Array of loans available
	 */
	async getLoans() {
		const loans = await this.limiter.schedule(async () => { const res = await this.axios_client.request({
				method: 'GET',
				url: '/types/loans'
			})
			.then(res => { return res })
			.catch(err => { throw err });
			return res;
		})
		.catch(err => {
			const error = new Error(err.response.data.error.message);
			error.name = err.response.data.error.code;
			this.emit('error', error);
			return false;
		})
		.then(res => {
			let loans = [];
			res.data.loans.forEach(loan => {
				loans.push(utils.parseLoanType(loan));
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
	 * @returns {Structure} - Structure you bought
	 */
	async buyStructure(location, type) {
		const structure = await this.limiter.schedule(async () => { const res = await this.axios_client.request({
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
			.then(res => { return res })
			.catch(err => { throw err })
			return res;
		})
		.catch(err => {
			const error = new Error(err.response.data.error.message);
			error.name = err.response.data.error.code;
			this.emit('error', error);
			return false;
		})
		.then(res => {
			return utils.parseStructure(res.data.structure);
		});
		if (!structure) return;
		return structure;
	}
	/**
	 * Deposits goods to a structure from a ship
	 * @param {string} structure - Strucuture ID
	 * @param {string} ship - Ship's ID
	 * @param {string} good - Type of good
	 * @param {number|string} quantity - Quantity of transfer
	 * @returns {Structure & Deposit & Ship} - Https Response
	 */
	async depositToOwnStructure(structure, ship, good, quantity) {
		const info = await this.limiter.schedule(async () => { const res = await this.axios_client.request({
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
			.then(res => { return res })
			.catch(err => { throw err });
			return res;
		})
		.catch(err => {
			const error = new Error(err.response.data.error.message);
			error.name = err.response.data.error.code;
			this.emit('error', error);
			return false;
		})
		.then(res => {
			const structure = utils.parseStructure(res.data.structure);
			const deposit = utils.parseDeposit(res.data.deposit);
			const ship = utils.parseShip(res.data.ship);
			return {structure:structure, deposit:deposit, ship:ship}
		});
		if (!info) return;
		return info;
	}
	/**
	 * Deposits goods to a structure from a ship
	 * @param {string} structure - Strucuture ID
	 * @param {string} ship - Ship's ID
	 * @param {string} good - Type of good
	 * @param {number|string} quantity - Quantity of transfer
	 * @returns {Structure & Deposit & Ship} - Https Response
	 */
	async depositToAStructure(structure, ship, good, quantity) {
		const deposit = await this.limiter.schedule(async () => { const res = await this.axios_client.request({
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
			.then(res => { return res })
			.catch(err => { throw err });
			return res;
		})
		.catch(err => {
			const error = new Error(err.response.data.error.message);
			error.name = err.response.data.error.code;
			this.emit('error', error);
			return false;
		})
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
	 * Transfers goods from the structure to the ship
	 * @param {string} structure - Structure's ID
	 * @param {string} ship - Ship's ID
	 * @param {string} good - Type of good
	 * @param {number} quantity - quantity to transfer
	 * @returns {Structure & Ship & Transfer} - Dataset containing the structure you transfered from, ship you transfered to, and what was transfered
	 */
	async transferGoods(structure, ship, good, quantity) {
		const transfer = await this.limiter.schedule(async () => { const res = await this.axios_client.request({
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
			.then(res => { return res; })
			.catch(err => { throw err });
			return res;
		})
		.catch(err => {
			const error = new Error(err.response.data.error.message);
			error.name = err.response.data.error.code;
			this.emit('error', error);
			return false;
		})
		.then(res => {
			const structure = utils.parseStructure(res.data.structure);
			const ship = utils.parseShip(res.data.ship);
			const transfer = utils.parseTransfer(res.data.transfer);
			return {structure:structure, ship:ship, transfer:transfer};
		});
		if (!transfer) return;
		return transfer;
	}
	/**
	 * 
	 * @param {string} structure 
	 * @returns {Structure} - Https Response
	 */
	async getOwnedStructureInfo(structure) {
		const info = await this.limiter.schedule(async () => { const res = await this.axios_client.request({
				method:'GET',
				url:`/my/structures/${structure}`
			})
			.then(res => { return res })
			.catch(err => { throw err });
			return res;
		})
		.catch(err => {
			const error = new Error(err.response.data.error.message);
			error.name = err.response.data.error.code;
			this.emit('error', error);
			return false;
		})
		.then(res => {
			return utils.parseStructure(res.data.structure);
		})
		if (!info) return;
		return info;
	}
	/**
	 * Gets information on all owned structures
	 * @returns {Structure[]} - Array of structures and their info
	 */
	async getOwnedStructures() {
		const structures = await this.limiter.schedule(async () => { const res = await this.axios_client.request({
				method:'GET',
				url:'/my/structures'
			})
			.then(res => { return res })
			.catch(err => { throw err });
			return res;
		})
		.catch(err => {
			const error = new Error(err.response.data.error.message);
			error.name = err.response.data.error.code;
			this.emit('error', error);
			return false;
		})
		.then(res => {
			const structures = [];
			for (const item of res.data.structures) {
				structures.push(utils.parseStructure(item));
			}
			return structures;
		})
		if (!structures) return;
		if (structures.length === 0) {
			this.emit('error', new utils.NoStructures())
		}
		return structures;
	}
	// Flight plan commands
	/**
	 * Gets information on a flight plan
	 * @param {string} flight_plan - ID of the flight plan
	 * @returns {FlightPlan} - Flight plan representing
	 */
	async getFlightPlanInfo(flight_plan) {
		const plan = await this.limiter.schedule(async () => { const res = await this.axios_client.request({
				method:'GET',
				url:`/my/flight-plans/${flight_plan}`
			})
			.then(res => { return res })
			.catch(err => { throw err });
			return res;
		})
		.catch(err => {
			const error = new Error(err.response.data.error.message);
			error.name = err.response.data.error.code;
			this.emit('error', error);
			return false;
		})
		.then(res => {
			utils.parseFlightPlan(res.data.flightPlan);
		})
		if (!plan) return;
		return plan;
	}
	/**
	 * Starts a new flight
	 * @param {string} destination - Symbol of the loction to travel to
	 * @param {string} ship - ID of the ship for travel
	 * @returns {FlightPlan} - New flightplan object
	 */
	async startFlight(destination, ship) {
		const plan = await this.limiter.schedule(async () => { const res = await this.axios_client.request({
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
			.then(res => { return res })
			.catch(err => { throw err });
			return res;
		})
		.catch(err => {
			const error = new Error(err.response.data.error.message);
			error.name = err.response.data.error.code;
			this.emit('error', error);
			return false;
		})
		.then(res => {
			return utils.parseFlightPlan(res.data.flightPlan);
		})
		if (plan) return;
		return plan;
	}


	//Warp Jump Requests
	/**
	 * Attempts to warp to a new system
	 * @param {string} ship - ID of ship to attempt warp with
	 * @returns {Warp} - Warp object if completed
	 */
	async attemptWarp(ship) {
		const warp = await this.limiter.schedule(async () => { const res = await this.axios_client.request({
				method:'POST',
				url:'/my/warp-jumps',
				params:{
					shipId:ship,
				},
				paramsSerializer:params => {
					return qs.stringify(params);
				}
			})
			.then(res => { return res })
			.catch(err => { throw err });
			return res;
		})
		.catch(err => {
			const error = new Error(err.response.data.error.message);
			error.name = err.response.data.error.code;
			this.emit('error', error);
			return false;
		})
		.then(res => {
			return utils.parseWarp(res.data.flightPlan);
		})
		if (!warp) return;
		return warp;
	}

}




