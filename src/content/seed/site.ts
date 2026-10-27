/** Settings, homepage sections, FAQs and policies seed data. */
import type { ContactSettings, Faq, Policies, Section, SiteSettings } from "@/lib/schema";
import { FUEL_CLAUSE, PHOTOS, STANDARD_KIDS_POLICY } from "./shared";

export const SEED_SITE: SiteSettings = {
  siteName: "Pack & Go Tourism",
  tagline: "Make your journey memorable",
  description:
    "Family-oriented group tours and customized trips across Pakistan — Naran, Kashmir, Hunza and Skardu — from Karachi, Hyderabad and Islamabad.",
  announcement: "",
  announcementHref: "",
  galleryCategories: ["Mountains", "Lakes", "Valleys & meadows", "Rivers", "Seasons", "Cities", "Our trips"],
  initialized: false,
};

/**
 * Contact details as found in the brochures (PDF-ALL p1 & last page), the business profile
 * screenshot and the client brief. Verification states are recorded; the admin can correct them.
 */
export const SEED_CONTACT: ContactSettings = {
  phones: [
    {
      e164: "+923107869147",
      display: "+92 310 7869147",
      label: "Phone & WhatsApp",
      office: "",
      call: true,
      whatsapp: true,
      public: true,
      verification: "unconfirmed",
      note: "Printed first on all four brochures; listed as WhatsApp on Facebook (per client). WhatsApp not independently confirmed.",
    },
    {
      e164: "+923013499147",
      display: "+92 301 3499147",
      label: "Phone",
      office: "",
      call: true,
      whatsapp: false,
      public: true,
      verification: "unconfirmed",
      note: "Printed on all four brochures; listed on Instagram as 03013499147 (per client).",
    },
  ],
  whatsappNumber: "+923107869147",
  whatsappVerification: "unconfirmed",
  whatsappGreeting: "Assalam-o-Alaikum Pack & Go!",
  emails: [
    {
      address: "packg97@gmail.com",
      label: "Email",
      public: true,
      receivesInquiries: false,
      verification: "conflicting",
      note: "Shown on the business messaging profile. A second address appears on Facebook — confirm which inbox to use.",
    },
    {
      address: "imrankhanniazi2211@gmail.com",
      label: "Email (alternate)",
      public: false,
      receivesInquiries: false,
      verification: "conflicting",
      note: "Provided by the client from the Facebook page. Hidden until the owner confirms which email to publish.",
    },
  ],
  offices: [
    {
      id: "hyderabad",
      city: "Hyderabad",
      name: "Head office — Hyderabad",
      addressLines: ["Plot No. 220, Hiqa Tower", "Near Mahmood Garden, Main Autobahn Road", "Hyderabad, Sindh, Pakistan"],
      mapsQuery: "Hiqa Tower, Autobahn Road, Hyderabad, Sindh, Pakistan",
      hours: "",
      primary: true,
      public: true,
      verification: "unconfirmed",
    },
    {
      id: "karachi",
      city: "Karachi",
      name: "Karachi office",
      addressLines: ["Office #301, Hussain Mansion", "Tayyabjee Road, Paper Market", "Karachi, Sindh, Pakistan"],
      mapsQuery: "Hussain Mansion, Tayyabjee Road, Paper Market, Karachi",
      hours: "",
      primary: false,
      public: true,
      verification: "unconfirmed",
    },
  ],
  instagramUrl: "https://www.instagram.com/pack_nd_go_tourism/",
  facebookUrl: "https://www.facebook.com/people/Pack-Go/100063973536283/",
  bankName: "Faysal Bank",
  bankAccountTitle: "PACK AND GO",
  bankAccountNumber: "3650 4990 0000 2454",
  bankIban: "",
  showBankDetails: true,
  paymentNote:
    "Only pay into the account titled PACK AND GO. Please call or WhatsApp us to confirm your booking and the amount before transferring.",
  verificationNotes: [
    "Which number is on WhatsApp has not been independently confirmed.",
    "Two email addresses exist (packg97@gmail.com and imrankhanniazi2211@gmail.com) — confirm which receives inquiries.",
    "Office addresses are as printed in the brochures; confirm spelling, map pins and opening hours.",
    "Advance-payment amount, IBAN and mobile-wallet options are not stated in the brochures.",
  ],
};

const s = (x: Partial<Section> & Pick<Section, "id" | "key" | "order">): Section => ({
  status: "published", eyebrow: "", title: "", subtitle: "", ctaLabel: "", ctaHref: "", secondaryCtaLabel: "",
  secondaryCtaHref: "", items: [], images: [], featuredIds: [], ...x,
});

export const SEED_SECTIONS: Section[] = [
  s({
    id: "hero", key: "hero", order: 1,
    eyebrow: "Pack & Go Tourism · Hyderabad & Karachi",
    title: "Ready for your next adventure?",
    subtitle: "Family-oriented group tours to Naran, Kashmir, Hunza and Skardu — departing from Karachi and Islamabad — plus customized trips anywhere in Pakistan.",
    ctaLabel: "Explore tours", ctaHref: "/tours",
    secondaryCtaLabel: "Plan a custom trip", secondaryCtaHref: "/custom-tour",
    images: [PHOTOS.meadowHorseLake, PHOTOS.snowPeaksReflection, PHOTOS.resortPagoda],
    items: [
      { title: "Offices in Hyderabad & Karachi", text: "", icon: "map-pin" },
      { title: "Breakfast & dinner included", text: "", icon: "utensils" },
      { title: "Guide on every group tour", text: "", icon: "compass" },
    ],
  }),
  s({
    id: "featured-tours", key: "featuredTours", order: 2,
    eyebrow: "Group tours", title: "Four journeys into the north",
    subtitle: "Every tour departs from Karachi by train or bus, or you can join from Islamabad.",
    ctaLabel: "See all tours", ctaHref: "/tours",
    featuredIds: ["naran-shogran-babusar-saiful-malook", "kashmir-neelum-arang-kel-ratti-gali", "kashmir-naran-valley-10-days", "naran-hunza-skardu-12-days"],
  }),
  s({
    id: "destinations", key: "destinations", order: 3,
    eyebrow: "Destinations", title: "Where we travel",
    subtitle: "From the Karakoram to the hill stations near Islamabad.",
    ctaLabel: "All destinations", ctaHref: "/destinations",
  }),
  s({
    id: "why-us", key: "whyUs", order: 4,
    eyebrow: "Why travel with us", title: "Planned so families can simply enjoy the journey",
    items: [
      { title: "Customized tours", text: "Tell us where, when and who — we plan trips anywhere in Pakistan around your group.", icon: "route" },
      { title: "Guides on every group tour", text: "Each package includes the services of a guide, plus a basic first aid kit.", icon: "compass" },
      { title: "Meals and stays included", text: "Breakfast and dinner every day and hotel accommodation on a 3/4-person sharing basis.", icon: "bed" },
      { title: "Clear, published prices", text: "Prices by departure city and transport option, with what's included and excluded spelled out.", icon: "receipt" },
    ],
  }),
  s({
    id: "custom-tour", key: "customTour", order: 5,
    eyebrow: "Customized tours", title: "Have your own plan in mind?",
    subtitle: "Honeymoons, family holidays, school or office groups — share your dates, group size and budget and we'll design the trip.",
    ctaLabel: "Plan a custom trip", ctaHref: "/custom-tour",
  }),
  s({
    id: "how-it-works", key: "howItWorks", order: 6,
    eyebrow: "How booking works", title: "Four simple steps",
    items: [
      { title: "Choose a tour", text: "Pick a package and your departure city, or send us a custom request.", icon: "map" },
      { title: "Talk to us", text: "Chat on WhatsApp or call to confirm dates, seats and the final price.", icon: "message-circle" },
      { title: "Confirm your booking", text: "Pay only into the bank account titled PACK AND GO, as confirmed by our team.", icon: "shield-check" },
      { title: "Pack & go", text: "Bring your CNIC, warm clothes and your sense of adventure.", icon: "backpack" },
    ],
  }),
  s({ id: "reviews", key: "reviews", order: 7, eyebrow: "Traveller stories", title: "What our travellers say" }),
  s({ id: "gallery", key: "gallery", order: 8, eyebrow: "Gallery", title: "Scenes from the north", ctaLabel: "Open the gallery", ctaHref: "/gallery" }),
  s({ id: "brochures", key: "brochures", order: 9, eyebrow: "Brochures", title: "Read the full brochures", subtitle: "Open any brochure right here, page by page, or download it to share with your family.", ctaLabel: "Brochure library", ctaHref: "/brochures" }),
  s({ id: "faq", key: "faq", order: 10, eyebrow: "FAQs", title: "Good to know before you go", ctaLabel: "All FAQs", ctaHref: "/faq" }),
  s({ id: "contact", key: "contact", order: 11, eyebrow: "Contact", title: "Visit, call or message us" }),
];

const f = (id: string, order: number, category: string, question: string, answer: string, showOnHome = false): Faq => ({
  id, status: "published", order, category, question, answer, showOnHome,
});

export const SEED_FAQS: Faq[] = [
  f("how-to-book", 1, "Booking", "How do I book a tour?",
    "Message us on WhatsApp or call us with the tour, your departure city, your transport option and the number of travellers. Our team will confirm dates, seats and the amount to pay. You can also send an inquiry through this website.", true),
  f("payment", 2, "Booking", "How do I pay?",
    "Payments are made by bank transfer to the account titled PACK AND GO (details on our Policies page). Always confirm the amount with our team by phone or WhatsApp before transferring."),
  f("whats-included", 3, "Tours", "What is included in the package price?",
    "Breakfast and dinner daily, luxury transport, toll taxes, the services of a guide, a basic first aid kit and hotel accommodation on a 3/4-person sharing basis.", true),
  f("whats-excluded", 4, "Tours", "What is not included?",
    "Tea, mineral water and cold drinks; heater charges; entry tickets for forts, boating and other attractions; jeep charges; vehicle use in case of road blockage or any extra expense; and anything not listed in the inclusions.", true),
  f("jeeps", 5, "Tours", "Are jeep rides included?",
    "No. Jeep rides — for example to Shogran and Siri Paye, Saif-ul-Malook Lake, Kel or Ratti Gali — are not included in the package price and are paid locally. Ask us for current estimates."),
  f("join-islamabad", 6, "Tours", "Can I join from Islamabad instead of Karachi?",
    "Yes. Every package has an Islamabad option with a shorter duration and a lower price. Select 'From Islamabad' on any tour page to see that itinerary and price.", true),
  f("kids", 7, "Families", "What is the policy for children?",
    STANDARD_KIDS_POLICY.join(". ") + "."),
  f("meals", 8, "Tours", "What food is served?",
    "Breakfast is an egg omelette, paratha, chanay and tea. Dinner rotates daily between chicken karahi, BBQ and chicken biryani, each with roti/naan (except biryani), raita, salad and a cold drink."),
  f("what-to-bring", 9, "Preparation", "What should I bring?",
    "A day bag, raincoat, sunblock, sunglasses, warm clothes and jackets, a power bank, joggers and slippers. All participants must bring their CNIC / ID card."),
  f("weather-changes", 10, "Tours", "Can the plan change?",
    "Yes. The plan or overnight stays may be adjusted because of weather, road or other conditions, in the best interest of the group. Seasonal places such as Ratti Gali Lake, Babusar Top and Khunjerab Pass depend on access on the day."),
  f("fuel", 11, "Booking", "Can the price change after booking?",
    FUEL_CLAUSE),
  f("insurance", 12, "Safety", "Are the trips insured?",
    "No. Our trips are not insured, although every care is taken for the safety of all members. We recommend that travellers arrange their own travel or health insurance."),
  f("cancellation", 13, "Booking", "What is the cancellation policy?",
    "The cancellation deductions published in our brochures are shown on the Policies page. Please confirm the exact cancellation terms with our team before you pay. No amount is refunded if a participant leaves the trip at any stage for any reason."),
  f("custom", 14, "Custom trips", "Can you plan a private or customized trip?",
    "Yes. We plan customized trips across Pakistan, including Swat, Kalam and Malam Jabba, the Kalash valleys, Murree and Islamabad. Use the custom tour form or WhatsApp us with your destinations, dates, group size and budget.", true),
  f("foreigners", 15, "Safety", "I am a foreign national — anything I should know?",
    "Please contact us before booking. Some areas, especially near the Line of Control in Azad Kashmir, may be restricted for foreign nationals, and foreigners must register with local authorities in Gilgit-Baltistan. Check your own government's travel advice and carry your passport and visa."),
];

export const SEED_POLICIES: Policies = {
  lastUpdated: "2026-10-16",
  tourTerms: [
    {
      heading: "Tour terms & conditions",
      paragraphs: ["These terms are published in every Pack & Go brochure and apply to all group tours."],
      list: [
        "Members shall not indulge in any unethical activity (misbehaviour with locals or other group members, abusive language, use of drugs, etc.) and may be removed from the tour without warning, without any refund.",
        "No illegal or prohibited items are allowed during the trip. Weapons and drugs are not allowed at all.",
        "On mountain roads the vehicle's air-conditioning will be switched on and off to keep the vehicle from overheating.",
        "The trip plan can be altered because of weather, political or any other reason deemed appropriate by us in the best interest of participants, and the organisers will not be held responsible for that.",
        "We reserve the right to cancel the trip without prior notice for any reason deemed appropriate by us; participants will then receive a full refund of the advance amount only.",
        "Every humanly possible care is taken for the safety of members. Still, every venture carries the risk of unforeseen natural disasters such as avalanches and crevasse falls, or other accidents, which cannot always be ruled out. In any such accident during the tour, the company, group leader and tour organisers will not be held responsible in any form.",
        "In case of theft, loss or damage to personal belongings during the trip, the organisers will not be held responsible.",
        "Our trips are environment-friendly; no damage to the environment will be tolerated.",
        "Our trips are not insured, though we exercise the utmost care for the safety of all members. We will not be responsible for unforeseen natural calamities such as rock or mud slides, avalanches, slipping or tripping, crevasse falls or any other accidents.",
        "No conflict or violence, verbal or physical, is allowed during the trips. Respect different cultures, religions, codes of practice, beliefs, and political and geographical affiliations. Non-compliance will be dealt with strictly.",
        FUEL_CLAUSE,
      ],
    },
  ],
  cancellation: [
    {
      heading: "Cancellation policy (as published in our brochures)",
      paragraphs: [
        "Please confirm the exact cancellation terms with our team before making a payment. The brochure lists the following deductions:",
      ],
      list: [
        "Seat cancellation: 50% deduction",
        "If informed 7 days before the trip: 75% deduction",
        "If informed 3 days before the trip: 100% deduction",
        "No amount will be refunded if any person leaves the trip at any stage for any reason.",
      ],
    },
  ],
  kids: [{ heading: "Children", paragraphs: [], list: STANDARD_KIDS_POLICY }],
  payment: [
    {
      heading: "Payment",
      paragraphs: [
        "Bookings are confirmed by our team by phone or WhatsApp. Pay only into the bank account titled PACK AND GO shown below, and only after our team has confirmed the amount with you.",
      ],
      list: [],
    },
  ],
  privacy: [
    {
      heading: "What we collect",
      paragraphs: [
        "When you send an inquiry or a review through this website, we store the details you enter — such as your name, phone or WhatsApp number, email address (optional), travel preferences and message — so that our team can respond to you.",
      ],
      list: [],
    },
    {
      heading: "How we use it",
      paragraphs: [
        "We use your details only to answer your inquiry, plan and quote your trip, and keep in touch about your booking. We do not sell your data.",
        "If you tap a WhatsApp button, WhatsApp opens with a pre-filled message; nothing is sent until you press send in WhatsApp, and WhatsApp's own privacy policy applies to that conversation.",
      ],
      list: [],
    },
    {
      heading: "Where it is stored",
      paragraphs: [
        "Inquiries are stored securely in Google Firebase (Cloud Firestore). Only authorised Pack & Go staff can read them. We keep inquiry records for up to 24 months unless you ask us to delete them sooner.",
      ],
      list: [],
    },
    {
      heading: "Your choices",
      paragraphs: [
        "You can ask us to correct or delete your details at any time by contacting us by phone, WhatsApp or email.",
        "This website uses only essential technical storage. If analytics are added in future, this policy will be updated.",
      ],
      list: [],
    },
  ],
  websiteTerms: [
    {
      heading: "Using this website",
      paragraphs: [
        "Information on this website, including prices, itineraries and availability, is provided in good faith and may change. A booking is only confirmed once our team confirms it with you directly.",
        "Prices shown are in Pakistani Rupees (PKR) as published in our brochures, and are subject to the fuel-price clause in our tour terms.",
        "Photographs are for illustration. Some images are taken from our brochures and may be replaced.",
      ],
      list: [],
    },
  ],
};
