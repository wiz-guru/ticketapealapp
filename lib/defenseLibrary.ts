// ============================================================================
// TORONTO PARKING DEFENSE LIBRARY  —  THE PRODUCT LIVES HERE
// ============================================================================
// This single file is the heart of the app. The code never hard-codes legal
// arguments — it only renders what's in this file. To add offence codes, append
// objects to OFFENCE_CODES below. No other file changes needed.
//
// VERIFICATION STATUS (June 2026):
//  Section numbers, short-form wording, and set fines below are taken from the
//  City of Toronto report "Increase in Parking Violation Notice Penalty Amounts
//  & Establishment of New EV Parking Offences" (2024). Fines are the CURRENT
//  amounts from that report's *Addition to Schedule A* tables, which took effect
//  **August 1, 2024** (NOT the older deletion-table amounts). Still flagged
//  VERIFY: (1) the on-street paid-parking grace-period minutes, and (2) a final
//  confirmation against the live Municipal Code in case of changes after 2024.
//  The legal *grounds* are drafted arguments — a law-student review is advised.
//
// Sources:
//  - City of Toronto, "Dispute Your Parking Violation" (modified 2026-03-20)
//  - City of Toronto, Penalty Amounts report 2024 (backgroundfile-243968),
//    Addition to Schedule A tables (effective 2024-08-01)
//  - Toronto Municipal Code Ch. 950 (Traffic and Parking) and Ch. 910
//    (Parking Machines, Parking Meters and Mobile)
//  - Toronto Municipal Code Ch. 610 (Administrative Penalty By-law)
// ============================================================================

export interface DefenseGround {
  id: string;
  label: string;
  whenToUse: string;
  evidence: string[];
  template: string;
}

export interface OffenceCode {
  code: string;
  shortName: string;
  description: string;
  bylaw: string;
  setFine: string;
  verifyNote: string;
  grounds: DefenseGround[];
}

// The City frames a screening review around the violation either not having
// occurred (factual/legal error) or undue hardship. Grounds below argue the
// violation did not occur, and every letter is framed around that standard.
export const SCREENING_FRAMING =
  "I am requesting a screening review of this Parking Violation Notice. I submit " +
  "that the penalty should be cancelled because the violation did not occur, for " +
  "the reason(s) set out below.";

// Reusable ground builder for the very common "wrong details on the ticket".
function factualError(): DefenseGround {
  return {
    id: "factual-error",
    label: "Wrong details on the ticket",
    whenToUse:
      "The notice has a material error — wrong plate, location, date/time, or " +
      "vehicle make/colour. A material error can invalidate the notice.",
    evidence: [
      "Photo of the notice showing the incorrect detail",
      "Proof of the correct detail (vehicle registration, photos)",
    ],
    template:
      "Notice {{citationNumber}} contains a material error: it records {{details}}, " +
      "which is incorrect for vehicle {{plateNumber}} ({{vehicleDesc}}) at " +
      "{{location}} on {{violationDate}}. Because of this material error, the " +
      "violation as recorded did not occur.",
  };
}

function signageDefect(actionWord: string): DefenseGround {
  return {
    id: "signage-defect",
    label: "Sign missing, obscured, or not visible",
    whenToUse:
      "There was no sign, or it was hidden, faded, or not visible from where you " +
      actionWord + ". One of the strongest grounds in Toronto.",
    evidence: [
      "Dated photos showing the absence or obstruction of the sign",
      "Wide and close-up shots showing sightlines from the driver's position",
    ],
    template:
      "Notice {{citationNumber}} relies on an official sign at {{location}} on " +
      "{{violationDate}}. The regulatory sign was missing, obscured, or not " +
      "reasonably visible from where the vehicle was, as shown in the attached " +
      "photographs. Absent adequate signage the restriction was not validly " +
      "posted and the violation did not occur. {{details}}",
  };
}

export const OFFENCE_CODES: OffenceCode[] = [
  // 1 -----------------------------------------------------------------------
  {
    code: "§ 910-4A / 910-4C / 910-6 (Parking Machine)",
    shortName: "Expired meter / pay-and-display",
    description:
      "Did not pay the parking machine, displayed no valid receipt, or stayed past " +
      "the permitted/maximum time at a metered or pay-and-display space.",
    bylaw:
      "Toronto Municipal Code Ch. 910 — e.g. § 910-4A(1) fee not paid / fail to " +
      "activate; § 910-4C fail to display receipt; § 910-6 exceeds maximum time",
    setFine: "$75.00 (effective 2024-08-01)",
    verifyNote:
      "Match the exact § printed on the ticket. GRACE PERIOD: a 10-min " +
      "Pay-and-Display grace (bylaw 2014, confirmed by Parking Enforcement) is " +
      "NOT restated on current City/Green P pages — confirm before relying on it.",
    grounds: [
      {
        id: "grace-period",
        label: "Within the grace period",
        whenToUse:
          "Use only if ticketed within a few minutes of expiry. A 10-min " +
          "Pay-and-Display grace was added to the bylaw in 2014 and confirmed by " +
          "Parking Enforcement, but it is NOT restated on current City/Green P " +
          "pages — confirm it still applies before relying on it.",
        evidence: [
          "Your pay-and-display receipt or parking-app payment showing expiry time",
          "A clear photo of the violation notice showing the Time of Violation",
        ],
        template:
          "The Time of Violation recorded on Notice {{citationNumber}} is " +
          "{{violationTime}} on {{violationDate}}, only minutes after my paid " +
          "parking expired. I request that the grace period for on-street paid " +
          "parking be applied and the penalty cancelled, as the vehicle was " +
          "ticketed within that allowance. {{details}}",
      },
      {
        id: "valid-payment",
        label: "I had paid / valid payment not recognized",
        whenToUse: "You had a valid payment or permit the officer did not see.",
        evidence: [
          "Receipt or parking-app transaction record for the date/time/location",
          "Proof the payment covered this vehicle and space",
        ],
        template:
          "At the time Notice {{citationNumber}} was issued, valid payment for " +
          "vehicle {{plateNumber}} was in effect at {{location}} on {{violationDate}}. " +
          "Proof of payment is attached. As payment was valid, the violation did " +
          "not occur. {{details}}",
      },
    ],
  },
  // 2 -----------------------------------------------------------------------
  {
    code: "§ 950-405A",
    shortName: "Parking prohibited by sign (time/day)",
    description:
      "Park on a highway where parking is prohibited at the posted times/days by " +
      "official signs. (Short form: Park – Signed Highway – During Prohibited " +
      "(Day/Time).)",
    bylaw: "Toronto Municipal Code § 950-405A",
    setFine: "$75.00 (effective 2024-08-01)",
    verifyNote:
      "Confirm the ticket cites 950-405A; related signed-highway distance/location " +
      "offences sit under 950-400E and carry their own entries.",
    grounds: [
      signageDefect("parked"),
      factualError(),
    ],
  },
  // 3 -----------------------------------------------------------------------
  {
    code: "§ 950-405D / 950-405D.1",
    shortName: "No-stopping zone (prohibited hours / rush hour)",
    description:
      "Stop a vehicle where stopping is prohibited during posted hours (e.g. " +
      "rush-hour routes), by official signs.",
    bylaw:
      "Toronto Municipal Code § 950-405D (prohibited time/day) / § 950-405D.1 " +
      "(rush hour)",
    setFine: "$125.00 prohibited / $175.00 rush hour (effective 2024-08-01)",
    verifyNote: "Check whether the ticket is 405D or 405D.1 — the fine differs.",
    grounds: [
      {
        id: "outside-hours",
        label: "Ticket time is outside the posted hours",
        whenToUse:
          "The Time of Violation is outside the prohibited window shown on the sign.",
        evidence: [
          "Photo of the sign showing the exact prohibited hours",
          "Photo of the notice showing the Time of Violation",
        ],
        template:
          "Notice {{citationNumber}} records a Time of Violation of " +
          "{{violationTime}} on {{violationDate}} at {{location}}. The posted sign " +
          "prohibits stopping only during specified hours, and the recorded time " +
          "falls outside that window (see attached photographs). Stopping was " +
          "therefore permitted and the violation did not occur. {{details}}",
      },
      signageDefect("stopped"),
    ],
  },
  // 4 -----------------------------------------------------------------------
  {
    code: "§ 950-405F(1)",
    shortName: "Over the posted time limit (signed)",
    description:
      "Park on a signed highway in excess of the maximum time the sign permits.",
    bylaw: "Toronto Municipal Code § 950-405F(1)",
    setFine: "$75.00 (effective 2024-08-01)",
    verifyNote: "Confirms against the posted maximum-time sign at the location.",
    grounds: [
      {
        id: "within-time",
        label: "I was within the posted time limit",
        whenToUse:
          "You had not exceeded the maximum time on the sign, or the vehicle was " +
          "moved and the clock should have reset.",
        evidence: [
          "Photo of the sign showing the time limit",
          "Proof of arrival time (receipt, dashcam, timestamped photo)",
        ],
        template:
          "Notice {{citationNumber}} alleges parking beyond the posted time limit " +
          "at {{location}} on {{violationDate}} at {{violationTime}}. The vehicle " +
          "had not exceeded the maximum time permitted by the sign. The violation " +
          "did not occur. {{details}}",
      },
      signageDefect("parked"),
      factualError(),
    ],
  },
  // 5 -----------------------------------------------------------------------
  {
    code: "§ 950-400D(1)",
    shortName: "Obstruct driveway / laneway",
    description:
      "Park so as to obstruct a driveway or laneway (or within 60 cm of one).",
    bylaw: "Toronto Municipal Code § 950-400D(1)",
    setFine: "$75.00 (effective 2024-08-01)",
    verifyNote: "Confirm whether ticket is 'obstruct' vs 'within 60 cm' wording.",
    grounds: [
      {
        id: "not-obstructing",
        label: "The driveway was not actually obstructed",
        whenToUse:
          "The vehicle did not block the driveway/laneway, or you had the " +
          "occupant's permission (e.g. it is your own driveway).",
        evidence: [
          "Dated photos showing the vehicle clear of the driveway",
          "If applicable, written consent from the property occupant",
        ],
        template:
          "Notice {{citationNumber}} alleges obstructing a driveway/laneway at " +
          "{{location}} on {{violationDate}}. As shown in the attached photographs, " +
          "the vehicle did not obstruct the driveway/laneway. The violation did " +
          "not occur. {{details}}",
      },
      factualError(),
    ],
  },
  // 6 -----------------------------------------------------------------------
  {
    code: "§ 950-400D(2)",
    shortName: "Within 3 m of a fire hydrant",
    description: "Park within 3 metres of a fire hydrant.",
    bylaw: "Toronto Municipal Code § 950-400D(2)",
    setFine: "$125.00 (effective 2024-08-01)",
    verifyNote:
      "Distance is measured from the hydrant; photos with a reference object help.",
    grounds: [
      {
        id: "distance",
        label: "I was more than 3 m from the hydrant",
        whenToUse:
          "The vehicle was farther than 3 metres from the hydrant, or there was " +
          "no hydrant at the cited location.",
        evidence: [
          "Photos showing the distance between vehicle and hydrant (with a marker)",
          "A measurement or streetview reference if available",
        ],
        template:
          "Notice {{citationNumber}} alleges parking within 3 metres of a fire " +
          "hydrant at {{location}} on {{violationDate}}. As shown in the attached " +
          "photographs, the vehicle was more than 3 metres from the hydrant. The " +
          "violation did not occur. {{details}}",
      },
      factualError(),
    ],
  },
  // 7 -----------------------------------------------------------------------
  {
    code: "§ 950-400D(3)",
    shortName: "Within 9 m of an intersecting roadway",
    description: "Park within 9 metres of an intersecting roadway.",
    bylaw: "Toronto Municipal Code § 950-400D(3)",
    setFine: "$75.00 (effective 2024-08-01)",
    verifyNote: "Distance measured from the intersecting roadway.",
    grounds: [
      {
        id: "distance",
        label: "I was more than 9 m from the intersection",
        whenToUse: "The vehicle was farther than 9 metres from the intersecting roadway.",
        evidence: [
          "Photos showing the distance with a reference point",
          "Streetview or map measurement if available",
        ],
        template:
          "Notice {{citationNumber}} alleges parking within 9 metres of an " +
          "intersecting roadway at {{location}} on {{violationDate}}. As shown in " +
          "the attached photographs, the vehicle was more than 9 metres away. The " +
          "violation did not occur. {{details}}",
      },
      factualError(),
    ],
  },
  // 8 -----------------------------------------------------------------------
  {
    code: "§ 950-400D(5)",
    shortName: "Parked longer than 3 hours",
    description: "Park longer than three hours where that general limit applies.",
    bylaw: "Toronto Municipal Code § 950-400D(5)",
    setFine: "$75.00 (effective 2024-08-01)",
    verifyNote:
      "Applies to the general 3-hour limit; confirm a different signed limit did " +
      "not apply at the location.",
    grounds: [
      {
        id: "moved-within",
        label: "The vehicle was moved within 3 hours",
        whenToUse:
          "The vehicle had not been in the same place for more than three hours.",
        evidence: [
          "Timestamped photos / receipts showing arrival and departure",
          "Any record (dashcam, transactions) establishing the timeline",
        ],
        template:
          "Notice {{citationNumber}} alleges parking longer than three hours at " +
          "{{location}} on {{violationDate}}. The vehicle had not remained there " +
          "for more than three hours, as the attached evidence shows. The " +
          "violation did not occur. {{details}}",
      },
      factualError(),
    ],
  },
  // 9 -----------------------------------------------------------------------
  {
    code: "§ 950-400D(10)(a)",
    shortName: "No valid plate properly displayed",
    description:
      "Park a vehicle without a valid Ontario number plate properly displayed.",
    bylaw: "Toronto Municipal Code § 950-400D(10)(a)",
    setFine: "$75.00 (effective 2024-08-01)",
    verifyNote:
      "Use 950-400D(10)(b) instead for a non-Ontario plate.",
    grounds: [
      {
        id: "plate-valid",
        label: "My plate was valid and properly displayed",
        whenToUse:
          "The plate was valid and properly affixed at the time of the notice.",
        evidence: [
          "Proof of a valid plate/registration for the date",
          "A photo showing the plate properly displayed",
        ],
        template:
          "Notice {{citationNumber}} alleges no valid plate properly displayed on " +
          "vehicle {{plateNumber}} at {{location}} on {{violationDate}}. The plate " +
          "was valid and properly displayed, as the attached proof shows. The " +
          "violation did not occur. {{details}}",
      },
      factualError(),
    ],
  },
  // 10 ----------------------------------------------------------------------
  {
    code: "§ 950-400B(2)",
    shortName: "Stopped in an intersection / crosswalk",
    description:
      "Stop within an intersection or a pedestrian crossover.",
    bylaw: "Toronto Municipal Code § 950-400B(2)",
    setFine: "$200.00 (effective 2024-08-01)",
    verifyNote: "High-value offence; factual location is usually the live issue.",
    grounds: [
      {
        id: "not-located",
        label: "The vehicle was not in the intersection / crosswalk",
        whenToUse:
          "The vehicle was clear of the intersection or pedestrian crossover.",
        evidence: [
          "Dated photos showing the vehicle's position relative to the crossing",
          "Streetview/map reference if helpful",
        ],
        template:
          "Notice {{citationNumber}} alleges stopping within an intersection or " +
          "pedestrian crossover at {{location}} on {{violationDate}}. As shown in " +
          "the attached photographs, the vehicle was clear of the " +
          "intersection/crossover. The violation did not occur. {{details}}",
      },
      factualError(),
    ],
  },
  // 11 ----------------------------------------------------------------------
  {
    code: "§ 950-400F(1)",
    shortName: "Standing in a transit stop zone",
    description:
      "Stand a vehicle in a signed transit (bus/streetcar) stop zone.",
    bylaw: "Toronto Municipal Code § 950-400F(1)",
    setFine: "$200.00 (effective 2024-08-01)",
    verifyNote: "High-value; signage and exact zone boundaries are the live issues.",
    grounds: [
      {
        id: "not-in-zone",
        label: "The vehicle was outside the transit stop zone",
        whenToUse:
          "The vehicle was outside the marked transit stop zone boundaries.",
        evidence: [
          "Photos showing the vehicle relative to the transit-stop markings/signs",
        ],
        template:
          "Notice {{citationNumber}} alleges standing in a transit stop zone at " +
          "{{location}} on {{violationDate}}. As shown in the attached " +
          "photographs, the vehicle was outside the marked transit stop zone. The " +
          "violation did not occur. {{details}}",
      },
      signageDefect("stopped"),
      factualError(),
    ],
  },
  // 12 ----------------------------------------------------------------------
  {
    code: "§ 950-406A",
    shortName: "Snow route",
    description:
      "Park on a designated snow route (these restrictions apply when a major " +
      "snow condition / parking ban is declared).",
    bylaw: "Toronto Municipal Code § 950-406A",
    setFine: "$75.00 (effective 2024-08-01)",
    verifyNote:
      "VERIFY how/when a snow-route ban is in force (declared event) and the exact " +
      "trigger wording before relying on the 'no ban in effect' ground.",
    grounds: [
      {
        id: "no-ban",
        label: "No snow-route ban was in effect",
        whenToUse:
          "No major snow condition / parking ban had been declared for that time.",
        evidence: [
          "Any record that no ban was declared/active at the date and time",
          "Photo of the notice showing date/time",
        ],
        template:
          "Notice {{citationNumber}} alleges a snow-route violation at {{location}} " +
          "on {{violationDate}} at {{violationTime}}. No snow-route parking ban was " +
          "in effect at that time. The violation did not occur. {{details}}",
      },
      signageDefect("parked"),
      factualError(),
    ],
  },
];

// Step-by-step filing guidance. VERIFY wording/links against the City page.
export const FILING_STEPS: string[] = [
  "You have 15 days from the notice date to dispute (up to 60 days to request an extension with reasons).",
  "Go to the City of Toronto Parking Violation Lookup (secure.toronto.ca/webapps/parking) and look up your notice using the violation number + licence plate.",
  "Choose to request a Screening Review. Paste the letter below into the explanation field.",
  "Upload your supporting evidence (photos/receipts). You get ONE screening review per notice, so include everything now.",
  "Submit. You do not have to pay while the review is pending. Current City turn-around is up to ~10 months.",
  "If the screening decision is unfavourable, you have 15 days to request a final Hearing Review with the Administrative Penalty Tribunal.",
];

export const DISCLAIMER =
  "This is a self-help tool, not legal advice. You remain the named disputant " +
  "and are responsible for the accuracy of everything you submit. Providing false " +
  "or misleading information to the City is an offence.";
