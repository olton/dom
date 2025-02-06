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