export default (name) => typeof name !== "string" 
    ? undefined 
    : name.replace(/-/g, "").toLowerCase()