$.fn.extend({
    offset: function(val){
        if (val === undefined) { // Заменяем not(val) на явную проверку
            if (this.length === 0) return undefined;
            let rect = this[0].getBoundingClientRect();
            return {
                top: rect.top + (window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0),
                left: rect.left + (window.scrollX || window.pageXOffset || document.documentElement.scrollLeft || 0)
            };
        }

        return this.each(function(){
            let {top, left} = val;
            let el = $(this),
                position = getComputedStyle(this).position;

            // Получаем текущие координаты без рекурсивного вызова
            let currentRect = this.getBoundingClientRect();
            let currentOffset = {
                top: currentRect.top + (window.scrollY || window.pageYOffset || 0),
                left: currentRect.left + (window.scrollX || window.pageXOffset || 0)
            };

            if (position === "static") {
                el.css("position", "relative");
            }

            if (["absolute", "fixed"].indexOf(position) === -1) {
                top = top - currentOffset.top;
                left = left - currentOffset.left;
            }

            if (top) el.css("top", top);
            if (left) el.css("left", left);
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
            ml = parseInt(style['marginLeft']);
            mt = parseInt(style['marginTop']);
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

    top: function(val, margin = false){
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
        const el = $(this[0]);
        return {
            top: parseInt(el.style("top")),
            left: parseInt(el.style("left"))
        };
    }
});