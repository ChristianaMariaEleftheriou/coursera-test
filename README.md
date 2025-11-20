# InspireMe Daily

A soft-toned, elegant inspiration planner that highlights a quote of the day, calendar-aligned notifications, inspiring people lists, and diary/portfolio capture.

## Running locally

1. Ensure Python is available (preinstalled on most systems).
2. From the repo root, run:

   ```bash
   ./run.sh
   ```

   The site will be served at `http://localhost:8000`. Set a different port by exporting `PORT`, e.g. `PORT=8080 ./run.sh`.

### Viewing the app

Once `./run.sh` is running, open a browser to the printed URL (defaults to `http://localhost:8000`).

- The home page immediately shows the **quote of the day** along with quick links to the calendar, inspiring people, and diary/portfolio tools.
- Your data is stored locally in your browser via `localStorage`; no backend is required.

If you prefer not to start a server, you can also double-click `index.html` to open it directly in a browser, though some browsers limit local file access and will give the best experience when served via `./run.sh`.
