"use client";

import { useMemo, useState } from "react";
import styles from "./page.module.css";

const buildApiPath = ({ category }) => {
  const params = new URLSearchParams();
  if (category) {
    params.set("category", category);
  }

  const query = params.toString();
  return query ? `/api/vehicle?${query}` : "/api/vehicle";
};

export default function Home() {
  const [vehicle, setVehicle] = useState(null);
  const [history, setHistory] = useState([]);
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categoryOptions = useMemo(
    () => [
      { key: "all", label: "All" },
      { key: "passenger", label: "Passenger" },
      { key: "mpv", label: "MPV/SUV" },
      { key: "truck", label: "Trucks" },
      { key: "bus", label: "Buses" },
      { key: "two_wheel", label: "Motorcycles" },
    ],
    []
  );

  const hintText =
    category === "all"
      ? "Category: All road vehicles (trailers excluded)."
      : `Category: ${categoryOptions.find((option) => option.key === category)?.label || "Custom"}.`;

  const fetchVehicle = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(buildApiPath({ category }), { cache: "no-store" });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = payload?.error || `Request failed (${response.status})`;
        setError({
          message,
          status: response.status,
          details: payload?.details || null,
          requestId: payload?.request_id || null,
        });
        return;
      }

      setVehicle(payload);
      const entry = {
        id: payload?.model_id ?? payload?.model_name ?? "N/A",
        name: payload?.name || "Unknown",
        year: payload?.model_year ?? "N/A",
        type: payload?.vehicle_type || "N/A",
      };
      setHistory((prev) => {
        const filtered = prev.filter((item) => item.id !== entry.id);
        return [entry, ...filtered].slice(0, 3);
      });
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : "Something went wrong.",
        status: null,
        details: null,
        requestId: null,
      });
    } finally {
      setLoading(false);
    }
  };

  const makeName = vehicle?.make_name || "Unknown";
  const modelName = vehicle?.model_name || "Unknown";
  const vehicleName = vehicle?.name || `${makeName} ${modelName}`.trim();
  const makeId = vehicle?.make_id ?? "N/A";
  const modelId = vehicle?.model_id ?? "N/A";
  const modelYear = vehicle?.model_year ?? "N/A";
  const vehicleType = vehicle?.vehicle_type || "N/A";
  const categoryLabel =
    categoryOptions.find((option) => option.key === (vehicle?.category || category))
      ?.label || "N/A";
  const errorMessage = error?.message || "";
  const errorDetails = error?.details || null;
  const errorRequestId = error?.requestId || null;
  const isRateLimited = error?.status === 429 || errorMessage.includes("429");

  const detailLines = (() => {
    if (!errorDetails || typeof errorDetails !== "object") {
      return [];
    }

    const lines = [
      ["Upstream", errorDetails.service],
      ["Upstream status", errorDetails.status || errorDetails.response_code],
      ["Category", errorDetails.category],
      ["Vehicle type", errorDetails.vehicle_type_query],
      ["Model year", errorDetails.model_year],
      ["Attempt", errorDetails.attempt],
      ["Make", errorDetails.make_name],
      ["URL", errorDetails.url],
    ];

    return lines
      .filter(([, value]) => value !== undefined && value !== null && value !== "")
      .map(([label, value]) => `${label}: ${value}`);
  })();

  return (
    <div className={styles.page}>
      <main className={styles.card}>
        <header className={styles.header}>
          <p className={styles.kicker}>VehiclePull</p>
          <h1>One button. One random vehicle model.</h1>
          <p className={styles.subtitle}>
            One-button random vehicle model pulls from the Rails Vehicle API backed by NHTSA.
          </p>
        </header>

        <section className={styles.controls}>
          <div className={styles.controlsRow}>
            <button
              className={styles.cta}
              type="button"
              onClick={fetchVehicle}
              disabled={loading}
            >
              {loading ? "Fetching..." : "Fetch a vehicle model"}
            </button>
            <label className={styles.selectWrap}>
              <span className={styles.selectLabel}>Category</span>
              <select
                className={styles.select}
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {categoryOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p className={styles.hint}>{hintText}</p>
        </section>

        <section className={styles.results}>
          {error ? (
            <div className={styles.errorCard}>
              <p className={styles.errorTitle}>Couldn’t reach the API.</p>
              <p className={styles.error}>{errorMessage}</p>
              {detailLines.length
                ? detailLines.map((line) => (
                    <p key={line} className={styles.errorHint}>
                      {line}
                    </p>
                  ))
                : null}
              {errorRequestId ? (
                <p className={styles.errorHint}>Request ID: {errorRequestId}</p>
              ) : null}
              {isRateLimited ? (
                <p className={styles.errorHint}>
                  Rate limit hit. Wait a minute and try again.
                </p>
              ) : null}
              <p className={styles.errorHint}>Use the button above to retry.</p>
            </div>
          ) : null}

          {loading && !vehicle ? (
            <div className={styles.skeletonCard} aria-hidden="true">
              <div className={styles.skeletonTitle} />
              <div className={styles.skeletonRow}>
                <div className={styles.skeletonBlock} />
                <div className={styles.skeletonBlock} />
              </div>
              <div className={styles.skeletonImage} />
            </div>
          ) : null}

          {vehicle ? (
            <div className={styles.vehicleCard}>
              <div className={styles.vehicleHeader}>
                <div>
                  <p className={styles.label}>Make / Model</p>
                  <h2 className={styles.name}>{vehicleName}</h2>
                </div>
                <div className={styles.badge}>#{modelId}</div>
              </div>

              <div className={styles.detailGrid}>
                <div>
                  <p className={styles.label}>Make ID</p>
                  <p className={styles.value}>{makeId}</p>
                </div>
                <div>
                  <p className={styles.label}>Model</p>
                  <p className={styles.value}>{modelName}</p>
                </div>
                <div>
                  <p className={styles.label}>Year</p>
                  <p className={styles.value}>{modelYear}</p>
                </div>
                <div>
                  <p className={styles.label}>Vehicle type</p>
                  <p className={styles.value}>{vehicleType}</p>
                </div>
                <div>
                  <p className={styles.label}>Category</p>
                  <p className={styles.value}>{categoryLabel}</p>
                </div>
                <div>
                  <p className={styles.label}>Source</p>
                  <p className={styles.value}>NHTSA VPIC</p>
                </div>
              </div>

            </div>
          ) : null}

          {!vehicle && !loading && !error ? (
            <p className={styles.empty}>Tap the button to see your first pull.</p>
          ) : null}

          <div className={styles.history}>
            <p className={styles.historyLabel}>Recent pulls</p>
            <div className={styles.historyRow}>
              {history.length
                ? history.map((entry) => (
                    <div
                      key={`${entry.id}-${entry.name}`}
                      className={styles.historyChip}
                    >
                      <span className={styles.historyId}>{entry.id}</span>
                      <span className={styles.historyName}>{entry.name}</span>
                      <span className={styles.historyYear}>{entry.year}</span>
                      <span className={styles.historyType}>{entry.type}</span>
                    </div>
                  ))
                : "No history yet."}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
