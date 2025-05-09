$.fn.extend({
    attr: function(name, val){
        const attributes = {};

        if (this.length === 0 && arguments.length === 0) {
            return undefined;
        }

        if (this.length && arguments.length === 0) {
            $.each(this[0].attributes, function(){
                attributes[this.name] = this.value;
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

        if (!name) {
            return this.each(function(_, el){
                const attributes = $(el).attr();
                $.each(attributes, function(k){
                    el.removeAttribute(k);
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