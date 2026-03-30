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
  const [error, setError] = useState("");

  const categoryOptions = useMemo(
    () => [
      { key: "all", label: "All" },
      { key: "passenger", label: "Passenger" },
      { key: "mpv", label: "MPV/SUV" },
      { key: "truck", label: "Trucks" },
      { key: "bus", label: "Buses" },
      { key: "two_wheel", label: "Motorcycles" },
      { key: "low_speed", label: "Low speed" },
    ],
    []
  );

  const hintText =
    category === "all"
      ? "Category: All road vehicles (trailers excluded)."
      : `Category: ${categoryOptions.find((option) => option.key === category)?.label || "Custom"}.`;

  const fetchVehicle = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(buildApiPath({ category }), { cache: "no-store" });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = payload?.error || `Request failed (${response.status})`;
        throw new Error(message);
      }

      setVehicle(payload);
      const entry = {
        id: payload?.model_id ?? payload?.model_name ?? "N/A",
        name: payload?.name || "Unknown",
        type: payload?.vehicle_type || "N/A",
      };
      setHistory((prev) => {
        const filtered = prev.filter((item) => item.id !== entry.id);
        return [entry, ...filtered].slice(0, 3);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const makeName = vehicle?.make_name || "Unknown";
  const modelName = vehicle?.model_name || "Unknown";
  const vehicleName = vehicle?.name || `${makeName} ${modelName}`.trim();
  const makeId = vehicle?.make_id ?? "N/A";
  const modelId = vehicle?.model_id ?? "N/A";
  const vehicleType = vehicle?.vehicle_type || "N/A";
  const categoryLabel =
    categoryOptions.find((option) => option.key === (vehicle?.category || category))
      ?.label || "N/A";
  const isRateLimited = error.includes("429");

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
            <div className={styles.categoryRow}>
              {categoryOptions.map((option) => (
                <button
                  key={option.key}
                  className={
                    category === option.key
                      ? `${styles.toggle} ${styles.toggleActive}`
                      : styles.toggle
                  }
                  type="button"
                  aria-pressed={category === option.key}
                  onClick={() => setCategory(option.key)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <p className={styles.hint}>{hintText}</p>
        </section>

        <section className={styles.results}>
          {error ? (
            <div className={styles.errorCard}>
              <p className={styles.errorTitle}>Couldn’t reach the API.</p>
              <p className={styles.error}>{error}</p>
              {isRateLimited ? (
                <p className={styles.errorHint}>
                  Rate limit hit. Wait a minute and try again.
                </p>
              ) : null}
              <button
                type="button"
                className={styles.retry}
                onClick={fetchVehicle}
                disabled={loading}
              >
                Retry
              </button>
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
                  <p className={styles.label}>Model</p>
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
                  <p className={styles.label}>Type</p>
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

              <div className={styles.plate}>
                <span className={styles.plateLabel}>Vehicle Model</span>
                <span className={styles.plateValue}>{vehicleName}</span>
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
