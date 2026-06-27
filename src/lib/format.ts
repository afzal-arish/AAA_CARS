export function formatINR(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

export function formatKm(n: number) {
  return `${Math.round(n).toLocaleString("en-IN")} km`;
}

export const FUEL_TYPES = ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"] as const;
export const TRANSMISSIONS = ["Manual", "Automatic", "Semi-Automatic"] as const;
export const CONDITIONS = ["Excellent", "Very Good", "Good", "Fair"] as const;
export const OWNERS = ["First Owner", "Second Owner", "Third Owner", "Fourth Owner+"] as const;
export const INQUIRY_STATUSES = ["New", "Contacted", "Scheduled Test Drive", "Converted", "Closed"] as const;
export const FEATURES = [
  "ABS","Airbags","Sunroof","Alloy Wheels","Reverse Camera","Touchscreen Display",
  "Cruise Control","Parking Sensors","Bluetooth","Android Auto","Apple CarPlay",
  "Power Steering","Power Windows","Climate Control","ABS+EBD","Keyless Entry",
];