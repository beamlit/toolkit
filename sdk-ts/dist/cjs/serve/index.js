"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../common/instrumentation.js"); // Ensure instrumentation is initialized
const app_js_1 = require("./app.js");
/**
 * Initializes and runs the Fastify application.
 */
(0, app_js_1.createApp)()
    .then((app) => (0, app_js_1.runApp)(app))
    .catch((err) => console.error(err));
