$.extend({
    hidden: function(el, val, cb){
        el = $(el)[0];

        if (typeof val === "undefined") {
            el.hidden = !el.hidden;
            return this;
        }
        
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

