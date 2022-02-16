# TradingPost
TradingPost is an API wrapper for the SpaceTraders API. 

## Events
There is two events
- ready
- error

Each can be handled like this
#### Ready event
```js
// wrapper represents the TradingPost object
wrapper.on('ready', (// no args are given in the event) => {
    /*
    Do whatever you want in this event to signify wrapper is ready
    Note: Starting the api takes up some of the ratelimit. 
    I apologize for this. I haven't figured out how to counter this
    */
});
```
#### Error event
```js
//wrapper represents the TradingPost object
wrapper.on('error', (err) => {
    /*
    Do whatever you want to handle the error in this event
    Parameter err will always be an Error object.
    */
})
```
## Objects
There are many objects representing each object in the SpaceTraders Universe
- The Ship object represents a ship. 
    This is a full ship, with an id, location, cargo and coordinates.
- The PartialShip represents a partial ship. 
    The differences are that there is no ID or cargo, but does have a class.
- The MarketShip object represents a ship from a listing. 
    This is the same as partial ship, but has a list of purchase locations and a list of goods that the ship is not allowed to carry.
- The Location object represents a location in a system.
- The Good object represents a good available in the game
- The Loan object represents a loan.
- The Listing object represents a market listing for a good.
- The Structure object represents a structure that can be built.
- The PartialSystem object represents a systems's basic info
- The System object represents a systems complete info. It contains a list of all of the locations in a system
- The UserFlightPlan object represents a flightplan from another user.
- The FlightPlan object represents one of your flightplans.
- The Order object represents a completed order
- MarketOrder represents a full market order. 
    Containing an order object represent the good order. A ship object representing the ship that the goods went to, and the amount of credits you have left.
- User represents a SpaceTraders user. Currently this only represents you.
- The Jettison object represents a finished jettison request.


