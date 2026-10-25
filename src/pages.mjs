import { SITE, page, shot, frame, enquiryForm, esc } from './site.mjs';

const arrow = '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const faqHtml = (items, id = 'faq') =>
  `<div class="faq" id="${id}">${items.map(([q, a]) => `<details><summary>${esc(q)}</summary><div class="ans"><p>${a}</p></div></details>`).join('')}</div>`;

const ENTITLEMENT = 'Modules are switched on per organization, so what you see depends on the setup agreed with your administrator.';

/* ------------------------------------------------------------------ */
const HOME_FAQ = [
  ['What is OrgVia?', 'OrgVia is a web-based, multi-tenant HRMS (human resource management system). It keeps employee records, the organization chart, attendance, leave, payroll workflows, recruitment, onboarding and performance in one workspace, with access set by role.'],
  ['Who is OrgVia for?', 'HR teams and administrators at organizations that want their people records and HR workflows in one place, and the managers and employees who work with them. A demo is the quickest way to judge whether the fit is right for your team size and process.'],
  ['Which HR workflows does OrgVia support?', `Employee records and documents, organization chart, attendance and clock-in, leave policies and approvals, payroll configuration and payslips, recruitment, onboarding, performance reviews, compliance tracking and support tickets. ${ENTITLEMENT}`],
  ['How do I request a demo?', 'Use the <a class="link" href="/demo/">demo request form</a> with your organization, team size and what you want to see. The request goes to the OrgVia team, who reply to the work email you provide.'],
  ['What does OrgVia cost?', 'Pricing is agreed with each organization rather than listed publicly. See <a class="link" href="/pricing/">Pricing</a> for how that conversation works.'],
];

function home() {
  const body = `
<section class="hero"><div class="hero-grid">
  <div class="hero-copy">
    <p class="kicker">HRMS for growing organizations</p>
    <h1 class="display">Your people, <em>in order.</em></h1>
    <p class="lede">OrgVia brings employee records, the org chart, attendance, leave and payroll workflows into one workspace, and gives each person the access their role calls for.</p>
    <div class="actions"><a class="btn" href="/demo/">Book a demo ${arrow}</a><a class="btn btn-line" href="/product/">Explore OrgVia</a></div>
    <p class="hero-note">Real product screens below, shown with demonstration data.</p>
  </div>
  <div class="hero-shot">
    ${frame(shot('directory', 'OrgVia people directory listing employees with role, department, reporting manager, status and join date', { eager: true, sizes: '(min-width: 1060px) 58vw, 100vw' }), 'orgvia / people')}
    <div class="hero-chip" aria-hidden="true"><img src="/assets/img/mobile.webp" alt="" width="780" height="800" loading="lazy"></div>
  </div>
</div>
<div class="wrap"><div class="facts" data-reveal>
  <div><b>Role-based access</b>Employee, Manager, Recruiter, HR and Administrator roles</div>
  <div><b>Multi-tenant</b>Each organization works in its own separated workspace</div>
  <div><b>Org chart built in</b>Reporting lines live next to the people they describe</div>
  <div><b>Bring your data</b>Add employees one by one or import them from CSV</div>
</div></div></section>

<section class="section tour" id="tour"><div class="wrap">
  <div class="section-head"><div><p class="kicker" data-reveal>The product</p><h2 class="title" data-reveal style="--d:.05s">See the work <em>itself</em>, not an illustration.</h2></div>
  <p class="lede" data-reveal style="--d:.1s">These are screens from the OrgVia web app. Pick a view to look at it properly.</p></div>
  <div class="tour-grid" data-tabs data-reveal>
    <div class="tabs" role="tablist" aria-label="Product views">
      <button class="tab" role="tab" id="t1" aria-controls="p1"><b data-n="01">People directory</b><span>Search and filter by department, role and status. Open any profile from the list.</span></button>
      <button class="tab" role="tab" id="t2" aria-controls="p2"><b data-n="02">Org chart</b><span>Reporting lines drawn from the same records, so structure never lives in a separate slide.</span></button>
      <button class="tab" role="tab" id="t3" aria-controls="p3"><b data-n="03">Dashboard</b><span>Headcount, who is active or on leave, and one-tap clock-in for the signed-in employee.</span></button>
      <button class="tab" role="tab" id="t4" aria-controls="p4"><b data-n="04">CSV import</b><span>Bring an existing employee list in without retyping it.</span></button>
    </div>
    <div class="panels">
      <div class="panel" role="tabpanel" id="p1" aria-labelledby="t1">${frame(shot('directory', 'People directory with search, department, role and status filters', { sizes: '(min-width: 1060px) 62vw, 100vw' }), 'orgvia / people / directory')}<p class="caption">People directory: name, role, department, reporting manager, status and join date in one list.</p></div>
      <div class="panel" role="tabpanel" id="p2" aria-labelledby="t2">${frame(shot('orgchart', 'Organization chart showing reporting lines between employees', { sizes: '(min-width: 1060px) 62vw, 100vw' }), 'orgvia / people / org chart')}<p class="caption">Org chart generated from each employee’s reporting manager.</p></div>
      <div class="panel" role="tabpanel" id="p3" aria-labelledby="t3">${frame(shot('dashboard', 'Dashboard with total employees, active, on leave and new hires, plus a clock-in panel', { sizes: '(min-width: 1060px) 62vw, 100vw' }), 'orgvia / dashboard')}<p class="caption">Dashboard with headcount summary and a clock-in panel.</p></div>
      <div class="panel" role="tabpanel" id="p4" aria-labelledby="t4">${frame(shot('import', 'Import employees from CSV dialog', { sizes: '(min-width: 1060px) 62vw, 100vw' }), 'orgvia / people / import')}<p class="caption">CSV import for adding many employees at once.</p></div>
    </div>
  </div>
</div></section>

<section class="statement"><div class="wrap">
  <p class="big" data-reveal>HR work is mostly handoffs. <span>Someone joins, someone approves, someone pays.</span> <em>OrgVia keeps the record they all work from.</em></p>
  <div class="sub" data-reveal><p>When employee data sits in a spreadsheet, attendance in another tool and approvals in an inbox, every handoff costs a search. OrgVia puts the people record at the centre and builds the HR workflows around it.</p><p>Managers see their own teams. HR sees the organization. Administrators configure how the workspace is structured. The same data, shown to each person according to role.</p></div>
</div></section>

<section class="section" style="padding-top:0"><div class="wrap">
  <div class="section-head"><div><p class="kicker" data-reveal>What is inside</p><h2 class="title" data-reveal style="--d:.05s">Six areas of <em>people operations.</em></h2></div>
  <p class="lede" data-reveal style="--d:.1s">Start with the directory and add the workflows your organization needs.</p></div>
  <div class="index" data-reveal>
    <a class="row" href="/features/#people"><span class="n">01</span><h3>People &amp; organization</h3><p>Employee profiles, documents, departments, office locations and the org chart.</p><span class="go">See people features</span></a>
    <a class="row" href="/features/#attendance"><span class="n">02</span><h3>Attendance &amp; leave</h3><p>Clock-in, attendance history, leave policies, balances, requests and approvals.</p><span class="go">See time features</span></a>
    <a class="row" href="/features/#payroll"><span class="n">03</span><h3>Payroll workflows</h3><p>Salary setup, payroll configuration and runs, with payslips for employees.</p><span class="go">See payroll features</span></a>
    <a class="row" href="/features/#hiring"><span class="n">04</span><h3>Hiring &amp; onboarding</h3><p>Jobs, candidates and interviews, then onboarding tasks, mentors and welcome messages.</p><span class="go">See hiring features</span></a>
    <a class="row" href="/features/#performance"><span class="n">05</span><h3>Performance</h3><p>Goals, feedback, skills, development plans, review cycles and reviews.</p><span class="go">See performance features</span></a>
    <a class="row" href="/features/#administration"><span class="n">06</span><h3>Compliance &amp; administration</h3><p>Policies and acknowledgements, support tickets, roles and access.</p><span class="go">See admin features</span></a>
  </div>
  <p class="index-note">${ENTITLEMENT}</p>
</div></section>

<section class="section" style="padding-top:0"><div class="wrap">
  <p class="kicker" data-reveal>Connected workflows</p>
  <h2 class="title" data-reveal style="max-width:15em;margin-top:1rem">From first day to review, <em>one record carries through.</em></h2>
  <ol class="rail" style="list-style:none;padding:0">
    <li class="step"><h3>Onboard</h3><p>Create the employee, assign a reporting manager and track starter tasks.</p><small>Onboarding · People</small></li>
    <li class="step"><h3>Show up</h3><p>Clock in and out; attendance history stays attached to the employee.</p><small>Attendance</small></li>
    <li class="step"><h3>Take leave</h3><p>Apply against policy and balance. The manager approves.</p><small>Leave</small></li>
    <li class="step"><h3>Get paid</h3><p>Salary and payroll configuration feed payroll runs and payslips.</p><small>Payroll</small></li>
    <li class="step"><h3>Grow</h3><p>Goals, feedback and reviews sit with the same employee profile.</p><small>Performance</small></li>
  </ol>
</div></section>

<section class="section value"><div class="wrap value-grid">
  <div><p class="kicker">Why teams choose a single system</p><h2 class="title" style="margin-top:1rem">Fewer places to look. <em>Clearer</em> places to act.</h2></div>
  <div class="value-list">
    <div data-reveal><b>01</b><h3>One source for employee records</h3><p>Profile, employment details, reporting manager and documents stay together instead of scattering across files.</p></div>
    <div data-reveal><b>02</b><h3>Access that follows role</h3><p>Permissions are enforced by the backend by role and reporting line, not just hidden in the interface.</p></div>
    <div data-reveal><b>03</b><h3>Structure you can configure</h3><p>Administrators manage the company profile, departments and office locations themselves.</p></div>
    <div data-reveal><b>04</b><h3>Adopt it in stages</h3><p>Modules are enabled per organization, so a team can begin with people records and add workflows as they are ready.</p></div>
  </div>
</div></section>

<section class="section"><div class="wrap duo">
  <div><p class="kicker" data-reveal>For everyone else in the company</p><h2 class="title" data-reveal style="margin-top:1rem">Employees get a <em>simple</em> view of their own work.</h2>
  <p class="lede" data-reveal style="margin-top:1.2rem">Employees sign in to a lighter workspace built around their own day. The same app works on a phone browser.</p>
  <ul class="checks" data-reveal><li>Clock in and out from the dashboard</li><li>See time worked today and the last action</li><li>Responsive layout for small screens</li></ul></div>
  <div class="phone" data-reveal><img src="/assets/img/mobile.webp" alt="OrgVia employee dashboard on a phone showing a clock-in panel" width="780" height="800" loading="lazy" decoding="async"></div>
</div></section>

<section class="section" style="padding-top:0"><div class="wrap"><div class="band" data-reveal>
  <div><p class="kicker">Pricing</p><h2 class="title" style="margin-top:1rem">Find the right setup for your team.</h2><p class="lede">Pricing depends on team size and the modules you need, so we talk it through rather than guess in a table.</p></div>
  <div class="band-side"><a class="btn" href="/pricing/">How pricing works ${arrow}</a><p>Or <a class="link" href="/demo/">book a demo</a> and ask us directly.</p></div>
</div></div></section>

<section class="section" style="padding-top:0"><div class="wrap faq-grid">
  <div><p class="kicker">Questions</p><h2 class="title" style="margin-top:1rem">What teams ask <em>first.</em></h2><p class="lede" style="margin-top:1rem">More answers in the <a class="link" href="/help/">help centre</a>.</p></div>
  ${faqHtml(HOME_FAQ)}
</div></section>

<section class="cta"><div class="wrap">
  <h2>See your people data <em>laid out properly.</em></h2>
  <div class="cta-row"><p>Tell us your team size and what you need to run. We will show you the parts of OrgVia that matter for it.</p>
  <div class="actions"><a class="btn btn-light" href="/demo/">Book a demo ${arrow}</a><a class="btn btn-line" href="/contact/">Contact us</a></div></div>
</div></section>`;
  return page({ path: '/', title: 'OrgVia', description: 'OrgVia is a multi-tenant HRMS that brings employee records, org chart, attendance, leave and payroll workflows into one workspace. Book a demo.', body, home: true, faq: HOME_FAQ });
}

/* ------------------------------------------------------------------ */
function phero(h1, lede, crumbLabel) {
  return `<section class="phero"><div><nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span>${crumbLabel}</span></nav><h1>${h1}</h1></div><p class="lede">${lede}</p></section>`;
}
const closing = (h, p) => `<section class="cta"><div class="wrap"><h2>${h}</h2><div class="cta-row"><p>${p}</p><div class="actions"><a class="btn btn-light" href="/demo/">Book a demo ${arrow}</a><a class="btn btn-line" href="/contact/">Contact us</a></div></div></div></section>`;

function product() {
  const body = `${phero('One workspace for the <em>people side</em> of the business.', 'What OrgVia is, who uses it, and how the pieces fit together.', 'Product')}
<section class="section"><div class="wrap split">
  <div class="qa"><h2 class="title" style="font-size:clamp(1.8rem,1rem + 2vw,2.6rem)">What is OrgVia?</h2>
  <p style="margin-top:1rem">OrgVia is a web-based HRMS, or human resource management system. It is the place where an organization keeps its employee records and runs the recurring HR processes around them: attendance, leave, payroll, hiring, onboarding and performance.</p>
  <p>It is multi-tenant: every organization works in its own separated workspace, configured and administered by that organization.</p>
  <h3>What does HRMS software do?</h3>
  <p>An HRMS replaces the patchwork of spreadsheets, forms and email threads HR teams often rely on. It stores one record per employee, applies the organization’s rules to things like leave and payroll, and lets the right people approve, review or report from the same data.</p>
  <h3>How does OrgVia help an HR department?</h3>
  <ul><li>Employee profiles, employment details and documents are kept in one place.</li><li>The org chart is generated from reporting lines, so it does not need separate upkeep.</li><li>Leave requests flow to the approving manager with the policy and balance attached.</li><li>HR can see the whole organization while managers see their own teams.</li></ul></div>
  <div class="aside-box"><h2>Who uses it</h2><ul>
    <li><b>Employees</b>: clock in, view their own profile, apply for leave, see payslips.</li>
    <li><b>Managers</b>: see their team and approve requests within their reporting line.</li>
    <li><b>Recruiters</b>: work jobs, candidates and interviews.</li>
    <li><b>HR</b>: administer people, leave, payroll and performance.</li>
    <li><b>Administrators</b>: configure the organization and access.</li></ul>
    <p class="notice" style="margin-top:1.4rem">${ENTITLEMENT}</p></div>
</div></section>
<section class="section" style="padding-top:0"><div class="wrap">${frame(shot('orgchart', 'Org chart view in OrgVia', { sizes: '(min-width: 1240px) 1100px, 100vw' }), 'orgvia / people / org chart')}<p class="caption">The org chart is part of the people record, not a separate diagram.</p></div></section>
<section class="section" style="padding-top:0"><div class="wrap"><div class="cols3">
  <div data-reveal><h3>Start with people</h3><p>Add employees individually or import from CSV, then assign departments, roles and reporting managers.</p></div>
  <div data-reveal style="--d:.06s"><h3>Add workflows</h3><p>Turn on attendance, leave, payroll, hiring, onboarding, performance and compliance as your organization needs them.</p></div>
  <div data-reveal style="--d:.12s"><h3>Keep control</h3><p>Role-aware navigation, and access rules enforced on the server, keep information with the people entitled to see it.</p></div>
</div></div></section>
${closing('Want to see it with your own questions?', 'Book a demo and bring the processes you want to simplify.')}`;
  return page({ path: '/product/', title: 'Product overview', description: 'What OrgVia is and does: a multi-tenant HRMS with employee records, org chart, attendance, leave, payroll, hiring, onboarding and performance.', body, crumbs: [['Product', '/product/']], schemaApp: true });
}

function features() {
  const m = (id, n, h, lede, items, extra = '') => `<section class="mod wrap" id="${id}"><div><p class="n">${n}</p><h2>${h}</h2><p class="lede">${lede}</p>${extra}</div><ul>${items.map(([a, b]) => `<li><b>${a}</b>${b}</li>`).join('')}</ul></section>`;
  const body = `${phero('What OrgVia <em>does,</em> module by module.', `A plain list of the workflows in the product. ${ENTITLEMENT}`, 'Features')}
${m('people', '01', 'People &amp; organization', 'The foundation the other modules build on.', [
    ['People directory', 'Search and filter employees by department, role and status.'],
    ['Employee profiles', 'Personal and employment details, reporting manager, access level and activity.'],
    ['Documents', 'Attach documents such as offer letters to an employee, with download and delete controls.'],
    ['Add or import employees', 'Create employees in a form or import a CSV.'],
    ['Org chart', 'Reporting lines drawn from employee records.'],
    ['Organization settings', 'Company profile, departments and office locations.'],
    ['Lifecycle actions', 'Edit, deactivate and manage an employee through their time with the organization.']], `<p class="tag live">Shown in product screens</p>`)}
${m('attendance', '02', 'Attendance &amp; leave', 'Time and absence handled in the same record.', [
    ['Clock in and out', 'A dashboard panel shows time worked today and the last action.'],
    ['Attendance board and history', 'Live attendance, punch history and CSV export for authorized users.'],
    ['Authorized overrides', 'Corrections by people with the right permission.'],
    ['Leave policies and balances', 'Configure leave types; employees see their balances.'],
    ['Requests and approvals', 'Employees apply; approvers act on the request.'],
    ['Leave calendar and summaries', 'See who is away and review totals.']])}
${m('payroll', '03', 'Payroll workflows', 'Configuration and runs, with payslips for employees.', [
    ['Salary records', 'Maintain salary details per employee.'],
    ['Payroll configuration', 'Set up how payroll is calculated for your organization.'],
    ['Payroll runs', 'Create and manage runs from an overview.'],
    ['Payslips', 'Employees can view their own payslips.']], `<p class="notice" style="margin-top:1.2rem"><b>Note.</b> Statutory payroll rules differ by country and organization. Ask us in a demo how payroll would be configured for yours.</p>`)}
${m('hiring', '04', 'Hiring &amp; onboarding', 'From open role to first week.', [
    ['Jobs and candidates', 'Track openings and the candidates for each.'],
    ['Interviews', 'Schedule and record interviews.'],
    ['Candidate export', 'Export candidate data to CSV.'],
    ['Onboarding records', 'Tasks, mentors and welcome messages for new joiners.']])}
${m('performance', '05', 'Performance', 'Keep the conversation connected to the person.', [
    ['Goals and feedback', 'Set goals and record feedback.'],
    ['Skills and development plans', 'Track skills and plan growth.'],
    ['Cycles and reviews', 'Run review cycles and complete reviews.']])}
${m('administration', '06', 'Compliance &amp; administration', 'Controls for the people who run the workspace.', [
    ['Roles and access', 'Employee, Manager, Recruiter, HR and Administrator roles, enforced by the backend.'],
    ['Compliance', 'Policies, acknowledgements, training, issues, reminders and CSV reporting.'],
    ['Support tickets', 'Raise and track support requests from inside the app.'],
    ['Notifications and account settings', 'Per-user notifications, profile and security settings.']])}
${closing('Not sure which modules you need?', 'Tell us how you work today and we will suggest where to start.')}`;
  return page({ path: '/features/', title: 'Features', description: 'OrgVia features: people directory and org chart, attendance and leave, payroll workflows, recruitment, onboarding, performance and compliance.', body, crumbs: [['Features', '/features/']] });
}

function solutions() {
  const p = (small, h, a, b, link) => `<div class="prob" data-reveal><h3><small>${small}</small>${h}</h3><div><p>${a}</p><p>${b}</p>${link}</div></div>`;
  const body = `${phero('Built around the problems HR teams <em>actually have.</em>', 'We describe what OrgVia can do for each problem, and nothing more.', 'Solutions')}
<section class="section"><div class="wrap">
${p('Scattered records', 'Employee information lives in too many places.', 'Keep profiles, employment details, reporting lines and documents in one directory, with CSV import to get started quickly.', 'Result: one answer when someone asks who reports to whom, or where a document is.', '<a class="link" href="/features/#people">People features</a>')}
${p('Manual approvals', 'Leave and time depend on chasing people.', 'Employees apply against policy and balance. The approver acts on the request. Clock-in and attendance history are stored against the same employee.', 'Result: a trail of who requested, who approved and what was recorded.', '<a class="link" href="/features/#attendance">Attendance and leave</a>')}
${p('Payroll preparation', 'Salary details and payroll runs are hard to keep tidy.', 'Maintain salary records and payroll configuration, create runs from an overview, and give employees their payslips.', 'We would confirm the fit for your payroll rules with you in a demo before you commit.', '<a class="link" href="/features/#payroll">Payroll workflows</a>')}
${p('Growing teams', 'Hiring and onboarding are handled in separate tools.', 'Track jobs, candidates and interviews, then carry the person into onboarding tasks, mentors and welcome messages.', 'Result: the new starter already has a record on day one.', '<a class="link" href="/features/#hiring">Hiring and onboarding</a>')}
${p('Access control', 'Not everyone should see everything.', 'Five roles and reporting-line scope decide what each person can see and do, and the backend enforces it. Platform-level administration is separate from organization data.', 'Result: managers work with their teams without wider exposure.', '<a class="link" href="/features/#administration">Roles and access</a>')}
</div></section>
<section class="section" style="padding-top:0"><div class="wrap"><p class="kicker">Who it suits</p><h2 class="title" style="margin:1rem 0 2rem;max-width:14em">Organizations that have outgrown <em>spreadsheets.</em></h2>
<div class="cols3"><div><h3>HR teams</h3><p>Administer people, leave, payroll and reviews from one place.</p></div><div><h3>Managers</h3><p>See your own team and handle approvals without wider access.</p></div><div><h3>Founders &amp; administrators</h3><p>Set up departments, locations and access, then adopt modules at your own pace.</p></div></div>
<p class="index-note" style="margin-top:2rem">OrgVia is a general-purpose HRMS. We do not currently describe industry-specific features.</p></div></section>
${closing('Describe your problem, we’ll show you the fit.', 'A short demo is enough to tell whether OrgVia suits how you work.')}`;
  return page({ path: '/solutions/', title: 'Solutions', description: 'How OrgVia helps with scattered employee records, manual leave approvals, payroll preparation, hiring and onboarding, and role-based access.', body, crumbs: [['Solutions', '/solutions/']] });
}

function pricing() {
  const body = `${phero('Find the right setup <em>for your team.</em>', 'OrgVia pricing is agreed with each organization. There are no public plans to compare yet.', 'Pricing')}
<section class="section"><div class="wrap split">
  <div class="qa"><h2 class="title" style="font-size:clamp(1.8rem,1rem + 2vw,2.6rem)">How the conversation works</h2>
  <p style="margin-top:1rem">We do not list prices on this site, because the right setup depends on how many people you have and which modules you want enabled. OrgVia switches modules on per organization, so you can begin with the people record and add workflows later.</p>
  <h3>What shapes the quote</h3><ul><li>Number of employees</li><li>Modules you want enabled (for example attendance, leave, payroll, hiring)</li><li>Onboarding help such as importing existing employee data</li></ul>
  <h3>What happens next</h3><p>Send a request. We reply to your work email, understand your needs and give you commercial terms in writing.</p>
  <div class="actions" style="margin-top:1.8rem"><a class="btn" href="/demo/">Book a demo ${arrow}</a><a class="btn btn-line" href="/contact/">Ask about pricing</a></div></div>
  <div class="aside-box"><h2>Helpful to have ready</h2><ol><li>Approximate headcount</li><li>The HR processes you run today</li><li>Where employee data currently lives</li><li>Whether you need payroll workflows</li></ol></div>
</div></section>
${closing('Let’s work out what you need.', 'No obligation. We will tell you honestly if OrgVia is not the right fit.')}`;
  return page({ path: '/pricing/', title: 'Pricing', description: 'OrgVia pricing is agreed per organization, based on team size and the modules you need. Request pricing or book a demo.', body, crumbs: [['Pricing', '/pricing/']] });
}

function about() {
  const body = `${phero('A calmer way to <em>run people operations.</em>', 'Who builds OrgVia and what we are trying to get right.', 'About')}
<section class="section"><div class="wrap split">
  <div class="qa"><h2 class="title" style="font-size:clamp(1.8rem,1rem + 2vw,2.6rem)">Where OrgVia comes from</h2>
  <p style="margin-top:1rem">OrgVia began as Hunar Attendance, a location-verified attendance product, and has grown into a multi-tenant HRMS with an organization workspace for HR and a separate console for platform administration.</p>
  <p>It is a young product. We would rather show you what works today and be clear about what is still being built than overpromise.</p></div>
  <div class="aside-box"><h2>What we hold to</h2><ul><li><b>Clarity.</b> Screens that explain themselves.</li><li><b>Precision.</b> Records people can rely on.</li><li><b>People first.</b> HR software serves the people in the company, not only the process.</li><li><b>Honesty.</b> We describe the product as it is.</li></ul></div>
</div></section>
<section class="section" style="padding-top:0"><div class="wrap"><div class="cols3">
  <div><h3>Separation by design</h3><p>Organization data is tenant-scoped and platform administration is a separate system.</p></div>
  <div><h3>Server-side access</h3><p>Role and reporting-line rules are enforced by the backend, not just by the interface.</p></div>
  <div><h3>Built in the open with you</h3><p>We want early customers to shape the roadmap. <a class="link" href="/contact/">Tell us what you need.</a></p></div>
</div></div></section>
${closing('Talk to the team behind it.', 'Book a demo or send us a question.')}`;
  return page({ path: '/about/', title: 'About OrgVia', description: 'OrgVia is a multi-tenant HRMS that grew out of the Hunar Attendance product. Learn what we build and how we work.', body, crumbs: [['About', '/about/']] });
}

function demo() {
  const body = `${phero('Book an <em>OrgVia demo.</em>', 'Tell us about your organization. We will reply to your work email to arrange a walkthrough.', 'Book a demo')}
<section class="section"><div class="wrap split">
  <div class="formbox">${enquiryForm('demo')}</div>
  <div class="aside-box"><h2>What to expect</h2><ol><li>We read your request and reply by email.</li><li>A walkthrough of the modules relevant to you.</li><li>Time for your questions about roles, data and rollout.</li></ol>
  <h3 style="margin-top:2rem">Already a customer?</h3><p style="color:var(--ink-2)"><a class="link" href="${esc(SITE.appUrl)}" rel="noopener">Log in to OrgVia</a></p></div>
</div></section>`;
  return page({ path: '/demo/', title: 'Book a demo', description: 'Request an OrgVia demo. Share your organization, team size and what you want to see, and the team will reply by email.', body, crumbs: [['Book a demo', '/demo/']] });
}

function contact() {
  const body = `${phero('Get in <em>touch.</em>', 'Questions about the product, pricing or how OrgVia would fit your team.', 'Contact')}
<section class="section"><div class="wrap split">
  <div class="formbox">${enquiryForm('contact', { compact: true })}</div>
  <div class="aside-box"><h2>Other ways to reach us</h2><p style="color:var(--ink-2)">The form above is the fastest route. Existing users can <a class="link" href="${esc(SITE.appUrl)}" rel="noopener">log in</a> and raise a support ticket from inside the app.</p>
  <h3 style="margin-top:2rem">Looking for answers?</h3><p style="color:var(--ink-2)">Check the <a class="link" href="/help/">help &amp; FAQs</a>.</p></div>
</div></section>`;
  return page({ path: '/contact/', title: 'Contact', description: 'Contact the OrgVia team with questions about the HRMS, pricing or a demo.', body, crumbs: [['Contact', '/contact/']] });
}

const HELP_FAQ = [
  ['What is OrgVia?', 'OrgVia is a web-based, multi-tenant HRMS covering employee records, org chart, attendance, leave, payroll workflows, recruitment, onboarding and performance.'],
  ['How does employee attendance management work in OrgVia?', 'Employees clock in and out from their dashboard, which shows time worked today and the last action. Authorized users can see an attendance board and history, export CSV and make authorized corrections.'],
  ['How do leave approval workflows work?', 'Leave types and balances are configured for the organization. An employee applies for leave; the approver reviews the request and approves or declines it. A calendar and summaries show who is away.'],
  ['What HR operations does OrgVia support?', `People and documents, org chart, attendance, leave, payroll configuration/runs/payslips, recruitment, onboarding, performance, compliance and support tickets. ${ENTITLEMENT}`],
  ['Who is OrgVia suitable for?', 'Organizations that want employee records and HR workflows in one system, with different access for employees, managers, recruiters, HR and administrators.'],
  ['Can we import our existing employee list?', 'Yes. The people section includes a CSV import as well as a form for adding employees one at a time.'],
  ['Is each organization’s data separate?', 'OrgVia is multi-tenant: organizations work in their own workspaces, and platform administration is a separate console.'],
  ['How can a company request an OrgVia demo?', 'Use the <a class="link" href="/demo/">Book a demo</a> form. The team replies to your work email.'],
  ['What does OrgVia cost?', 'Pricing is agreed per organization. See <a class="link" href="/pricing/">Pricing</a>.'],
  ['Where do I log in?', `Existing users sign in at <a class="link" href="${esc(SITE.appUrl)}" rel="noopener">${esc(SITE.appUrl.replace('https://', ''))}</a>.`],
];
function help() {
  const body = `${phero('Help &amp; <em>FAQs.</em>', 'Direct answers to the questions we hear most.', 'Help')}
<section class="section"><div class="wrap faq-grid"><div><p class="kicker">Answers</p><p class="lede" style="margin-top:1rem">Cannot find what you need? <a class="link" href="/contact/">Ask us</a>.</p></div>${faqHtml(HELP_FAQ)}</div></section>`;
  return page({ path: '/help/', title: 'Help & FAQs', description: 'Answers about OrgVia: what it is, attendance, leave approvals, supported HR operations, who it suits, demos and pricing.', body, crumbs: [['Help', '/help/']], faq: HELP_FAQ });
}

const draft = '<p class="notice"><b>Draft for legal review.</b> This text is a working draft and has not been approved by legal counsel. It must be reviewed before it is relied upon.</p>';
function privacy() {
  const body = `${phero('Privacy <em>Policy.</em>', 'How enquiries sent through this website are handled. Last updated 26 October 2026.', 'Privacy')}
<section class="wrap prose">${draft}
<h2>What this covers</h2><p>This page covers personal data you send through this public marketing website. It does not describe data processed inside customer workspaces of the OrgVia application, which is governed by each customer’s agreement with OrgVia.</p>
<h2>What we collect</h2><p>When you use the demo or contact form we receive the name, work email, organization, team size, optional phone number and optional message you enter.</p>
<h2>How we use it</h2><p>We use these details only to reply to your enquiry and arrange a demo. We do not sell them.</p>
<h2>Storage and sharing</h2><p>Enquiries are delivered to the OrgVia team by email through an email delivery provider. [Legal to confirm provider, retention period and storage location.]</p>
<h2>Your choices</h2><p>You can ask us to access or delete the details you sent. [Legal to confirm contact route and applicable law.]</p>
<h2>Cookies and analytics</h2><p>This website does not currently set advertising cookies or load third-party analytics scripts.</p></section>`;
  return page({ path: '/privacy/', title: 'Privacy Policy', description: 'Draft privacy policy for the OrgVia marketing website, describing how enquiry form data is handled.', body, crumbs: [['Privacy', '/privacy/']] });
}
function terms() {
  const body = `${phero('Terms of <em>Service.</em>', 'Terms for using this website. Last updated 26 October 2026.', 'Terms')}
<section class="wrap prose">${draft}
<h2>Using this website</h2><p>This website provides general information about OrgVia. Content is informational and does not constitute an offer or a contract.</p>
<h2>Product terms</h2><p>Use of the OrgVia application is governed by the agreement between OrgVia and each customer organization. [Legal to confirm.]</p>
<h2>Accuracy</h2><p>Screenshots use demonstration data. Features and availability may change and may depend on the modules enabled for an organization.</p>
<h2>Liability and governing law</h2><p>[Legal to provide limitation of liability, governing law and jurisdiction.]</p></section>`;
  return page({ path: '/terms/', title: 'Terms of Service', description: 'Draft terms of service for the OrgVia marketing website.', body, crumbs: [['Terms', '/terms/']] });
}

function notFound() {
  const body = `<section class="phero"><div><p class="kicker">404</p><h1>That page <em>isn’t here.</em></h1></div><div><p class="lede">The link may be out of date. Try the home page or one of the sections below.</p><div class="actions" style="margin-top:1.5rem"><a class="btn" href="/">Home</a><a class="btn btn-line" href="/features/">Features</a><a class="btn btn-line" href="/demo/">Book a demo</a></div></div></section>`;
  return page({ path: '/404.html', title: 'Page not found', description: 'The page you requested could not be found.', body, noindex: true });
}

export const PAGES = [
  ['index.html', home, '/', 1], ['product/index.html', product, '/product/', .9], ['features/index.html', features, '/features/', .9],
  ['solutions/index.html', solutions, '/solutions/', .8], ['pricing/index.html', pricing, '/pricing/', .8], ['about/index.html', about, '/about/', .6],
  ['demo/index.html', demo, '/demo/', .9], ['contact/index.html', contact, '/contact/', .6], ['help/index.html', help, '/help/', .7],
  ['privacy/index.html', privacy, '/privacy/', .3], ['terms/index.html', terms, '/terms/', .3], ['404.html', notFound, null, 0],
];
