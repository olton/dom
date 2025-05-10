$.fn.extend({

    style: function(name, pseudo){
        let el

        function _getStyle(el, prop, pseudo){
            return ["scrollLeft", "scrollTop"].includes(prop) ? $(el)[prop]() : getComputedStyle(el, pseudo)[prop];
        }

        if (typeof name === 'string' && this.length === 0) {
            return undefined;
        }

        if (this.length === 0) {
            return this;
        }

        el = this[0];

        if (!name || name === "all") {
            return getComputedStyle(el, pseudo);
        } else {
            let result = {} 
            let names = name.split(", ").map(function(el){
                return (""+camelCase(el)).trim();
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

        return this.each(function(_, el){
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
        if (not(name)) return undefined;
        if (not(val)) {
            return getComputedStyle(this[0]).getPropertyValue("--"+name);
        } else {
            return this.each(function(){
                this.style.setProperty("--"+name, val);
            });
        }
    }
});

