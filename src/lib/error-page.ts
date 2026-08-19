export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Server Error — SiteReadyPro</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
    <style>
      :root {
        --cream: #fbf7ee;
        --ink: #1f1e1c;
        --clay: #cb6b51;
        --card: rgba(255, 255, 255, 0.7);
        --border: rgba(31, 30, 28, 0.12);
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        padding: 1.5rem;
        background-color: #f7f3ea;
        color: var(--ink);
        font-family: 'Inter', -apple-system, sans-serif;
        display: grid;
        place-items: center;
        min-height: 100vh;
      }
      .card {
        max-width: 32rem;
        width: 100%;
        text-align: center;
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 1.75rem;
        padding: 2.5rem 2rem;
        box-shadow: 0 20px 40px -15px rgba(31, 30, 28, 0.1);
        backdrop-filter: blur(12px);
      }
      .badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: #dc2626;
        background: rgba(220, 38, 38, 0.1);
        border: 1px solid rgba(220, 38, 38, 0.2);
        padding: 0.35rem 0.85rem;
        border-radius: 9999px;
      }
      h1 {
        font-family: 'Fraunces', Georgia, serif;
        font-size: 2.25rem;
        font-weight: 500;
        line-height: 1.05;
        margin: 1.25rem 0 0.75rem;
        letter-spacing: -0.02em;
      }
      h1 span {
        font-style: italic;
        color: var(--clay);
      }
      p {
        color: #6b7280;
        font-size: 0.95rem;
        line-height: 1.6;
        margin: 0 0 2rem;
      }
      .actions {
        display: flex;
        gap: 0.75rem;
        justify-content: center;
        flex-wrap: wrap;
      }
      a, button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.75rem 1.5rem;
        border-radius: 9999px;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        text-decoration: none;
        transition: all 0.2s ease;
      }
      .primary {
        background: var(--clay);
        color: #fff;
        border: none;
        box-shadow: 0 6px 20px -5px rgba(203, 107, 81, 0.4);
      }
      .primary:hover { opacity: 0.92; transform: translateY(-1px); }
      .secondary {
        background: transparent;
        color: var(--ink);
        border: 1px solid var(--border);
      }
      .secondary:hover {
        background: var(--ink);
        color: var(--cream);
      }
      .footer-note {
        margin-top: 2rem;
        padding-top: 1.25rem;
        border-top: 1px solid var(--border);
        font-size: 0.75rem;
        color: #9ca3af;
      }
      .footer-note a {
        color: var(--clay);
        text-decoration: underline;
        padding: 0;
        display: inline;
        font-size: inherit;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="badge">Error 500 · Server Interruption</div>
      <h1>Something went <span>off script</span>.</h1>
      <p>An unexpected server error occurred while processing this request. Our system logs have recorded this incident.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Reload Page</button>
        <a class="secondary" href="/">Return Home</a>
      </div>
      <div class="footer-note">
        Need assistance? Contact <a href="mailto:sitereadypro@gmail.com">sitereadypro@gmail.com</a>
      </div>
    </div>
  </body>
</html>`;
}
