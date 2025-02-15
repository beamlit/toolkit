"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugify = slugify;
/**
 * Converts a string into a URL-friendly slug.
 * @param name - The string to slugify.
 * @returns The slugified string.
 */
function slugify(name) {
    return name.toLowerCase().replaceAll(" ", "-").replaceAll("_", "-");
}
