# st-api-com
## SpaceTraders API Communicator
A Simple API Wrapper for the space traders API. 

Provides all the requests for you. 
Returns the response for you to parse and use to your desire.


```js
// There is only one event -> 'error'

NameOfCommunicatorInstance.on('error', (error) => { 
    console.log(err.message);
    // error will always be an Error Object
    });
```



