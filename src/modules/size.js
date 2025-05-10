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
            el.style[prop] = isNaN(val) ? val : +val === 0 ? 0 : val + 'px';
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

        const setter = typeof val === "number"
        
        if (setter) {
            return this.each(function(){
                const el = this;
                if (el === window || el === document) {return ;}
                let h, style = getComputedStyle(el),
                    bs = prop === 'width' ? parseInt(style['borderLeftWidth']) + parseInt(style['borderRightWidth']) : parseInt(style['borderTopWidth']) + parseInt(style['borderBottomWidth']),
                    pa = prop === 'width' ? parseInt(style['paddingLeft']) + parseInt(style['paddingRight']) : parseInt(style['paddingTop']) + parseInt(style['paddingBottom']);

                h = $(this)[prop](val)[prop]() - bs - pa;
                el.style[prop] = h + 'px';
            });
        }

        const includeMargin = val === true;
        
        el = this[0];
        size = el[prop === 'width' ? 'offsetWidth' : 'offsetHeight'];
        style = getComputedStyle(el);
        result = size + parseInt(style[prop === 'width' ? 'marginLeft' : 'marginTop']) + parseInt(style[prop === 'width' ? 'marginRight' : 'marginBottom']);
        return includeMargin ? result : size;
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
            top: parseInt(s["paddingTop"]),
            right: parseInt(s["paddingRight"]),
            bottom: parseInt(s["paddingBottom"]),
            left: parseInt(s["paddingLeft"])
        };
    },

    margin: function(p){
        if (this.length === 0) return;
        const s = getComputedStyle(this[0], p);

        return {
            top: parseInt(s["marginTop"]),
            right: parseInt(s["marginRight"]),
            bottom: parseInt(s["marginBottom"]),
            left: parseInt(s["marginLeft"])
        };
    },

    border: function(p){
        if (this.length === 0) return;
        const s = getComputedStyle(this[0], p);

        return {
            top: parseInt(s["borderTopWidth"]),
            right: parseInt(s["borderRightWidth"]),
            bottom: parseInt(s["borderBottomWidth"]),
            left: parseInt(s["borderLeftWidth"])
        };
    }
});