(function (workerScript) {
    try {
        const blob = new Blob ([`
            var fakeIdToId = {};
            onmessage = function (event) {
                var data = event.data,
                    name = data.name,
                    fakeId = data.fakeId,
                    time;
                if(data.hasOwnProperty('time')) {
                    time = data.time;
                }
                switch (name) {
                    case 'setInterval':
                        fakeIdToId[fakeId] = setInterval(function () {
                            postMessage({fakeId: fakeId});
                        }, time);
                        break;
                    case 'clearInterval':
                        if (fakeIdToId.hasOwnProperty (fakeId)) {
                            clearInterval(fakeIdToId[fakeId]);
                            delete fakeIdToId[fakeId];
                        }
                        break;
                    case 'setTimeout':
                        fakeIdToId[fakeId] = setTimeout(function () {
                            postMessage({fakeId: fakeId});
                            if (fakeIdToId.hasOwnProperty (fakeId)) {
                                delete fakeIdToId[fakeId];
                            }
                        }, time);
                        break;
                    case 'clearTimeout':
                        if (fakeIdToId.hasOwnProperty (fakeId)) {
                            clearTimeout(fakeIdToId[fakeId]);
                            delete fakeIdToId[fakeId];
                        }
                        break;
                }
            }
        `]);
        workerScript = window.URL.createObjectURL(blob);
    } catch (error) {}

    let worker,
        fakeIdToCallback = {},
        lastFakeId = 0,
        maxFakeId = 0x7FFFFFFF,
        logPrefix = '';

    function getFakeId () {
        do {
            if (lastFakeId === maxFakeId) {
                lastFakeId = 0;
            } else {
                lastFakeId ++;
            }
        } while (fakeIdToCallback.hasOwnProperty (lastFakeId));
        return lastFakeId;
    }

    if (typeof Worker === 'undefined') {
        return
    }

    try {
        worker = new Worker (workerScript);
        window.setInterval = function (callback, time /* , parameters */) {
            const fakeId = getFakeId ();
            fakeIdToCallback[fakeId] = {
                callback: callback,
                parameters: Array.prototype.slice.call(arguments, 2)
            };
            worker.postMessage ({
                name: 'setInterval',
                fakeId: fakeId,
                time: time
            });
            return fakeId;
        };
        window.clearInterval = function (fakeId) {
            if (fakeIdToCallback.hasOwnProperty(fakeId)) {
                delete fakeIdToCallback[fakeId];
                worker.postMessage ({
                    name: 'clearInterval',
                    fakeId: fakeId
                });
            }
        };
        window.setTimeout = function (callback, time /* , parameters */) {
            const fakeId = getFakeId ();
            fakeIdToCallback[fakeId] = {
                callback: callback,
                parameters: Array.prototype.slice.call(arguments, 2),
                isTimeout: true
            };
            worker.postMessage ({
                name: 'setTimeout',
                fakeId: fakeId,
                time: time
            });
            return fakeId;
        };
        window.clearTimeout = function (fakeId) {
            if (fakeIdToCallback.hasOwnProperty(fakeId)) {
                delete fakeIdToCallback[fakeId];
                worker.postMessage ({
                    name: 'clearTimeout',
                    fakeId: fakeId
                });
            }
        };
        window.setImmediate = function (callback) {
            return setTimeout(callback, 0)
        }
        window.clearImmediate = function (fakeId) {
            clearTimeout(fakeId)
        }
        worker.onmessage = function (event) {
            let data = event.data,
                fakeId = data.fakeId,
                request,
                parameters,
                callback;
            if (fakeIdToCallback.hasOwnProperty(fakeId)) {
                request = fakeIdToCallback[fakeId];
                callback = request.callback;
                parameters = request.parameters;
                if (request.hasOwnProperty ('isTimeout') && request.isTimeout) {
                    delete fakeIdToCallback[fakeId];
                }
            }
            if (typeof (callback) === 'string') {
                try {
                    callback = new Function (callback);
                } catch (error) {
                    console.error (logPrefix + 'Error parsing callback code string: ', error);
                }
            }
            if (typeof (callback) === 'function') {
                callback.apply (window, parameters);
            }
        };
        worker.onerror = function (event) {
            console.error (event);
        };
    } catch (error) {
        console.log (`Can't create worker for Intervals, use standard functions.`);
    }
})();
