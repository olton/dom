import hasProp from "./has-prop.js";

export default ( obj ) => {
    if (typeof obj === "undefined" || obj === null) return true;
    if (typeof obj === "number") return false;
    if (typeof obj === "boolean") return false;
    if (typeof obj === "string" || Array.isArray(obj)) return obj.length === 0;
    for (const key in obj ) {
        if (hasProp(obj, key)) return false;
    }
    return true;
}