/**
 * Produce a readable stream representation of the given string.
 *
 * @param {string} string Arbitrary string value.
 * @returns {ReadableStream} Readable stream representation.
 */
function streamFrom(string) {
    const iterator = string[Symbol.iterator]();

    return new ReadableStream({
        async pull(controller) {
            const { value, done } = await iterator.next();

            if (done) {
                controller.close();

                return;
            }

            controller.enqueue(value);
        }
    });
}

export { streamFrom };
