export default (fn, args, ctx) => {
    if (typeof fn !== "function") {
        return new Function("a", fn).apply(ctx, args);
    } else {
        return fn.apply(ctx, args);
    }
}