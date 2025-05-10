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
        let value = key === undefined 
            ? this.cache(owner) 
            : owner[ this.expando ] && owner[ this.expando ][ camelCase( key ) ];
        
        if (key) {
            return value !== undefined ? value : (owner.getAttribute && owner.getAttribute("data-" + dashedName(key)) || undefined);
        }
        
        value = {...owner[ this.expando ]}

        for (const attr of owner.attributes) {
            if (attr.name.startsWith("data-")) {
                const name = attr.name.slice(5);
                value[camelCase(name)] = attr.value;
            }
        }

        return isEmptyObject(value) ? undefined : value;
    },

    access: function(owner, key, value){
        if (key === undefined || ((key && typeof key === "string") && value === undefined) ) {
            return this.get(owner, key);
        }
        this.set(owner, key, value);
        return value !== undefined ? value : key;
    },

    remove: function(owner, key){
        let cache = owner[this.expando];
        if (cache === undefined) {
            return ;
        }
        if (key !== undefined) {
            const _keys = Array.isArray( key ) ? key : [ key ];
            for (const k of _keys) {
                delete cache[ camelCase( k ) ];
                owner.removeAttribute && owner.removeAttribute("data-" + k);
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
        let res, elem, data

        if (this.length === 0) {
            return ;
        }

        elem = this[0];

        if ( arguments.length === 0 ) {
            if ( elem ) {
                data = dataSet.get( elem );

                if ( elem.nodeType === 1) {
                    for (const a of elem.attributes) {
                        if (a.name.startsWith("data-")) {
                            const name = a.name.slice(5);
                            data[camelCase(name)] = a.value;
                        }   
                    }
                }
            }

            return data;
        }

        if ( arguments.length === 1 && (typeof key === "string" || Array.isArray( key )) ) {
            res = dataSet.get(elem, key);
            return safeJsonParse(res);
        }

        return this.each( function() {
            dataSet.set( this, key, val );
        } );
    },

    removeData: function( key ) {
        if (typeof key === "undefined") {
            return this
        } 
        return this.each( function() {
            const keys = Array.isArray( key ) ? key : key.split(" ").map( el => el.trim() ).filter( el => el !== "" );
            for (const k of keys) {
                dataSet.remove( this, k );
            }            
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