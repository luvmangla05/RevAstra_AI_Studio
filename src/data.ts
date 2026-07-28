/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WisdomQuote, PackageConfig } from './types';

export const WISDOM_QUOTES: WisdomQuote[] = [
  {
    id: '1',
    text: "More leads cannot repair a broken follow-up process.",
    author: "RevAstra Growth Maxim",
    category: "Process"
  },
  {
    id: '2',
    text: "What is not tracked eventually gets ignored.",
    author: "RevOps Advisory",
    category: "Process"
  },
  {
    id: '3',
    text: "Attention without order leads to wasted budgets.",
    author: "RevAstra Growth Principle",
    category: "Strategy"
  },
  {
    id: '4',
    text: "Order without attention leads to business stagnation.",
    author: "RevAstra Growth Principle",
    category: "Strategy"
  },
  {
    id: '5',
    text: "In growth, speed is not a feature; it is the foundation.",
    author: "RevAstra Growth Maxim",
    category: "Growth"
  },
  {
    id: '6',
    text: "A five-minute delay in follow-up is not a delay; it is a lost opportunity.",
    author: "Modern Response Maxim",
    category: "Execution"
  },
  {
    id: '7',
    text: "Creativity that does not drive conversion is merely art.",
    author: "RevAstra Creative Axiom",
    category: "Execution"
  },
  {
    id: '8',
    text: "Automation should support your team, not complicate their work.",
    author: "System Automation Rule",
    category: "Process"
  },
  {
    id: '9',
    text: "If your pipeline is invisible, your future revenue is unpredictable.",
    author: "RevOps Strategy Maxim",
    category: "Strategy"
  },
  {
    id: '10',
    text: "System integration is the bridge that connects attention to conversion.",
    author: "RevOps Integration Guide",
    category: "Process"
  },
  {
    id: '11',
    text: "A business that relies on manual spreadsheets is running on borrowed time.",
    author: "RevOps Advisory",
    category: "Process"
  },
  {
    id: '12',
    text: "The best marketing strategy is a consistent operational system.",
    author: "RevAstra Strategy Axiom",
    category: "Strategy"
  },
  {
    id: '13',
    text: "Speak to your industry's specific pain points, not to the general market.",
    author: "Niche Marketing Rule",
    category: "Strategy"
  },
  {
    id: '14',
    text: "A qualified enquiry is worth ten casual clicks.",
    author: "Conversion Rule",
    category: "Growth"
  },
  {
    id: '15',
    text: "Do not let technology become a barrier between your business and your customer.",
    author: "RevAstra Core Philosophy",
    category: "Wisdom"
  },
  {
    id: '16',
    text: "The wise business owner automates the routine to focus on the relationships.",
    author: "Chanakya-inspired Strategy",
    category: "Wisdom"
  },
  {
    id: '17',
    text: "In the digital space, clarity always beats cleverness.",
    author: "RevAstra Design Axiom",
    category: "Wisdom"
  },
  {
    id: '18',
    text: "Consistency in follow-up builds trust before the first conversation.",
    author: "RevOps Execution Mantra",
    category: "Execution"
  },
  {
    id: '19',
    text: "Your ad spend is an investment; treat your follow-up with the same respect.",
    author: "Growth Marketing Formula",
    category: "Growth"
  },
  {
    id: '20',
    text: "A smooth customer journey is the quietest way to build a premium brand.",
    author: "RevAstra Brand Axiom",
    category: "Growth"
  },
  {
    id: '21',
    text: "Measure the metrics that matter, not the numbers that soothe your ego.",
    author: "RevOps Metrics Rule",
    category: "Process"
  },
  {
    id: '22',
    text: "Technology is the lever, but human connection is the fulcrum.",
    author: "RevAstra Core Philosophy",
    category: "Wisdom"
  },
  {
    id: '23',
    text: "The strength of a system lies in how it handles the details.",
    author: "Arthashastra Wisdom",
    category: "Process"
  },
  {
    id: '24',
    text: "A leaking pipeline is a silent thief of your growth.",
    author: "RevOps Diagnostic Maxim",
    category: "Growth"
  },
  {
    id: '25',
    text: "Simple workflows executed consistently always beat complex plans left on a shelf.",
    author: "RevOps Strategy Maxim",
    category: "Wisdom"
  },
  {
    id: '26',
    text: "Your business dashboard should tell a story, not just present a grid of numbers.",
    author: "Reporting Rule",
    category: "Process"
  },
  {
    id: '27',
    text: "The purpose of marketing is to start a conversation, not just accumulate views.",
    author: "RevAstra Creative Axiom",
    category: "Strategy"
  },
  {
    id: '28',
    text: "Speed of response is the ultimate competitive advantage in a crowded market.",
    author: "Modern Lead Capture Maxim",
    category: "Execution"
  },
  {
    id: '29',
    text: "Structure your systems so that your team is positioned to win.",
    author: "Arthashastra-inspired Management",
    category: "Strategy"
  },
  {
    id: '30',
    text: "The most expensive lead is the one that is never contacted.",
    author: "RevOps Leaky Pipeline Rule",
    category: "Growth"
  },
  {
    id: '31',
    text: "True efficiency is doing the right things, not just doing things faster.",
    author: "RevOps Execution Axiom",
    category: "Wisdom"
  },
  {
    id: '32',
    text: "Align your creative production with your sales process for a seamless experience.",
    author: "RevAstra Integration Guide",
    category: "Process"
  },
  {
    id: '33',
    text: "Trust is built in the seconds after an enquiry is made.",
    author: "Modern Lead Capture Maxim",
    category: "Execution"
  },
  {
    id: '34',
    text: "A business that grows without systems is building on a foundation of sand.",
    author: "RevOps Strategy Axiom",
    category: "Growth"
  },
  {
    id: '35',
    text: "Let automation handle the speed, so your team can handle the depth.",
    author: "RevAstra Automation Axiom",
    category: "Wisdom"
  },
  {
    id: '36',
    text: "The purpose of AI is not to appear intelligent; it is to make the business operate intelligently.",
    author: "RevAstra AI Philosophy",
    category: "Wisdom"
  }
];

export const PUBLIC_PACKAGES: PackageConfig[] = [
  {
    id: 'saarthi',
    name: 'Saarthi — Growth Foundation',
    subheadline: 'Best for: Small/growing teams without a structured follow-up process',
    tagline: 'Ideal for businesses relying on WhatsApp and spreadsheets who need better content, custom lead capture, and instant first-response triggers.',
    features: [
      'Strategic growth audit and leak diagnosis',
      'Core creative assets: Cinematic photos & edited reels',
      'High-converting landing page or native lead form',
      'Instant lead capture webhook setup',
      'Basic CRM pipeline (Kanban board deal visibility)',
      'First-response workflow and automated welcome delivery',
      'Sequential follow-up triggers (WhatsApp and email templates)',
      'Monthly performance report and conversion recommendations'
    ],
    pricingNote: 'Prices starting from ₹45,000 / $600 USD. Billed based on project scope.',
    startingPriceLabel: 'Starting from ₹45,000 / month'
  },
  {
    id: 'arjuna',
    name: 'Arjuna — Growth Accelerator',
    subheadline: 'Best for: Active advertisers, builders, and real-estate agencies',
    tagline: 'For fast-growing companies requiring ongoing ad campaigns, multi-channel lead generation, and automated pipeline synchronization.',
    features: [
      'Comprehensive campaign strategy and placement setup',
      'Monthly creative-production shoots: Property showcases, clips, and reels',
      'Customized multi-step qualifying landing pages',
      'Automated lead-source tracking and conversion attribution',
      'Sales pipeline automation & automatic round-robin agent assignment',
      'Integrated active phone number & WhatsApp syntax verification',
      'Automatic 3-tier follow-up sequences (SMS, WhatsApp, Email)',
      'Automated viewing booking links and calendar integrations',
      'Live dynamic reporting dashboard (Verified buyers tracking)'
    ],
    pricingNote: 'Pricing structures starting from ₹1,20,000 / $1,500 USD per month. Excludes active ad-spend budgets.',
    startingPriceLabel: 'Starting from ₹1,20,000 / month',
    isPopular: true
  },
  {
    id: 'astra',
    name: 'Astra — AI Growth Operating System',
    subheadline: 'Best for: High volumes, multiple locations, and advanced integrations',
    tagline: 'The ultimate system for enterprises looking to substitute manual qualification with state-of-the-art AI Agents and WhatsApp bots.',
    features: [
      'Live Chanakya AI website conversational representative setup',
      'Conversational AI qualification (leverage intent, budget, and locations)',
      'Multi-channel lead capture (Socials, Web, WhatsApp, offline QR codes)',
      'WhatsApp Business API integration with natural-language qualifying bot',
      'Autonomous scheduling of site visits, site tours, or appointments',
      'Automated reactivation campaigns for cold database records',
      'Custom webhook sync with Salesforce, HubSpot, or proprietary CRMs',
      'Database tracking of client-agent chat transcripts with AI summaries',
      'Live management and team operational dashboards',
      'Priority ongoing optimization and technical support'
    ],
    pricingNote: 'Tailored scopes starting from ₹2,50,000 / $3,000 USD. Setup cost varies with CRM complexity.',
    startingPriceLabel: 'Custom Scope / Setup'
  },
  {
    id: 'brahmastra',
    name: 'Brahmastra — Enterprise System',
    subheadline: 'Best for: Relational developers, hospitals, and multi-franchise dealers',
    tagline: 'Enterprise-grade multi-department and multi-location workflows, custom security permissions, and dedicated strategic consultations.',
    features: [
      'Multi-location pipeline architecture and complex lead routing mapping',
      'Enterprise-grade multi-agent setup (different intents, departments, or files)',
      'Custom database security rules, role permissions, and access controls',
      'Full brand creative coverage (Commercial brand films + monthly shoots)',
      'Bespoke AI model training on internal files, catalogs, and guidelines',
      'Bi-directional sync of offline visits/reservations with online campaigns',
      'Dedicated RevOps consultant and bi-weekly strategic review sessions',
      'SLA-guaranteed priority technical support and enterprise onboarding'
    ],
    pricingNote: 'Pricing fully bespoke. Subject to formal business audit and scope analysis.',
    startingPriceLabel: 'Bespoke / Enterprise Setup'
  }
];

export const CREATIVE_PACKAGES = [
  {
    id: 'shilp',
    name: 'Shilp — Creative Foundation',
    bestFor: 'Focused shoots, product content, and introductory campaigns',
    features: [
      '1 Professional walk-through shoot and interior photography session',
      '2 Custom vertical reels/promotional short films (professionally edited & color graded)',
      'Standard post-production editing, custom graphics, and copywriting templates'
    ],
    pricing: 'Starting at ₹25,000 / $350 USD'
  },
  {
    id: 'tejas',
    name: 'Tejas — Creative Growth',
    bestFor: 'Businesses requiring consistent reels, videos, and campaign-ready content',
    features: [
      'Ongoing monthly creative shoots (photos and video assets)',
      '6 Premium vertical films designed for performance ad-creative distribution',
      'Advanced post-production, customized animated transitions, and hooks'
    ],
    pricing: 'Starting at ₹65,000 / $900 USD'
  },
  {
    id: 'pushpak',
    name: 'Pushpak — Premium Campaign Production',
    bestFor: 'Project launches, property films, hotel campaigns, and automotive productions',
    features: [
      'Cinematic Commercial Walkthrough Film (30s and 60s cutouts for Meta/YouTube ads)',
      'Full drone aerial videography (perfect for developer sites, land plots, hotels)',
      '12 Short videos plus premium ad layouts with dedicated post-production',
      'Commercial-grade color grading, sound engineering, voiceovers, and licensing'
    ],
    pricing: 'Custom Quote / Starts ₹1,50,000'
  }
];

export const INDUSTRIES = [
  {
    id: 'builders',
    name: 'Builders & Property Developers',
    headline: 'Sell Real Estate Projects Faster with Modern Pipelines.',
    tagline: 'Turn digital enquiries into confirmed site-visits. Automate brochure distribution, agent assignment, and follow-ups.',
    icon: 'Building2',
    workflow: [
      { step: 'Create Attention', desc: 'Premium drone shoots, walk-through videos, and interactive maps of the builder site.' },
      { step: 'Promote Project', desc: 'Meta & Google ad campaigns highlighting unique layouts, pricing brackets, and locality advantages.' },
      { step: 'Capture Buyer', desc: 'Dynamic lead capture asking about configuration interest (e.g., 2 BHK, 3 BHK, Penthouse).' },
      { step: 'Qualify & Match', desc: 'Automated agent qualifies buyer budget, verifies phone number, and shares digital brochure on WhatsApp.' },
      { step: 'Book Site Visit', desc: 'Schedules site tour automatically and forwards qualified lead with transcript directly to site executive.' }
    ],
    faqs: [
      { q: "How does the WhatsApp brochure delivery work?", a: "When a potential buyer submits a request, our automated system instantly triggers a personalized message containing the high-resolution PDF brochure directly to their WhatsApp. This achieves an average open rate of over 90% in under 3 minutes." },
      { q: "Can we route leads to multiple project sales teams?", a: "Yes. The system utilizes customizable round-robin or geography-based lead routing. For example, leads interested in 2 BHK projects are sent to Team A, while luxury penthouse enquiries route to Team B." }
    ]
  },
  {
    id: 'real-estate',
    name: 'Real-Estate Agencies & Brokers',
    headline: 'Dominate Your Local Property Market.',
    tagline: 'Empower agents with pre-qualified property matchings, calendar viewer bookings, and listing walkthrough reels.',
    icon: 'HomeIcon',
    workflow: [
      { step: 'Listing Reels', desc: 'Elegant walkthrough walkthroughs focusing on interior features, neighborhood and light.' },
      { step: 'Target Campaigns', desc: 'Geo-targeted localized campaigns in premium postal codes looking for buyers/tenants.' },
      { step: 'Agent Routing', desc: 'Leads are qualified by price tier and immediately routed via WhatsApp to the dedicated listing agent.' },
      { step: 'Automated viewing', desc: 'Prospective buyers can pick a tour time directly from the agent\'s live calendar link.' }
    ],
    faqs: [
      { q: "Does this sync with property portals?", a: "Absolutely. We capture leads from digital ad campaigns, social media, landing pages, and can bridge them with traditional portals into a single central CRM panel." }
    ]
  },
  {
    id: 'hotels',
    name: 'Hotels & Hospitality',
    headline: 'Increase Direct Bookings and Reduce OTAs.',
    tagline: 'Capture guest booking enquiries, qualify dates and party size, and automate direct confirmation messages.',
    icon: 'Hotel',
    workflow: [
      { step: 'Cinematic Hospitality', desc: 'Breathtaking property films, room reels, and culinary short clips.' },
      { step: 'Direct Promos', desc: 'Special offers targeted directly to vacation-planning demographics and weekend travelers.' },
      { step: 'Guest Qualifier', desc: 'Instant WhatsApp bot collects arrival dates, guest counts, room preferences, and dietary needs.' },
      { step: 'Direct Handoff', desc: 'Forwards qualified package details to hotel reception desk or reservation system to close direct bookings.' }
    ],
    faqs: [
      { q: "Can we integrate this with booking engines?", a: "Yes, we connect with PMS and standard booking engines via custom webhooks, directing high-value guest enquiries to direct channels to bypass OTA commissions." }
    ]
  },
  {
    id: 'clinics',
    name: 'Clinics & Specialized Healthcare',
    headline: 'Fill Your Calendar with High-Value Consultations.',
    tagline: 'Grow patient trust with educational physician reels, clinical walk-throughs, and simple automated booking.',
    icon: 'HeartPulse',
    workflow: [
      { step: 'Educate & Trust', desc: 'Educational doctor reels answering frequently asked medical questions and explaining treatments.' },
      { step: 'Treatment Ads', desc: 'Campaigns targeting individuals looking for specialized treatments (e.g., dental, ortho, derma).' },
      { step: 'Service Selector', desc: 'Simple interface guides patients to select their desired treatment and clinician type.' },
      { step: 'Instant Reminder', desc: 'Automates patient reminders 24h and 2h before the appointment, reducing no-shows by up to 60%.' }
    ],
    faqs: [
      { q: "Do you provide medical diagnoses?", a: "No, under no circumstances does Chanakya AI or any automated agent provide medical advice. All medical qualification is limited strictly to scheduling, treatment interest, and administrative booking." }
    ]
  },
  {
    id: 'gyms',
    name: 'Gyms & Fitness Studios',
    headline: 'Drive Consistent Trial Bookings & Memberships.',
    tagline: 'Turn video views of high-energy training into actual fitness studio trial visits and repeat membership signups.',
    icon: 'Dumbbell',
    workflow: [
      { step: 'Energy Reels', desc: 'Cinematic training reels showing studio culture, expert trainers, and active transformations.' },
      { step: 'Trial Campaigns', desc: 'Local community ad campaigns with enticing 3-day trial trial passes.' },
      { step: 'Goal Capture', desc: 'Qualifies prospective members on fitness goals (e.g., weight loss, strength) and schedules trial session.' },
      { step: 'Member Follow-up', desc: 'Automated follow-ups after the first trial day to lock in discounted monthly/yearly packages.' }
    ],
    faqs: [
      { q: "How do you handle trial attendance reminders?", a: "The system automatically sends a personalized text reminder a few hours before the scheduled class with instructions on what to wear and where to park, ensuring high attendance." }
    ]
  },
  {
    id: 'automotive',
    name: 'Automotive Dealerships & Brands',
    headline: 'Boost High-Intent Test-Drive Bookings.',
    tagline: 'Deliver premium vehicular showcase content, qualify vehicle models, and route buyers to regional dealerships.',
    icon: 'Car',
    workflow: [
      { step: 'Vehicular Showcase', desc: 'Breathtaking walkarounds, exhaust note reels, and detailed safety/comfort showcases.' },
      { step: 'Model Campaigns', desc: 'Highly targeted local campaigns focused on direct model interest and trade-in valuations.' },
      { step: 'Model Qualifier', desc: 'AI queries prospective buyers on configuration preferences, transmission type, and trade-in status.' },
      { step: 'Dealer Handoff', desc: 'Qualified buyer matches are routed directly to the appropriate dealership sales consultant with CRM details.' }
    ],
    faqs: [
      { q: "Can this estimate trade-in valuations?", a: "Yes, we can design simple questionnaire steps that capture the make, model, year, and condition of their current vehicle to provide estimated trade-in brackets, boosting high-intent conversions." }
    ]
  }
];

export const PORTFOLIO_ITEMS = [
  {
    id: 'p1',
    title: '[Demo System] Premium Real Estate Digital Funnel',
    client: 'Process Architecture Demo',
    category: 'builders',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    description: 'Demonstration of cinematic walkthrough production linked with Meta campaigns and WhatsApp automated qualifiers. Built to show site-visit lead flow routing.',
    services: ['Drone Production', 'Meta Campaigns', 'WhatsApp Bot']
  },
  {
    id: 'p2',
    title: '[Demo System] Local Agency Broker Pipeline',
    client: 'Sales Operations Demo',
    category: 'real-estate',
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
    description: 'A mock showcase of neighborhood lifestyle walkthrough reels linked with localized lead-capture maps and automated round-robin agent assignment.',
    services: ['Listing Reels', 'Local Lead Capture', 'Auto CRM Routing']
  },
  {
    id: 'p3',
    title: '[Demo System] Direct OTA Bypass Reservation Engine',
    client: 'Hospitality Conversion Demo',
    category: 'hotels',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    description: 'Simulated direct-booking flow featuring a guest room showcase film paired with a WhatsApp chatbot to collect guest count and preferences.',
    services: ['Commercial Film', 'Direct Booking Bot', 'OTA Bypass Strategy']
  },
  {
    id: 'p4',
    title: '[Demo System] Clinical Specialized Funnel',
    client: 'Healthcare Operations Demo',
    category: 'clinics',
    imageUrl: 'https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&w=800&q=80',
    description: 'Sample setup of physician explanation video assets, localized advertising, and automated calendar-link reminders to prevent consultation no-shows.',
    services: ['Doctor Reels', 'Lead Qualifier', 'No-show Prevention']
  },
  {
    id: 'p5',
    title: '[Demo System] Fitness Trial Booking Flow',
    client: 'Local Studio Demo',
    category: 'gyms',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    description: 'Demonstration of high-energy reels, local community promotions, and automated SMS reminders to increase trial class attendance rates.',
    services: ['Creative Shoots', 'Ad Campaigns', 'Membership Reactivation']
  },
  {
    id: 'p6',
    title: '[Demo System] Automotive Showcase Routing',
    client: 'Automotive Dealership Demo',
    category: 'automotive',
    imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
    description: 'Mock showcase of detailed vehicular walkthroughs, custom specification builders, and automated regional dealership routing.',
    services: ['Vehicle Showcases', 'Target Ads', 'Dealership Routing']
  }
];

export const FAQS = [
  {
    q: "Who is RevAstra AI designed for?",
    a: "We build specific systems for businesses where every incoming enquiry represents high potential revenue (Builders, Real-estate brokers, Hotels, Clinics, Gyms, and Automotive dealerships). We do not build generic templates, but rather custom, modular Growth Systems of creative production, digital promotions, and conversion automation."
  },
  {
    q: "What does 'Create attention. Capture demand. Automate conversion' mean?",
    a: "It is our three-fold framework: 1. Creative production (photos/videos) that grabs attention in crowded feeds. 2. Performance ads (Meta/Google) that locate target buyers. 3. AI bots and pipeline automation that respond immediately to qualified leads, scheduling appointments before they cool off."
  },
  {
    q: "Does Chanakya replace my sales team?",
    a: "Absolutely not. Chanakya is a live assistant. Its job is to handle the tedious initial tasks: answering standard questions, validating email/phone numbers, matching listings, and scheduling. It qualifies and warm-hands high-value leads with full chat transcripts directly to your human sales reps, so they focus entirely on closing."
  },
  {
    q: "Is there a long-term commitment required for packages?",
    a: "Saarthi can be booked as a one-time setup project. Arjuna and Astra packages generally operate on standard 3, 6, or 12-month retainers to allow continuously optimized ad spend, creative refreshes, and AI learning curves."
  },
  {
    q: "How does the pricing work for custom enterprise systems?",
    a: "For large property developers, multi-franchise dealers, and hospitality chains, we conduct a comprehensive operational audit. Pricing is based entirely on the complexity of your custom integrations, required custom features, and quantity of creative production assets needed. Fill out the Growth System Builder for a starting estimation."
  },
  {
    q: "Are the client and admin dashboards actual production systems?",
    a: "Yes. The RevAstra system includes functional dashboards that connect directly with our database. As clients, you can track current project progress, view ad campaigns, and check incoming leads. As administrators, you have full controls to view leads, consult transcripts, adjust configurations, and modify quotes."
  }
];
