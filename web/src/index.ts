/**
 * Represents a constructor of T.
 */
type Constructor<T> = new (...args: Array<any>) => T;

/**
 * Debounce the given callback function.
 *
 * @param callback Arbitrary callback function.
 * @param threshold Debounce threshold in milliseconds.
 * @return Debounced callback function.
 */
function debounce<T extends (...args: Array<any>) => any>(
    callback: T,
    threshold: number
): (...args: Parameters<T>) => void {
    let timeout: number;

    return (...args: Parameters<T>) => {
        clearTimeout(timeout);

        timeout = window.setTimeout(callback, threshold, ...args);
    };
}

export { Constructor, debounce };
export { default as ApplicationBuilder } from "./ApplicationBuilder";
export { default as ApplicationBuilderInterface } from "./ApplicationBuilderInterface";
export { default as ApplicationContext } from "./ApplicationContext";
export { default as ApplicationContextInterface } from "./ApplicationContextInterface";
export { default as Startup } from "./Startup";
export { default as StartupInterface } from "./StartupInterface";
