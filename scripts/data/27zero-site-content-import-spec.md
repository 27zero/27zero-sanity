# 27zero Site Content: Import Specification (text and metadata)
Generated 2026-10-09 from the Sanity production export of 2026-10-09 (197 documents). Field names come from the live export; the schema zip shared earlier is older than the deployed schema, so any field that appears only in the zip is marked REVIEW.

## 1. How to read this file
Each document lists one line per field in the form `- **field.path** [STATUS]: value`, followed by optional `was:` and `note:` lines. The import script reads the status and writes only what is allowed.

| Status | Meaning | Written by the script? |
|---|---|---|
| KEEP | Legitimate content already in Sanity. Shown for audit; left untouched. | No |
| FIX | Typo, whitespace, or capitalization correction of legitimate content. | Yes |
| STYLE | Same content with em dashes removed (site style) or a title suffix made consistent. | Yes |
| REPLACE | Mockup or duplicated content replaced with real copy. | Yes |
| FILL | Empty field filled with a value derived from existing content or a rule. | Yes |
| NEW | Field of a new document. | Yes |
| REVIEW | A proposal that needs a human decision. The value is shown but not written until the status is changed to FILL or REPLACE. | No |
| NEEDS INPUT | Information that only the team has. Nothing is invented. | No |
| DELETE | Document to remove (identical draft twins and retired services). | Yes |

**Import safety rules**
1. Patch fields. Never replace whole documents. The export used to build this file was made with `--no-assets`, which strips every image reference, so a full replace would delete images.
2. Long-form bodies (resources, interviews, case study sections) are not touched by this file.
3. Ids are the existing `_id` values. New services use `edtechMarketingService-<slug>`.
   Values for Portable Text fields (case study challenge, solution and so on) are written as plain paragraphs; the script converts them to blocks. Reference fields (projectType, cta) name the target document.
4. Written values contain no em dashes and respect the schema limits (meta title up to 70 characters, meta description up to 160); the generator checks both.

**URL flags.** Any value that depends on the old site, a staging site, the Webflow CDN, an old domain, or one person's calendar carries a line starting with `URL FLAG`. The complete list, including links inside article bodies, is in `url-dependencies-flag-list.csv`.

## 2. Audit summary
224 documents are covered. Rows by status across all documents:

| Status | Rows |
|---|---|
| KEEP | 190 |
| FIX | 11 |
| STYLE | 36 |
| REPLACE | 70 |
| FILL | 318 |
| NEW | 562 |
| REVIEW | 76 |
| NEEDS INPUT | 70 |
| DELETE | 10 |

**Mockup or placeholder content found (all replaced or held for input)**
- Lorem ipsum: About proof point (title and text), Apart slides one and three, three Student First results.
- Keyboard mash: four Doctums result descriptions, the Student First agency role, a misspelled Student First result.
- Gibberish in the navbar CTA (text and micro line) and two submenu labels ("work submenu 1" and "2").
- Placeholder labels: home newsletter headline ("Newsletter Section"), hero image alt text ("black"), a case study section titled "Final one single image".
- Copy reused on the wrong page: EdTech Marketing hero (About headline), Clients hero (Work hero), About team text (About hero text), Resources SEO description (Mentor description).
- Not a testimonial: Jim Brigadier (the quote is an interview teaser).
- Three skeleton case studies (Busuu, Scholarship Magic, WorldQuant Learning) with "Headline", "Rol", "Brief" as content.
- Typos: site SEO title ("Markteting"), Student First result ("Pipilne gereated"), Mentor SEO title trailing period.
- Spanish copy on the English site: Doctums client description.

**Legitimate content kept as is**: home, about, work, contact and Mentor page copy; the shared CTA; the practices; the 23 existing services; the Doctums and Student First case study bodies; all resource and interview bodies; team names and order; client names and existing URLs; two testimonials.

**Decisions needed from the team** are every row marked REVIEW or NEEDS INPUT. The most important:
1. Result numbers in the Doctums and Student First case studies (what each number measures).
2. Real testimonial text to replace Jim Brigadier, and the company for Erin Grant.
3. Whether the Colombian office stays listed, and the public titles of the team (Frans and Carmen proposals).
4. Whether the three skeleton case studies are written or unpublished.
5. Page-level assumptions about routes (/work, /clients, /contact, /edtech-mentor) and the home hero video, which is still hosted by Webflow.

## 3. Site settings
The singleton that holds most page-level copy. KEEP rows are shown so the whole page copy can be audited in one place.

#### Site settings (singleton)
`settings` | `_id`: `siteSettings` | document action: **PATCH**
> One document holds the copy for home, about, work, clients, mentor, resources, contact, navigation and the EdTech Marketing hub. Paths below are field paths inside it.

- **aboutDna.headline** [KEEP]: Creativity is our DNA
- **aboutDna.text** [KEEP]: We are experts in generating demand and growing revenue for education organizations of all kinds, from institutions to software, from b2c to b2b2c. We've been part of the transformation in education since 2001.
- **aboutHero.headline** [KEEP]: Your extended team of EdTech marketing experts and creatives.
- **aboutHero.text** [KEEP]: Our mission is to help drive global education transformation. With extensive hands-on experience, we understand the industry's evolving needs and enable EdTech companies to thrive.
- **aboutProofPoint.text** [REPLACE]: We stay close to the market through The EdTech Mentor, our interview series with global EdTech leaders. With more than 6,500 subscribers and over 80 practitioners featured across the Essentials, Founders, and Investor series, it keeps every strategy we build grounded in what the sector is saying today.
  - was: Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designe…
  - note: Lorem ipsum. Figures come from the latest one-pager; confirm they are still current before publishing.
- **aboutProofPoint.title** [REPLACE]: More than two decades inside EdTech.
  - was: What is Lorem Ipsum?
  - note: Lorem ipsum. Built from facts already on the site: 20+ years (siteDescription) and since 2001 (aboutDna).
- **aboutSeo.description** [KEEP]: 27zero is an EdTech marketing agency helping educational brands craft digital strategies that connect with audiences and deliver measurable results.
- **aboutSeo.title** [KEEP]: About: Your extended team of EdTech marketing experts and creatives
- **aboutTeam.headline** [KEEP]: The people behind the work.
- **aboutTeam.text** [REPLACE]: Strategists, creatives, and technologists working across North America, Europe, and Latin America, all with hands-on experience in education.
  - was: Our mission is to help drive global education transformation. With extensive hands-on experience, we understand the industry's evolving needs and enable EdTech…
  - note: Duplicated aboutHero.text word for word. Uses the regional footprint already stated in the Apart section.
- **agencyClosingCta.ctaLink** [KEEP]: /contact
- **agencyClosingCta.headline** [KEEP]: Let's partner to articulate and unpack meaningful results.
- **agencyHero.headline** [REPLACE]: The first and only agency built for EdTech.
  - was: Your extended team of EdTech marketing experts and creatives
  - note: Reused the About hero headline.
- **agencyHero.image.alt** [REVIEW]: (proposal pending) current: black
  - was: black
  - note: Alt text is the placeholder "black". Write it once the final hero image is chosen.
- **agencyHero.text** [REPLACE]: Practices built around your moment. Services that deliver on it. One partner, from strategy through execution, helping EdTech brands turn purpose into lasting impact.
  - was: Many practices. One goal: helping EdTech brands
  - note: Truncated placeholder ("Many practices. One goal: helping EdTech brands").
- **agencyPracticesSection.headline** [KEEP]: The moments we're built for.
- **agencyPracticesSection.text** [KEEP]: Every engagement starts with something real: a rebrand, a launch, a market you haven't cracked yet. These are the situations EdTech leaders bring to us, and where each 27zero practice begins.
- **agencySeo.description** [KEEP]: 27zero is the first and only agency built for EdTech. Nine practices built around your business moment, and the services to fully execute on it.
- **agencySeo.title** [STYLE]: EdTech Marketing | 27zero
  - was: EdTech Marketing — 27zero
  - note: Em dash removed.
- **apartSection.description** [STYLE]: Our foundations connect insight, creativity, and efficient execution, helping EdTech brands turn purpose into lasting impact.
  - was: Our foundations connect insight, creativity, and efficient execution — helping EdTech brands turn purpose into lasting impact.
  - note: Em dash removed.
- **apartSection.headline** [KEEP]: What sets 27zero apart.
- **apartSection.slideOne.text** [REPLACE]: We help shape the EdTech market from the inside. Through The EdTech Mentor, we engage more than 6,500 subscribers and over 80 practitioners across the Essentials, Founders, and Investor series. That community, together with our own research, fuels every strategy with actionable insight.
  - was: Lorem ipsum is simply dummy text of the printing and typesetting industry standard, used here as placeholder copy.
  - note: Lorem ipsum. From the latest one-pager; confirm the figures.
- **apartSection.slideOne.title** [REPLACE]: Research Enhanced Industry Knowledge
  - was: Research Enhanced Insights
  - note: Aligned with the latest one-pager.
- **apartSection.slideThree.text** [REPLACE]: In B2B EdTech, creativity is what makes complex ideas connect. We translate insight into campaigns that balance originality and clarity, so every creative concept supports a tangible business outcome.
  - was: Lorem ipsum is simply dummy text of the printing and typesetting industry standard, used here as placeholder copy.
  - note: Lorem ipsum. From the latest one-pager.
- **apartSection.slideThree.title** [REPLACE]: Creativity that Drives Effectiveness
  - was: Creativity Without Limits
  - note: Aligned with the latest one-pager.
- **apartSection.slideTwo.text** [STYLE]: We deliver the complete capability of a full-service agency with the focus of a boutique partner, with regional expertise in North America and Europe and agile production in Latin America.
  - was: We deliver the complete capability of a full-service agency with the focus of a boutique partner — with regional expertise in North America and Europe, and agil…
  - note: Em dash removed.
- **apartSection.slideTwo.title** [KEEP]: Execution that Scales
- **bookCard.link** [KEEP]: https://meetings.hubspot.com/carmen-sereno/strategy-session
  - note: Personal calendar of one team member; the main CTA depends on that person. | URL FLAG: booking link tied to one person's calendar
- **bookCard.subtitle** [STYLE]: 30 minutes. Free. Pick a time that works for you on our calendar, no emails needed.
  - was: 30 minutes. Free. Pick a time that works for you on our calendar — no emails needed.
  - note: Em dash removed.
- **bookCard.title** [KEEP]: Book a strategy session
- **clientsHero.eyebrow** [REPLACE]: Clients
  - was: Work: Behind the fastest-growing EdTech brands
  - note: Duplicated the Work hero eyebrow word for word.
- **clientsHero.headline** [REPLACE]: The EdTech brands we partner with.
  - was: Behind the fastest growing EdTech brands.
  - note: Duplicated the Work hero headline word for word.
- **clientsHero.subtitle** [REPLACE]: From global learning platforms to early-stage founders, EdTech teams grow with 27zero.
  - was: First-hand expertise, innovative conceptual thinking & design, client-first approach
  - note: Duplicated the Work hero subtitle word for word.
- **clientsSeo.noIndex** [KEEP]: True
- **contactHero.ctaLink** [KEEP]: https://meetings.hubspot.com/carmen-sereno/strategy-session
  - note: Personal calendar of one team member (Carmen Sereno); the main CTA depends on that person. | URL FLAG: booking link tied to one person's calendar
- **contactHero.headline** [KEEP]: How can we help your EdTech brand thrive?
- **contactHero.text** [KEEP]: Looking for a marketing partner who genuinely understands EdTech? Let's start a conversation.
- **contactSeo.description** [KEEP]: Let's start a transformative conversation today.
- **contactSeo.title** [KEEP]: Let's Talk: How can we help your EdTech team thrive?
- **formSubtitle** [KEEP]: We respond to every inquiry within one business day.
- **formTitle** [KEEP]: How can we help your EdTech brand thrive?
- **homeHero.ctaCaption** [KEEP]: Free. 30 min. No sales pitch.
- **homeHero.ctaLink** [KEEP]: https://meetings.hubspot.com/carmen-sereno/strategy-session
  - note: Personal calendar of one team member (Carmen Sereno); the main CTA depends on that person. | URL FLAG: booking link tied to one person's calendar
- **homeHero.headline** [KEEP]: The first and only agency \n<em>built for EdTech</em>
- **homeHero.video** [KEEP]: https://cdn.prod.website-files.com/65144cb53e0e9c74de079e3b/65bbcea5a7596c2a58418bc3_LOOP 27 zero V5Lw-transcode.mp4
  - note: No replacement available. Needs the file re-hosted (Sanity assets or the new storage) before the Webflow account is closed. | URL FLAG: media hosted on the Webflow CDN
- **homeMentor.headline** [KEEP]: The EdTech Mentor <em>pearls of wisdom.</em>
- **homeMentor.subtitle** [KEEP]: Global EdTech leaders sharing their perspectives, experiences, and valuable lessons from their journey in this formidable industry.
- **homeNewsletter.headline** [REPLACE]: EdTech pearls of wisdom, straight to your inbox.
  - was: Newsletter Section
  - note: Placeholder ("Newsletter Section"). Echoes the homeMentor headline.
- **homeNewsletter.placeholder** [KEEP]: you@YourEdTech.com
- **homeSeo.description** [KEEP]: Marketing programs designed to amplify the impact of EdTech companies.
- **homeSeo.title** [KEEP]: 27zero | EdTech Marketing Agency
- **homeWork.headline** [KEEP]: The marketing team EdTech brands turn to <em>for growth and impact.</em>
- **homeWork.subtitle** [KEEP]: EdTech buyers already have a shortlist. We make sure you're on it.
- **linkedinUrl** [KEEP]: https://www.linkedin.com/company/27zero/
- **mentorCta.headline** [KEEP]: Begin your journey to growth.
- **mentorCta.secondaryCtaText** [KEEP]: Learn More
- **mentorCta.text** [KEEP]: Let's partner to articulate and unpack meaningful results. Together, we'll discover an approach that will expand your impact.
- **mentorHero.headline** [KEEP]: The EdTech Mentor Interview Series.
- **mentorHero.text** [KEEP]: Global EdTech leaders sharing their perspectives, experiences, and valuable lessons from their journey in this formidable industry.
- **mentorSeo.description** [KEEP]: Global EdTech leaders sharing their perspectives, experiences, and valuable lessons from their journey in this formidable industry.
- **mentorSeo.title** [FIX]: The EdTech Mentor Interview Series | 27zero
  - was: EdTech Mentor Interviews.
  - note: Trailing period and no brand; now matches the hero.
- **navbarCta.micro** [REPLACE]: Free. 30 min. No sales pitch.
  - was: free. 30 min. No sales piiiiitch.
  - note: Placeholder gibberish. Matches the line already used under the home hero button.
- **navbarCta.text** [REPLACE]: Let's talk
  - was: leeeeettttsss talk!!
  - note: Placeholder gibberish.
- **navbarCta.url** [REPLACE]: /contact
  - was: https://27zero-web.netlify.app/work/showing-the-future-in-the-present-a-saas-website-for-a-future-ready-sis-where-product-and/
  - note: Pointed at a Netlify staging page. /contact matches the shared CTA document. | URL FLAG: points to the Netlify staging site
- **navbarWorkDropdown.items[0].href** [REPLACE]: /work
  - was: https://27zero-web.netlify.app/work/showing-the-future-in-the-present-a-saas-website-for-a-future-ready-sis-where-product-and/
  - note: Pointed at a Netlify staging page. | URL FLAG: points to the Netlify staging site
- **navbarWorkDropdown.items[0].label** [REPLACE]: By projects
  - was: work submenu 1
  - note: Placeholder ("work submenu 1"). Matches the Work submenu on the staging nav.
- **navbarWorkDropdown.items[1].href** [REPLACE]: /clients
  - was: https://27zero-web.netlify.app/work/showing-the-future-in-the-present-a-saas-website-for-a-future-ready-sis-where-product-and/
  - note: Pointed at a Netlify staging page. Assumes the clients page lives at /clients. | URL FLAG: assumes a route that must exist in the new site
- **navbarWorkDropdown.items[1].label** [REPLACE]: By clients
  - was: work submenu 2
  - note: Placeholder ("work submenu 2"). Matches the Work submenu on the staging nav.
- **officeCONew.address** [REVIEW]: (proposal pending) current: Bogotá\nCra 7 # 116-50
  - was: Bogotá\nCra 7 # 116-50
  - note: Confirm this office should still be listed: 27zero no longer has a Colombian entity and works fully remote.
- **officeCONew.phone** [REVIEW]: (proposal pending) current: +57 (304) 576-0752
  - was: +57 (304) 576-0752
  - note: Same as above.
- **officeUSNew.address** [KEEP]: Granville, OH\n110 Bedwen Bach Lane, 43023
- **officeUSNew.phone** [KEEP]: +1 (317) 201-0890
- **resourcesHero.headline** [KEEP]: EdTech\nResources
- **resourcesHero.subtitle** [KEEP]: Resources built from real campaigns, real strategies, and real results.
- **resourcesSeo.description** [REPLACE]: Practical EdTech marketing guidance built from real campaigns, real strategies, and real results.
  - was: Global EdTech leaders sharing their perspectives, experiences, and valuable lessons from their journey in this formidable industry.
  - note: Was copied from the Mentor page. Derived from resourcesHero.subtitle.
- **resourcesSeo.title** [FIX]: EdTech Marketing Resources | 27zero
  - was: Resources
  - note: Single word with no context.
- **seo.description** [KEEP]: 27zero is an EdTech marketing agency built for this market, not adapted to it. Informed creativity that turns complexity into clarity and lasting relevance
- **seo.title** [REPLACE]: 27zero | EdTech Marketing Agency
  - was: EdTech Markteting Agency
  - note: Typo ("Markteting"). Aligned with homeSeo.title; this is the site-wide fallback title.
- **servicesDescription** [KEEP]: Wherever you are in your marketing cycle, we have something cooking, strategy, creativity, and execution, ready to serve when you are.
- **servicesTitle** [KEEP]: What's on the menu?
- **siteDescription** [KEEP]: 27zero is an EdTech marketing agency built for this market, not adapted to it. With 20+ years inside EdTech, we turn deep knowledge of your products, buyers, and buying journeys into informed creativity: marketing that makes complexity clear and builds lasting category relevance, not just leads.
- **siteTitle** [KEEP]: EdTech Marketing Agency
- **siteUrl** [KEEP]: https://www.27zero.agency
  - note: Canonical base URL; fine while the domain stays the same. | URL FLAG: absolute link to the current site
- **subscribeCard.link** [KEEP]: https://www.linkedin.com/build-relation/newsletter-follow?entityUrn=7057097071853461504
- **subscribeCard.subtitle** [STYLE]: Get our newsletter: interviews with EdTech leaders and market insights, every week.
  - was: Get our newsletter — interviews with EdTech leaders and market insights, every week.
  - note: Em dash removed.
- **subscribeCard.title** [KEEP]: Subscribe to The EdTech Mentor
- **waysTitle** [KEEP]: Two more ways to start
- **workHero.eyebrow** [KEEP]: Work: Behind the fastest-growing EdTech brands
- **workHero.headline** [KEEP]: Behind the fastest growing EdTech brands.
- **workHero.subtitle** [KEEP]: First-hand expertise, innovative conceptual thinking & design, client-first approach
- **workSeo.description** [KEEP]: First-hand expertise, innovative conceptual thinking & design, client-first approach.
- **workSeo.title** [KEEP]: Work: Behind the fastest-growing EdTech brands
- **clientsSeo.title** [FILL]: Clients | 27zero
  - was: Empty. The clients page is currently set to noIndex (see clientsSeo.noIndex): confirm that is intended.
- **clientsSeo.description** [FILL]: The EdTech brands 27zero partners with, from global learning platforms to early-stage founders.
- **agencyHero.ctaLink** [FILL]: /contact
  - was: Empty.
- **agencyHero.ctaCaption** [FILL]: Free. 30 min. No sales pitch.
  - was: Empty. Same line used on the home hero.
- **mentorCta.secondaryCtaLink** [FILL]: /edtech-marketing
  - was: Button says "Learn More" but had no destination. Points to the EdTech Marketing hub.
  - note: ROUTE_ASSUMPTION
- **contactEmail** [NEEDS INPUT]
  - was: Empty.
- **officeUSNew.email** [NEEDS INPUT]
  - was: Empty.
- **officeCONew.email** [NEEDS INPUT]
  - was: Empty.
- **gaId** [NEEDS INPUT]
  - was: Analytics id; never invented.
- **hubspotId** [NEEDS INPUT]
  - was: HubSpot portal id; never invented.
- **twitterUrl** [NEEDS INPUT]
  - was: Empty.
- **homeWork.showreelUrl** [NEEDS INPUT]
  - was: Optional; empty.
- **footerCta.headline** [REVIEW]: Let's partner to articulate and unpack meaningful results.
  - was: Footer fields appear in the schema zip but not in the data. Confirm they exist in the deployed schema, then approve.
- **footerCta.text** [REVIEW]: From positioning to websites to demand generation. Built for EdTech, not adapted to it.
  - was: Taken from the shared CTA document.
- **footerCta.buttonText** [REVIEW]: Book a strategy session
- **footerNavigation.links** [REVIEW]: About /about | Work /work | EdTech Marketing /edtech-marketing | The EdTech Mentor /edtech-mentor | Resources /resources | Contact /contact
  - was: Routes are assumptions until the final route list is confirmed.
  - note: ROUTE_ASSUMPTION

## 4. Shared documents: CTA, authors and categories

#### Shared CTA: CTA general EdTech
`cta` | `_id`: `cta-general-edtech` | document action: **PATCH**
> All fields are legitimate; no changes.

- **bgColor** [KEEP]: dark
- **bodyText** [KEEP]: From positioning to websites to demand generation. Built for EdTech, not adapted to it.
- **bodyTextColor** [KEEP]: white
- **ctaLink** [KEEP]: /contact
  - note: URL FLAG: assumes a route that must exist in the new site
- **ctaText** [KEEP]: Let's Talk
- **headline** [KEEP]: This is what we do for EdTech brands. Let's talk about yours.
- **headlineColor** [KEEP]: purple
- **title** [KEEP]: CTA general EdTech

#### Author: 27zero
`author` | `_id`: `6467c01d-ed37-487f-8e2d-85d53b233803` | document action: **PATCH**
> Legitimate. An identical unpublished draft exists (drafts.6467c01d...): discard it.

- **company** [KEEP]: 27zero
- **name** [KEEP]: 27zero
- **role** [KEEP]: EdTech Marketing Agency
- **slug.current** [KEEP]: 27zero

#### Author draft twin (identical)
`author` | `_id`: `drafts.6467c01d-ed37-487f-8e2d-85d53b233803` | document action: **DELETE**

- **(document)** [DELETE]

#### Work category: UX/UI & Web Design
`workCategory` | `_id`: `workCategory-ux-ui-web-design` | document action: **PATCH**

- **title** [FIX]: UX/UI & Web Design
  - was: Ux/Ui & Web Design
  - note: Capitalization.

#### Work category: Strategic Services
`workCategory` | `_id`: `workCategory-strategic-services` | document action: **PATCH**
> Renamed to follow the final service taxonomy.

- **title** [REPLACE]: Strategic Foundations
  - was: Strategic Services
- **slug.current** [REPLACE]: strategic-foundations
  - was: strategic-services
  - note: Changes any filter URL built on this slug. | URL FLAG: this change moves an existing page URL, so it needs a 301 redirect

#### Work category: Content Marketing
`workCategory` | `_id`: `workCategory-content-marketing` | document action: **PATCH**
> Renamed to follow the final service taxonomy.

- **title** [REPLACE]: Brand Salience and Reputation
  - was: Content Marketing
- **slug.current** [REPLACE]: brand-salience-reputation
  - was: content-marketing
  - note: Changes any filter URL built on this slug. | URL FLAG: this change moves an existing page URL, so it needs a 301 redirect

#### Work category: Events
`workCategory` | `_id`: `workCategory-events` | document action: **PATCH**
> Renamed to follow the final service taxonomy.

- **title** [REPLACE]: Events & Experiences
  - was: Events
- **slug.current** [REPLACE]: events-experiences
  - was: events
  - note: Changes any filter URL built on this slug. | URL FLAG: this change moves an existing page URL, so it needs a 301 redirect

#### Work category: Thought Leadership Programs
`workCategory` | `_id`: `workCategory-thought-leadership-pr` | document action: **PATCH**
> Already matches the final taxonomy.

- **title** [KEEP]: Thought Leadership Programs

#### Work category: Marketing Programs
`workCategory` | `_id`: `609302af-bca5-4412-9213-0dd41205490c` | document action: **PATCH**
> Legacy name with no equivalent in the final taxonomy, and all six case studies are filed under it.

- **title** [REVIEW]
  - note: Decide whether to retire it, or to keep it as an umbrella filter. Its description is generic ("Success hinges on understanding your audience, market dynamics, and unique selling points").
- **(new categories)** [REVIEW]: Brand & Identity | Demand Generation | Marketing Operations | Account-Based Marketing | SEO, AEO & GEO
  - note: Final taxonomy categories that have no work category yet. Create them once there are case studies to file under them.

#### Resource category: Marketing
`resourceCategory` | `_id`: `9160ece0-1d4f-4716-a9bb-8f71d633c642` | document action: **PATCH**
> Legitimate.

- **title** [KEEP]: Marketing

#### Resource category: Communication
`resourceCategory` | `_id`: `fc98eae4-5a93-475a-b60b-4204f69d4bda` | document action: **PATCH**
> Legitimate.

- **title** [KEEP]: Communication

#### Mentor category: C-Suite
`mentorCategory` | `_id`: `087d6a0e-10cc-4b3a-a330-e6b7429aff97` | document action: **PATCH**

- **title** [FIX]: C-Suite
  - was: C-Suite 
  - note: Trailing space.

#### Mentor category: Investors
`mentorCategory` | `_id`: `881d1a46-7256-42a6-baad-d54123e96d3d` | document action: **PATCH**
> Legitimate; no changes.

- **title** [KEEP]: Investors
- **sectionHeadline** [KEEP]: Investor Series <em>Interviews</em>
- **sectionSubtitle** [KEEP]: The Impact of Investment in EdTech

#### Mentor category: Essentials
`mentorCategory` | `_id`: `90ec89c2-2b8e-498c-9532-ea6be0a5e264` | document action: **PATCH**
> Legitimate; no changes.

- **title** [KEEP]: Essentials
- **sectionHeadline** [KEEP]: Essential series <em>Interviews</em>
- **sectionSubtitle** [KEEP]: Pearls of wisdom from seasoned EdTech Leaders.

#### Mentor category: Founders
`mentorCategory` | `_id`: `0a891b56-a9bb-4285-a1ea-bbc8cfc91a71` | document action: **PATCH**
> Legitimate; no changes.

- **title** [KEEP]: Founders
- **sectionHeadline** [KEEP]: Founders Series <em>Interviews</em>
- **sectionSubtitle** [KEEP]: Conversations with EdTech founders about growth and impact.

#### Mentor category: Inside 27zero
`mentorCategory` | `_id`: `fb9be3f0-9edc-4ca9-88da-bbc37cc88564` | document action: **PATCH**
> Legitimate; no changes.

- **title** [KEEP]: Inside 27zero
- **sectionHeadline** [KEEP]: <em>Inside 27zero Interview Series</em>
- **sectionSubtitle** [KEEP]: Strategists, creatives, and builders sharing what years inside EdTech have taught them

#### Mentor season: Season 2
`mentorSeason` | `_id`: `3ad615f0-bfc9-4df0-924a-3edc1669a228` | document action: **PATCH**

- **color** [FIX]: #000000
  - was:  #000000
  - note: Leading space.

## 5. Team
Names, order and active flags are legitimate. The only edits are whitespace and two role labels that read like placeholders. Public titles are shown as stored; please confirm they are current (for example, Carlos Márquez is listed as "Founder, CEO & Creative Ops Leader").

#### Team: Carlos Márquez
`team` | `_id`: `8cb7471a-458d-4572-9d72-95daac128483` | document action: **PATCH**

- **name** [KEEP]: Carlos Márquez
- **role** [KEEP]: Founder, CEO & Creative Ops Leader
- **order** [KEEP]: 1
- **isActive** [KEEP]: True

#### Team: Laureano Díaz
`team` | `_id`: `e800c5d9-b433-4062-ae60-adee9fa2b4ea` | document action: **PATCH**

- **name** [KEEP]: Laureano Díaz
- **role** [KEEP]: Chief Strategy Officer
- **order** [KEEP]: 2
- **isActive** [KEEP]: True

#### Team: Frans Van Eck
`team` | `_id`: `1e5506ba-4cca-4ad6-8a60-fa8ff7615427` | document action: **PATCH**

- **name** [KEEP]: Frans Van Eck
- **role** [REVIEW]: Regional Advisor, Europe
  - was: Marketing EdTech 
  - note: "Marketing EdTech" reads like a placeholder. Proposal assumes his advisory role and base in Amsterdam; confirm the title.
- **order** [KEEP]: 3
- **isActive** [KEEP]: True

#### Team draft twin: Frans Van Eck
`team` | `_id`: `drafts.1e5506ba-4cca-4ad6-8a60-fa8ff7615427` | document action: **DELETE**
> Identical to the published document: discard.

- **(document)** [DELETE]

#### Team: Lynn Zingraf
`team` | `_id`: `317501b1-1753-4f2a-9fc1-a8eb55410ee8` | document action: **PATCH**

- **name** [KEEP]: Lynn Zingraf
- **role** [KEEP]: VP North America
- **order** [KEEP]: 4
- **isActive** [KEEP]: True

#### Team: Alexandra Pineda
`team` | `_id`: `e6068b79-efea-49bd-add5-bc146254a94d` | document action: **PATCH**

- **name** [KEEP]: Alexandra Pineda
- **role** [KEEP]: Head of Events & Experiences
- **order** [KEEP]: 5
- **isActive** [KEEP]: True

#### Team: Monica Mantilla
`team` | `_id`: `a662c26e-7517-47b0-af3d-859b31297b8e` | document action: **PATCH**

- **name** [KEEP]: Monica Mantilla
- **role** [KEEP]: Strategic Design and Account Management
- **order** [KEEP]: 6
- **isActive** [KEEP]: True

#### Team: Carmen Sereno
`team` | `_id`: `b8120fc4-6ecd-4fca-8b27-c7659313927b` | document action: **PATCH**

- **name** [KEEP]: Carmen Sereno
- **role** [REVIEW]: Digital Marketing, LATAM
  - was: Latam | Marketing digital
  - note: Mixed-language, pipe-separated label ("Latam | Marketing digital") on an English site.
- **order** [KEEP]: 7
- **isActive** [KEEP]: True

#### Team: Marcela Marquez
`team` | `_id`: `57e74730-0ad9-4532-a599-62523b97bed3` | document action: **PATCH**

- **name** [KEEP]: Marcela Marquez
- **role** [FIX]: Creative Operations Director
  - was: Creative Operations Director 
  - note: Trailing space.
- **order** [KEEP]: 8
- **isActive** [KEEP]: True

#### Team: Keila Illueca Rada
`team` | `_id`: `23a3ed24-4d1f-456e-9964-5a1d57bc48c6` | document action: **PATCH**

- **name** [KEEP]: Keila Illueca Rada
- **role** [KEEP]: Project & Marketing Strategist Specializing in Go-To-Market (GTM)
- **order** [KEEP]: 9
- **isActive** [KEEP]: True

#### Team: Isabella Arango Villamil
`team` | `_id`: `2eb9e015-335d-4793-9f13-07dd9541cc37` | document action: **PATCH**

- **name** [KEEP]: Isabella Arango Villamil
- **role** [KEEP]: Content Strategist & Brand Copywriter
- **order** [KEEP]: 10
- **isActive** [KEEP]: True

#### Team: Andres Herrera
`team` | `_id`: `d7c2fb50-bd14-434b-ac4e-d7afd580527c` | document action: **PATCH**

- **name** [KEEP]: Andres Herrera
- **role** [KEEP]: UX/UI & Interactive Designer
- **order** [KEEP]: 11
- **isActive** [KEEP]: True

#### Team: Junior Gomez
`team` | `_id`: `400bedbb-2b4d-4dea-ba99-0d9b9a427072` | document action: **PATCH**

- **name** [KEEP]: Junior Gomez
- **role** [FIX]: Marketing Technology Specialist
  - was: Marketing Technology Specialist 
  - note: Trailing space.
- **order** [KEEP]: 12
- **isActive** [KEEP]: True

## 6. Clients
Only Doctums had a description, and it was in Spanish. Seven more are drafted from what 27zero has already published about each client; Anthology, Universidad de los Andes, OES and IEE have nothing published to draw on. URLs are only filled when the export supports them. Published articles also name Ellucian, Open LMS, uPlanner, Atomic Jolt and Instructure as clients, who have no client document yet.

#### Client: Anthology
`client` | `_id`: `client-anthology` | document action: **PATCH**

- **name** [KEEP]: Anthology
- **description** [NEEDS INPUT]
  - note: Empty; nothing published to draw on.
- **url** [FILL]: https://www.anthology.com/
  - note: Empty. Same domain already linked inside Mentor interviews.

#### Client: Busuu
`client` | `_id`: `client-busuu` | document action: **PATCH**

- **name** [KEEP]: Busuu
- **description** [FILL]: A well-established consumer language learning brand with a corporate offering for enterprise teams.
  - note: Empty. From the published Busuu case study highlight.
- **url** [KEEP]: https://business.busuu.com/

#### Client: D2L
`client` | `_id`: `client-d2l` | document action: **PATCH**

- **name** [KEEP]: D2L
- **description** [FILL]: Learning technology company behind Brightspace, with strength in both higher education and workforce learning.
  - note: Empty. From a 27zero article that describes D2L's Brightspace.
- **url** [FILL]: https://www.d2l.com/
  - note: Empty. Same domain already linked inside Mentor interviews.

#### Client: Doctums
`client` | `_id`: `942bbfc1-2e1c-4379-8916-bee259f33679` | document action: **PATCH**

- **name** [KEEP]: Doctums
- **description** [FIX]: We are an education consultancy that combines management and technology, with global experience in educational administration, technology, and student experience.
  - was: Somos una consultora especializada en educación que combina gestión y tecnología. Contamos con experiencia global en administración educativa, tecnología y expe…
  - note: Spanish copy on an English site. Faithful translation.
- **isFeatured** [REVIEW]
  - note: Published says false, the unpublished draft says true: decide.
- **url** [KEEP]: https://www.doctums.com/

#### Client draft twin: Doctums
`client` | `_id`: `drafts.942bbfc1-2e1c-4379-8916-bee259f33679` | document action: **DELETE**
> Differs from the published document only in isFeatured (draft: true, published: false). Decide the value on the published document, then discard the draft.

- **(document)** [DELETE]

#### Client: IEE
`client` | `_id`: `client-iee` | document action: **PATCH**

- **name** [KEEP]: IEE
- **description** [NEEDS INPUT]
  - note: Empty; nothing published to draw on.
- **url** [NEEDS INPUT]
  - note: Empty.

#### Client: OES
`client` | `_id`: `client-oes` | document action: **PATCH**

- **name** [KEEP]: OES
- **description** [NEEDS INPUT]
  - note: Empty; nothing published to draw on.
- **url** [NEEDS INPUT]
  - note: Empty.

#### Client: Scholarship Magic
`client` | `_id`: `client-scholarship-magic` | document action: **PATCH**

- **name** [KEEP]: Scholarship Magic
- **description** [FILL]: Helps higher education institutions maximize the impact of their scholarship management by streamlining operations and uncovering insights in their data.
  - note: Empty. From the Mentor interview intro with its CEO.
- **url** [KEEP]: https://scholarshipmagic.com/

#### Client: Skillwell
`client` | `_id`: `client-skillwell` | document action: **PATCH**

- **name** [KEEP]: Skillwell
- **description** [FILL]: An AI-native learning company formed in December 2025 by the merger of ETU and RealizeIt, offering AI-powered simulations and adaptive learning for Fortune 500 companies and higher education institutions.
  - note: Empty. From a 27zero article that profiles Skillwell.
- **url** [NEEDS INPUT]
  - note: Empty.

#### Client: Student First
`client` | `_id`: `client-student-first` | document action: **PATCH**

- **name** [KEEP]: Student First
- **description** [FILL]: A modern, AI-enabled student information system (SIS) for higher education.
  - note: Empty. From 27zero articles about the Student First engagement.
- **url** [KEEP]: https://www.studentfirst.com/

#### Client: Universidad de los Andes
`client` | `_id`: `client-universidad-de-los-andes` | document action: **PATCH**

- **name** [KEEP]: Universidad de los Andes
- **description** [NEEDS INPUT]
  - note: Empty; nothing published to draw on.
- **url** [NEEDS INPUT]
  - note: Empty.

#### Client: WorldQuant Learning
`client` | `_id`: `client-wql` | document action: **PATCH**

- **name** [KEEP]: WorldQuant Learning
- **description** [FILL]: A hands-on technical education platform serving universities and workforce organizations.
  - note: Empty. From 27zero articles.
- **url** [KEEP]: https://www.wqlearning.com/

## 7. Testimonials
One testimonial is complete, one is missing its company, and one is not a testimonial at all.

#### Testimonial draft twin: Wesley Matthews
`testimonial` | `_id`: `drafts.1d59b68b-f0a3-4e7c-877e-60937774a00a` | document action: **DELETE**
> Identical to the published document: discard.

- **(document)** [DELETE]

#### Testimonial: Wesley Matthews
`testimonial` | `_id`: `1d59b68b-f0a3-4e7c-877e-60937774a00a` | document action: **PATCH**
> Legitimate; no changes.

- **quote** [KEEP]: 27Zero helped Doctums refine its brand message and develop a comprehensive marketing framework. Now, we see results: a stronger pipeline and broader market recognition.
- **authorRole** [KEEP]: Founder and CEO at Doctums

#### Testimonial: Jim Brigadier
`testimonial` | `_id`: `2923a767-955d-457b-abeb-880b0371da74` | document action: **PATCH**
> Mockup. The quote is the teaser of his Mentor interview, and the role repeats his name. No real testimonial text exists, so none is invented.

- **quote** [NEEDS INPUT]
  - was: From his start as a Marine Corps officer to leading an impactful EdTech, Jim Brigadier has navigated a career defined by adaptability and purpose. Now the CEO o…
  - note: Replace with a real client quote, or unpublish this document.
- **authorRole** [NEEDS INPUT]
  - was: Jim Brigadier
  - note: Repeats the author name.
- **client** [NEEDS INPUT]
  - note: No client attached.

#### Testimonial: Erin Grant
`testimonial` | `_id`: `d7359608-f087-48b1-abc2-09ef248cdc18` | document action: **PATCH**
> Quote is legitimate; the company is missing.

- **quote** [KEEP]: The quality of the design was impressive. We're looking forward to continue our collaboration with 27zero.
- **authorRole** [REVIEW]
  - was: Vice President of Marketing
  - note: Add the company (for example "Vice President of Marketing at ...").
- **client** [NEEDS INPUT]
  - note: No client attached.

## 8. Work case studies
Two case studies have real content, and four are not ready. Result numbers have no explanation anywhere in the export, so result descriptions are never invented. The three skeleton case studies should stay out of the live site until their content exists.

#### Case study: Doctums - Brand Evolution and Marketing Partner
`work` | `_id`: `c98c1972-a9c4-49b2-a74f-1cf575113ec3` | document action: **PATCH**
> Strong content. An unpublished draft (drafts.c98c1972...) exists and lacks the projectType links to practices that the published version has: publishing the draft would drop them. Discard the draft, not the published version.

- **title** [KEEP]: Doctums - Brand Evolution and Marketing Partner
- **subtitle** [KEEP]: A Brand and Marketing Engine for a Higher Education Consultancy Where Deep Expertise Finally Got a Name of Its Own
- **headline** [KEEP]: From Behind the Partners to In Front of the Market 
- **briefParagraph** [KEEP]: Doctums is a higher education technology consulting firm built to make technology work for higher education. Founded by experts in IT, EdTech, and the academic and administrative functions that keep universities running, it helps institutions across the U.S., Canada, and Latin America optimize their operations, systems, and student experience.\n\nFor years, most of their work reached universities through tier-one con…
- **agencyRole** [REPLACE]: Strategic Foundations - Brand & Identity - UX/UI & Web Design - Brand Salience and Reputation - Demand Generation
  - was: Strategic Services - Brand & Identity - UX/UI & Web Design - Content Marketing - Demand Generation - Sales Enablement
  - note: Used the previous category names and Sales Enablement, which is no longer a service category. Decide whether to describe the sales work in plain language instead.
- **challenge / communicationChallenge / solution / contentSections** [KEEP]: (long-form text, legitimate, untouched)
- **results[0].description** [NEEDS INPUT]
  - was: dfadfadfad
  - note: Keyboard mash next to the number 1. The numbers have no label anywhere in the case; supply what each one measures.
- **results[1].description** [NEEDS INPUT]
  - was: fadfadfad
  - note: Keyboard mash next to the number 10. The numbers have no label anywhere in the case; supply what each one measures.
- **results[2].description** [NEEDS INPUT]
  - was: fadfadfadfadfads
  - note: Keyboard mash next to the number 76. The numbers have no label anywhere in the case; supply what each one measures.
- **results[3].description** [NEEDS INPUT]
  - was: gadfadfadfa
  - note: Keyboard mash next to the number 94. The numbers have no label anywhere in the case; supply what each one measures.
- **category** [REVIEW]
  - note: All six case studies point at the legacy "Marketing Programs" category (default, not a deliberate choice). Suggested: Brand & Identity or Strategic Foundations.

#### Doctums draft twin
`work` | `_id`: `drafts.c98c1972-a9c4-49b2-a74f-1cf575113ec3` | document action: **DELETE**
> Discard once the published version is confirmed (see above).

- **(document)** [DELETE]

#### Case study: Student First - Website
`work` | `_id`: `017a3de8-b4e5-4468-8f94-0962d84ee341` | document action: **PATCH**
> Strong long-form content with placeholder metadata and results.

- **title** [KEEP]: Student First - Website
- **subtitle** [KEEP]: Showing the Future in the Present A SaaS Website for a Future-Ready SIS Where Product and Marketing Grew Together  
- **headline** [KEEP]: Brand-to-web strategy and execution
- **briefParagraph** [KEEP]: Student First entered the Student Information System market with a modern product, experienced founders, and the problem every new EdTech platform runs into: the category runs on trust, and trust takes years. Institutions replace an SIS once in a generation.
- **slug.current** [REPLACE]: student-first-website
  - was: showing-the-future-in-the-present-a-saas-website-for-a-future-ready-sis-where-product-and
  - note: Slug was cut from the subtitle at 90 characters. Staging-only today; the old slug is referenced by the Netlify nav URLs that are being replaced. | URL FLAG: this change moves an existing page URL, so it needs a 301 redirect
- **agencyRole** [REPLACE]: Strategic Foundations - Brand & Identity - UX/UI & Web Design
  - was:  27zero Role: dafdvadafds adgadfadfa dafdfad
  - note: Keyboard mash. Grounded in 27zero articles: Student First's brand was built from identity, positioning, messaging architecture and website, in under two months.
- **projectType** [REVIEW]: Brand Evolution (reference: edtechMarketingPractice-brand-evolution)
  - note: Empty. Alternative: New Product Launch, since Student First entered the SIS market with a new product.
- **contentSections[3].title** [REPLACE]: 
  - was: Final one single image
  - note: Placeholder title on an image-only section. Clear it, or give it a real caption.
- **results[0].description** [NEEDS INPUT]
  - was: Lorem Ipsum is simply dummy text...
  - note: Number 20%: supply what it measures.
- **results[1].description** [NEEDS INPUT]
  - was: Lorem Ipsum is simply dummy text...
  - note: Number 1K: supply what it measures.
- **results[2].description** [NEEDS INPUT]
  - was: Lorem Ipsum is simply dummy text...
  - note: Number 95%: supply what it measures.
- **results[3].description** [FIX]: Pipeline generated in 2025
  - was: Pipilne gereated on 2025
  - note: Typos only. Confirm whether 2M is a dollar figure.
- **category** [REVIEW]
  - note: Filed under the legacy "Marketing Programs" category. Suggested: UX/UI & Web Design.

#### Case study: Busuu - Video Spotlights
`work` | `_id`: `2f25963f-76d2-4527-add6-75fdc97b3458` | document action: **PATCH**
> Was a mockup shell. Everything below comes from the Busuu case study highlight already published in a 27zero article (it names the engagement, the challenge, what was produced and the outcome). No figures were published, so no numbers are written.

- **title** [KEEP]: Busuu - Video Spotlights
- **headline** [FILL]: Customer Spotlights across Europe
  - was: Headline
  - note: Source: 27zero article "What should I look for when choosing an EdTech marketing agency..." (case study highlight).
- **subtitle** [FILL]: Video Case Studies That Gave a Consumer Language Learning Brand Credibility With Enterprise Buyers
  - note: Empty. Paraphrase of the published highlight.
- **agencyRole** [REVIEW]: Brand Salience and Reputation - Thought Leadership Programs
  - was: Rol
  - note: "Rol" is a placeholder. Customer video case studies map to Case Studies & Proof Assets and to Practitioner & Community Spotlights in the final taxonomy.
- **briefParagraph** [FILL]: Busuu is a well-established consumer language learning brand. It needed to extend that brand into the corporate B2B market, where the challenge was credibility with enterprise buyers.
  - was: Brief
  - note: Source: 27zero article "What should I look for when choosing an EdTech marketing agency..." (case study highlight).
- **challenge.challengeContent** [FILL]: Enterprise buyers in corporate learning evaluate vendors through the voices of their peers. Busuu, known for consumer language learning, needed credible proof from enterprise clients to earn trust in this new market.
  - note: Empty. Source: 27zero article "What should I look for when choosing an EdTech marketing agency..." (case study highlight). Portable Text field: the script converts paragraphs to blocks.
- **communicationChallenge.content** [NEEDS INPUT]
  - note: Not described separately in the published highlight.
- **solution.headline** [FILL]: A standardized production format, ready to replicate worldwide
  - note: Empty. Source: 27zero article "What should I look for when choosing an EdTech marketing agency..." (case study highlight).
- **solution.body** [FILL]: 27zero produced a Customer Spotlights series, filming and editing video case studies featuring Busuu's enterprise clients across Europe, including PUMA and L'Oréal. A standardized production format lets external teams replicate the series around the world.
  - note: Empty. Source: 27zero article "What should I look for when choosing an EdTech marketing agency..." (case study highlight). The client names are already public in that article; confirm Busuu agrees to them appearing in the case study page too.
- **contentSections[0]** [FILL]: title: Our Results | body: The series created a library of social proof assets that gave the Busuu sales team the evidence-based storytelling it needed to earn trust in the corporate learning market.
  - note: Source: 27zero article "What should I look for when choosing an EdTech marketing agency..." (case study highlight).
- **results** [NEEDS INPUT]
  - note: No figures were published. Add them if they exist (for example, number of spotlights produced or markets covered).
- **location** [FILL]: Europe
  - note: From the published highlight ("across Europe").
- **projectType** [FILL]: Community-Led Growth (reference: edtechMarketingPractice-community-led-growth)
  - note: Busuu is already listed as a client of that practice.
- **cta** [FILL]: reference: cta-general-edtech
  - note: Empty; same shared CTA as the other case studies.
- **category** [REVIEW]
  - note: Filed under the legacy "Marketing Programs" category. Suggested: Brand Salience and Reputation.

#### Case study: WorldQuant Learning - Brand Essentials
`work` | `_id`: `a6ae3c3f-5f50-43c8-8f55-c066ef84312c` | document action: **PATCH**
> Mockup shell. 27zero articles describe the engagement in one sentence, which is all that can be written without inventing. Challenge, solution and results need the team.

- **title** [KEEP]: WorldQuant Learning - Brand Essentials
- **headline** [FILL]: Brand and demand generation for a platform that serves universities and the workforce
  - was: headline
  - note: Source: two 27zero articles that describe brand and demand generation work for WorldQuant Learning.
- **briefParagraph** [FILL]: WorldQuant Learning's hands-on technical education platform serves universities and workforce organizations alike. 27zero supports the brand with brand essentials and demand generation.
  - note: Source: two 27zero articles that describe brand and demand generation work for WorldQuant Learning. Extend with what the Brand Essentials package contained for this client.
- **agencyRole** [REVIEW]: Strategic Foundations - Brand & Identity - Demand Generation
  - note: Brand and demand generation per the articles; Brand Essentials means messaging, positioning and identity in the Doctums case.
- **projectType** [FILL]: Brand Evolution (reference: edtechMarketingPractice-brand-evolution)
  - note: WorldQuant Learning is already listed as a client of that practice.
- **cta** [FILL]: reference: cta-general-edtech
  - note: Empty.
- **challenge / communicationChallenge / solution / contentSections / results** [NEEDS INPUT]
  - note: Empty.
- **year / location** [NEEDS INPUT]
  - note: Empty.
- **seo.noIndex** [FIX]: True
  - note: Interim: keep out of search until the story is complete.
- **category** [REVIEW]
  - note: Filed under the legacy "Marketing Programs" category. Suggested: Brand & Identity.

#### Case study: Scholarship Magic - Brand Essentials
`work` | `_id`: `3faa5eb1-24dd-4007-b7fa-73d5c0d276aa` | document action: **PATCH**
> Mockup shell. Nothing published describes this engagement. The only grounded text is what the company does (from the Mentor interview with its CEO).

- **title** [KEEP]: Scholarship Magic - Brand Essentials
- **briefParagraph** [REVIEW]: Scholarship Magic helps higher education institutions maximize the impact of their scholarship management by streamlining operations, uncovering insights hidden in obscure or inaccessible data, and helping obtain additional endowments.
  - note: Describes the client only. Source: Mentor interview intro with Jonathan Fry, CEO. Add what 27zero delivered, then approve.
- **agencyRole** [REVIEW]: Strategic Foundations - Brand & Identity
  - note: Brand Essentials means messaging, positioning and identity in the Doctums case; confirm for this client.
- **headline** [NEEDS INPUT]
  - was: headline
  - note: Placeholder.
- **projectType** [REVIEW]: Brand Evolution (reference: edtechMarketingPractice-brand-evolution)
  - note: Brand Essentials work sits under Brand Evolution; confirm.
- **cta** [FILL]: reference: cta-general-edtech
  - note: Empty.
- **challenge / communicationChallenge / solution / contentSections / results** [NEEDS INPUT]
  - note: Empty.
- **year / location** [NEEDS INPUT]
  - note: Empty.
- **seo.noIndex** [FIX]: True
  - note: Interim: keep out of search until the story exists.
- **category** [REVIEW]
  - note: Filed under the legacy "Marketing Programs" category. Suggested: Brand & Identity.

#### Old case study links found inside articles
`report` | `_id`: `work-links` | document action: **REPORT**
> Article bodies link to case study pages of the old site. Three of those case studies exist in Sanity under a different slug; eight were never migrated. Nothing here is written.

- **/work/student-first  (5 links)** [REVIEW]: /work/student-first-website
  - note: Exists in Sanity under a different slug: rewrite the link or redirect.
- **/work/anthology-marketing-programs  (4 links)** [NEEDS INPUT]
  - note: Case study not in Sanity: migrate it (the Webflow Work collection export would hold the content) or remove the links.
- **/work/d2l-connection-cdmx  (3 links)** [NEEDS INPUT]
  - note: Case study not in Sanity: migrate it (the Webflow Work collection export would hold the content) or remove the links.
- **/work/doctums  (3 links)** [REVIEW]: /work/doctums-brand-evolution-and-marketing-partner
  - note: Exists in Sanity under a different slug: rewrite the link or redirect.
- **/work/anthology-legacy-conversations  (3 links)** [NEEDS INPUT]
  - note: Case study not in Sanity: migrate it (the Webflow Work collection export would hold the content) or remove the links.
- **/work/uplanner-brand  (3 links)** [NEEDS INPUT]
  - note: Case study not in Sanity: migrate it (the Webflow Work collection export would hold the content) or remove the links.
- **/work/uplanner-customer-spotlight  (2 links)** [NEEDS INPUT]
  - note: Case study not in Sanity: migrate it (the Webflow Work collection export would hold the content) or remove the links.
- **/work/ellucian-edtech-sessions-experience  (2 links)** [NEEDS INPUT]
  - note: Case study not in Sanity: migrate it (the Webflow Work collection export would hold the content) or remove the links.
- **/work/d2l-edtech-sessions  (1 links)** [NEEDS INPUT]
  - note: Case study not in Sanity: migrate it (the Webflow Work collection export would hold the content) or remove the links.
- **/work/busuu  (1 links)** [REVIEW]: /work/busuu-video-spotlights
  - note: Exists in Sanity under a different slug: rewrite the link or redirect.
- **/work/atomic-jolt-marketing-programs  (1 links)** [NEEDS INPUT]
  - note: Case study not in Sanity: migrate it (the Webflow Work collection export would hold the content) or remove the links.

## 9. EdTech Marketing: Practices (9)
Practice copy is the version approved earlier and already loaded; it is kept as is. The edits are: the new relatedServices lists (they point at the final services), one missing CTA link, one em dash, and the title suffix. Every list item below is a reference to a service by title.

#### Practice: Brand Evolution
`edtechMarketingPractice` | `_id`: `edtechMarketingPractice-brand-evolution` | document action: **PATCH**
> All other fields (title, practiceName, shortDescription, cardCtaLabel, hero, intro, capabilities, clients, practice scopes, CTA, order) are legitimate: KEEP.

- **relatedServices** [REPLACE]: Brand Strategy | Visual Identity | Naming | Brand Storytelling | Design Systems | Website Design | Website Adjustments or Updates
  - was: Brand Strategy | Visual Identity | Naming | Brand Storytelling | Website Design | Website Adjustments or Updates
  - note: Points at the final service catalog (some previous targets are removed or renamed).
- **seo.title** [STYLE]: Brand Evolution | 27zero
  - was: Brand Evolution — 27zero
  - note: Em dash replaced by a pipe, consistent with the rest of the site.
- **seo.description** [KEEP]: A brand and website that reflect who your company has actually become, whether that's evolving it, growing it up, or expressing it consistently.

#### Practice: Community-Led Growth
`edtechMarketingPractice` | `_id`: `edtechMarketingPractice-community-led-growth` | document action: **PATCH**
> All other fields (title, practiceName, shortDescription, cardCtaLabel, hero, intro, capabilities, clients, practice scopes, CTA, order) are legitimate: KEEP.

- **relatedServices** [REPLACE]: Content Strategy | Content Production | Case Studies & Proof Assets | Branded Interview Series | Practitioner & Community Spotlights
  - was: Content Strategy | Content Production | Case Studies & Proof Assets | Thought Leadership & Executive Content
  - note: Points at the final service catalog (some previous targets are removed or renamed).
- **capabilities[5]** [STYLE]: Interview series: Essentials, Founders, Investor
  - was: Interview series — Essentials, Founders, Investor
  - note: Em dash removed.
- **seo.title** [STYLE]: Community-Led Growth | 27zero
  - was: Community-Led Growth — 27zero
  - note: Em dash replaced by a pipe, consistent with the rest of the site.
- **seo.description** [KEEP]: Turn the users, customers, and practitioners who already love your product into testimonials, referrals, and thought leadership built from their voices.

#### Practice: Marketing Momentum
`edtechMarketingPractice` | `_id`: `edtechMarketingPractice-marketing-momentum` | document action: **PATCH**
> All other fields (title, practiceName, shortDescription, cardCtaLabel, hero, intro, capabilities, clients, practice scopes, CTA, order) are legitimate: KEEP.

- **relatedServices** [REPLACE]: Marketing Automation Setup & Management | CRM Management | Campaign Orchestration | Contact Data Hygiene & Governance
  - was: Marketing Automation Setup & Management | CRM Management | Campaign Orchestration
  - note: Points at the final service catalog (some previous targets are removed or renamed).
- **seo.title** [STYLE]: Marketing Momentum | 27zero
  - was: Marketing Momentum — 27zero
  - note: Em dash replaced by a pipe, consistent with the rest of the site.
- **seo.description** [KEEP]: A written marketing operating model for your team, covering objectives, processes, communication, and technology, with 27zero staying on to run it.

#### Practice: GTM Strategy
`edtechMarketingPractice` | `_id`: `edtechMarketingPractice-gtm-strategy` | document action: **PATCH**
> All other fields (title, practiceName, shortDescription, cardCtaLabel, hero, intro, capabilities, clients, practice scopes, CTA, order) are legitimate: KEEP.

- **relatedServices** [REPLACE]: GTM / Marketing Audit | Positioning & Messaging Foundation | Buyer Decode | GTM Playbooks | Campaigns
  - was: GTM / Marketing Audit | Positioning & Messaging Foundation | Buyer Decode | GTM Playbooks & Launch Campaigns
  - note: Points at the final service catalog (some previous targets are removed or renamed).
- **seo.title** [STYLE]: GTM Strategy | 27zero
  - was: GTM Strategy — 27zero
  - note: Em dash replaced by a pipe, consistent with the rest of the site.
- **seo.description** [KEEP]: One connected go-to-market plan, positioning through channel strategy, with 27zero staying on to execute it, not just hand over a document.

#### Practice: New Product Launch
`edtechMarketingPractice` | `_id`: `68e3abb4-519f-4bc7-9ab7-6080e19ec8c1` | document action: **PATCH**
> All other fields (title, practiceName, shortDescription, cardCtaLabel, hero, intro, capabilities, clients, practice scopes, CTA, order) are legitimate: KEEP.

- **relatedServices** [REPLACE]: GTM Playbooks | Campaigns | Paid Media | Content Production | Account Activation Events
  - was: GTM Playbooks & Launch Campaigns | Paid Media / ABM | Content Production | Account Activation Events
  - note: Points at the final service catalog (some previous targets are removed or renamed).
- **ctaHref** [FILL]: /contact
  - note: Empty. | URL FLAG: assumes a route that must exist in the new site
- **seo.title** [STYLE]: New Product Launch | 27zero
  - was: New Product Launch — 27zero
  - note: Em dash replaced by a pipe, consistent with the rest of the site.
- **seo.description** [KEEP]: An integrated launch plan across sales, marketing, and product, with 27zero running the campaigns, content, and events through the launch window.

#### Practice: New Market Entry
`edtechMarketingPractice` | `_id`: `edtechMarketingPractice-new-market-entry` | document action: **PATCH**
> All other fields (title, practiceName, shortDescription, cardCtaLabel, hero, intro, capabilities, clients, practice scopes, CTA, order) are legitimate: KEEP.

- **relatedServices** [REPLACE]: GTM / Marketing Audit | Buyer Decode | Keyword & Topic Research | Account Selection & Tiering | Account-Based Advertising | Regional Event Programs
  - was: GTM / Marketing Audit | Buyer Decode | SEO | AEO | Paid Media / ABM
  - note: Points at the final service catalog (some previous targets are removed or renamed).
- **seo.title** [STYLE]: New Market Entry | 27zero
  - was: New Market Entry — 27zero
  - note: Em dash replaced by a pipe, consistent with the rest of the site.
- **seo.description** [KEEP]: An integrated go-to-market plan for a new geography, with 27zero running the campaigns and content that bring it to life locally.

#### Practice: New Segment Entry
`edtechMarketingPractice` | `_id`: `edtechMarketingPractice-new-segment-entry` | document action: **PATCH**
> All other fields (title, practiceName, shortDescription, cardCtaLabel, hero, intro, capabilities, clients, practice scopes, CTA, order) are legitimate: KEEP.

- **relatedServices** [REPLACE]: Buyer Decode | Account Prospecting | Account-Based Advertising | Email & Marketing Automation
  - was: Buyer Decode | Paid Media / ABM | Email & Marketing Automation
  - note: Points at the final service catalog (some previous targets are removed or renamed).
- **seo.title** [STYLE]: New Segment Entry | 27zero
  - was: New Segment Entry — 27zero
  - note: Em dash replaced by a pipe, consistent with the rest of the site.
- **seo.description** [KEEP]: Positioning, personas, and a campaign built and run for a buyer segment you haven't cracked, from Higher Ed into K-12 or Corporate Learning.

#### Practice: Product Adoption
`edtechMarketingPractice` | `_id`: `edtechMarketingPractice-product-adoption` | document action: **PATCH**
> All other fields (title, practiceName, shortDescription, cardCtaLabel, hero, intro, capabilities, clients, practice scopes, CTA, order) are legitimate: KEEP.

- **relatedServices** [REPLACE]: Email & Marketing Automation | Case Studies & Proof Assets | Newsletter Program
  - was: Email & Marketing Automation | Case Studies & Proof Assets | Sales Assets & Experiences
  - note: Points at the final service catalog (some previous targets are removed or renamed).
- **seo.title** [STYLE]: Product Adoption | 27zero
  - was: Product Adoption — 27zero
  - note: Em dash replaced by a pipe, consistent with the rest of the site.
- **seo.description** [KEEP]: A usage and adoption diagnostic, run by 27zero and aimed at your end users, plus a renewal story backed by real usage data.

#### Practice: Marketing Partner
`edtechMarketingPractice` | `_id`: `edtechMarketingPractice-marketing-partner` | document action: **PATCH**
> All other fields (title, practiceName, shortDescription, cardCtaLabel, hero, intro, capabilities, clients, practice scopes, CTA, order) are legitimate: KEEP.

- **relatedServices** [KEEP]: (empty on purpose: the front end renders "For all")
- **seo.title** [STYLE]: Marketing Partner | 27zero
  - was: Marketing Partner — 27zero
  - note: Em dash replaced by a pipe, consistent with the rest of the site.
- **seo.description** [KEEP]: A coordinated 27zero team, embedded and ongoing, functioning as your marketing department under one strategic direction.

## 10. EdTech Marketing: Services (51)
The final catalog has 51 services in 10 categories. 23 services already exist and keep their copy; 2 of them are renamed and rewritten; 28 are new; 5 existing services are removed. Proof points are empty for all 51 services: no verified case exists yet for any of them, so none is written. Category values are the slugs the dropdown must accept. The combined SEO, AEO & GEO category groups three disciplines; they are identifiable by service title because the schema has no sub-group field.

#### [Strategic Foundations] GTM / Marketing Audit
`edtechMarketingService` | `_id`: `edtechMarketingService-gtm-marketing-audit` | document action: **PATCH**
> All other fields (title, description, intro, features, CTA, seo.description) are legitimate: KEEP.

- **category** [REPLACE]: strategic-foundations
  - was: strategic-services
  - note: Category taxonomy update.
- **seo.title** [STYLE]: GTM / Marketing Audit | 27zero
  - was: GTM / Marketing Audit — 27zero
  - note: Em dash replaced by a pipe.

#### [Strategic Foundations] Positioning & Messaging Foundation
`edtechMarketingService` | `_id`: `edtechMarketingService-positioning-messaging-foundation` | document action: **PATCH**
> All other fields (title, description, intro, features, CTA, seo.description) are legitimate: KEEP.

- **category** [REPLACE]: strategic-foundations
  - was: strategic-services
  - note: Category taxonomy update.
- **seo.title** [STYLE]: Positioning & Messaging Foundation | 27zero
  - was: Positioning & Messaging Foundation — 27zero
  - note: Em dash replaced by a pipe.

#### [Strategic Foundations] Buyer Decode
`edtechMarketingService` | `_id`: `edtechMarketingService-buyer-decode` | document action: **PATCH**
> All other fields (title, description, intro, features, CTA, seo.description) are legitimate: KEEP.

- **category** [REPLACE]: strategic-foundations
  - was: strategic-services
  - note: Category taxonomy update.
- **seo.title** [STYLE]: Buyer Decode | 27zero
  - was: Buyer Decode — 27zero
  - note: Em dash replaced by a pipe.

#### [Brand & Identity] Brand Strategy
`edtechMarketingService` | `_id`: `edtechMarketingService-brand-strategy` | document action: **PATCH**
> All other fields (title, description, intro, features, CTA, seo.description) are legitimate: KEEP.

- **category** [KEEP]: brand-identity
- **seo.title** [STYLE]: Brand Strategy | 27zero
  - was: Brand Strategy — 27zero
  - note: Em dash replaced by a pipe.

#### [Brand & Identity] Visual Identity
`edtechMarketingService` | `_id`: `edtechMarketingService-visual-identity` | document action: **PATCH**
> All other fields (title, description, intro, features, CTA, seo.description) are legitimate: KEEP.

- **category** [KEEP]: brand-identity
- **seo.title** [STYLE]: Visual Identity | 27zero
  - was: Visual Identity — 27zero
  - note: Em dash replaced by a pipe.

#### [Brand & Identity] Naming
`edtechMarketingService` | `_id`: `edtechMarketingService-naming` | document action: **PATCH**
> All other fields (title, description, intro, features, CTA, seo.description) are legitimate: KEEP.

- **category** [KEEP]: brand-identity
- **seo.title** [STYLE]: Naming | 27zero
  - was: Naming — 27zero
  - note: Em dash replaced by a pipe.

#### [Brand & Identity] Brand Storytelling
`edtechMarketingService` | `_id`: `edtechMarketingService-brand-storytelling` | document action: **PATCH**
> All other fields (title, description, intro, features, CTA, seo.description) are legitimate: KEEP.

- **category** [KEEP]: brand-identity
- **seo.title** [STYLE]: Brand Storytelling | 27zero
  - was: Brand Storytelling — 27zero
  - note: Em dash replaced by a pipe.

#### [Brand & Identity] Design Systems
`edtechMarketingService` | `_id`: `edtechMarketingService-design-systems` | document action: **CREATE**

- **title** [NEW]: Design Systems
- **slug.current** [NEW]: design-systems
  - note: Page URL: /edtech-marketing/services/design-systems
- **category** [NEW]: brand-identity
- **iconId** [NEW]: quatrefoil
- **description** [NEW]: A reusable library of components, patterns, and guidelines that keeps every digital touchpoint on brand as your team and product grow.
- **introTitle** [NEW]: One system, every touchpoint.
- **introDescription** [NEW]: As an EdTech company adds products, pages, and people, small design decisions multiply and consistency fades. A design system gathers colors, typography, components, and interaction patterns into one shared library, so designers, developers, and marketers build faster and the brand looks like itself everywhere.
- **featuresTitle** [NEW]: What this looks like
- **features[0].title** [NEW]: Audit and inventory
- **features[0].description** [NEW]: A review of the interfaces, templates, and assets already in use, so the system starts from what the brand actually needs.
- **features[1].title** [NEW]: Components and patterns
- **features[1].description** [NEW]: A library of reusable elements, from buttons and forms to page layouts, documented with clear rules for use.
- **features[2].title** [NEW]: Documentation and handoff
- **features[2].description** [NEW]: Guidelines and design files organized for designers and developers, with onboarding that helps teams adopt the system.
- **proofPointTitle** [NEW]: Proof Point
- **proofPointDescription** [NEEDS INPUT]
  - note: No verified case yet.
- **ctaTitle** [NEW]: Build a system your whole team can design with.
- **ctaLabel** [NEW]: Book a strategy session
- **ctaHref** [NEW]: /contact
- **seo.title** [NEW]: Design Systems | 27zero
- **seo.description** [NEW]: A reusable library of components, patterns, and guidelines that keeps every digital touchpoint on brand as your team and product grow.

#### [UX/UI & Web Design] Website Design
`edtechMarketingService` | `_id`: `edtechMarketingService-website-design` | document action: **PATCH**
> All other fields (title, description, intro, features, CTA, seo.description) are legitimate: KEEP.

- **category** [KEEP]: ux-ui-web-design
- **seo.title** [STYLE]: Website Design | 27zero
  - was: Website Design — 27zero
  - note: Em dash replaced by a pipe.

#### [UX/UI & Web Design] Website Adjustments or Updates
`edtechMarketingService` | `_id`: `4780e41c-97ca-44de-856e-405208aac271` | document action: **PATCH**
> All other fields (title, description, intro, features, CTA, seo.description) are legitimate: KEEP.

- **category** [KEEP]: ux-ui-web-design
- **seo.title** [STYLE]: Website Adjustments or Updates | 27zero
  - was: Website Adjustments or Updates — 27zero
  - note: Em dash replaced by a pipe.

#### [UX/UI & Web Design] Interactive Digital Experiences
`edtechMarketingService` | `_id`: `edtechMarketingService-interactive-digital-experiences` | document action: **PATCH**
> All other fields (title, description, intro, features, CTA, seo.description) are legitimate: KEEP.

- **category** [KEEP]: ux-ui-web-design
- **seo.title** [STYLE]: Interactive Digital Experiences | 27zero
  - was: Interactive Digital Experiences — 27zero
  - note: Em dash replaced by a pipe.

#### [UX/UI & Web Design] Conversion Rate Optimization
`edtechMarketingService` | `_id`: `edtechMarketingService-conversion-rate-optimization` | document action: **PATCH**
> All other fields (title, description, intro, features, CTA, seo.description) are legitimate: KEEP.

- **category** [KEEP]: ux-ui-web-design
- **seo.title** [STYLE]: Conversion Rate Optimization | 27zero
  - was: Conversion Rate Optimization — 27zero
  - note: Em dash replaced by a pipe.

#### [Brand Salience and Reputation] Content Strategy
`edtechMarketingService` | `_id`: `edtechMarketingService-content-strategy` | document action: **PATCH**
> All other fields (title, description, intro, features, CTA, seo.description) are legitimate: KEEP.

- **category** [REPLACE]: brand-salience-reputation
  - was: content-marketing
  - note: Category taxonomy update.
- **seo.title** [STYLE]: Content Strategy | 27zero
  - was: Content Strategy — 27zero
  - note: Em dash replaced by a pipe.

#### [Brand Salience and Reputation] Content Production
`edtechMarketingService` | `_id`: `edtechMarketingService-content-production` | document action: **PATCH**
> All other fields (title, description, intro, features, CTA, seo.description) are legitimate: KEEP.

- **category** [REPLACE]: brand-salience-reputation
  - was: content-marketing
  - note: Category taxonomy update.
- **seo.title** [STYLE]: Content Production | 27zero
  - was: Content Production — 27zero
  - note: Em dash replaced by a pipe.

#### [Brand Salience and Reputation] Social Media Management
`edtechMarketingService` | `_id`: `edtechMarketingService-social-media-management` | document action: **CREATE**

- **title** [NEW]: Social Media Management
- **slug.current** [NEW]: social-media-management
  - note: Page URL: /edtech-marketing/services/social-media-management
- **category** [NEW]: brand-salience-reputation
- **iconId** [NEW]: arc
- **description** [NEW]: A consistent, on-brand social presence that keeps your company in front of the EdTech buyers who matter, week after week.
- **introTitle** [NEW]: Be the name they think of first.
- **introDescription** [NEW]: EdTech buyers meet your brand in small moments, long before they fill out a form. A steady social presence builds mental availability, so when a need appears, your company is already familiar. We plan, create, publish, and manage the channels where EdTech decision-makers and practitioners spend their time.
- **featuresTitle** [NEW]: What this looks like
- **features[0].title** [NEW]: Channel and content strategy
- **features[0].description** [NEW]: A plan for which channels to use, what to say, and how often, built around your audiences and your category.
- **features[1].title** [NEW]: Content creation and publishing
- **features[1].description** [NEW]: Posts, visuals, video clips, and carousels produced on a regular cadence and published across your channels.
- **features[2].title** [NEW]: Community management and reporting
- **features[2].description** [NEW]: Timely replies and engagement with your audience, plus reporting on reach, engagement, and growth.
- **proofPointTitle** [NEW]: Proof Point
- **proofPointDescription** [NEEDS INPUT]
  - note: No verified case yet.
- **ctaTitle** [NEW]: Keep your brand in front of EdTech buyers every week.
- **ctaLabel** [NEW]: Book a strategy session
- **ctaHref** [NEW]: /contact
- **seo.title** [NEW]: Social Media Management | 27zero
- **seo.description** [NEW]: A consistent, on-brand social presence that keeps your company in front of the EdTech buyers who matter, week after week.

#### [Brand Salience and Reputation] Newsletter Program
`edtechMarketingService` | `_id`: `edtechMarketingService-newsletter-program` | document action: **CREATE**

- **title** [NEW]: Newsletter Program
- **slug.current** [NEW]: newsletter-program
  - note: Page URL: /edtech-marketing/services/newsletter-program
- **category** [NEW]: brand-salience-reputation
- **iconId** [NEW]: asterisk
- **description** [NEW]: A recurring newsletter that earns a regular place in your audience's inbox and keeps your brand top of mind.
- **introTitle** [NEW]: A regular reason to hear from you.
- **introDescription** [NEW]: A well-run newsletter is one of the most reliable ways to stay present with prospects, customers, and partners between sales conversations. We define the editorial approach, produce each issue, and manage distribution, drawing on the practices behind The EdTech Mentor newsletter.
- **featuresTitle** [NEW]: What this looks like
- **features[0].title** [NEW]: Editorial strategy
- **features[0].description** [NEW]: A clear purpose, voice, and structure for each issue, tied to what your audience wants to learn.
- **features[1].title** [NEW]: Production and design
- **features[1].description** [NEW]: Writing, curation, and email design for every issue, ready to send on a steady cadence.
- **features[2].title** [NEW]: Distribution and analytics
- **features[2].description** [NEW]: List growth, sending, and performance reporting that shows what readers open, click, and share.
- **proofPointTitle** [NEW]: Proof Point
- **proofPointDescription** [NEEDS INPUT]
  - note: No verified case yet.
- **ctaTitle** [NEW]: Earn a place in your audience's inbox.
- **ctaLabel** [NEW]: Book a strategy session
- **ctaHref** [NEW]: /contact
- **seo.title** [NEW]: Newsletter Program | 27zero
- **seo.description** [NEW]: A recurring newsletter that earns a regular place in your audience's inbox and keeps your brand top of mind.

#### [Brand Salience and Reputation] Case Studies & Proof Assets
`edtechMarketingService` | `_id`: `edtechMarketingService-case-studies-proof-assets` | document action: **PATCH**
> All other fields (title, description, intro, features, CTA, seo.description) are legitimate: KEEP.

- **category** [REPLACE]: brand-salience-reputation
  - was: content-marketing
  - note: Category taxonomy update.
- **seo.title** [STYLE]: Case Studies & Proof Assets | 27zero
  - was: Case Studies & Proof Assets — 27zero
  - note: Em dash replaced by a pipe.

#### [Demand Generation] Paid Media
`edtechMarketingService` | `_id`: `edtechMarketingService-paid-media-abm` | document action: **PATCH**
> Existing document renamed and rewritten (the old copy mentioned ABM, which is now its own category).

- **title** [REPLACE]: Paid Media
  - was: Paid Media / ABM
- **slug.current** [REPLACE]: paid-media
  - was: paid-media-abm
  - note: Changes the page URL. | URL FLAG: this change moves an existing page URL, so it needs a 301 redirect
- **category** [KEEP]: demand-generation
- **description** [REPLACE]: Paid search and social campaigns that put your message in front of the right EdTech audiences, with reporting tied back to pipeline.
  - was: Paid search, social, and account-based marketing targeted at the specific institutions and decision-makers that matter most.
- **introTitle** [REPLACE]: Reach the audiences that move your pipeline.
  - was: Reach the accounts that matter, not just an audience.
- **introDescription** [REPLACE]: Paid media works best when targeting, message, and measurement are designed together. We run paid search and social campaigns for EdTech buyers and tie reporting back to leads and pipeline, so spend can be adjusted with evidence.
  - was: Broad demographic targeting wastes spend reaching people who were never going to buy. This service runs paid search, social, and account-based campaigns targete…
- **features[0].title** [REPLACE]: Audience targeting
  - was: Audience and account targeting
- **features[0].description** [REPLACE]: Built around the roles, institutions, and segments worth reaching.
  - was: Built from the specific institutions and buying groups worth reaching.
- **features[1..2]** [KEEP]: (unchanged)
- **ctaTitle** [REPLACE]: Reach the audiences that actually matter.
  - was: Reach the accounts that actually matter.
- **seo.title** [REPLACE]: Paid Media | 27zero
  - was: Paid Media / ABM — 27zero
- **seo.description** [REPLACE]: Paid search and social campaigns that put your message in front of the right EdTech audiences, with reporting tied back to pipeline.
  - was: Paid search, social, and account-based marketing campaigns targeted at the specific institutions and decision-makers that matter most.

#### [Demand Generation] Email & Marketing Automation
`edtechMarketingService` | `_id`: `edtechMarketingService-email-marketing-automation` | document action: **PATCH**
> All other fields (title, description, intro, features, CTA, seo.description) are legitimate: KEEP.

- **category** [KEEP]: demand-generation
- **seo.title** [STYLE]: Email & Marketing Automation | 27zero
  - was: Email & Marketing Automation — 27zero
  - note: Em dash replaced by a pipe.

#### [Demand Generation] GTM Playbooks
`edtechMarketingService` | `_id`: `edtechMarketingService-gtm-playbooks-launch-campaigns` | document action: **PATCH**
> Existing document renamed and rewritten (split into GTM Playbooks and the new Campaigns service).

- **title** [REPLACE]: GTM Playbooks
  - was: GTM Playbooks & Launch Campaigns
- **slug.current** [REPLACE]: gtm-playbooks
  - was: gtm-playbooks-launch-campaigns
  - note: Changes the page URL. | URL FLAG: this change moves an existing page URL, so it needs a 301 redirect
- **category** [KEEP]: demand-generation
- **description** [REPLACE]: A sequenced playbook that turns your go-to-market strategy into channels, timelines, and assets your teams can run.
  - was: A concrete, sequenced campaign that puts your go-to-market strategy into motion, not a document that stays on a shelf.
- **introTitle** [REPLACE]: The strategy, translated into a playbook.
  - was: The plan, translated into a campaign.
- **introDescription** [REPLACE]: A go-to-market strategy becomes real when it has a sequence, owners, and assets. The playbook translates positioning, audiences, and goals into channels, timelines, and a production plan, so sales, marketing, and product work from the same page.
  - was: A go-to-market strategy that's already defined still needs to become an executable campaign, channels, timeline, assets, sequencing, before it does anything. Th…
- **features[0].title** [REPLACE]: Playbook design
  - was: Campaign planning and timeline
- **features[0].description** [REPLACE]: Sequencing the strategy into stages, owners, and timelines.
  - was: Sequencing the plan into an executable timeline.
- **features[1].title** [REPLACE]: Channel selection
  - was: Channel selection
- **features[1].description** [REPLACE]: Choosing the channels the playbook will run on, based on where your buyers pay attention.
  - was: Choosing the channels the campaign will actually run on.
- **features[2].title** [REPLACE]: Asset planning and coordination
  - was: Asset coordination and launch support
- **features[2].description** [REPLACE]: A complete asset list, with production coordinated against the timeline.
  - was: Coordinating the asset list and supporting execution through launch.
- **ctaTitle** [REPLACE]: Put your go-to-market strategy into motion.
  - was: Put your go-to-market strategy into motion.
- **seo.title** [REPLACE]: GTM Playbooks | 27zero
  - was: GTM Playbooks & Launch Campaigns — 27zero
- **seo.description** [REPLACE]: A sequenced playbook that turns your go-to-market strategy into channels, timelines, and assets your teams can run.
  - was: A concrete, sequenced campaign that puts your go-to-market strategy into motion, not a strategy document that stays on a shelf.

#### [Demand Generation] Campaigns
`edtechMarketingService` | `_id`: `edtechMarketingService-campaigns` | document action: **CREATE**

- **title** [NEW]: Campaigns
- **slug.current** [NEW]: campaigns
  - note: Page URL: /edtech-marketing/services/campaigns
- **category** [NEW]: demand-generation
- **iconId** [NEW]: arc
- **description** [NEW]: Integrated campaigns, planned, produced, and launched across channels around a clear audience and a measurable goal.
- **introTitle** [NEW]: Every channel, one idea.
- **introDescription** [NEW]: From a product launch to an always-on demand program, a campaign works when message, channel, and timing reinforce each other. We plan the concept, produce the assets, launch across channels, and report on results.
- **featuresTitle** [NEW]: What this looks like
- **features[0].title** [NEW]: Concept and planning
- **features[0].description** [NEW]: A campaign idea, audience, and goal, with a calendar that sequences every touchpoint.
- **features[1].title** [NEW]: Creative and production
- **features[1].description** [NEW]: Messaging, content, and design produced for each channel in the plan.
- **features[2].title** [NEW]: Launch and optimization
- **features[2].description** [NEW]: Coordinated launch, then performance tracking and adjustments while the campaign runs.
- **proofPointTitle** [NEW]: Proof Point
- **proofPointDescription** [NEEDS INPUT]
  - note: No verified case yet.
- **ctaTitle** [NEW]: Launch a campaign built around one clear idea.
- **ctaLabel** [NEW]: Book a strategy session
- **ctaHref** [NEW]: /contact
- **seo.title** [NEW]: Campaigns | 27zero
- **seo.description** [NEW]: Integrated campaigns, planned, produced, and launched across channels around a clear audience and a measurable goal.

#### [Marketing Operations] Marketing Automation Setup & Management
`edtechMarketingService` | `_id`: `edtechMarketingService-marketing-automation-setup-management` | document action: **PATCH**
> All other fields (title, description, intro, features, CTA, seo.description) are legitimate: KEEP.

- **category** [KEEP]: marketing-operations
- **seo.title** [STYLE]: Marketing Automation Setup & Management | 27zero
  - was: Marketing Automation Setup & Management — 27zero
  - note: Em dash replaced by a pipe.

#### [Marketing Operations] CRM Management
`edtechMarketingService` | `_id`: `edtechMarketingService-crm-management` | document action: **PATCH**
> All other fields (title, description, intro, features, CTA, seo.description) are legitimate: KEEP.

- **category** [KEEP]: marketing-operations
- **seo.title** [STYLE]: CRM Management | 27zero
  - was: CRM Management — 27zero
  - note: Em dash replaced by a pipe.

#### [Marketing Operations] Campaign Orchestration
`edtechMarketingService` | `_id`: `edtechMarketingService-campaign-orchestration` | document action: **PATCH**
> All other fields (title, description, intro, features, CTA, seo.description) are legitimate: KEEP.

- **category** [KEEP]: marketing-operations
- **seo.title** [STYLE]: Campaign Orchestration | 27zero
  - was: Campaign Orchestration — 27zero
  - note: Em dash replaced by a pipe.

#### [Marketing Operations] Contact Data Hygiene & Governance
`edtechMarketingService` | `_id`: `edtechMarketingService-contact-data-hygiene-governance` | document action: **CREATE**

- **title** [NEW]: Contact Data Hygiene & Governance
- **slug.current** [NEW]: contact-data-hygiene-governance
  - note: Page URL: /edtech-marketing/services/contact-data-hygiene-governance
- **category** [NEW]: marketing-operations
- **iconId** [NEW]: asterisk
- **description** [NEW]: Ongoing care for your contact database, following the data policies and attributes your organization defines.
- **introTitle** [NEW]: Clean data, kept clean.
- **introDescription** [NEW]: Contact data decays every month as people change roles, institutions merge, and records multiply. This service maintains the quality of your contact base on a continuing basis, working from the fields, formats, and policies your organization defines, including consent and compliance rules.
- **featuresTitle** [NEW]: What this looks like
- **features[0].title** [NEW]: Standards and attribute definitions
- **features[0].description** [NEW]: Required fields, formats, and naming rules documented with your team and applied consistently.
- **features[1].title** [NEW]: Deduplication and standardization
- **features[1].description** [NEW]: Regular cleanup of duplicates, outdated records, and inconsistent values.
- **features[2].title** [NEW]: Governance and reporting
- **features[2].description** [NEW]: Policies for adding and updating records, with reports on data quality over time.
- **proofPointTitle** [NEW]: Proof Point
- **proofPointDescription** [NEEDS INPUT]
  - note: No verified case yet.
- **ctaTitle** [NEW]: Keep your contact data as sharp as your strategy.
- **ctaLabel** [NEW]: Book a strategy session
- **ctaHref** [NEW]: /contact
- **seo.title** [NEW]: Contact Data Hygiene & Governance | 27zero
- **seo.description** [NEW]: Ongoing care for your contact database, following the data policies and attributes your organization defines.

#### [Events & Experiences] Industry Event Presence
`edtechMarketingService` | `_id`: `edtechMarketingService-industry-event-presence` | document action: **PATCH**
> All other fields (title, description, intro, features, CTA, seo.description) are legitimate: KEEP.

- **category** [KEEP]: events-experiences
- **seo.title** [STYLE]: Industry Event Presence | 27zero
  - was: Industry Event Presence — 27zero
  - note: Em dash replaced by a pipe.

#### [Events & Experiences] User Conference Production
`edtechMarketingService` | `_id`: `edtechMarketingService-user-conference-production` | document action: **PATCH**
> All other fields (title, description, intro, features, CTA, seo.description) are legitimate: KEEP.

- **category** [KEEP]: events-experiences
- **seo.title** [STYLE]: User Conference Production | 27zero
  - was: User Conference Production — 27zero
  - note: Em dash replaced by a pipe.

#### [Events & Experiences] Account Activation Events
`edtechMarketingService` | `_id`: `edtechMarketingService-account-activation-events` | document action: **PATCH**
> All other fields (title, description, intro, features, CTA, seo.description) are legitimate: KEEP.

- **category** [KEEP]: events-experiences
- **seo.title** [STYLE]: Account Activation Events | 27zero
  - was: Account Activation Events — 27zero
  - note: Em dash replaced by a pipe.

#### [Events & Experiences] Regional Event Programs
`edtechMarketingService` | `_id`: `edtechMarketingService-regional-event-programs` | document action: **CREATE**

- **title** [NEW]: Regional Event Programs
- **slug.current** [NEW]: regional-event-programs
  - note: Page URL: /edtech-marketing/services/regional-event-programs
- **category** [NEW]: events-experiences
- **iconId** [NEW]: quatrefoil
- **description** [NEW]: Coordinated events and activations across countries and regions, delivered as one program with local adaptation.
- **introTitle** [NEW]: One program, many markets.
- **introDescription** [NEW]: Some clients need the same event formats in several countries at once. We design the program once and run it across territories, from a regional user conference to a series of activations across four Latin American countries, adapting each market for language, venue, and audience while keeping the brand consistent.
- **featuresTitle** [NEW]: What this looks like
- **features[0].title** [NEW]: Program design
- **features[0].description** [NEW]: Formats, calendar, and budget set once for the whole region.
- **features[1].title** [NEW]: Local adaptation
- **features[1].description** [NEW]: Language, venues, speakers, and partners tailored to each market.
- **features[2].title** [NEW]: Coordinated production
- **features[2].description** [NEW]: Logistics, materials, and on-site teams managed through one program team.
- **features[3].title** [NEW]: Reporting across markets
- **features[3].description** [NEW]: Results consolidated across territories, so you see the whole program at a glance.
- **proofPointTitle** [NEW]: Proof Point
- **proofPointDescription** [NEEDS INPUT]
  - note: No verified case yet.
- **ctaTitle** [NEW]: Run your events across the region as one program.
- **ctaLabel** [NEW]: Book a strategy session
- **ctaHref** [NEW]: /contact
- **seo.title** [NEW]: Regional Event Programs | 27zero
- **seo.description** [NEW]: Coordinated events and activations across countries and regions, delivered as one program with local adaptation.

#### [Account-Based Marketing] Account Selection & Tiering
`edtechMarketingService` | `_id`: `edtechMarketingService-account-selection-tiering` | document action: **CREATE**

- **title** [NEW]: Account Selection & Tiering
- **slug.current** [NEW]: account-selection-tiering
  - note: Page URL: /edtech-marketing/services/account-selection-tiering
- **category** [NEW]: account-based-marketing
- **iconId** [NEW]: arc
- **description** [NEW]: A scored, tiered list of target accounts built from fit signals and buying readiness.
- **introTitle** [NEW]: Choose the accounts that deserve your effort.
- **introDescription** [NEW]: Account-based marketing starts with choosing well. We combine your ideal customer profile, fit signals, and intent data where available to select target accounts and sort them into tiers, so effort and budget follow potential.
- **featuresTitle** [NEW]: What this looks like
- **features[0].title** [NEW]: Fit and readiness criteria
- **features[0].description** [NEW]: The signals that mark an institution as a strong fit and ready to buy, defined with your team.
- **features[1].title** [NEW]: Account scoring and tiering
- **features[1].description** [NEW]: Each account scored and placed in a tier, with a clear level of investment attached to each tier.
- **features[2].title** [NEW]: Target list and review cadence
- **features[2].description** [NEW]: A working account list, refreshed on a regular schedule as signals change.
- **proofPointTitle** [NEW]: Proof Point
- **proofPointDescription** [NEEDS INPUT]
  - note: No verified case yet.
- **ctaTitle** [NEW]: Focus your effort on the accounts that matter.
- **ctaLabel** [NEW]: Book a strategy session
- **ctaHref** [NEW]: /contact
- **seo.title** [NEW]: Account Selection & Tiering | 27zero
- **seo.description** [NEW]: A scored, tiered list of target accounts built from fit signals and buying readiness.

#### [Account-Based Marketing] Account Prospecting
`edtechMarketingService` | `_id`: `edtechMarketingService-account-prospecting` | document action: **CREATE**

- **title** [NEW]: Account Prospecting
- **slug.current** [NEW]: account-prospecting
  - note: Page URL: /edtech-marketing/services/account-prospecting
- **category** [NEW]: account-based-marketing
- **iconId** [NEW]: asterisk
- **description** [NEW]: Research and contact identification inside your target accounts, mapped to the roles in each buying group.
- **introTitle** [NEW]: Reach the people behind the account.
- **introDescription** [NEW]: A target account is reachable through its people. We identify the decision-makers, influencers, and users in each account, research their priorities, and organize contacts for outreach that fits the way institutions buy.
- **featuresTitle** [NEW]: What this looks like
- **features[0].title** [NEW]: Buying-group mapping
- **features[0].description** [NEW]: The roles involved in each purchase, from academic leaders to IT and procurement.
- **features[1].title** [NEW]: Contact research and validation
- **features[1].description** [NEW]: Verified contacts with the context needed to start a relevant conversation.
- **features[2].title** [NEW]: Outreach-ready lists
- **features[2].description** [NEW]: Organized contact lists that sales and marketing can act on right away.
- **proofPointTitle** [NEW]: Proof Point
- **proofPointDescription** [NEEDS INPUT]
  - note: No verified case yet.
- **ctaTitle** [NEW]: Put the right contacts inside every target account.
- **ctaLabel** [NEW]: Book a strategy session
- **ctaHref** [NEW]: /contact
- **seo.title** [NEW]: Account Prospecting | 27zero
- **seo.description** [NEW]: Research and contact identification inside your target accounts, mapped to the roles in each buying group.

#### [Account-Based Marketing] Data Enrichment
`edtechMarketingService` | `_id`: `edtechMarketingService-data-enrichment` | document action: **CREATE**

- **title** [NEW]: Data Enrichment
- **slug.current** [NEW]: data-enrichment
  - note: Page URL: /edtech-marketing/services/data-enrichment
- **category** [NEW]: account-based-marketing
- **iconId** [NEW]: quatrefoil
- **description** [NEW]: Richer account and contact records, with firmographic, role, and engagement data added to what you already hold.
- **introTitle** [NEW]: Know who is who.
- **introDescription** [NEW]: Account-based marketing depends on complete information. Data enrichment adds missing details such as institution type, size, technology in use, and contact role to your records, so segmentation, personalization, and scoring work from the full picture.
- **featuresTitle** [NEW]: What this looks like
- **features[0].title** [NEW]: Gap analysis
- **features[0].description** [NEW]: A review of which fields are missing or outdated across your accounts and contacts.
- **features[1].title** [NEW]: Enrichment and validation
- **features[1].description** [NEW]: Missing data added from reliable sources and checked for accuracy.
- **features[2].title** [NEW]: CRM integration
- **features[2].description** [NEW]: Enriched records loaded into your CRM and kept current on a regular schedule.
- **proofPointTitle** [NEW]: Proof Point
- **proofPointDescription** [NEEDS INPUT]
  - note: No verified case yet.
- **ctaTitle** [NEW]: Give every account record the detail it needs.
- **ctaLabel** [NEW]: Book a strategy session
- **ctaHref** [NEW]: /contact
- **seo.title** [NEW]: Data Enrichment | 27zero
- **seo.description** [NEW]: Richer account and contact records, with firmographic, role, and engagement data added to what you already hold.

#### [Account-Based Marketing] Account-Based Advertising
`edtechMarketingService` | `_id`: `edtechMarketingService-account-based-advertising` | document action: **CREATE**

- **title** [NEW]: Account-Based Advertising
- **slug.current** [NEW]: account-based-advertising
  - note: Page URL: /edtech-marketing/services/account-based-advertising
- **category** [NEW]: account-based-marketing
- **iconId** [NEW]: arc
- **description** [NEW]: Paid campaigns aimed at the people inside your target accounts, across the channels they use.
- **introTitle** [NEW]: Spend where the buying committee looks.
- **introDescription** [NEW]: Account-based advertising focuses spend on the institutions and buying groups that matter most. Campaigns reach named accounts and roles with messaging written for their situation, and reporting shows which accounts engage.
- **featuresTitle** [NEW]: What this looks like
- **features[0].title** [NEW]: Account list activation
- **features[0].description** [NEW]: Your target accounts loaded into the ad platforms and matched to the right roles.
- **features[1].title** [NEW]: Account-specific creative
- **features[1].description** [NEW]: Messages and visuals written for the priorities of each tier or segment.
- **features[2].title** [NEW]: Account-level reporting
- **features[2].description** [NEW]: Reporting by account, so you can see who engages and who is ready for follow-up.
- **proofPointTitle** [NEW]: Proof Point
- **proofPointDescription** [NEEDS INPUT]
  - note: No verified case yet.
- **ctaTitle** [NEW]: Reach your target accounts where they already pay attention.
- **ctaLabel** [NEW]: Book a strategy session
- **ctaHref** [NEW]: /contact
- **seo.title** [NEW]: Account-Based Advertising | 27zero
- **seo.description** [NEW]: Paid campaigns aimed at the people inside your target accounts, across the channels they use.

#### [Account-Based Marketing] Account-Based Content & Personalization
`edtechMarketingService` | `_id`: `edtechMarketingService-account-based-content-personalization` | document action: **CREATE**

- **title** [NEW]: Account-Based Content & Personalization
- **slug.current** [NEW]: account-based-content-personalization
  - note: Page URL: /edtech-marketing/services/account-based-content-personalization
- **category** [NEW]: account-based-marketing
- **iconId** [NEW]: asterisk
- **description** [NEW]: Content and experiences tailored to the accounts, roles, and stages that matter most.
- **introTitle** [NEW]: Speak to each account in its own terms.
- **introDescription** [NEW]: Buying groups in education include academic leaders, IT, finance, and procurement, each with different questions. We create content and personalized touchpoints that answer those questions for each target account and role.
- **featuresTitle** [NEW]: What this looks like
- **features[0].title** [NEW]: Account and role messaging
- **features[0].description** [NEW]: Messages mapped to the concerns of each role in the buying group.
- **features[1].title** [NEW]: Tailored content assets
- **features[1].description** [NEW]: Case examples, one-pagers, and briefs shaped for a tier, segment, or named account.
- **features[2].title** [NEW]: Personalized web and email experiences
- **features[2].description** [NEW]: Web pages and emails that adapt to the account and stage of the visitor.
- **proofPointTitle** [NEW]: Proof Point
- **proofPointDescription** [NEEDS INPUT]
  - note: No verified case yet.
- **ctaTitle** [NEW]: Make every touchpoint relevant to the account.
- **ctaLabel** [NEW]: Book a strategy session
- **ctaHref** [NEW]: /contact
- **seo.title** [NEW]: Account-Based Content & Personalization | 27zero
- **seo.description** [NEW]: Content and experiences tailored to the accounts, roles, and stages that matter most.

#### [Account-Based Marketing] Account Engagement Reporting
`edtechMarketingService` | `_id`: `edtechMarketingService-account-engagement-reporting` | document action: **CREATE**

- **title** [NEW]: Account Engagement Reporting
- **slug.current** [NEW]: account-engagement-reporting
  - note: Page URL: /edtech-marketing/services/account-engagement-reporting
- **category** [NEW]: account-based-marketing
- **iconId** [NEW]: quatrefoil
- **description** [NEW]: Clear reporting on how target accounts interact with your brand, so teams can act on real signals.
- **introTitle** [NEW]: See engagement where it counts.
- **introDescription** [NEW]: Success in account-based marketing shows up at the account level. We track engagement across ads, web, email, and events, roll it up by account and tier, and share the signals sales needs to follow up at the right moment.
- **featuresTitle** [NEW]: What this looks like
- **features[0].title** [NEW]: Engagement tracking setup
- **features[0].description** [NEW]: Tracking connected across channels so every interaction maps to an account.
- **features[1].title** [NEW]: Account-level dashboards
- **features[1].description** [NEW]: Dashboards that show engagement by account, tier, and stage.
- **features[2].title** [NEW]: Insights and recommendations
- **features[2].description** [NEW]: Regular readouts with clear next steps for sales and marketing.
- **proofPointTitle** [NEW]: Proof Point
- **proofPointDescription** [NEEDS INPUT]
  - note: No verified case yet.
- **ctaTitle** [NEW]: Turn account engagement into timely action.
- **ctaLabel** [NEW]: Book a strategy session
- **ctaHref** [NEW]: /contact
- **seo.title** [NEW]: Account Engagement Reporting | 27zero
- **seo.description** [NEW]: Clear reporting on how target accounts interact with your brand, so teams can act on real signals.

#### [Thought Leadership Programs] Executive Ghostwriting
`edtechMarketingService` | `_id`: `edtechMarketingService-executive-ghostwriting` | document action: **CREATE**

- **title** [NEW]: Executive Ghostwriting
- **slug.current** [NEW]: executive-ghostwriting
  - note: Page URL: /edtech-marketing/services/executive-ghostwriting
- **category** [NEW]: thought-leadership-programs
- **iconId** [NEW]: arc
- **description** [NEW]: Articles, LinkedIn posts, and bylines written in your executives' voice from short interviews.
- **introTitle** [NEW]: Your leaders' expertise, in their own voice.
- **introDescription** [NEW]: Executives have the expertise and limited time. We interview your leaders, then draft articles, LinkedIn posts, and bylines in their voice, ready for their review, so their perspective reaches the market on a regular schedule.
- **featuresTitle** [NEW]: What this looks like
- **features[0].title** [NEW]: Voice and topic discovery
- **features[0].description** [NEW]: A short set of conversations to capture how each executive thinks, speaks, and what they want to be known for.
- **features[1].title** [NEW]: Interview-based drafting
- **features[1].description** [NEW]: Articles and posts drafted from those conversations, written to sound like the executive.
- **features[2].title** [NEW]: Review and publishing cadence
- **features[2].description** [NEW]: A simple approval flow and a steady publishing calendar across channels.
- **proofPointTitle** [NEW]: Proof Point
- **proofPointDescription** [NEEDS INPUT]
  - note: No verified case yet.
- **ctaTitle** [NEW]: Give your executives a voice the market hears.
- **ctaLabel** [NEW]: Book a strategy session
- **ctaHref** [NEW]: /contact
- **seo.title** [NEW]: Executive Ghostwriting | 27zero
- **seo.description** [NEW]: Articles, LinkedIn posts, and bylines written in your executives' voice from short interviews.

#### [Thought Leadership Programs] Branded Interview Series
`edtechMarketingService` | `_id`: `edtechMarketingService-branded-interview-series` | document action: **CREATE**

- **title** [NEW]: Branded Interview Series
- **slug.current** [NEW]: branded-interview-series
  - note: Page URL: /edtech-marketing/services/branded-interview-series
- **category** [NEW]: thought-leadership-programs
- **iconId** [NEW]: asterisk
- **description** [NEW]: A recurring interview series that gives your brand a platform and your guests a voice, produced from start to finish.
- **introTitle** [NEW]: A conversation worth a series.
- **introDescription** [NEW]: A branded interview series puts industry voices at the center of your content. Modeled on The EdTech Mentor, we handle guest selection, preparation, recording, editing, and distribution, turning each conversation into video, articles, and short clips.
- **featuresTitle** [NEW]: What this looks like
- **features[0].title** [NEW]: Series concept and guest strategy
- **features[0].description** [NEW]: A format, a name, and a guest list built around the topics your audience values.
- **features[1].title** [NEW]: Production and editing
- **features[1].description** [NEW]: Preparation, recording, and post-production, including full video, article, and illustration.
- **features[2].title** [NEW]: Distribution and repurposing
- **features[2].description** [NEW]: Teaser clips, newsletter features, and social cuts that extend each interview.
- **proofPointTitle** [NEW]: Proof Point
- **proofPointDescription** [NEEDS INPUT]
  - note: No verified case yet.
- **ctaTitle** [NEW]: Start a series your audience looks forward to.
- **ctaLabel** [NEW]: Book a strategy session
- **ctaHref** [NEW]: /contact
- **seo.title** [NEW]: Branded Interview Series | 27zero
- **seo.description** [NEW]: A recurring interview series that gives your brand a platform and your guests a voice, produced from start to finish.

#### [Thought Leadership Programs] Webinar Programs
`edtechMarketingService` | `_id`: `edtechMarketingService-webinar-programs` | document action: **CREATE**

- **title** [NEW]: Webinar Programs
- **slug.current** [NEW]: webinar-programs
  - note: Page URL: /edtech-marketing/services/webinar-programs
- **category** [NEW]: thought-leadership-programs
- **iconId** [NEW]: quatrefoil
- **description** [NEW]: Webinars planned, hosted, and promoted to build authority and a qualified audience.
- **introTitle** [NEW]: Teach, and let prospects raise their hands.
- **introDescription** [NEW]: Webinars let experts teach and let prospects show interest. We plan topics, secure speakers, produce the event, promote it, and follow up with attendees, then reuse the recording across channels.
- **featuresTitle** [NEW]: What this looks like
- **features[0].title** [NEW]: Topic and speaker planning
- **features[0].description** [NEW]: A program of topics and speakers chosen for your audience and your goals.
- **features[1].title** [NEW]: Production and promotion
- **features[1].description** [NEW]: Platform setup, run of show, registration pages, and promotion across channels.
- **features[2].title** [NEW]: Follow-up and repurposing
- **features[2].description** [NEW]: Attendee follow-up and recordings turned into clips, articles, and on-demand pages.
- **proofPointTitle** [NEW]: Proof Point
- **proofPointDescription** [NEEDS INPUT]
  - note: No verified case yet.
- **ctaTitle** [NEW]: Host webinars your buyers want to attend.
- **ctaLabel** [NEW]: Book a strategy session
- **ctaHref** [NEW]: /contact
- **seo.title** [NEW]: Webinar Programs | 27zero
- **seo.description** [NEW]: Webinars planned, hosted, and promoted to build authority and a qualified audience.

#### [Thought Leadership Programs] Practitioner & Community Spotlights
`edtechMarketingService` | `_id`: `edtechMarketingService-practitioner-community-spotlights` | document action: **CREATE**

- **title** [NEW]: Practitioner & Community Spotlights
- **slug.current** [NEW]: practitioner-community-spotlights
  - note: Page URL: /edtech-marketing/services/practitioner-community-spotlights
- **category** [NEW]: thought-leadership-programs
- **iconId** [NEW]: arc
- **description** [NEW]: Profiles and stories that put your customers and community members in the spotlight.
- **introTitle** [NEW]: Let your community do the talking.
- **introDescription** [NEW]: Customers and practitioners are the most credible voices in EdTech. We feature them through video profiles, written stories, and short clips, built from their own words, so your community's expertise becomes visible and your brand earns trust through peers.
- **featuresTitle** [NEW]: What this looks like
- **features[0].title** [NEW]: Practitioner selection
- **features[0].description** [NEW]: Choosing the customers and community members whose stories best reflect your value.
- **features[1].title** [NEW]: Story and video production
- **features[1].description** [NEW]: Interviews and edits that capture each person's own words and results.
- **features[2].title** [NEW]: Sharing and amplification
- **features[2].description** [NEW]: Formats for social, email, your site, and sales materials, with the featured guest involved in sharing.
- **proofPointTitle** [NEW]: Proof Point
- **proofPointDescription** [NEEDS INPUT]
  - note: No verified case yet.
- **ctaTitle** [NEW]: Spotlight the people who already believe in you.
- **ctaLabel** [NEW]: Book a strategy session
- **ctaHref** [NEW]: /contact
- **seo.title** [NEW]: Practitioner & Community Spotlights | 27zero
- **seo.description** [NEW]: Profiles and stories that put your customers and community members in the spotlight.

#### [SEO, AEO & GEO] Technical SEO Audit
`edtechMarketingService` | `_id`: `edtechMarketingService-technical-seo-audit` | document action: **CREATE**

- **title** [NEW]: Technical SEO Audit
- **slug.current** [NEW]: technical-seo-audit
  - note: Page URL: /edtech-marketing/services/technical-seo-audit
- **category** [NEW]: seo-aeo-geo
- **iconId** [NEW]: asterisk
- **description** [NEW]: A technical review of your site's crawlability, speed, and structure, with a prioritized fix list.
- **introTitle** [NEW]: Start with a site search engines can read.
- **introDescription** [NEW]: Search visibility begins with a site that search engines can read. The audit examines crawling, indexing, site architecture, page speed, and structured data, then ranks issues by impact so your team knows what to fix first.
- **featuresTitle** [NEW]: What this looks like
- **features[0].title** [NEW]: Crawl and index review
- **features[0].description** [NEW]: How search engines find and index your pages, with errors and gaps identified.
- **features[1].title** [NEW]: Performance and structure checks
- **features[1].description** [NEW]: Page speed, mobile experience, site architecture, and internal linking.
- **features[2].title** [NEW]: Prioritized recommendations
- **features[2].description** [NEW]: A ranked list of fixes with effort and impact, ready for your developers.
- **proofPointTitle** [NEW]: Proof Point
- **proofPointDescription** [NEEDS INPUT]
  - note: No verified case yet.
- **ctaTitle** [NEW]: Find what is holding your site back in search.
- **ctaLabel** [NEW]: Book a strategy session
- **ctaHref** [NEW]: /contact
- **seo.title** [NEW]: Technical SEO Audit | 27zero
- **seo.description** [NEW]: A technical review of your site's crawlability, speed, and structure, with a prioritized fix list.

#### [SEO, AEO & GEO] Keyword & Topic Research
`edtechMarketingService` | `_id`: `edtechMarketingService-keyword-topic-research` | document action: **CREATE**

- **title** [NEW]: Keyword & Topic Research
- **slug.current** [NEW]: keyword-topic-research
  - note: Page URL: /edtech-marketing/services/keyword-topic-research
- **category** [NEW]: seo-aeo-geo
- **iconId** [NEW]: quatrefoil
- **description** [NEW]: Research into the terms and questions EdTech buyers actually search, organized into a topic plan.
- **introTitle** [NEW]: Learn how your buyers search.
- **introDescription** [NEW]: Good SEO starts with how real buyers ask for help. We research the terms, questions, and topics that educators, administrators, and procurement teams search, and organize them into a plan tied to your offering and buyer journey.
- **featuresTitle** [NEW]: What this looks like
- **features[0].title** [NEW]: Audience and search intent analysis
- **features[0].description** [NEW]: What each buyer role searches for, and what they hope to find at each stage.
- **features[1].title** [NEW]: Keyword and topic mapping
- **features[1].description** [NEW]: Terms grouped into topics and mapped to pages, existing and new.
- **features[2].title** [NEW]: Content opportunity list
- **features[2].description** [NEW]: A ranked list of topics worth creating or improving, based on demand and competition.
- **proofPointTitle** [NEW]: Proof Point
- **proofPointDescription** [NEEDS INPUT]
  - note: No verified case yet.
- **ctaTitle** [NEW]: Build your search plan on how buyers actually search.
- **ctaLabel** [NEW]: Book a strategy session
- **ctaHref** [NEW]: /contact
- **seo.title** [NEW]: Keyword & Topic Research | 27zero
- **seo.description** [NEW]: Research into the terms and questions EdTech buyers actually search, organized into a topic plan.

#### [SEO, AEO & GEO] On-Page Optimization
`edtechMarketingService` | `_id`: `edtechMarketingService-on-page-optimization` | document action: **CREATE**

- **title** [NEW]: On-Page Optimization
- **slug.current** [NEW]: on-page-optimization
  - note: Page URL: /edtech-marketing/services/on-page-optimization
- **category** [NEW]: seo-aeo-geo
- **iconId** [NEW]: arc
- **description** [NEW]: Page-level improvements to titles, headings, copy, and links that help your content rank and convert.
- **introTitle** [NEW]: Make every page work harder.
- **introDescription** [NEW]: Strong pages are easy for search engines to understand and easy for people to act on. We refine titles, headings, copy, internal links, and calls to action page by page, starting with the pages closest to revenue.
- **featuresTitle** [NEW]: What this looks like
- **features[0].title** [NEW]: Metadata and heading optimization
- **features[0].description** [NEW]: Titles, descriptions, and headings written for search intent and clarity.
- **features[1].title** [NEW]: Content and internal linking updates
- **features[1].description** [NEW]: Copy improvements and links that connect related pages and guide visitors forward.
- **features[2].title** [NEW]: Ongoing monitoring
- **features[2].description** [NEW]: Regular checks on rankings and engagement, with adjustments as results come in.
- **proofPointTitle** [NEW]: Proof Point
- **proofPointDescription** [NEEDS INPUT]
  - note: No verified case yet.
- **ctaTitle** [NEW]: Get more from the pages you already have.
- **ctaLabel** [NEW]: Book a strategy session
- **ctaHref** [NEW]: /contact
- **seo.title** [NEW]: On-Page Optimization | 27zero
- **seo.description** [NEW]: Page-level improvements to titles, headings, copy, and links that help your content rank and convert.

#### [SEO, AEO & GEO] Content & Link-Building Support
`edtechMarketingService` | `_id`: `edtechMarketingService-content-link-building-support` | document action: **CREATE**

- **title** [NEW]: Content & Link-Building Support
- **slug.current** [NEW]: content-link-building-support
  - note: Page URL: /edtech-marketing/services/content-link-building-support
- **category** [NEW]: seo-aeo-geo
- **iconId** [NEW]: asterisk
- **description** [NEW]: Content and outreach that build the authority search engines look for.
- **introTitle** [NEW]: Earn the signals that build authority.
- **introDescription** [NEW]: Authority grows when credible sites reference useful content. We create content worth linking to, pursue partnerships and mentions in the EdTech community, and track the growth of your authority over time.
- **featuresTitle** [NEW]: What this looks like
- **features[0].title** [NEW]: Content that earns links
- **features[0].description** [NEW]: Research, guides, and data pieces designed to be cited by others in EdTech.
- **features[1].title** [NEW]: Outreach and partnerships
- **features[1].description** [NEW]: Relationships with publications, associations, and partners that can reference your work.
- **features[2].title** [NEW]: Authority tracking
- **features[2].description** [NEW]: Regular reporting on new links, mentions, and the pages that attract them.
- **proofPointTitle** [NEW]: Proof Point
- **proofPointDescription** [NEEDS INPUT]
  - note: No verified case yet.
- **ctaTitle** [NEW]: Build authority that compounds over time.
- **ctaLabel** [NEW]: Book a strategy session
- **ctaHref** [NEW]: /contact
- **seo.title** [NEW]: Content & Link-Building Support | 27zero
- **seo.description** [NEW]: Content and outreach that build the authority search engines look for.

#### [SEO, AEO & GEO] Answer Engine Visibility Audit
`edtechMarketingService` | `_id`: `edtechMarketingService-answer-engine-visibility-audit` | document action: **CREATE**

- **title** [NEW]: Answer Engine Visibility Audit
- **slug.current** [NEW]: answer-engine-visibility-audit
  - note: Page URL: /edtech-marketing/services/answer-engine-visibility-audit
- **category** [NEW]: seo-aeo-geo
- **iconId** [NEW]: quatrefoil
- **description** [NEW]: A review of how your brand appears in featured snippets, People Also Ask boxes, and voice answers.
- **introTitle** [NEW]: See where answers are being given.
- **introDescription** [NEW]: Search results increasingly answer questions directly, through featured snippets, People Also Ask boxes, and spoken responses. The audit shows where your brand appears in those answers today, where competitors appear, and where the opportunities are.
- **featuresTitle** [NEW]: What this looks like
- **features[0].title** [NEW]: Answer feature mapping
- **features[0].description** [NEW]: The questions in your category that trigger answer features, and who currently owns them.
- **features[1].title** [NEW]: Competitor comparison
- **features[1].description** [NEW]: A side-by-side view of which answers competitors hold and how they earned them.
- **features[2].title** [NEW]: Opportunity roadmap
- **features[2].description** [NEW]: A prioritized plan of questions and pages to target first.
- **proofPointTitle** [NEW]: Proof Point
- **proofPointDescription** [NEEDS INPUT]
  - note: No verified case yet.
- **ctaTitle** [NEW]: Find the answers your brand should own.
- **ctaLabel** [NEW]: Book a strategy session
- **ctaHref** [NEW]: /contact
- **seo.title** [NEW]: Answer Engine Visibility Audit | 27zero
- **seo.description** [NEW]: A review of how your brand appears in featured snippets, People Also Ask boxes, and voice answers.

#### [SEO, AEO & GEO] Schema & Structured Data Markup
`edtechMarketingService` | `_id`: `edtechMarketingService-schema-structured-data-markup` | document action: **CREATE**

- **title** [NEW]: Schema & Structured Data Markup
- **slug.current** [NEW]: schema-structured-data-markup
  - note: Page URL: /edtech-marketing/services/schema-structured-data-markup
- **category** [NEW]: seo-aeo-geo
- **iconId** [NEW]: arc
- **description** [NEW]: Structured data that helps search engines understand and display your content as rich answers.
- **introTitle** [NEW]: Help search engines understand your content.
- **introDescription** [NEW]: Structured data labels your content in a language search engines understand, which makes rich results and direct answers possible. We plan and implement the markup that fits your pages, from organizations and articles to FAQs and events.
- **featuresTitle** [NEW]: What this looks like
- **features[0].title** [NEW]: Schema planning
- **features[0].description** [NEW]: The types of markup that fit your site and offer the most visibility.
- **features[1].title** [NEW]: Implementation
- **features[1].description** [NEW]: Markup added to templates and pages, in coordination with your development team.
- **features[2].title** [NEW]: Validation and monitoring
- **features[2].description** [NEW]: Testing at launch and regular checks as pages and search guidelines change.
- **proofPointTitle** [NEW]: Proof Point
- **proofPointDescription** [NEEDS INPUT]
  - note: No verified case yet.
- **ctaTitle** [NEW]: Give search engines the context to feature your content.
- **ctaLabel** [NEW]: Book a strategy session
- **ctaHref** [NEW]: /contact
- **seo.title** [NEW]: Schema & Structured Data Markup | 27zero
- **seo.description** [NEW]: Structured data that helps search engines understand and display your content as rich answers.

#### [SEO, AEO & GEO] Featured Snippet & Voice Search Optimization
`edtechMarketingService` | `_id`: `edtechMarketingService-featured-snippet-voice-search-optimization` | document action: **CREATE**

- **title** [NEW]: Featured Snippet & Voice Search Optimization
- **slug.current** [NEW]: featured-snippet-voice-search-optimization
  - note: Page URL: /edtech-marketing/services/featured-snippet-voice-search-optimization
- **category** [NEW]: seo-aeo-geo
- **iconId** [NEW]: asterisk
- **description** [NEW]: Content formatted to win featured snippets and spoken answers on search and voice assistants.
- **introTitle** [NEW]: Be the answer people hear and see.
- **introDescription** [NEW]: Featured snippets and voice responses reward content that answers a question clearly and early. We research the questions your buyers ask, format answers for snippet and voice formats, and track which ones win.
- **featuresTitle** [NEW]: What this looks like
- **features[0].title** [NEW]: Question research
- **features[0].description** [NEW]: The questions your buyers ask in search and by voice, grouped by topic and stage.
- **features[1].title** [NEW]: Answer formatting
- **features[1].description** [NEW]: Concise, well-structured answers placed where search engines look for them.
- **features[2].title** [NEW]: Performance tracking
- **features[2].description** [NEW]: Monitoring of snippets won, lost, and gained, with refinements over time.
- **proofPointTitle** [NEW]: Proof Point
- **proofPointDescription** [NEEDS INPUT]
  - note: No verified case yet.
- **ctaTitle** [NEW]: Win the answer box for the questions that matter.
- **ctaLabel** [NEW]: Book a strategy session
- **ctaHref** [NEW]: /contact
- **seo.title** [NEW]: Featured Snippet & Voice Search Optimization | 27zero
- **seo.description** [NEW]: Content formatted to win featured snippets and spoken answers on search and voice assistants.

#### [SEO, AEO & GEO] FAQ & Direct-Answer Content
`edtechMarketingService` | `_id`: `edtechMarketingService-faq-direct-answer-content` | document action: **CREATE**

- **title** [NEW]: FAQ & Direct-Answer Content
- **slug.current** [NEW]: faq-direct-answer-content
  - note: Page URL: /edtech-marketing/services/faq-direct-answer-content
- **category** [NEW]: seo-aeo-geo
- **iconId** [NEW]: quatrefoil
- **description** [NEW]: Clear, authoritative answers to the questions your buyers ask, published where answer engines look.
- **introTitle** [NEW]: Answer the questions before they are asked.
- **introDescription** [NEW]: Buyers arrive with questions about price, fit, implementation, and proof. We build a library of clear, accurate answers, written by people who know EdTech, and publish them in formats that both people and answer engines can use.
- **featuresTitle** [NEW]: What this looks like
- **features[0].title** [NEW]: Question inventory
- **features[0].description** [NEW]: A complete list of the questions buyers ask across sales, support, and search.
- **features[1].title** [NEW]: Answer writing and review
- **features[1].description** [NEW]: Answers drafted in your voice and reviewed by your subject experts.
- **features[2].title** [NEW]: Publishing and updates
- **features[2].description** [NEW]: Pages and sections structured for easy reading, with a schedule for keeping answers current.
- **proofPointTitle** [NEW]: Proof Point
- **proofPointDescription** [NEEDS INPUT]
  - note: No verified case yet.
- **ctaTitle** [NEW]: Become the trusted source for your buyers' questions.
- **ctaLabel** [NEW]: Book a strategy session
- **ctaHref** [NEW]: /contact
- **seo.title** [NEW]: FAQ & Direct-Answer Content | 27zero
- **seo.description** [NEW]: Clear, authoritative answers to the questions your buyers ask, published where answer engines look.

#### [SEO, AEO & GEO] Generative Engine Visibility Audit
`edtechMarketingService` | `_id`: `edtechMarketingService-generative-engine-visibility-audit` | document action: **CREATE**

- **title** [NEW]: Generative Engine Visibility Audit
- **slug.current** [NEW]: generative-engine-visibility-audit
  - note: Page URL: /edtech-marketing/services/generative-engine-visibility-audit
- **category** [NEW]: seo-aeo-geo
- **iconId** [NEW]: arc
- **description** [NEW]: An assessment of how ChatGPT, Perplexity, Google AI Overviews, and other generative engines describe and cite your brand.
- **introTitle** [NEW]: See what AI says about you.
- **introDescription** [NEW]: Buyers now ask generative engines to compare vendors and explain categories. The audit tests the prompts your buyers use across the leading engines and documents how your brand is described, which sources are cited, and where competitors appear instead.
- **featuresTitle** [NEW]: What this looks like
- **features[0].title** [NEW]: Prompt and query testing
- **features[0].description** [NEW]: A set of buyer prompts run across the major generative engines, repeated for consistency.
- **features[1].title** [NEW]: Citation and sentiment analysis
- **features[1].description** [NEW]: Which sources are cited, how your brand is described, and whether the description is accurate.
- **features[2].title** [NEW]: Gap and opportunity report
- **features[2].description** [NEW]: Where your brand is missing or misdescribed, and what to do about it.
- **proofPointTitle** [NEW]: Proof Point
- **proofPointDescription** [NEEDS INPUT]
  - note: No verified case yet.
- **ctaTitle** [NEW]: Learn how generative engines describe your brand.
- **ctaLabel** [NEW]: Book a strategy session
- **ctaHref** [NEW]: /contact
- **seo.title** [NEW]: Generative Engine Visibility Audit | 27zero
- **seo.description** [NEW]: An assessment of how ChatGPT, Perplexity, Google AI Overviews, and other generative engines describe and cite your brand.

#### [SEO, AEO & GEO] Content Structuring for AI Citability
`edtechMarketingService` | `_id`: `edtechMarketingService-content-structuring-ai-citability` | document action: **CREATE**

- **title** [NEW]: Content Structuring for AI Citability
- **slug.current** [NEW]: content-structuring-ai-citability
  - note: Page URL: /edtech-marketing/services/content-structuring-ai-citability
- **category** [NEW]: seo-aeo-geo
- **iconId** [NEW]: asterisk
- **description** [NEW]: Content organized so generative engines can find, understand, and cite it accurately.
- **introTitle** [NEW]: Make your content easy to cite.
- **introDescription** [NEW]: Generative engines favor content that is clear, specific, and well sourced. We review your key pages and restructure them with direct answers, defined terms, and evidence, so engines can lift accurate statements and credit your brand.
- **featuresTitle** [NEW]: What this looks like
- **features[0].title** [NEW]: Content audit for citability
- **features[0].description** [NEW]: A review of key pages for clarity, specificity, and supporting evidence.
- **features[1].title** [NEW]: Structure and clarity updates
- **features[1].description** [NEW]: Headings, summaries, definitions, and data presented in forms engines can extract.
- **features[2].title** [NEW]: Source and credibility signals
- **features[2].description** [NEW]: Authorship, references, and proof points that strengthen trust in your content.
- **proofPointTitle** [NEW]: Proof Point
- **proofPointDescription** [NEEDS INPUT]
  - note: No verified case yet.
- **ctaTitle** [NEW]: Get your best ideas cited accurately.
- **ctaLabel** [NEW]: Book a strategy session
- **ctaHref** [NEW]: /contact
- **seo.title** [NEW]: Content Structuring for AI Citability | 27zero
- **seo.description** [NEW]: Content organized so generative engines can find, understand, and cite it accurately.

#### [SEO, AEO & GEO] Brand Mention & Citation Monitoring
`edtechMarketingService` | `_id`: `edtechMarketingService-brand-mention-citation-monitoring` | document action: **CREATE**

- **title** [NEW]: Brand Mention & Citation Monitoring
- **slug.current** [NEW]: brand-mention-citation-monitoring
  - note: Page URL: /edtech-marketing/services/brand-mention-citation-monitoring
- **category** [NEW]: seo-aeo-geo
- **iconId** [NEW]: quatrefoil
- **description** [NEW]: Ongoing tracking of where and how generative engines mention your brand.
- **introTitle** [NEW]: Keep watch over the answers that shape perception.
- **introDescription** [NEW]: Generative answers change as models and sources change. We monitor a defined set of prompts on a regular schedule, record where your brand is mentioned and cited, and flag changes that deserve a response.
- **featuresTitle** [NEW]: What this looks like
- **features[0].title** [NEW]: Monitoring setup
- **features[0].description** [NEW]: A prompt set and schedule built around your category, products, and competitors.
- **features[1].title** [NEW]: Mention and citation reporting
- **features[1].description** [NEW]: Regular reports on visibility, accuracy, and the sources engines rely on.
- **features[2].title** [NEW]: Response recommendations
- **features[2].description** [NEW]: Specific actions when a description is outdated, missing, or inaccurate.
- **proofPointTitle** [NEW]: Proof Point
- **proofPointDescription** [NEEDS INPUT]
  - note: No verified case yet.
- **ctaTitle** [NEW]: Track your brand across generative engines.
- **ctaLabel** [NEW]: Book a strategy session
- **ctaHref** [NEW]: /contact
- **seo.title** [NEW]: Brand Mention & Citation Monitoring | 27zero
- **seo.description** [NEW]: Ongoing tracking of where and how generative engines mention your brand.

#### [SEO, AEO & GEO] LLM Knowledge Base Optimization
`edtechMarketingService` | `_id`: `edtechMarketingService-llm-knowledge-base-optimization` | document action: **CREATE**

- **title** [NEW]: LLM Knowledge Base Optimization
- **slug.current** [NEW]: llm-knowledge-base-optimization
  - note: Page URL: /edtech-marketing/services/llm-knowledge-base-optimization
- **category** [NEW]: seo-aeo-geo
- **iconId** [NEW]: arc
- **description** [NEW]: A well-organized, accurate set of public sources that language models can learn from and quote.
- **introTitle** [NEW]: Give language models the right sources.
- **introDescription** [NEW]: Language models learn from the public web. We organize and align your website, profiles, documentation, and third-party listings so the information about your company is accurate, consistent, and easy to quote.
- **featuresTitle** [NEW]: What this looks like
- **features[0].title** [NEW]: Source inventory
- **features[0].description** [NEW]: A map of the public pages and profiles that describe your company and products.
- **features[1].title** [NEW]: Consistency across profiles and pages
- **features[1].description** [NEW]: Names, descriptions, and facts aligned everywhere your brand appears.
- **features[2].title** [NEW]: Updates and maintenance
- **features[2].description** [NEW]: A routine for keeping public information current as your offering evolves.
- **proofPointTitle** [NEW]: Proof Point
- **proofPointDescription** [NEEDS INPUT]
  - note: No verified case yet.
- **ctaTitle** [NEW]: Make sure the web tells your story accurately.
- **ctaLabel** [NEW]: Book a strategy session
- **ctaHref** [NEW]: /contact
- **seo.title** [NEW]: LLM Knowledge Base Optimization | 27zero
- **seo.description** [NEW]: A well-organized, accurate set of public sources that language models can learn from and quote.

#### [REMOVED] Sales Assets & Experiences
`edtechMarketingService` | `_id`: `edtechMarketingService-sales-assets-experiences` | document action: **DELETE**
> Sales Enablement is no longer a category. Remove from every Practice relatedServices first (done in the Practices section).

- **(document)** [DELETE]

#### [REMOVED] Sales Training
`edtechMarketingService` | `_id`: `edtechMarketingService-sales-training` | document action: **DELETE**
> Sales Enablement is no longer a category. Remove from every Practice relatedServices first (done in the Practices section).

- **(document)** [DELETE]

#### [REMOVED] Thought Leadership & Executive Content
`edtechMarketingService` | `_id`: `edtechMarketingService-thought-leadership-executive-content` | document action: **DELETE**
> Replaced by the four services in Thought Leadership Programs. Remove from every Practice relatedServices first (done in the Practices section).

- **(document)** [DELETE]

#### [REMOVED] SEO
`edtechMarketingService` | `_id`: `edtechMarketingService-seo` | document action: **DELETE**
> Replaced by four SEO services in SEO, AEO & GEO. Remove from every Practice relatedServices first (done in the Practices section).

- **(document)** [DELETE]

#### [REMOVED] AEO
`edtechMarketingService` | `_id`: `edtechMarketingService-aeo` | document action: **DELETE**
> Replaced by four AEO services in SEO, AEO & GEO. Remove from every Practice relatedServices first (done in the Practices section).

- **(document)** [DELETE]

## 11. Resources (33)
Article bodies are legitimate and untouched. What is added is metadata that is missing on every resource (SEO title and description), the 17 missing publish dates, categories (only 1 of 33 has one) and one missing short description. Meta titles are hand-written where the article title is a long question. Two articles share the title "What is EdTech marketing?" but have different content (similarity near zero): their meta titles are differentiated, and the duplicate H1 is flagged. 12 slugs are longer than 96 characters (longest 161); they are kept because changing them needs redirects.

#### Resource: The EdTech Mentor Initiative
`resource` | `_id`: `resource-webflow-69fce9dc8b38b6e090b1abe9` | document action: **PATCH**
> slug: `edtech-mentor`

- **seo.title** [FILL]: The EdTech Mentor Initiative | 27zero
- **seo.description** [FILL]: edTech Mentor conecta educación y tecnología para acelerar tu aprendizaje con mentoría personalizada y herramientas digitales que impulsan tu crecimiento.
  - note: First sentence(s) of the existing short description.
- **category** [REVIEW]: Marketing
  - note: Empty. Only two categories exist (Marketing, Communication); the content marketing articles could fit Communication.

#### Resource: EdTech Marketing Agency
`resource` | `_id`: `resource-webflow-6a3166ee3a6358bb05f346a2` | document action: **PATCH**
> slug: `edtech-marketing-agency`

- **seo.title** [FILL]: EdTech Marketing Agency | 27zero
- **seo.description** [FILL]: Education technology is transforming how learners, educators, and institutions engage with knowledge.
  - note: First sentence(s) of the existing short description.
- **category** [REVIEW]: Marketing
  - note: Empty. Only two categories exist (Marketing, Communication); the content marketing articles could fit Communication.

#### Resource: What are some common challenges EdTech companies face when setting up effective marketing 
`resource` | `_id`: `resource-webflow-6a318206852a01a2c0747fd1` | document action: **PATCH**
> slug: `what-are-some-common-challenges-edtech-companies-face-when-setting-up-effective-marketing-operations`

- **seo.title** [FILL]: Challenges of Setting Up EdTech Marketing Operations | 27zero
- **seo.description** [FILL]: Launching and scaling marketing operations in the EdTech sector is anything but straightforward.
  - note: First sentence(s) of the existing short description.
- **category** [REVIEW]: Marketing
  - note: Empty. Only two categories exist (Marketing, Communication); the content marketing articles could fit Communication.

#### Resource: What are some common challenges EdTech companies face when trying to market their products
`resource` | `_id`: `resource-webflow-6a318243c1ddd2a6620896a0` | document action: **PATCH**
> slug: `what-are-some-common-challenges-edtech-companies-face-when-trying-to-market-their-products-and-how-do-these-ag`

- **seo.title** [FILL]: EdTech Marketing Challenges and How Agencies Help | 27zero
- **seo.description** [FILL]: EdTech companies are confronted with a marketing landscape shaped by rapid innovation, deep-rooted skepticism, and ever-shifting regulations.
  - note: First sentence(s) of the existing short description.
- **category** [REVIEW]: Marketing
  - note: Empty. Only two categories exist (Marketing, Communication); the content marketing articles could fit Communication.

#### Resource: What strategies work best for generating high-quality leads at education industry conferen
`resource` | `_id`: `resource-webflow-6a31841e401c7eac8f2970f0` | document action: **PATCH**
> slug: `what-strategies-work-best-for-generating-high-quality-leads-at-education-industry-conferences`

- **seo.title** [FILL]: Generating High-Quality Leads at Education Conferences | 27zero
- **seo.description** [FILL]: Education industry conferences present a unique opportunity to connect with the right prospects in a highly competitive environment.
  - note: First sentence(s) of the existing short description.
- **category** [REVIEW]: Marketing
  - note: Empty. Only two categories exist (Marketing, Communication); the content marketing articles could fit Communication.

#### Resource: Best ed tech marketing agency
`resource` | `_id`: `resource-webflow-6a3185105d0b7b0f966da2e9` | document action: **PATCH**
> slug: `best-ed-tech-marketing-agency`

- **seo.title** [FILL]: Best EdTech Marketing Agency | 27zero
- **seo.description** [FILL]: Standing out in the education technology sector requires more than a compelling product or innovative platform.
  - note: First sentence(s) of the existing short description.
- **category** [REVIEW]: Marketing
  - note: Empty. Only two categories exist (Marketing, Communication); the content marketing articles could fit Communication.

#### Resource: How do EdTech marketing agencies tailor their strategies for different education sectors l
`resource` | `_id`: `resource-webflow-6a3185cb34264b360ed7cf35` | document action: **PATCH**
> slug: `how-do-edtech-marketing-agencies-tailor-their-strategies-for-different-education-sectors-like-k-12-versus-high`

- **seo.title** [FILL]: EdTech Marketing Strategies for K-12 and Higher Ed | 27zero
- **seo.description** [FILL]: Education buyers are increasingly savvy, demanding more than generic messaging or broad-strokes campaigns.
  - note: First sentence(s) of the existing short description.
- **category** [REVIEW]: Marketing
  - note: Empty. Only two categories exist (Marketing, Communication); the content marketing articles could fit Communication.
- **contentCta** [NEEDS INPUT]
  - note: Empty.

#### Resource: How do EdTech marketing agencies typically measure the success of their campaigns with edu
`resource` | `_id`: `resource-webflow-6a3189c53e5f1f8d15e0a795` | document action: **PATCH**
> slug: `how-do-edtech-marketing-agencies-typically-measure-the-success-of-their-campaigns-with-educational-institution`

- **seo.title** [FILL]: How EdTech Agencies Measure Campaign Success | 27zero
- **seo.description** [FILL]: Proving the real-world impact of EdTech marketing campaigns is a high-stakes challenge for agencies serving educational institutions.
  - note: First sentence(s) of the existing short description.
- **category** [REVIEW]: Marketing
  - note: Empty. Only two categories exist (Marketing, Communication); the content marketing articles could fit Communication.

#### Resource: What specific strategies do EdTech marketing agencies use to reach decision-makers in scho
`resource` | `_id`: `resource-webflow-6a318b1ea7ffb321b45734d3` | document action: **PATCH**
> slug: `what-specific-strategies-do-edtech-marketing-agencies-use-to-reach-decision-makers-in-schools-and-districts`

- **seo.title** [FILL]: Reaching Decision-Makers in Schools and Districts | 27zero
- **seo.description** [FILL]: Breaking through to school and district decision-makers in EdTech isn't just about visibility, it's about precision, credibility, and deep sector insight.
  - note: First sentence(s) of the existing short description.
- **category** [REVIEW]: Marketing
  - note: Empty. Only two categories exist (Marketing, Communication); the content marketing articles could fit Communication.

#### Resource: EdTech websites
`resource` | `_id`: `resource-webflow-6a318d4a781698152794c708` | document action: **PATCH**
> slug: `edtech-websites`

- **seo.title** [FILL]: EdTech websites | 27zero
- **seo.description** [FILL]: In education technology, your website is often the first, and sometimes only, chance to make a lasting impression on educators, institutions, and learners.
  - note: First sentence(s) of the existing short description.
- **category** [REVIEW]: Marketing
  - note: Empty. Only two categories exist (Marketing, Communication); the content marketing articles could fit Communication.

#### Resource: Can you share examples of successful EdTech websites and what made them effective?
`resource` | `_id`: `resource-webflow-6a318dae6c7556447bb2ef01` | document action: **PATCH**
> slug: `can-you-share-examples-of-successful-edtech-websites-and-what-made-them-effective`

- **seo.title** [FILL]: Successful EdTech Websites and What Makes Them Work | 27zero
- **seo.description** [FILL]: Examples of successful EdTech websites, from adaptive learning platforms to gamified language apps, and the strategies behind their effectiveness.
  - note: Written by hand.
- **category** [REVIEW]: Marketing
  - note: Empty. Only two categories exist (Marketing, Communication); the content marketing articles could fit Communication.

#### Resource: How can EdTech marketers effectively demonstrate the impact of their products on learning 
`resource` | `_id`: `resource-webflow-6a318e2b17717051b12157d8` | document action: **PATCH**
> slug: `how-can-edtech-marketers-effectively-demonstrate-the-impact-of-their-products-on-learning-outcomes`

- **seo.title** [FILL]: Demonstrating EdTech Impact on Learning Outcomes | 27zero
- **seo.description** [FILL]: In the evolving landscape of education technology, proof of impact has become the new currency.
  - note: First sentence(s) of the existing short description.
- **category** [REVIEW]: Marketing
  - note: Empty. Only two categories exist (Marketing, Communication); the content marketing articles could fit Communication.

#### Resource: What are some common challenges EdTech companies face when marketing to schools or distric
`resource` | `_id`: `resource-webflow-6a318e69590fa34e4d6cec37` | document action: **PATCH**
> slug: `what-are-some-common-challenges-edtech-companies-face-when-marketing-to-schools-or-districts`

- **seo.title** [FILL]: Challenges of Marketing EdTech to Schools and Districts | 27zero
- **seo.description** [FILL]: In the rapidly evolving world of education technology, even the most innovative solutions can struggle to break through.
  - note: First sentence(s) of the existing short description.
- **category** [REVIEW]: Marketing
  - note: Empty. Only two categories exist (Marketing, Communication); the content marketing articles could fit Communication.

#### Resource: Edtech marketing operations agency
`resource` | `_id`: `resource-webflow-6a3191279b03388cbfe8083d` | document action: **PATCH**
> slug: `edtech-marketing-operations-agency`

- **seo.title** [FILL]: EdTech Marketing Operations Agency | 27zero
- **seo.description** [FILL]: Navigating the world of EdTech marketing requires more than just creativity or a compelling product.
  - note: First sentence(s) of the existing short description.
- **category** [REVIEW]: Marketing
  - note: Empty. Only two categories exist (Marketing, Communication); the content marketing articles could fit Communication.

#### Resource: Are there particular challenges or trends expected to shape EdTech marketing services in 2
`resource` | `_id`: `resource-webflow-6a31939a863f55aec677cbda` | document action: **PATCH**
> slug: `are-there-particular-challenges-or-trends-expected-to-shape-edtech-marketing-services-in-2026`

- **seo.title** [FILL]: EdTech Marketing Trends and Challenges for 2026 | 27zero
- **seo.description** [FILL]: The landscape of EdTech marketing is on the verge of significant transformation.
  - note: First sentence(s) of the existing short description.
- **publishedAt** [FILL]: 2026-06-16T00:00:00.000Z
  - note: Empty. Same rule the other 16 resources already follow (date of creation in Webflow).

#### Resource: What is EdTech marketing?
`resource` | `_id`: `resource-webflow-6a31950d9fd2c098a01932ec` | document action: **PATCH**
> slug: `what-is-edtech-marketing`

- **seo.title** [FILL]: What Is EdTech Marketing? | 27zero
- **seo.description** [FILL]: Education technology is reshaping how knowledge is delivered and experienced, but innovation alone isn't enough to ensure success.
  - note: First sentence(s) of the existing short description.
- **category** [REVIEW]: Marketing
  - note: Empty. Only two categories exist (Marketing, Communication); the content marketing articles could fit Communication.

#### Resource: What should I look for when choosing an EdTech marketing agency that fits my specific prod
`resource` | `_id`: `resource-webflow-6a3196035f50e84a5bfbee11` | document action: **PATCH**
> slug: `what-should-i-look-for-when-choosing-an-edtech-marketing-agency-that-fits-my-specific-product-and-audience`

- **seo.title** [FILL]: How to Choose an EdTech Marketing Agency | 27zero
- **seo.description** [FILL]: Choosing an EdTech marketing agency? Look for specialist experience with long buying cycles, mission-driven buyers, and institutional decision-making.
  - note: Written by hand.
- **category** [REVIEW]: Marketing
  - note: Empty. Only two categories exist (Marketing, Communication); the content marketing articles could fit Communication.

#### Resource: EdTech Event Marketing
`resource` | `_id`: `resource-webflow-6a57e9c2c2b48c2364fe395b` | document action: **PATCH**
> slug: `edtech-event-marketing`

- **seo.title** [FILL]: EdTech Event Marketing | 27zero
- **seo.description** [FILL]: EdTech event marketing builds qualified leads and lasting relationships with educators and administrators through experiences made for how education buys.
  - note: Written by hand.
- **publishedAt** [FILL]: 2026-07-15T00:00:00.000Z
  - note: Empty. Same rule the other 16 resources already follow (date of creation in Webflow).
- **category** [REVIEW]: Marketing
  - note: Empty. Only two categories exist (Marketing, Communication); the content marketing articles could fit Communication.

#### Resource: How does EdTech marketing differ from traditional education or tech marketing?
`resource` | `_id`: `resource-webflow-6a57eb0593ea9f93b22796b5` | document action: **PATCH**
> slug: `how-does-edtech-marketing-differ-from-traditional-education-or-tech-marketing`

- **seo.title** [FILL]: How EdTech Marketing Differs From Traditional Marketing | 27zero
- **seo.description** [FILL]: EdTech buying cycles run longer, markets are more crowded, and buyers want more proof. See how EdTech marketing differs from traditional marketing.
  - note: Written by hand.
- **publishedAt** [FILL]: 2026-07-15T00:00:00.000Z
  - note: Empty. Same rule the other 16 resources already follow (date of creation in Webflow).
- **category** [REVIEW]: Marketing
  - note: Empty. Only two categories exist (Marketing, Communication); the content marketing articles could fit Communication.

#### Resource: What are the 5 P's of event marketing?
`resource` | `_id`: `resource-webflow-6a57eb9cdb6dbb7c8c2b5f57` | document action: **PATCH**
> slug: `what-are-the-5-ps-of-event-marketing`

- **seo.title** [FILL]: What Are the 5 P's of Event Marketing? | 27zero
- **seo.description** [FILL]: Most EdTech teams pour budget into booth space and branded swag, then wonder why demand generation stalls.
  - note: First sentence(s) of the existing short description.
- **publishedAt** [FILL]: 2026-07-15T00:00:00.000Z
  - note: Empty. Same rule the other 16 resources already follow (date of creation in Webflow).
- **category** [REVIEW]: Marketing
  - note: Empty. Only two categories exist (Marketing, Communication); the content marketing articles could fit Communication.

#### Resource: What is EdTech marketing?
`resource` | `_id`: `resource-webflow-6a57ebcfac82d40256061596` | document action: **PATCH**
> slug: `what-is-edtech-marketing-2`

- **seo.title** [FILL]: What Is EdTech Marketing? Building Demand and Credibility | 27zero
- **seo.description** [FILL]: Education technology companies often confuse activity with progress. What is EdTech marketing?
  - note: First sentence(s) of the existing short description.
- **publishedAt** [FILL]: 2026-07-15T00:00:00.000Z
  - note: Empty. Same rule the other 16 resources already follow (date of creation in Webflow).
- **category** [REVIEW]: Marketing
  - note: Empty. Only two categories exist (Marketing, Communication); the content marketing articles could fit Communication.
- **title** [REVIEW]
  - note: Same H1 as "What is EdTech marketing?" (slug what-is-edtech-marketing). Differentiate the title or merge the two articles.

#### Resource: Best event marketing campaigns
`resource` | `_id`: `resource-webflow-6a57ebf67aa57690dac6d310` | document action: **PATCH**
> slug: `best-event-marketing-campaigns`

- **seo.title** [FILL]: Best event marketing campaigns | 27zero
- **seo.description** [FILL]: Most EdTech event budgets get spent chasing attendance, when the real prize is qualified leads.
  - note: First sentence(s) of the existing short description.
- **publishedAt** [FILL]: 2026-07-15T00:00:00.000Z
  - note: Empty. Same rule the other 16 resources already follow (date of creation in Webflow).
- **category** [REVIEW]: Marketing
  - note: Empty. Only two categories exist (Marketing, Communication); the content marketing articles could fit Communication.

#### Resource: How can EdTech organizations effectively leverage hybrid or virtual event formats to maxim
`resource` | `_id`: `resource-webflow-6a57ec250e05488782bea2ca` | document action: **PATCH**
> slug: `how-can-edtech-organizations-effectively-leverage-hybrid-or-virtual-event-formats-to-maximize-audience-engagem`

- **seo.title** [FILL]: Using Hybrid and Virtual Events to Maximize EdTech ROI | 27zero
- **seo.description** [FILL]: Standalone webinars rarely move the needle for EdTech buyers, and most virtual events fade the moment they end.
  - note: First sentence(s) of the existing short description.
- **publishedAt** [FILL]: 2026-07-15T00:00:00.000Z
  - note: Empty. Same rule the other 16 resources already follow (date of creation in Webflow).
- **category** [REVIEW]: Marketing
  - note: Empty. Only two categories exist (Marketing, Communication); the content marketing articles could fit Communication.

#### Resource: How do companies measure the success of these event marketing campaigns?
`resource` | `_id`: `resource-webflow-6a57ec4deb990c3715de7ac5` | document action: **PATCH**
> slug: `how-do-companies-measure-the-success-of-these-event-marketing-campaigns`

- **seo.title** [FILL]: Measuring the Success of Event Marketing Campaigns | 27zero
- **seo.description** [FILL]: Badge scans and post-event buzz are seductive metrics, they feel like proof of impact. But they're not.
  - note: First sentence(s) of the existing short description.
- **publishedAt** [FILL]: 2026-07-15T00:00:00.000Z
  - note: Empty. Same rule the other 16 resources already follow (date of creation in Webflow).
- **category** [REVIEW]: Marketing
  - note: Empty. Only two categories exist (Marketing, Communication); the content marketing articles could fit Communication.

#### Resource: Which EdTech companies have executed the most innovative event marketing campaigns recentl
`resource` | `_id`: `resource-webflow-6a57ec667ca913ce80a66fe7` | document action: **PATCH**
> slug: `which-edtech-companies-have-executed-the-most-innovative-event-marketing-campaigns-recently-and-what-specific-`

- **seo.title** [FILL]: Innovative EdTech Event Marketing Campaigns and Tactics | 27zero
- **seo.description** [FILL]: Most EdTech event marketing still defaults to a booth, a banner, and a badge scanner, then leaders wonder why lead generation stays flat.
  - note: First sentence(s) of the existing short description.
- **publishedAt** [FILL]: 2026-07-15T00:00:00.000Z
  - note: Empty. Same rule the other 16 resources already follow (date of creation in Webflow).
- **category** [REVIEW]: Marketing
  - note: Empty. Only two categories exist (Marketing, Communication); the content marketing articles could fit Communication.

#### Resource: Educational content marketing
`resource` | `_id`: `resource-webflow-6a57ec876f1dd5d710c17e98` | document action: **PATCH**
> slug: `educational-content-marketing`

- **seo.title** [FILL]: Educational content marketing | 27zero
- **seo.description** [FILL]: Content is what separates EdTech events that generate qualified leads from those that merely draw a crowd.
  - note: First sentence(s) of the existing short description.
- **publishedAt** [FILL]: 2026-07-15T00:00:00.000Z
  - note: Empty. Same rule the other 16 resources already follow (date of creation in Webflow).
- **category** [REVIEW]: Marketing
  - note: Empty. Only two categories exist (Marketing, Communication); the content marketing articles could fit Communication.

#### Resource: How can I measure the effectiveness of my educational content marketing efforts?
`resource` | `_id`: `resource-webflow-6a57ecb1db6dbb7c8c2bed0b` | document action: **PATCH**
> slug: `how-can-i-measure-the-effectiveness-of-my-educational-content-marketing-efforts`

- **seo.title** [FILL]: Measuring Educational Content Marketing Effectiveness | 27zero
- **seo.description** [FILL]: Most EdTech teams invest heavily in event content, then evaluate it with a shrug, badge scans, a handful of LinkedIn likes, a stack of business cards.
  - note: First sentence(s) of the existing short description.
- **publishedAt** [FILL]: 2026-07-15T00:00:00.000Z
  - note: Empty. Same rule the other 16 resources already follow (date of creation in Webflow).
- **category** [REVIEW]: Marketing
  - note: Empty. Only two categories exist (Marketing, Communication); the content marketing articles could fit Communication.

#### Resource: How can educational content marketing be tailored to attract and engage different attendee
`resource` | `_id`: `resource-webflow-6a57ecd6f6c5fa91a4dfa180` | document action: **PATCH**
> slug: `how-can-educational-content-marketing-be-tailored-to-attract-and-engage-different-attendee-personas-at-edtech-`

- **seo.title** [FILL]: Tailoring Content Marketing to Event Attendee Personas | 27zero
- **seo.description** [FILL]: EdTech events gather teachers, administrators, and vendors with different priorities. See how to tailor content marketing to each attendee persona.
  - note: Written by hand.
- **publishedAt** [FILL]: 2026-07-15T00:00:00.000Z
  - note: Empty. Same rule the other 16 resources already follow (date of creation in Webflow).
- **category** [REVIEW]: Marketing
  - note: Empty. Only two categories exist (Marketing, Communication); the content marketing articles could fit Communication.

#### Resource: Which digital platforms and content formats (e.g., webinars, ebooks, interactive demos) ha
`resource` | `_id`: `resource-webflow-6a57ecf87aa57690dac77c9e` | document action: **PATCH**
> slug: `which-digital-platforms-and-content-formats-e-g-webinars-ebooks-interactive-demos-have-proven-most-effective-f`

- **seo.title** [FILL]: Digital Formats That Drive EdTech Event Registrations | 27zero
- **seo.description** [FILL]: Most EdTech event campaigns don't stall at the venue, they stall weeks earlier, in the inbox and the feed, where the wrong format meets the wrong audience.
  - note: First sentence(s) of the existing short description.
- **publishedAt** [FILL]: 2026-07-15T00:00:00.000Z
  - note: Empty. Same rule the other 16 resources already follow (date of creation in Webflow).
- **category** [REVIEW]: Marketing
  - note: Empty. Only two categories exist (Marketing, Communication); the content marketing articles could fit Communication.

#### Resource: Event marketing mix
`resource` | `_id`: `resource-webflow-6a57eda1427fb22f3a3312e8` | document action: **PATCH**
> slug: `event-marketing-mix`

- **seo.title** [FILL]: Event marketing mix | 27zero
- **seo.description** [FILL]: The event marketing mix gives EdTech teams a structure of 5 Ps, 5 Cs, 4 Ps, and 7 Ps to plan conferences and roadshows that grow the pipeline.
  - note: Written by hand.
- **publishedAt** [FILL]: 2026-07-15T00:00:00.000Z
  - note: Empty. Same rule the other 16 resources already follow (date of creation in Webflow).
- **category** [REVIEW]: Marketing
  - note: Empty. Only two categories exist (Marketing, Communication); the content marketing articles could fit Communication.
- **shortDescription** [FILL]: Most EdTech event budgets get poured into logistics and then measured by gut feel. The Event marketing mix replaces that guesswork with structure: a set of interlocking frameworks, the 5 Ps, 5 Cs, 4 Ps, and 7 Ps, that turn a crowded calendar of conferences and roadshows into a deliberate growth engine. Applied to long sales cycles and buying committees full of educators, administrators, and procurement leads, these m…
  - note: Empty. First paragraph of the article, verbatim.

#### Resource: How can I measure the effectiveness of my event marketing mix strategy?
`resource` | `_id`: `resource-webflow-6a57edbe52c5b93695815a53` | document action: **PATCH**
> slug: `how-can-i-measure-the-effectiveness-of-my-event-marketing-mix-strategy`

- **seo.title** [FILL]: Measuring the Effectiveness of Your Event Marketing Mix | 27zero
- **seo.description** [FILL]: Measurement turns a booth, a keynote, and a follow-up sequence into a defensible story tied to revenue. Learn the metrics that matter for EdTech events.
  - note: Written by hand.
- **publishedAt** [FILL]: 2026-07-15T00:00:00.000Z
  - note: Empty. Same rule the other 16 resources already follow (date of creation in Webflow).
- **category** [REVIEW]: Marketing
  - note: Empty. Only two categories exist (Marketing, Communication); the content marketing articles could fit Communication.

#### Resource: In what ways can partnerships with educational institutions influence the 'Place' and 'Pro
`resource` | `_id`: `resource-webflow-6a57ede69f1354e2b4dbada2` | document action: **PATCH**
> slug: `in-what-ways-can-partnerships-with-educational-institutions-influence-the-place-and-promotion-components-of-th`

- **seo.title** [FILL]: How Institutional Partnerships Shape the Event Marketing Mix | 27zero
- **seo.description** [FILL]: Most EdTech event plans treat 'Place' and 'Promotion' as logistics line items, a venue to book and a few ad buys to schedule.
  - note: First sentence(s) of the existing short description.
- **publishedAt** [FILL]: 2026-07-15T00:00:00.000Z
  - note: Empty. Same rule the other 16 resources already follow (date of creation in Webflow).
- **category** [REVIEW]: Marketing
  - note: Empty. Only two categories exist (Marketing, Communication); the content marketing articles could fit Communication.

#### Resource: What are some common challenges organizers face when developing an event marketing mix?
`resource` | `_id`: `resource-webflow-6a57ee05253ed680e1c43ba5` | document action: **PATCH**
> slug: `what-are-some-common-challenges-organizers-face-when-developing-an-event-marketing-mix`

- **seo.title** [FILL]: Challenges in Developing an Event Marketing Mix | 27zero
- **seo.description** [FILL]: Building an event marketing mix for EdTech looks tidy on a whiteboard and unravels fast in execution.
  - note: First sentence(s) of the existing short description.
- **publishedAt** [FILL]: 2026-07-15T00:00:00.000Z
  - note: Empty. Same rule the other 16 resources already follow (date of creation in Webflow).
- **category** [REVIEW]: Marketing
  - note: Empty. Only two categories exist (Marketing, Communication); the content marketing articles could fit Communication.

## 12. The EdTech Mentor interviews (72)
Interview bodies, pearls of wisdom, rapid-fire answers and guest data are legitimate and untouched. Added: SEO title and description for all 72 (none exist), publish dates (none exist), and fixes for five documents where guest fields are empty or hold the wrong kind of text. Publish dates use the same rule already used for resources (creation date in Webflow). 11 interviews were created in one batch on 2024-02-23, so that date is almost certainly not their publish date: those 11 are held for review. One interview (Natalia Pereldik) exists only as an unpublished draft.

#### Interview: Phill Miller
`edtechMentor` | `_id`: `edtechMentor-webflow-65d89aceefc8ed8925da74a3` | document action: **PATCH**
> title: A driving force for change and value creation in the EdTech space

- **seo.title** [FILL]: Phill Miller, Skilwell | The EdTech Mentor
- **seo.description** [FILL]: Phill Miller, CEO at Skilwell, shares lessons for EdTech leaders on The EdTech Mentor, 27zero's interview series.
  - note: Template: the intro text has no leading sentence that fits 160 characters. Enrich by hand if wanted.
- **publishedAt** [REVIEW]: 2024-02-23T00:00:00.000Z
  - note: Batch creation date shared by 11 interviews; not a reliable publish date.

#### Interview: Raquel Gonzales
`edtechMentor` | `_id`: `edtechMentor-webflow-65d89aceefc8ed8925da74b7` | document action: **PATCH**
> title: Lessons in edtech marketing to enhance access

- **seo.title** [FILL]: Raquel Gonzales, Arizona State University | The EdTech Mentor
- **seo.description** [FILL]: Raquel Gonzales, Head of Marketing at Arizona State University, shares lessons for EdTech leaders on The EdTech Mentor, 27zero's interview series.
  - note: Template: the intro text has no leading sentence that fits 160 characters. Enrich by hand if wanted.
- **publishedAt** [REVIEW]: 2024-02-23T00:00:00.000Z
  - note: Batch creation date shared by 11 interviews; not a reliable publish date.

#### Interview: Natasha Davidson
`edtechMentor` | `_id`: `edtechMentor-webflow-65d89aceefc8ed8925da74df` | document action: **PATCH**
> title: Local engagement global impact

- **seo.title** [FILL]: Natasha Davidson, Global Impact | The EdTech Mentor
- **seo.description** [FILL]: We are delighted to share this inspiring interview with Natasha Davidson, a highly accomplished EdTech marketer with a wealth of experience.
  - note: First sentence(s) of the existing intro text.
- **publishedAt** [REVIEW]: 2024-02-23T00:00:00.000Z
  - note: Batch creation date shared by 11 interviews; not a reliable publish date.

#### Interview: Adrián Garza
`edtechMentor` | `_id`: `edtechMentor-webflow-65d89aceefc8ed8925da74ba` | document action: **PATCH**
> title: Launching school economics into the stratosphere

- **seo.title** [FILL]: Adrián Garza, Mattilda | The EdTech Mentor
- **seo.description** [FILL]: Adrián Garza is one of the founders of Mattilda, an innovative startup that is helping schools throughout Mexico improve their financial management.
  - note: First sentence(s) of the existing intro text.
- **publishedAt** [REVIEW]: 2024-02-23T00:00:00.000Z
  - note: Batch creation date shared by 11 interviews; not a reliable publish date.

#### Interview: Ana María Beleño Ríos
`edtechMentor` | `_id`: `edtechMentor-webflow-65d89aceefc8ed8925da74b9` | document action: **PATCH**
> title: Rethinking EdTech B2B marketing

- **seo.title** [FILL]: Ana María Beleño Ríos, LAC / Anthology | The EdTech Mentor
- **seo.description** [FILL]: Ana María Beleño Ríos, Regional Head of Marketing at LAC / Anthology, shares lessons for EdTech leaders on The EdTech Mentor, 27zero's interview series.
  - note: Template: the intro text has no leading sentence that fits 160 characters. Enrich by hand if wanted.
- **publishedAt** [REVIEW]: 2024-02-23T00:00:00.000Z
  - note: Batch creation date shared by 11 interviews; not a reliable publish date.

#### Interview: Sam Weber
`edtechMentor` | `_id`: `edtechMentor-webflow-65d89aceefc8ed8925da74f8` | document action: **PATCH**
> title: EdTech from a unique perspective

- **seo.title** [FILL]: Sam Weber, Unique Perspective | The EdTech Mentor
- **seo.description** [FILL]: Sam Weber, EdTech at Unique Perspective, shares lessons for EdTech leaders on The EdTech Mentor, 27zero's interview series.
  - note: Template: the intro text has no leading sentence that fits 160 characters. Enrich by hand if wanted.
- **publishedAt** [REVIEW]: 2024-02-23T00:00:00.000Z
  - note: Batch creation date shared by 11 interviews; not a reliable publish date.

#### Interview: Frans Van Eck
`edtechMentor` | `_id`: `edtechMentor-webflow-65d89aceefc8ed8925da7500` | document action: **PATCH**
> title: Marketing EdTech to the world Frans Van Eck

- **seo.title** [FILL]: Frans Van Eck, the World | The EdTech Mentor
- **seo.description** [FILL]: In EdTech you get to see a lot of super-engaged people who really value their work in education. That is inspiring.
  - note: First sentence(s) of the existing intro text.
- **publishedAt** [REVIEW]: 2024-02-23T00:00:00.000Z
  - note: Batch creation date shared by 11 interviews; not a reliable publish date.

#### Interview: Brad Schleicher
`edtechMentor` | `_id`: `edtechMentor-webflow-65d89aceefc8ed8925da7501` | document action: **PATCH**
> title: EdTech through the eyes of a product marketer

- **seo.title** [FILL]: Brad Schleicher, Edtech Through the Eyes | The EdTech Mentor
- **seo.description** [FILL]: It's not a job that's ever done, it's something that's always moving and changing as the needs of the education space change.
  - note: First sentence(s) of the existing intro text.
- **publishedAt** [REVIEW]: 2024-02-23T00:00:00.000Z
  - note: Batch creation date shared by 11 interviews; not a reliable publish date.

#### Interview: Daniela López
`edtechMentor` | `_id`: `edtechMentor-webflow-65d89aceefc8ed8925da74b8` | document action: **PATCH**
> title: Diversification leadership and trust keys to success in EdTech

- **seo.title** [FILL]: Daniela López, uPlanner | The EdTech Mentor
- **seo.description** [FILL]: Today we have the pleasure of speaking with Daniela López, a “dura”, as they say in Colombia, in marketing and sales.
  - note: First sentence(s) of the existing intro text.
- **publishedAt** [REVIEW]: 2024-02-23T00:00:00.000Z
  - note: Batch creation date shared by 11 interviews; not a reliable publish date.

#### Interview: Andres Nuñez
`edtechMentor` | `_id`: `edtechMentor-webflow-65d89aceefc8ed8925da74ff` | document action: **PATCH**
> title: EdTech with a purpose the Nuñez family and Griky

- **seo.title** [FILL]: Andres Nuñez | The EdTech Mentor
- **seo.description** [FILL]: Continuing to work with a partner after more than ten years isn’t easy.
  - note: First sentence(s) of the existing intro text.
- **publishedAt** [REVIEW]: 2024-02-23T00:00:00.000Z
  - note: Batch creation date shared by 11 interviews; not a reliable publish date.
- **guestRole** [REVIEW]: Serial EdTech Entrepreneur
  - note: Empty. That text sits in the company field today; the title names Griky as the company.

#### Interview: Rochelle Vincent
`edtechMentor` | `_id`: `edtechMentor-webflow-65d89aceefc8ed8925da74b6` | document action: **PATCH**
> title: Lessons in team building and leadership development

- **seo.title** [FILL]: Rochelle Vincent, Anthology Inc. | The EdTech Mentor
- **seo.description** [FILL]: Raised in Brisbane, Australia, Rochelle Vincent was the first in her family to attend university.
  - note: First sentence(s) of the existing intro text.
- **publishedAt** [REVIEW]: 2024-02-23T00:00:00.000Z
  - note: Batch creation date shared by 11 interviews; not a reliable publish date.

#### Interview: Audrey Masset
`edtechMentor` | `_id`: `edtechMentor-webflow-65e9fb3fee3bfc653f4a2cee` | document action: **PATCH**
> title: Understanding your audience and localizing messages to get close to them

- **seo.title** [FILL]: Audrey Masset, Ex Blackboard - Anthology Inc. | The EdTech Mentor
- **seo.description** [FILL]: In this episode of EdTech Mentor, we talk with Audrey Masset, Head of Marketing, ex Blackboard - Anthology Inc.
  - note: First sentence(s) of the existing intro text.
- **publishedAt** [FILL]: 2024-03-07T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Stephanie Goldberg
`edtechMentor` | `_id`: `edtechMentor-webflow-65f0a7d38c14b4f573019b8a` | document action: **PATCH**
> title: How to create honest connections with institutions and individuals

- **seo.title** [FILL]: Stephanie Goldberg, Turnitin | The EdTech Mentor
- **seo.description** [FILL]: Our special guest for this edition of EdTech Mentor is Stephanie Goldberg, Regional Marketing Manager LATAM at Turnitin.
  - note: First sentence(s) of the existing intro text.
- **publishedAt** [FILL]: 2024-03-12T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Mirissa Kampf
`edtechMentor` | `_id`: `edtechMentor-webflow-65f351d90bc2b56064bc32e1` | document action: **PATCH**
> title: The Worst Thing They Can Say is “No”: How to Seize Opportunities by Putting in the Work.

- **seo.title** [FILL]: Mirissa Kampf, Global Integrated Marketing at D2L | The EdTech Mentor
- **seo.description** [FILL]: For the latest edition of EdTech Mentor, we recently had the pleasure of speaking with Mirissa Kampf, Senior Director of Global Integrated Marketing at D2L.
  - note: First sentence(s) of the existing intro text.
- **publishedAt** [FILL]: 2024-03-14T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Carolina Pintor
`edtechMentor` | `_id`: `edtechMentor-webflow-65f3492f591bfc0a67e3bf63` | document action: **PATCH**
> title: The value of developing meaningful relationships

- **seo.title** [FILL]: Carolina Pintor, Coursera | The EdTech Mentor
- **seo.description** [FILL]: In the dynamic and demanding world of EdTech, versatility and determination are invaluable qualities for successfully executing multiple projects.
  - note: First sentence(s) of the existing intro text.
- **publishedAt** [FILL]: 2024-03-14T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Phil Hill
`edtechMentor` | `_id`: `edtechMentor-webflow-65fe077f22116c7ecc29600f` | document action: **PATCH**
> title: Industry Insiders Call Him Phil, His Full Name is Phil Hill

- **seo.title** [FILL]: Phil Hill | The EdTech Mentor
- **seo.description** [FILL]: A husband, father of three, and grandfather, Phil Hill has been an EdTech market analyst and consultant for over two decades.
  - note: First sentence(s) of the existing intro text.
- **publishedAt** [FILL]: 2024-03-22T00:00:00.000Z
  - note: Creation date in Webflow.
- **guestCompany** [REVIEW]: Phil Hill & Associates
  - note: Empty. Confirm the company name.

#### Interview: Lynn Zingraf
`edtechMentor` | `_id`: `edtechMentor-webflow-660c77dad6e552608a1a487b` | document action: **PATCH**
> title:  The EdTech Marketer’s Guide to Event Planning Excellence (and maybe even the Galaxy)

- **seo.title** [FILL]: Lynn Zingraf, 27zero | The EdTech Mentor
- **seo.description** [FILL]: Picture, if you will, a world where event planning is not just a task, but an odyssey through the infinite complexities of space and time.
  - note: First sentence(s) of the existing intro text.
- **publishedAt** [FILL]: 2024-04-02T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Linda Feng
`edtechMentor` | `_id`: `edtechMentor-webflow-6639554c3595f69177bd1f65` | document action: **PATCH**
> title: Architecting the Future: Insights from Linda Feng on Software Development and AI in Education

- **seo.title** [FILL]: Linda Feng, D2L | The EdTech Mentor
- **seo.description** [FILL]: Linda Feng, VP of Architecture at D2L, shares lessons for EdTech leaders on The EdTech Mentor, 27zero's interview series.
  - note: Template: the intro text has no leading sentence that fits 160 characters. Enrich by hand if wanted.
- **publishedAt** [FILL]: 2024-05-06T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Justin Menard
`edtechMentor` | `_id`: `edtechMentor-webflow-665a2e7ccf9ec7b42cc61829` | document action: **PATCH**
> title: Unveiling the Data Symphony: ListEdTech Founder Justin Menard on Navigating The EdTech Landscape

- **seo.title** [FILL]: Justin Menard, ListEdTech | The EdTech Mentor
- **seo.description** [FILL]: Welcome to a brand-new EdTech Mentor interview featuring Justin Menard, the CEO and founder of ListEdTech!
  - note: First sentence(s) of the existing intro text.
- **publishedAt** [FILL]: 2024-05-31T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: David Meek
`edtechMentor` | `_id`: `edtechMentor-webflow-666ca9934eaf5f7aa2765d82` | document action: **PATCH**
> title: Crafting Tomorrow's SIS by Connecting with Customers

- **seo.title** [FILL]: David Meek, Student First | The EdTech Mentor
- **seo.description** [FILL]: In our everyday quest for knowledge and advancement, the world of educational technology emerges as a pivotal player, shaping how we learn and grow.
  - note: First sentence(s) of the existing intro text.
- **publishedAt** [FILL]: 2024-06-14T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Jonathan Fry
`edtechMentor` | `_id`: `edtechMentor-webflow-667493930c140defa2041c44` | document action: **PATCH**
> title: Maximizing the Use of Funded Scholarships: Insights from EdTech Maven Jonathan Fry

- **seo.title** [FILL]: Jonathan Fry, Scholarship Magic | The EdTech Mentor
- **seo.description** [FILL]: Welcome to the forefront of educational transformation, where innovation is paving the way for a brighter future for students everywhere.
  - note: First sentence(s) of the existing intro text.
- **publishedAt** [FILL]: 2024-06-20T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Wesley Matthews
`edtechMentor` | `_id`: `edtechMentor-webflow-667495b1bddc771f159ee429` | document action: **PATCH**
> title: Scaling EdTech Success: Wesley Matthews Shares an Insiders' View of Entrepreneurship, Teamwork, and Growth

- **seo.title** [FILL]: Wesley Matthews, Doctums Global | The EdTech Mentor
- **seo.description** [FILL]: Discover the insights and experiences of Wesley Matthews, President and founder of Doctums Global, in our exclusive EdTech Mentor Interview.
  - note: First sentence(s) of the existing intro text.
- **publishedAt** [FILL]: 2024-06-20T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Sven Fund
`edtechMentor` | `_id`: `edtechMentor-webflow-667b3831f58ed6e440443066` | document action: **PATCH**
> title:  Sowing the seeds of profound impact: Sven Fund on Loving What You Do, Nurturing Relationships, and Scaling in

- **seo.title** [FILL]: Sven Fund, ReviewerCredits | The EdTech Mentor
- **seo.description** [FILL]: Introducing Sven Fund, a seasoned leader and entrepreneur with a wealth of experience in academic and scholarly publishing.
  - note: First sentence(s) of the existing intro text.
- **publishedAt** [FILL]: 2024-06-25T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Brad Koch
`edtechMentor` | `_id`: `edtechMentor-webflow-6682795a71883f4f7fec7439` | document action: **PATCH**
> title:  Building EdTech products that matter: Brad Koch on understanding the future of education through curiosity, c

- **seo.title** [FILL]: Brad Koch, Koch EdTech Consulting | The EdTech Mentor
- **seo.description** [FILL]: Brad Koch, Owner at Koch EdTech Consulting, shares lessons for EdTech leaders on The EdTech Mentor, 27zero's interview series.
  - note: Template: the intro text has no leading sentence that fits 160 characters. Enrich by hand if wanted.
- **publishedAt** [FILL]: 2024-07-01T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Brendan Aldrich
`edtechMentor` | `_id`: `edtechMentor-webflow-66b2957e54b152010c9da88f` | document action: **PATCH**
> title: Democracy, Truth, Courage, and 'The Magic Five'.

- **seo.title** [FILL]: Brendan Aldrich, Invoke Learning | The EdTech Mentor
- **seo.description** [FILL]: Brendan Aldrich shares lessons for EdTech leaders on The EdTech Mentor, 27zero's interview series.
  - note: Template: the intro text has no leading sentence that fits 160 characters. Enrich by hand if wanted.
- **publishedAt** [FILL]: 2024-08-06T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Tiago Mateus
`edtechMentor` | `_id`: `edtechMentor-webflow-66c66fb8f6965e6275a6466f` | document action: **PATCH**
> title: Unlocking EdTech Growth in 2024 and Beyond: Expert Insights from Tiago Mateus on AI, Partnerships, and GTM Str

- **seo.title** [FILL]: Tiago Mateus, EMEA & APAC At Ready Education | The EdTech Mentor
- **seo.description** [FILL]: Tiago Mateus, Managing Director at EMEA & APAC At Ready Education, shares lessons for EdTech leaders on The EdTech Mentor, 27zero's interview series.
  - note: Template: the intro text has no leading sentence that fits 160 characters. Enrich by hand if wanted.
- **publishedAt** [FILL]: 2024-08-21T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Jeff Rubenstein
`edtechMentor` | `_id`: `edtechMentor-webflow-66c77b78429b48cf31231521` | document action: **PATCH**
> title: Beyond the Buzzwords: Jeff Rubenstein on the Real Impact of AI in Education

- **seo.title** [FILL]: Jeff Rubenstein, Doowii | The EdTech Mentor
- **seo.description** [FILL]: What do a passion for philosophy, a stint in software engineering, and a deep-rooted empathy for educators have in common?
  - note: First sentence(s) of the existing intro text.
- **publishedAt** [FILL]: 2024-08-22T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Marcela Marquez
`edtechMentor` | `_id`: `edtechMentor-webflow-66c785862448846eb89d6fb2` | document action: **PATCH**
> title: Curiosity as a Method: Forging Great Ideas with Empathy and AI

- **seo.title** [FILL]: Marcela Marquez, 27zero | The EdTech Mentor
- **seo.description** [FILL]: Marcela Marquez, Creative Operations Director at 27zero, shares lessons for EdTech leaders on The EdTech Mentor, 27zero's interview series.
  - note: Template: the intro text has no leading sentence that fits 160 characters. Enrich by hand if wanted.
- **publishedAt** [FILL]: 2024-08-22T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Carlos Marquez 
`edtechMentor` | `_id`: `edtechMentor-webflow-66c7825fbc158ab8295f9b98` | document action: **PATCH**
> title: From Zero to Hero: Building Powerful EdTech Brands with Carlos Marquez

- **seo.title** [FILL]: Carlos Marquez, 27Zero | The EdTech Mentor
- **seo.description** [FILL]: Carlos Marquez, Founder, CEO & Creative Ops Leader at 27Zero, shares lessons for EdTech leaders on The EdTech Mentor, 27zero's interview series.
  - note: Template: the intro text has no leading sentence that fits 160 characters. Enrich by hand if wanted.
- **publishedAt** [FILL]: 2024-08-22T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Brian Finnerty
`edtechMentor` | `_id`: `edtechMentor-webflow-66e9a24136e67c76ac807dad` | document action: **PATCH**
> title: Marketing at the C-Level: Brian Finnerty on EdTech

- **seo.title** [FILL]: Brian Finnerty, D2L | The EdTech Mentor
- **seo.description** [FILL]: Brian Finnerty, Chief Marketing Officer at D2L, shares lessons for EdTech leaders on The EdTech Mentor, 27zero's interview series.
  - note: Template: the intro text has no leading sentence that fits 160 characters. Enrich by hand if wanted.
- **publishedAt** [FILL]: 2024-09-17T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Julie Kelleher
`edtechMentor` | `_id`: `edtechMentor-webflow-66e9f7bbd55e4ad357bb686d` | document action: **PATCH**
> title: A Market-First Mindset in EdTech: Julie Kelleher’s Blueprint for Success

- **seo.title** [FILL]: Julie Kelleher, Kelleher Consulting Group | The EdTech Mentor
- **seo.description** [FILL]: Julie Kelleher’s journey through the world of EdTech is as dynamic as the industry itself.
  - note: First sentence(s) of the existing intro text.
- **publishedAt** [FILL]: 2024-09-17T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: María Medrano 
`edtechMentor` | `_id`: `edtechMentor-webflow-66e9bbd651688925e516029f` | document action: **PATCH**
> title: Building with Purpose: The Marathon of Product Development with Inspírame's CEO María Medrano

- **seo.title** [FILL]: María Medrano, Inspírame | The EdTech Mentor
- **seo.description** [FILL]: María Medrano's journey from being the first in her family to attend college to becoming co-founder and CEO of Inspírame is precisely that: inspiring.
  - note: First sentence(s) of the existing intro text.
- **publishedAt** [FILL]: 2024-09-17T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Lydia Winn
`edtechMentor` | `_id`: `edtechMentor-webflow-66ea2d02839d77c5ee1aa726` | document action: **PATCH**
> title:  Empowerly’s Lydia Winn on Shaping EdTech One Step at a Time

- **seo.title** [FILL]: Lydia Winn, Empowerly | The EdTech Mentor
- **seo.description** [FILL]: Lydia Winn, Sales and GTM at Empowerly, shares lessons for EdTech leaders on The EdTech Mentor, 27zero's interview series.
  - note: Template: the intro text has no leading sentence that fits 160 characters. Enrich by hand if wanted.
- **publishedAt** [FILL]: 2024-09-18T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Joe Fisher
`edtechMentor` | `_id`: `edtechMentor-webflow-66ec4de742dfabcc9221f3ed` | document action: **PATCH**
> title: The Heart of EdTech Marketing: Joe Fisher on the Power of Human Connection

- **seo.title** [FILL]: Joe Fisher, Student First | The EdTech Mentor
- **seo.description** [FILL]: Joe Fisher, Senior Vice President Marketing at Student First, shares lessons for EdTech leaders on The EdTech Mentor, 27zero's interview series.
  - note: Template: the intro text has no leading sentence that fits 160 characters. Enrich by hand if wanted.
- **publishedAt** [FILL]: 2024-09-19T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: David Yip 
`edtechMentor` | `_id`: `edtechMentor-webflow-672500b028ec200c66c45eaf` | document action: **PATCH**
> title: Classroom to Career: Alumly's Plan for Bridging the Experience Gap

- **seo.title** [FILL]: David Yip | The EdTech Mentor
- **seo.description** [FILL]: David Yip, VP at Global Head Community, Diversity and Belonging, shares lessons for EdTech leaders on The EdTech Mentor, 27zero's interview series.
  - note: Template: the intro text has no leading sentence that fits 160 characters. Enrich by hand if wanted.
- **publishedAt** [FILL]: 2024-11-01T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Justin Vondra
`edtechMentor` | `_id`: `edtechMentor-webflow-672a9d7328c190547fa69574` | document action: **PATCH**
> title: Cracking the SIS Code: VP of Sales Justin Vondra on Driving Meaningful Impact in Higher Education

- **seo.title** [FILL]: Justin Vondra, Sales at Academia by Serosoft | The EdTech Mentor
- **seo.description** [FILL]: Justin Vondra, Vice President at Sales at Academia by Serosoft, shares lessons for EdTech leaders on The EdTech Mentor, 27zero's interview series.
  - note: Template: the intro text has no leading sentence that fits 160 characters. Enrich by hand if wanted.
- **publishedAt** [FILL]: 2024-11-05T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Natalia Pereldik (DRAFT only, never published)
`edtechMentor` | `_id`: `drafts.edtechMentor-webflow-6734f709a9240d79e9bda122` | document action: **PATCH**
> title: Changing the Math Mindset: Natalia Pereldik’s Funexpected Approach to Making Math a Skill Kids Love

- **seo.title** [FILL]: Natalia Pereldik, Funexpected Math | The EdTech Mentor
- **seo.description** [FILL]: Natalia Pereldik, Co-Founder at Funexpected Math, shares lessons for EdTech leaders on The EdTech Mentor, 27zero's interview series.
  - note: Template: the intro text has no leading sentence that fits 160 characters. Enrich by hand if wanted.
- **publishedAt** [FILL]: 2024-11-13T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Curtiss Barnes
`edtechMentor` | `_id`: `edtechMentor-webflow-6743dd90ed2b87649dc337de` | document action: **PATCH**
> title: From Standards to Global Impact: 1EdTech’s CEO Curtiss Barnes’ on the Vision of a Trusted Education Ecosystem

- **seo.title** [FILL]: Curtiss Barnes, 1EdTech Consortium | The EdTech Mentor
- **seo.description** [FILL]: With an estimated 100 billion LTI transactions occurring annually, the reach and impact of education technology standards are undeniable.
  - note: First sentence(s) of the existing intro text.
- **publishedAt** [FILL]: 2024-11-25T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Arunabh Varma
`edtechMentor` | `_id`: `edtechMentor-webflow-6743f5ea7438c74a1d23b973` | document action: **PATCH**
> title: One-on-One Mentoring at Scale: How Intercell is Revolutionizing India’s Career Landscape

- **seo.title** [FILL]: Arunabh Varma, Intercell | The EdTech Mentor
- **seo.description** [FILL]: India’s higher education market is one of the largest in the world, with over 40 million students graduating annually.
  - note: First sentence(s) of the existing intro text.
- **publishedAt** [FILL]: 2024-11-25T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Dominic Garcia
`edtechMentor` | `_id`: `edtechMentor-webflow-6743f8e83581e92471d04e20` | document action: **PATCH**
> title: Better Data, Better Higher Education: Inside Times Higher Education's Obsession with Data Quality for Global I

- **seo.title** [FILL]: Dominic Garcia, Times Higher Education | The EdTech Mentor
- **seo.description** [FILL]: Dominic Garcia, Global corporate lead at Times Higher Education, shares lessons for EdTech leaders on The EdTech Mentor, 27zero's interview series.
  - note: Template: the intro text has no leading sentence that fits 160 characters. Enrich by hand if wanted.
- **publishedAt** [FILL]: 2024-11-25T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Lana Guernsey
`edtechMentor` | `_id`: `edtechMentor-webflow-6743fba4f404c13643eb7b0b` | document action: **PATCH**
> title: Living Strategy’s Lana Guernsey on the Power of Strategy and Purpose for the Future of K-12

- **seo.title** [FILL]: Lana Guernsey, Living Strategy | The EdTech Mentor
- **seo.description** [FILL]: Lana Guernsey, Founder & CEO at Living Strategy, shares lessons for EdTech leaders on The EdTech Mentor, 27zero's interview series.
  - note: Template: the intro text has no leading sentence that fits 160 characters. Enrich by hand if wanted.
- **publishedAt** [FILL]: 2024-11-25T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Chad A. Stevens
`edtechMentor` | `_id`: `edtechMentor-webflow-6743f098b8759c34dd19a850` | document action: **PATCH**
> title: Chad Stevens of TinkrWorks on Expanding the Boundaries of Inclusive STEM/STEAM Education

- **seo.title** [FILL]: Chad A. Stevens, TinkRworks | The EdTech Mentor
- **seo.description** [FILL]: Chad A. Stevens, Chief Executive Officer at TinkRworks, shares lessons for EdTech leaders on The EdTech Mentor, 27zero's interview series.
  - note: Template: the intro text has no leading sentence that fits 160 characters. Enrich by hand if wanted.
- **publishedAt** [FILL]: 2024-11-25T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Reinhold Lange
`edtechMentor` | `_id`: `edtechMentor-webflow-6743f4564a0976e1ab7bf71b` | document action: **PATCH**
> title: Gardener or Chess Player? Reinhold Lange on Adapting to Grow as a Product Manager in EdTech

- **seo.title** [FILL]: Reinhold Lange, Quality Learning Experiences | The EdTech Mentor
- **seo.description** [FILL]: Reinhold Lange, Builder at Quality Learning Experiences, shares lessons for EdTech leaders on The EdTech Mentor, 27zero's interview series.
  - note: Template: the intro text has no leading sentence that fits 160 characters. Enrich by hand if wanted.
- **publishedAt** [FILL]: 2024-11-25T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Burck Smith
`edtechMentor` | `_id`: `edtechMentor-webflow-674647ff4fd63178bda38249` | document action: **PATCH**
> title: Burck Smith on Scaling StraighterLine: How New Education Models Are Disrupting a Century-Old System

- **seo.title** [FILL]: Burck Smith, StraighterLine | The EdTech Mentor
- **seo.description** [FILL]: Burck Smith, founder and executive chairman of StraighterLine, has been a pioneering force in education technology for nearly three decades.
  - note: First sentence(s) of the existing intro text.
- **publishedAt** [FILL]: 2024-11-26T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Frederico Bello
`edtechMentor` | `_id`: `edtechMentor-webflow-674f09e3a52f08621e106e4d` | document action: **PATCH**
> title: Breaking the Textbook Monopoly with Luca: Frederico Bello’s Mission to Redefine K-12 Education for Latin Ameri

- **seo.title** [FILL]: Frederico Bello, Luca | The EdTech Mentor
- **seo.description** [FILL]: In a region with over 120 million K-12 students, Latin America stands as the third-largest educational market globally, trailing only India and China.
  - note: First sentence(s) of the existing intro text.
- **publishedAt** [FILL]: 2024-12-03T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Christine Lee
`edtechMentor` | `_id`: `edtechMentor-webflow-674f119cd948edb9dcfdc70d` | document action: **PATCH**
> title: Building a Category from Scratch: Christine Lee on Elsevier’s Game-Changing Moves in the Faculty Information S

- **seo.title** [FILL]: Christine Lee, Elsevier | The EdTech Mentor
- **seo.description** [FILL]: Christine Lee, VP of Product Marketing at Interfolio by Elsevier, shares her fascinating journey through EdTech in this new EdTech Mentor conversation.
  - note: First sentence(s) of the existing intro text.
- **publishedAt** [FILL]: 2024-12-03T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Richard Herrmann
`edtechMentor` | `_id`: `edtechMentor-webflow-6751e61ebf89b9c4fad8120a` | document action: **PATCH**
> title: Closer to the Customer: Intel’s Global Director of System Integrations Rick Herrmann on Leading Global Teams

- **seo.title** [FILL]: Richard Herrmann, Intel Corporation | The EdTech Mentor
- **seo.description** [FILL]: For Richard Herrmann, the transformative power of technology lies not only in its capabilities, but in how it bridges gaps in access and equity.
  - note: First sentence(s) of the existing intro text.
- **publishedAt** [FILL]: 2024-12-05T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Jayme Hong
`edtechMentor` | `_id`: `edtechMentor-webflow-67520ca5ebdcd6cdde547096` | document action: **PATCH**
> title: Turning Passion into Progress: Jayme Hong on Empowering Music Creatives with PIVODIO’s Personalized Coaching

- **seo.title** [FILL]: Jayme Hong, PIVODIO | The EdTech Mentor
- **seo.description** [FILL]: While the global music industry is worth $116.30 billion, the average professional musician in the U.S. earns less than $45,000 a year?
  - note: First sentence(s) of the existing intro text.
- **publishedAt** [FILL]: 2024-12-05T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Rob Sparks
`edtechMentor` | `_id`: `edtechMentor-webflow-67524817f81425e8fdf54e41` | document action: **PATCH**
> title: Achieving Seamless Worldwide Marketing: Rob Sparks' Strategy to Adapt Across Territories

- **seo.title** [FILL]: Rob Sparks, WeVideo | The EdTech Mentor
- **seo.description** [FILL]: There are over 445 education-related events annually in North America alone, tailored to EdTech professionals and institutions.
  - note: First sentence(s) of the existing intro text.
- **publishedAt** [FILL]: 2024-12-06T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Glenda Morgan
`edtechMentor` | `_id`: `edtechMentor-webflow-6760971bd2418d1499add10a` | document action: **PATCH**
> title: Against Solutionism in EdTech: On EdTech’s Glenda Morgan on Addressing Student Success Challenges at the Roots

- **seo.title** [FILL]: Glenda Morgan, Phil Hill & Associates | The EdTech Mentor
- **seo.description** [FILL]: Glenda Morgan, EdTech Market Analyst at Phil Hill & Associates, shares lessons for EdTech leaders on The EdTech Mentor, 27zero's interview series.
  - note: Template: the intro text has no leading sentence that fits 160 characters. Enrich by hand if wanted.
- **publishedAt** [FILL]: 2024-12-16T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Juan Pablo Delacroix
`edtechMentor` | `_id`: `edtechMentor-webflow-677ec6ab1902d6eb62ab6c4b` | document action: **PATCH**
> title: The Soft Skills Wave Is Here (And Most Aren’t Surfing Yet): Re-Skilling.AI’s Juan Pablo Delacroix Exposes an U

- **seo.title** [FILL]: Juan Pablo Delacroix, Re-Skilling.AI | The EdTech Mentor
- **seo.description** [FILL]: Juan Pablo Delacroix, CEO & Founder at Re-Skilling.AI, shares lessons for EdTech leaders on The EdTech Mentor, 27zero's interview series.
  - note: Template: the intro text has no leading sentence that fits 160 characters. Enrich by hand if wanted.
- **publishedAt** [FILL]: 2025-01-08T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Abubakar Sial
`edtechMentor` | `_id`: `edtechMentor-webflow-678849ec70c47a84b0074308` | document action: **PATCH**
> title: OctiLearn’s Abubakar Sial is on a Quest to Build the World’s Smartest Learning Ecosystem

- **seo.title** [FILL]: Abubakar Sial, OctiLearn | The EdTech Mentor
- **seo.description** [FILL]: Abubakar Sial, Founder and CEO of OctiLearn, is reimagining how students tackle their academic challenges with a bold vision for adaptive learning.
  - note: First sentence(s) of the existing intro text.
- **publishedAt** [FILL]: 2025-01-15T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Boluwatife Oluwafemi
`edtechMentor` | `_id`: `edtechMentor-webflow-67897ac6a5ca59e4131ab968` | document action: **PATCH**
> title: Mind the Gap: Boluwatife Oluwafemi Tackles Africa’s Education-to-Employment Challenges

- **seo.title** [FILL]: Boluwatife Oluwafemi, Uptick Talent, | The EdTech Mentor
- **seo.description** [FILL]: In a world where opportunities often feel limited, Boluwatife Oluwafemi is on a mission to change the narrative.
  - note: First sentence(s) of the existing intro text.
- **publishedAt** [FILL]: 2025-01-16T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Jim Brigadier
`edtechMentor` | `_id`: `edtechMentor-webflow-678976f0857d593ecd52562a` | document action: **PATCH**
> title: Ready Education’s CEO Jim Brigadier Explains How Authentic Leadership Fuels EdTech and Growth

- **seo.title** [FILL]: Jim Brigadier, Ready Education | The EdTech Mentor
- **seo.description** [FILL]: From his start as a Marine Corps officer to leading an impactful EdTech, Jim Brigadier has navigated a career defined by adaptability and purpose.
  - note: First sentence(s) of the existing intro text.
- **publishedAt** [FILL]: 2025-01-16T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Mark Miller
`edtechMentor` | `_id`: `edtechMentor-webflow-67890e5b6bbbc7c4ee695e72` | document action: **PATCH**
> title: Mark Miller: Counselor to EdTech Entrepreneurs & Investors

- **seo.title** [FILL]: Mark Miller, Good Harbor Partners | The EdTech Mentor
- **seo.description** [FILL]: Successful EdTech ventures aren't built on flashy pitches or massive total addressable markets, but on targeted solutions that demonstrate clear value.
  - note: First sentence(s) of the existing intro text.
- **publishedAt** [FILL]: 2025-01-16T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Mark Grovic
`edtechMentor` | `_id`: `edtechMentor-webflow-678909cd6053013a14b8e878` | document action: **PATCH**
> title: The Search for EdTech’s Next Chapter: Mark Grovic on Impact and Investment

- **seo.title** [FILL]: Mark Grovic, New Markets Venture Partners | The EdTech Mentor
- **seo.description** [FILL]: Mark Grovic, Founder at New Markets Venture Partners, shares lessons for EdTech leaders on The EdTech Mentor, 27zero's interview series.
  - note: Template: the intro text has no leading sentence that fits 160 characters. Enrich by hand if wanted.
- **publishedAt** [FILL]: 2025-01-16T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Jimmy Mathew
`edtechMentor` | `_id`: `edtechMentor-webflow-67a0faf0f782c6ea4435bf71` | document action: **PATCH**
> title: Zip Code Shouldn’t Define Student Success: Jimmy Mathew on Bridging the K-12 Learning Gap

- **seo.title** [FILL]: Jimmy Mathew, Excelsior Online Education | The EdTech Mentor
- **seo.description** [FILL]: Jimmy Mathew, VP of Marketing at Excelsior Online Education, shares lessons for EdTech leaders on The EdTech Mentor, 27zero's interview series.
  - note: Template: the intro text has no leading sentence that fits 160 characters. Enrich by hand if wanted.
- **publishedAt** [FILL]: 2025-02-03T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Kate Valenti
`edtechMentor` | `_id`: `edtechMentor-webflow-67acb387c3be54d9dbe1b08c` | document action: **PATCH**
> title: From Alignment to Vision: Unicon’s Kate Valenti on her Journey from COO to CEO

- **seo.title** [FILL]: Kate Valenti, Unicon Inc. | The EdTech Mentor
- **seo.description** [FILL]: Kate Valenti, CEO of Unicon Inc., a leader in learner-centric technology consulting, has spent over two decades shaping the digital learning landscape.
  - note: First sentence(s) of the existing intro text.
- **publishedAt** [FILL]: 2025-02-12T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Alexandra Pineda
`edtechMentor` | `_id`: `edtechMentor-webflow-67b2943ee70b867a63c5e713` | document action: **PATCH**
> title: Stop Worrying About the Coffee: 27zero’s Head of Events Alexandra Pineda on Letting Pros Handle the Chaos

- **seo.title** [FILL]: Alexandra Pineda, 27zero | The EdTech Mentor
- **seo.description** [FILL]: What if events weren’t just gatherings but transformative experiences that people can’t stop talking about?
  - note: First sentence(s) of the existing intro text.
- **publishedAt** [FILL]: 2025-02-17T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Noel Capacho
`edtechMentor` | `_id`: `edtechMentor-webflow-67b2991a5bc59fca6663a282` | document action: **PATCH**
> title: Ads, Mails, Campaigns: The A-Z of Performance Marketing by Noel Capacho of 27zero

- **seo.title** [FILL]: Noel Capacho, 27zero | The EdTech Mentor
- **seo.description** [FILL]: Marketing in EdTech isn’t just about great ideas, it’s about execution, precision, and constant adaptation.
  - note: First sentence(s) of the existing intro text.
- **publishedAt** [FILL]: 2025-02-17T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Sebastián Pulido
`edtechMentor` | `_id`: `edtechMentor-webflow-67b29b4b91343d51e08ba157` | document action: **PATCH**
> title: Modelling Content for EdTech: 27zero’s Customer Stories Lead Sebastián Pulido on Writing Strategically (with A

- **seo.title** [FILL]: Sebastián Pulido, 27zero | The EdTech Mentor
- **seo.description** [FILL]: In the world of EdTech marketing, words aren't just words, they're the foundation of everything.
  - note: First sentence(s) of the existing intro text.
- **publishedAt** [FILL]: 2025-02-17T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Darcy Hardy
`edtechMentor` | `_id`: `edtechMentor-webflow-67b35cbcbcef61f482046707` | document action: **PATCH**
> title: Doing Online Learning Right: Darcy Hardy on the Details Some Institutions May Be Ignoring

- **seo.title** [FILL]: Darcy Hardy, The Hardy Group | The EdTech Mentor
- **seo.description** [FILL]: Online learning isn’t just about moving classes to the internet, it’s about rethinking education entirely.
  - note: First sentence(s) of the existing intro text.
- **publishedAt** [FILL]: 2025-02-17T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Carolina Suárez
`edtechMentor` | `_id`: `edtechMentor-webflow-67c2163626f722d691594ef4` | document action: **PATCH**
> title: Building Brands that Live and Breathe—Carolina Suárez Shares Her Guide for Great Design

- **seo.title** [FILL]: Carolina Suárez, 27zero | The EdTech Mentor
- **seo.description** [FILL]: Branding is not just about logos and color palettes, it’s about creating something that lives, breathes, and evolves.
  - note: First sentence(s) of the existing intro text.
- **publishedAt** [FILL]: 2025-02-28T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Phill Miller, Laureano Díaz
`edtechMentor` | `_id`: `edtechMentor-webflow-67dc8c713ac4aa81a7780ace` | document action: **PATCH**
> title: We Want to Desmystify EdTech Investment (and We Got Investors to Do it For Us)

- **seo.title** [FILL]: Phill Miller and Laureano Díaz | The EdTech Mentor
- **seo.description** [FILL]: Phill Miller, Laureano Díaz shares lessons for EdTech leaders on The EdTech Mentor, 27zero's interview series.
  - note: Template: the intro text has no leading sentence that fits 160 characters. Enrich by hand if wanted.
- **publishedAt** [FILL]: 2025-03-20T00:00:00.000Z
  - note: Creation date in Webflow.
- **guestRole** [REVIEW]: Co-hosts, The EdTech Investor series
  - note: Empty. The company field currently holds the series tagline ("27zero & Phill Miller Present: The EdTech Investor.").

#### Interview: 27zero & Harbinger Lane
`edtechMentor` | `_id`: `edtechMentor-webflow-67eabd76c833b068c096cbdd` | document action: **PATCH**
> title: Empowering EdTech Companies Through Strategic Partnership

- **seo.title** [FILL]: 27zero & Harbinger Lane | The EdTech Mentor
- **seo.description** [FILL]: In this special edition of The EdTech Mentor, Laureano Díaz, CSO of 27zero, engages in a conversation with Darin Francis, CEO of Harbinger Lane.
  - note: First sentence(s) of the existing intro text.
- **publishedAt** [FILL]: 2025-03-31T00:00:00.000Z
  - note: Creation date in Webflow.
- **guestRole** [REVIEW]: Special edition: partnership announcement
  - note: Empty. Conversation between Laureano Díaz (27zero) and Darin Francis (Harbinger Lane).

#### Interview: Esteban Veintimilla
`edtechMentor` | `_id`: `edtechMentor-webflow-6812c070fda851a9c42736c8` | document action: **PATCH**
> title: Improving the Relevance of Higher Education With Job Market Data—1Mentor’s Esteban Veintimilla on Teaming Up T

- **seo.title** [FILL]: Esteban Veintimilla, 1Mentor | The EdTech Mentor
- **seo.description** [FILL]: In the world of EdTech, building a startup often feels like trying to redesign the airplane while flying it, and selling seats mid-air.
  - note: First sentence(s) of the existing intro text.
- **publishedAt** [FILL]: 2025-05-01T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Nicolás Elton
`edtechMentor` | `_id`: `edtechMentor-webflow-68544a9501e55e7b27bcaf1c` | document action: **PATCH**
> title: Do Students Succeed Because of Us—or In Spite of Us? Nicolás Elton brings global higher ed expertise to his ne

- **seo.title** [FILL]: Nicolás Elton, uPlanner | The EdTech Mentor
- **seo.description** [FILL]: What happens when a university can grow enrolment by 15% without building a single new classroom or hiring a new professor?
  - note: First sentence(s) of the existing intro text.
- **publishedAt** [FILL]: 2025-06-19T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Laureano Díaz
`edtechMentor` | `_id`: `edtechMentor-webflow-685577f09d4bf43d35302c06` | document action: **PATCH**
> title: From Help Desk to CIO: What Every Marketer Should Know About Campus IT in the US

- **seo.title** [FILL]: Laureano Díaz, 27zero | The EdTech Mentor
- **seo.description** [FILL]: Higher education relies on more than brilliant faculty and curious students.
  - note: First sentence(s) of the existing intro text.
- **publishedAt** [FILL]: 2025-06-20T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Jon Aleckson
`edtechMentor` | `_id`: `edtechMentor-webflow-686bfb4d08adc6be0eed8763` | document action: **PATCH**
> title: How to Bootstrap and Run (and Exit) an EdTech Business: Insights by Jon Aleckson

- **seo.title** [FILL]: Jon Aleckson | The EdTech Mentor
- **seo.description** [FILL]: Jon Aleckson shares lessons for EdTech leaders on The EdTech Mentor, 27zero's interview series.
  - note: Template: the intro text has no leading sentence that fits 160 characters. Enrich by hand if wanted.
- **publishedAt** [FILL]: 2025-07-07T00:00:00.000Z
  - note: Creation date in Webflow.
- **guestRole** [REVIEW]: EdTech Founder, Consultant & Investor
  - note: Empty. That text partly sits in the company field today; the company itself is unknown.

#### Interview: Lisa Sacchetti
`edtechMentor` | `_id`: `edtechMentor-webflow-68a4821be72d0ecf7b20b802` | document action: **PATCH**
> title: Don’t Hire a Salesperson and Expect Sales: Lisa Sacchetti Warns EdTech Founders to Focus on Fit and Culture

- **seo.title** [FILL]: Lisa Sacchetti, The Renaissance Network | The EdTech Mentor
- **seo.description** [FILL]: In today’s hiring landscape, finding talent is easy, but finding the right talent is a whole different story. That’s where Lisa Sacchetti comes in.
  - note: First sentence(s) of the existing intro text.
- **publishedAt** [FILL]: 2025-08-19T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Adam Stedham
`edtechMentor` | `_id`: `edtechMentor-webflow-68b1c303594ebfe2b0b32c99` | document action: **PATCH**
> title: Scalability Beats Star Power. Every Time: Adam Stedham’s EdTech M&A Strategy

- **seo.title** [FILL]: Adam Stedham, GP Strategies | The EdTech Mentor
- **seo.description** [FILL]: Adam Stedham, CEO at GP Strategies, shares lessons for EdTech leaders on The EdTech Mentor, 27zero's interview series.
  - note: Template: the intro text has no leading sentence that fits 160 characters. Enrich by hand if wanted.
- **publishedAt** [FILL]: 2025-08-29T00:00:00.000Z
  - note: Creation date in Webflow.

#### Interview: Sasha Thackaberry-Voinovich
`edtechMentor` | `_id`: `edtechMentor-webflow-68b858f21d2649b37e2b9447` | document action: **PATCH**
> title: College for $300 a Month — Sasha Thackaberry-Voinovich’s On-Demand Blueprint at Newstate University

- **seo.title** [FILL]: Sasha Thackaberry-Voinovich, Newstate University | The EdTech Mentor
- **seo.description** [FILL]: Higher ed is getting a rethink: a zero-debt, subscription-priced path built for working adults, fast to start, focused on skills, and serious about outcomes.
  - note: First sentence(s) of the existing intro text.
- **publishedAt** [FILL]: 2025-09-03T00:00:00.000Z
  - note: Creation date in Webflow.

## 13. Validation
The generator found no violations: every written value is free of em dashes, every meta title is 70 characters or fewer, and every meta description is 160 characters or fewer.