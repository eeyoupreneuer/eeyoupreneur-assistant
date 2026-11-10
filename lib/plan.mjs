// How the plan writer drafts business and expansion plans, one section at a time.
// Each section is a separate request so every request finishes well inside Netlify's time limit.
// Edit the text here to change what each section covers.

export const PLAN_GUIDE = `# Writing a business plan section
You are now drafting one section of a business plan for an entrepreneur in Eeyou Istchee. The plan will be read by funders such as the CNG Department of Commerce and Industry (CEAF), community Economic Development Officers and funds, Eeyou Economic Group, Apatisiiwin Skills Development, SOCCA and banks. The entrepreneur will take it home, edit it and use it to apply for funding.

## Quality rules
- Write the real section, ready to paste into a plan. Professional and clear, but plain language a first-time owner can explain in their own words. Write in first person plural ("we", "our business") or the business name.
- Use the entrepreneur's answers and the conversation excerpt. Build on them. Don't contradict them.
- Use the resource library: the population and demographics figures for the market, the local business directory for real competitors, suppliers and partners, and program rules for funding. Name the source in brackets after a figure, e.g. (CBHSSJB Annual Report 2025–26).
- When information is missing, write a sensible draft and mark what the owner must confirm or fill in with square brackets, e.g. [confirm monthly rent with the band office] or [insert supplier quote]. Never invent names of people, quotes from suppliers, registration numbers, signed agreements or past results.
- Numbers: give realistic estimates for a small business in a remote Cree community (higher freight, travel and building costs, seasonal activity, small local market). Label estimates clearly and state key assumptions. Keep every number consistent with the sections already written; reuse their figures rather than inventing new ones. Totals must add up.
- Funding: build a realistic funding mix from the programs in the library and respect their rules (for example CEAF up to 25% of project cost to a maximum of $150,000; owner equity of at least 10%, more for some funds; community fund limits; EEG loan up to 40%). Say that eligibility and amounts must be confirmed with each program.
- Use markdown: the given headings, short paragraphs, bullet lists where useful, and tables for numbers (markdown tables with a header row). No horizontal rules, no emojis.
- Output only the section itself, starting with its main heading exactly as given. No greeting, no questions to the user, no notes about what you did.
- Respect length: about 350–700 words unless the section says otherwise. Tables count. Be complete but tight.`;

const EXPANSION_NOTE = `This is an EXPANSION plan for an existing business. Throughout, describe the business as it is today (history, current customers, current performance as given), then the expansion project: what is being added, why now, what it costs, and what it will change (new revenue, jobs, services). Funders want proof the current business is stable and the expansion is viable.`;

// Order of writing. The executive summary is written last but shown first.
export const SECTIONS = [
  {
    id: "description",
    order: 2,
    heading: "2.0 Business Description",
    brief: `Cover:
## 2.1 Legal Structure & Legal Matters — recommended structure (sole proprietorship, partnership or corporation) and why, ownership %, Cree beneficiary ownership, NEQ registration with the Registraire des entreprises du Québec, business bank account, local business permit, Band Council Resolution and land/lease or premises approval, insurance, and any licences for this type of business. Keep tax advice general and suggest an accountant.
## 2.2 Mission, Vision and Values — short, specific to this business and community; values may reflect Cree values.
## 2.3 Products and Services — what is sold, to whom, key features; a short table if there are several products.
## 2.4 Business Goals — 3–5 measurable goals for year 1 and year 3.`,
    expansionBrief: `Start 2.0 with a short "Current business" paragraph (years operating, what it does, current customers and performance as given), then "The expansion project". Then 2.1–2.4 as above, with goals for the expansion.`,
  },
  {
    id: "market",
    order: 3,
    heading: "3.0 Market & Industry",
    search: 2,
    brief: `Cover:
## 3.1 Local Market — the community's population from the library (and the regional total), the young population, and what that means for demand. Mention nearby communities or visitors (workers, mining or Hydro-Québec projects, tourists) only if relevant. You may use web search for one or two current industry facts; keep them short and relevant.
## 3.2 Competition & SWOT — name real local businesses from the directory that compete or offer substitutes (if none, say so and name the nearest alternatives, such as driving to another town or ordering online). Then a SWOT table (Strengths, Weaknesses, Opportunities, Threats).
## 3.3 Target Market — 2–4 customer segments with who they are, what they need and how many there might be (estimate).`,
    expansionBrief: `Focus on demand for the expansion: evidence from current customers, gaps in the local market, and competition for the new offering.`,
  },
  {
    id: "marketing",
    order: 4,
    heading: "4.0 Sales & Marketing",
    brief: `Cover:
## 4.1 Pricing Strategy — a price table for main products/services with how prices were set (costs plus margin, compared to alternatives including the cost of travelling out of the community).
## 4.2 Marketing Strategy — practical channels that work in Cree communities: community Facebook groups and pages, local radio, word of mouth, posters at the store and band office, community events and gatherings, Cree-language messages, partnerships with local organizations, the Cree Nation Business Registry. A simple launch plan.
## 4.3 Marketing Objectives — 3–5 measurable objectives with timelines.`,
    expansionBrief: `Explain how the expansion will be promoted to existing customers and new ones.`,
  },
  {
    id: "operations",
    order: 5,
    heading: "5.0 Operations & Management",
    brief: `Cover:
## 5.1 Management Team & Employees — owner's role and experience (as given), staff positions with hours and wages (estimates), training needs (mention Apatisiiwin Skills Development programs such as Job Creation or Competencies and Skills where they fit).
## 5.2 Facility Plan — location, premises, space, lease or land approval needed.
## 5.3 Inventory, Equipment and Supplies — table of equipment and initial inventory with estimated costs, including freight. These costs feed the start-up costs later.
## 5.4 Process / Production — how the work gets done day to day, suppliers and ordering (lead times, freight, winter road or seasonal limits if relevant), opening hours.
## 5.5 Risk Assessment — table of 4–6 risks with likelihood and how each is reduced.
## 5.6 Action Plan — timeline table of key steps to launch (registration, BCR, funding applications, purchasing, renovations, hiring, opening).`,
    expansionBrief: `Describe current operations briefly, then what changes for the expansion (new staff, space, equipment). Equipment table = expansion costs only.`,
  },
  {
    id: "finance-startup",
    order: 6.1,
    heading: "6.0 Financial Overview",
    brief: `Write the heading "6.0 Financial Overview", one short intro sentence saying all figures are estimates to be confirmed with quotes, then:
## 6.1 Start-up Costs, Funding & Break-even
- Start-up (or project) cost table by category: equipment (from 5.3), inventory, renovations or leasehold improvements, vehicles if any, professional fees (business plan, legal, accounting), marketing launch, working capital (about 3 months of fixed costs). Total.
- Funding sources table: owner equity (cash and in-kind), grants and loans by program from the library with the % of total each represents. Totals must equal the cost total. Respect program limits.
- Break-even: monthly fixed costs, average margin per sale, break-even sales per month, in a few lines.`,
    expansionBrief: `Use "Expansion Project Costs" for the cost table and show funding for the expansion only. If current revenue was given, mention it.`,
  },
  {
    id: "finance-forecast",
    order: 6.2,
    heading: "6.2 Sales Forecast",
    brief: `Write these three subsections, all as tables with 3 years (Year 1, Year 2, Year 3), consistent with pricing in 4.1, staff in 5.1 and costs in 6.1:
## 6.2 Sales Forecast — main products/services: units and revenue per year, with growth assumptions (seasonality noted).
## 6.3 Cost of Goods Sold & Operating Expenses — COGS and operating expenses (wages, rent, utilities, insurance, fuel/freight, marketing, accounting, loan interest, other).
## 6.4 Projected Income Statement — revenue, COGS, gross profit, expenses, net income before tax, for each year.
Keep commentary to 2–3 sentences per subsection. Use "6.2 Sales Forecast" as the first heading (level 2: ##).`,
    expansionBrief: `Show the business with the expansion. If current figures were given, include a "Current year" column.`,
  },
  {
    id: "finance-position",
    order: 6.5,
    heading: "6.5 Statement of Financial Position",
    brief: `Write these two subsections, consistent with 6.1–6.4:
## 6.5 Statement of Financial Position — opening balance sheet at launch: assets (cash, inventory, equipment, other), liabilities (loans), owner's equity (including grants as contributed capital or deferred contributions — keep simple and add a note to confirm treatment with an accountant). Assets = liabilities + equity.
## 6.6 Cash Flow — Year 1 by quarter (Q1–Q4): opening cash, cash in (sales, funding received, equity), cash out (start-up purchases, COGS, expenses, loan payments), closing cash. Note any quarter where cash runs low and how to handle it.
Use "6.5 Statement of Financial Position" as the first heading (level 2: ##).`,
  },
  {
    id: "funding",
    order: 7,
    heading: "7.0 Funding Plan & Next Steps",
    brief: `A practical checklist the entrepreneur can act on next week:
## 7.1 Where to Apply — table: program, organization, what it funds, amount requested (matching 6.1), contact from the library, deadline or intake if known (say to confirm). Order them in the sequence to approach them (usually community Economic Development Officer first, then regional programs).
## 7.2 Documents to Prepare — checklist: completed business plan, Band Council Resolution, NEQ, business bank account, proof of equity, supplier quotes, CV or résumé, permits and licences, lease or land approval, partnership agreement if any, financial statements for existing businesses.
## 7.3 Next Steps — 5–8 numbered steps for the next 30–60 days.
## 7.4 Appendices — list of documents to attach (registration documents, partnership agreement, CVs, licences and permits, letters of support and resolutions, quotes).
End with one line: Eeyoupreneur can help finalize this plan and the funding applications — sam@eeyoupreneur.ca · 819-895-4680.`,
  },
  {
    id: "summary",
    order: 1,
    heading: "1.0 Executive Summary",
    final: true,
    brief: `Write the executive summary LAST, from the sections already written (below). About 300–400 words:
- What the business is, where, who owns it, and the opportunity.
- Target market and what makes it different.
- Key financials in a small table: total project cost, owner equity, funding requested by source, Year 1 and Year 3 revenue, Year 1 net income, jobs created.
- One closing sentence on why it will succeed and benefit the community.
Use exactly the same figures as the sections below.`,
  },
];

export const SECTION_IDS = SECTIONS.map((s) => s.id);

const FIELD_LABELS = {
  planType: "Plan type",
  ownerName: "Owner name(s)",
  businessName: "Business name",
  community: "Community",
  idea: "The business idea / what the business does",
  current: "Current business (for expansions): years operating, customers, sales",
  expansion: "Expansion project",
  products: "Products and services",
  customers: "Customers",
  location: "Location / premises",
  experience: "Owner experience and training",
  team: "Team and employees",
  costs: "Costs and what needs to be bought",
  equity: "Money or assets the owner can put in",
  pricing: "Prices",
  competitors: "Competitors they know",
  timeline: "When they want to start",
  other: "Anything else",
};

export function buildPlanRequest({ sectionId, answers = {}, chat = "", written = [], note = "", lang = "en", partial = "" }) {
  const spec = SECTIONS.find((s) => s.id === sectionId);
  if (!spec) throw new Error("Unknown section");
  const isExpansion = answers.planType === "expansion";
  const facts = Object.entries(FIELD_LABELS)
    .filter(([k]) => typeof answers[k] === "string" && answers[k].trim())
    .map(([k, label]) => `- ${label}: ${k === "planType" ? (isExpansion ? "Expansion plan for an existing business" : "Business plan for a new business") : answers[k].trim().slice(0, 1500)}`)
    .join("\n");
  const prior = written
    .filter((w) => w && typeof w.text === "string" && w.text.trim() && w.id !== sectionId)
    .map((w) => w.text.trim())
    .join("\n\n");

  const parts = [
    `Draft this section of the plan.`,
    `Language: write the section in ${lang === "fr" ? "French" : "English"}.`,
    isExpansion ? EXPANSION_NOTE : "",
    `## The entrepreneur's answers\n${facts || "(none given — write a clearly marked template draft with [brackets])"}`,
    chat ? `## Excerpt from their chat with the assistant (may contain useful details)\n${chat}` : "",
    prior ? `## Sections already written (stay consistent with these figures and facts)\n${prior}` : "",
    `## Section to write now: ${spec.heading}\n${spec.brief}${isExpansion && spec.expansionBrief ? `\n\nFor this expansion plan: ${spec.expansionBrief}` : ""}`,
    note ? `## The entrepreneur asked for these changes to this section\n${note}` : "",
    partial
      ? `## This section was cut off while being written. Here is everything written so far:\n<<<\n${partial}\n>>>\nContinue writing from the exact point where it stops, as if you never stopped. Do not repeat any text already written and do not add a heading or introduction. If it stopped mid-word or mid-table-row, continue that word or row. Then finish the section.`
      : `Start your answer with the heading "# ${spec.heading}"${spec.id === "finance-forecast" || spec.id === "finance-position" ? " written as a level-2 heading (##) instead" : ""}.`,
  ];
  return { spec, prompt: parts.filter(Boolean).join("\n\n") };
}
