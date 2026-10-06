import { writeFileSync } from "node:fs";
import { app, openApiConfig } from "../src/app";

const doc = app.getOpenAPIDocument(openApiConfig);

writeFileSync("openapi.json", `${JSON.stringify(doc, null, 2)}\n`);
console.log("Wrote openapi.json");
