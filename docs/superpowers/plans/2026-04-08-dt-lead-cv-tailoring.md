# DT Lead CV Tailoring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reposition index.html from SRE/DevOps framing to Digital Transformation Lead framing for МОУ IT-вертикаль vacancy, and create a cover letter file.

**Architecture:** Pure HTML edits to a single self-contained page. No build system, no shared CSS. Backup original first, then apply text/content changes across 4 sections of index.html. Cover letter saved as standalone text file.

**Tech Stack:** HTML, inline CSS (no changes to CSS needed — only content)

---

### Task 1: Backup current index.html

**Files:**
- Copy: `index.html` → `index-prev.html`

- [ ] **Step 1: Create backup**

```bash
cp index.html index-prev.html
```

- [ ] **Step 2: Verify backup is identical**

```bash
diff index.html index-prev.html
```

Expected: no output (files are identical)

- [ ] **Step 3: Commit backup**

```bash
git add index-prev.html
git commit -m "chore: backup index.html before DT Lead repositioning"
```

---

### Task 2: Update page meta & positioning

**Files:**
- Modify: `index.html:6` (title)
- Modify: `index.html:7` (meta description)
- Modify: `index.html:11` (og:description)
- Modify: `index.html:582` (sidebar tagline)

- [ ] **Step 1: Replace `<title>` tag**

In `index.html`, find:
```html
    <title>Юрій Клековкін — SRE · DevOps · Управління командами</title>
```
Replace with:
```html
    <title>Юрій Клековкін — Digital Transformation · IT Leadership · Управління процесами</title>
```

- [ ] **Step 2: Replace meta description**

Find:
```html
    <meta name="description" content="CV Юрій Клековкін | Site Reliability Engineer | DevOps Engineer | Управління командами | Kubernetes, Terraform, AWS, CI/CD | Менеджмент, оптимізація процесів">
```
Replace with:
```html
    <meta name="description" content="CV Юрій Клековкін | Digital Transformation Lead | IT Leadership | Управління командами та процесами | Agile, Scrum | Stakeholder Management | Впровадження ІТ-систем">
```

- [ ] **Step 3: Replace OG description**

Find:
```html
    <meta property="og:description" content="SRE · DevOps · Управління командами">
```
Replace with:
```html
    <meta property="og:description" content="Digital Transformation · IT Leadership · Управління процесами">
```

- [ ] **Step 4: Replace sidebar tagline**

Find:
```html
            <p class="tagline">SRE · DevOps · Управління командами</p>
```
Replace with:
```html
            <p class="tagline">Digital Transformation · IT Leadership · Процеси</p>
```

- [ ] **Step 5: Verify changes in browser**

```bash
open index.html
```

Check: page title in browser tab, sidebar tagline below name. No layout breakage.

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat: reposition page meta for DT Lead vacancy"
```

---

### Task 3: Rewrite summary section

**Files:**
- Modify: `index.html:393-398` (summary div content)

- [ ] **Step 1: Replace summary content**

In `index.html`, find the entire summary div content (lines 393-398):
```html
            <div class="summary">
                <p><strong>Зрілий, широкомислячий інженер та менеджер</strong> з майже 30-річним досвідом у IT — від технічної підтримки до управління командами та побудови production-ready інфраструктури на масштабі. Протягом усіх років безперервного зростання розробляв та впроваджував процеси як менеджер і як інженер.</p>
                <p>Спеціалізуюся на <strong>Site Reliability Engineering</strong> з понад 5-річним практичним досвідом оркестрації Kubernetes, infrastructure-as-code (Terraform, Helm) та автоматизації DevOps. Глибоке знання систем моніторингу (Prometheus, Grafana), хмарної інфраструктури (AWS, EKS) та CI/CD пайплайнів (ArgoCD, Spinnaker).</p>
                <p>Високорозвинений емоційний інтелект у поєднанні з великим галузевим досвідом та здатністю зрозуміло пояснювати складні технічні концепції — призвели до вміння координувати високонавантажені проекти та географічно розподілені команди.</p>
                <p><strong>Прагну знаходити нові можливості, використовуючи попередній досвід як точку опори.</strong></p>
            </div>
```

Replace with:
```html
            <div class="summary">
                <p><strong>Зрілий IT-лідер з понад 5-річним досвідом управління командами</strong> та майже 20-річним стажем в IT — від технічної підтримки до побудови production-інфраструктури на масштабі. Протягом кар'єри системно будував мости між технічними командами, бізнесом та кінцевими користувачами.</p>
                <p>Спеціалізуюся на <strong>впровадженні та масштабуванні ІТ-систем</strong>: від формування вимог і планування до запуску, збору зворотного зв'язку та безперервного вдосконалення. Глибоко розумію життєвий цикл IT-продуктів, процесний підхід та методології Agile/Scrum/Kanban.</p>
                <p>Сильна технічна база (хмарна інфраструктура, DevOps, SRE) дозволяє говорити однією мовою з розробниками та приймати обґрунтовані рішення в умовах невизначеності — без перекладачів між «бізнесом» і «технікою».</p>
                <p><strong>Прагну застосувати свій досвід для цифрової трансформації там, де це має найбільше значення.</strong></p>
            </div>
```

- [ ] **Step 2: Verify in browser**

```bash
open index.html
```

Check: summary reads as leadership-first, no layout breakage, 4 paragraphs visible.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: rewrite summary for DT Lead positioning"
```

---

### Task 4: Add military service and reframe all experience items

**Files:**
- Modify: `index.html:409-511` (experience section content)

- [ ] **Step 1: Add military service as first experience item**

In `index.html`, immediately after the experience section header (after line 408, before the first `<div class="experience-item">`), insert:

```html
            <div class="experience-item">
                <div class="experience-header">
                    <h3 class="job-title">Військовослужбовець</h3>
                    <span class="time">Липень 2025 - дотепер</span>
                </div>
                <div class="company">159 окрема механізована бригада</div>
                <div class="details">
                    <p>Проходження військової служби в складі 159 ОМБр. Розуміння військової вертикалі управління та специфіки комунікації в бойових підрозділах.</p>
                </div>
            </div>

```

Find the existing first experience item and insert the military block before it. Specifically, find:
```html
            <div class="experience-item">
                <div class="experience-header">
                    <h3 class="job-title">Senior Production Reliability Engineer</h3>
```
Insert the military block before it.

- [ ] **Step 2: Replace Senior Production Reliability Engineer bullets**

Find:
```html
                <div class="details">
                    <ul>
                        <li>Проєктував та підтримував виробничу інфраструктуру для криптовалютної SaaS платформи, що обслуговує мільйони користувачів</li>
                        <li>Впроваджував практики infrastructure-as-code з використанням Terraform та policy-as-code фреймворків</li>
                        <li>Керував Kubernetes deployments на AWS EKS з Helm charts та ArgoCD/Spinnaker для безперервної доставки</li>
                        <li>Розробляв комплексні рішення моніторингу з Prometheus та Grafana</li>
                        <li>Оптимізував CI/CD пайплайни зі зниженими показниками збоїв</li>
                        <li>Координував крос-функціональну співпрацю між командами розробки, безпеки та operations</li>
                    </ul>
                </div>
            </div>

            <div class="experience-item">
                <div class="experience-header">
                    <h3 class="job-title">Senior DevOps Engineer</h3>
```

Replace with:
```html
                <div class="details">
                    <ul>
                        <li>Координував крос-функціональну взаємодію між командами розробки, безпеки та operations для забезпечення надійності платформи з мільйонами користувачів</li>
                        <li>Впроваджував та вдосконалював процеси управління інфраструктурою: стандартизація, автоматизація, policy-as-code</li>
                        <li>Забезпечував безперервну доставку ІТ-продуктів через CI/CD пайплайни та GitOps практики (ArgoCD, Spinnaker)</li>
                        <li>Розробляв системи моніторингу та спостережуваності для проактивного виявлення проблем та прийняття рішень на основі даних</li>
                        <li>Керував Kubernetes інфраструктурою на AWS EKS в масштабі</li>
                    </ul>
                </div>
            </div>

            <div class="experience-item">
                <div class="experience-header">
                    <h3 class="job-title">Senior DevOps Engineer</h3>
```

- [ ] **Step 3: Replace Senior DevOps Engineer bullets**

Find:
```html
                    <ul>
                        <li>Керував повною AWS інфраструктурою, включаючи EKS кластери, мережеві та безпекові конфігурації</li>
                        <li>Розгортав та підтримував Kubernetes workloads за допомогою Helm</li>
                        <li>Автоматизував provisioning інфраструктури з Terraform, Chef та Ansible/SaltStack</li>
                        <li>Співпрацював з командами розробників для встановлення DevOps workflows та стандартів</li>
                    </ul>
```

Replace with:
```html
                    <ul>
                        <li>Відповідав за повний цикл управління хмарною інфраструктурою: планування, розгортання, підтримка та оптимізація</li>
                        <li>Встановлював DevOps workflows та стандарти у співпраці з командами розробників</li>
                        <li>Автоматизував процеси provisioning для забезпечення повторюваності та зниження людського фактору</li>
                    </ul>
```

- [ ] **Step 4: Replace Astroquirks bullets**

Find:
```html
                    <ul>
                        <li>Побудував інфраструктуру валідатора для блокчейнів на базі Tendermint/Cosmos (Osmosis, Stargaze)</li>
                        <li>Спроєктував повний технічний стек для блокчейн-ноди високої доступності з 99.9% uptime</li>
                        <li>Впровадив системи моніторингу, алертинг та автоматичного відновлення</li>
                    </ul>
```

Replace with:
```html
                    <ul>
                        <li>Побудував технічний стек та процеси для блокчейн-валідатора з нуля — від архітектури до моніторингу</li>
                        <li>Прийняття стратегічних та технічних рішень в умовах невизначеності стартапу</li>
                        <li>Забезпечив 99.9% uptime через системи автоматичного відновлення та алертингу</li>
                    </ul>
```

- [ ] **Step 5: Replace PortaOne Manager bullets**

Find:
```html
                    <ul>
                        <li>Керував командою технічної підтримки, надаючи L3/L4 підтримку VoIP білінгових систем</li>
                        <li>Встановив процеси та стандарти для співпраці між Development, QA та Product Management</li>
                        <li>Керував складними розгортаннями ПЗ та системними інтеграціями для глобальних клієнтів</li>
                        <li>Знизив плинність кадрів через оптимізацію процесів та впровадження систем безперервного зростання</li>
                    </ul>
```

Replace with:
```html
                    <ul>
                        <li>Керував командою технічної підтримки: планування, постановка задач, контроль виконання, розвиток співробітників</li>
                        <li>Побудував процеси взаємодії між Development, QA та Product Management — від ескалацій до системних покращень</li>
                        <li>Координував складні розгортання та інтеграції для глобальних клієнтів з різними стейкхолдерами</li>
                        <li>Знизив плинність кадрів через оптимізацію процесів та впровадження систем безперервного зростання</li>
                    </ul>
```

- [ ] **Step 6: Replace Senior Support Engineer bullets**

Find:
```html
                    <ul>
                        <li>Розширене адміністрування Linux/FreeBSD та troubleshooting геонадлишкових кластерних систем</li>
                        <li>Реалізація складних сценаріїв обслуговування, оновлень ПЗ та міграцій з мінімальним downtime</li>
                        <li>On-site технічні консультації та встановлення для клієнтів по всьому світу</li>
                    </ul>
```

Replace with:
```html
                    <ul>
                        <li>Технічні консультації та впровадження систем для клієнтів по всьому світу (on-site та remote)</li>
                        <li>Реалізація складних сценаріїв оновлень та міграцій з мінімальним downtime — координація з клієнтами та внутрішніми командами</li>
                        <li>Адміністрування Linux/FreeBSD кластерних систем</li>
                    </ul>
```

- [ ] **Step 7: Replace Support Engineer description**

Find:
```html
                    <p>L2-L3 технічна підтримка продуктів PortaOne та суміжних систем. Діагностика та аналіз системних проблем.</p>
```

Replace with:
```html
                    <p>L2-L3 технічна підтримка. Діагностика та аналіз системних проблем.</p>
```

- [ ] **Step 8: Replace Mozilla description**

Find:
```html
                    <p>Контриб'ютор локалізації та інфраструктури Mozilla. Представник спільноти (2013-2019). Організація конференцій та мітапів. Власник домену mozilla.org.ua.</p>
```

Replace with:
```html
                    <p>Організація конференцій та мітапів, розвиток спільноти, локалізація. Власник домену mozilla.org.ua.</p>
```

- [ ] **Step 9: Verify in browser**

```bash
open index.html
```

Check: military service appears first, all 8 experience items render correctly, no broken HTML.

- [ ] **Step 10: Commit**

```bash
git add index.html
git commit -m "feat: add military service, reframe experience for DT Lead"
```

---

### Task 5: Reorder skills section

**Files:**
- Modify: `index.html:522-572` (skills section content)

- [ ] **Step 1: Replace soft skill bars**

Find:
```html
            <div class="skill-item">
                <h3 class="skill-name">Комунікація</h3>
                <div class="skill-bar"><div class="skill-bar-inner" style="--level: 98%"></div></div>
            </div>

            <div class="skill-item">
                <h3 class="skill-name">Вирішення проблем</h3>
                <div class="skill-bar"><div class="skill-bar-inner" style="--level: 87%"></div></div>
            </div>

            <div class="skill-item">
                <h3 class="skill-name">Управління</h3>
                <div class="skill-bar"><div class="skill-bar-inner" style="--level: 97%"></div></div>
            </div>

            <div class="skill-item">
                <h3 class="skill-name">Аналітика</h3>
                <div class="skill-bar"><div class="skill-bar-inner" style="--level: 95%"></div></div>
            </div>

            <div class="skill-item">
                <h3 class="skill-name">Технічний</h3>
                <div class="skill-bar"><div class="skill-bar-inner" style="--level: 75%"></div></div>
            </div>
```

Replace with:
```html
            <div class="skill-item">
                <h3 class="skill-name">Комунікація та стейкхолдер-менеджмент</h3>
                <div class="skill-bar"><div class="skill-bar-inner" style="--level: 98%"></div></div>
            </div>

            <div class="skill-item">
                <h3 class="skill-name">Планування та контроль виконання</h3>
                <div class="skill-bar"><div class="skill-bar-inner" style="--level: 95%"></div></div>
            </div>

            <div class="skill-item">
                <h3 class="skill-name">Управління командою</h3>
                <div class="skill-bar"><div class="skill-bar-inner" style="--level: 97%"></div></div>
            </div>

            <div class="skill-item">
                <h3 class="skill-name">Прийняття рішень в невизначеності</h3>
                <div class="skill-bar"><div class="skill-bar-inner" style="--level: 87%"></div></div>
            </div>

            <div class="skill-item">
                <h3 class="skill-name">Технічна експертиза</h3>
                <div class="skill-bar"><div class="skill-bar-inner" style="--level: 75%"></div></div>
            </div>
```

- [ ] **Step 2: Replace tech skills list**

Find:
```html
            <div class="tech-skills">
                <h3>Хмарна інфраструктура та контейнери</h3>
                <ul>
                    <li>Kubernetes (EKS, RBAC, NetworkPolicy, ExternalSecrets), AWS (EC2, EKS, S3, CloudFormation), Docker</li>
                </ul>
                <h3>Infrastructure as Code</h3>
                <ul>
                    <li>Terraform, Helm, Chef, Ansible/SaltStack</li>
                </ul>
                <h3>CI/CD & GitOps</h3>
                <ul>
                    <li>ArgoCD, Spinnaker, GitHub Actions</li>
                </ul>
                <h3>Моніторинг та спостережуваність</h3>
                <ul>
                    <li>Prometheus, Grafana, логування, трасування, алерти, метрики RED/DORA</li>
                </ul>
                <h3>Безпека</h3>
                <ul>
                    <li>Vault, OAuth2, OIDC</li>
                </ul>
                <h3>Системне адміністрування</h3>
                <ul>
                    <li>Linux (Ubuntu, RHEL, LFS), FreeBSD, мережі, оптимізація продуктивності</li>
                </ul>
            </div>
```

Replace with:
```html
            <div class="tech-skills">
                <h3>Управління проєктами та процесами</h3>
                <ul>
                    <li>Agile, Scrum, Kanban, ITIL practices</li>
                </ul>
                <h3>Інструменти співпраці</h3>
                <ul>
                    <li>Jira, Confluence, Microsoft 365, GitHub, Slack</li>
                </ul>
                <h3>Хмарна інфраструктура та контейнери</h3>
                <ul>
                    <li>Kubernetes (EKS, RBAC, NetworkPolicy, ExternalSecrets), AWS (EC2, EKS, S3, CloudFormation), Docker</li>
                </ul>
                <h3>Infrastructure as Code</h3>
                <ul>
                    <li>Terraform, Helm, Chef, Ansible/SaltStack</li>
                </ul>
                <h3>CI/CD & GitOps</h3>
                <ul>
                    <li>ArgoCD, Spinnaker, GitHub Actions</li>
                </ul>
                <h3>Моніторинг та спостережуваність</h3>
                <ul>
                    <li>Prometheus, Grafana, логування, трасування, алерти, метрики RED/DORA</li>
                </ul>
                <h3>Безпека</h3>
                <ul>
                    <li>Vault, OAuth2, OIDC</li>
                </ul>
                <h3>Системне адміністрування</h3>
                <ul>
                    <li>Linux (Ubuntu, RHEL, LFS), FreeBSD, мережі, оптимізація продуктивності</li>
                </ul>
            </div>
```

- [ ] **Step 3: Verify in browser**

```bash
open index.html
```

Check: 5 skill bars with new names, 8 tech skill categories (management first), no layout breakage.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: reorder skills with management tools first for DT Lead"
```

---

### Task 6: Create cover letter file

**Files:**
- Create: `cover-letter-dt-lead.txt`

- [ ] **Step 1: Create cover letter file**

Create `cover-letter-dt-lead.txt` with this content:

```
Чому ми маємо працювати з вами?

Я будував та оптимізував процеси в міжнародних IT-компаніях протягом майже 20 років — від технічної підтримки до управління командами та production-інфраструктурою на масштабі мільйонів користувачів. Знаю як впроваджувати ІТ-системи так, щоб ними реально користувались, а не просто "закривати задачі".

Зараз проходжу військову службу в 159 ОМБр — розумію військову реальність зсередини. Поєднання цивільного IT-досвіду з розумінням військової вертикалі та специфіки комунікації в підрозділах — це саме те, що потрібно для цифрової трансформації, яка працює не на папері, а в полі.

Вмію будувати мости між технарями та людьми, які приймають рішення. Саме це я і хочу робити для Сил оборони.
```

- [ ] **Step 2: Commit**

```bash
git add cover-letter-dt-lead.txt
git commit -m "feat: add cover letter for DT Lead vacancy"
```

---

### Task 7: Final verification

**Files:**
- Verify: `index.html`, `index-prev.html`, `cover-letter-dt-lead.txt`

- [ ] **Step 1: Verify backup differs from modified version**

```bash
diff index.html index-prev.html | head -50
```

Expected: differences in title, meta, summary, experience, and skills sections.

- [ ] **Step 2: Open in browser and visually verify**

```bash
open index.html
```

Full checklist:
- Page title says "Digital Transformation · IT Leadership · Управління процесами"
- Sidebar tagline says "Digital Transformation · IT Leadership · Процеси"
- Summary leads with "Зрілий IT-лідер з понад 5-річним досвідом управління командами"
- Military service (159 ОМБр) is first experience item
- All 8 experience items present with reframed bullets
- Skills: 5 bars with new names, management tools first in tech list
- Contact info, education, languages, interests unchanged
- Donate banner visible
- Mobile responsive (resize browser to check)
- No broken HTML or layout issues

- [ ] **Step 3: Verify cover letter file exists and reads correctly**

```bash
cat cover-letter-dt-lead.txt
```

- [ ] **Step 4: Check that no other CV pages were modified**

```bash
git diff en.html sre-ua.html sre-en.html manager-ua.html manager-en.html donate.html
```

Expected: no output (no changes to other files).
