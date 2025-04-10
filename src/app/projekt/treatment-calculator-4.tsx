import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const treatments = [
  {
    label: "00 = Ingen färdigbehandling",
    treatments: [],
  },
  {
    label: "02 = Uppsättning tapet",
    treatments: [
      {
        times: 1,
        treatment: "tapetklister",
        materialConsumption: 0.197, // flugger
        materialConsumptionUnit: "kvd",
        material: "tapetlim",
      },
    ],
    dryingTime: 4, // Default torktid i timmar
    tools: ["tapetverktyg", "stege"], // Verktyg för tapetsering
  },
  {
    label: "03 = Kantlimning, uppsättning tapet",
    treatments: [
      {
        times: 0,
        treatment: "kantlimning",
        materialConsumption: 0.197, // flugger
        materialConsumptionUnit: "kvd",
        material: "tapetlim",
      },
      {
        times: 1,
        treatment: "tapetklister",
        materialConsumption: 0.197, // flugger
        materialConsumptionUnit: "kvd",
        material: "tapetlim",
      },
    ],
    dryingTime: 4, // Default torktid i timmar
    tools: ["tapetverktyg", "stege"], // Verktyg för tapetsering
  },
  {
    label: "07 = Spackling",
    treatments: [
      {
        times: 1,
        treatment: "spackel", // flugger
        materialConsumption: 1,
        materialConsumptionUnit: "kvd",
        material: "spackel",
      },
    ],
    dryingTime: 3, // Default torktid för spackling
    tools: ["spackelspadar"], // Verktyg för spackling
  },
  {
    label: "08 = strykning",
    treatments: [
      {
        times: 1,
        treatment: "strykning", // flugger
        materialConsumption: 0.125,
        materialConsumptionUnit: "kvd",
        material: "färg",
      },
    ],
    dryingTime: 3, // Default torktid för spackling
    tools: ["spackelspadar"], // Verktyg för spackling
  },
  // Lägg till fler behandlingar här om det behövs
];

const materialUnits = {
  tapetlim: "liter",
  spackel: "liter",
  grundfärg: "liter",
  färg: "liter",
  målartvätt: "liter",
  gräng: "liter",
};

export default function TreatmentCalculator({ projectId, surfaceId }) {
  console.log(`${projectId}-${surfaceId}`);
  const [selectedLabel, setSelectedLabel] = useState("");
  const [area, setArea] = useState(0);
  const [height, setHeight] = useState(2.5); // Standard takhöjd
  const [rollWidth, setRollWidth] = useState(0.53); // Default bredd på tapetrulle (m)
  const [rollLength, setRollLength] = useState(10.05); // Default längd på tapetrulle (m)
  const [patternMatching, setPatternMatching] = useState(0); // Spill för mönsterpassning (m)
  const [selectedTreatments, setSelectedTreatments] = useState([]);
  const [treatmentHours, setTreatmentHours] = useState({});
  const [completedTreatments, setCompletedTreatments] = useState({});
  const [dryingTimes, setDryingTimes] = useState({});

  // Ladda data från localStorage när komponenten laddas
  useEffect(() => {
    const savedData = localStorage.getItem("surfaces");
    console.log("svaedData", savedData);
    if (savedData) {
      const surfaces = JSON.parse(savedData);
      const surfaceData = surfaces[`${projectId}-${surfaceId}`];
      if (surfaceData) {
        console.log("called");
        setArea(surfaceData.area || 0);
        setHeight(surfaceData.height || 2.5);
        setRollWidth(surfaceData.rollWidth || 0.53);
        setRollLength(surfaceData.rollLength || 10.05);
        setPatternMatching(surfaceData.patternMatching || 0);
        setSelectedTreatments(surfaceData.selectedTreatments || []);
        setTreatmentHours(surfaceData.treatmentHours || {});
        setCompletedTreatments(surfaceData.completedTreatments || {});
        setDryingTimes(surfaceData.dryingTimes || {});
      }
    }
  }, [projectId, surfaceId]);

  useEffect(() => {
    const dataToSave = {
      area,
      height,
      rollWidth,
      rollLength,
      patternMatching,
      selectedTreatments,
      treatmentHours,
      completedTreatments,
      dryingTimes,
    };

    const savedSurfaces = localStorage.getItem("surfaces");
    const surfaces = savedSurfaces ? JSON.parse(savedSurfaces) : {};

    // Spara uppdaterad data för specifik yta under projectId-surfaceId
    surfaces[`${projectId}-${surfaceId}`] = dataToSave;

    // Spara tillbaka hela surfaces-objektet till localStorage
    setTimeout(() => {
      localStorage.setItem("surfaces", JSON.stringify(surfaces));
    }, 100); // Lägger till en liten fördröjning
  }, [
    projectId,
    surfaceId,
    area,
    height,
    rollWidth,
    rollLength,
    patternMatching,
    selectedTreatments,
    treatmentHours,
    completedTreatments,
    dryingTimes,
  ]);

  const handleAddTreatment = () => {
    const treatment = treatments.find((t) => t.label === selectedLabel);
    if (treatment) {
      const uniqueId = new Date().getTime();
      const newTreatment = { ...treatment, id: uniqueId };
      setSelectedTreatments([...selectedTreatments, newTreatment]);
    }
  };

  const calculateDryingCompletionTime = (id) => {
    const treatment = selectedTreatments.find((t) => t.id === id);
    if (treatment && dryingTimes[id]) {
      const dryingDurationInMilliseconds = dryingTimes[id] * 60 * 60 * 1000; // Konvertera timmar till millisekunder
      const completionTime = new Date(
        new Date().getTime() + dryingDurationInMilliseconds
      );
      return completionTime.toLocaleString();
    }
    return null;
  };

  // Beräkna materialåtgång
  const materialSummary = {};
  selectedTreatments.forEach((t) => {
    t.treatments.forEach((step) => {
      const amount = (step.materialConsumption ?? 0) * step.times * area;
      const material = step.material || step.treatment;
      materialSummary[material] = (materialSummary[material] || 0) + amount;
    });
  });

  // Beräkna tapetåtgång
  const calculateWallpaperNeeds = () => {
    if (selectedTreatments.some((t) => t.label === "02 = Uppsättning tapet")) {
      const wallArea = area * height; // Total väggyta
      const rollArea = rollWidth * rollLength; // En rulles täckningsyta
      const rollsNeeded = wallArea / rollArea;
      return rollsNeeded + patternMatching * rollsNeeded; // Lägg till spill för mönsterpassning
    }
    return 0;
  };

  const wallpaperRollsNeeded = calculateWallpaperNeeds();

  const totalHours = selectedTreatments.reduce((total, treatment) => {
    const hours = treatmentHours[treatment.id] || 0;
    return total + hours;
  }, 0);

  const handleCompleteTreatment = (id) => {
    setCompletedTreatments((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Hantera användarinmatning för torktiden
  const handleDryingTimeChange = (id, time) => {
    setDryingTimes((prev) => ({
      ...prev,
      [id]: time,
    }));
  };

  // Summera verktygen
  const toolsSummary = selectedTreatments.reduce((tools, treatment) => {
    treatment.tools.forEach((tool) => {
      tools[tool] = (tools[tool] || 0) + 1;
    });
    return tools;
  }, {});

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div>
            <Label>Ange yta (kvm)</Label>
            <Input
              type="number"
              value={area}
              onChange={(e) => setArea(Number(e.target.value))}
            />
          </div>

          <div>
            <Label>Ange takhöjd (m)</Label>
            <Input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
            />
          </div>

          <div>
            <Label>Ange bredd på tapetrulle (m)</Label>
            <Input
              type="number"
              value={rollWidth}
              onChange={(e) => setRollWidth(Number(e.target.value))}
            />
          </div>

          <div>
            <Label>Ange längd på tapetrulle (m)</Label>
            <Input
              type="number"
              value={rollLength}
              onChange={(e) => setRollLength(Number(e.target.value))}
            />
          </div>

          <div>
            <Label>Spill vid mönsterpassning (m)</Label>
            <Input
              type="number"
              value={patternMatching}
              onChange={(e) => setPatternMatching(Number(e.target.value))}
            />
          </div>

          <div>
            <Label>Välj behandling</Label>
            <Select onValueChange={setSelectedLabel}>
              <SelectTrigger>
                <SelectValue placeholder="Välj behandling" />
              </SelectTrigger>
              <SelectContent>
                {treatments.map((t) => (
                  <SelectItem key={t.label} value={t.label}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleAddTreatment}>Lägg till behandling</Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h2 className="font-bold mb-2">Valda behandlingar</h2>
          <ol className="list-decimal pl-4">
            {selectedTreatments.map((t, i) => (
              <li
                key={t.id}
                className="my-2"
                style={{
                  textDecoration: completedTreatments[t.id] ? "none" : "none",
                }}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Checkbox
                    id={`checkbox-${t.id}`}
                    checked={completedTreatments[t.id]}
                    onCheckedChange={() => handleCompleteTreatment(t.id)}
                  />
                  <label
                    htmlFor={`checkbox-${t.id}`}
                    className={`text-sm font-medium leading-none ${
                      completedTreatments[t.id]
                        ? "line-through text-muted-foreground"
                        : ""
                    }`}
                  >
                    {t.label}
                  </label>
                </div>

                <div>
                  <Label>Torktid (i timmar)</Label>
                  <Input
                    type="number"
                    value={dryingTimes[t.id] || ""}
                    onChange={(e) =>
                      handleDryingTimeChange(t.id, e.target.value)
                    }
                  />
                </div>

                {completedTreatments[t.id] && (
                  <div>
                    <p>Torktid klar: {calculateDryingCompletionTime(t.id)}</p>
                  </div>
                )}

                <div>
                  <Label>Arbetstimmar</Label>
                  <Input
                    type="number"
                    value={treatmentHours[t.id] || 0}
                    onChange={(e) =>
                      setTreatmentHours({
                        ...treatmentHours,
                        [t.id]: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h2 className="font-bold mb-2">Verktyg sammanfattning</h2>
          <ul className="list-disc pl-4">
            {Object.entries(toolsSummary).map(([tool, count], i) => (
              <li key={i}>
                {tool}: {count} st
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h2 className="font-bold mb-2">Materialåtgång</h2>
          <ul className="list-disc pl-4">
            {Object.entries(materialSummary).map(([material, total], i) => (
              <li key={i}>
                {material}: {total.toFixed(2)}
                {" l"}
              </li>
            ))}
          </ul>
          {wallpaperRollsNeeded > 0 && (
            <p>
              Tapetrullar som behövs: {wallpaperRollsNeeded.toFixed(2)} rullar
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h2 className="font-bold mb-2">Total arbetstid</h2>
          <p>Total arbetstid för alla behandlingar: {totalHours} timmar</p>
        </CardContent>
      </Card>
    </div>
  );
}
