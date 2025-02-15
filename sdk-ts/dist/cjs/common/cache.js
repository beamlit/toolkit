"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
        fs = await Promise.resolve().then(() => __importStar(require('fs')));
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
