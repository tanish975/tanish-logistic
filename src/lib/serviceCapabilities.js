export const serviceCapabilities = [
  {
    slug: 'full-truckload-ftl',
    label: 'Full Truckload (FTL)',
    title: 'Full Truckload (FTL)',
    metaTitle: 'Full Truckload (FTL) Freight — Tanish Logistic',
    metaDescription:
      'Learn what Full Truckload (FTL) means, when a dedicated truck may suit your shipment, and what cargo, route and timing details to share for a quote.',
    cardSummary: 'A truck is reserved for one customer’s shipment from pickup to delivery.',
    heroDescription:
      'Understand when booking a dedicated vehicle can make sense for a business shipment.',
    plainMeaning:
      'With Full Truckload (FTL), a vehicle is booked for one customer’s shipment rather than combining that load with unrelated customers’ freight. “Full” describes the dedicated booking; it does not mean every part of the vehicle must be filled.',
    goodFit: [
      'The load is large enough to justify a dedicated vehicle, or a dedicated vehicle is important for the shipment.',
      'The shipment has one main pickup and delivery point.',
      'Fewer transfers between vehicles are preferred for the cargo or delivery plan.',
    ],
    prepare: [
      'Pickup and delivery locations, site contacts, and preferred timings.',
      'Cargo description, total weight, dimensions, and number of pallets or pieces.',
      'Loading and unloading method, site access limits, and any handling instructions.',
      'The requested pickup date and delivery window.',
    ],
    planningNote:
      'A dedicated vehicle does not automatically mean a faster or lower-cost journey. The route, vehicle, cargo, access conditions, and timing all affect the quote and delivery estimate.',
    faqs: [
      {
        question: 'Do I have to fill the entire truck to book FTL?',
        answer:
          'No. FTL means the vehicle is reserved for your shipment. Whether that is the best-value option depends on your load and route; ask us to compare suitable options.',
      },
      {
        question: 'Does FTL guarantee a particular delivery time?',
        answer:
          'No. The delivery estimate depends on the route, distance, pickup readiness, road conditions, and other operational factors. Confirm the expected transit plan before booking.',
      },
    ],
    relatedSlugs: ['interstate-road-freight', 'industrial-heavy-cargo'],
  },
  {
    slug: 'b2b-cargo-movement',
    label: 'B2B Cargo Movement',
    title: 'B2B Cargo Movement',
    metaTitle: 'B2B Cargo Movement for Businesses — Tanish Logistic',
    metaDescription:
      'See what B2B cargo movement covers, which business shipments it can suit, and what pickup, delivery, cargo and document details to prepare.',
    cardSummary: 'Commercial goods moving between suppliers, factories, warehouses, and business customers.',
    heroDescription:
      'A straightforward guide to moving commercial goods between business locations.',
    plainMeaning:
      'B2B means business-to-business. B2B cargo movement is the road transport of goods from one business location to another, such as a supplier to a factory or a warehouse to a distributor. It describes the shipment’s business purpose, not one specific truck type; the vehicle and booking arrangement depend on the load.',
    goodFit: [
      'A business needs to move stock, materials, equipment, or finished goods between sites.',
      'A supplier, manufacturer, warehouse, distributor, or project team needs pickup and delivery coordination.',
      'A one-off movement or a recurring lane needs to be assessed for an appropriate road-freight plan.',
    ],
    prepare: [
      'Pickup and delivery addresses, receiving hours, and contact names at both sites.',
      'A clear description of the goods, their weight and dimensions, and how they are packed.',
      'Loading and unloading requirements, including any equipment or site restrictions.',
      'Commercial invoices and shipment documents that apply to the goods and route.',
    ],
    planningNote:
      'B2B cargo can use different vehicle and booking options. Share the shipment details first so the appropriate arrangement can be discussed; a business shipment is not automatically an FTL load.',
    faqs: [
      {
        question: 'Is B2B cargo movement a particular kind of truck?',
        answer:
          'No. B2B describes a business-to-business shipment. The vehicle and service arrangement are selected separately based on the cargo, route, timing, and agreed requirements.',
      },
      {
        question: 'Can I ask about regular business deliveries?',
        answer:
          'Yes. Share the lanes, typical shipment size, and dispatch frequency. Recurring movements can be reviewed for a suitable operating arrangement.',
      },
    ],
    relatedSlugs: ['full-truckload-ftl', 'dedicated-contract-fleet'],
  },
  {
    slug: 'interstate-road-freight',
    label: 'Interstate Road Freight',
    title: 'Interstate Road Freight',
    metaTitle: 'Interstate Road Freight in India — Tanish Logistic',
    metaDescription:
      'Learn how interstate road freight works, what to plan across state borders, and which cargo, delivery and applicable document details to confirm.',
    cardSummary: 'Commercial goods travelling by road between locations in different Indian states.',
    heroDescription:
      'Plan a road shipment that crosses state borders with the route, timing, and paperwork in view.',
    plainMeaning:
      'Interstate road freight is cargo transported by road from one Indian state to another. A workable plan considers the origin and destination, route, vehicle, delivery window, and the shipment documents required for that cargo and movement.',
    goodFit: [
      'Goods need to move between a supplier, plant, warehouse, distributor, or customer in different states.',
      'The shipment needs a direct road-freight plan with an agreed pickup and delivery window.',
      'The sender wants to confirm route, vehicle suitability, and documentation before dispatch.',
    ],
    prepare: [
      'Pickup and delivery PIN codes, full addresses, and site operating hours.',
      'Cargo description, weight, dimensions, packaging, and any handling needs.',
      'The requested pickup date, delivery window, and contact details at both ends.',
      'Applicable invoices, permits, or e-way bill details; confirm document requirements with your accounts or tax team.',
    ],
    planningNote:
      'Documentation requirements depend on the goods and movement. The shipper should confirm the applicable tax and transport documents before dispatch; responsibilities should be agreed as part of the booking.',
    faqs: [
      {
        question: 'What documents should be ready for an interstate shipment?',
        answer:
          'Requirements depend on the cargo and current rules. The shipper should confirm applicable invoices, e-way bill information, and other documents with its accounts or tax team before dispatch.',
      },
      {
        question: 'Can I get a confirmed arrival time?',
        answer:
          'You can request an estimated transit plan for the route. Any firm delivery commitment and its conditions should be confirmed with the operations team before the load is booked.',
      },
    ],
    relatedSlugs: ['full-truckload-ftl', 'express-highway-transit'],
  },
  {
    slug: 'dedicated-contract-fleet',
    label: 'Dedicated Contract Fleet',
    title: 'Dedicated Contract Fleet',
    metaTitle: 'Dedicated Contract Fleet Transport — Tanish Logistic',
    metaDescription:
      'Understand dedicated contract fleet arrangements, when recurring lane capacity may help, and what volumes, schedules and service terms to discuss.',
    cardSummary: 'A planned transport arrangement for businesses with recurring freight lanes or dispatch needs.',
    heroDescription:
      'Explore a contract-based approach for businesses that move freight on a recurring schedule.',
    plainMeaning:
      'A dedicated contract fleet is an ongoing transport arrangement built around a business’s recurring routes and shipment needs. The parties agree the lanes, expected volumes, vehicle requirements, operating schedule, reporting, and commercial terms instead of treating every movement as an unrelated request.',
    goodFit: [
      'Your business moves goods repeatedly between the same plants, warehouses, suppliers, or distribution points.',
      'You can describe typical weekly or monthly volumes and dispatch patterns.',
      'Your logistics team needs agreed operating processes, contacts, and service expectations.',
    ],
    prepare: [
      'Regular pickup and delivery lanes, including any seasonal route changes.',
      'Typical shipment weight, dimensions, vehicle needs, and trips per week or month.',
      'Dispatch schedules, receiving windows, and expected volume peaks or changes.',
      'Required reports, escalation contacts, contract duration, and service measures.',
    ],
    planningNote:
      '“Dedicated” does not automatically mean a vehicle is exclusively assigned to one customer. Capacity, vehicle assignment, availability, rates, and service levels must be defined in the written agreement.',
    faqs: [
      {
        question: 'Does a contract fleet always mean exclusive vehicles?',
        answer:
          'Not automatically. Any reserved or exclusive vehicle commitment should be written into the agreed contract, along with its routes, availability, and operating terms.',
      },
      {
        question: 'What information helps assess a contract fleet?',
        answer:
          'Start with your regular lanes, shipment sizes, dispatch frequency, delivery windows, and expected changes in volume. These details help both sides assess whether a recurring arrangement fits.',
      },
    ],
    relatedSlugs: ['b2b-cargo-movement', 'full-truckload-ftl'],
  },
  {
    slug: 'industrial-heavy-cargo',
    label: 'Industrial & Heavy Cargo',
    title: 'Industrial & Heavy Cargo',
    metaTitle: 'Industrial and Heavy Cargo Transport — Tanish Logistic',
    metaDescription:
      'Plan industrial and heavy cargo transport with an early review of weight, dimensions, vehicle suitability, route access and any required permits.',
    cardSummary: 'Industrial goods and heavier loads that need careful vehicle, loading, and route checks.',
    heroDescription:
      'Learn what to check before arranging road transport for machinery or other heavy industrial goods.',
    plainMeaning:
      'Industrial and heavy cargo covers goods such as machinery, structural items, and production materials that may need specific loading, securing, or vehicle arrangements. The exact weight and dimensions matter: vehicle capacity, load distribution, site access, route restrictions, and permits must be checked before a movement is confirmed.',
    goodFit: [
      'The shipment includes machinery, steel, large components, or other industrial goods.',
      'The cargo needs a particular body type, loading method, or securing plan.',
      'The pickup or delivery site has access, lifting, height, or weight constraints to review.',
    ],
    prepare: [
      'Verified cargo weight and length, width, and height, including packaging or supports.',
      'Clear photographs or drawings and details of lifting points and load distribution.',
      'Loading and unloading equipment, site access, and any height or turning restrictions.',
      'The origin, destination, requested movement date, and any known permit requirements.',
    ],
    planningNote:
      'Oversized or overweight movements may require special vehicles, route checks, permits, or other approvals. Feasibility must be confirmed for the specific load and route before booking; not every load can use the same equipment.',
    faqs: [
      {
        question: 'Can every oversized or heavy load be transported?',
        answer:
          'No. Each load needs an assessment of its verified dimensions and weight, vehicle and route suitability, site access, and any permits or approvals that may apply.',
      },
      {
        question: 'Can I request a quote before I have exact dimensions?',
        answer:
          'Approximate details can help with an initial discussion, but a transport plan and reliable quote need confirmed measurements, weight, loading details, and both site locations.',
      },
    ],
    relatedSlugs: ['full-truckload-ftl', 'interstate-road-freight'],
  },
  {
    slug: 'express-highway-transit',
    label: 'Express Highway Transit',
    title: 'Express Highway Transit',
    metaTitle: 'Express Highway Transit — Tanish Logistic',
    metaDescription:
      'Learn what express highway transit means, when priority planning may help, and what deadline, cargo and route details are needed to confirm a service.',
    cardSummary: 'Priority planning for time-sensitive business shipments moving by road.',
    heroDescription:
      'Understand how to discuss a priority road movement when timing matters to your operation.',
    plainMeaning:
      'Express highway transit is a priority-planned road movement for freight with a tighter delivery requirement than usual. The operations team needs to check cargo readiness, route, vehicle availability, and a realistic transit estimate before confirming a plan.',
    goodFit: [
      'A time-sensitive shipment supports a production, project, or replenishment deadline.',
      'The cargo will be ready for pickup at a known time and can be loaded without avoidable delay.',
      'Your team can provide a latest acceptable delivery time and a contact who can confirm decisions quickly.',
    ],
    prepare: [
      'The latest acceptable delivery time and the business reason for the deadline.',
      'Pickup and delivery locations, site hours, and decision-maker contacts.',
      'Cargo description, weight, dimensions, packing, and readiness time.',
      'Any loading, unloading, or receiving restrictions that could affect the schedule.',
    ],
    planningNote:
      '“Express” does not automatically mean same-day delivery or a guaranteed arrival time. Traffic, weather, road restrictions, pickup readiness, and vehicle availability can affect transit; confirm the ETA and any commitment in the quote before booking.',
    faqs: [
      {
        question: 'Does express transit guarantee same-day or next-day delivery?',
        answer:
          'No. The achievable transit time depends on the route, distance, readiness, vehicle availability, and operating conditions. Ask for an estimate and get any firm commitment and conditions confirmed before booking.',
      },
      {
        question: 'What should I share first for an urgent shipment?',
        answer:
          'Share both locations, the cargo details, when it will be ready, and the latest acceptable delivery time. The operations team can then check whether a suitable priority plan is available.',
      },
    ],
    relatedSlugs: ['interstate-road-freight', 'full-truckload-ftl'],
  },
];

export function getServiceCapabilityBySlug(slug) {
  return serviceCapabilities.find((service) => service.slug === slug) || null;
}
