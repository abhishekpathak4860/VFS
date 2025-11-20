import app from "./app2.js";

export default function handler(req, res) {
  return app(req, res); // Express handles the request
}
