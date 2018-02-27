# troop-adapter

provide functions to enable react application to run with troop based app together.

1. troop client: supprot simple troop query without cache and batch
2. troop connector: event emitter and subscriber to enable react app and troop app to communicate with each other via troop Hub event. 
3. TroopWrapper: HOC to inject troop connecter to react component.
4. renderToTroop: render react component inside troop app.
