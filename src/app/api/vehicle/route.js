const DEFAULT_API_BASE_URL =
  "https://vehicle-api-production-d87b74658d93.herokuapp.com";

const buildApiUrl = (baseUrl, requestUrl) => {
  const incoming = new URL(requestUrl);
  const apiUrl = new URL("/cars/random", baseUrl);
  apiUrl.searchParams.set("persist", "false");

  const category = incoming.searchParams.get("category");
  if (category) {
    apiUrl.searchParams.set("category", category);
  }

  return apiUrl;
};

export async function GET(request) {
  const baseUrl = process.env.VEHICLE_API_BASE_URL || DEFAULT_API_BASE_URL;
  const apiUrl = buildApiUrl(baseUrl, request.url);

  try {
  const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message = payload?.error || `Vehicle API error (${response.status})`;
      const upstream = payload?.upstream || payload?.details || null;
      const requestId = payload?.request_id || payload?.requestId || null;
      const category = apiUrl.searchParams.get("category") || "all";
      const details =
        upstream && typeof upstream === "object"
          ? { ...upstream, category }
          : { category };
      return Response.json(
        {
          error: message,
          details,
          request_id: requestId,
        },
        { status: response.status }
      );
    }

    return Response.json(payload, { status: 200 });
  } catch (error) {
    return Response.json(
      {
        error: "Unable to reach the vehicle API.",
        details: {
          category: apiUrl.searchParams.get("category") || "all",
        },
      },
      { status: 502 }
    );
  }
}
