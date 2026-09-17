<div align="center">

# 🔐 Financial Vault & Capital Allocator

**Your entire financial picture — accounts, budget, net worth, and estate plan — in one offline-first app that never phones home.**

[![PWA](https://img.shields.io/badge/PWA-installable-10b981?style=flat-square)](#-install-it-as-an-app)
[![Local Storage Only](https://img.shields.io/badge/data-100%25%20local-10b981?style=flat-square)](#-your-data-never-leaves-your-device)
[![No Backend](https://img.shields.io/badge/backend-none-10b981?style=flat-square)](#-your-data-never-leaves-your-device)
[![License](https://img.shields.io/badge/license-MIT-10b981?style=flat-square)](#-license)

</div>

---

Most budgeting apps want your bank credentials, your email, and a subscription. **Financial Vault** wants none of that. It's a single self-contained web app — no server, no sign-up, no sync — that turns your statements into a living net worth tracker, a real monthly budget, and a plan someone else could actually follow if they had to step in for you.

Drop it on GitHub Pages, install it to your phone's home screen, and it just works — online or off.

## ✨ What it does

**📊 Asset & Liability Vault**
Drag in a statement — PDF, CSV, or even a photo — and it's read, classified, and logged automatically: institution, account type, balance, APR, and the statement's actual "as-of" date. Every uploaded document is stored and viewable later, not thrown away after parsing. Accounts flag themselves when their statement goes stale, so you always know what's current and what needs a refresh.

**💸 Budget & Expenses**
Recurring bills with real due dates, auto-categorization as you type, and a running view of what's due in the next two weeks. When a statement reveals a recurring charge — a subscription, a utility auto-draft, a separate loan payment — it's surfaced for you to confirm and drop straight into the budget, instead of getting buried in the account balance.

**📈 Strategic Capital Allocation**
A deterministic, always-on read of your numbers: which debts are bleeding you dry on APR, how much idle cash is sitting in low-yield accounts, and what to do about both — no AI required for this part, just math on your own data.

**🧠 Wealth Strategy Report**
On-demand, AI-generated analysis (via your own Groq API key) that reviews your full financial snapshot — balances, spending by category, cashflow, net worth trend — and comes back with a plain-language assessment: strengths, risks, and a prioritized list of strategies to consider. Export it to PDF or print it whenever you want a second opinion.

**🛟 Continuity Plan**
The feature every budgeting app skips: a place for key contacts (attorney, CPA, advisor), per-account notes, and executor instructions — plus a readiness checklist that tells you honestly whether someone could pick this up tomorrow without you. One click compiles all of it into a settlement-ready PDF.

**📉 Net Worth, Tracked Automatically**
Every time you open the vault, it snapshots your net worth. Watch the trend line move without doing anything extra.

## 🔒 Your data never leaves your device

There is no backend. No account. No cloud sync. Every account, document, expense, contact, and note lives in your browser's IndexedDB and localStorage — full stop. Statement text is only ever sent anywhere if *you* add a Groq API key for AI-assisted parsing, and even then it's a direct call from your browser to Groq, not through any server of ours, because there isn't one.

That also means: **back it up yourself.** Settings → Export Complete Backup writes a single `.json` file with everything in it. Clearing your browser data or losing the device without a backup means losing the vault. This is the trade-off for true privacy — treat the export like you'd treat a password manager's backup.

## 🤖 AI parsing, entirely optional

Add a [Groq](https://console.groq.com) API key in Settings and statement uploads get real LLM-powered extraction — better classification, recurring-charge detection, and the Wealth Strategy report. No key? The app falls back to rule-based parsing for statements and the Strategic Allocation tab keeps working exactly the same. Groq's available models change over time, so Settings includes a **Fetch Models** button that asks *your* account what it actually has access to, rather than the app guessing and breaking.

## 📲 Install it as an app

This is a full Progressive Web App:

- **Desktop (Chrome/Edge):** visit the site → click the install icon in the address bar, or use the in-app **Install App** button.
- **iOS Safari:** Share → *Add to Home Screen*.
- **Android Chrome:** tap the **Install App** button, or Menu → *Install app*.

Once installed it opens in its own window, gets its own icon, and — thanks to a service worker that caches the app shell — keeps working with no internet connection. Your data was always local anyway.

## 🛠 Tech stack

| Layer | Choice |
|---|---|
| UI | React 18 (via CDN, in-browser Babel — no build step) |
| Styling | Tailwind CSS |
| Storage | IndexedDB (accounts, documents, expenses, contacts, net worth history) + localStorage (settings) |
| Statement parsing | pdf.js + PapaParse, with optional Groq LLM extraction |
| PDF export | jsPDF |
| Icons | Lucide |
| Hosting | Static — GitHub Pages or any static host |

No npm install, no build pipeline, no framework version drift to manage. Open `index.html` and it runs.

## 🚀 Getting started

```bash
git clone <this-repo>
cd financial-vault-pwa
# Just open index.html in a browser — that's it.
```

**To deploy on GitHub Pages:** push the `financial-vault-pwa/` folder (keeping `index.html`, `manifest.json`, `sw.js`, and `icons/` together at the same level) to a repo and enable Pages on that branch. The manifest and service worker use relative paths, so it works whether it's served from the repo root or a subpath.

**To add AI parsing:** open the app → Settings → paste a [Groq API key](https://console.groq.com/keys) → Fetch Models → pick a text model (and a vision model, if you want photo/image statement parsing).

## ⚠️ Disclaimer

This tool is for personal record-keeping and organization. The Wealth Strategy report and Strategic Allocation suggestions are generated from the numbers you enter — they are not financial, legal, or tax advice, and nothing here should be treated as a substitute for a licensed professional. Statement parsing (AI or rule-based) can make mistakes; always verify extracted figures before relying on them.

## 📄 License

MIT — do what you want with it.

