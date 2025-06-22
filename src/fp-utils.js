export function getBaseUrl() {
  const region = process.env.FINGERPRINT_REGION;
  if (region === "eu") {
    return "https://eu.api.fpjs.io";
  }
  if (region === "ap") {
    return "https://ap.api.fpjs.io";
  }
  return "https://api.fpjs.io";
}

export function getServerAPIKey() {
  const serverAPIKey = process.env.FINGERPRINT_SECRET_API_KEY;
  if (!serverAPIKey) {
    throw new Error("FINGERPRINT_SECRET_API_KEY is not set");
  }
  return serverAPIKey;
}
