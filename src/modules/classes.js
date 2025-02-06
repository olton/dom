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
