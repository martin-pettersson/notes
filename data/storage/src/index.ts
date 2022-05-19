/**
 * Represents any constructor of type T.
 */
type Constructor<T = any> = new (...parameters: Array<any>) => T;

export { Constructor };
export { default as AbstractEntityAccessor } from "./AbstractEntityAccessor.js";
