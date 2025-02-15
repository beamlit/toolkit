"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleControlplaneCache = handleControlplaneCache;
async function handleControlplaneCache(req) {
    if (req.method !== "GET") {
        return null;
    }
    const allowedHosts = new Set(['api.beamlit.com', 'api.beamlit.dev']);
    const url = new URL(req.url);
    if (!allowedHosts.has(url.hostname)) {
        return null;
    }
    const pathSegments = req.url.split('/');
    if (pathSegments.length > 6) {
        return null;
    }
    const objectType = pathSegments[4];
    const name = pathSegments[5];
    const requirePath = `${process.cwd()}/.beamlit/cache/${objectType}/${name}.json`;
    let fs;
    try {
        fs = await import('fs');
    }
    catch {
        return null;
    }
    try {
        log(`Reading cache from ${requirePath}`);
        const cache = fs.readFileSync(requirePath, 'utf8');
        log(`Cache found`);
        return new Response(cache, {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    catch {
        log(`Cache not found`);
        return null;
    }
}
function log(message) {
    const logLevel = process.env.BL_LOG_LEVEL || 'info';
    if (logLevel == "info") {
        console.warn(message);
    }
}
