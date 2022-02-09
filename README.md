# st-api-com
## SpaceTraders API Communicator
A Simple API Wrapper for the space traders API. 

 > Depending on what each request is doing, it will return these objects
 > * Ship
 > * PartialShip
 > * MarketShip
 > * Loan
 > * Good
 > * Location

### There is only one event currently
```js

NameOfCommunicatorInstance.on('error', (error) => { 
    console.log(err.message);
    // error will always be an Error Object
    });
```



