# VehiclePull (Next.js)

A tiny Next.js app that pulls a random vehicle model from your Rails Vehicle API.

## Local Dev

1. From this folder, install dependencies if needed:

```bash
npm install
```

2. (Optional) Point to a custom Vehicle API base URL:

```bash
export VEHICLE_API_BASE_URL="https://vehicle-api-production-d87b74658d93.herokuapp.com"
```

3. Run the dev server:

```bash
npm run dev
```

Then open `http://localhost:3000`.

## API Proxy

The UI calls `GET /api/vehicle`, which proxies to:

```
${VEHICLE_API_BASE_URL}/cars/random?persist=false
```

The Rails API handles the upstream NHTSA call and returns a single random model.

## UI Features

- One-button random vehicle model pulls.
- Loading skeletons.
- Clean error state when the API is unreachable.

## Deploy (AWS Amplify)

- Create a new Amplify Hosting app from this repo.
- Set the app root to `aws-amplify/VehiclePull`.
- Amplify should auto-detect Next.js.
- Add the environment variable `VEHICLE_API_BASE_URL` if you want a non-default host.

If you want me to verify the latest Amplify UI steps, tell me and I will confirm against current docs.
