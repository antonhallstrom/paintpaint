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

const preTreatments = [
  {
    label: "0 = Ingen förbehandling",
    treatments: [],
    dryingTime: 0, // Ingen torktid behövs
    tools: [], // Inga verktyg behövs
  },
  {
    label:
      "1 = Rengöringsgrad 1 (Nertagning / Nerskrapning av tidigare ytmaterial)",
    treatments: [
      {
        times: 1,
        treatment: "spackel",
        materialConsumption: 0.25, // Materialåtgång per kvadratmeter
        materialConsumptionUnit: "kvd",
        material: "spackel",
      },
    ],
    dryingTime: 4, // Torktid i timmar för spackel
    tools: ["spackelspade", "skrapa", "handskar"], // Verktyg för nerskrapning
  },
  {
    label: "2 = Rengöringsgrad 2 (Tvättning, Uppskrapning)",
    treatments: [
      {
        times: 1,
        treatment: "tvättmedel",
        materialConsumption: 0.15, // Materialåtgång per kvadratmeter
        materialConsumptionUnit: "kvd",
        material: "tvättmedel",
      },
      {
        times: 1,
        treatment: "spackel",
        materialConsumption: 0.2, // Materialåtgång per kvadratmeter
        materialConsumptionUnit: "kvd",
        material: "spackel",
      },
    ],
    dryingTime: 6, // Torktid i timmar för spackel
    tools: ["tvättsvamp", "handskar", "spackelspade", "skrapa"], // Verktyg för tvättning och uppskrapning
  },
  {
    label: "3 = Rengöringsgrad 3 (Tvättning)",
    treatments: [
      {
        times: 1,
        treatment: "tvättmedel",
        materialConsumption: 0.1, // Materialåtgång per kvadratmeter
        materialConsumptionUnit: "kvd",
        material: "tvättmedel",
      },
    ],
    dryingTime: 4, // Torktid i timmar för tvättmedel
    tools: ["tvättsvamp", "handskar"], // Verktyg för tvättning
  },
  {
    label: "4 = Fri",
    treatments: [],
    dryingTime: 0, // Ingen torktid behövs
    tools: [], // Inga verktyg behövs
  },
  {
    label: "5 = Fri",
    treatments: [],
    dryingTime: 0, // Ingen torktid behövs
    tools: [], // Inga verktyg behövs
  },
  {
    label: "6 = Fri",
    treatments: [],
    dryingTime: 0, // Ingen torktid behövs
    tools: [], // Inga verktyg behövs
  },
  {
    label: "7 = Fri",
    treatments: [],
    dryingTime: 0, // Ingen torktid behövs
    tools: [], // Inga verktyg behövs
  },
  {
    label: "8 = Fri",
    treatments: [],
    dryingTime: 0, // Ingen torktid behövs
    tools: [], // Inga verktyg behövs
  },
  {
    label: "9 = Fri",
    treatments: [],
    dryingTime: 0, // Ingen torktid behövs
    tools: [], // Inga verktyg behövs
  },
];

const underTreatments = [
  {
    label: "00 = Ingen underbehandling",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    label: "01 = Kridering",
    treatments: [
      {
        times: 1,
        treatment: "krideringslimfärg",
        materialConsumption: 0.25,
        materialConsumptionUnit: "kvd",
        material: "krideringslimfärg",
      },
    ],
    dryingTime: 8,
    tools: ["pensel", "roller"],
  },
  {
    label: "02 = Inklistring, makulering/vävspänning",
    treatments: [
      {
        times: 1,
        treatment: "makulering",
        materialConsumption: 0.15,
        materialConsumptionUnit: "kvd",
        material: "makulering",
      },
    ],
    dryingTime: 6,
    tools: ["pensel", "väv", "spännverktyg"],
  },
  {
    label: "03 = Kittning eller gipslagning",
    treatments: [
      {
        times: 1,
        treatment: "gips",
        materialConsumption: 0.3,
        materialConsumptionUnit: "kvd",
        material: "gips",
      },
    ],
    dryingTime: 12,
    tools: ["spackelspade", "gips"],
  },
  {
    label: "04 = 1 gg ispackling (småhål)",
    treatments: [
      {
        times: 1,
        treatment: "ispackel",
        materialConsumption: 0.2,
        materialConsumptionUnit: "kvd",
        material: "ispackel",
      },
    ],
    dryingTime: 4,
    tools: ["spackelspade", "handskar"],
  },
  {
    label: "05 = i- och påspackling (småhål)",
    treatments: [
      {
        times: 1,
        treatment: "påspackel",
        materialConsumption: 0.15,
        materialConsumptionUnit: "kvd",
        material: "påspackel",
      },
    ],
    dryingTime: 5,
    tools: ["spackelspade", "handskar"],
  },
  {
    label: "06 = 1 gg skarvspackling",
    treatments: [
      {
        times: 1,
        treatment: "skarvspackel",
        materialConsumption: 0.25,
        materialConsumptionUnit: "kvd",
        material: "skarvspackel",
      },
    ],
    dryingTime: 6,
    tools: ["spackelspade", "handskar"],
  },
  {
    label: "07 = i- och skarvspackling",
    treatments: [
      {
        times: 1,
        treatment: "skarvspackel",
        materialConsumption: 0.2,
        materialConsumptionUnit: "kvd",
        material: "skarvspackel",
      },
      {
        times: 1,
        treatment: "påspackel",
        materialConsumption: 0.1,
        materialConsumptionUnit: "kvd",
        material: "påspackel",
      },
    ],
    dryingTime: 8,
    tools: ["spackelspade", "handskar"],
  },
  {
    label: "08 = i- och påspackling, 2 ggr skarvspackling",
    treatments: [
      {
        times: 1,
        treatment: "skarvspackel",
        materialConsumption: 0.2,
        materialConsumptionUnit: "kvd",
        material: "skarvspackel",
      },
      {
        times: 2,
        treatment: "påspackel",
        materialConsumption: 0.1,
        materialConsumptionUnit: "kvd",
        material: "påspackel",
      },
    ],
    dryingTime: 10,
    tools: ["spackelspade", "handskar"],
  },
  {
    label: "09 = 2 ggr skarvspackling",
    treatments: [
      {
        times: 2,
        treatment: "skarvspackel",
        materialConsumption: 0.25,
        materialConsumptionUnit: "kvd",
        material: "skarvspackel",
      },
    ],
    dryingTime: 12,
    tools: ["spackelspade", "handskar"],
  },
  {
    label: "10 = 1 gg bredspackling",
    treatments: [
      {
        times: 1,
        treatment: "bredspackel",
        materialConsumption: 0.3,
        materialConsumptionUnit: "kvd",
        material: "bredspackel",
      },
    ],
    dryingTime: 8,
    tools: ["spackelspade", "spackelrulle"],
  },
  {
    label: "11 = 1 gg ispackling, 1 gg bredspackling",
    treatments: [
      {
        times: 1,
        treatment: "ispackel",
        materialConsumption: 0.2,
        materialConsumptionUnit: "kvd",
        material: "ispackel",
      },
      {
        times: 1,
        treatment: "bredspackel",
        materialConsumption: 0.25,
        materialConsumptionUnit: "kvd",
        material: "bredspackel",
      },
    ],
    dryingTime: 12,
    tools: ["spackelspade", "spackelrulle", "handskar"],
  },
  {
    label: "12 = 1 gg skarvspackling, 1 gg bredspackling",
    treatments: [
      {
        times: 1,
        treatment: "skarvspackel",
        materialConsumption: 0.25,
        materialConsumptionUnit: "kvd",
        material: "skarvspackel",
      },
      {
        times: 1,
        treatment: "bredspackel",
        materialConsumption: 0.3,
        materialConsumptionUnit: "kvd",
        material: "bredspackel",
      },
    ],
    dryingTime: 12,
    tools: ["spackelspade", "spackelrulle", "handskar"],
  },
  {
    label: "13 = i- och skarvspackling, 1 gg bredspackling",
    treatments: [
      {
        times: 1,
        treatment: "skarvspackel",
        materialConsumption: 0.2,
        materialConsumptionUnit: "kvd",
        material: "skarvspackel",
      },
      {
        times: 1,
        treatment: "påspackel",
        materialConsumption: 0.1,
        materialConsumptionUnit: "kvd",
        material: "påspackel",
      },
      {
        times: 1,
        treatment: "bredspackel",
        materialConsumption: 0.25,
        materialConsumptionUnit: "kvd",
        material: "bredspackel",
      },
    ],
    dryingTime: 14,
    tools: ["spackelspade", "spackelrulle", "handskar"],
  },
  {
    label: "14 = Fri",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    label: "15 = 2 ggr bredspackling",
    treatments: [
      {
        times: 2,
        treatment: "bredspackel",
        materialConsumption: 0.3,
        materialConsumptionUnit: "kvd",
        material: "bredspackel",
      },
    ],
    dryingTime: 16,
    tools: ["spackelspade", "spackelrulle"],
  },
  {
    label: "16 = 1 gg ispackling, 2 ggr bredspackling",
    treatments: [
      {
        times: 1,
        treatment: "ispackel",
        materialConsumption: 0.2,
        materialConsumptionUnit: "kvd",
        material: "ispackel",
      },
      {
        times: 2,
        treatment: "bredspackel",
        materialConsumption: 0.25,
        materialConsumptionUnit: "kvd",
        material: "bredspackel",
      },
    ],
    dryingTime: 18,
    tools: ["spackelspade", "spackelrulle", "handskar"],
  },
  {
    label: "17 = 1 gg skarvspackling, 2 ggr bredspackling",
    treatments: [
      {
        times: 1,
        treatment: "skarvspackel",
        materialConsumption: 0.25,
        materialConsumptionUnit: "kvd",
        material: "skarvspackel",
      },
      {
        times: 2,
        treatment: "bredspackel",
        materialConsumption: 0.3,
        materialConsumptionUnit: "kvd",
        material: "bredspackel",
      },
    ],
    dryingTime: 18,
    tools: ["spackelspade", "spackelrulle", "handskar"],
  },
  {
    label: "18 = i- och skarvspackling, 2 ggr bredspackling",
    treatments: [
      {
        times: 1,
        treatment: "skarvspackel",
        materialConsumption: 0.2,
        materialConsumptionUnit: "kvd",
        material: "skarvspackel",
      },
      {
        times: 1,
        treatment: "påspackel",
        materialConsumption: 0.1,
        materialConsumptionUnit: "kvd",
        material: "påspackel",
      },
      {
        times: 2,
        treatment: "bredspackel",
        materialConsumption: 0.25,
        materialConsumptionUnit: "kvd",
        material: "bredspackel",
      },
    ],
    dryingTime: 20,
    tools: ["spackelspade", "spackelrulle", "handskar"],
  },
  {
    label: "19 = i- och påspackling, 2 ggr skarvspackling, 1 gg bredspackling",
    treatments: [
      {
        times: 1,
        treatment: "skarvspackel",
        materialConsumption: 0.25,
        materialConsumptionUnit: "kvd",
        material: "skarvspackel",
      },
      {
        times: 2,
        treatment: "påspackel",
        materialConsumption: 0.15,
        materialConsumptionUnit: "kvd",
        material: "påspackel",
      },
      {
        times: 1,
        treatment: "bredspackel",
        materialConsumption: 0.3,
        materialConsumptionUnit: "kvd",
        material: "bredspackel",
      },
    ],
    dryingTime: 22,
    tools: ["spackelspade", "spackelrulle", "handskar"],
  },
  {
    label: "20 = 3 ggr bredspackling",
    treatments: [
      {
        times: 3,
        treatment: "bredspackel",
        materialConsumption: 0.3,
        materialConsumptionUnit: "kvd",
        material: "bredspackel",
      },
    ],
    dryingTime: 24,
    tools: ["spackelspade", "spackelrulle"],
  },
  {
    label: "21 = 1 gg ispackling, 3 ggr bredspackling",
    treatments: [
      {
        times: 1,
        treatment: "ispackel",
        materialConsumption: 0.2,
        materialConsumptionUnit: "kvd",
        material: "ispackel",
      },
      {
        times: 3,
        treatment: "bredspackel",
        materialConsumption: 0.25,
        materialConsumptionUnit: "kvd",
        material: "bredspackel",
      },
    ],
    dryingTime: 26,
    tools: ["spackelspade", "spackelrulle", "handskar"],
  },
  {
    label: "22 = 1 gg skarvspackling, 3 ggr bredspackling",
    treatments: [
      {
        times: 1,
        treatment: "skarvspackel",
        materialConsumption: 0.25,
        materialConsumptionUnit: "kvd",
        material: "skarvspackel",
      },
      {
        times: 3,
        treatment: "bredspackel",
        materialConsumption: 0.3,
        materialConsumptionUnit: "kvd",
        material: "bredspackel",
      },
    ],
    dryingTime: 28,
    tools: ["spackelspade", "spackelrulle", "handskar"],
  },
  {
    label: "23 = i- och skarvspackling, 3 ggr bredspackling",
    treatments: [
      {
        times: 1,
        treatment: "skarvspackel",
        materialConsumption: 0.2,
        materialConsumptionUnit: "kvd",
        material: "skarvspackel",
      },
      {
        times: 1,
        treatment: "påspackel",
        materialConsumption: 0.1,
        materialConsumptionUnit: "kvd",
        material: "påspackel",
      },
      {
        times: 3,
        treatment: "bredspackel",
        materialConsumption: 0.25,
        materialConsumptionUnit: "kvd",
        material: "bredspackel",
      },
    ],
    dryingTime: 30,
    tools: ["spackelspade", "spackelrulle", "handskar"],
  },
  {
    label: "24 = Spackling spik- och/eller skruvhål",
    treatments: [
      {
        times: 1,
        treatment: "spackel",
        materialConsumption: 0.1,
        materialConsumptionUnit: "kvd",
        material: "spackel",
      },
    ],
    dryingTime: 4,
    tools: ["spackelspade"],
  },
  {
    label: "25 = 2 ggr spackling spik- och skruvhål",
    treatments: [
      {
        times: 2,
        treatment: "spackel",
        materialConsumption: 0.1,
        materialConsumptionUnit: "kvd",
        material: "spackel",
      },
    ],
    dryingTime: 8,
    tools: ["spackelspade"],
  },
  {
    label: "26 = Spackling spik- och/eller skruvhål, 1 gg skarvspackling",
    treatments: [
      {
        times: 1,
        treatment: "spackel",
        materialConsumption: 0.1,
        materialConsumptionUnit: "kvd",
        material: "spackel",
      },
      {
        times: 1,
        treatment: "skarvspackel",
        materialConsumption: 0.25,
        materialConsumptionUnit: "kvd",
        material: "skarvspackel",
      },
    ],
    dryingTime: 8,
    tools: ["spackelspade", "handskar"],
  },
];

const finishTreatments = [
  {
    label: "00 = Ingen färdigbehandling",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    label: "01 = Tvättning för gott",
    treatments: [
      {
        times: 1,
        treatment: "tvättning",
        materialConsumption: 0.05,
        materialConsumptionUnit: "kvd",
        material: "tvättmedel",
      },
    ],
    dryingTime: 2,
    tools: ["tvättborste", "vattenslang"],
  },
  {
    label: "02 = Uppsättning tapet",
    treatments: [
      {
        times: 1,
        treatment: "tapetuppsättning",
        materialConsumption: 1.0,
        materialConsumptionUnit: "rulle",
        material: "tapet",
      },
    ],
    dryingTime: 12,
    tools: ["tapetbord", "tapetklister", "tapetborste"],
  },
  {
    label: "03 = Kantlimning, uppsättning tapet",
    treatments: [
      {
        times: 1,
        treatment: "kantlimning",
        materialConsumption: 0.1,
        materialConsumptionUnit: "kvd",
        material: "lim",
      },
      {
        times: 1,
        treatment: "tapetuppsättning",
        materialConsumption: 0.9,
        materialConsumptionUnit: "rulle",
        material: "tapet",
      },
    ],
    dryingTime: 12,
    tools: ["tapetbord", "tapetklister", "tapetborste", "pensel"],
  },
  {
    label: "04 = Limning, uppsättning tapet",
    treatments: [
      {
        times: 1,
        treatment: "tapetklister",
        materialConsumption: 0.2,
        materialConsumptionUnit: "kvd",
        material: "tapetklister",
      },
      {
        times: 1,
        treatment: "tapetuppsättning",
        materialConsumption: 0.8,
        materialConsumptionUnit: "rulle",
        material: "tapet",
      },
    ],
    dryingTime: 12,
    tools: ["tapetbord", "tapetklister", "tapetborste"],
  },
  {
    label: "05 = 1 gg grundning, uppsättning tapet",
    treatments: [
      {
        times: 1,
        treatment: "grundning",
        materialConsumption: 0.2,
        materialConsumptionUnit: "kvd",
        material: "grundfärg",
      },
      {
        times: 1,
        treatment: "tapetuppsättning",
        materialConsumption: 0.8,
        materialConsumptionUnit: "rulle",
        material: "tapet",
      },
    ],
    dryingTime: 18,
    tools: ["roller", "pensel", "tapetklister"],
  },
  {
    label: "06 = 1 gg strykning, uppsättning tapet",
    treatments: [
      {
        times: 1,
        treatment: "strykning",
        materialConsumption: 0.3,
        materialConsumptionUnit: "kvd",
        material: "färg",
      },
      {
        times: 1,
        treatment: "tapetuppsättning",
        materialConsumption: 0.7,
        materialConsumptionUnit: "rulle",
        material: "tapet",
      },
    ],
    dryingTime: 14,
    tools: ["roller", "pensel", "tapetklister"],
  },
  {
    label: "07 = Grängning",
    treatments: [
      {
        times: 1,
        treatment: "grängning",
        materialConsumption: 0.1,
        materialConsumptionUnit: "kvd",
        material: "grängningsfärg",
      },
    ],
    dryingTime: 6,
    tools: ["roller", "pensel"],
  },
  {
    label: "08 = 1 gg strykning",
    treatments: [
      {
        times: 1,
        treatment: "strykning",
        materialConsumption: 0.3,
        materialConsumptionUnit: "kvd",
        material: "färg",
      },
    ],
    dryingTime: 6,
    tools: ["roller", "pensel"],
  },
  {
    label: "09 = 1 gg påbättring, 1 gg strykning",
    treatments: [
      {
        times: 1,
        treatment: "påbättring",
        materialConsumption: 0.1,
        materialConsumptionUnit: "kvd",
        material: "färg",
      },
      {
        times: 1,
        treatment: "strykning",
        materialConsumption: 0.3,
        materialConsumptionUnit: "kvd",
        material: "färg",
      },
    ],
    dryingTime: 12,
    tools: ["roller", "pensel"],
  },
  {
    label: "10 = 2 ggr strykning",
    treatments: [
      {
        times: 2,
        treatment: "strykning",
        materialConsumption: 0.3,
        materialConsumptionUnit: "kvd",
        material: "färg",
      },
    ],
    dryingTime: 14,
    tools: ["roller", "pensel"],
  },
  {
    label: "11 = 1gg påbättring, 2 ggr strykning",
    treatments: [
      {
        times: 1,
        treatment: "påbättring",
        materialConsumption: 0.15,
        materialConsumptionUnit: "kvd",
        material: "färg",
      },
      {
        times: 2,
        treatment: "strykning",
        materialConsumption: 0.3,
        materialConsumptionUnit: "kvd",
        material: "färg",
      },
    ],
    dryingTime: 16,
    tools: ["roller", "pensel"],
  },
  {
    label: "12 = 1 gg grundning, 2 ggr strykning",
    treatments: [
      {
        times: 1,
        treatment: "grundning",
        materialConsumption: 0.25,
        materialConsumptionUnit: "kvd",
        material: "grundfärg",
      },
      {
        times: 2,
        treatment: "strykning",
        materialConsumption: 0.3,
        materialConsumptionUnit: "kvd",
        material: "färg",
      },
    ],
    dryingTime: 18,
    tools: ["roller", "pensel", "grundfärg"],
  },
  {
    label: "13 = 3 ggr strykning",
    treatments: [
      {
        times: 3,
        treatment: "strykning",
        materialConsumption: 0.3,
        materialConsumptionUnit: "kvd",
        material: "färg",
      },
    ],
    dryingTime: 18,
    tools: ["roller", "pensel"],
  },
  {
    label:
      "14 = 1 gg strykning, 1 gg ispackling (finspackling), 1 gg påbättring, 1 gg strykning",
    treatments: [
      {
        times: 1,
        treatment: "strykning",
        materialConsumption: 0.3,
        materialConsumptionUnit: "kvd",
        material: "färg",
      },
      {
        times: 1,
        treatment: "ispackling",
        materialConsumption: 0.2,
        materialConsumptionUnit: "kvd",
        material: "finspackel",
      },
      {
        times: 1,
        treatment: "påbättring",
        materialConsumption: 0.1,
        materialConsumptionUnit: "kvd",
        material: "färg",
      },
      {
        times: 1,
        treatment: "strykning",
        materialConsumption: 0.3,
        materialConsumptionUnit: "kvd",
        material: "färg",
      },
    ],
    dryingTime: 20,
    tools: ["roller", "spackelspade", "pensel"],
  },
  {
    label:
      "15 = 1 gg strykning, 1 gg ispackling (finspackling), 2 ggr strykning",
    treatments: [
      {
        times: 1,
        treatment: "strykning",
        materialConsumption: 0.3,
        materialConsumptionUnit: "kvd",
        material: "färg",
      },
      {
        times: 1,
        treatment: "ispackling",
        materialConsumption: 0.2,
        materialConsumptionUnit: "kvd",
        material: "finspackel",
      },
      {
        times: 2,
        treatment: "strykning",
        materialConsumption: 0.3,
        materialConsumptionUnit: "kvd",
        material: "färg",
      },
    ],
    dryingTime: 22,
    tools: ["roller", "spackelspade", "pensel"],
  },
  {
    label:
      "16 = 1 gg strykning, 1 gg bredspackling (finbredspackling), 2 ggr strykning",
    treatments: [
      {
        times: 1,
        treatment: "strykning",
        materialConsumption: 0.3,
        materialConsumptionUnit: "kvd",
        material: "färg",
      },
      {
        times: 1,
        treatment: "bredspackling",
        materialConsumption: 0.2,
        materialConsumptionUnit: "kvd",
        material: "finbredspackel",
      },
      {
        times: 2,
        treatment: "strykning",
        materialConsumption: 0.3,
        materialConsumptionUnit: "kvd",
        material: "färg",
      },
    ],
    dryingTime: 22,
    tools: ["roller", "spackelspade", "pensel"],
  },
  {
    label:
      "17 = Vattenslipning, 1 gg strykning, 1 gg bredspackling (finbredspackling), 2 ggr strykning",
    treatments: [
      {
        times: 1,
        treatment: "vattenslipning",
        materialConsumption: 0.1,
        materialConsumptionUnit: "kvd",
        material: "vattenslip",
      },
      {
        times: 1,
        treatment: "strykning",
        materialConsumption: 0.3,
        materialConsumptionUnit: "kvd",
        material: "färg",
      },
      {
        times: 1,
        treatment: "bredspackling",
        materialConsumption: 0.2,
        materialConsumptionUnit: "kvd",
        material: "finbredspackel",
      },
      {
        times: 2,
        treatment: "strykning",
        materialConsumption: 0.3,
        materialConsumptionUnit: "kvd",
        material: "färg",
      },
    ],
    dryingTime: 24,
    tools: ["vattenslip", "roller", "spackelspade", "pensel"],
  },
  {
    label: "18 = Vävklistring, 1 gg strykning",
    treatments: [
      {
        times: 1,
        treatment: "vävklistring",
        materialConsumption: 0.2,
        materialConsumptionUnit: "kvd",
        material: "vävklister",
      },
      {
        times: 1,
        treatment: "strykning",
        materialConsumption: 0.3,
        materialConsumptionUnit: "kvd",
        material: "färg",
      },
    ],
    dryingTime: 14,
    tools: ["vävklister", "roller", "pensel"],
  },
  {
    label: "19 = Vävklistring, 2 ggr strykning",
    treatments: [
      {
        times: 1,
        treatment: "vävklistring",
        materialConsumption: 0.2,
        materialConsumptionUnit: "kvd",
        material: "vävklister",
      },
      {
        times: 2,
        treatment: "strykning",
        materialConsumption: 0.3,
        materialConsumptionUnit: "kvd",
        material: "färg",
      },
    ],
    dryingTime: 16,
    tools: ["vävklister", "roller", "pensel"],
  },
  {
    label: "20 = Vävklistring, 1 gg grundning, 2 ggr strykning",
    treatments: [
      {
        times: 1,
        treatment: "vävklistring",
        materialConsumption: 0.2,
        materialConsumptionUnit: "kvd",
        material: "vävklister",
      },
      {
        times: 1,
        treatment: "grundning",
        materialConsumption: 0.25,
        materialConsumptionUnit: "kvd",
        material: "grundfärg",
      },
      {
        times: 2,
        treatment: "strykning",
        materialConsumption: 0.3,
        materialConsumptionUnit: "kvd",
        material: "färg",
      },
    ],
    dryingTime: 18,
    tools: ["vävklister", "roller", "pensel", "grundfärg"],
  },
  {
    label: "21 = Vävklistring, 1 gg bredspackling, 2 ggr strykning",
    treatments: [
      {
        times: 1,
        treatment: "vävklistring",
        materialConsumption: 0.2,
        materialConsumptionUnit: "kvd",
        material: "vävklister",
      },
      {
        times: 1,
        treatment: "bredspackling",
        materialConsumption: 0.2,
        materialConsumptionUnit: "kvd",
        material: "finbredspackel",
      },
      {
        times: 2,
        treatment: "strykning",
        materialConsumption: 0.3,
        materialConsumptionUnit: "kvd",
        material: "färg",
      },
    ],
    dryingTime: 20,
    tools: ["vävklister", "roller", "spackelspade", "pensel"],
  },
];

export default function TreatmentCalculator({ projectId, surfaceId }) {
  const [comments, setComments] = useState({});
  const [area, setArea] = useState(0);
  const [height, setHeight] = useState(2.5); // Standard takhöjd
  const [rollWidth, setRollWidth] = useState(0.53); // Default bredd på tapetrulle (m)
  const [rollLength, setRollLength] = useState(10.05); // Default längd på tapetrulle (m)
  const [patternMatching, setPatternMatching] = useState(0); // Spill för mönsterpassning (m)
  const [selectedTreatments, setSelectedTreatments] = useState([]);
  const [treatmentHours, setTreatmentHours] = useState({});
  const [completedTreatments, setCompletedTreatments] = useState({});
  const [dryingTimes, setDryingTimes] = useState({});
  const [selectedPre, setSelectedPre] = useState<string>("");
  const [selectedUnder, setSelectedUnder] = useState<string>("");
  const [selectedFinish, setSelectedFinish] = useState<string>("");

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

  const handleAddTreatment = (type: "pre" | "under" | "finish") => {
    let treatment;
    let source;

    // Välj rätt array baserat på typ
    switch (type) {
      case "pre":
        treatment = preTreatments.find((t) => t.label === selectedPre);
        source = preTreatments;
        break;
      case "under":
        treatment = underTreatments.find((t) => t.label === selectedUnder);
        source = underTreatments;
        break;
      case "finish":
        treatment = finishTreatments.find((t) => t.label === selectedFinish);
        source = finishTreatments;
        break;
      default:
        return;
    }

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

  const handleCommentChange = (treatmentId, comment) => {
    setComments((prevComments) => ({
      ...prevComments,
      [treatmentId]: comment,
    }));
  };

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
          <div className="grid gap-6">
            {/* Förbehandling */}
            <div className="grid gap-2">
              <Label>Välj förbehandling</Label>
              <Select onValueChange={setSelectedPre}>
                <SelectTrigger>
                  <SelectValue placeholder="Välj förbehandling" />
                </SelectTrigger>
                <SelectContent>
                  {preTreatments.map((t) => (
                    <SelectItem key={t.label} value={t.label}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                className="inline-flex items-center"
                onClick={() => handleAddTreatment("pre")}
              >
                Lägg till behandling
              </Button>
            </div>

            {/* Underbehandling */}
            <div className="grid gap-2">
              <Label>Välj underbehandling</Label>
              <Select onValueChange={setSelectedUnder}>
                <SelectTrigger>
                  <SelectValue placeholder="Välj underbehandling" />
                </SelectTrigger>
                <SelectContent>
                  {underTreatments.map((t) => (
                    <SelectItem key={t.label} value={t.label}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                className="inline-flex items-center"
                onClick={() => handleAddTreatment("under")}
              >
                Lägg till behandling
              </Button>
            </div>

            {/* Färdigbehandling */}
            <div className="grid gap-2">
              <Label>Välj färdigbehandling</Label>
              <Select onValueChange={setSelectedFinish}>
                <SelectTrigger>
                  <SelectValue placeholder="Välj färdigbehandling" />
                </SelectTrigger>
                <SelectContent>
                  {finishTreatments.map((t) => (
                    <SelectItem key={t.label} value={t.label}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                className="inline-flex items-center"
                onClick={() => handleAddTreatment("finish")}
              >
                Lägg till behandling
              </Button>
            </div>
          </div>
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
                    value={treatmentHours[t.id]}
                    onChange={(e) =>
                      setTreatmentHours({
                        ...treatmentHours,
                        [t.id]: Number(e.target.value),
                      })
                    }
                  />
                </div>
                {/* Kommentarfält */}
                <div className="mt-4">
                  <Label>Kommentar</Label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows="3"
                    value={comments[t.id] || ""}
                    onChange={(e) => handleCommentChange(t.id, e.target.value)}
                    placeholder="Skriv en kommentar..."
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
