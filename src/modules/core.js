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