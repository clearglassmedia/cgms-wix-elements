/**
 * <cgms-services-morph>
 * A self-contained Web Component version of the scroll-morph services section.
 * Usage in Wix Studio:
 *   1. Add a "Custom Element" on your page.
 *   2. Point its "source" field at the URL where this JS file is hosted.
 *   3. Set the tag name to `cgms-services-morph`.
 *   4. Drop <cgms-services-morph></cgms-services-morph> into any HTML block.
 *
 * Customization: pass items via the `data-items` attribute (JSON array)
 * or by inserting <template> children. See cgms-test.html for examples.
 *
 * All styles are scoped to shadow DOM — zero collision with Wix's own CSS.
 */
(function () {
  const DEFAULT_ITEMS = [
    { n: '01', label: 'Strategy',  title: 'Strategic GTM Planning',   body: 'Before a single line of copy or code, we align on who you\'re for, what you do differently, and how you\'ll prove it.', bullets: ['Positioning & messaging workshops', 'ICP & buyer journey mapping', 'Launch plans with named owners', 'Quarterly reviews & re-forecasts'] },
    { n: '02', label: 'Build',     title: 'Website Design & Build',    body: 'Fast, accessible, search-friendly sites that your marketing team can actually update.', bullets: ['Design systems & component libraries', 'Webflow, Next.js, headless CMS', 'Core Web Vitals & SEO built-in', 'Launch support & analytics QA'] },
    { n: '03', label: 'Data',      title: 'BI Dashboards',              body: 'Looker, GA4, and CRM data stitched into a single source of truth — no more guessing.', bullets: ['Looker Studio & BigQuery setup', 'GA4 event modeling', 'CRM data pipelines', 'Exec-ready reporting cadence'] },
    { n: '04', label: 'Reach',     title: 'Paid Ads & Digital',         body: 'Performance campaigns with creative that doesn\'t look like a performance campaign.', bullets: ['Meta, LinkedIn, Google Ads', 'Creative iteration cycles', 'Full-funnel attribution', 'Monthly pacing & optimization'] },
    { n: '05', label: 'Voice',     title: 'Social Media Management',    body: 'Consistent publishing, community replies, and content that earns its place on the feed.', bullets: ['Monthly content calendars', 'Platform-native creative', 'Community management', 'Performance reporting'] },
    { n: '06', label: 'Ops',       title: 'CRM Integration',            body: 'HubSpot set up properly the first time, with automations that don\'t break on Monday.', bullets: ['HubSpot / Salesforce setup', 'Lifecycle automation', 'Lead scoring & routing', 'Sales enablement dashboards'] },
    { n: '07', label: 'Identity',  title: 'Brand & Identity',           body: 'Visual systems that age well. Logos, type, color, voice — the whole kit, documented.', bullets: ['Logo & mark design', 'Type & color systems', 'Voice & tone guides', 'Full brand books'] },
    { n: '08', label: 'Measure',   title: 'Analytics & Attribution',    body: 'Know what works, and why. Event-based analytics that actually inform decisions.', bullets: ['GA4 + server-side tracking', 'UTM governance', 'Conversion modeling', 'Weekly insight memos'] },
    { n: '09', label: 'Growth',    title: 'Digital Advertising Content',body: 'Video, static, and motion creative built for the platform — not adapted to it.', bullets: ['In-house video & motion', 'Landing page systems', 'A/B testing frameworks', 'Creative performance tagging'] }
  ];

  const TEMPLATE = `
    <style>
      :host {
        --accent: #0A4DFF;
        --ink: #1D1D1F;
        --ink-2: #3C3C43;
        --mute: #86868B;
        --bg: #F5F5F7;
        --line: rgba(0,0,0,.08);
        --radius: 24px;
        --font-display: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', system-ui, sans-serif;
        --font-body: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', system-ui, sans-serif;
        --font-mono: 'SF Mono', ui-monospace, 'JetBrains Mono', Menlo, monospace;
        display: block;
        color: var(--ink);
        font-family: var(--font-body);
      }
      * { box-sizing: border-box; }
      .morph {
        position: relative;
        height: 900vh;
      }
      .viewport {
        position: sticky;
        top: 0;
        height: 100vh;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--bg);
      }
      .stage {
        position: relative;
        width: 100%;
        max-width: 1200px;
        height: 100%;
        margin: 0 auto;
      }
      .panel {
        position: absolute;
        inset: 0;
        margin: auto;
        padding: 80px 48px;
        display: grid;
        grid-template-columns: 280px 1fr 1fr;
        gap: 60px;
        align-items: center;
        opacity: 0;
        transform: translateY(40px) scale(.98);
        transition: opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1);
        pointer-events: none;
      }
      .panel.is-active { opacity: 1; transform: none; pointer-events: auto; z-index: 2; }
      .panel.is-up     { opacity: 0; transform: translateY(-40px) scale(.98); }
      .panel.is-down   { opacity: 0; transform: translateY(40px) scale(.98); }

      .num-big {
        font-family: var(--font-display);
        font-size: 120px;
        font-weight: 600;
        line-height: 1;
        letter-spacing: -0.04em;
        color: var(--accent);
      }
      .num-label {
        font-family: var(--font-mono);
        font-size: 11px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: var(--mute);
        margin-top: 8px;
      }
      .panel h3 {
        font-family: var(--font-display);
        font-size: clamp(36px, 4vw, 56px);
        font-weight: 600;
        line-height: 1.02;
        letter-spacing: -0.03em;
        margin: 0 0 20px;
        color: var(--ink);
      }
      .panel p {
        font-size: 16px;
        line-height: 1.55;
        margin: 0 0 24px;
        color: var(--ink-2);
      }
      .panel ul {
        list-style: none;
        padding: 0;
        margin: 0;
        border-top: 1px solid var(--line);
      }
      .panel li {
        padding: 14px 0;
        border-bottom: 1px solid var(--line);
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
      }
      .panel li::after {
        content: '→';
        color: var(--accent);
        font-family: var(--font-display);
      }

      /* Progress rail (left) */
      .rail {
        position: absolute;
        top: 50%;
        left: 24px;
        transform: translateY(-50%);
        z-index: 5;
        display: flex;
        align-items: center;
        gap: 20px;
        font-family: var(--font-mono);
        font-size: 10px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
      }
      .rail ol {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      .rail li {
        display: flex;
        align-items: center;
        gap: 10px;
        opacity: .45;
        color: var(--mute);
        transition: color .4s, transform .4s, opacity .4s;
      }
      .rail li .n {
        font-variant-numeric: tabular-nums;
        width: 24px;
      }
      .rail li span.lbl {
        opacity: 0;
        transition: opacity .3s;
      }
      .rail li.is-active {
        color: var(--ink);
        opacity: 1;
        transform: translateX(4px);
      }
      .rail li.is-active .n { color: var(--accent); }
      .rail li.is-active .lbl { opacity: 1; }
      .bar {
        width: 2px;
        height: 360px;
        background: rgba(0,0,0,.08);
        border-radius: 2px;
        position: relative;
        overflow: hidden;
      }
      .fill {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 0;
        background: var(--accent);
        transition: height .3s ease;
      }

      /* Counter (top-right) */
      .counter {
        position: absolute;
        top: 32px;
        right: 32px;
        z-index: 5;
        display: flex;
        align-items: baseline;
        gap: 10px;
        font-family: var(--font-display);
      }
      .counter .cur {
        font-size: 80px;
        font-weight: 600;
        letter-spacing: -0.04em;
        line-height: 1;
        font-variant-numeric: tabular-nums;
        display: inline-block;
        transition: transform .5s cubic-bezier(.16,1,.3,1), opacity .3s;
        color: var(--ink);
      }
      .counter .cur.is-changing { opacity: 0; transform: translateY(20px); }
      .counter .total {
        font-family: var(--font-mono);
        font-size: 13px;
        color: var(--mute);
        letter-spacing: 0.12em;
      }

      @media (max-width: 960px) {
        .morph { height: auto; }
        .viewport { position: static; height: auto; display: block; }
        .stage { height: auto; }
        .panel {
          position: relative;
          inset: auto;
          opacity: 1;
          transform: none;
          pointer-events: auto;
          grid-template-columns: 1fr;
          gap: 32px;
          padding: 60px 24px;
          border-bottom: 1px solid var(--line);
        }
        .rail, .counter { display: none; }
      }

      @media (prefers-reduced-motion: reduce) {
        .panel { transition: none; }
        .counter .cur { transition: none; }
        .fill, .rail li { transition: none; }
      }
    </style>

    <section class="morph" part="root">
      <div class="viewport">
        <aside class="rail" aria-hidden="true">
          <ol></ol>
          <div class="bar"><div class="fill"></div></div>
        </aside>

        <div class="counter" aria-hidden="true">
          <span class="cur">01</span>
          <span class="total">/ 09</span>
        </div>

        <div class="stage"></div>
      </div>
    </section>
  `;

  class CgmsServicesMorph extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = TEMPLATE;
      this._onScroll = this._onScroll.bind(this);
      this._currentIdx = -1;
      this._lastIdx = 0;
    }

    connectedCallback() {
      this._items = this._resolveItems();
      this._render();
      this._attachListeners();
      this._onScroll();
    }

    disconnectedCallback() {
      window.removeEventListener('scroll', this._onScroll);
      window.removeEventListener('resize', this._onScroll);
    }

    static get observedAttributes() { return ['data-items', 'accent']; }
    attributeChangedCallback(name, oldV, newV) {
      if (!this.isConnected) return;
      if (name === 'accent' && newV) {
        this.shadowRoot.host.style.setProperty('--accent', newV);
      }
      if (name === 'data-items') {
        this._items = this._resolveItems();
        this._render();
        this._onScroll();
      }
    }

    _resolveItems() {
      // 1) Attribute JSON
      const raw = this.getAttribute('data-items');
      if (raw) {
        try { const v = JSON.parse(raw); if (Array.isArray(v) && v.length) return v; }
        catch (e) { console.warn('[cgms-services-morph] invalid data-items JSON; falling back', e); }
      }
      // 2) Child <template data-item> elements
      const tpls = [...this.querySelectorAll('template[data-item]')];
      if (tpls.length) {
        return tpls.map(t => {
          const d = t.dataset;
          const bullets = d.bullets ? d.bullets.split('|').map(s => s.trim()).filter(Boolean) : [];
          return { n: d.n || '', label: d.label || '', title: d.title || '', body: d.body || '', bullets };
        });
      }
      // 3) Default dataset
      return DEFAULT_ITEMS;
    }

    _render() {
      const stage = this.shadowRoot.querySelector('.stage');
      const railList = this.shadowRoot.querySelector('.rail ol');
      const total = this._items.length;

      stage.innerHTML = this._items.map((it, i) => `
        <article class="panel" data-idx="${i}">
          <div>
            <div class="num-big">${it.n}</div>
            <div class="num-label">${it.label}</div>
          </div>
          <div>
            <h3>${this._escape(it.title)}</h3>
            <p>${this._escape(it.body)}</p>
            ${it.bullets && it.bullets.length ? `<ul>${it.bullets.map(b => `<li>${this._escape(b)}</li>`).join('')}</ul>` : ''}
          </div>
          <div></div>
        </article>
      `).join('');

      railList.innerHTML = this._items.map(it => `
        <li><span class="n">${it.n}</span><span class="lbl">${this._escape(it.label)}</span></li>
      `).join('');

      this.shadowRoot.querySelector('.total').textContent = '/ ' + String(total).padStart(2, '0');
      // Set the host morph section height based on count
      this.shadowRoot.querySelector('.morph').style.height = (total * 100) + 'vh';
    }

    _attachListeners() {
      window.addEventListener('scroll', this._onScroll, { passive: true });
      window.addEventListener('resize', this._onScroll);
    }

    _onScroll() {
      if (window.matchMedia('(max-width: 960px)').matches) return;
      const morph = this.shadowRoot.querySelector('.morph');
      const rect = morph.getBoundingClientRect();
      const scrollable = morph.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const progress = Math.max(0, Math.min(1, -rect.top / scrollable));
      const total = this._items.length;
      let idx = Math.min(total - 1, Math.floor(progress * total));
      if (idx < 0) idx = 0;
      this._setActive(idx);
    }

    _setActive(idx) {
      if (idx === this._currentIdx) return;
      const panels = this.shadowRoot.querySelectorAll('.panel');
      const railItems = this.shadowRoot.querySelectorAll('.rail li');
      const cur = this.shadowRoot.querySelector('.counter .cur');
      const fill = this.shadowRoot.querySelector('.fill');
      const total = this._items.length;

      panels.forEach((p, i) => {
        p.classList.remove('is-active', 'is-up', 'is-down');
        if (i === idx) p.classList.add('is-active');
        else if (i < idx) p.classList.add('is-up');
        else p.classList.add('is-down');
      });
      railItems.forEach((li, i) => li.classList.toggle('is-active', i === idx));

      if (cur) {
        cur.classList.add('is-changing');
        setTimeout(() => {
          cur.textContent = String(idx + 1).padStart(2, '0');
          cur.classList.remove('is-changing');
        }, 150);
      }
      if (fill) fill.style.height = ((idx + 1) / total * 100) + '%';
      this._currentIdx = idx;
    }

    _escape(s) {
      return String(s == null ? '' : s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }
  }

  if (!customElements.get('cgms-services-morph')) {
    customElements.define('cgms-services-morph', CgmsServicesMorph);
  }
})();
