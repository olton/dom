export default (name, strip) => typeof name !== "string" 
    ? undefined 
    : name.replaceAll(strip, "")