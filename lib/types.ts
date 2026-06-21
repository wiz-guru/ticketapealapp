// Form data the user enters manually in v1 (OCR auto-fill is a v2 enhancement).

export interface TicketData {
  citationNumber: string;
  violationDate: string;   // e.g. 2026-06-15
  violationTime: string;   // e.g. 6:40 PM
  location: string;        // street / intersection on the notice
  plateNumber: string;
  vehicleDesc: string;     // make / model / colour
}

export const EMPTY_TICKET: TicketData = {
  citationNumber: "",
  violationDate: "",
  violationTime: "",
  location: "",
  plateNumber: "",
  vehicleDesc: "",
};

export interface GenerateRequest {
  ticket: TicketData;
  offenceIndex: number; // index into OFFENCE_CODES
  groundId: string;     // id of the chosen ground within that offence
  details: string;      // free text the user adds to support the ground
}
