"use client";

import { useState } from "react";
import styles from "./page.module.css";

const buildApiPath = () => "/api/vehicle";

export default function Home() {
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchVehicle = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(buildApiPath(), { cache: "no-store" });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = payload?.error || `Request failed (${response.status})`;
        throw new Error(message);
      }

      setVehicle(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const makeName = vehicle?.Make_Name || "Unknown";
  const makeId = vehicle?.Make_ID ?? "N/A";
  const isRateLimited = error.includes("429");

  return (
    <div className={styles.page}>
      <main className={styles.card}>
        <header className={styles.header}>
          <p className={styles.kicker}>VehiclePull</p>
          <h1>One button. One random vehicle make.</h1>
          <p className={styles.subtitle}>
            One-button random vehicle pulls from the Rails Vehicle API backed by NHTSA.
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
              {loading ? "Fetching..." : "Fetch a vehicle"}
            </button>
          </div>
          <p className={styles.hint}>Persist disabled. One random NHTSA make.</p>
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
                  <p className={styles.label}>Make</p>
                  <h2 className={styles.name}>{makeName}</h2>
                </div>
                <div className={styles.badge}>#{makeId}</div>
              </div>

              <div className={styles.detailGrid}>
                <div>
                  <p className={styles.label}>Make ID</p>
                  <p className={styles.value}>{makeId}</p>
                </div>
                <div>
                  <p className={styles.label}>Source</p>
                  <p className={styles.value}>NHTSA VPIC</p>
                </div>
              </div>

              <div className={styles.plate}>
                <span className={styles.plateLabel}>Vehicle Make</span>
                <span className={styles.plateValue}>{makeName}</span>
              </div>
            </div>
          ) : null}

          {!vehicle && !loading && !error ? (
            <p className={styles.empty}>Tap the button to see your first pull.</p>
          ) : null}
        </section>
      </main>
    </div>
  );
}
