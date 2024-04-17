const options = {
    key: 'UgKKicY6EWnlwkIsah2TUaP6Q7TzA1Iq', 

    // Changing Windy parameters at start-up time
    lat: 50.4,
    lon: 14.3,
    zoom: 5,

    timestamp: Date.now() + 3 * 24 * 60 * 60 * 1000,

    hourFormat: '12h',

};

windyInit(options, windyAPI => {
    const { store } = windyAPI;
    // All the params are stored in windyAPI.store

    const levels = store.getAllowed('availLevels');  
    // Getting all available values for given key

    let i = 0;
    setInterval(() => {
        i = i === levels.length - 1 ? 0 : i + 1;

        // Changing Windy params at runtime
        store.set('level', levels[i]);
    }, 500);

    // Observing change of .store value
    store.on('level', level => {
        console.log(`Level was changed: ${level}`);
    });
});
