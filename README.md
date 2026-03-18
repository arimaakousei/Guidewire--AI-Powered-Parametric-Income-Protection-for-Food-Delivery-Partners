# 🛵 GigShield — AI-Powered Parametric Income Protection for Food Delivery Partners

> **Guidewire DEVTrails 2026 | University Hackathon**  
> *Seed. Scale. Soar.*

---

## 📌 Table of Contents

1. [Problem Context & Persona](#1-problem-context--persona)
2. [Persona-Based Scenarios & Application Workflow](#2-persona-based-scenarios--application-workflow)
3. [Weekly Premium Model & Parametric Triggers](#3-weekly-premium-model--parametric-triggers)
4. [Platform Justification: Web vs Mobile](#4-platform-justification-web-vs-mobile)
5. [AI/ML Integration Plan](#5-aiml-integration-plan)
6. [Tech Stack & Development Plan](#6-tech-stack--development-plan)
7. [Fraud Detection Architecture](#7-fraud-detection-architecture)
8. [Business Viability](#8-business-viability)

---

## 1. Problem Context & Persona

### Chosen Delivery Segment: 🍔 Food Delivery (Zomato / Swiggy)

**Why Food Delivery?**

Food delivery partners are the most exposed segment to income disruption because:
- They operate outdoors during all weather conditions, including peak rain seasons
- Their income is hyper-sensitive to city-level events (curfews, pollution alerts, stadium events blocking zones)
- They operate in highly localized micro-zones, making hyper-local parametric triggers feasible
- Average food delivery partner earns ₹15,000–₹25,000/month, making even a 2–3 day disruption painful

### Primary Persona: **Ravi, 28, Swiggy Delivery Partner, Bengaluru**

| Attribute | Detail |
|---|---|
| Daily Avg. Earnings | ₹700–₹900 |
| Active Hours | 10 AM – 10 PM |
| Zone | HSR Layout / Koramangala |
| Device | Android Smartphone, 4G |
| Bank Account | Jan Dhan / SBI Basic |
| Insurance Awareness | Low — no existing income protection |
| Pain Points | Heavy monsoon rains, sudden bandhs, AQI spike days |

---

## 2. Persona-Based Scenarios & Application Workflow

### Scenario A — Monsoon Disruption (Environmental)

> *It's July. Bengaluru receives 80mm of rainfall in 4 hours. Red alert issued. Swiggy suspends operations in HSR Layout for 6 hours. Ravi cannot work.*

**Without GigShield:** Ravi loses ₹400–₹500 with no recourse.  
**With GigShield:** GigShield's weather API detects the red alert. A parametric claim is auto-initiated. Within 2 hours, ₹350 is credited to Ravi's UPI ID. Zero paperwork.

---

### Scenario B — Unplanned Bandh / Curfew (Social Disruption)

> *A sudden city-wide bandh is declared. All movement halted for 8 hours. Ravi's delivery zone is inaccessible.*

**Without GigShield:** Full loss of a workday.  
**With GigShield:** Civic alert APIs detect the bandh notification. Auto-trigger fires. Ravi receives a proportional payout for lost working hours.

---

### Scenario C — Severe Air Quality Alert (Environmental)

> *AQI in Delhi NCR crosses 400. Government advisory restricts outdoor movement. Orders drop 60%.*

**With GigShield:** AQI API monitors PM2.5 levels. When AQI crosses the policy threshold (350+), a partial income protection payout is triggered automatically.

---

### Application Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                     GIGSHIELD PLATFORM                          │
│                                                                 │
│  [ONBOARDING]                                                   │
│  Worker Registration → KYC Lite (Aadhaar/PAN) →               │
│  Platform Verification (Swiggy/Zomato ID) →                    │
│  Risk Profiling (Zone, Avg. Hours, Earnings) →                 │
│  Weekly Policy Selection & UPI Linking                         │
│                                                                 │
│  [ACTIVE COVERAGE]                                              │
│  Real-time Monitoring ← Weather API / AQI API / Civic Alerts   │
│        ↓                                                        │
│  Disruption Detected → Threshold Crossed?                      │
│        ↓ YES                                                    │
│  Fraud Check (GPS, Activity, Historical Cross-check)           │
│        ↓ PASS                                                   │
│  Auto Claim Initiated → Payout Calculated →                    │
│  UPI/Bank Transfer → Worker Notified via SMS + App             │
│                                                                 │
│  [ANALYTICS]                                                    │
│  Worker Dashboard: Weekly coverage, payouts received           │
│  Insurer Dashboard: Loss ratios, risk heatmaps, claim trends   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Weekly Premium Model & Parametric Triggers

### Why Weekly?

Gig workers receive platform payouts weekly (Swiggy pays every Tuesday; Zomato every Friday). A weekly insurance cycle aligns with their cash flow — they can renew from their weekly earnings without needing to maintain a monthly budget buffer.

### Premium Tiers (Weekly)

| Plan | Weekly Premium | Daily Coverage Cap | Best For |
|---|---|---|---|
| **Kavach Basic** | ₹29/week | ₹300/disruption day | New partners, low-risk zones |
| **Kavach Plus** | ₹49/week | ₹500/disruption day | Mid-tier earners, monsoon zones |
| **Kavach Pro** | ₹79/week | ₹800/disruption day | High earners, high-risk city zones |

### Dynamic Premium Adjustment (AI-Driven)

The base weekly premium is adjusted each week using an ML model considering:
- **Zone Risk Score** (historical disruption frequency of the worker's operating zone)
- **Seasonal Risk Multiplier** (monsoon season = higher premium; winter = lower)
- **Worker Tenure Discount** (loyal workers with no fraudulent claims get up to 15% discount)
- **Platform Activity Score** (workers with higher weekly order completion get loyalty pricing)

**Example:**  
Ravi, Koramangala zone, monsoon week → Base ₹49 + Zone multiplier 1.1 + Seasonal 1.15 = **₹62/week**  
After 3 months tenure discount (10%) → **₹56/week**

---

### Parametric Triggers

Triggers are objective, data-driven, and require **zero manual claim filing** by the worker.

| # | Trigger | Data Source | Threshold | Coverage Activation |
|---|---|---|---|---|
| T1 | Heavy Rainfall | OpenWeatherMap API | > 50mm/6 hours OR Red Alert | Full disruption day payout |
| T2 | Extreme Heat | OpenWeatherMap API | > 43°C sustained 4+ hours | 50% payout (partial disruption) |
| T3 | Severe Air Quality | CPCB AQI API / OpenAQ | AQI > 350 (Hazardous) | 50% payout |
| T4 | Unplanned Curfew / Bandh | Government alert APIs / News NLP | Confirmed zone-level bandh | Full disruption day payout |
| T5 | Platform Outage | Swiggy/Zomato mock API | App downtime > 3 hours | 40% payout |

> **Note:** Triggers are cross-validated. A rainfall trigger requires weather API data AND a corroborating drop in platform order volume in that zone (via platform API mock) to prevent fraudulent claims during isolated light rain events.

---

## 4. Platform Justification: Web vs Mobile

### Decision: **Progressive Web App (PWA) — Mobile-First**

**Rationale:**

| Factor | Reasoning |
|---|---|
| Device Reality | 95%+ of delivery partners use Android smartphones; no laptops |
| Connectivity | PWA works offline and on low bandwidth (2G/3G fallback) |
| No App Store Friction | Instant access via a URL link — no Play Store downloads needed |
| Cost of Reach | Can be distributed via WhatsApp link or QR code on Swiggy/Zomato partner centers |
| Native Feel | PWA delivers push notifications for payout alerts, just like a native app |

The insurer/admin dashboard is a **full web application** (desktop-first) for policy management, analytics, and fraud review.

---

## 5. AI/ML Integration Plan

### Module 1: Dynamic Premium Calculator

**Approach:** Gradient Boosted Tree (XGBoost) trained on:
- Historical weather disruption events by city zone
- Historical claim payout data (simulated dataset for Phase 1)
- Worker profile features: tenure, zone, platform, avg. weekly earnings

**Output:** A risk score (0–1) per worker per week → mapped to weekly premium adjustment

**Phase 1 Status:** Rule-based mock with configurable weights. ML model training begins in Phase 2 with synthetic dataset.

---

### Module 2: Fraud Detection Engine

**Approach:** Anomaly detection using Isolation Forest + Rule-based guardrails

**Features used for fraud scoring:**
- GPS location at time of claim vs. disruption zone boundary
- Platform activity logs (did order requests stop? did the worker go offline?)
- Claim frequency vs. historical baseline (is this worker claiming every disruption?)
- Cross-worker claim clustering (mass simultaneous claims from same apartment GPS = suspicious)

**Fraud Score Thresholds:**
- Score < 0.3 → Auto-approve claim and process payout
- Score 0.3–0.6 → Flag for soft review (auto-approve with logging)
- Score > 0.6 → Hold claim for manual insurer review

---

### Module 3: Disruption Prediction (Phase 2 / 3)

**Approach:** Time-series forecasting (Prophet / LSTM) to predict high-risk weeks and:
- Pre-notify workers to renew coverage before a high-risk week
- Adjust insurer reserve requirements based on predicted claim volume

---

## 6. Tech Stack & Development Plan

### Tech Stack

| Layer | Technology |
|---|---|
| Frontend (Worker PWA) | React.js + Tailwind CSS (PWA-enabled) |
| Frontend (Insurer Dashboard) | React.js + Recharts / Chart.js |
| Backend API | Node.js + Express (or Python FastAPI) |
| Database | PostgreSQL (policy, claims, workers) + Redis (real-time trigger cache) |
| ML/AI | Python (scikit-learn, XGBoost, Isolation Forest) |
| Trigger Monitoring | Node.js cron jobs + Webhook listeners |
| External APIs | OpenWeatherMap (free tier), OpenAQ, mock Zomato/Swiggy API |
| Payment (Mock) | Razorpay test mode / UPI simulator |
| Hosting | Render / Railway (free tier for hackathon) |
| Auth | JWT + OTP-based login (mobile number) |

---

### Development Plan

#### Phase 1 (March 4–20): Ideation & Foundation
- [x] Problem research & persona definition
- [x] Weekly premium model design
- [x] Parametric trigger definition
- [x] Tech stack finalized
- [ ] Git repository setup with README
- [ ] UI/UX wireframes for worker PWA
- [ ] Basic project scaffolding (frontend + backend boilerplate)
- [ ] Mock data setup (worker profiles, disruption events, claim scenarios)

#### Phase 2 (March 21–April 4): Automation & Protection
- [ ] Worker registration & KYC flow
- [ ] Policy creation + weekly premium calculation (rule-based → ML)
- [ ] 3–5 automated parametric trigger integrations
- [ ] Zero-touch claims management flow
- [ ] Basic fraud detection (rule-based guardrails)
- [ ] Demo: simulate a rainstorm and show auto-payout

#### Phase 3 (April 5–17): Scale & Optimise
- [ ] Advanced ML fraud detection (Isolation Forest)
- [ ] Mock payment gateway integration (Razorpay test mode)
- [ ] Intelligent dashboards (worker + insurer)
- [ ] Disruption prediction module
- [ ] Performance optimizations + final QA
- [ ] 5-minute demo video
- [ ] Final pitch deck (PDF)

---

## 7. Fraud Detection Architecture

```
Claim Trigger Received
        │
        ▼
┌─────────────────────┐
│  Rule-Based Layer   │  ← Fast, deterministic checks
│  - Zone boundary    │
│  - Time window      │
│  - Duplicate check  │
└────────┬────────────┘
         │ Pass
         ▼
┌─────────────────────┐
│  ML Anomaly Layer   │  ← Isolation Forest scoring
│  - GPS vs zone      │
│  - Activity pattern │
│  - Claim history    │
└────────┬────────────┘
         │
    ┌────┴──────┐
    ▼           ▼
Auto-Approve   Flag/Hold
  + Payout     for Review
```

**Key Anti-Fraud Mechanisms:**
- **GPS Spoofing Detection:** Cross-check claimed location with cell tower data consistency
- **Order Activity Correlation:** Claims only valid if platform order data shows delivery halt in same time window
- **Historical Clustering:** Flag workers who claim on every single trigger event (statistically unlikely)
- **Duplicate Prevention:** One claim per disruption event per worker; idempotency keys on all payout requests

---

## 8. Business Viability

### Unit Economics (per worker, per week)

| Metric | Value |
|---|---|
| Avg. Weekly Premium Collected | ₹49 |
| Expected Claim Payout (weekly avg.) | ₹22 (based on ~4 disruption days/month) |
| Operating Cost (tech, API, processing) | ₹8 |
| Net Margin per Worker per Week | ~₹19 (39% margin) |

### Addressable Market

- ~5 million active food delivery partners in India (Zomato + Swiggy combined, 2024)
- Even 1% adoption = 50,000 workers × ₹49/week = **₹2.45 crore/week** in premium volume

### Distribution Strategy

- **Zero CAC model:** Partner directly with Zomato/Swiggy to offer GigShield as an opt-in at onboarding
- Platform takes a small referral fee; GigShield gains instant access to verified, active workers
- UPI auto-debit from weekly platform payout (worker never has to manually renew)

---
---

## 9. 🛡️ Adversarial Defense & Anti-Spoofing Strategy

### 🚨 Market Crash Threat Scenario

In a coordinated fraud attempt, delivery workers may use advanced GPS-spoofing tools to fake their presence inside disruption zones (e.g., heavy rainfall red-alert regions) while remaining inactive or indoors.  
Such mass false claims can rapidly drain the insurer’s liquidity pool.

GigShield is designed with a **multi-layer adversarial defense architecture** that goes beyond basic GPS verification and focuses on behavioral intelligence, environmental validation, and platform activity correlation.

---

### ✅ Differentiating Genuine Stranded Workers vs GPS Spoofers

GigShield uses **AI-driven behavioral validation** to distinguish real disruption impact from fraudulent spoofed claims.

**Key detection logic includes:**

- **Movement Pattern Intelligence**
  - Genuine workers show realistic delivery patterns (stop-start routes, varying speeds, pickup dwell time).
  - Spoofers often exhibit:
    - perfectly linear or static movement
    - unrealistic teleportation between zones
    - long stationary coordinates during claimed working hours.

- **Order Flow Correlation**
  - Claims are validated against platform dispatch logs.
  - If orders are still being assigned in the zone but the worker is inactive or rejecting requests, fraud probability increases.

- **Disruption Severity Cross-Validation**
  - Claims are triggered only when:
    - Weather / civic APIs confirm disruption  
    - AND platform order volume drops significantly in the same micro-zone.

- **Zone Entry Timing Analysis**
  - Workers who suddenly appear in a disruption zone shortly before trigger activation are flagged for anomaly scoring.

---

### 📊 Additional Data Signals Used Beyond GPS

To detect coordinated fraud rings, GigShield evaluates multiple device, behavioral, and environmental signals:

- Accelerometer & gyroscope motion verification  
- Cell-tower triangulation consistency vs reported GPS coordinates  
- Device fingerprinting (IMEI hash / device model behavior patterns)  
- Historical delivery heatmaps & route familiarity  
- Battery usage patterns (navigation activity vs idle spoofing)  
- Cluster detection of simultaneous claims from identical residential coordinates  
- Claim synchronization patterns indicating external coordination (e.g., Telegram fraud rings)

An **Isolation Forest anomaly detection model** continuously learns worker behavior baselines and dynamically updates fraud risk scores.

---

### ⚖️ Fair UX Handling for Flagged Claims

GigShield ensures fraud mitigation **without unfairly penalizing honest delivery partners.**

- Medium-risk claims move to **“Pending Verification”** instead of instant rejection  
- Workers receive simple in-app prompts for optional proof (recent order screenshot / connectivity issue confirmation)  
- **Provisional payouts (e.g., 30%)** may be released to reduce financial stress  
- A **Worker Trust Score** reduces friction for long-tenure partners with clean claim history  
- Manual insurer review is triggered only for high-risk coordinated fraud clusters  

This balanced workflow protects platform liquidity while maintaining worker trust and adoption.

---

## 🔗 Repository & Submission Links

- **GitHub Repository:** [GigShield — AI-Powered Parametric Income Protection](https://github.com/arimaakousei/Guidewire--AI-Powered-Parametric-Income-Protection-for-Food-Delivery-Partners.git)
- **2-Minute Demo Video:** (https://drive.google.com/file/d/1zPklg9xs5HAAzpNt1SBJzIKHkzmHH7Hd/view?usp=drive_link)
---

*Built for Guidewire DEVTrails 2026 | © Team GigShield*
