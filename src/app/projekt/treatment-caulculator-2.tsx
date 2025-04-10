import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const treatments = [
  { label: "00 = Ingen färdigbehandling", treatments: [] },
  {
    label: "01 = Tvättning för gott (tvättning)",
    treatments: [
      {
        times: 1,
        treatment: "målar-tvätt",
        materialConsumption: 0.3,
        materialConsumptionUnit: "kvd",
        material: "målartvätt",
      },
    ],
  },
  {
    label: "02 = Uppsättning tapet",
    treatments: [
      {
        times: 1,
        treatment: "tapetklister",
        materialConsumption: 0.38,
        materialConsumptionUnit: "kvd",
        material: "tapetlim",
      },
    ],
  },
  {
    label: "03 = Kantlimning, uppsättning tapet",
    treatments: [
      {
        times: 1,
        treatment: "kantlimning",
        materialConsumption: 0.2,
        materialConsumptionUnit: "kvd",
        material: "tapetlim",
      },
      {
        times: 1,
        treatment: "tapetklister",
        materialConsumption: 0.38,
        materialConsumptionUnit: "kvd",
        material: "tapetlim",
      },
    ],
  },
  {
    label: "04 = Limning, uppsättning tapet",
    treatments: [
      {
        times: 1,
        treatment: "limning",
        materialConsumption: 0.25,
        materialConsumptionUnit: "kvd",
        material: "tapetlim",
      },
      {
        times: 1,
        treatment: "tapetklister",
        materialConsumption: 0.38,
        materialConsumptionUnit: "kvd",
        material: "tapetlim",
      },
    ],
  },
  {
    label: "05 = 1 gg grundning, uppsättning tapet",
    treatments: [
      {
        times: 1,
        treatment: "grundning",
        materialConsumption: 0.5,
        materialConsumptionUnit: "kvd",
        material: "tapetlim",
      },
      {
        times: 1,
        treatment: "tapetklister",
        materialConsumption: 0.38,
        materialConsumptionUnit: "kvd",
        material: "tapetlim",
      },
    ],
  },
  {
    label: "06 = 1 gg strykning, uppsättning tapet",
    treatments: [
      {
        times: 1,
        treatment: "grundfärg",
        materialConsumption: 0.4,
        materialConsumptionUnit: "kvd",
        material: "grundfärg",
      },
      {
        times: 1,
        treatment: "tapetklister",
        materialConsumption: 0.38,
        materialConsumptionUnit: "kvd",
        material: "tapetlim",
      },
    ],
  },
  {
    label: "07 = Grängning",
    treatments: [
      {
        times: 1,
        treatment: "grängning",
        materialConsumption: 0.5,
        materialConsumptionUnit: "kvd",
        material: "gräng",
      },
    ],
  },
  {
    label: "08 = 1 gg strykning",
    treatments: [
      {
        times: 1,
        treatment: "grundfärg",
        materialConsumption: 0.4,
        materialConsumptionUnit: "kvd",
        material: "grundfärg",
      },
    ],
  },
  {
    label: "09 = 1 gg påbättring, 1 gg strykning",
    treatments: [
      {
        times: 1,
        treatment: "påbättring",
        materialConsumption: 0.3,
        materialConsumptionUnit: "kvd",
        material: "grundfärg",
      },
      {
        times: 1,
        treatment: "grundfärg",
        materialConsumption: 0.4,
        materialConsumptionUnit: "kvd",
        material: "grundfärg",
      },
    ],
  },
  {
    label:
      "14 = 1 gg strykning, 1 gg ispackling (finspackling), 1 gg påbättring, 1 gg strykning",
    treatments: [
      {
        times: 1,
        treatment: "strykning",
        materialConsumption: 0.4,
        materialConsumptionUnit: "kvd",
        material: "färg",
      },
      {
        times: 1,
        treatment: "ispackling",
        materialConsumption: 0.2,
        materialConsumptionUnit: "kvd",
        material: "spackel",
      },
      {
        times: 1,
        treatment: "påbättring",
        materialConsumption: 0.3,
        materialConsumptionUnit: "kvd",
        material: "spackel",
      },
    ],
  },
  {
    label:
      "15 = 1 gg strykning, 1 gg ispackling (finspackling), 2 ggr strykning",
    treatments: [
      {
        times: 1,
        treatment: "strykning",
        materialConsumption: 0.4,
        materialConsumptionUnit: "kvd",
      },
      {
        times: 1,
        treatment: "ispackling",
        materialConsumption: 0.2,
        materialConsumptionUnit: "kvd",
      },
      {
        times: 2,
        treatment: "strykning",
        materialConsumption: 0.4,
        materialConsumptionUnit: "kvd",
      },
    ],
  },
  {
    label:
      "16 = 1 gg strykning, 1 gg bredspackling (finbredspackling), 2 ggr strykning",
    treatments: [
      {
        times: 1,
        treatment: "strykning",
        materialConsumption: 0.4,
        materialConsumptionUnit: "kvd",
        material: "grundfärg",
      },
      {
        times: 1,
        treatment: "bredspackling",
        materialConsumption: 1,
        materialConsumptionUnit: "kvd",
        material: "spackel",
      },
      {
        times: 2,
        treatment: "strykning",
        materialConsumption: 0.4,
        materialConsumptionUnit: "kvd",
        material: "färg",
      },
    ],
  },
];

const materialUnits = {
  tapetlim: "liter",
  spackel: "liter",
  grundfärg: "liter",
  färg: "liter",
  målartvätt: "liter",
  gräng: "liter",
};

export default function TreatmentCalculator() {
  const [selectedLabel, setSelectedLabel] = useState("");
  const [area, setArea] = useState(0);
  const [height, setHeight] = useState(2.5); // Standard takhöjd
  const [rollWidth, setRollWidth] = useState(0.53); // Default bredd på tapetrulle (m)
  const [rollLength, setRollLength] = useState(10.05); // Default längd på tapetrulle (m)
  const [patternMatching, setPatternMatching] = useState(0); // Spill för mönsterpassning (m)
  const [selectedTreatments, setSelectedTreatments] = useState([]);

  const handleAddTreatment = () => {
    const treatment = treatments.find((t) => t.label === selectedLabel);
    if (treatment) {
      setSelectedTreatments([...selectedTreatments, treatment]);
    }
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

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
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
          <ul className="list-disc pl-4">
            {selectedTreatments.map((t, i) => (
              <li key={i}>{t.label}</li>
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
                {material}: {total.toFixed(2)}{" "}
                {materialUnits[material] || "kvd"}
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
    </div>
  );
}
