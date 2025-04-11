"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Home } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import TreatmentCalculator from "./treatment-calculator-4";

const MaterialList = ({ surfaces }) => {
  // Helper function to convert material consumption to liters
  const convertToLiters = (kvd, conversionFactor) => {
    return kvd / conversionFactor;
  };

  const getMaterialConsumption = (surfaces) => {
    const materialSummary = {};

    // Iterera genom alla ytor
    Object.keys(surfaces).forEach((surfaceKey) => {
      const surface = surfaces[surfaceKey];

      // Säkerställ att selectedTreatments finns och är en array innan vi fortsätter
      if (Array.isArray(surface.selectedTreatments)) {
        surface.selectedTreatments.forEach((selectedTreatment) => {
          // Iterera genom alla behandlingar för den valda behandlingen
          selectedTreatment.treatments.forEach((step) => {
            // Beräkna total materialförbrukning
            const amount =
              (step.materialConsumption ?? 0) * step.times * surface.area;
            const material = step.material || step.treatment;

            // Lägg till eller uppdatera materialförbrukningen i materialSummary
            materialSummary[material] =
              (materialSummary[material] || 0) + amount;
          });
        });
      }
    });

    return materialSummary;
  };

  const materialSummary = getMaterialConsumption(surfaces);
  console.log(materialSummary);
  return (
    <ul className="list-disc pl-4">
      {Object.entries(materialSummary).map(([material, total], i) => (
        <li key={i}>
          {material}: {total.toFixed(2)}
          {" l"}
        </li>
      ))}
    </ul>
  );
};

export default function ProjectForm() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [surfaces, setSurfaces] = useState();
  const [projects, setProjects] = useState(null); // null = inte laddat än

  useEffect(() => {
    const stored = localStorage.getItem("surfaces");
    if (stored) {
      try {
        const parsedSurfaces = JSON.parse(stored);
        // Kontrollera att parsedSurfaces är ett objekt innan vi försöker använda det
        if (parsedSurfaces && typeof parsedSurfaces === "object") {
          setSurfaces(parsedSurfaces);
        } else {
          console.error("Surfaces data är inte i rätt format.");
        }
      } catch (err) {
        console.error("Kunde inte parsa localStorage-data:", err);
      }
    }
  }, []);

  // Hämta projekt från localStorage
  useEffect(() => {
    const stored = localStorage.getItem("projects");
    if (stored) {
      try {
        setProjects(JSON.parse(stored));
      } catch (err) {
        console.error("Kunde inte parsa localStorage-data:", err);
        setProjects([]); // fallback till tom array
      }
    } else {
      setProjects([]); // Inget i localStorage? Då är det tomt
    }
  }, []);

  useEffect(() => {
    if (projects !== null) {
      localStorage.setItem("projects", JSON.stringify(projects));
    }
  }, [projects]);

  const addSurface = (projectIndex) => {
    const newProjects = [...projects];
    newProjects[projectIndex].surfaces.push({
      title: "",
      unit: "",
      amount: "",
      description: "",
      base: "",
      finish: "",
      treatments: [],
    });
    setProjects(newProjects);
  };

  const addProject = () => {
    setProjects([
      ...projects,
      {
        id: crypto.randomUUID(),
        title: "",
        status: "",
        startDate: "",
        endDate: "",
        address: "",
        notes: "",
        contact: "",
        phone: "",
        surfaces: [],
      },
    ]);
  };

  const getTotalTimeAndMaterials = (surfaces) => {
    if (!surfaces || typeof surfaces !== "object") {
      console.error("Datan är inte i rätt format eller saknas.");
      return { totalTime: 0, tools: [], materials: [] };
    }

    let totalTime = 0;
    let tools = new Set();
    let materials = new Set();

    // Iterera genom alla ytor i surfaces (som är objekt med unika nycklar)
    Object.keys(surfaces).forEach((surfaceKey) => {
      const surface = surfaces[surfaceKey];
      console.log("S", surface);
      // Säkerställ att selectedTreatments finns och är en array innan vi fortsätter
      if (Array.isArray(surface.selectedTreatments)) {
        if (surface.treatmentHours && surface.treatmentHours) {
          totalTime += Object.values(surface.treatmentHours).reduce(
            (acc, curr) => acc + curr,
            0
          );
        }
        surface.selectedTreatments.forEach((selectedTreatment) => {
          console.log("ST", selectedTreatment);
          if (selectedTreatment.tools) {
            selectedTreatment.tools.forEach((tool) => tools.add(tool));
          }

          // Summera arbetstiden från `treatmentHours`-objektet
          // Säkerställ att treatments finns och är en array
          if (Array.isArray(selectedTreatment.treatments)) {
            selectedTreatment.treatments.forEach((treatment) => {
              console.log("T", treatment);
              // Lägg till verktyg från behandlingen
              if (treatment.tools) {
                treatment.tools.forEach((tool) => tools.add(tool));
              }

              // Lägg till material från behandlingen
              if (treatment.material) {
                materials.add(treatment.material);
              }
            });
          }
        });
      }
    });
    return {
      totalTime,
      tools: Array.from(tools),
      materials: Array.from(materials),
    };
  };

  if (projects === null) return <p>Laddar...</p>;

  const filteredProjects = projects.filter((project) => {
    if (filterStatus === "all") return true; // Visa alla projekt
    return project.status === filterStatus; // Filtrera baserat på status
  });

  return (
    <div className="p-4 space-y-4">
      <Link href="/" className="w-full">
        <Button variant="outline">
          <Home className="w-6 h-6" />
          Hem
        </Button>
      </Link>
      <Select
        value={filterStatus}
        onValueChange={(value) => setFilterStatus(value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Filtrera på status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Alla</SelectItem>
          <SelectItem value="pågående">Pågående</SelectItem>
          <SelectItem value="avslutad">Avslutad</SelectItem>
          <SelectItem value="avslutad">Pausad</SelectItem>
        </SelectContent>
      </Select>
      {filteredProjects.map((project, projectIndex) => (
        <Card key={projectIndex}>
          <CardContent className="p-4">
            <Accordion type="multiple" className="w-full">
              <AccordionItem value={`project-${projectIndex}`}>
                <AccordionTrigger>
                  {project.title || `Project ${projectIndex}`}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Projekt titel"
                      value={project.title}
                      onChange={(e) => {
                        const updated = [...projects];
                        updated[projectIndex].title = e.target.value;
                        setProjects(updated);
                      }}
                    />
                    <Select
                      value={project.status}
                      onValueChange={(value) => {
                        const updated = [...projects];
                        updated[projectIndex].status = value;
                        setProjects(updated);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Välj status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pågående">Pågående</SelectItem>
                        <SelectItem value="avslutad">Avslutad</SelectItem>
                        <SelectItem value="pausad">Pausad</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="date"
                      placeholder="Start datum"
                      value={project.startDate}
                      onChange={(e) => {
                        const updated = [...projects];
                        updated[projectIndex].startDate = e.target.value;
                        setProjects(updated);
                      }}
                    />
                    <Input
                      type="date"
                      placeholder="Slut datum"
                      value={project.endDate}
                      onChange={(e) => {
                        const updated = [...projects];
                        updated[projectIndex].endDate = e.target.value;
                        setProjects(updated);
                      }}
                    />
                    <Input
                      placeholder="Google Maps address"
                      value={project.address}
                      onChange={(e) => {
                        const updated = [...projects];
                        updated[projectIndex].address = e.target.value;
                        setProjects(updated);
                      }}
                    />
                    <Textarea
                      placeholder="Anteckningar"
                      className="col-span-2"
                      value={project.notes}
                      onChange={(e) => {
                        const updated = [...projects];
                        updated[projectIndex].notes = e.target.value;
                        setProjects(updated);
                      }}
                    />
                    <Input
                      placeholder="Kontaktperson"
                      value={project.contact}
                      onChange={(e) => {
                        const updated = [...projects];
                        updated[projectIndex].contact = e.target.value;
                        setProjects(updated);
                      }}
                    />
                    <Input
                      placeholder="Telefonnummer"
                      value={project.phone}
                      onChange={(e) => {
                        const updated = [...projects];
                        updated[projectIndex].phone = e.target.value;
                        setProjects(updated);
                      }}
                    />
                  </div>

                  {/* Ytor */}
                  <div className="my-4 space-y-2">
                    <h5>Ytor</h5>
                    {project.surfaces.map((surface, surfaceIndex) => (
                      <Accordion
                        key={surfaceIndex}
                        type="multiple"
                        className="w-full outline-2 px-2"
                      >
                        <AccordionItem value={`yta-${surfaceIndex}`}>
                          <AccordionTrigger>
                            {surface.title || `Yta ${surfaceIndex + 1}`}
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4">
                              <Input
                                placeholder="Ytans titel"
                                value={surface.title}
                                onChange={(e) => {
                                  const updated = [...projects];
                                  updated[projectIndex].surfaces[
                                    surfaceIndex
                                  ].title = e.target.value;
                                  setProjects(updated);
                                }}
                              />
                              <Textarea
                                placeholder="Fritext om ytan"
                                value={surface.description}
                                onChange={(e) => {
                                  const updated = [...projects];
                                  updated[projectIndex].surfaces[
                                    surfaceIndex
                                  ].description = e.target.value;
                                  setProjects(updated);
                                }}
                              />
                              <div className="flex flex-col space-y-4">
                                {/* Underlag */}
                                <div>
                                  <label htmlFor="base">Underlag</label>
                                  <Select
                                    id="base"
                                    value={surface.base}
                                    onValueChange={(value) => {
                                      const updated = [...projects];
                                      updated[projectIndex].surfaces[
                                        surfaceIndex
                                      ].base = value;
                                      setProjects(updated);
                                    }}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Underlag" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="1">
                                        1 - Ny obehandlad puts, stålglättad
                                        betongyta, gips/stuckatur
                                      </SelectItem>
                                      <SelectItem value="2">
                                        2 - Ny obehandlad betong mot skivform,
                                        betongelement, betong- och
                                        lättbetongelement, tunnfogsblock
                                      </SelectItem>
                                      <SelectItem value="3">
                                        3 - Ny obehandlad betong mot brädform
                                        eller luckform
                                      </SelectItem>
                                      <SelectItem value="4">
                                        4 - Ny obehandlat murverk (utom
                                        tumfogsblock)
                                      </SelectItem>
                                      <SelectItem value="5">
                                        5 - Nya obehandlade skivor/gipsskivor
                                      </SelectItem>
                                      <SelectItem value="6">
                                        6 - Nya obehandlade träytor
                                      </SelectItem>
                                      <SelectItem value="7">
                                        7 - Ny obehandlad metallyta
                                      </SelectItem>
                                      <SelectItem value="8">
                                        8 - Ny obehandlade radiatorer & rör
                                      </SelectItem>
                                      <SelectItem value="9">9 - Fri</SelectItem>
                                      <SelectItem value="91">
                                        91 - Befintlig tapetserad yta
                                      </SelectItem>
                                      <SelectItem value="92">
                                        92 - Befintlig yta behandlad med
                                        kalkfärg, cementfärg, silikatfärg,
                                        slamfärg
                                      </SelectItem>
                                      <SelectItem value="93">
                                        93 - Befintlig yta behandlad med
                                        sandspackel / gräng
                                      </SelectItem>
                                      <SelectItem value="94">
                                        94 - Befintlig yta behandlad med limfärg
                                        / emulsionsfärg
                                      </SelectItem>
                                      <SelectItem value="95">
                                        95 - Befintlig yta behandlad med
                                        lackfärg
                                      </SelectItem>
                                      <SelectItem value="96">
                                        96 - Befintlig yta behandlad med
                                        latexfärg / latexlackfärg
                                      </SelectItem>
                                      <SelectItem value="97">
                                        97 - Befintlig yta behandlad med
                                        klarlack, olja, bets, lasyrfärg
                                      </SelectItem>
                                      <SelectItem value="98">
                                        98 - Fri
                                      </SelectItem>
                                      <SelectItem value="99">
                                        99 - Fri
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <div className="mt-2 text-sm text-gray-600">
                                    <strong>Valt Underlag:</strong>{" "}
                                    {surface.base}
                                  </div>
                                </div>

                                {/* Slutbehandling */}
                                <div>
                                  <label htmlFor="finish">Slutbehandling</label>
                                  <Select
                                    id="finish"
                                    value={surface.finish}
                                    onValueChange={(value) => {
                                      const updated = [...projects];
                                      updated[projectIndex].surfaces[
                                        surfaceIndex
                                      ].finish = value;
                                      setProjects(updated);
                                    }}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Slut yta" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="1">
                                        1 - Slutytan ska vara tapetserad
                                      </SelectItem>
                                      <SelectItem value="2">
                                        2 - Slutytan ska behandlas med kalkfärg,
                                        cementfärg, silikatfärg, slamfärg
                                      </SelectItem>
                                      <SelectItem value="3">
                                        3 - Slutytan ska behandlas med
                                        sandspackelmassa eller grängning
                                      </SelectItem>
                                      <SelectItem value="4">
                                        4 - Slutytan ska behandlas med limfärg /
                                        emulsionsfärg
                                      </SelectItem>
                                      <SelectItem value="5">
                                        5 - Slutytan ska behandlas med lackfärg
                                      </SelectItem>
                                      <SelectItem value="6">
                                        6 - Slutytan ska behandlas med latexfärg
                                        / latexlackfärg (målas med färg)
                                      </SelectItem>
                                      <SelectItem value="7">
                                        7 - Slutytan ska behandlas med klarlack,
                                        olja
                                      </SelectItem>
                                      <SelectItem value="8">
                                        8 - Slutytan ska behandlas med
                                        specialfärg
                                      </SelectItem>
                                      <SelectItem value="9">9 - Fri</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <div className="mt-2 text-sm text-gray-600">
                                    <strong>Vald Slutbehandling:</strong>{" "}
                                    {surface.finish}
                                  </div>
                                </div>
                              </div>

                              <h5>Behandlingar</h5>
                              <TreatmentCalculator
                                projectId={project.id}
                                surfaceId={surfaceIndex}
                              />
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    ))}
                    <Button
                      onClick={() => addSurface(projectIndex)}
                      variant="outline"
                    >
                      Lägg till yta
                    </Button>

                    {/* Verktyg, Material, Total arbetstid */}
                    <div>
                      {surfaces && (
                        <div>
                          <div>
                            <strong>Verktyg:</strong>
                            <ul className="list-disc pl-4">
                              {getTotalTimeAndMaterials(surfaces).tools.map(
                                (tool, index) => (
                                  <li key={index}>{tool}</li>
                                )
                              )}
                            </ul>
                          </div>
                          <p>
                            <strong>Material:</strong>{" "}
                            <MaterialList surfaces={surfaces} />
                          </p>
                          <p>
                            <strong>Total arbetstid:</strong>
                            {
                              getTotalTimeAndMaterials(surfaces as any)
                                .totalTime
                            }{" "}
                            timmar
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      ))}
      <Button onClick={addProject}>Lägg till nytt projekt</Button>
    </div>
  );
}
