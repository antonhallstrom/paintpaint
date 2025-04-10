"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// AMA-kodsystemet för look-up
const amaCodes = {
  underlag: {
    1: "Ny obehandlad puts, stålglättad betongyta, gips/stuckatur.",
    2: "Ny obehandlad betong mot skivform, betongelement, betong- och lättbetongelement, tunnfogsblock.",
    3: "Ny obehandlad betong mot brädform eller luckform.",
    4: "Ny obehandlat murverk (utom tumfogsblock).",
    5: "Nya obehandlade skivor/gipsskivor.",
    6: "Nya obehandlade träytor.",
    7: "Ny obehandlad metallyta.",
    8: "Ny obehandlade radiatorer & rör.",
    9: "Fri.",
    91: "Befintlig tapetserad yta.",
    92: "Befintlig yta behandlad med kalkfärg, cementfärg, silikatfärg, slamfärg.",
    93: "Befintlig yta behandlad med sandspackel / gräng.",
    94: "Befintlig yta behandlad med limfärg / emulsionsfärg.",
    95: "Befintlig yta behandlad med lackfärg.",
    96: "Befintlig yta behandlad med latexfärg / latexlackfärg.",
    97: "Befintlig yta behandlad med klarlack, olja, bets, lasyrfärg.",
    98: "Fri.",
    99: "Fri.",
  },
  slutbehandling: {
    1: "Slutytan ska vara tapetserad.",
    2: "Slutytan ska behandlas med kalkfärg, cementfärg, silikatfärg, slamfärg etc.",
    3: "Slutytan ska behandlas med sandspackelmassa eller grängning.",
    4: "Slutytan ska behandlas med limfärg / emulsionsfärg.",
    5: "Slutytan ska behandlas med lackfärg.",
    6: "Slutytan ska behandlas med latexfärg / latexlackfärg (målas med färg).",
    7: "Slutytan ska behandlas med klarlack, olja.",
    8: "Slutytan ska behandlas med specialfärg.",
    9: "Fri.",
  },
  forbehandling: {
    0: "Ingen förbehandling (ingen rengöring)",
    1: "Rengöringsgrad 1 (nertagning / nerskrapning av tidigare ytmaterial)",
    2: "Rengöringsgrad 2 (tvättning, uppskrapning)",
    3: "Rengöringsgrad 3 (tvättning)",
    4: "Fri",
    5: "Fri",
    6: "Fri",
    7: "Fri",
    8: "Fri",
    9: "Fri",
  },
  underbehandlingar: {
    "00": "Ingen underbehandling.",
    "01": "Kridering (sorts limfärg som används som utjämnande material på puts under tapeter, istället för spackel – en äldre behandlingsåtgärd).",
    "02": "Inklistring, makulering/vävspänning (makulering = väv som appliceras med tunnt papper, när detta torkat blir väven spänd).",
    "03": "Kittning eller gipslagning (avser inte falskittning för glasning).",
    "04": "1 gg ispackling (småhål).",
    "05": "i- och påspackling (småhål).",
    "06": "1 gg skarvspackling.",
    "07": "i- och skarvspackling.",
    "08": "i- och påspackling, 2 ggr skarvspackling.",
    "09": "2 ggr skarvspackling.",
    10: "1 gg bredspackling.",
    11: "1 gg ispackling, 1 gg bredspackling.",
    12: "1 gg skarvspackling, 1 gg bredspackling.",
    13: "i- och skarvspackling, 1 gg bredspackling.",
    14: "Fri (saknar åtgärd).",
    15: "2 ggr bredspackling.",
    16: "1 gg ispackling, 2 ggr bredspackling.",
    17: "1 gg skarvspackling, 2 ggr bredspackling.",
    18: "i- och skarvspackling, 2 ggr bredspackling.",
    19: "i- och påspackling, 2 ggr skarvspackling, 1 gg bredspackling.",
    20: "3 ggr bredspackling.",
    21: "1 gg ispackling, 3 ggr bredspackling.",
    22: "1 gg skarvspackling, 3 ggr bredspackling.",
    23: "i- och skarvspackling, 3 ggr bredspackling.",
    24: "Spackling spik- och/eller skruvhål.",
    25: "2 ggr spackling spik- och skruvhål.",
    26: "Spackling spik- och/eller skruvhål, 1 gg skarvspackling.",
    27: "Spackling spik- och/eller skruvhål, 2 ggr skarvspackling.",
    28: "2 ggr spackling spik- och/eller skruvhål, 2 ggr skarvspackling.",
    29: "Spackling spik- och/eller skruvhål, 1 gg iläggning skarvremsa.",
    30: "1 gg iläggning skarvremsa, 1 gg skarvspackling.",
    31: "1 gg iläggning skarvremsa, 2 ggr skarvspackling.",
    32: "Spackling spik- och/eller skruvhål, 1 gg iläggning skarvremsa, 1 gg skarvspackling.",
    33: "Spackling spik- och/eller skruvhål, 1 gg iläggning skarvremsa, 2 ggr skarvspackling.",
    34: "2 ggr spackling spik- och/eller skruvhål, 1 gg iläggning skarvremsa, 1 gg skarvspackling.",
    35: "2 ggr spackling spik- och/eller skruvhål, 1 gg iläggning skarvremsa, 2 ggr skarvspackling.",
    36: "Skarvspackling, 2 ggr iläggning remsa, 1 gg skarvspackling.",
    37: "Spackling spik- och/eller skruvhål, skarvspackling, 2 ggr iläggning remsa, skarvspackling.",
    38: "Spackling spik- och/eller skruvhål, 1 gg skarvspackling, 2 ggr iläggning remsa, 2 ggr skarvspackling.",
    39: "2 ggr spackling spik- och/eller skruvhål, 1 gg skarvspackling, 2 ggr iläggning skarvremsa, 1 gg skarvspackling.",
    40: "2 ggr spackling spik- och/eller skruvhål, 1 gg skarvspackling, 2 ggr iläggning remsa, 2 ggr skarvspackling.",
    41: "Spackling spik- och/eller skruvhål, 1 gg skarvspackling, 1 gg bredspackling.",
    42: "Spackling spik- och/eller skruvhål, 1 gg iläggning skarvremsa, 1 gg bredspackling.",
    43: "Spackling spik- och/eller skruvhål, 1 gg iläggning skarvremsa, 1 gg skarvspackling, 1 gg bredspackling.",
    44: "Oljning.",
    45: "Grundning.",
    46: "Oljning och Grundning.",
    47: "Grundning eller oljning samt kittning (avser inte falskittning för glasning).",
    48: "Grundning, ispackling.",
    49: "Grundning, i och påspackling.",
    50: "Grundning, bredspackling.",
    51: "Grundning, ispackling, bredspackling.",
    52: "Grundning, 2 ggr bredspackling.",
    53: "Pågrundning.",
    54: "Pågrundning, kittning eller gipslagning (avser inte glasfalskittning).",
    55: "Pågrundning, ispackling.",
    56: "Pågrundning, i- och påspackling.",
    57: "Fri (saknar åtgärd).",
    58: "Fri (saknar åtgärd).",
    59: "Fri (saknar åtgärd).",
    60: "Fri (saknar åtgärd).",
    61: "Fri (saknar åtgärd).",
    62: "Fri (saknar åtgärd).",
    63: "Fri (saknar åtgärd).",
    64: "Fri (saknar åtgärd).",
    65: "Lasering.",
    66: "Betsning.",
    67: "Kittning, lasering (avser ej glasfalskittning).",
    68: "Oljning, kittning, lasering, (avser ej glasfalskittning).",
    69: "Fri (saknar åtgärd).",
    70: "Fri (saknar åtgärd).",
    71: "Fri (saknar åtgärd).",
    72: "Fri (saknar åtgärd).",
    73: "Spänning av väv, inklistring, makulering.",
    74: "Spänning av väv, inklistring, makulering, limning.",
    75: "Fri (saknar åtgärd).",
    76: "Fri (saknar åtgärd).",
    77: "Fri (saknar åtgärd).",
    78: "Nedslipning och utspackling av skarvar och kanter.",
    79: "Utspackling eller utspackling av skarvar och kanter.",
    80: "Utspackling eller utspackling av skarvar och kanter, bredspackling.",
    81: "Utspackling eller utspackling av skarvar och kanter, 2 ggr bredspackling.",
    82: "Utspackling eller utspackling av skarvar och kanter, grundning, bredspackling.",
    83: "Utspackling eller utspackling av skarvar och kanter, grundning, 2 ggr bredspackling.",
    84: "Fri (saknar åtgärd).",
    85: "Fri (saknar åtgärd).",
    86: "Fri (saknar åtgärd).",
    87: "Fri (saknar åtgärd).",
    88: "Fri (saknar åtgärd).",
    89: "Fri (saknar åtgärd).",
    90: "Fri (saknar åtgärd).",
    91: "Påbättring med rostskyddsgrundfärg.",
    92: "Strykning med rostskyddsgrundsfärg till en tjocklek av minst 40μm³ torrt skikt.",
    93: "Strykning med rostskyddsgrundsfärg till en tjocklek av minst 60μm³ torrt skikt.",
    94: "Strykning med rostskyddsgrundsfärg till en tjocklek av minst 80μm³ torrt skikt.",
    95: "Strykning med rostskyddsgrundsfärg till en tjocklek av minst 10μm³ torrt skikt.",
    96: "Fri (saknar åtgärd).",
    97: "Fri (saknar åtgärd).",
    98: "Fri (saknar åtgärd).",
    99: "Fri (saknar åtgärd).",
  },
  fardigbehandling: {
    "00": "Ingen färdigbehandling.",
    "01": "Tvättning för gott (tvättning).",
    "02": "Uppsättning tapet.",
    "03": "Kantlimning, uppsättning tapet.",
    "04": "Limning, uppsättning tapet.",
    "05": "1 gg grundning, uppsättning tapet.",
    "06": "1 gg strykning, uppsättning tapet.",
    "07": "Grängning.",
    "08": "1 gg strykning.",
    "09": "1 gg påbättring, 1 gg strykning.",
    10: "2 ggr strykning.",
    11: "1gg påbättring, 2 ggr strykning.",
    12: "1 gg grundning, 2 ggr strykning.",
    13: "3 ggr strykning.",
    14: "1 gg strykning, 1 gg ispackling (finspackling), 1 gg påbättring, 1 gg strykning.",
    15: "1 gg strykning, 1 gg ispackling (finspackling), 2 ggr strykning.",
    16: "1 gg strykning, 1 gg bredspackling (finbredspackling), 2 ggr strykning.",
    17: "Vattenslipning, 1 gg strykning, 1 gg bredspackling (finbredspackling), 2 ggr strykning.",
    18: "Vävklistring, 1 gg strykning.",
    19: "Vävklistring, 2 ggr strykning.",
    20: "Vävklistring, 1 gg grundning, 2 ggr strykning.",
    21: "Vävklistring, 1 gg bredspackling, 2 ggr strykning.",
    22: "Limning, vävklistring, 1 gg strykning.",
    23: "Limning, vävklistring, 2 ggr strykning.",
    24: "Limning, vävklistring, 1 gg grundning, 2 ggr strykning.",
    25: "1 gg grundning, vävklistring, 2 ggr strykning.",
    26: "1 gg grundning, vävklistring, 3 ggr strykning.",
    27: "Fri (saknar åtgärd).",
    28: "Fri (saknar åtgärd).",
    29: "Fri (saknar åtgärd).",
    30: "Fri (saknar åtgärd).",
    31: "Fri (saknar åtgärd).",
    32: "Fri (saknar åtgärd).",
    33: "Fri (saknar åtgärd).",
    34: "Fri (saknar åtgärd).",
    35: "Fri (saknar åtgärd).",
    36: "Fri (saknar åtgärd).",
    37: "1 gg strykning hel yta, 1 gg strykning synlig yta.",
    38: "1 gg strykning hel yta, 2 ggr strykning synlig yta.",
    39: "1 gg strykning synlig yta.",
    40: "1 gg påbättring, 1 gg strykning synlig yta.",
    41: "2 ggr strykning synlig yta.",
    42: "1 gg lasering.",
    43: "2 ggr lasering.",
    44: "Fri (saknar åtgärd).",
    45: "Fri (saknar åtgärd).",
    46: "Fri (saknar åtgärd).",
    47: "Fri (saknar åtgärd).",
    48: "Fri (saknar åtgärd).",
    49: "Fri (saknar åtgärd).",
    50: "Fri (saknar åtgärd).",
    51: "Fri (saknar åtgärd).",
    52: "Fri (saknar åtgärd).",
    53: "Fri (saknar åtgärd).",
    54: "Fri (saknar åtgärd).",
    55: "Fri (saknar åtgärd).",
    56: "Fri (saknar åtgärd).",
    57: "Fri (saknar åtgärd).",
    58: "Fri (saknar åtgärd).",
    59: "Fri (saknar åtgärd).",
    60: "Fri (saknar åtgärd).",
    61: "Fri (saknar åtgärd).",
    62: "1 gg strykning med rostskyddstäckfärg till en tjocklek av minst 40μm³ torrt skikt.",
    63: "1 gg strykning med rostskyddstäckfärg till en tjocklek av minst 60μm³ torrt skikt.",
    64: "1 gg strykning med rostskyddstäckfärg till en tjocklek av minst 80μm³ torrt skikt.",
    65: "1 gg strykning med rostskyddstäckfärg till en tjocklek av minst 100μm³ torrt skikt.",
    66: "1 gg strykning med rostskyddstäckfärg till en tjocklek av minst 120μm³ torrt skikt.",
    67: "Fri (saknar åtgärd).",
    68: "Fri (saknar åtgärd).",
    69: "Fri (saknar åtgärd).",
    70: "Fri (saknar åtgärd).",
    71: "Fri (saknar åtgärd).",
    72: "Fri (saknar åtgärd).",
    73: "Fri (saknar åtgärd).",
    74: "Fri (saknar åtgärd).",
    75: "Fri (saknar åtgärd).",
    76: "Fri (saknar åtgärd).",
    77: "Fri (saknar åtgärd).",
    78: "Fri (saknar åtgärd).",
    79: "Fri (saknar åtgärd).",
    80: "Fri (saknar åtgärd).",
    81: "Fri (saknar åtgärd).",
    82: "Fri (saknar åtgärd).",
    83: "Fri (saknar åtgärd).",
    84: "Fri (saknar åtgärd).",
    85: "Fri (saknar åtgärd).",
    86: "Fri (saknar åtgärd).",
    87: "Fri (saknar åtgärd).",
    88: "Fri (saknar åtgärd).",
    89: "Fri (saknar åtgärd).",
    90: "Fri (saknar åtgärd).",
    91: "Fri (saknar åtgärd).",
    92: "Fri (saknar åtgärd).",
    93: "Fri (saknar åtgärd).",
    94: "Fri (saknar åtgärd).",
    95: "Fri (saknar åtgärd).",
    96: "Fri (saknar åtgärd).",
    97: "Fri (saknar åtgärd).",
    98: "Fri (saknar åtgärd).",
    99: "Fri (saknar åtgärd).",
  },
};

const AMAApp = () => {
  const [underlag, setUnderlag] = useState("");
  const [slutbehandling, setSlutbehandling] = useState("");
  const [forbehandling, setForbehandling] = useState("");
  const [underbehandling, setUnderbehandling] = useState("");
  const [fardigbehandling, setFardigbehandling] = useState("");
  const [resultat, setResultat] = useState("");

  const handleSubmit = () => {
    const underlagBeskrivning = amaCodes.underlag[underlag] || "Okänt underlag";
    const slutbehandlingBeskrivning =
      amaCodes.slutbehandling[slutbehandling] || "Okänd slutbehandling";
    const forbehandlingBeskrivning =
      amaCodes.forbehandling[forbehandling] || "Okänd förbehandling";
    const underbehandlingBeskrivning =
      amaCodes.underbehandlingar[underbehandling] || "Okänd underbehandling";
    const fardigbehandlingBeskrivning =
      amaCodes.fardigbehandling[fardigbehandling] || "Okänd färdigbehandling";

    setResultat(`
      Underlag(${underlag}): ${underlagBeskrivning}
      Slutbehandling(${slutbehandling}): ${slutbehandlingBeskrivning}
      Förbehandling(${forbehandling}): ${forbehandlingBeskrivning}
      Underbehandling(${underbehandling}): ${underbehandlingBeskrivning}
      Färdigbehandling(${fardigbehandling}): ${fardigbehandlingBeskrivning}
    `);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>AMA-kodtolkare</h1>

      <p>
        En AMA-kods uppbyggnad. Målningsbehandlingar (AMA-koder) är
        sammanställda genom en kombination av siffergrupper för:
      </p>
      <ul>
        <li>
          <strong>Underlag/yta:</strong> Yta som ska behandlas.
        </li>
        <li>
          <strong>Slutyta/slutbehandling:</strong> Vilken slutyta som det ska
          vara.
        </li>
        <li>
          <strong>Förbehandling:</strong> Rengöringsgrad.
        </li>
        <li>
          <strong>Underbehandling:</strong> Spacklingsarbeten etc.
        </li>
        <li>
          <strong>Färdigbehandling:</strong> Strykning med färg, tapetsering
          etc.
        </li>
      </ul>
      <p>
        Exempel på en AMA-kod (av flera hundra), för behandling mot nya
        gipsskivor:
      </p>
      <p>
        AMA-koden <strong>56-03510</strong> (5 6 – 0 35 10) och den betyder i
        uppdelade siffror:
      </p>
      <ul>
        <li>
          <strong>5:</strong> Nya obehandlade skivor/gipsskivor.
        </li>
        <li>
          <strong>6:</strong> Slutytan ska vara målad (målas med färg).
        </li>
        <li>
          <strong>0:</strong> Rengöringsgrad 0 (ingen rengöring eller
          slipning/skrapning av ytan).
        </li>
        <li>
          <strong>35:</strong> 2 ggr spackling spik- och/eller skrivhål, 1 gg
          iläggning skarvremsa, 2 ggr skarvspackling.
        </li>
        <li>
          <strong>10:</strong> 2 ggr strykning med färg.
        </li>
      </ul>

      <div style={{ display: "flex", gap: "10px" }}>
        <div>
          <label>Underlag:</label>
          <Input
            type="number"
            value={underlag}
            placeholder="1-9, 91-99"
            onChange={(e) => setUnderlag(e.target.value)}
          />
        </div>

        <div>
          <label>Slutbehandling:</label>
          <Input
            type="number"
            placeholder="1-9"
            value={slutbehandling}
            onChange={(e) => setSlutbehandling(e.target.value)}
          />
        </div>

        <div>
          <label>Rengöringgrad - Förbehandling:</label>
          <Input
            placeholder="1-9"
            type="number"
            value={forbehandling}
            onChange={(e) => setForbehandling(e.target.value)}
          />
        </div>

        <div>
          <label>Underbehandling:</label>
          <Input
            placeholder="00-99"
            type="number"
            value={underbehandling}
            onChange={(e) => setUnderbehandling(e.target.value)}
          />
        </div>

        <div>
          <label>Färdigbehandling:</label>
          <Input
            type="number"
            placeholder="00-99"
            value={fardigbehandling}
            onChange={(e) => setFardigbehandling(e.target.value)}
          />
        </div>
      </div>

      <Button onClick={handleSubmit}>Sök</Button>

      <div>
        <h3>Resultat:</h3>
        <pre>{resultat}</pre>
      </div>

      <div className="overflow-x-auto mt-8">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Typ av yta</th>
              <th className="border border-gray-300 px-4 py-2">
                Förbehandling Rengöringsgrad 1
              </th>
              <th className="border border-gray-300 px-4 py-2">
                Förbehandling Rengöringsgrad 2
              </th>
              <th className="border border-gray-300 px-4 py-2">
                Förbehandling Rengöringsgrad 3
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2">
                Yta målad med pigmenterad eller opigmenterad lack, latex, eller
                därmed jämförbart färgmaterial
              </td>
              <td className="border border-gray-300 px-4 py-2">
                Borttagning av målningsmaterial, uppskrapning samt avslipning.
                På rengjord yta får endast förekomma grundfärg och dylikt som
                trängt in i ytan.
              </td>
              <td className="border border-gray-300 px-4 py-2">
                Rengöring till fast underlag (med fast underlag avses fullt
                betryggande underlag för ommålning) samt tvättning och
                uppskrapning.
              </td>
              <td className="border border-gray-300 px-4 py-2">
                Tvättning för ommålning, slipning (för industrilackade ytor
                utförs mattslipning).
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">
                Golv, målad betong eller målat trä
              </td>
              <td className="border border-gray-300 px-4 py-2">
                Borttagning av alla färskikt.
              </td>
              <td className="border border-gray-300 px-4 py-2">
                Avfettning/tvättning, slipning, uppskrapning, borttagning av all
                lös färg till fast underlag och dammsugning.
              </td>
              <td className="border border-gray-300 px-4 py-2"></td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">
                Yta målad med lim- kalk- och emulsionsfärger samt övriga löst
                bundna färger. Exempelvis slamfärger.
              </td>
              <td className="border border-gray-300 px-4 py-2">
                Borttagning av målningsmaterial samt uppskrapning. På rengjord
                yta får endast förekomma grundfärg och dylikt som trängt in i
                ytan.
              </td>
              <td className="border border-gray-300 px-4 py-2">
                Rengöring till fast underlag (med fast underlag avses fullt
                betryggande underlag för ommålning) samt uppskrapning.
                Nedtvättning av limfärg.
              </td>
              <td className="border border-gray-300 px-4 py-2"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AMAApp;
