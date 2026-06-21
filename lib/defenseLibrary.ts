// ============================================================================
// TORONTO PARKING DEFENSE LIBRARY  —  THE PRODUCT LIVES HERE
// ============================================================================
// This single file is the heart of the app. The code never hard-codes legal
// arguments — it only renders what's in this file. To expand from 3 offence
// codes to 8–12, add objects to OFFENCE_CODES below. No other file changes.
//
// VERIFICATION STATUS (June 2026):
//  Sections, short-form wording, and set fines below were confirmed against the
//  City of Toronto report "Increase in Parking Violation Notice Penalty Amounts
//  & Establishment of New EV Parking Offences" (2024, Schedule A tables), which
//  reproduces Chapter 950 / Chapter 910 set fines. Two items remain flagged
//  VERIFY: (1) the on-street paid-parking grace-period minutes, and (2) a final
//  confirmation that fines have not changed since the 2024 report. Do a last
//  check against the live Municipal Code before launch.
//
// Sources:
//  - City of Toronto, "Dispute Your Parking Violation" (modified 2026-03-20)
//  - City of Toronto, Penalty Amounts report 2024 (backgroundfile-243968)
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

export const OFFENCE_CODES: OffenceCode[] = [
  {
    // CONFIRMED: metered / pay-and-display offences live in Chapter 910, not 950.
    code: "§ 910-4A / 910-4C / 910-6 (Parking Machine)",
    shortName: "Expired meter / pay-and-display",
    description:
      "Did not pay the parking machine, displayed no valid receipt, or stayed past " +
      "the permitted/maximum time at a metered or pay-and-display space.",
    bylaw:
      "Toronto Municipal Code Ch. 910 (Parking Machines & Meters) — e.g. " +
      "§ 910-4A(1) fee not paid / fail to activate; § 910-4C fail to display " +
      "receipt; § 910-6 exceeds maximum time",
    setFine: "$30.00 (confirmed, 2024 schedule)",
    verifyNote:
      "Match the exact § printed on the ticket to the wording above. GRACE PERIOD: " +
      "a 10-min Pay-and-Display grace (bylaw 2014, confirmed by Parking " +
      "Enforcement) is NOT restated on current City/Green P pages — confirm it " +
      "still applies before relying on the grace ground.",
    grounds: [
      {
        id: "grace-period",
        label: "Within the grace period",
        whenToUse:
          "Use only if you were ticketed within a few minutes of expiry. A 10-min " +
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
        whenToUse:
          "You had a valid payment or permit the officer did not see.",
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
  {
    code: "§ 950-405A",
    shortName: "Parking prohibited by sign (time/day)",
    description:
      "Park on a highway where parking is prohibited at the posted times/days by " +
      "official signs. (Short form: Park – Signed Highway – During Prohibited " +
      "(Day/Time).)",
    bylaw: "Toronto Municipal Code § 950-405A (confirmed)",
    setFine: "$50.00 (confirmed, 2024 schedule)",
    verifyNote:
      "Confirm the ticket cites 950-405A specifically; related signed-highway " +
      "distances/locations sit under 950-400E and carry different fines.",
    grounds: [
      {
        id: "signage-defect",
        label: "Sign missing, obscured, or not visible",
        whenToUse:
          "No sign, or it was hidden, faded, or not visible from where you parked. " +
          "One of the strongest grounds in Toronto.",
        evidence: [
          "Dated photos of the spot showing the absence/obstruction of signage",
          "Wide and close-up shots showing sightlines from the driver's position",
        ],
        template:
          "Notice {{citationNumber}} alleges parking prohibited by sign at " +
          "{{location}} on {{violationDate}}. The regulatory sign was missing, " +
          "obscured, or not reasonably visible from the parking position, as shown " +
          "in the attached photographs. Absent adequate signage, the prohibition " +
          "was not validly posted and the violation did not occur. {{details}}",
      },
      {
        id: "factual-error",
        label: "Wrong details on the ticket",
        whenToUse:
          "Material error on the notice — wrong plate, location, date/time, or " +
          "vehicle make/colour. A material error can void the notice.",
        evidence: [
          "Photo of the notice showing the incorrect detail",
          "Proof of the correct detail (registration, photos)",
        ],
        template:
          "Notice {{citationNumber}} contains a material error. It records " +
          "{{details}}, which is incorrect for vehicle {{plateNumber}} " +
          "({{vehicleDesc}}). This material error means the violation as recorded " +
          "did not occur.",
      },
    ],
  },
  {
    code: "§ 950-405D / 950-405D.1",
    shortName: "No-stopping zone (prohibited hours / rush hour)",
    description:
      "Stop a vehicle on a highway where stopping is prohibited during posted " +
      "hours (e.g. rush-hour routes), by official signs. (Short form: Stop – " +
      "Signed Highway – During Prohibited (Time/Day), or During Rush Hour Period.)",
    bylaw:
      "Toronto Municipal Code § 950-405D (prohibited time/day) / § 950-405D.1 " +
      "(rush hour) — confirmed",
    setFine: "$100.00 prohibited / $150.00 rush hour (confirmed, 2024 schedule)",
    verifyNote:
      "Check whether the ticket is 405D or 405D.1 — the fine differs ($100 vs $150).",
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
      {
        id: "signage-defect",
        label: "Sign missing, obscured, or not visible",
        whenToUse:
          "No sign, or it was hidden/faded/not visible from where you stopped.",
        evidence: [
          "Dated photos showing the absence or obstruction of the sign",
          "Shots showing sightlines from the driver's position",
        ],
        template:
          "Notice {{citationNumber}} alleges stopping prohibited by sign at " +
          "{{location}} on {{violationDate}}. The regulatory sign was missing, " +
          "obscured, or not reasonably visible, as shown in the attached " +
          "photographs. Absent adequate signage the prohibition was not validly " +
          "posted and the violation did not occur. {{details}}",
      },
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
