'use strict';

const numProps = ['opacity', 'zIndex'];

function nothing(){
    return null
}

function isSimple(v){
    return typeof v === "string" || typeof v === "boolean" || typeof v === "number";
}

function isVisible(elem) {
    return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
}

function isHidden(elem) {
    const s = getComputedStyle(elem);
    return !isVisible(elem) || +s.opacity === 0 || elem.hidden || s.visibility === "hidden";
}

function not(value){
    return value === undefined || value === null;
}

function camelCase(string){
    return string.replace( /-([a-z])/g, function(all, letter){
        return letter.toUpperCase();
    });
}

function dashedName(str){
    return str.replace(/([A-Z])/g, function(u) { return "-" + u.toLowerCase(); });
}

function isPlainObject( obj ) {
    let proto;
    if ( !obj || Object.prototype.toString.call( obj ) !== "[object Object]" ) {
        return false;
    }
    proto = obj.prototype !== undefined;
    if ( !proto ) {
        return true;
    }
    return proto.constructor && typeof proto.constructor === "function";
}

function isEmptyObject( obj ) {
    for (const name in obj ) {
        if (hasProp(obj, name)) return false;
    }
    return true;
}

function isArrayLike (o){
    return o instanceof Object && 'length' in o;
}

function str2arr (str, sep) {
    sep = sep || " ";
    return str.split(sep).map(function(el){
        return  (""+el).trim();
    }).filter(function(el){
        return el !== "";
    });
}

function parseUnit(str, out) {
    if (!out) out = [ 0, '' ];
    str = String(str);
    out[0] = parseFloat(str);
    out[1] = str.match(/[\d.\-+]*\s*(.*)/)[1] || '';
    return out;
}

function getUnit(val, und){
    const split = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn|fr|lh|cqw|cqh|cqi|cqb|cqmin|cqmax|q)?$/.exec(val);
    return typeof split[1] !== "undefined" ? split[1] : und;
}

function setStyleProp(el, key, val){
    key = camelCase(key);

    if (["scrollLeft", "scrollTop"].indexOf(key) > -1) {
        el[key] = (parseInt(val));
    } else {
        el.style[key] = isNaN(val) || numProps.indexOf(""+key) > -1 ? val : val + 'px';
    }
}

function acceptData(owner){
    return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
}

function getData(data){
    try {
        return JSON.parse(data);
    } catch (e) {
        return data;
    }
}

function dataAttr(elem, key, data){
    let name;

    if ( not(data) && elem.nodeType === 1 ) {
        name = "data-" + key.replace( /[A-Z]/g, "-$&" ).toLowerCase();
        data = elem.getAttribute( name );

        if ( typeof data === "string" ) {
            data = getData( data );
            dataSet.set( elem, key, data );
        } else {
            data = undefined;
        }
    }
    return data;
}

function normName(name) {
    return typeof name !== "string" ? undefined : name.replace(/-/g, "").toLowerCase();
}

function strip(name, what) {
    return typeof name !== "string" ? undefined : name.replace(what, "");
}

function hasProp(obj, prop){
    return Object.prototype.hasOwnProperty.call(obj, prop);
}

function isLocalhost(host){
    const hostname = host || globalThis.location.hostname;
    return (
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname === "[::1]" ||
        hostname === "" ||
        hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/) !== null
    );
}

function isTouch() {
    return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0));
}

function isPrivateAddress (host) {
    const hostname = host || globalThis.location.hostname;
    return /(^localhost)|(^127\.)|(^192\.168\.)|(^10\.)|(^172\.1[6-9]\.)|(^172\.2\d\.)|(^172\.3[0-1]\.)|(^::1$)|(^[fF][cCdD])/.test(hostname)
}

const matches = Element.prototype.matches;

const $ = (selector, context) => new $.init(selector, context)

$.version = "__VERSION__";
$.build_time = "__BUILD_TIME__";
$.info = () => console.info(`%c Dom %c v${$.version} %c ${$.build_time} `, "color: white; font-weight: bold; background: #fd6a02", "color: white; background: darkgreen", "color: white; background: #0080fe;")

$.fn = $.prototype = Object.create(Array.prototype);

$.prototype.constructor = $
$.prototype.uid = ""

$.extend = $.fn.extend = function(){
    let options, name,
        target = arguments[ 0 ] || {},
        i = 1,
        length = arguments.length;

    if ( typeof target !== "object" && typeof target !== "function" ) {
        target = {};
    }

    if ( i === length ) {
        target = this;
        i--;
    }

    for ( ; i < length; i++ ) {
        if ( ( options = arguments[ i ] ) != null ) {
            for ( name in options ) {
                if (hasProp(options, name))
                    target[ name ] = options[ name ];
            }
        }
    }

    return target;
};

$.assign = function(){
    let options, name,
        target = arguments[ 0 ] || {},
        i = 1,
        length = arguments.length;

    if ( typeof target !== "object" && typeof target !== "function" ) {
        target = {};
    }

    if ( i === length ) {
        target = this;
        i--;
    }

    for ( ; i < length; i++ ) {
        if ( ( options = arguments[ i ] ) != null ) {
            for ( name in options ) {
                if (hasProp(options, name) && options[name] !== undefined)
                    target[ name ] = options[ name ];
            }
        }
    }

    return target;
};

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


$.fn.extend({
    index: function(sel){
        let el, _index = -1;

        if (this.length === 0) {
            return _index;
        }

        if (not(sel)) {
            el = this[0];
        } else if (sel instanceof $ && sel.length > 0) {
            el = sel[0];
        } else if (typeof sel === "string") {
            el = $(sel)[0];
        } else {
            el = undefined;
        }

        if (not(el)) {
            return _index;
        }

        if (el && el.parentNode) $.each(el.parentNode.children, function(i){
            if (this === el) {
                _index = i;
            }
        });
        return _index;
    },

    indexOf: function(sel){
        let el, _index = -1;

        if (this.length === 0) {
            return _index;
        }

        if (not(sel)) {
            el = this[0];
        } else if (sel instanceof $ && sel.length > 0) {
            el = sel[0];
        } else if (typeof sel === "string") {
            el = $(sel)[0];
        } else {
            el = undefined;
        }

        if (not(el)) {
            return _index;
        }

        this.each(function(i){
            if (this === el) {
                _index = i;
            }
        });
        
        return _index;
    },

    get: function(i){
        if (i === undefined) {
            return this.items();
        }
        return i < 0 ? this[ i + this.length ] : this[ i ];
    },

    eq: function(i){
        return !not(i) && this.length > 0 ? $.extend($(this.get(i)), {_prevObj: this}) : this;
    },

    is: function(s){
        let result = false;

        if (this.length === 0) {
            return false;
        }

        if (s instanceof $) {
            return this.same(s);
        }

        if (s === ":selected") {
            this.each(function(){
                if (this.selected) result = true;
            });
        } else

        if (s === ":checked") {
            this.each(function(){
                if (this.checked) result = true;
            });
        } else

        if (s === ":visible") {
            this.each(function(){
                if (isVisible(this)) result = true;
            });
        } else

        if (s === ":hidden") {
            this.each(function(){
                const styles = getComputedStyle(this);
                if (
                    this.getAttribute('type') === 'hidden'
                        || this.hidden
                        || styles.display === 'none'
                        || styles.visibility === 'hidden'
                        || parseInt(styles.opacity) === 0
                ) result = true;
            });
        } else

        if (typeof  s === "string" && [':selected'].indexOf(s) === -1) {
            this.each(function(){
                if (matches.call(this, s)) {
                    result = true;
                }
            });
        } else

        if (isArrayLike(s)) {
            this.each(function(){
                const el = this;
                $.each(s, function(){
                    const sel = this;
                    if (el === sel) {
                        result = true;
                    }
                });
            });
        } else

        if (typeof s === "object" && s.nodeType === 1) {
            this.each(function(){
                if  (this === s) {
                    result = true;
                }
            });
        }

        return result;
    },

    same: function(o){
        let result = true;

        if (!(o instanceof $)) {
            o = $(o);
        }

        if (this.length !== o.length) return false;

        this.each(function(){
            if (o.items().indexOf(this) === -1) {
                result = false;
            }
        });

        return result;
    },

    last: function(){
        return this.eq(this.length - 1);
    },

    first: function(){
        return this.eq(0);
    },

    odd: function(){
        const result = this.filter(function(el, i){
            return i % 2 === 0;
        });
        return $.extend(result, {_prevObj: this});
    },

    even: function(){
        const result = this.filter(function(el, i){
            return i % 2 !== 0;
        });
        return $.extend(result, {_prevObj: this});
    },

    filter: function(fn){
        if (typeof fn === "string") {
            const sel = fn;
            fn = function(el){
                return matches.call(el, sel);
            };
        }

        return $.extend($.merge($(), [].filter.call(this, fn)), {_prevObj: this});
    },

    find: function(s){
        let res = [], result;

        if (s instanceof $) return s;

        if (this.length === 0) {
            result = this;
        } else {
            this.each(function () {
                const el = this;
                if (typeof el.querySelectorAll === "undefined") {
                    return ;
                }
                res = res.concat([].slice.call(el.querySelectorAll(s)));
            });
            result = $.merge($(), res);
        }

        return $.extend(result, {_prevObj: this});
    },

    contains: function(s){
        return this.find(s).length > 0;
    },

    children: function(s){
        let i, res = [];

        if (s instanceof $) return s;

        this.each(function(){
            const el = this;
            for(i = 0; i < el.children.length; i++) {
                if (el.children[i].nodeType === 1)
                    res.push(el.children[i]);
            }
        });
        res = s ? res.filter(function(el){
            return matches.call(el, s);
        }) : res;

        return $.extend($.merge($(), res), {_prevObj: this});
    },

    parent: function(s){
        let res = [];
        if (this.length === 0) {
            return ;
        }

        if (s instanceof $) return s;

        this.each(function(){
            if (this.parentNode) {
                if (res.indexOf(this.parentNode) === -1) res.push(this.parentNode);
            }
        });
        res = s ? res.filter(function(el){
            return matches.call(el, s);
        }) : res;

        return $.extend($.merge($(), res), {_prevObj: this});
    },

    parents: function(s){
        let res = [];

        if (this.length === 0) {
            return ;
        }

        if (s instanceof $) return s;

        this.each(function(){
            let par = this.parentNode;
            while (par) {
                if (par.nodeType === 1 && res.indexOf(par) === -1) {
                    if (!not(s)) {
                        if (matches.call(par, s)) {
                            res.push(par);
                        }
                    } else {
                        res.push(par);
                    }
                }
                par = par.parentNode;
            }
        });

        return $.extend($.merge($(), res), {_prevObj: this});
    },

    siblings: function(s){
        let res = [];

        if (this.length === 0) {
            return ;
        }

        if (s instanceof $) return s;

        this.each(function(){
            const el = this;
            if (el.parentNode) {
                $.each(el.parentNode.children, function(){
                    if (el !== this) res.push(this);
                });
            }
        });

        if (s) {
            res = res.filter(function(el){
                return matches.call(el, s);
            });
        }

        return $.extend($.merge($(), res), {_prevObj: this});
    },

    _siblingAll: function(dir, s){
        let res = [];

        if (this.length === 0) {
            return ;
        }

        if (s instanceof $) return s;

        this.each(function(){
            let el = this;
            while (el) {
                el = el[dir];
                if (!el) break;
                res.push(el);
            }
        });

        if (s) {
            res = res.filter(function(el){
                return matches.call(el, s);
            });
        }

        return $.extend($.merge($(), res), {_prevObj: this});
    },

    _sibling: function(dir, s){
        let res = [];

        if (this.length === 0) {
            return ;
        }

        if (s instanceof $) return s;

        this.each(function(){
            const el = this[dir];
            if (el && el.nodeType === 1) {
                res.push(el);
            }
        });

        if (s) {
            res = res.filter(function(el){
                return matches.call(el, s);
            });
        }

        return $.extend($.merge($(), res), {_prevObj: this});
    },

    prev: function(s){
        return this._sibling('previousElementSibling', s);
    },

    next: function(s){
        return this._sibling('nextElementSibling', s);
    },

    prevAll: function(s){
        return this._siblingAll('previousElementSibling', s);
    },

    nextAll: function(s){
        return this._siblingAll('nextElementSibling', s);
    },

    closest: function(s){
        let res = [];

        if (this.length === 0) {
            return ;
        }

        if (s instanceof $) return s;

        if (!s) {
            return this.parent(s);
        }

        this.each(function(){
            let el = this;
            while (el) {
                if (!el) break;
                if (matches.call(el, s)) {
                    res.push(el);
                    return ;
                }
                el = el.parentElement;
            }
        });

        return $.extend($.merge($(), res.reverse()), {_prevObj: this});
    },

    has: function(selector){
        let res = [];

        if (this.length === 0) {
            return ;
        }

        this.each(function(){
            const el = $(this);
            const child = el.children(selector);
            if (child.length > 0) {
                res.push(this);
            }
        });

        return $.extend($.merge($(), res), {_prevObj: this});
    },

    back: function(to_start){
        let ret;
        if (to_start === true) {
            ret = this._prevObj;
            while (ret) {
                if (!ret._prevObj) break;
                ret = ret._prevObj;
            }
        } else {
            ret = this._prevObj ? this._prevObj : this;
        }
        return ret;
    }
});

function createScript(script, into = document.body){
    const s = document.createElement('script');
    s.type = 'text/javascript';

    if (not(script)) return $(s);

    const _script = $(script)[0];

    if (_script.src) {
        s.src = _script.src;
    } else {
        s.textContent = _script.innerText;
    }

    if (_script.type) s.type = _script.type;
    if (_script.async) s.async = _script.async;

    into.appendChild(s);

    if (_script.parentNode) _script.parentNode.removeChild(_script);

    return s;
}

$.extend({
    script: function(el, into){
        if (not(el)) { return }
        if (el instanceof $) { el = el[0] }

        if (el.tagName && el.tagName === "SCRIPT") {
            createScript(el, into);
        } else {
            const scripts = $(el).find("script");
            $.each(scripts, function(){
                createScript(this, into);
            });
        }
    },
    
    loadScript: function(url, into = document.body, callback){
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.onload = callback;
        into.appendChild(script);
    }
});

$.fn.extend({
    script: function(into){
        return this.each(function(){
            $.script(this, into);
        });
    }
});

$.fn.extend({
    _prop: function(prop, value){
        if (arguments.length === 1) {
            return this.length === 0 ? undefined : this[0][prop];
        }

        if (not(value)) {
            value = '';
        }

        return this.each(function(){
            const el = this;
            el[prop] = value;
            if (prop === "innerHTML") {
                $.script(el, el);
            }
        });
    },

    prop: function(prop, value){
        return arguments.length === 1 ? this._prop(prop) : this._prop(prop, typeof value === "undefined" ? "" : value);
    },

    val: function(value){
        if (not(value)) {
            return this.length === 0 ? undefined : this[0].value;
        }

        return this.each(function(){
            const el = $(this);
            if (typeof this.value !== "undefined") {
                this.value = value;
            } else {
                el.html(value);
            }
        });
    },

    html: function(value){
        const that = this, v = [];

        if (arguments.length === 0) {
            return this._prop('innerHTML');
        }

        if (value instanceof $) {
            value.each(function(){
                v.push($(this).outerHTML());
            });
        } else {
            v.push(value);
        }

        that._prop('innerHTML', v.join("\n"));

        return this;
    },

    outerHTML: function(){
        return this._prop('outerHTML');
    },

    text: function(value){
        return arguments.length === 0 ? this._prop('textContent') : this._prop('textContent', typeof value === "undefined" ? "" : value);
    },

    innerText: function(value){
        return arguments.length === 0 ? this._prop('innerText') : this._prop('innerText', typeof value === "undefined" ? "" : value);
    },

    empty: function(){
        return this.each(function(){
            if (typeof this.innerHTML !== "undefined") this.innerHTML = "";
        });
    },

    clear: function(){
        return this.empty();
    }
});

$.each = function(ctx, cb){
    let index = 0;
    if (isArrayLike(ctx)) {
        [].forEach.call(ctx, function(val, key) {
            cb.apply(val, [key, val]);
        });
    } else {
        for(const key in ctx) {
            if (hasProp(ctx, key))
                cb.apply(ctx[key], [key, ctx[key],  index++]);
        }
    }

    return ctx;
};

$.fn.extend({
    each: function(cb){
        return $.each(this, cb);
    }
});


/*
 * Data routines
 * Url: https://jquery.com
 * Copyright (c) Copyright JS Foundation and other contributors, https://js.foundation/
 * Licensed under MIT
 */
const Data = function(ns){
    this.expando = "DATASET:UID:" + ns.toUpperCase();
    Data.uid++;
};

Data.uid = -1;

Data.prototype = {
    cache: function(owner){
        let value = owner[this.expando];
        if (!value) {
            value = {};
            if (acceptData(owner)) {
                if (owner.nodeType) {
                    owner[this.expando] = value;
                } else {
                    Object.defineProperty(owner, this.expando, {
                        value: value,
                        configurable: true
                    });
                }
            }
        }
        return value;
    },

    set: function(owner, data, value){
        let prop, cache = this.cache(owner);

        if (typeof data === "string") {
            cache[camelCase(data)] = value;
        } else {
            for (prop in data) {
                if (hasProp(data, prop))
                    cache[camelCase(prop)] = data[prop];
            }
        }
        return cache;
    },

    get: function(owner, key){
        return key === undefined ? this.cache(owner) : owner[ this.expando ] && owner[ this.expando ][ camelCase( key ) ];
    },

    access: function(owner, key, value){
        if (key === undefined || ((key && typeof key === "string") && value === undefined) ) {
            return this.get(owner, key);
        }
        this.set(owner, key, value);
        return value !== undefined ? value : key;
    },

    remove: function(owner, key){
        let i, cache = owner[this.expando];
        if (cache === undefined) {
            return ;
        }
        if (key !== undefined) {
            if ( Array.isArray( key ) ) {
                key = key.map( camelCase );
            } else {
                key = camelCase( key );

                key = key in cache ? [ key ] : ( key.match( /[^\x20\t\r\n\f]+/g ) || [] ); // ???
            }

            i = key.length;

            while ( i-- ) {
                delete cache[ key[ i ] ];
            }
        }
        if ( key === undefined || isEmptyObject( cache ) ) {
            if ( owner.nodeType ) {
                owner[ this.expando ] = undefined;
            } else {
                delete owner[ this.expando ];
            }
        }
        return true;
    },

    hasData: function(owner){
        const cache = owner[ this.expando ];
        return cache !== undefined && !isEmptyObject( cache );
    }
};

const dataSet = new Data('dom');

$.extend({
    hasData: function(elem){
        return dataSet.hasData(elem);
    },

    data: function(elem, key, val){
        return dataSet.access(elem, key, val);
    },

    removeData: function(elem, key){
        return dataSet.remove(elem, key);
    },

    dataSet: function(ns){
        if (not(ns)) return dataSet;
        if (['INTERNAL', 'DOM'].indexOf(ns.toUpperCase()) > -1) {
            throw Error("You can not use reserved name for your dataset");
        }
        return new Data(ns);
    }
});

$.fn.extend({
    data: function(key, val){
        let res, elem, data, attrs, name, i;

        if (this.length === 0) {
            return ;
        }

        elem = this[0];

        if ( arguments.length === 0 ) {
            if ( this.length ) {
                data = dataSet.get( elem );

                if ( elem.nodeType === 1) {
                    attrs = elem.attributes;
                    i = attrs.length;
                    while ( i-- ) {
                        if ( attrs[ i ] ) {
                            name = attrs[ i ].name;
                            if ( name.indexOf( "data-" ) === 0 ) {
                                name = camelCase( name.slice( 5 ) );
                                dataAttr( elem, name, data[ name ] );
                            }
                        }
                    }
                }
            }

            return data;
        }

        if ( arguments.length === 1 ) {
            res = dataSet.get(elem, key);
            if (res === undefined) {
                if ( elem.nodeType === 1) {
                    if (elem.hasAttribute("data-"+key)) {
                        res = elem.getAttribute("data-"+key);
                    }
                }
            }
            return res;
        }

        return this.each( function() {
            dataSet.set( this, key, val );
        } );
    },

    removeData: function( key ) {
        return this.each( function() {
            dataSet.remove( this, key );
        } );
    },

    origin: function(name, value, def){

        if (this.length === 0) {
            return this;
        }

        if (not(name) && not(value)) {
            return $.data(this[0]);
        }

        if (not(value)) {
            const res = $.data(this[0], "origin-"+name);
            return !not(res) ? res : def;
        }

        this.data("origin-"+name, value);

        return this;
    }
});

$.extend({

    device: (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase())),
    localhost: isLocalhost(),
    isLocalhost: isLocalhost,
    touchable: isTouch(),
    isPrivateAddress: isPrivateAddress,

    uniqueId: function (prefix) {
        let d = new Date().getTime();
        if (not(prefix)) {
            prefix = 'm4q';
        }
        return (prefix !== '' ? prefix + '-' : '') + 'xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    },

    toArray: function(n){
        let i, out = [];

        for (i = 0 ; i < n.length; i++ ) {
            out.push(n[i]);
        }

        return out;
    },

    import: function(ctx){
        const res = [];
        this.each(ctx, function(){
            res.push(this);
        });
        return this.merge($(), res);
    },

    merge: function( first, second ) {
        let len = +second.length,
            j = 0,
            i = first.length;

        for ( ; j < len; j++ ) {
            first[ i++ ] = second[ j ];
        }

        first.length = i;

        return first;
    },

    type: function(obj){
        return Object.prototype.toString.call(obj).replace(/^\[object (.+)]$/, '$1').toLowerCase();
    },

    isSelector: function(selector){
        if (typeof selector !== 'string') {
            return false;
        }
        try {
            document.querySelector(selector);
            return true;
        } catch(error) {
            return false;
        }
    },

    remove: function(s){
        return $(s).remove();
    },

    isPlainObject: isPlainObject,
    isEmptyObject: isEmptyObject,
    isArrayLike: isArrayLike,
    acceptData: acceptData,
    not: not,
    parseUnit: parseUnit,
    getUnit: getUnit,
    unit: parseUnit,
    isVisible: isVisible,
    isHidden: isHidden,
    matches: function(el, s) {return matches.call(el, s);},
    random: function(from, to) {
        if (arguments.length === 1 && isArrayLike(from)) {
            return from[Math.floor(Math.random()*(from.length))];
        }
        return Math.floor(Math.random()*(to-from+1)+from);
    },
    hasProp: hasProp,
    dark: globalThis.matchMedia && globalThis.matchMedia('(prefers-color-scheme: dark)').matches,

    serializeToArray: function(form){
        const _form = $(form)[0];
        if (!_form || _form.nodeName !== "FORM") {
            console.warn("Element is not a HTMLFromElement");
            return;
        }
        let i, j, q = [];
        for (i = _form.elements.length - 1; i >= 0; i = i - 1) {
            if (_form.elements[i].name === "") {
                continue;
            }
            switch (_form.elements[i].nodeName) {
                case 'INPUT':
                    switch (_form.elements[i].type) {
                        case 'checkbox':
                        case 'radio':
                            if (_form.elements[i].checked) {
                                q.push(_form.elements[i].name + "=" + encodeURIComponent(_form.elements[i].value));
                            }
                            break;
                        case 'file':
                            break;
                        default: q.push(_form.elements[i].name + "=" + encodeURIComponent(_form.elements[i].value));
                    }
                    break;
                case 'TEXTAREA':
                    q.push(_form.elements[i].name + "=" + encodeURIComponent(_form.elements[i].value));
                    break;
                case 'SELECT':
                    switch (_form.elements[i].type) {
                        case 'select-one':
                            q.push(_form.elements[i].name + "=" + encodeURIComponent(_form.elements[i].value));
                            break;
                        case 'select-multiple':
                            for (j = _form.elements[i].options.length - 1; j >= 0; j = j - 1) {
                                if (_form.elements[i].options[j].selected) {
                                    q.push(_form.elements[i].name + "=" + encodeURIComponent(_form.elements[i].options[j].value));
                                }
                            }
                            break;
                    }
                    break;
                case 'BUTTON':
                    switch (_form.elements[i].type) {
                        case 'reset':
                        case 'submit':
                        case 'button':
                            q.push(_form.elements[i].name + "=" + encodeURIComponent(_form.elements[i].value));
                            break;
                    }
                    break;
            }
        }
        return q;
    },
    serialize: function(form){
        return $.serializeToArray(form).join("&");
    },
    viewport: function () {
        const w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            x = w.innerWidth || e.clientWidth || g.clientWidth,
            y = w.innerHeight || e.clientHeight || g.clientHeight;
        return {width: x, height: y};
    }
});

$.fn.extend({
    items: function(){
        return $.toArray(this);
    }
});

const overriddenStop =  Event.prototype.stopPropagation;
const overriddenPrevent =  Event.prototype.preventDefault;

Event.prototype.stopPropagation = function(){
    this.isPropagationStopped = true;
    overriddenStop.apply(this, arguments);
};
Event.prototype.preventDefault = function(){
    this.isPreventedDefault = true;
    overriddenPrevent.apply(this, arguments);
};

Event.prototype.stop = function(immediate){
    return immediate ? this.stopImmediatePropagation() : this.stopPropagation();
};

$.extend({
    events: [],
    eventHooks: {},

    eventUID: -1,

    /*
    * el, eventName, handler, selector, ns, id, options
    * */
    setEventHandler: function(obj){
        let i, freeIndex = -1, eventObj, resultIndex;
        if (this.events.length > 0) {
            for(i = 0; i < this.events.length; i++) {
                if (this.events[i].handler === null) {
                    freeIndex = i;
                    break;
                }
            }
        }

        eventObj = {
            element: obj.el,
            event: obj.event,
            handler: obj.handler,
            selector: obj.selector,
            ns: obj.ns,
            id: obj.id,
            options: obj.options
        };

        if (freeIndex === -1) {
            this.events.push(eventObj);
            resultIndex = this.events.length - 1;
        } else {
            this.events[freeIndex] = eventObj;
            resultIndex = freeIndex;
        }

        return resultIndex;
    },

    getEventHandler: function(index){
        if (this.events[index] !== undefined && this.events[index] !== null) {
            this.events[index] = null;
            return this.events[index].handler;
        }
        return undefined;
    },

    off: function(){
        $.each(this.events, function(){
            this.element.removeEventListener(this.event, this.handler, true);
        });
        this.events = [];
        return this;
    },

    getEvents: function(){
        return this.events;
    },

    getEventHooks: function(){
        return this.eventHooks;
    },

    addEventHook: function(event, handler, type = "before"){
        $.each(str2arr(event), function(){
            this.eventHooks[camelCase(type+"-"+this)] = handler;
        });
        return this;
    },

    removeEventHook: function(event, type = "before"){
        $.each(str2arr(event), function(){
            delete this.eventHooks[camelCase(type+"-"+this)];
        });
        return this;
    },

    removeEventHooks: function(event){
        const that = this;
        if (not(event)) {
            this.eventHooks = {};
        } else {
            $.each(str2arr(event), function(){
                delete that.eventHooks[camelCase("before-"+this)];
                delete that.eventHooks[camelCase("after-"+this)];
            });
        }
        return this;
    }
});

$.fn.extend({
    on: function(eventsList, sel, handler, options){
        if (this.length === 0) {
            return ;
        }

        if (typeof sel === 'function') {
            options = handler;
            handler = sel;
            sel = undefined;
        }

        if (!isPlainObject(options)) {
            options = {};
        }

        return this.each(function(){
            const el = this;
            $.each(str2arr(eventsList), function(){
                let h, ev = this,
                    event = ev.split("."),
                    name = normName(event[0]),
                    ns = options.ns ? options.ns : event[1],
                    index, originEvent;

                $.eventUID++;

                h = function(e){
                    let target = e.target;
                    const beforeHook = $.eventHooks[camelCase("before-"+name)];
                    const afterHook = $.eventHooks[camelCase("after-"+name)];

                    if (typeof beforeHook === "function") {
                        beforeHook.call(target, e);
                    }

                    if (!sel) {
                        handler.call(el, e);
                    } else {
                        while (target && target !== el) {
                            if (matches.call(target, sel)) {
                                handler.call(target, e);
                                if (e.isPropagationStopped) {
                                    e.stopImmediatePropagation();
                                    break;
                                }
                            }
                            target = target.parentNode;
                        }
                    }

                    if (typeof afterHook === "function") {
                        afterHook.call(target, e);
                    }

                    if (options.once) {
                        index = +$(el).origin( "event-"+e.type+(sel ? ":"+sel:"")+(ns ? ":"+ns:"") );
                        if (!isNaN(index)) $.events.splice(index, 1);
                    }
                };

                Object.defineProperty(h, "name", {
                    value: handler.name && handler.name !== "" ? handler.name : "func_event_"+name+"_"+$.eventUID
                });

                originEvent = name+(sel ? ":"+sel:"")+(ns ? ":"+ns:"");

                el.addEventListener(name, h, !isEmptyObject(options) ? options : false);

                index = $.setEventHandler({
                    el: el,
                    event: name,
                    handler: h,
                    selector: sel,
                    ns: ns,
                    id: $.eventUID,
                    options: !isEmptyObject(options) ? options : false
                });
                $(el).origin('event-'+originEvent, index);
            });
        });
    },

    one: function(events, sel, handler, options){
        if (!isPlainObject(options)) {
            options = {};
        }

        options.once = true;

        return this.on.apply(this, [events, sel, handler, options]);
    },

    off: function(eventsList, sel, options){

        if (isPlainObject(sel)) {
            options = sel;
            sel = null;
        }

        if (!isPlainObject(options)) {
            options = {};
        }

        if (not(eventsList) || eventsList.toLowerCase() === 'all') {
            return this.each(function(){
                const el = this;
                $.each($.events, function(){
                    const e = this;
                    if (e.element === el) {
                        el.removeEventListener(e.event, e.handler, e.options);
                        e.handler = null;
                        $(el).origin("event-"+name+(e.selector ? ":"+e.selector:"")+(e.ns ? ":"+e.ns:""), null);
                    }
                });
            });
        }

        return this.each(function(){
            const el = this;
            $.each(str2arr(eventsList), function(){
                let evMap = this.split("."),
                    name = normName(evMap[0]),
                    ns = options.ns ? options.ns : evMap[1],
                    originEvent, index;

                originEvent = "event-"+name+(sel ? ":"+sel:"")+(ns ? ":"+ns:"");
                index = $(el).origin(originEvent);

                if (index !== undefined && $.events[index].handler) {
                    el.removeEventListener(name, $.events[index].handler, $.events[index].options);
                    $.events[index].handler = null;
                }

                $(el).origin(originEvent, null);
            });
        });
    },

    trigger: function(name, data){
        return this.fire(name, data);
    },

    fire: function(name, data){
        let _name, e;

        if (this.length === 0) {
            return ;
        }

        _name = normName(name);

        if (['focus', 'blur'].indexOf(_name) > -1) {
            this[0][_name]();
            return this;
        }

        e = new CustomEvent(_name, {
            bubbles: true,
            cancelable: true,
            detail: data
        });

        return this.each(function(){
            this.dispatchEvent(e);
        });
    }
});

( "blur focus resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu touchstart touchend touchmove touchcancel" )
    .split( " " )
    .forEach(
    function( name ) {
        $.fn[ name ] = function( sel, fn, opt ) {
            return arguments.length > 0 ?
                this.on( name, sel, fn, opt ) :
                this.fire( name );
        };
});

$.fn.extend( {
    hover: function( fnOver, fnOut ) {
        return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
    }
});

$.ready = function(fn, options){
    document.addEventListener('DOMContentLoaded', fn, (options || false));
};

$.load = function(fn){
    return $(window).on("load", fn);
};

$.unload = function(fn){
    return $(window).on("unload", fn);
};

$.fn.extend({
    unload: function(fn){
        return (this.length === 0 || this[0].self !== window) ? undefined : $.unload(fn);
    }
});

$.beforeunload = function(fn){
    if (typeof fn === "string") {
        return $(window).on("beforeunload", function(e){
            e.returnValue = fn;
            return fn;
        });
    } else {
        return $(window).on("beforeunload", fn);
    }
};

$.fn.extend({
    beforeunload: function(fn){
        return (this.length === 0 || this[0].self !== window) ? undefined : $.beforeunload(fn);
    }
});

$.fn.extend({
    ready: function(fn){
        if (this.length && this[0] === document && typeof fn === 'function') {
            return $.ready(fn);
        }
    }
});

$.ajax = function(p){
    return new Promise(function(resolve, reject){
        const xhr = new XMLHttpRequest()
        let method = (p.method || "GET").toUpperCase();
        const headers = [];
        const async = not(p.async) ? true : p.async;
        let url = p.url;

        let data;

        const exec = function(fn, params){
            if (typeof fn === "function") {
                fn.apply(null, params);
            }
        };

        const isGet = function(method){
            return ["GET", "JSON"].indexOf(method) !== -1;
        };

        const plainObjectToData = function(obj){
            const _data = [];
            $.each(obj, function(k, v){
                const _v = isSimple(v) ? v : JSON.stringify(v);
                _data.push(k+"=" + _v);
            });
            return _data.join("&");
        };

        if (p.data instanceof HTMLFormElement) {
            let _action = p.data.getAttribute("action").trim();
            let _method = p.data.getAttribute("method").trim();

            if (not(url) && _action) {url = _action;}
            if (_method) {method = _method.toUpperCase();}
        }


        if (p.timeout) {
            xhr.timeout = p.timeout;
        }

        if (p.withCredentials) {
            xhr.withCredentials = p.withCredentials;
        }

        if (p.data instanceof HTMLFormElement) {
            data = $.serialize(p.data);
        } else if (p.data instanceof HTMLElement && p.data.getAttribute("type") && p.data.getAttribute("type").toLowerCase() === "file") {
            const _name = p.data.getAttribute("name");
            data = new FormData();
            for (let i = 0; i < p.data.files.length; i++) {
                data.append(_name, p.data.files[i]);
            }
        } else if (isPlainObject(p.data)) {
            data = plainObjectToData(p.data);
        } else if (p.data instanceof FormData) {
            data = p.data;
        } else if (typeof p.data === "string") {
            data = p.data;
        } else {
            data = new FormData();
            data.append("_data", JSON.stringify(p.data));
        }

        if (isGet(method)) {
            url += (typeof data === "string" ? "?"+data : isEmptyObject(data) ? "" : "?"+JSON.stringify(data));
        }

        xhr.open(method, url, async, p.user, p.password);
        if (p.headers) {
            $.each(p.headers, function(k, v){
                xhr.setRequestHeader(k, v);
                headers.push(k);
            });
        }
        if (!isGet(method)) {
            if (headers.indexOf("Content-type") === -1 && p.contentType !== false) {
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            }
        }
        xhr.send(data);

        xhr.addEventListener("load", function(e){
            if (xhr.readyState === 4 && xhr.status < 300) {
                let _return = p.returnValue && p.returnValue === 'xhr' ? xhr : xhr.response;
                if (p.parseJson) {
                    try {
                        _return = JSON.parse(_return);
                    } catch (ex) {
                        _return = {};
                    }
                }
                exec(resolve, [_return]);
                exec(p.onSuccess, [e, xhr]);
            } else {
                exec(reject, [xhr]);
                exec(p.onFail, [e, xhr]);
            }
            exec(p.onLoad, [e, xhr]);
        });

        $.each(["readystatechange", "error", "timeout", "progress", "loadstart", "loadend", "abort"], function(){
            const ev = camelCase("on-"+(this === 'readystatechange' ? 'state' : this));
            xhr.addEventListener(ev, function(e){
                exec(p[ev], [e, xhr]);
            });
        });
    });
};

['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'JSON'].forEach(function(method){
    $[method.toLowerCase()] = function(url, data, options){
        const _options = {
            method: method === 'JSON' ? 'GET' : method,
            url: url,
            data: data,
            parseJson: method === 'JSON'
        };
        return $.ajax($.extend({}, _options, options));
    };
});

$.fn.extend({
    load: function(url, data, options){
        const that = this;

        if (this.length && this[0].self === window ) {
            return $.load(url);
        }

        return $.get(url, data, options).then(function(data){
            that.each(function(){
                this.innerHTML = data;
            });
        });
    }
});

$.fn.extend({

    style: function(name, pseudo){
        let el;

        function _getStyle(el, prop, pseudo){
            return ["scrollLeft", "scrollTop"].indexOf(prop) > -1 ? $(el)[prop]() : getComputedStyle(el, pseudo)[prop];
        }

        if (typeof name === 'string' && this.length === 0) {
            return undefined;
        }

        if (this.length === 0) {
            return this;
        }

        el = this[0];

        if (not(name) || name === "all") {
            return getComputedStyle(el, pseudo);
        } else {
            let result = {}, names = name.split(", ").map(function(el){
                return (""+el).trim();
            });
            if (names.length === 1)  {
                return _getStyle(el, names[0], pseudo);
            } else {
                $.each(names, function () {
                    const prop = this;
                    result[this] = _getStyle(el, prop, pseudo);
                });
                return result;
            }
        }
    },

    removeStyleProperty: function(name){
        if (not(name) || this.length === 0) return this;
        const names = name.split(", ").map(function(el){
            return (""+el).trim();
        });

        return this.each(function(){
            const el = this;
            $.each(names, function(){
                el.style.removeProperty(this);
            });
        });
    },
    
    removeStyle: function(name){
        if (!name) return this
        const names = str2arr(name, ", ");
        return this.each(function(){
            const el = this;
            $.each(names, function(){
                el.style[this] = "";
            });
        }); 
    },

    css: function(key, val){
        key = key || 'all';

        if (typeof key === "string" && not(val)) {
            return  this.style(key);
        }

        return this.each(function(){
            const el = this;
            if (typeof key === "object") {
                $.each(key, function(key, val){
                    setStyleProp(el, key, val);
                });
            } else if (typeof key === "string") {
                setStyleProp(el, key, val);
            }
        });
    },
    
    cssVar: function(name, val){
        if (not(name)) return this;
        if (not(val)) {
            return getComputedStyle(this[0]).getPropertyValue("--"+name);
        } else {
            return this.each(function(){
                this.style.setProperty("--"+name, val);
            });
        }
    }
});



$.fn.extend({
    addClass: function(){},
    removeClass: function(){},
    toggleClass: function(){},

    containsClass: function(cls){
        return this.hasClass(cls);
    },

    hasClass: function(cls){
        let result = false;
        const classes = cls.split(" ").filter(function(v){
            return (""+v).trim() !== "";
        });

        if (not(cls)) {
            return false;
        }

        this.each(function(){
            const el = this;

            $.each(classes, function(){
                if (!result && el.classList && el.classList.contains(this)) {
                    result = true;
                }
            });
        });

        return result;
    },

    clearClasses: function(){
        return this.each(function(){
            this.className = "";
        });
    },

    cls: function(array = false){
        return this.length === 0 ? undefined : array ? this[0].className.split(" ") : this[0].className;
    },

    removeClassBy: function(mask){
        return this.each(function(){
            const el = $(this);
            const classes = el.cls(true);
            $.each(classes, function(){
                const elClass = this;
                if (elClass.indexOf(mask) > -1) {
                    el.removeClass(elClass);
                }
            });
        });
    },

    classNames: function(){
        const args = Array.prototype.slice.call(arguments, 0);
        const classes = []
        $.each(args, function(_, a){
            if (typeof a === "string") {
                classes.push(a)
            } else if (isPlainObject(a)) {
                $.each(a, function(k, v){
                    if (v) {
                        classes.push(k)
                    }
                })
            } else {
                nothing()
            }
        })
        return this.each(function(){
            this.className += ' ' + classes.join(' ');
        })
    }
});

['add', 'remove', 'toggle'].forEach(function (method) {
    $.fn[method + "Class"] = function(cls){
        const _classes = !cls
            ? []
            : Array.isArray(cls)
                ? cls
                : cls.split(" ").filter(function (v) { return !!v; })
        if (!_classes.length) return this;
        return this.each(function(){
            const el = this;
            const hasClassList = typeof el.classList !== "undefined";

            if (hasClassList) {
                $.each(_classes, function(_, v){
                    el.classList[method](v)
                })
            } else {
                el.className += _classes.join(" ")
            }
        });
    };
});


$.parseHTML = function(data){
    let base, singleTag, result = [], ctx, _context;
    const regexpSingleTag = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i; // eslint-disable-line

    if (typeof data !== "string") {
        return [];
    }

    data = data.trim();

    ctx = document.implementation.createHTMLDocument("");
    base = ctx.createElement( "base" );
    base.href = document.location.href;
    ctx.head.appendChild( base );
    _context = ctx.body;

    singleTag = regexpSingleTag.exec(data);

    if (singleTag) {
        result.push(document.createElement(singleTag[1]));
    } else {
        _context.innerHTML = data;
        for(let i = 0; i < _context.childNodes.length; i++) {
            result.push(_context.childNodes[i]);
        }
    }

    return result;
};


$.fn.extend({
    _size: function(prop, val){
        if (this.length === 0) return ;

        if (not(val)) {

            const el = this[0];

            if (prop === 'height') {
                return el === window ? window.innerHeight : el === document ? el.body.clientHeight : parseInt(getComputedStyle(el).height);
            }
            if (prop === 'width') {
                return el === window ? window.innerWidth : el === document ? el.body.clientWidth : parseInt(getComputedStyle(el).width);
            }
        }

        return this.each(function(){
            const el = this;
            if (el === window || el === document) {return ;}
            el.style[prop] = isNaN(val) ? val : val + 'px';
        });
    },

    height: function(val){
        return this._size('height', val);
    },

    width: function(val){
        return this._size('width', val);
    },

    _sizeOut: function(prop, val){
        let el, size, style, result;

        if (this.length === 0) {
            return ;
        }

        if (!not(val) && typeof val !== "boolean") {
            return this.each(function(){
                const el = this;
                if (el === window || el === document) {return ;}
                let h, style = getComputedStyle(el),
                    bs = prop === 'width' ? parseInt(style['border-left-width']) + parseInt(style['border-right-width']) : parseInt(style['border-top-width']) + parseInt(style['border-bottom-width']),
                    pa = prop === 'width' ? parseInt(style['padding-left']) + parseInt(style['padding-right']) : parseInt(style['padding-top']) + parseInt(style['padding-bottom']);

                h = $(this)[prop](val)[prop]() - bs - pa;
                el.style[prop] = h + 'px';
            });
        }

        el = this[0];
        size = el[prop === 'width' ? 'offsetWidth' : 'offsetHeight'];
        style = getComputedStyle(el);
        result = size + parseInt(style[prop === 'width' ? 'margin-left' : 'margin-top']) + parseInt(style[prop === 'width' ? 'margin-right' : 'margin-bottom']);
        return val === true ? result : size;
    },

    outerWidth: function(val){
        return this._sizeOut('width', val);
    },

    outerHeight: function(val){
        return this._sizeOut('height', val);
    },

    padding: function(p){
        if (this.length === 0) return;
        const s = getComputedStyle(this[0], p);

        return {
            top: parseInt(s["padding-top"]),
            right: parseInt(s["padding-right"]),
            bottom: parseInt(s["padding-bottom"]),
            left: parseInt(s["padding-left"])
        };
    },

    margin: function(p){
        if (this.length === 0) return;
        const s = getComputedStyle(this[0], p);

        return {
            top: parseInt(s["margin-top"]),
            right: parseInt(s["margin-right"]),
            bottom: parseInt(s["margin-bottom"]),
            left: parseInt(s["margin-left"])
        };
    },

    border: function(p){
        if (this.length === 0) return;
        const s = getComputedStyle(this[0], p);

        return {
            top: parseInt(s["border-top-width"]),
            right: parseInt(s["border-right-width"]),
            bottom: parseInt(s["border-bottom-width"]),
            left: parseInt(s["border-left-width"])
        };
    }
});

$.fn.extend({
    offset: function(val){
        let rect;

        if (not(val)) {
            if (this.length === 0) return undefined;
            rect = this[0].getBoundingClientRect();
            return {
                top: rect.top + scrollY,
                left: rect.left + scrollX
            };
        }

        return this.each(function(){ //?
            let el = $(this),
                top = val.top,
                left = val.left,
                position = getComputedStyle(this).position,
                offset = el.offset();

            if (position === "static") {
                el.css("position", "relative");
            }

            if (["absolute", "fixed"].indexOf(position) === -1) {
                top = top - offset.top;
                left = left - offset.left;
            }

            el.css({
                top: top,
                left: left
            });
        });
    },

    position: function(margin = false){
        let ml = 0, mt = 0, el, style;

        if (this.length === 0) {
            return undefined;
        }

        el = this[0];
        style = getComputedStyle(el);

        if (margin) {
            ml = parseInt(style['margin-left']);
            mt = parseInt(style['margin-top']);
        }

        return {
            left: el.offsetLeft - ml,
            top: el.offsetTop - mt
        };
    },

    left: function(val, margin){
        if (this.length === 0) return ;
        if (not(val)) {
            return this.position(margin).left;
        }
        if (typeof val === "boolean") {
            margin = val;
            return this.position(margin).left;
        }
        return this.each(function(){
            $(this).css({
                left: val
            });
        });
    },

    top: function(val, margin){
        if (this.length === 0) return ;
        if (not(val)) {
            return this.position(margin).top;
        }
        if (typeof val === "boolean") {
            margin = val;
            return this.position(margin).top;
        }
        return this.each(function(){
            $(this).css({
                top: val
            });
        });
    },

    rect: function(){
        return this.length === 0 ? undefined : this[0].getBoundingClientRect();
    },

    pos: function(){
        if (this.length === 0) return ;
        const el = this[0];
        return {
            top: parseInt(el.style("top")),
            left: parseInt(el.style("left"))
        };
    }
});

$.fn.extend({
    attr: function(name, val){
        const attributes = {};

        if (this.length === 0 && arguments.length === 0) {
            return undefined;
        }

        if (this.length && arguments.length === 0) {
            $.each(this[0].attributes, function(){
                attributes[this.nodeName] = this.nodeValue;
            });
            return attributes;
        }

        if (arguments.length === 1 && typeof name === "string") {
            return this.length && this[0].nodeType === 1 && this[0].hasAttribute(name) ? this[0].getAttribute(name) : undefined;
        }

        return this.each(function(){
            const el = this;
            if (isPlainObject(name)) {
                $.each(name, function(k, v){
                    el.setAttribute(k, v);
                });
            } else {
                el.setAttribute(name, val);
                // console.log(name, val);
            }
        });
    },

    removeAttr: function(name){
        let attributes;

        if (not(name)) {
            return this.each(function(){
                const el = this;
                $.each(this.attributes, function(){
                    el.removeAttribute(this);
                });
            });
        }

        attributes = typeof name === "string" ? name.split(",").map(function(el){
            return el.trim();
        }) : name;

        return this.each(function(){
            const el = this;
            $.each(attributes, function(){
                if (el.hasAttribute(this)) el.removeAttribute(this);
            });
        });
    },

    toggleAttr: function(name, val){
        return this.each(function(){
            const el = this;

            if (not(val)) {
                el.removeAttribute(name);
            } else {
                el.setAttribute(name, val);
            }

        });
    },

    id: function(val){
        if (typeof val === "undefined") {
            return this.length === 1
                ? $(this[0]).attr("id")
                : this.map(el => $(el).attr("id"))
        }
        return this.each(function(){
            $(this).attr("id", val);
        });
    },

    title: function(val){
        if (typeof val === "undefined") {
            return this.length 
                ? $(this[0]).attr("title")
                : undefined
        }
        return this.each(function(){
            $(this).attr("title", val);
        });
    },

    href: function(val){
        if (typeof val === "undefined") {
            return this.length 
                ? this[0].tagName === "A" ? this[0].href : undefined
                : undefined
        }
        return this.each(function(){
            if (this.tagName === "A") {
                this.href = val
            }
        });
    },
    
    name: function (val){
        if (typeof val === "undefined") {
            return this.length
                ? this[0].name ? this[0].name : undefined
                : undefined
        }
        return this.each(function(){
            if (this.name) {
                this.name = val
            }
        });
    },
    
    src: function (val){
        if (typeof val === "undefined") {
            return this.length
                ? this[0].src ? this[0].src : undefined
                : undefined
        }
        return this.each(function(){
            if (this.src) {
                this.src = val
            }
        });
    },
});

$.extend({
    meta: function(name){
        return not(name) ? $("meta") : $("meta[name='$name']".replace("$name", name));
    },

    metaBy: function(name){
        return not(name) ? $("meta") : $("meta[$name]".replace("$name", name));
    },

    doctype: function(){
        return $("doctype");
    },

    html: function(){
        return $("html");
    },

    head: function(){
        return $("html").find("head");
    },

    body: function(){
        return $("body");
    },

    document: function(){
        return $(document);
    },

    window: function(){
        return $(window);
    },

    charset: function(val){
        if (val) {
            const m = $('meta[charset]')
            if (m.length > 0) {
                m.attr('charset', val)
            }
        }
        return document.characterSet
    },
    
    lang: function(val){
        if (val) {
            const h = $('html')
            if (h.length > 0) {
                h.attr('lang', val)
            }
        }
        return document.documentElement.lang
    },
    
    title: function(val){
        if (typeof val === "undefined") {
            return document.title
        }
        document.title = val;
    }
});

$.extend({
    bind: (fn, ctx) => fn.bind(ctx)
});


(function (arr) {
    arr.forEach(function (item) {
        ['append', 'prepend'].forEach(function(where){
            if (hasProp(item, where)) {
                return;
            }

            Object.defineProperty(item, where, {
                configurable: true,
                enumerable: true,
                writable: true,
                value: function () {
                    const argArr = Array.prototype.slice.call(arguments),
                        docFrag = document.createDocumentFragment();

                    argArr.forEach(function (argItem) {
                        const isNode = argItem instanceof Node;
                        docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
                    });

                    if (where === 'prepend')
                        this.insertBefore(docFrag, this.firstChild);
                    else
                        this.appendChild(docFrag);
                }
            });
        });
    });
})([Element.prototype, Document.prototype, DocumentFragment.prototype]);

const normalizeElements = function(s){
    let result;

    if (typeof s === "string") result = $.isSelector(s) ? $(s) : $.parseHTML(s);
    else if (s instanceof HTMLElement) result = [s];
    else if (isArrayLike(s)) result = s;
    return result;
};

$.fn.extend({

    appendText: function(text){
        return this.each(function(elIndex, el){
            el.innerHTML += text;
        });
    },

    prependText: function(text){
        return this.each(function(elIndex, el){
            el.innerHTML = text + el.innerHTML;
        });
    },

    append: function(elements){
        const _elements = normalizeElements(elements);

        return this.each(function(elIndex, el){
            $.each(_elements, function(){
                if (el === this) return ;
                const child = elIndex === 0 ? this : this.cloneNode(true);
                if (child.tagName && child.tagName === "SCRIPT") {
                    $.script(child, el);
                } else {
                    el.append(child);
                }
            });
        });
    },

    appendTo: function(elements){
        const _elements = normalizeElements(elements);

        return this.each(function(){
            const el = this;
            $.each(_elements, function(parIndex, parent){
                if (el === this) return ;
                parent.append(parIndex === 0 ? el : el.cloneNode(true));
            });
        });
    },

    prepend: function(elements){
        const _elements = normalizeElements(elements);

        return this.each(function (elIndex, el) {
            $.each(_elements, function(){
                if (el === this) return ;
                const child = elIndex === 0 ? this : this.cloneNode(true);
                $.script(child);
                if (child.tagName && child.tagName !== "SCRIPT") el.prepend(child);
            });
        });
    },

    prependTo: function(elements){
        const _elements = normalizeElements(elements);

        return this.each(function(){
            const el = this;
            $.each(_elements, function(parIndex, parent){
                if (el === this) return ;
                $(parent).prepend(parIndex === 0 ? el : el.cloneNode(true));
            });
        });
    },

    insertBefore: function(elements){
        const _elements = normalizeElements(elements);

        return this.each(function(){
            const el = this;
            $.each(_elements, function(elIndex){
                if (el === this) return ;
                const parent = this.parentNode;
                if (parent) {
                    parent.insertBefore(elIndex === 0 ? el : el.cloneNode(true), this);
                }
            });
        });
    },

    insertAfter: function(elements){
        const _elements = normalizeElements(elements);

        return this.each(function(){
            const el = this;
            $.each(_elements, function(elIndex, element){
                if (el === this) return ;
                const parent = this.parentNode;
                if (parent) {
                    parent.insertBefore(elIndex === 0 ? el : el.cloneNode(true), element.nextSibling);
                }
            });
        });
    },

    after: function(html){
        return this.each(function(){
            const el = this;
            if (typeof html === "string") {
                el.insertAdjacentHTML('afterend', html);
            } else {
                $(html).insertAfter(el);
            }
        });
    },

    before: function(html){
        return this.each(function(){
            const el = this;
            if (typeof html === "string") {
                el.insertAdjacentHTML('beforebegin', html);
            } else {
                $(html).insertBefore(el);
            }
        });
    },

    clone: function(deep, withData){
        const res = [];
        if (not(deep)) {
            deep = false;
        }
        if (not(withData)) {
            withData = false;
        }
        this.each(function(){
            const el = this.cloneNode(deep);
            const $el = $(el);
            let data;
            if (withData && $.hasData(this)) {
                data = $(this).data();
                $.each(data, function(k, v){
                    $el.data(k, v);
                });
            }
            res.push(el);
        });
        return $.merge($(), res);
    },

    import: function(deep){
        const res = [];
        if (not(deep)) {
            deep = false;
        }
        this.each(function(){
            res.push(document.importNode(this, deep));
        });
        return $.merge($(), res);
    },

    adopt: function(){
        const res = [];
        this.each(function(){
            res.push(document.adoptNode(this));
        });
        return $.merge($(), res);
    },

    remove: function(selector){
        let i = 0, node, out, res = [];

        if (this.length === 0) {
            return ;
        }

        out = selector ? this.filter(function(el){
            return matches.call(el, selector);
        }) : this.items();

        for ( ; ( node = out[ i ] ) != null; i++ ) {
            if (node.parentNode) {
                res.push(node.parentNode.removeChild(node));
                $.removeData(node);
            }
        }

        return $.merge($(), res);
    },

    wrap: function( el ){
        if (this.length === 0) {
            return ;
        }

        const wrapper = $(normalizeElements(el));

        if (!wrapper.length) {
            return ;
        }

        const res = [];

        this.each(function(){
            let _target, _wrapper;

            _wrapper = wrapper.clone(true, true);
            _wrapper.insertBefore(this);

            _target = _wrapper;
            while (_target.children().length) {
                _target = _target.children().eq(0);
            }
            _target.append(this);

            res.push(_wrapper);
        });

        return $(res);
    },

    wrapAll: function( el ){
        let wrapper, _wrapper, _target;

        if (this.length === 0) {
            return ;
        }

        wrapper = $(normalizeElements(el));

        if (!wrapper.length) {
            return ;
        }

        _wrapper = wrapper.clone(true, true);
        _wrapper.insertBefore(this[0]);

        _target = _wrapper;
        while (_target.children().length) {
            _target = _target.children().eq(0);
        }

        this.each(function(){
            _target.append(this);
        })

        return _wrapper;
    },

    wrapInner: function( el ){
        if (this.length === 0) {
            return ;
        }

        const wrapper = $(normalizeElements(el));

        if (!wrapper.length) {
            return ;
        }

        const res = [];

        this.each(function(){
            const elem = $(this);
            const html = elem.html();
            const wrp = wrapper.clone(true, true);
            elem.html(wrp.html(html));
            res.push(wrp);
        });

        return $(res);
    }
});

$.extend({
    animation: {
        duration: 1000,
        ease: "linear",
        elements: {}
    }
});

if (typeof window["setupAnimation"] === 'object') {
    $.each(window["setupAnimation"], function(key, val){
        if (typeof $.animation[key] !== "undefined" && !not(val))
            $.animation[key] = val;
    });
}

const transformProps = ['translateX', 'translateY', 'translateZ', 'rotate', 'rotateX', 'rotateY', 'rotateZ', 'scale', 'scaleX', 'scaleY', 'scaleZ', 'skew', 'skewX', 'skewY'];
const numberProps = ['opacity', 'zIndex'];
const floatProps = ['opacity', 'volume'];
const scrollProps = ["scrollLeft", "scrollTop"];
const reverseProps = ["opacity", "volume"];

function _validElement(el) {
    return el instanceof HTMLElement || el instanceof SVGElement;
}

/**
 *
 * @param to
 * @param from
 * @returns {*}
 * @private
 */
function _getRelativeValue (to, from) {
    const operator = /^(\*=|\+=|-=)/.exec(to);
    if (!operator) return to;
    const u = getUnit(to) || 0;
    const x = parseFloat(from);
    const y = parseFloat(to.replace(operator[0], ''));
    switch (operator[0][0]) {
        case '+':
            return x + y + u;
        case '-':
            return x - y + u;
        case '*':
            return x * y + u;
        case '/':
            return x / y + u;
    }
}

/**
 *
 * @param el
 * @param prop
 * @param pseudo
 * @returns {*|number|string}
 * @private
 */
function _getStyle (el, prop, pseudo){
    if (typeof el[prop] !== "undefined") {
        if (scrollProps.indexOf(prop) > -1) {
            return prop === "scrollLeft" ? el === window ? scrollX : el.scrollLeft : el === window ? scrollY : el.scrollTop;
        } else {
            return el[prop] || 0;
        }
    }

    return el.style[prop] || getComputedStyle(el, pseudo)[prop];
}

/**
 *
 * @param el
 * @param key
 * @param val
 * @param unit
 * @param toInt
 * @private
 */
function _setStyle (el, key, val, unit, toInt) {

    if (not(toInt)) {
        toInt = false;
    }

    key = camelCase(key);

    if (toInt) {
        val  = parseInt(val);
    }

    if (_validElement(el)) {
        if (typeof el[key] !== "undefined") {
            el[key] = val;
        } else {
            el.style[key] = key === "transform" || key.toLowerCase().indexOf('color') > -1 ? val : val + unit;
        }
    } else {
        el[key] = val;
    }
}

/**
 *
 * @param el
 * @param mapProps
 * @param p
 * @private
 */
function _applyStyles (el, mapProps, p) {
    $.each(mapProps, function (key, val) {
        _setStyle(el, key, val[0] + (val[2] * p), val[3], val[4]);
    });
}

/**
 *
 * @param el
 * @returns {{}}
 * @private
 */
function _getElementTransforms (el) {
    if (!_validElement(el)) return {};
    const str = el.style.transform || '';
    const reg = /(\w+)\(([^)]*)\)/g;
    const transforms = {};
    let m;

    while (m = reg.exec(str))
        transforms[m[1]] = m[2];

    return transforms;
}

/**
 *
 * @param val
 * @returns {number[]}
 * @private
 */
function _getColorArrayFromHex (val){
    const a = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(val ? val : "#000000");
    return a.slice(1).map(function(v) {
        return parseInt(v, 16);
    });
}

/**
 *
 * @param el
 * @param key
 * @returns {number[]}
 * @private
 */
function _getColorArrayFromElement (el, key) {
    return getComputedStyle(el)[key].replace(/[^\d.,]/g, '').split(',').map(function(v) {
        return parseInt(v);
    });
}

/**
 *
 * @param el
 * @param mapProps
 * @param p
 * @private
 */
function _applyTransform (el, mapProps, p) {
    const t = [];
    const elTransforms = _getElementTransforms(el);

    $.each(mapProps, function(key, val) {
        let from = val[0], to = val[1], delta = val[2], unit = val[3];
        key = "" + key;

        if ( key.indexOf("rotate") > -1 || key.indexOf("skew") > -1) {
            if (unit === "") unit = "deg";
        }

        if (key.indexOf('scale') > -1) {
            unit = '';
        }

        if (key.indexOf('translate') > -1 && unit === '') {
            unit = 'px';
        }

        if (unit === "turn") {
            t.push(key+"(" + (to * p) + unit + ")");
        } else {
            t.push(key +"(" + (from + (delta * p)) + unit+")");
        }
    });

    $.each(elTransforms, function(key, val) {
        if (mapProps[key] === undefined) {
            t.push(key+"("+val+")");
        }
    });

    el.style.transform = t.join(" ");
}

/**
 *
 * @param el
 * @param mapProps
 * @param p
 * @private
 */
function _applyColors (el, mapProps, p) {
    $.each(mapProps, function (key, val) {
        let i, result = [0, 0, 0], v;
        for (i = 0; i < 3; i++) {
            result[i] = Math.floor(val[0][i] + (val[2][i] * p));
        }
        v = "rgb("+(result.join(","))+")";
        el.style[key] = v;
    });
}

/**
 *
 * @param val
 * @returns {string|*}
 * @private
 */
function _expandColorValue (val) {
    const regExp = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    if (val[0] === "#" && val.length === 4) {
        return "#" + val.replace(regExp, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });
    }
    return val[0] === "#" ? val : "#"+val;
}

/**
 *
 * @param el
 * @param map
 * @param p
 */
function applyProps (el, map, p) {
    _applyStyles(el, map.props, p);
    _applyTransform(el, map.transform, p);
    _applyColors(el, map.color, p);
}

/**
 *
 * @param el
 * @param draw
 * @param dir
 * @returns {{transform: {}, color: {}, props: {}}}
 */
function createAnimationMap (el, draw, dir) {
    const map = {
        props: {},
        transform: {},
        color: {}
    };
    let i, from, to, delta, unit, temp;
    const elTransforms = _getElementTransforms(el);

    if (not(dir)) {
        dir = "normal";
    }

    $.each(draw, function(key, val) {

        const isTransformProp = transformProps.indexOf(""+key) > -1;
        const isNumProp = numberProps.indexOf(""+key) > -1;
        const isColorProp = (""+key).toLowerCase().indexOf("color") > -1;

        if (Array.isArray(val) && val.length === 1) {
            val = val[0];
        }

        if (!Array.isArray(val)) {
            if (isTransformProp) {
                from = elTransforms[key] || key === "scale" ? 1 : 0;
            } else if (isColorProp) {
                from = _getColorArrayFromElement(el, key);
            } else {
                from = _getStyle(el, key, undefined);
            }
            from = !isColorProp ? parseUnit(from) : from;
            to = !isColorProp ? parseUnit(_getRelativeValue(val, Array.isArray(from) ? from[0] : from)) : _getColorArrayFromHex(val);
        } else {
            from = !isColorProp ? parseUnit(val[0]) : _getColorArrayFromHex(_expandColorValue(val[0]));
            to = !isColorProp ? parseUnit(val[1]) : _getColorArrayFromHex(_expandColorValue(val[1]));
        }

        if (reverseProps.indexOf(""+key) > -1 && from[0] === to[0]) {
            from[0] = to[0] > 0 ? 0 : 1;
        }

        if (dir === "reverse") {
            temp = from;
            from = to;
            to = temp;
        }

        unit = el instanceof HTMLElement && to[1] === '' && !isNumProp && !isTransformProp ? 'px' : to[1];

        if (isColorProp) {
            delta = [0, 0, 0];
            for (i = 0; i < 3; i++) {
                delta[i] = to[i] - from[i];
            }
        } else {
            delta = to[0] - from[0];
        }

        if (isTransformProp) {
            map.transform[key] = [from[0], to[0], delta, unit];
        } else if (isColorProp) {
            map.color[key] = [from, to, delta, unit];
        } else {
            map.props[key] = [from[0], to[0], delta, unit, floatProps.indexOf(""+key) === -1];
        }
    });

    return map;
}

function minMax(val, min, max) {
    return Math.min(Math.max(val, min), max);
}

const Easing = {
    linear: function(){return function(t) {return t;};}
};

Easing.default = Easing.linear;

const eases = {
    Sine: function(){
        return function(t){
            return 1 - Math.cos(t * Math.PI / 2);
        };
    },
    Circ: function(){
        return function(t){
            return 1 - Math.sqrt(1 - t * t);
        };
    },
    Back: function(){
        return function(t){
            return t * t * (3 * t - 2);
        };
    },
    Bounce: function(){
        return function(t){
            let pow2, b = 4;
            while (t < (( pow2 = Math.pow(2, --b)) - 1) / 11) {}
            return 1 / Math.pow(4, 3 - b) - 7.5625 * Math.pow(( pow2 * 3 - 2 ) / 22 - t, 2);
        };
    },
    Elastic: function(amplitude, period){
        if (not(amplitude)) {
            amplitude = 1;
        }

        if (not(period)) {
            period = 0.5;
        }
        const a = minMax(amplitude, 1, 10);
        const p = minMax(period, 0.1, 2);
        return function(t){
            return (t === 0 || t === 1) ? t :
                -a * Math.pow(2, 10 * (t - 1)) * Math.sin((((t - 1) - (p / (Math.PI * 2) * Math.asin(1 / a))) * (Math.PI * 2)) / p);
        };
    }
};

['Quad', 'Cubic', 'Quart', 'Quint', 'Expo'].forEach(function(name, i) {
    eases[name] = function(){
        return function(t){
            return Math.pow(t, i + 2);
        };
    };
});

Object.keys(eases).forEach(function(name) {
    const easeIn = eases[name];
    Easing['easeIn' + name] = easeIn;
    Easing['easeOut' + name] = function(a, b){
        return function(t){
            return 1 - easeIn(a, b)(1 - t);
        };
    };
    Easing['easeInOut' + name] = function(a, b){
        return function(t){
            return t < 0.5 ? easeIn(a, b)(t * 2) / 2 : 1 - easeIn(a, b)(t * -2 + 2) / 2;
        };
    };
});

let defaultAnimationProps = {
    id: null,
    el: null,
    draw: {},
    dur: $.animation.duration,
    ease: $.animation.ease,
    loop: 0,
    pause: 0,
    dir: "normal",
    defer: 0,
    onStart: function(){},
    onStop: function(){},
    onStopAll: function(){},
    onPause: function(){},
    onPauseAll: function(){},
    onResume: function(){},
    onResumeAll: function(){},
    onFrame: function(){},
    onDone: function(){}
};

function animate(args){
    return new Promise(function(resolve){
        const that = this;
        const props = $.assign({}, defaultAnimationProps, {dur: $.animation.duration, ease: $.animation.ease}, args);
        let id = props.id, el = props.el, draw = props.draw, dur = props.dur, ease = props.ease, loop = props.loop,
            onStart = props.onStart, onFrame = props.onFrame, onDone = props.onDone,
            pauseStart = props.pause, dir = props.dir, defer = props.defer;
        let map = {};
        let easeName = "linear", easeArgs = [], easeFn = Easing.linear, matchArgs;
        let direction = dir === "alternate" ? "normal" : dir;
        let replay = false;
        let animationID = id ? id : +(performance.now() * Math.pow(10, 14));

        if (not(el)) {
            throw new Error("Unknown element!");
        }

        if (typeof el === "string") {
            el = document.querySelector(el);
        }

        if (typeof draw !== "function" && typeof draw !== "object") {
            throw new Error("Unknown draw object. Must be a function or object!");
        }

        if (dur === 0) {
            dur = 1;
        }

        if (dir === "alternate" && typeof loop === "number") {
            loop *= 2;
        }

        if (typeof ease === "string") {
            matchArgs = /\(([^)]+)\)/.exec(ease);
            easeName = ease.split("(")[0];
            easeArgs = matchArgs ? matchArgs[1].split(',').map(function(p){return parseFloat(p);}) : [];
            easeFn = Easing[easeName] || Easing.linear;
        } else if (typeof ease === "function") {
            easeFn = ease;
        } else {
            easeFn = Easing.linear;
        }

        $.animation.elements[animationID] = {
            element: el,
            id: null,
            stop: 0,
            pause: 0,
            loop: 0,
            t: -1,
            started: 0,
            paused: 0
        };

        const play = function() {
            if (typeof draw === "object") {
                map = createAnimationMap(el, draw, direction);
            }

            if (typeof onStart === "function") {
                onStart.apply(el);
            }

            // start = performance.now();
            $.animation.elements[animationID].loop += 1;
            $.animation.elements[animationID].started = performance.now();
            $.animation.elements[animationID].duration = dur;
            $.animation.elements[animationID].id = requestAnimationFrame(animate1);
        };

        const done = function() {
            cancelAnimationFrame($.animation.elements[animationID].id);
            delete $.animation.elements[id];

            if (typeof onDone === "function") {
                onDone.apply(el);
            }

            resolve(that);
        };

        const animate1 = function(time) {
            let p, t;
            let {stop, pause, started: start} = $.animation.elements[animationID]

            if ($.animation.elements[animationID].paused) {
                start = time - $.animation.elements[animationID].t * dur;
                $.animation.elements[animationID].started = start;
            }

            t = ((time - start) / dur).toFixed(4);

            if (t > 1) t = 1;
            if (t < 0) t = 0;

            p = easeFn.apply(null, easeArgs)(t);

            $.animation.elements[animationID].t = t;
            $.animation.elements[animationID].p = p;

            if (pause) {
                $.animation.elements[animationID].id = requestAnimationFrame(animate1);
                return;
            }

            if ( stop > 0) {
                if (stop === 2) {
                    if (typeof draw === "function") {
                        draw.bind(el)(1, 1);
                    } else {
                        applyProps(el, map, 1);
                    }
                }
                done();
                return;
            }

            if (typeof draw === "function") {
                draw.bind(el)(t, p);
            } else {
                applyProps(el, map, p);
            }

            if (typeof onFrame === 'function') {
                onFrame.apply(el, [t, p]);
            }

            if (t <= 1) {
                $.animation.elements[animationID].id = requestAnimationFrame(animate1);
            }

            if (t >= 1) {
                if (loop) {
                    if (dir === "alternate") {
                        direction = direction === "normal" ? "reverse" : "normal";
                    }

                    if (typeof loop === "boolean") {
                        setTimeout(function () {
                            play();
                        }, pauseStart);
                    } else {
                        if (loop > $.animation.elements[animationID].loop) {
                            setTimeout(function () {
                                play();
                            }, pauseStart);
                        } else {
                            done();
                        }
                    }
                } else {
                    if (dir === "alternate" && !replay) {
                        direction = direction === "normal" ? "reverse" : "normal";
                        replay = true;
                        play();
                    } else {
                        done();
                    }
                }
            }
        }
        
        
        if (defer > 0) {
            setTimeout(function() {
                play();
            }, defer);
        } else {
            play();
        }
    });
}

// Stop animation
function stopAnimation(id, done){
    const an = $.animation.elements[id];

    if (typeof an === "undefined") {
        return ;
    }

    if (not(done)) {
        done = true;
    }

    an.stop = done === true ? 2 : 1;

    if (typeof an.onStop === "function") {
        an.onStop.apply(an.element);
    }
}

function stopAnimationAll(done, filter){
    $.each($.animation.elements, function(k, v){
        if (filter) {
            if (typeof filter === "string") {
                if (matches.call(v.element, filter)) stopAnimation(k, done);
            } else if (filter.length) {
                $.each(filter, function(){
                    if (v.element === this) stopAnimation(k, done);
                });
            } else if (filter instanceof Element) {
                if (v.element === filter) stopAnimation(k, done);
            }
        } else {
            stopAnimation(k, done);
        }
    });
}
// end of stop

// Pause and resume animation
function pauseAnimation(id){
    const an = $.animation.elements[id];

    if (typeof an === "undefined") {
        return ;
    }

    an.pause = 1;
    an.paused = performance.now();

    if (typeof an.onPause === "function") {
        an.onPause.apply(an.element);
    }
}

function pauseAnimationAll(filter){
    $.each($.animation.elements, function(k, v){
        if (filter) {
            if (typeof filter === "string") {
                if (matches.call(v.element, filter)) pauseAnimation(k);
            } else if (filter.length) {
                $.each(filter, function(){
                    if (v.element === this) pauseAnimation(k);
                });
            } else if (filter instanceof Element) {
                if (v.element === filter) pauseAnimation(k);
            }
        } else {
            pauseAnimation(k);
        }
    });
}
// end of pause

function resumeAnimation(id){
    const an = $.animation.elements[id];

    if (typeof an === "undefined") {
        return ;
    }

    an.pause = 0;
    an.paused = 0;

    if (typeof an.onResume === "function") {
        an.onResume.apply(an.element);
    }
}

function resumeAnimationAll(filter){
    $.each($.animation.elements, function(k, v){
        if (filter) {
            if (typeof filter === "string") {
                if (matches.call(v.element, filter)) resumeAnimation(k);
            } else if (filter.length) {
                $.each(filter, function(){
                    if (v.element === this) resumeAnimation(k);
                });
            } else if (filter instanceof Element) {
                if (v.element === filter) resumeAnimation(k);
            }
        } else {
            resumeAnimation(k);
        }
    });
}

/* eslint-enable */

let defaultChainOptions = {
    loop: false,
    onChainItem: null,
    onChainItemComplete: null,
    onChainComplete: null
}

function chain(arr, opt){
    const o = $.extend({}, defaultChainOptions, opt);

    if (typeof o.loop !== "boolean") {
        o.loop--;
    }

    if (!Array.isArray(arr)) {
        console.warn("Chain array is not defined!");
        return false;
    }

    const reducer = function(acc, item){
        return acc.then(function(){
            if (typeof o["onChainItem"] === "function") {
                o["onChainItem"](item);
            }
            return animate(item).then(function(){
                if (typeof o["onChainItemComplete"] === "function") {
                    o["onChainItemComplete"](item);
                }
            });
        });
    };

    arr.reduce(reducer, Promise.resolve()).then(function(){
        if (typeof o["onChainComplete"] === "function") {
            o["onChainComplete"]();
        }

        if (o.loop) {
            chain(arr, o);
        }
    });
}

$.easing = {};

$.extend($.easing, Easing);

$.extend({
    animate: function(args){
        let el, draw, dur, ease, cb;

        if (arguments.length > 1) {
            el = $(arguments[0])[0];
            draw = arguments[1];
            dur = arguments[2] || $.animation.duration;
            ease = arguments[3] || $.animation.ease;
            cb = arguments[4];

            if (typeof dur === 'function') {
                cb = dur;
                ease = $.animation.ease;
                dur = $.animation.duration;
            }

            if (typeof ease === 'function') {
                cb = ease;
                ease = $.animation.ease;
            }

            return animate({
                el: el,
                draw: draw,
                dur: dur,
                ease: ease,
                onDone: cb
            });
        }

        return animate(args);
    },
    chain: chain,
    stop: stopAnimation,
    stopAll: stopAnimationAll,
    resume: resumeAnimation,
    resumeAll: resumeAnimationAll,
    pause: pauseAnimation,
    pauseAll: pauseAnimationAll
});

$.fn.extend({
    /**
     *

     args = {
     draw: {} | function,
     dur: 1000,
     ease: "linear",
     loop: 0,
     pause: 0,
     dir: "normal",
     defer: 0,
     onFrame: function,
     onDone: function
     }

     * @returns {this}
     */
    animate: function(args){
        const that = this;
        let draw, dur, easing, cb;
        const a = args;
        let compatibilityMode;

        compatibilityMode = !Array.isArray(args) && (arguments.length > 1 || (arguments.length === 1 && typeof arguments[0].draw === 'undefined'));

        if ( compatibilityMode ) {
            draw = arguments[0];
            dur = arguments[1] || $.animation.duration;
            easing = arguments[2] || $.animation.ease;
            cb = arguments[3];

            if (typeof dur === 'function') {
                cb = dur;
                dur = $.animation.duration;
                easing = $.animation.ease;
            }

            if (typeof easing === 'function') {
                cb = easing;
                easing = $.animation.ease;
            }

            return this.each(function(){
                return $.animate({
                    el: this,
                    draw: draw,
                    dur: dur,
                    ease: easing,
                    onDone: cb
                });
            });
        }

        if (Array.isArray(args)) {
            $.each(args, function(){
                const a = this;
                that.each(function(){
                    a.el = this;
                    $.animate(a);
                });
            });
            return this;
        }

        return this.each(function(){
            a.el = this;
            $.animate(a);
        });
    },

    chain: function(arr, loop){
        return this.each(function(){
            const el = this;
            $.each(arr, function(){
                this.el = el;
            });
            $.chain(arr, loop);
        });
    },

    /**
     *
     * @param done
     * @returns {this}
     */
    stop: function(done){
        return this.each(function(){
            const el = this;
            $.each($.animation.elements, function(k, o){
                if (o.element === el) {
                    stopAnimation(k, done);
                }
            });
        });
    },

    pause: function(){
        return this.each(function(){
            const el = this;
            $.each($.animation.elements, function(k, o){
                if (o.element === el) {
                    pauseAnimation(k);
                }
            });
        });
    },

    resume: function(){
        return this.each(function(){
            const el = this;
            $.each($.animation.elements, function(k, o){
                if (o.element === el) {
                    resumeAnimation(k);
                }
            });
        });
    }
});

$.extend({
    hidden: function(el, val, cb){
        el = $(el)[0];

        if (typeof val === "string") {
            val = val.toLowerCase() === "true";
        }

        if (typeof val === "function") {
            cb = val;
            val = !el.hidden;
        }

        el.hidden = val;

        if (typeof cb === "function") {
            $.bind(cb, el);
            cb.call(el, arguments);
        }

        return this;
    },

    hide: function(el, cb){
        const $el = $(el);

        el = $el[0]

        const inline = el.style.display
        const css = getComputedStyle(el, null).display

        $el.origin('display', {
            inline,
            css
        });

        el.style.display = 'none';

        if (typeof cb === "function") {
            $.bind(cb, el);
            cb.call(el, arguments);
        }

        return this;
    },

    show: function(el, cb){
        const $el = $(el);
        const display = $el.origin('display');

        el = $(el)[0]

        el.style.display = ''

        if (display) {
            const inline = display.inline || ''
            const css = display.css || ''
            if (inline && inline !== 'none') {
                el.style.display = inline
            } else if (css === 'none') {
                el.style.display = 'block';
            }
        } else {
            el.style.display = 'block'
        }

        if (parseInt(el.style.opacity) === 0) {
            el.style.opacity = "1";
        }

        if (typeof cb === "function") {
            $.bind(cb, el);
            cb.call(el, arguments);
        }

        return this;
    },

    visible: function(el, mode, cb){
        if (mode === undefined) {
            mode = true;
        }
        el.style.visibility = mode ? 'visible' : 'hidden';
        if (typeof cb === "function") {
            $.bind(cb, el);
            cb.call(el, arguments);
        }
        return this;
    },

    toggle: function(el, cb){
        const func = getComputedStyle(el, null).display !== 'none' ? 'hide' : 'show';
        return $[func](el, cb);
    }
});

$.fn.extend({
    hide: function(){
        let callback;

        $.each(arguments, function(){
            if (typeof this === 'function') {
                callback = this;
            }
        });

        return this.each(function(){
            $.hide(this, callback);
        });
    },

    show: function(){
        let callback;

        $.each(arguments, function(){
            if (typeof this === 'function') {
                callback = this;
            }
        });

        return this.each(function(){
            $.show(this, callback);
        });
    },

    visible: function(mode, cb){
        return this.each(function(){
            $.visible(this, mode, cb);
        });
    },

    toggle: function(cb){
        return this.each(function(){
            $.toggle(this, cb);
        });
    },

    hidden: function(val, cb){
        return this.each(function(){
            $.hidden(this, val, cb);
        });
    }
});



$.extend({
    fx: {
        off: false
    }
});

$.fn.extend({
    fadeIn: function(dur, easing, cb){
        return this.each(function(){
            const el = this;
            const $el = $(el);
            const visible = !(!isVisible(el) || (isVisible(el) && +($el.style('opacity')) === 0));

            if (not(dur) && not(easing) && not(cb)) {
                cb = null;
                dur = $.animation.duration;
            } else if (typeof dur === "function") {
                cb = dur;
                dur = $.animation.duration;
            }

            if (typeof easing === "function") {
                cb = easing;
                easing = $.animation.ease;
            }

            if ($.fx.off) {
                dur = 0;
            }

            if (visible) {
                if (typeof cb === 'function') {
                    $.bind(cb, this)();
                }
                return this;
            }

            const originDisplay = $el.origin("display", undefined, 'block');

            el.style.opacity = "0";
            el.style.display = originDisplay;

            return $.animate({
                el,
                draw: {
                    opacity: 1
                },
                dur,
                ease: easing,
                onDone: function(){
                    if (typeof cb === 'function') {
                        $.bind(cb, this)();
                    }
                }
            });
        });
    },

    fadeOut: function(dur, easing, cb){
        return this.each(function(){
            const el = this;
            const $el = $(el);

            if (not(dur) && not(easing) && not(cb)) {
                cb = null;
                dur = $.animation.duration;
            } else
            if (typeof dur === "function") {
                cb = dur;
                dur = $.animation.duration;
            }
            if (typeof easing === "function") {
                cb = easing;
                easing = $.animation.ease;
            }

            $el.origin("display", $el.style('display'));

            if ( !isVisible(el) ) {
                if (typeof cb === 'function') {
                    $.bind(cb, this)();
                }
                return this;
            }

            return $.animate({
                el,
                draw: {
                    opacity: 0
                },
                dur,
                ease: easing,
                onDone: function(){
                    this.style.display = 'none';

                    if (typeof cb === 'function') {
                        $.bind(cb, this)();
                    }
                }
            });
        });
    },

    slideUp: function(dur, easing, cb){
        return this.each(function(){
            const el = this;
            const $el = $(el);
            let currHeight;

            if ($el.height() === 0) return ;

            if (not(dur) && not(easing) && not(cb)) {
                cb = null;
                dur = $.animation.duration;
            } else
            if (typeof dur === "function") {
                cb = dur;
                dur = $.animation.duration;
            }
            if (typeof easing === "function") {
                cb = easing;
                easing = $.animation.ease;
            }

            currHeight = $el.height();
            $el.origin("height", currHeight);
            $el.origin("display", $(el).style('display'));

            $el.css({
                overflow: "hidden"
            });

            return $.animate({
                el,
                draw: {
                    height: 0
                },
                dur,
                ease: easing,
                onDone: function(){
                    $el.hide().removeStyleProperty("overflow, height");
                    if (typeof cb === 'function') {
                        $.bind(cb, this)();
                    }
                }
            });
        });
    },

    slideDown: function(dur, easing, cb){
        return this.each(function(){
            const el = this;
            const $el = $(el);
            let targetHeight, originDisplay;

            if (not(dur) && not(easing) && not(cb)) {
                cb = null;
                dur = $.animation.duration;
            } else
            if (typeof dur === "function") {
                cb = dur;
                dur = $.animation.duration;
            }
            if (typeof easing === "function") {
                cb = easing;
                easing = $.animation.ease;
            }

            $el.show().visible(false);
            targetHeight = +$el.origin("height", undefined, $el.height());
            if (parseInt(targetHeight) === 0) {
                targetHeight = el.scrollHeight;
            }
            originDisplay = $el.origin("display", $el.style('display'), "block");
            $el.height(0).visible(true);

            $el.css({
                overflow: "hidden",
                display: originDisplay === "none" ? "block" : originDisplay
            });

            return $.animate({
                el,
                draw: {
                    height: targetHeight
                },
                dur,
                ease: easing,
                onDone: function(){
                    $(el).removeStyleProperty("overflow, height, visibility");
                    if (typeof cb === 'function') {
                        $.bind(cb, this)();
                    }
                }
            });
        });
    },

    moveTo: function(x, y, dur, ease, cb){
        const draw = {
            top: y,
            left: x
        };

        if (typeof dur === "function") {
            cb = dur;
            dur = $.animation.duration;
            ease = $.animation.ease;
        }

        if (typeof ease === "function") {
            cb = ease;
            ease = $.animation.ease;
        }

        return this.each(function(){
            $.animate({
                el: this,
                draw,
                dur,
                ease,
                onDone: cb
            });
        });
    },

    centerTo: function(x, y, dur, ease, cb){
        if (typeof dur === "function") {
            cb = dur;
            dur = $.animation.duration;
            ease = $.animation.ease;
        }

        if (typeof ease === "function") {
            cb = ease;
            ease = $.animation.ease;
        }

        return this.each(function(){
            const draw = {
                left: x - this.clientWidth / 2,
                top: y - this.clientHeight / 2
            };
            $.animate({
                el: this,
                draw,
                dur,
                ease,
                onDone: cb
            });
        });
    },

    colorTo: function(color, dur, easing, cb){
        const draw = {
            color: color
        };

        if (typeof dur === "function") {
            cb = dur;
            dur = $.animation.duration;
            easing = $.animation.ease;
        }

        if (typeof easing === "function") {
            cb = easing;
            easing = $.animation.ease;
        }

        return this.each(function(){
            $.animate({
                el: this,
                draw,
                dur,
                ease: easing,
                onDone: cb
            });
        });
    },

    backgroundTo: function(color, dur, easing, cb){
        const draw = {
            backgroundColor: color
        };

        if (typeof dur === "function") {
            cb = dur;
            dur = $.animation.duration;
            easing = $.animation.ease;
        }

        if (typeof easing === "function") {
            cb = easing;
            easing = $.animation.ease;
        }

        return this.each(function(){
            $.animate({
                el: this,
                draw,
                dur,
                ease: easing,
                onDone: cb
            });
        });
    },
    
    zoomIn: function(dur, easing, cb){
        const draw = {
            scale: [0, 1]
        };

        if (typeof dur === "function") {
            cb = dur;
            dur = $.animation.duration;
            easing = $.animation.ease;
        }

        if (typeof easing === "function") {
            cb = easing;
            easing = $.animation.ease;
        }

        return this.each(function(){
            $.animate({
                el: this,
                draw,
                dur,
                ease: easing,
                onDone: cb
            });
        });
    },
    
    zoomOut: function(dur = 1000, ease = 'linear', cb = () => {}){
        if (typeof dur === "function") {
            cb = dur;
            dur = $.animation.duration;
            ease = $.animation.ease;
        }

        if (typeof ease === "function") {
            cb = ease;
            ease = $.animation.ease;
        }

        return this.each(function(){
            $.animate({
                el: this,
                draw: {
                    scale: 0
                },
                dur,
                ease,
                onDone: cb
            });
        });
    }
});

$.extend({
    scrollTop: function (val) {
        if (not(val)) {
            return window.scrollY;
        }
        window.scrollTo(window.scrollX, val);
    },

    scrollLeft: function (val) {
        if (not(val)) {
            return window.scrollX;
        }
        window.scrollTo(val, window.scrollY);
    },
    
    scrollTo: function (x, y) {
        window.scrollTo(x, y);
    },
    
    scrollToElement: function (el) {
        $(el).scrollTo();
    }    
})

$.fn.extend({
    scrollTop: function (val) {
        if (not(val)) {
            return this.length === 0 ? undefined : this[0] === window ? scrollY : this[0].scrollTop;
        }
        return this.each(function () {
            this.scrollTop = val;
        });
    },

    scrollLeft: function (val) {
        if (not(val)) {
            return this.length === 0 ? undefined : this[0] === window ? scrollX : this[0].scrollLeft;
        }
        return this.each(function () {
            this.scrollLeft = val;
        });
    },
    
    scrollTo: function (relativeToViewport = false) {
        if (this.length === 0) {
            return this;
        }
        const rect = this[0].getBoundingClientRect();
        const x = rect.left + (relativeToViewport ? 0 : window.scrollX)
        const y = rect.top + (relativeToViewport ? 0 : window.scrollY)
        window.scrollTo(x, y);
        return this;
    }
})

$.init = function(sel, ctx){
    let parsed;
    const that = this;

    if (typeof sel === "string") {
        sel = sel.trim();
    }

    this.uid = $.uniqueId();

    if (!sel) {
        return this;
    }

    if (typeof sel === "function") {
        return $.ready(sel);
    }

    if (sel instanceof Element) {
        this.push(sel);
        return this;
    }

    if (sel instanceof $) {
        $.each(sel, function(){
            that.push(this);
        });
        return this;
    }

    if (sel === "window") sel = window;
    if (sel === "document") sel = document;
    if (sel === "body") sel = document.body;
    if (sel === "html") sel = document.documentElement;
    if (sel === "doctype") sel = document.doctype;
    if (sel && (sel.nodeType || sel.self === window)) {
        this.push(sel);
        return this;
    }

    if (isArrayLike(sel)) {
        $.each(sel, function(){
            $(this).each(function(){
                that.push(this);
            });
        });
        return this;
    }

    if (typeof sel !== "string" && (sel.self && sel.self !== window)) {
        return this;
    }

    if (sel === "#" || sel === ".") {
        console.error("Selector can't be # or .") ;
        return this;
    }

    if (sel[0] === "@") {

        $("[data-role]").each(function(){
            const roles = str2arr($(this).attr("data-role"), ",");
            if (roles.indexOf(sel.slice(1)) > -1) {
                that.push(this);
            }
        });

    } else {

        parsed = $.parseHTML(sel);

        if (parsed.length === 1 && parsed[0].nodeType === 3) { // Must be a text node -> css sel
            try {
                [].push.apply(this, document.querySelectorAll(sel));
            } catch (e) {
                //console.error(sel + " is not a valid selector");
            }
        } else {
            $.merge(this, parsed);
        }
    }

    if (ctx !== undefined) {
        if (ctx instanceof $) {
            this.each(function () {
                $(ctx).append(that);
            });
        } else if (ctx instanceof HTMLElement) {
            $(ctx).append(that);
        } else {
            if (isPlainObject(ctx)) {
                $.each(this,function(){
                    for(const name in ctx) {
                        if (hasProp(ctx, name))
                            this.setAttribute(name, ctx[name]);
                    }
                });
            }
        }
    }

    return this;
};

$.init.prototype = $.fn;


export {
    $
}

