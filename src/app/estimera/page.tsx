"use client";

import { useState } from "react";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const treatments = [
  {
    treatmentId: "Uppsättning tapet",
    startDate: "2025-04-10T09:00:00",
    completionDate: "2025-04-10T12:30:00",
    hoursSpent: 3,
    area: 25,
    treatmentDetails: {
      materials: [
        { name: "Tapetlim", quantity: 1.5, unit: "liter" },
        { name: "Tapetrulle", quantity: 2, unit: "st" },
      ],
      dryingTime: "2025-04-10T16:00:00",
    },
    tools: ["Tapetverktyg", "Stege", "Arbetsbock"],
  },
  {
    treatmentId: "Spackling",
    startDate: "2025-04-11T09:00:00",
    completionDate: "2025-04-11T11:00:00",
    hoursSpent: 2,
    area: 20,
    treatmentDetails: {
      materials: [{ name: "Spackel", quantity: 2, unit: "liter" }],
      dryingTime: "2025-04-11T15:00:00",
    },
    tools: ["Spackelspade", "Slipmaskin"],
  },
  {
    treatmentId: "Avslipning",
    startDate: "2025-04-12T09:00:00",
    completionDate: "2025-04-12T12:00:00",
    hoursSpent: 2.5,
    area: 20,
    treatmentDetails: {
      materials: [{ name: "Slipmedel", quantity: 1, unit: "kg" }],
      dryingTime: "2025-04-12T16:00:00",
    },
    tools: ["Slipmaskin", "Stöddyna"],
  },
  {
    treatmentId: "Avslipning",
    startDate: "2025-04-10T09:00:00",
    completionDate: "2025-04-10T12:00:00",
    hoursSpent: 2.5,
    area: 18,
    treatmentDetails: {
      materials: [{ name: "Slipmedel", quantity: 1, unit: "kg" }],
      dryingTime: "2025-04-12T16:00:00",
    },
    tools: ["Slipmaskin", "Stöddyna"],
  },
  {
    treatmentId: "Avslipning",
    startDate: "2025-04-12T09:00:00",
    completionDate: "2025-04-12T12:00:00",
    hoursSpent: 1.5,
    area: 10,
    treatmentDetails: {
      materials: [{ name: "Slipmedel", quantity: 1, unit: "kg" }],
      dryingTime: "2025-04-12T16:00:00",
    },
    tools: ["Slipmaskin", "Stöddyna"],
  },
];

const TreatmentCalculator = () => {
  const [selectedTreatment, setSelectedTreatment] = useState("");
  const [area, setArea] = useState("");
  const [startDate, setStartDate] = useState(null); // For the date picker
  const [calculation, setCalculation] = useState(null);
  const [details, setDetails] = useState(null);

  const handleTreatmentChange = (event) => {
    setSelectedTreatment(event.target.value);
    setCalculation(null); // Clear previous calculations
    setDetails(null); // Clear detailed data
  };

  const handleAreaChange = (event) => {
    setArea(event.target.value);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const calculateTime = () => {
    if (selectedTreatment) {
      const filteredTreatments = treatments.filter((treatment) => {
        // Filter by treatment and start date if provided
        const isTreatmentMatch = treatment.treatmentId === selectedTreatment;
        const isDateMatch =
          !startDate || new Date(treatment.startDate) >= startDate;
        return isTreatmentMatch && isDateMatch;
      });

      const totalTimeSpent = filteredTreatments.reduce(
        (acc, treatment) => acc + treatment.hoursSpent,
        0
      );

      const totalArea = filteredTreatments.reduce(
        (acc, treatment) => acc + treatment.area,
        0
      );

      const averageTimePerArea = totalTimeSpent / totalArea; // Time per m²

      const totalTimeForUserArea = averageTimePerArea * area; // Total time for the user input area

      // Collecting details for display
      const detailedData = filteredTreatments.map((treatment) => ({
        label: treatment.treatmentId,
        hoursSpent: treatment.hoursSpent,
        area: treatment.area,
        timePerArea: (treatment.hoursSpent / treatment.area).toFixed(2),
      }));

      setCalculation({
        averageTimePerArea: averageTimePerArea.toFixed(2),
        totalTimeForUserArea: totalTimeForUserArea.toFixed(2),
      });
      setDetails(detailedData);
    }
  };

  return (
    <div className="p-4">
      <Link href="/" className="w-full">
        <Button variant="outline">
          <Home className="w-6 h-6" />
          Hem
        </Button>
      </Link>

      <h2 className="text-xl font-bold">Behandlingar</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium">Välj behandling</label>
        <select
          onChange={handleTreatmentChange}
          className="mt-2 p-2 border rounded"
        >
          <option value="">--Välj behandling--</option>
          {["Uppsättning tapet", "Spackling", "Avslipning"].map(
            (treatment, index) => (
              <option key={index} value={treatment}>
                {treatment}
              </option>
            )
          )}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Fyll i yta (kvm)</label>
        <input
          type="number"
          value={area}
          onChange={handleAreaChange}
          className="mt-2 p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Välj startdatum</label>
        <DatePicker
          selected={startDate}
          onChange={handleStartDateChange}
          className="mt-2 p-2 border rounded"
          dateFormat="yyyy-MM-dd"
        />
      </div>

      <button
        onClick={calculateTime}
        className="mt-4 p-2 bg-blue-500 text-white rounded"
      >
        Beräkna tid
      </button>

      {calculation && (
        <div className="mt-4">
          <p>
            <strong>Genomsnittlig tid per kvm:</strong>{" "}
            {calculation.averageTimePerArea} timmar
          </p>
          <p>
            <strong>Total tid för {area} kvm:</strong>{" "}
            {calculation.totalTimeForUserArea} timmar
          </p>
        </div>
      )}

      {details && (
        <div className="mt-6">
          <h3 className="text-lg font-bold">Detaljerad uträkning</h3>
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4 text-left">Behandling</th>
                <th className="py-2 px-4 text-left">Tid (timmar)</th>
                <th className="py-2 px-4 text-left">Yta (kvm)</th>
                <th className="py-2 px-4 text-left">Tid per kvm (timmar)</th>
              </tr>
            </thead>
            <tbody>
              {details.map((detail, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 px-4">{detail.label}</td>
                  <td className="py-2 px-4">{detail.hoursSpent}</td>
                  <td className="py-2 px-4">{detail.area}</td>
                  <td className="py-2 px-4">{detail.timePerArea}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TreatmentCalculator;
