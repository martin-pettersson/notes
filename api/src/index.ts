import { Readable } from "stream";

/**
 * Represents any constructor of type T.
 */
type Constructor<T = any> = new (...parameters: Array<any>) => T;

/**
 * Represents an importable module definition.
 */
type ModuleDefinition = {
    specifier: string,
    exportName: string
};

/**
 * Retrieve the constructor of a given module.
 *
 * @param moduleDefinition Arbitrary module definition.
 * @return Module constructor.
 */
async function fetchConstructor(moduleDefinition: string | ModuleDefinition): Promise<Constructor> {
    const [ specifier, exportName ] = typeof moduleDefinition === "string" ?
        moduleDefinition.split("::") :
        [moduleDefinition.specifier, moduleDefinition.exportName];

    return (await import(specifier!))[exportName ?? "default"];
}

/**
 * Read the contents of a given stream into a string.
 *
 * @param stream Arbitrary readable stream.
 * @return Promise resolving with a string representation of the stream.
 */
function readStream(stream: Readable): Promise<string> {
    return new Promise((resolve, reject) => {
        let buffers = [] as Array<Buffer>;

        stream.on("data", (buffer: Buffer) => buffers.push(buffer));
        stream.on("end", () => resolve(Buffer.concat(buffers).toString()));
        stream.on("error", reject);
    });
}

export { Constructor, ModuleDefinition, fetchConstructor, readStream };
export { default as Startup } from "./Startup.js";
