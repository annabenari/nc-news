const fs = require("fs");
const path = require("path");

function generateAvailableEndpoints() {
  const endpointsFilePath = path.join(__dirname, "../endpoints.json");
  const endpointsData = fs.readFileSync(endpointsFilePath, "utf-8");

  return JSON.parse(endpointsData);
}

exports.getApiData = (req, res) => {
  const api = generateAvailableEndpoints();
  res.status(200).json({ api });
};
