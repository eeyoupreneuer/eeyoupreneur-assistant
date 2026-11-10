// "My plan": guided business / expansion plan writer.
// Drafts the plan one section at a time via /api/plan, saves it in this browser,
// and exports it as a Word document or prints it (Save as PDF).
// Uses lang, history, md() and store from the main page script.

(function () {
  const PT = {
    en: {
      tabChat: "Chat", tabPlan: "My plan",
      startTitle: "Leave with a plan.",
      startIntro: "Answer a few questions and the assistant drafts a full plan for you, section by section, using Eeyou Istchee funding programs, community population figures and local businesses. You can download it as a Word document or PDF.",
      newPlan: "New business plan", newPlanSub: "Starting a business",
      expPlan: "Expansion plan", expPlanSub: "Growing a business you already run",
      formTitleNew: "Your new business", formTitleExp: "Your business and its expansion",
      formIntro: "Short answers are fine. Skip anything you don't know. The plan will mark it in [brackets] for you to fill in later.",
      useChat: "Use details from my chat conversation",
      privacy: "Your answers are used to write the plan and saved only in this browser. Don't include your SIN, status card or banking numbers.",
      write: "Write my plan", back: "Back", required: "Please fill in the questions marked *.",
      writingTime: "Writing takes about 4–6 minutes. Keep this page open.",
      progress: (i, n, name) => `Writing section ${i} of ${n}: ${name}`,
      searching: "Searching the web",
      done: "Your draft plan is ready. Review it, fill in the [brackets], and download it.",
      paused: "Writing paused.",
      cont: "Continue writing", stop: "Stop",
      word: "Download Word", pdf: "Print / Save as PDF", edit: "Edit answers", restart: "Start over",
      restartConfirm: "Start over? This deletes the plan saved in this browser.",
      rewrite: "Rewrite", rewriteHint: "What should change? (optional)", rewriteGo: "Rewrite section", cancel: "Cancel",
      retry: "Try again", pending: "Waiting…", failed: "This section didn't finish.", busy: "The assistant is busy. Trying again shortly…",
      stale: "Other sections changed. Rewrite the summary so the numbers match.",
      cut: "This section may be cut short. Try rewriting it.",
      framed: "To download files, open the assistant in its own page:",
      openFull: "Open full page",
      draftNote: "Draft prepared with the Eeyoupreneur Business Assistant. Review all figures and confirm program details before submitting.",
      planNew: "Business Plan", planExp: "Expansion Plan", preparedFor: "Prepared by",
      fields: {
        businessName: ["Business name (or working name)", "e.g. Northern Bites Food Truck"],
        ownerName: ["Owner name(s)", "Optional"],
        community: ["Community *", ""],
        idea: ["What will your business do? *", "e.g. A food truck selling bannock tacos and burgers in summer and at community events"],
        ideaExp: ["What does your business do today? *", "e.g. Small engine repair shop open since 2021"],
        current: ["How long have you operated? Roughly what are your yearly sales and number of employees?", "e.g. 4 years, about $120,000 a year, 2 employees"],
        expansion: ["What do you want to add or expand? *", "e.g. A second service bay and a snowmobile parts store"],
        products: ["Main products or services", "e.g. Tacos, burgers, catering for events"],
        customers: ["Who will buy from you?", "e.g. Families, workers, youth, organizations ordering catering"],
        location: ["Where will you operate?", "e.g. Mobile, parked near the arena; need a spot approved by the band"],
        experience: ["Your experience or training in this field", "e.g. 5 years cooking at the restaurant, food safety certificate"],
        team: ["Will you hire? How many people?", "e.g. 2 part-time in summer"],
        costs: ["What do you need to buy, and roughly how much will it cost?", "e.g. Used food truck about $60,000, equipment $15,000"],
        equity: ["How much money or assets can you put in?", "e.g. $8,000 in savings, plus my pickup truck"],
        timeline: ["When do you want to start?", "e.g. June 2027"],
        other: ["Anything else? (competitors, prices, partners)", ""],
      },
      otherCommunity: "Other / outside Eeyou Istchee",
      sections: { summary: "Executive Summary", description: "Business Description", market: "Market & Industry", marketing: "Sales & Marketing", operations: "Operations & Management", "finance-startup": "Start-up Costs & Funding", "finance-forecast": "Forecasts", "finance-position": "Financial Position & Cash Flow", funding: "Funding Plan & Next Steps" },
    },
    fr: {
      tabChat: "Discussion", tabPlan: "Mon plan",
      startTitle: "Repartez avec un plan.",
      startIntro: "Répondez à quelques questions et l'assistant rédige un plan complet, section par section, à partir des programmes de financement d'Eeyou Istchee, des données de population et des entreprises locales. Vous pourrez le télécharger en format Word ou PDF.",
      newPlan: "Plan d'affaires", newPlanSub: "Démarrer une entreprise",
      expPlan: "Plan d'expansion", expPlanSub: "Faire grandir votre entreprise",
      formTitleNew: "Votre nouvelle entreprise", formTitleExp: "Votre entreprise et son expansion",
      formIntro: "Des réponses courtes suffisent. Passez ce que vous ne savez pas : le plan l'indiquera entre [crochets] à compléter plus tard.",
      useChat: "Utiliser les détails de ma discussion",
      privacy: "Vos réponses servent à rédiger le plan et sont enregistrées seulement dans ce navigateur. N'indiquez pas votre NAS, carte de statut ou numéros bancaires.",
      write: "Rédiger mon plan", back: "Retour", required: "Veuillez répondre aux questions marquées d'un *.",
      writingTime: "La rédaction prend environ 4 à 6 minutes. Gardez cette page ouverte.",
      progress: (i, n, name) => `Rédaction de la section ${i} sur ${n} : ${name}`,
      searching: "Recherche sur le web",
      done: "Votre ébauche est prête. Relisez-la, complétez les [crochets] et téléchargez-la.",
      paused: "Rédaction en pause.",
      cont: "Continuer la rédaction", stop: "Arrêter",
      word: "Télécharger Word", pdf: "Imprimer / PDF", edit: "Modifier les réponses", restart: "Recommencer",
      restartConfirm: "Recommencer? Le plan enregistré dans ce navigateur sera supprimé.",
      rewrite: "Réécrire", rewriteHint: "Que faut-il changer? (facultatif)", rewriteGo: "Réécrire la section", cancel: "Annuler",
      retry: "Réessayer", pending: "En attente…", failed: "Cette section n'a pas été terminée.", busy: "L'assistant est occupé. Nouvel essai sous peu…",
      stale: "D'autres sections ont changé. Réécrivez le sommaire pour que les chiffres correspondent.",
      cut: "Cette section est peut-être incomplète. Essayez de la réécrire.",
      framed: "Pour télécharger, ouvrez l'assistant dans sa propre page :",
      openFull: "Ouvrir la page",
      draftNote: "Ébauche préparée avec l'Assistant d'affaires Eeyoupreneur. Vérifiez les chiffres et confirmez les programmes avant de soumettre.",
      planNew: "Plan d'affaires", planExp: "Plan d'expansion", preparedFor: "Préparé par",
      fields: {
        businessName: ["Nom de l'entreprise (ou nom provisoire)", "ex. Camion-restaurant Northern Bites"],
        ownerName: ["Nom du ou des propriétaires", "Facultatif"],
        community: ["Communauté *", ""],
        idea: ["Que fera votre entreprise? *", "ex. Un camion-restaurant qui vend des tacos à la bannique l'été et lors d'événements"],
        ideaExp: ["Que fait votre entreprise aujourd'hui? *", "ex. Atelier de réparation de petits moteurs depuis 2021"],
        current: ["Depuis combien de temps êtes-vous en activité? Ventes annuelles et employés environ?", "ex. 4 ans, environ 120 000 $ par année, 2 employés"],
        expansion: ["Que voulez-vous ajouter ou agrandir? *", "ex. Une deuxième baie de service et un magasin de pièces"],
        products: ["Principaux produits ou services", ""],
        customers: ["Qui achètera chez vous?", ""],
        location: ["Où exercerez-vous vos activités?", ""],
        experience: ["Votre expérience ou formation dans ce domaine", ""],
        team: ["Allez-vous embaucher? Combien de personnes?", ""],
        costs: ["Que devez-vous acheter, et à quel coût environ?", ""],
        equity: ["Combien d'argent ou de biens pouvez-vous investir?", ""],
        timeline: ["Quand voulez-vous commencer?", ""],
        other: ["Autre chose? (concurrents, prix, partenaires)", ""],
      },
      otherCommunity: "Autre / hors d'Eeyou Istchee",
      sections: { summary: "Sommaire", description: "Description de l'entreprise", market: "Marché et industrie", marketing: "Ventes et marketing", operations: "Opérations et gestion", "finance-startup": "Coûts de démarrage et financement", "finance-forecast": "Prévisions", "finance-position": "Situation financière et flux de trésorerie", funding: "Plan de financement et prochaines étapes" },
    },
  };
  const COMMUNITIES = ["Chisasibi", "Eastmain", "Mistissini", "Nemaska", "Oujé-Bougoumou", "Waskaganish", "Waswanipi", "Washaw Sibi", "Wemindji", "Whapmagoostui"];
  // Writing order. "summary" is written last but displayed first.
  const WRITE_ORDER = ["description", "market", "marketing", "operations", "finance-startup", "finance-forecast", "finance-position", "funding", "summary"];
  const DISPLAY_ORDER = ["summary", "description", "market", "marketing", "operations", "finance-startup", "finance-forecast", "finance-position", "funding"];
  const NEW_FIELDS = ["businessName", "ownerName", "community", "idea", "products", "customers", "location", "experience", "team", "costs", "equity", "timeline", "other"];
  const EXP_FIELDS = ["businessName", "ownerName", "community", "idea", "current", "expansion", "products", "customers", "location", "team", "costs", "equity", "timeline", "other"];
  const KEY = "eeyou_plan_v1";

  const pt = (k) => PT[lang]?.[k] ?? PT.en[k];
  const local = {
    get() { try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; } },
    set(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch {} },
    clear() { try { localStorage.removeItem(KEY); } catch {} },
  };

  let plan = local.get();       // { type, answers, useChat, chat, lang, sections: {id: {text, status, truncated}}, stale }
  let view = plan ? "doc" : "start";
  let running = false, abortCtl = null, stopRequested = false;
  let liveStatus = "";

  const root = document.getElementById("planView");
  const save = () => plan && local.set(plan);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function chatExcerpt() {
    const h = (typeof history !== "undefined" ? history : []).slice(-14);
    let s = h.map((m) => `${m.role === "user" ? "Entrepreneur" : "Assistant"}: ${m.content}`).join("\n\n");
    return s.length > 6000 ? s.slice(-6000) : s;
  }

  // ---------- Views ----------
  function render() {
    if (!root) return;
    if (view === "start") return renderStart();
    if (view === "form") return renderForm();
    return renderDoc();
  }

  function renderStart() {
    root.innerHTML = `
      <div class="column plan-start">
        <h1>${esc(pt("startTitle"))}</h1>
        <p class="lede">${esc(pt("startIntro"))}</p>
        <div class="choices">
          <button type="button" class="choice" data-type="new"><b>${esc(pt("newPlan"))}</b><span>${esc(pt("newPlanSub"))}</span></button>
          <button type="button" class="choice" data-type="expansion"><b>${esc(pt("expPlan"))}</b><span>${esc(pt("expPlanSub"))}</span></button>
        </div>
      </div>`;
    root.querySelectorAll(".choice").forEach((b) => b.onclick = () => {
      plan = { type: b.dataset.type, answers: { planType: b.dataset.type }, useChat: true, lang, sections: {} };
      view = "form"; render(); root.scrollTop = 0;
    });
  }

  function renderForm() {
    const isExp = plan.type === "expansion";
    const fields = isExp ? EXP_FIELDS : NEW_FIELDS;
    const F = pt("fields");
    const hasChat = typeof history !== "undefined" && history.length > 0;
    const input = (k) => {
      const key = k === "idea" && isExp ? "ideaExp" : k;
      const [label, ph] = F[key];
      const v = esc(plan.answers[k] || "");
      if (k === "community") {
        const opts = COMMUNITIES.concat([pt("otherCommunity")]).map((c) => `<option ${plan.answers.community === c ? "selected" : ""}>${esc(c)}</option>`).join("");
        return `<label class="field"><span>${esc(label)}</span><select name="community"><option value=""></option>${opts}</select></label>`;
      }
      const short = ["businessName", "ownerName", "timeline"].includes(k);
      return `<label class="field"><span>${esc(label)}</span>${short
        ? `<input name="${k}" value="${v}" placeholder="${esc(ph)}" maxlength="200">`
        : `<textarea name="${k}" rows="2" placeholder="${esc(ph)}" maxlength="1500">${v}</textarea>`}</label>`;
    };
    root.innerHTML = `
      <div class="column plan-form">
        <button type="button" class="link back">← ${esc(pt("back"))}</button>
        <h2>${esc(pt(isExp ? "formTitleExp" : "formTitleNew"))}</h2>
        <p class="lede">${esc(pt("formIntro"))}</p>
        <form novalidate>
          ${fields.map(input).join("")}
          ${hasChat ? `<label class="check"><input type="checkbox" name="useChat" ${plan.useChat !== false ? "checked" : ""}> ${esc(pt("useChat"))}</label>` : ""}
          <p class="small">${esc(pt("privacy"))}</p>
          <p class="error" hidden></p>
          <button type="submit" class="primary">${esc(pt("write"))}</button>
          <p class="small">${esc(pt("writingTime"))}</p>
        </form>
      </div>`;
    root.querySelector(".back").onclick = () => { view = Object.keys(plan.sections || {}).length ? "doc" : "start"; if (view === "start") plan = local.get(); render(); };
    const form = root.querySelector("form");
    form.querySelectorAll("textarea").forEach((t) => { const g = () => { t.style.height = "auto"; t.style.height = Math.min(t.scrollHeight, 220) + "px"; }; t.addEventListener("input", g); g(); });
    form.onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      for (const k of fields) plan.answers[k] = (fd.get(k) || "").toString().trim();
      plan.useChat = hasChat ? fd.get("useChat") === "on" : false;
      const need = ["community", "idea"].concat(isExp ? ["expansion"] : []);
      if (need.some((k) => !plan.answers[k])) {
        const err = form.querySelector(".error"); err.textContent = pt("required"); err.hidden = false; err.scrollIntoView({ block: "center" }); return;
      }
      plan.chat = plan.useChat ? chatExcerpt() : "";
      plan.lang = lang;
      plan.sections = {}; plan.stale = false;
      plan.createdAt = new Date().toISOString();
      save();
      view = "doc"; render(); root.scrollTop = 0;
      writeAll();
    };
  }

  function sectionHTML(id) {
    const s = plan.sections[id] || {};
    const name = pt("sections")[id];
    let inner = "";
    if (s.text) inner = md(s.text);
    if (s.status === "writing" && !s.text) inner = `<p class="thinking">${esc(name)}</p>`;
    if (!s.status || s.status === "pending") inner = `<p class="muted">${esc(name)} · ${esc(pt("pending"))}</p>`;
    let foot = "";
    if (s.status === "error") foot = `<p class="error">${esc(s.busy ? pt("busy") : pt("failed"))}</p><button type="button" class="tool" data-retry="${id}">${esc(pt("retry"))}</button>`;
    else if (s.status === "done" && !running) {
      const warn = s.truncated ? `<p class="warn">${esc(pt("cut"))}</p>` : (id === "summary" && plan.stale ? `<p class="warn">${esc(pt("stale"))}</p>` : "");
      foot = `${warn}<button type="button" class="tool" data-rewrite="${id}">${esc(pt("rewrite"))}</button>`;
    }
    return `<section class="doc-section ${s.status || "pending"}" id="sec-${id}"><div class="sec-body">${inner}</div><div class="sec-foot">${foot}</div></section>`;
  }

  function renderDoc() {
    const total = WRITE_ORDER.length;
    const doneCount = WRITE_ORDER.filter((id) => plan.sections[id]?.status === "done").length;
    const allDone = doneCount === total;
    const current = WRITE_ORDER.find((id) => plan.sections[id]?.status === "writing");
    const framed = (() => { try { return window.self !== window.top; } catch { return true; } })();
    const a = plan.answers || {};
    const title = a.businessName || pt("sections").description;
    let statusLine = "";
    if (running && current) statusLine = `<p class="status-line"><span class="dot"></span>${esc(pt("progress")(WRITE_ORDER.indexOf(current) + 1, total, pt("sections")[current]))}<span class="live">${liveStatus ? ` · ${esc(liveStatus)}` : ""}</span></p>`;
    else if (allDone) statusLine = `<p class="status-line ok">${esc(pt("done"))}</p>`;
    else if (!running) statusLine = `<p class="status-line">${esc(pt("paused"))}</p>`;

    root.innerHTML = `
      <div class="plan-bar">
        <div class="column bar-inner">
          <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${doneCount}"><i style="width:${(doneCount / total) * 100}%"></i></div>
          ${statusLine}
          <div class="bar-actions">
            ${running ? `<button type="button" class="tool" data-act="stop">${esc(pt("stop"))}</button>` : ""}
            ${!running && !allDone ? `<button type="button" class="primary small-btn" data-act="continue">${esc(pt("cont"))}</button>` : ""}
            ${doneCount && !running ? `<button type="button" class="primary small-btn" data-act="word">${esc(pt("word"))}</button><button type="button" class="tool" data-act="pdf">${esc(pt("pdf"))}</button>` : ""}
            ${!running ? `<button type="button" class="tool" data-act="edit">${esc(pt("edit"))}</button><button type="button" class="tool" data-act="restart">${esc(pt("restart"))}</button>` : ""}
          </div>
          ${framed && doneCount && !running ? `<p class="small">${esc(pt("framed"))} <a href="${esc(location.href.split("#")[0])}#plan" target="_blank" rel="noopener">${esc(pt("openFull"))}</a></p>` : ""}
        </div>
      </div>
      <article class="column doc">
        <div class="cover">
          <p class="kicker">${esc(plan.type === "expansion" ? pt("planExp") : pt("planNew"))}</p>
          <h1>${esc(title)}</h1>
          <p>${esc([a.community, a.ownerName ? `${pt("preparedFor")} ${a.ownerName}` : "", new Date(plan.createdAt || Date.now()).toLocaleDateString(plan.lang === "fr" ? "fr-CA" : "en-CA", { year: "numeric", month: "long", day: "numeric" })].filter(Boolean).join(" · "))}</p>
          <p class="small">${esc(pt("draftNote"))}</p>
        </div>
        ${DISPLAY_ORDER.map(sectionHTML).join("")}
      </article>`;

    root.querySelectorAll("[data-act]").forEach((b) => b.onclick = () => act(b.dataset.act));
    root.querySelectorAll("[data-retry]").forEach((b) => b.onclick = () => writeAll());
    root.querySelectorAll("[data-rewrite]").forEach((b) => b.onclick = () => openRewrite(b.dataset.rewrite));
  }

  function updateSection(id) {
    const el = document.getElementById(`sec-${id}`);
    if (!el) return renderDoc();
    el.outerHTML = sectionHTML(id);
  }
  function updateBar() {
    // Re-render the document view but keep the reader's scroll position.
    const y = root.scrollTop;
    renderDoc();
    root.scrollTop = y;
  }

  function openRewrite(id) {
    const foot = document.querySelector(`#sec-${id} .sec-foot`);
    foot.innerHTML = `<label class="field"><span>${esc(pt("rewriteHint"))}</span><textarea rows="2" maxlength="1000"></textarea></label>
      <button type="button" class="primary small-btn" data-go>${esc(pt("rewriteGo"))}</button>
      <button type="button" class="tool" data-cancel>${esc(pt("cancel"))}</button>`;
    foot.querySelector("textarea").focus();
    foot.querySelector("[data-cancel]").onclick = () => updateSection(id);
    foot.querySelector("[data-go]").onclick = async () => {
      const note = foot.querySelector("textarea").value.trim();
      if (id !== "summary" && plan.sections.summary?.status === "done") plan.stale = true;
      if (id === "summary") plan.stale = false;
      running = true; stopRequested = false; updateBar();
      await writeSection(id, note);
      running = false; save(); updateBar();
    };
  }

  async function act(a) {
    if (a === "stop") { stopRequested = true; abortCtl?.abort(); }
    else if (a === "continue") writeAll();
    else if (a === "edit") { view = "form"; render(); root.scrollTop = 0; }
    else if (a === "restart") { if (confirm(pt("restartConfirm"))) { local.clear(); plan = null; view = "start"; render(); } }
    else if (a === "word") downloadWord();
    else if (a === "pdf") window.print();
  }

  // ---------- Writing ----------
  async function writeAll() {
    if (running) return;
    running = true; stopRequested = false;
    updateBar();
    for (const id of WRITE_ORDER) {
      if (stopRequested) break;
      if (plan.sections[id]?.status === "done") continue;
      let ok = false;
      for (let attempt = 0; attempt < 3 && !ok && !stopRequested; attempt++) {
        ok = await writeSection(id);
        if (!ok && !stopRequested) await new Promise((r) => setTimeout(r, plan.sections[id]?.busy ? 15000 : 4000));
      }
      if (!ok) break;
    }
    running = false; liveStatus = "";
    save(); updateBar();
  }

  async function writeSection(id, note = "") {
    let partial = "";
    // If a section is cut off (time limit or length), ask the assistant to continue it, up to 3 times.
    for (let part = 0; part < 4; part++) {
      const r = await writePart(id, part === 0 ? note : "", partial);
      if (r.ok) return true;
      if (r.cut && r.text.trim() && part < 3 && !stopRequested) { partial = r.text; continue; }
      return false;
    }
    return false;
  }

  async function writePart(id, note, partial) {
    plan.sections[id] = { text: partial, status: "writing" };
    liveStatus = "";
    updateBar();
    document.getElementById(`sec-${id}`)?.scrollIntoView({ block: "start", behavior: "smooth" });
    abortCtl = new AbortController();
    const written = WRITE_ORDER.filter((k) => k !== id && plan.sections[k]?.status === "done").map((k) => ({ id: k, text: plan.sections[k].text }));
    let raw = "", textOut = "", done = false, truncated = false, busy = false, error = false;
    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ section: id, answers: plan.answers, chat: plan.chat || "", written, note, partial, lang: plan.lang || lang }),
        signal: abortCtl.signal,
      });
      if (!res.ok) { busy = res.status === 429; throw new Error("http " + res.status); }
      const reader = res.body.getReader(), dec = new TextDecoder();
      let last = 0;
      while (true) {
        const { value, done: end } = await reader.read();
        if (end) break;
        raw += dec.decode(value, { stream: true });
        const parts = raw.split("\x1e");
        if (parts.length % 2 === 0) parts.pop();
        textOut = parts.filter((p, i) => {
          if (i % 2 === 0) return true;
          try {
            const st = JSON.parse(p);
            if (st.done) { done = true; truncated = !!st.truncated; }
            if (st.error) { error = true; busy = !!st.busy; }
            if ("searching" in st) liveStatus = st.searching ? pt("searching") : "";
          } catch {}
          return false;
        }).join("");
        const full = joinParts(partial, textOut);
        plan.sections[id].text = full;
        const now = Date.now();
        if (now - last > 120) { last = now; const b = document.querySelector(`#sec-${id} .sec-body`); if (b) b.innerHTML = full ? md(full) : `<p class="thinking">${esc(pt("sections")[id])}</p>`; const lv = root.querySelector(".status-line .live"); if (lv) lv.textContent = liveStatus ? ` · ${liveStatus}` : ""; }
      }
    } catch (err) {
      if (err.name === "AbortError") error = true;
      else error = true;
    }
    const full = joinParts(partial, textOut);
    const ok = done && !error && !truncated && full.trim().length > 0;
    // Cut off = the stream ended without finishing (time limit) or hit the length limit.
    const cut = !ok && !busy && !stopRequested && (truncated || (!done && !error)) && full.trim().length > 0;
    plan.sections[id] = ok ? { text: full.trim(), status: "done" } : { text: full, status: cut ? "writing" : "error", busy };
    save();
    if (!cut) updateSection(id);
    return { ok, cut, text: full };
  }

  // Stitch a continuation onto the cut-off text without doubling spaces or losing them.
  function joinParts(a, b) {
    if (!a) return b;
    if (!b) return a;
    const needsSpace = /[\w.,;:!?)]$/.test(a) && /^[A-Za-zÀ-ÿ(]/.test(b) && !/\w$/.test(a) ;
    return a + (needsSpace ? " " : "") + b;
  }

  // ---------- Word export ----------
  function loadDocx() {
    if (window.docx) return Promise.resolve(window.docx);
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "vendor/docx.min.js";
      s.onload = () => resolve(window.docx);
      s.onerror = reject;
      document.head.append(s);
    });
  }
  const decode = (s) => String(s || "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#x27;/g, "'");

  async function downloadWord() {
    let D;
    try { D = await loadDocx(); } catch { alert("Couldn't load the Word export. Try Print / Save as PDF instead."); return; }
    const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, ShadingType, AlignmentType, Footer, PageNumber, ExternalHyperlink, PageBreak } = D;
    const SPRUCE = "1F3B33";

    const runs = (tokens, style = {}) => {
      const out = [];
      for (const t of tokens || []) {
        if (t.type === "strong") out.push(...runs(t.tokens, { ...style, bold: true }));
        else if (t.type === "em") out.push(...runs(t.tokens, { ...style, italics: true }));
        else if (t.type === "del") out.push(...runs(t.tokens, { ...style, strike: true }));
        else if (t.type === "codespan") out.push(new TextRun({ text: decode(t.text), font: "Consolas", ...style }));
        else if (t.type === "br") out.push(new TextRun({ text: "", break: 1 }));
        else if (t.type === "link") out.push(new ExternalHyperlink({ link: t.href, children: [new TextRun({ text: decode(t.text), style: "Hyperlink", ...style })] }));
        else if (t.tokens && t.tokens.length) out.push(...runs(t.tokens, style));
        else out.push(new TextRun({ text: decode(t.text ?? t.raw ?? ""), ...style }));
      }
      return out;
    };
    const blocks = (tokens, level = 0) => {
      const out = [];
      for (const t of tokens) {
        if (t.type === "heading") {
          const H = [HeadingLevel.HEADING_1, HeadingLevel.HEADING_1, HeadingLevel.HEADING_2, HeadingLevel.HEADING_3, HeadingLevel.HEADING_4][Math.min(t.depth, 4)];
          out.push(new Paragraph({ heading: H, children: runs(t.tokens), spacing: { before: t.depth <= 1 ? 360 : 240, after: 120 } }));
        } else if (t.type === "paragraph") {
          out.push(new Paragraph({ children: runs(t.tokens), spacing: { after: 120 } }));
        } else if (t.type === "list") {
          t.items.forEach((it, i) => {
            const inline = it.tokens.filter((x) => x.type !== "list");
            const prefix = it.task ? (it.checked ? "☑ " : "☐ ") : t.ordered ? `${(Number(t.start) || 1) + i}. ` : "";
            const children = [];
            inline.forEach((x, j) => { if (j) children.push(new TextRun({ text: " " })); children.push(...runs(x.tokens || [{ type: "text", text: x.text }])); });
            if (t.ordered || it.task) out.push(new Paragraph({ indent: { left: 360 + level * 360, hanging: 360 }, children: [new TextRun(prefix), ...children], spacing: { after: 60 } }));
            else out.push(new Paragraph({ bullet: { level }, children, spacing: { after: 60 } }));
            it.tokens.filter((x) => x.type === "list").forEach((sub) => out.push(...blocks([sub], level + 1)));
          });
        } else if (t.type === "table") {
          const cell = (c, header) => new TableCell({
            children: [new Paragraph({ children: runs(c.tokens, header ? { bold: true, color: header ? "FFFFFF" : undefined } : {}) })],
            shading: header ? { type: ShadingType.CLEAR, color: "auto", fill: SPRUCE } : undefined,
            margins: { top: 60, bottom: 60, left: 100, right: 100 },
          });
          out.push(new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [new TableRow({ tableHeader: true, children: t.header.map((c) => cell(c, true)) }), ...t.rows.map((r) => new TableRow({ children: r.map((c) => cell(c, false)) }))],
          }));
          out.push(new Paragraph({ text: "", spacing: { after: 120 } }));
        } else if (t.type === "blockquote") {
          out.push(...blocks(t.tokens, level).map((p) => p));
        } else if (t.type === "code") {
          out.push(new Paragraph({ children: [new TextRun({ text: t.text, font: "Consolas" })] }));
        }
      }
      return out;
    };

    const a = plan.answers || {};
    const title = a.businessName || pt("sections").description;
    const date = new Date(plan.createdAt || Date.now()).toLocaleDateString(plan.lang === "fr" ? "fr-CA" : "en-CA", { year: "numeric", month: "long", day: "numeric" });
    const cover = [
      new Paragraph({ text: "", spacing: { before: 2400 } }),
      new Paragraph({ children: [new TextRun({ text: (plan.type === "expansion" ? pt("planExp") : pt("planNew")).toUpperCase(), color: "B97A1E", bold: true, size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: title, bold: true, size: 64, color: SPRUCE })], spacing: { after: 240 } }),
      new Paragraph({ children: [new TextRun({ text: [a.community, a.ownerName ? `${pt("preparedFor")} ${a.ownerName}` : ""].filter(Boolean).join(" · "), size: 28 })] }),
      new Paragraph({ children: [new TextRun({ text: date, size: 24, color: "5A6660" })], spacing: { after: 600 } }),
      new Paragraph({ children: [new TextRun({ text: pt("draftNote"), italics: true, size: 20, color: "5A6660" })] }),
      new Paragraph({ children: [new PageBreak()] }),
    ];
    const body = [];
    DISPLAY_ORDER.forEach((id) => {
      const s = plan.sections[id];
      if (s?.status === "done" && s.text) body.push(...blocks(marked.lexer(s.text)));
    });

    const doc = new Document({
      creator: "Eeyoupreneur Business Assistant",
      title: `${title} — ${plan.type === "expansion" ? pt("planExp") : pt("planNew")}`,
      styles: {
        default: { document: { run: { font: "Calibri", size: 22 } } },
        paragraphStyles: [
          { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 32, bold: true, color: SPRUCE } },
          { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 26, bold: true, color: SPRUCE } },
          { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 23, bold: true } },
        ],
      },
      sections: [{
        properties: { page: { margin: { top: 1200, bottom: 1200, left: 1200, right: 1200 } } },
        footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${title} · `, size: 16, color: "5A6660" }), new TextRun({ children: [PageNumber.CURRENT], size: 16, color: "5A6660" })] })] }) },
        children: [...cover, ...body],
      }],
    });
    const blob = await Packer.toBlob(doc);
    const name = `${(title || "Plan").replace(/[\\/:*?"<>|]+/g, "").slice(0, 60)} - ${plan.type === "expansion" ? pt("planExp") : pt("planNew")}.docx`;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = name;
    document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  // ---------- Tabs ----------
  function setTab(tab) {
    document.body.dataset.tab = tab;
    document.querySelectorAll("nav.tabs [data-tab]").forEach((b) => b.setAttribute("aria-selected", b.dataset.tab === tab));
    if (tab === "plan") render();
    try { sessionStorage.setItem("tab", JSON.stringify(tab)); } catch {}
  }
  document.querySelectorAll("nav.tabs [data-tab]").forEach((b) => b.onclick = () => setTab(b.dataset.tab));

  window.onPlanLang = () => {
    document.querySelectorAll("nav.tabs [data-tab]").forEach((b) => (b.textContent = pt(b.dataset.tab === "plan" ? "tabPlan" : "tabChat")));
    if (document.body.dataset.tab === "plan") render();
  };
  window.onPlanLang();
  let startTab = "chat";
  try { startTab = location.hash === "#plan" ? "plan" : JSON.parse(sessionStorage.getItem("tab")) || "chat"; } catch {}
  setTab(startTab);
  // A section was mid-write when the page closed: mark it for retry.
  // Sections cut short by an earlier version are rewritten when the person clicks Continue writing.
  if (plan) { for (const id of WRITE_ORDER) { const s = plan.sections[id]; if (s?.status === "writing" || (s?.status === "done" && s.truncated)) s.status = "error"; } save(); }
})();
