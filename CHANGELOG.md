# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.7] - 2026-03-30
### Changed
- Swapped category buttons for a dropdown so the UI keeps a single action button.
- Removed the secondary retry button in favor of the primary action button.

## [0.0.6] - 2026-03-30
### Changed
- Added random model year to the vehicle detail panel.

## [0.0.5] - 2026-03-30
### Changed
- Updated the make/model label to match the other apps’ detail layout.

## [0.0.4] - 2026-03-30
### Changed
- Added recent pulls (last 3) to match the other apps.

## [0.0.3] - 2026-03-30
### Changed
- Added category filters to focus random pulls on common vehicle groups.

## [0.0.2] - 2026-03-30
### Changed
- Updated the UI copy and fields to display random vehicle models (make + model).

## [0.0.1] - 2026-03-30
### Added
- Initial VehiclePull Next.js app with a single-button random vehicle make pull.
- `/api/vehicle` proxy route to the Rails Vehicle API with `persist=false`.
- Clean loading and error states with a themed UI.

MAJOR: Incremented for incompatible API changes.
MINOR: Incremented for adding functionality in a backwards-compatible manner.
PATCH: Incremented for backwards-compatible bug fixes.

major.minor.patch
