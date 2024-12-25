import isArrayLike from "./is-array-like.js";
import hasProp from "./has-prop.js";

export default (ctx, cb) => {
    let index = 0;
    
    if (isArrayLike(ctx)) {
        [].forEach.call(ctx, function(val, key) {
            cb.apply(val, [key, val]);
        });
    } else {
        for(let key in ctx) {
            if (hasProp(ctx, key))
                cb.apply(ctx[key], [key, ctx[key],  index++]);
        }
    }

    return ctx;
}