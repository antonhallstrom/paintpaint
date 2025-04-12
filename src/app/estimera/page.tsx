/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Home } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const preTreatments = [
  {
    code: "0",
    label: "0 = Ingen förbehandling",
    treatments: [],
    dryingTime: 0, // Ingen torktid behövs
    tools: [], // Inga verktyg behövs
  },
  {
    code: "1",
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
    code: "2",
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
    code: "3",
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
    code: "4",
    label: "4 = Fri",
    treatments: [],
    dryingTime: 0, // Ingen torktid behövs
    tools: [], // Inga verktyg behövs
  },
  {
    code: "5",
    label: "5 = Fri",
    treatments: [],
    dryingTime: 0, // Ingen torktid behövs
    tools: [], // Inga verktyg behövs
  },
  {
    code: "6",
    label: "6 = Fri",
    treatments: [],
    dryingTime: 0, // Ingen torktid behövs
    tools: [], // Inga verktyg behövs
  },
  {
    code: "7",
    label: "7 = Fri",
    treatments: [],
    dryingTime: 0, // Ingen torktid behövs
    tools: [], // Inga verktyg behövs
  },
  {
    code: "8",
    label: "8 = Fri",
    treatments: [],
    dryingTime: 0, // Ingen torktid behövs
    tools: [], // Inga verktyg behövs
  },
  {
    code: "9",
    label: "9 = Fri",
    treatments: [],
    dryingTime: 0, // Ingen torktid behövs
    tools: [], // Inga verktyg behövs
  },
];

const underTreatments = [
  {
    code: "00",
    label: "00 = Ingen underbehandling",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  { code: "01", label: "01 = Kridering" },
  {
    code: "02",
    label: "02 = Inklistring, makulering/vävspänning",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "03",
    label: "03 = Kittning eller gipslagning",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "04",
    label: "04 = 1 gg ispackling (småhål)",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "05",
    label: "05 = i- och påspackling (småhål)",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "06",
    label: "06 = 1 gg skarvspackling",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "07",
    label: "07 = i- och skarvspackling",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "08",
    label: "08 = i- och påspackling, 2 ggr skarvspackling",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "09",
    label: "09 = 2 ggr skarvspackling",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "10",
    label: "10 = 1 gg bredspackling",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "11",
    label: "11 = 1 gg ispackling, 1 gg bredspackling",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "12",
    label: "12 = 1 gg skarvspackling, 1 gg bredspackling",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "13",
    label: "13 = i- och skarvspackling, 1 gg bredspackling",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "14",
    label: "14 = Fri (saknar åtgärd)",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "15",
    label: "15 = 2 ggr bredspackling",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "16",
    label: "16 = 1 gg ispackling, 2 ggr bredspackling",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "17",
    label: "17 = 1gg skarvspackling, 2 ggr bredspackling",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "18",
    label: "18 = i- och skarvspackling, 2 ggr bredspackling",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "19",
    label: "19 = i- och påspackling, 2 ggr skarvspackling, 1 gg bredspackling",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "20",
    label: "20 = 3 ggr bredspackling",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "21",
    label: "21 = 1 gg ispackling, 3 ggr bredspackling",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "22",
    label: "22 = 1 gg skarvspackling, 3 ggr bredspackling",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "23",
    label: "23 = i- och skarvspackling, 3 ggr bredspackling",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "24",
    label: "24 = Spackling spik- och/eller skruvhål",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "25",
    label: "25 = 2 ggr spackling spik- och skruvhål",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "26",
    label: "26 = Spackling spik- och/eller skruvhål, 1 gg skarvspackling",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "27",
    label: "27 = Spackling spik- och/eller skruvhål, 2 ggr skarvspackling",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "28",
    label:
      "28 = 2 ggr spackling spik- och/eller skruvhål, 2 ggr skarvspackling",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "29",
    label: "29 = Spackling spik- och/eller skruvhål, 1 gg iläggning skarvremsa",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "30",
    label: "30 = 1 gg iläggning skarvremsa, 1 gg skarvspackling",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "31",
    label: "31 = 1 gg iläggning skarvremsa, 2 ggr skarvspackling",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "32",
    label:
      "32 = Spackling spik- och/eller skruvhål, 1 gg iläggning skarvremsa, 1 gg skarvspackling",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "33",
    label:
      "33 = Spackling spik- och/eller skruvhål, 1 gg iläggning skarvremsa, 2 ggr skarvspackling",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "34",
    label:
      "34 = 2 ggr spackling spik- och/eller skruvhål, 1 gg iläggning skarvremsa, 1 gg skarvspackling",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "35",
    label:
      "35 = 2 ggr spackling spik- och/eller skruvhål, 1 gg iläggning skarvremsa, 2 ggr skarvspackling",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "36",
    label: "36 = Skarvspackling, 2 ggr iläggning remsa, 1 gg skarvspackling",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "37",
    label:
      "37 = Spackling spik- och/eller skruvhål, skarvspackling, 2 ggr iläggning remsa, skarvspackling",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "38",
    label:
      "38 = Spackling spik- och/eller skruvhål, 1 gg skarvspackling, 2 ggr iläggning remsa, 2 ggr skarvspackling",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "39",
    label:
      "39 = 2 ggr spackling spik- och/eller skruvhål, 1 gg skarvspackling, 2 ggr iläggning skarvremsa, 1 gg skarvspackling",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "40",
    label:
      "40 = 2 ggr spackling spik- och/eller skruvhål, 1 gg skarvspackling, 2 ggr iläggning remsa, 2 ggr skarvspackling",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "41",
    label:
      "41 = Spackling spik- och/eller skruvhål, 1 gg skarvspackling, 1 gg bredspackling",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "42",
    label:
      "42 = Spackling spik- och/eller skruvhål, 1 gg iläggning skarvremsa, 1 gg bredspackling",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "43",
    label:
      "43 = Spackling spik- och/eller skruvhål, 1 gg iläggning skarvremsa, 1 gg skarvspackling, 1 gg bredspackling",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  { code: "44", label: "44 = Oljning" },
  { code: "45", label: "45 = Grundning" },
  {
    code: "46",
    label: "46 = Oljning och Grundning",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "47",
    label: "47 = Grundning eller oljning samt kittning",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "48",
    label: "48 = Grundning, ispackling",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "49",
    label: "49 = Grundning, i och påspackling",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "50",
    label: "50 = Grundning, bredspackling",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "51",
    label: "51 = Grundning, ispackling, bredspackling",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "52",
    label: "52 = Grundning, 2 ggr bredspackling",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  { code: "53", label: "53 = Pågrundning" },
  {
    code: "54",
    label: "54 = Pågrundning, kittning eller gipslagning",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "55",
    label: "55 = Pågrundning, ispackling",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "56",
    label: "56 = Pågrundning, i- och påspackling",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "57",
    label: "57 = Fri (saknar åtgärd)",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "58",
    label: "58 = Fri (saknar åtgärd)",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "59",
    label: "59 = Fri (saknar åtgärd)",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "60",
    label: "60 = Fri (saknar åtgärd)",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "61",
    label: "61 = Fri (saknar åtgärd)",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "62",
    label: "62 = Fri (saknar åtgärd)",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "63",
    label: "63 = Fri (saknar åtgärd)",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "64",
    label: "64 = Fri (saknar åtgärd)",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  { code: "65", label: "65 = Lasering" },
  { code: "66", label: "66 = Betsning" },
  {
    code: "67",
    label: "67 = Kittning, lasering",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "68",
    label: "68 = Oljning, kittning, lasering",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "69",
    label: "69 = Fri (saknar åtgärd)",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "70",
    label: "70 = Fri (saknar åtgärd)",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "71",
    label: "71 = Fri (saknar åtgärd)",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "72",
    label: "72 = Fri (saknar åtgärd)",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "73",
    label: "73 = Spänning av väv, inklistring, makulering",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "74",
    label: "74 = Spänning av väv, inklistring, makulering, limning",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "75",
    label: "75 = Fri (saknar åtgärd)",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "76",
    label: "76 = Fri (saknar åtgärd)",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "77",
    label: "77 = Fri (saknar åtgärd)",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "78",
    label: "78 = Nedslipning och utspackling av skarvar och kanter",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "79",
    label: "79 = Utspackling eller utspackling av skarvar och kanter",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "80",
    label:
      "80 = Utspackling eller utspackling av skarvar och kanter, bredspackling",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "81",
    label:
      "81 = Utspackling eller utspackling av skarvar och kanter, 2ggr bredspackling",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "82",
    label:
      "82 = Utspackling eller utspackling av skarvar och kanter, grundning, bredspackling",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "83",
    label:
      "83 = Utspackling eller utspackling av skarvar och kanter, grundning, 2ggr bredspackling",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "84",
    label: "84 = Fri (saknar åtgärd)",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "85",
    label: "85 = Fri (saknar åtgärd)",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "86",
    label: "86 = Fri (saknar åtgärd)",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "87",
    label: "87 = Fri (saknar åtgärd)",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "88",
    label: "88 = Fri (saknar åtgärd)",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "89",
    label: "89 = Fri (saknar åtgärd)",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "90",
    label: "90 = Fri (saknar åtgärd)",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "91",
    label: "91 = Påbättring med rostskyddsgrundfärg",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "92",
    label:
      "92 = Strykning med rostskyddsgrundsfärg till en tjocklek av minst 40μm³ torrt skikt",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "93",
    label:
      "93 = Strykning med rostskyddsgrundsfärg till en tjocklek av minst 60μm³ torrt skikt",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "94",
    label:
      "94 = Strykning med rostskyddsgrundsfärg till en tjocklek av minst 80μm³ torrt skikt",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "95",
    label:
      "95 = Strykning med rostskyddsgrundsfärg till en tjocklek av minst 10μm³ torrt skikt",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "96",
    label: "96 = Fri (saknar åtgärd)",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "97",
    label: "97 = Fri (saknar åtgärd)",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "98",
    label: "98 = Fri (saknar åtgärd)",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "99",
    label: "99 = Fri (saknar åtgärd)",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
];

const finishTreatments = [
  {
    code: "00",
    label: "00 - Ingen färdigbehandling.",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "01",
    label: "01 - Tvättning för gott (tvättning).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "02",
    label: "02 - Uppsättning tapet.",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "03",
    label: "03 - Kantlimning, uppsättning tapet.",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "04",
    label: "04 - Limning, uppsättning tapet.",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "05",
    label: "05 - 1 gg grundning, uppsättning tapet.",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "06",
    label: "06 - 1 gg strykning, uppsättning tapet.",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  { code: "07", label: "07 - Grängning." },
  {
    code: "08",
    label: "08 - 1 gg strykning.",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "09",
    label: "09 - 1 gg påbättring, 1 gg strykning.",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "10",
    label: "10 - 2 ggr strykning.",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "11",
    label: "11 - 1 gg påbättring, 2 ggr strykning.",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "12",
    label: "12 - 1 gg grundning, 2 ggr strykning.",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "13",
    label: "13 - 3 ggr strykning.",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "14",
    label:
      "14 - 1 gg strykning, 1 gg ispackling (finspackling), 1 gg påbättring, 1 gg strykning.",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "15",
    label:
      "15 - 1 gg strykning, 1 gg ispackling (finspackling), 2 ggr strykning.",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "16",
    label:
      "16 - 1 gg strykning, 1 gg bredspackling (finbredspackling), 2 ggr strykning.",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "17",
    label:
      "17 - Vattenslipning, 1 gg strykning, 1 gg bredspackling (finbredspackling), 2 ggr strykning.",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "18",
    label: "18 - Vävklistring, 1 gg strykning.",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "19",
    label: "19 - Vävklistring, 2 ggr strykning.",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "20",
    label: "20 - Vävklistring, 1 gg grundning, 2 ggr strykning.",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "21",
    label: "21 - Vävklistring, 1 gg bredspackling, 2 ggr strykning.",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "22",
    label: "22 - Limning, vävklistring, 1 gg strykning.",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "23",
    label: "23 - Limning, vävklistring, 2 ggr strykning.",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "24",
    label: "24 - Limning, vävklistring, 1 gg grundning, 2 ggr strykning.",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "25",
    label: "25 - 1 gg grundning, vävklistring, 2 ggr strykning.",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "26",
    label: "26 - 1 gg grundning, vävklistring, 3 ggr strykning.",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "27",
    label: "27 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "28",
    label: "28 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "29",
    label: "29 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "30",
    label: "30 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "31",
    label: "31 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "32",
    label: "32 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "33",
    label: "33 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "34",
    label: "34 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "35",
    label: "35 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "36",
    label: "36 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "37",
    label: "37 - 1 gg strykning hel yta, 1 gg strykning synlig yta.",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "38",
    label: "38 - 1 gg strykning hel yta, 2 ggr strykning synlig yta.",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "39",
    label: "39 - 1 gg strykning synlig yta.",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "40",
    label: "40 - 1 gg påbättring, 1 gg strykning synlig yta.",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "41",
    label: "41 - 2 ggr strykning synlig yta.",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  { code: "42", label: "42 - 1 gg lasering." },
  { code: "43", label: "43 - 2 ggr lasering." },
  {
    code: "44",
    label: "44 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "45",
    label: "45 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "46",
    label: "46 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "47",
    label: "47 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "48",
    label: "48 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "49",
    label: "49 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "50",
    label: "50 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "51",
    label: "51 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "52",
    label: "52 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "53",
    label: "53 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "54",
    label: "54 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "55",
    label: "55 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "56",
    label: "56 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "57",
    label: "57 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "58",
    label: "58 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "59",
    label: "59 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "60",
    label: "60 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "61",
    label: "61 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "62",
    label:
      "62 - 1 gg strykning med rostskyddstäckfärg till en tjocklek av minst 40μm³ torrt skikt.",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "63",
    label:
      "63 - 1 gg strykning med rostskyddstäckfärg till en tjocklek av minst 60μm³ torrt skikt.",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "64",
    label:
      "64 - 1 gg strykning med rostskyddstäckfärg till en tjocklek av minst 80μm³ torrt skikt.",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "65",
    label:
      "65 - 1 gg strykning med rostskyddstäckfärg till en tjocklek av minst 100μm³ torrt skikt.",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "66",
    label:
      "66 - 1 gg strykning med rostskyddstäckfärg till en tjocklek av minst 120μm³ torrt skikt.",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "67",
    label: "67 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "68",
    label: "68 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "69",
    label: "69 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "70",
    label: "70 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "71",
    label: "71 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "72",
    label: "72 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "73",
    label: "73 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "74",
    label: "74 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "75",
    label: "75 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "76",
    label: "76 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "77",
    label: "77 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "78",
    label: "78 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "79",
    label: "79 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "80",
    label: "80 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "81",
    label: "81 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "82",
    label: "82 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "83",
    label: "83 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "84",
    label: "84 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "85",
    label: "85 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "86",
    label: "86 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "87",
    label: "87 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "88",
    label: "88 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "89",
    label: "89 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "90",
    label: "90 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "91",
    label: "91 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "92",
    label: "92 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "93",
    label: "93 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "94",
    label: "94 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "95",
    label: "95 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "96",
    label: "96 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "97",
    label: "97 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "98",
    label: "98 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
  {
    code: "99",
    label: "99 - Fri (saknar åtgärd).",
    treatments: [],
    dryingTime: 0,
    tools: [],
  },
];
const TreatmentCalculator = () => {
  const [selectedPreTreatment, setSelectedPreTreatment] = useState("");
  const [selectedUnderTreatment, setSelectedUnderTreatment] = useState("");
  const [selectedFinishTreatment, setSelectedFinishTreatment] = useState("");
  const [selectedPerformedTreatment, setSelectedPerformedTreatment] =
    useState("");
  const [area, setArea] = useState(0);
  const [averageHours, setAverageHours] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [surfaces, setSurfaces] = useState<any>({});
  const [completedTreatmentOptions, setCompletedTreatmentOptions] = useState<
    { id: string; code: string; label: string; hours: number }[]
  >([]);

  const surfaceId = "3a25d811-2521-433d-a61c-a95c4d763f0a-0"; // välj rätt surface ID här

  // Hämta data från localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedSurfaces = JSON.parse(
        localStorage.getItem("surfaces") || "{}"
      );
      setSurfaces(storedSurfaces);

      const completed: {
        id: string;
        code: string;
        label: string;
        hours: number;
      }[] = [];

      // Iterera över alla ytor och deras behandlingar
      Object.values(storedSurfaces).forEach((surface: any) => {
        const {
          selectedTreatments = [],
          treatmentHours = {},
          completedTreatments = {},
        } = surface;

        // Gå igenom alla behandlingar och kolla om de är genomförda
        selectedTreatments.forEach((treatment: any) => {
          const isCompleted = completedTreatments[treatment.id] || false; // Om treatment.id finns i completedTreatments, markera den som utförd
          if (isCompleted || Object.keys(completedTreatments).length === 0) {
            // Lägg till behandlingen i completed
            completed.push({
              id: treatment.id,
              code: treatment.code,
              label: treatment.label,
              hours: treatmentHours[treatment.id] || 0,
            });
          }
        });
      });

      setCompletedTreatmentOptions(completed);
    }
  }, []);

  useEffect(() => {
    if (area && surfaceId) {
      calculateAverageHours();
    }
  }, [
    area,
    selectedPreTreatment,
    selectedUnderTreatment,
    selectedFinishTreatment,
    surfaces,
  ]);

  const calculateAverageHours = () => {
    const surface = surfaces[surfaceId];
    if (!surface) return;

    const treatmentHours = surface?.treatmentHours || {};
    let totalHours = 0;
    let treatmentCount = 0;

    // Iterera genom alla valda behandlingar och beräkna totalen
    [
      selectedPreTreatment,
      selectedUnderTreatment,
      selectedFinishTreatment,
    ].forEach((code) => {
      const treatment = surface?.selectedTreatments?.find(
        (t: any) => t.code === code
      );
      if (treatment) {
        const hours = treatmentHours[treatment.id] || 0;

        if (hours > 0) {
          totalHours += hours;
          treatmentCount++;
        }
      }
    });

    if (treatmentCount > 0 && area > 0) {
      const average = (totalHours * area) / treatmentCount;
      setAverageHours(average);
    } else {
      console.log("Ingen behandling vald eller ingen timmar för behandlingen.");
    }
  };

  return (
    <div className="space-y-4">
      <Link href="/" className="w-full">
        <Button variant="outline">
          <Home className="w-6 h-6" />
          Hem
        </Button>
      </Link>

      <Select
        value={selectedPreTreatment}
        onValueChange={setSelectedPreTreatment}
      >
        <SelectTrigger>
          <SelectValue placeholder="Välj förbehandling" />
        </SelectTrigger>
        <SelectContent>
          {preTreatments.map((t) => (
            <SelectItem key={t.code} value={t.code}>
              {t.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedUnderTreatment}
        onValueChange={setSelectedUnderTreatment}
      >
        <SelectTrigger>
          <SelectValue placeholder="Välj underbehandling" />
        </SelectTrigger>
        <SelectContent>
          {underTreatments.map((t) => (
            <SelectItem key={t.code} value={t.code}>
              {t.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedFinishTreatment}
        onValueChange={setSelectedFinishTreatment}
      >
        <SelectTrigger>
          <SelectValue placeholder="Välj slutbehandling" />
        </SelectTrigger>
        <SelectContent>
          {finishTreatments.map((t) => (
            <SelectItem key={t.code} value={t.code}>
              {t.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        type="number"
        placeholder="Ange kvadratmeter"
        value={area}
        onChange={(e) => setArea(Number(e.target.value))}
      />

      <div>Genomsnittlig arbetsåtgång: {averageHours.toFixed(2)} timmar</div>

      <Select
        value={selectedPerformedTreatment}
        onValueChange={setSelectedPerformedTreatment}
      >
        <SelectTrigger>
          <SelectValue placeholder="Utförda behandlingar" />
        </SelectTrigger>
        <SelectContent>
          {completedTreatmentOptions.map((t) => (
            <SelectItem key={t.id} value={t.code}>
              {t.label} ({t.hours} h)
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TreatmentCalculator;
