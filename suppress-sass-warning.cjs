/**
 * Suppress the Dart Sass "legacy JS API" deprecation warning.
 *
 * This warning originates from rollup-plugin-postcss v4's internal sass loader
 * which calls sass.render() (legacy API). Since it's bundled inside
 * @mendix/pluggable-widgets-tools and cannot be patched, we filter the warning
 * at the Node.js process level.
 *
 * Loaded via NODE_OPTIONS=--require=./suppress-sass-warning.cjs
 */
const originalStderrWrite = process.stderr.write;
process.stderr.write = function (chunk, ...args) {
    const text = typeof chunk === "string" ? chunk : (Buffer.isBuffer(chunk) ? chunk.toString("utf8") : "");
    if (text.includes("legacy JS API") || text.includes("Deprecation Warning")) {
        return true;
    }
    return originalStderrWrite.call(this, chunk, ...args);
};

const originalStdoutWrite = process.stdout.write;
process.stdout.write = function (chunk, ...args) {
    const text = typeof chunk === "string" ? chunk : (Buffer.isBuffer(chunk) ? chunk.toString("utf8") : "");
    if (text.includes("legacy JS API") || text.includes("Deprecation Warning")) {
        return true;
    }
    return originalStdoutWrite.call(this, chunk, ...args);
};
