export const customerGuides = [
  {
    slug: 'vehicle-selection',
    label: 'Vehicle & Load Planning',
    title: 'Choose a Vehicle That Fits Your Cargo',
    metaTitle: 'Vehicle and Load Planning Guide — Tanish Logistic',
    metaDescription:
      'Compare vehicle payload and volume, understand body types, and learn which cargo and route details help assess a suitable truck.',
    heroDescription:
      'A practical guide to matching cargo weight, dimensions, body type, route, and site access before booking a truck.',
    summary:
      'Choose against both payload and cargo volume, then check the body type, loading method, route, and site access.',
    overviewHeading: 'Start with the load, not the truck name',
    overview:
      'Payload is the weight a vehicle can carry; volume is the space available for the cargo. A light but bulky load can run out of space before it reaches the payload limit, while dense cargo can reach its weight limit first. Body type and the way goods are packed also affect the match.',
    steps: [
      {
        title: 'Measure the packed load',
        description:
          'Share the total cargo weight and the length, width, and height of the packed goods. Include pallets, skids, or protective packaging in those measurements.',
      },
      {
        title: 'Check weight and space together',
        description:
          'Compare both the load weight and the space it occupies. Do not choose a vehicle from tonnage alone, especially for bulky or unusually shaped cargo.',
      },
      {
        title: 'Choose a body that suits the goods',
        description:
          'Consider whether the load needs an enclosed body, an open body with a cover, or a suitable flatbed arrangement. Fragility, weather protection, and securing points matter.',
      },
      {
        title: 'Confirm route and site access',
        description:
          'Share access limits, loading equipment, road or height restrictions, and the pickup and delivery site conditions before a vehicle is confirmed.',
      },
    ],
    checklistHeading: 'Details that help with vehicle matching',
    checklist: [
      'Cargo type, total weight, number of pieces, and packed dimensions.',
      'Whether the cargo is palletized, fragile, weather-sensitive, or oversized.',
      'Loading and unloading method, equipment, and site access constraints.',
      'Pickup and delivery locations, requested date, and any route restrictions you know about.',
    ],
    note:
      'The vehicle figures below are indicative ranges published on the Services page, not a guarantee of a particular truck or payload. Actual suitability depends on the specific vehicle, cargo, route rules, load distribution, and availability. Confirm the final vehicle before booking.',
    faqs: [
      {
        question: 'Can I choose a truck using payload alone?',
        answer:
          'No. Cargo dimensions, body type, loading method, route restrictions, and site access also matter. Share the full load details so the vehicle can be assessed as a whole.',
      },
      {
        question: 'What if I do not know which vehicle type to request?',
        answer:
          'You can start with the cargo weight, packed dimensions, pickup and delivery locations, and loading details. The vehicle type can then be reviewed against the shipment requirements.',
      },
    ],
    relatedServiceSlugs: ['full-truckload-ftl', 'industrial-heavy-cargo'],
    primaryHref: '/book/',
    primaryLabel: 'Share cargo details',
    secondaryHref: '/services/',
    secondaryLabel: 'Compare freight services',
    ctaEyebrow: 'Plan the load',
    ctaTitle: 'Have your cargo details ready?',
    ctaDescription:
      'Use the shipment form to share weight, dimensions, route, and handling requirements for a vehicle review.',
  },
  {
    slug: 'online-booking',
    label: 'Online Booking Steps',
    title: 'How to Submit a Freight Booking Request',
    metaTitle: 'How to Book Freight Online — Tanish Logistic',
    metaDescription:
      'See what the freight booking form asks for, what to prepare, and what happens after you submit a request to the dispatch team.',
    heroDescription:
      'Know what information to prepare before you start the four-step online freight request form.',
    summary:
      'Add cargo details, route and date, company contacts, then review the request before sending it to dispatch.',
    overviewHeading: 'Four steps from cargo details to request',
    overview:
      'The online form collects the information the operations team needs to review a shipment. You can prepare the details first, complete the form, and check your entries before submitting.',
    steps: [
      {
        title: 'Describe the cargo',
        description:
          'Enter the cargo type and approximate weight. Add dimensions, packaging, and handling notes when you have them; these help assess vehicle fit.',
      },
      {
        title: 'Add the route and timing',
        description:
          'Provide pickup and delivery locations and addresses, your preferred dispatch date, the service category, and any timing or site instructions.',
      },
      {
        title: 'Add company and contact details',
        description:
          'Provide the company name, contact person, phone number, and email address so the team knows who to contact about the request.',
      },
      {
        title: 'Review and submit',
        description:
          'Check the cargo, route, schedule, service, and contact details, then submit the request and save the booking reference shown afterward.',
      },
    ],
    checklistHeading: 'Before you open the booking form',
    checklist: [
      'Cargo type and approximate weight; packed dimensions if available.',
      'Full pickup and delivery locations, addresses, and site contacts.',
      'Preferred dispatch date, service category, and any receiving-window constraints.',
      'Company name and the contact person’s phone number and email address.',
    ],
    note:
      'Submitting the online form records a request. It does not by itself confirm vehicle availability, a final price, or a delivery time. Wait for the dispatch team to confirm the plan and terms for your shipment.',
    faqs: [
      {
        question: 'Do I need exact cargo dimensions to start?',
        answer:
          'The form accepts cargo type and weight as the required starting details. Add accurate dimensions and packaging information when possible, especially for bulky, fragile, or heavy loads.',
      },
      {
        question: 'Is the booking reference a confirmation that a truck is reserved?',
        answer:
          'No. The reference identifies your submitted request. Vehicle availability, price, and schedule still need to be reviewed and confirmed by the dispatch team.',
      },
    ],
    relatedServiceSlugs: ['b2b-cargo-movement', 'full-truckload-ftl'],
    primaryHref: '/book/',
    primaryLabel: 'Open the booking form',
    secondaryHref: '/services/',
    secondaryLabel: 'Review freight services',
    ctaEyebrow: 'Ready to send a request?',
    ctaTitle: 'Start with the shipment details you have.',
    ctaDescription:
      'You can include the route, cargo, timing, and contact information in the online form, then review everything before submitting.',
  },
  {
    slug: 'shipment-updates',
    label: 'Shipment Updates & POD',
    title: 'Shipment Updates and Proof of Delivery',
    metaTitle: 'Shipment Updates and Proof of Delivery — Tanish Logistic',
    metaDescription:
      'Learn how to use your booking reference to request shipment updates and what proof of delivery means after a freight movement.',
    heroDescription:
      'Understand how to follow up on a submitted shipment request and what delivery confirmation means.',
    summary:
      'Keep your booking reference and contact the dispatch desk for available updates; confirm delivery documentation for your booking.',
    overviewHeading: 'Use the booking reference when you follow up',
    overview:
      'After you submit a request, keep the booking reference shown on the confirmation page. Quote it when contacting dispatch by phone or email so the team can identify the shipment and discuss the latest available update.',
    steps: [
      {
        title: 'Save the reference',
        description:
          'Keep the booking reference from the confirmation page. If the reference is missing, contact dispatch with the company name and pickup and delivery details so the request can be located.',
      },
      {
        title: 'Ask dispatch for an update',
        description:
          'Use the contact details on the site and quote the reference. Ask for the current shipment stage and the next expected update; the information available depends on the movement and its status.',
      },
      {
        title: 'Confirm delivery documentation',
        description:
          'Proof of Delivery (POD) is evidence that the shipment reached the receiving point. Ask what POD format and delivery confirmation are included in the agreed service.',
      },
    ],
    checklistHeading: 'Keep these details handy',
    checklist: [
      'Your booking reference and the company name used for the request.',
      'Pickup and delivery locations and the requested dispatch date.',
      'A contact number or email address the dispatch team can use to respond.',
      'Any POD or delivery-document requirements agreed for the shipment.',
    ],
    note:
      'This is a guide to reference-based updates, not a live tracking portal. The public website does not show a self-service GPS map. Contact dispatch to ask what shipment information is available for your booking.',
    faqs: [
      {
        question: 'Can I see my truck on a live map on this website?',
        answer:
          'The public website does not provide a self-service live tracking map. Use your booking reference to contact dispatch for the latest update available for your shipment.',
      },
      {
        question: 'What does POD mean?',
        answer:
          'POD means Proof of Delivery. It records that goods were delivered to the receiving point; confirm the format and availability for your shipment with the operations team.',
      },
    ],
    relatedServiceSlugs: ['interstate-road-freight', 'express-highway-transit'],
    primaryHref: '/contact/',
    primaryLabel: 'Contact dispatch',
    secondaryHref: '/book/',
    secondaryLabel: 'Submit a new request',
    ctaEyebrow: 'Need an update?',
    ctaTitle: 'Have your booking reference ready.',
    ctaDescription:
      'Contact the dispatch team with the reference so they can identify your shipment and share the latest information available.',
  },
];

export function getCustomerGuideBySlug(slug) {
  return customerGuides.find((guide) => guide.slug === slug) || null;
}
