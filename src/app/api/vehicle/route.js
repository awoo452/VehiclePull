const DEFAULT_API_BASE_URL =
  "https://vehicle-api-production-d87b74658d93.herokuapp.com";

const buildApiUrl = (baseUrl) => {
  const apiUrl = new URL("/cars/random", baseUrl);
  apiUrl.searchParams.set("persist", "false");
  return apiUrl;
};

export async function GET() {
  const baseUrl = process.env.VEHICLE_API_BASE_URL || DEFAULT_API_BASE_URL;
  const apiUrl = buildApiUrl(baseUrl);

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message = `Vehicle API error (${response.status})`;
      return Response.json({ error: message }, { status: response.status });
    }

    return Response.json(payload, { status: 200 });
  } catch (error) {
    return Response.json(
      { error: "Unable to reach the vehicle API." },
      { status: 502 }
    );
  }
}
