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