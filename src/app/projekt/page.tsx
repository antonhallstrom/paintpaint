"use client";

import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from "next/link";
function calculateDryTime(hours) {
  if (!hours || isNaN(hours)) return "";
  const now = new Date();
  now.setHours(now.getHours() + parseInt(hours));
  const options = {
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  const timeString = now.toLocaleTimeString("sv-SE", options);
  const dateString = now.toLocaleDateString("sv-SE");
  return `Kl ${timeString}, ${dateString}`;
}

export default function ProjectForm() {
  const [projects, setProjects] = useState([
    {
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

  const addTreatment = (projectIndex, surfaceIndex) => {
    const newProjects = [...projects];
    newProjects[projectIndex].surfaces[surfaceIndex].treatments.push({
      title: "",
      description: "",
      steps: [],
      selectedStep: "",
    });
    setProjects(newProjects);
  };

  const updateSelectedStep = (
    projectIndex,
    surfaceIndex,
    treatmentIndex,
    value
  ) => {
    const newProjects = [...projects];
    newProjects[projectIndex].surfaces[surfaceIndex].treatments[
      treatmentIndex
    ].selectedStep = value;
    setProjects(newProjects);
  };

  const addStepToTreatment = (projectIndex, surfaceIndex, treatmentIndex) => {
    const newProjects = [...projects];
    const treatment =
      newProjects[projectIndex].surfaces[surfaceIndex].treatments[
        treatmentIndex
      ];
    const selectedStep = treatment.selectedStep;
    if (!selectedStep) return;
    treatment.steps.push({
      name: selectedStep,
      done: false,
      hours: "",
      dryTime: "",
      dryReady: "",
    });
    treatment.selectedStep = "";
    setProjects(newProjects);
  };

  const toggleStepDone = (
    projectIndex,
    surfaceIndex,
    treatmentIndex,
    stepIndex
  ) => {
    const newProjects = [...projects];
    const step =
      newProjects[projectIndex].surfaces[surfaceIndex].treatments[
        treatmentIndex
      ].steps[stepIndex];
    step.done = !step.done;
    if (step.done && step.dryTime) {
      step.dryReady = calculateDryTime(step.dryTime);
    } else {
      step.dryReady = "";
    }
    setProjects(newProjects);
  };

  const updateStepField = (
    projectIndex,
    surfaceIndex,
    treatmentIndex,
    stepIndex,
    field,
    value
  ) => {
    const newProjects = [...projects];
    const step =
      newProjects[projectIndex].surfaces[surfaceIndex].treatments[
        treatmentIndex
      ].steps[stepIndex];
    step[field] = value;
    setProjects(newProjects);
  };

  return (
    <div className="p-4 space-y-4">
      <Link href="/" className="w-full">
        <Button variant="outline">
          <Home className="w-6 h-6" />
          Hem
        </Button>
      </Link>
      {projects.map((project, projectIndex) => (
        <Card key={projectIndex}>
          <CardContent className="p-4">
            <Accordion type="multiple" className="w-full">
              <AccordionItem value={`project-${projectIndex}`}>
                <AccordionTrigger>Projekt</AccordionTrigger>
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
                  <div className="mt-4 space-y-2">
                    {project.surfaces.map((surface, surfaceIndex) => (
                      <Accordion
                        key={surfaceIndex}
                        type="multiple"
                        className="w-full"
                      >
                        <AccordionItem value={`yta-${surfaceIndex}`}>
                          <AccordionTrigger>
                            Yta {surfaceIndex + 1}
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
                              <div className="flex space-x-4">
                                {["kvm", "löpmeter", "styck"].map((unit) => (
                                  <Label key={unit}>
                                    <Input
                                      type="radio"
                                      name={`enhet-${projectIndex}-${surfaceIndex}`}
                                      checked={surface.unit === unit}
                                      onChange={() => {
                                        const updated = [...projects];
                                        updated[projectIndex].surfaces[
                                          surfaceIndex
                                        ].unit = unit;
                                        setProjects(updated);
                                      }}
                                    />{" "}
                                    {unit}
                                  </Label>
                                ))}
                              </div>
                              <Input
                                placeholder="Antal"
                                value={surface.amount}
                                onChange={(e) => {
                                  const updated = [...projects];
                                  updated[projectIndex].surfaces[
                                    surfaceIndex
                                  ].amount = e.target.value;
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
                              <Select
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
                                  <SelectItem value="trä">Trä</SelectItem>
                                  <SelectItem value="betong">Betong</SelectItem>
                                </SelectContent>
                              </Select>
                              <Select
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
                                  <SelectItem value="målad">Målad</SelectItem>
                                  <SelectItem value="slipad">Slipad</SelectItem>
                                  <SelectItem value="tapetserad">
                                    Tapetserad
                                  </SelectItem>
                                  <SelectItem value="lackad">Lackad</SelectItem>
                                </SelectContent>
                              </Select>

                              {/* Behandlingar */}
                              <div className="space-y-2">
                                {surface.treatments.map(
                                  (treatment, treatmentIndex) => (
                                    <Accordion
                                      key={treatmentIndex}
                                      type="multiple"
                                    >
                                      <AccordionItem
                                        value={`behandling-${treatmentIndex}`}
                                      >
                                        <AccordionTrigger>
                                          Behandling {treatmentIndex + 1}
                                        </AccordionTrigger>
                                        <AccordionContent>
                                          <Input
                                            placeholder="Behandlingens titel"
                                            value={treatment.title}
                                            onChange={(e) => {
                                              const updated = [...projects];
                                              updated[projectIndex].surfaces[
                                                surfaceIndex
                                              ].treatments[
                                                treatmentIndex
                                              ].title = e.target.value;
                                              setProjects(updated);
                                            }}
                                          />
                                          <Textarea
                                            placeholder="Fritext"
                                            value={treatment.description}
                                            onChange={(e) => {
                                              const updated = [...projects];
                                              updated[projectIndex].surfaces[
                                                surfaceIndex
                                              ].treatments[
                                                treatmentIndex
                                              ].description = e.target.value;
                                              setProjects(updated);
                                            }}
                                          />
                                          <div className="flex gap-2 items-center">
                                            <Select
                                              value={treatment.selectedStep}
                                              onValueChange={(value) =>
                                                updateSelectedStep(
                                                  projectIndex,
                                                  surfaceIndex,
                                                  treatmentIndex,
                                                  value
                                                )
                                              }
                                            >
                                              <SelectTrigger>
                                                <SelectValue placeholder="Välj arbetsmoment" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="tvättning">
                                                  Tvättning
                                                </SelectItem>
                                                <SelectItem value="spackling">
                                                  Spackling
                                                </SelectItem>
                                                <SelectItem value="slipning">
                                                  Slipning
                                                </SelectItem>
                                                <SelectItem value="grundning">
                                                  Grundning
                                                </SelectItem>
                                              </SelectContent>
                                            </Select>
                                            <Button
                                              variant="outline"
                                              onClick={() =>
                                                addStepToTreatment(
                                                  projectIndex,
                                                  surfaceIndex,
                                                  treatmentIndex
                                                )
                                              }
                                            >
                                              Lägg till moment
                                            </Button>
                                          </div>
                                          <div className="mt-4 space-y-2">
                                            {treatment.steps.map(
                                              (step, stepIndex) => (
                                                <div
                                                  key={stepIndex}
                                                  className="flex items-center gap-2"
                                                >
                                                  <Checkbox
                                                    checked={step.done}
                                                    onCheckedChange={() =>
                                                      toggleStepDone(
                                                        projectIndex,
                                                        surfaceIndex,
                                                        treatmentIndex,
                                                        stepIndex
                                                      )
                                                    }
                                                  />
                                                  <span>{step.name}</span>
                                                  <Input
                                                    type="number"
                                                    placeholder="Tid (timmar)"
                                                    className="w-32"
                                                    value={step.hours}
                                                    onChange={(e) =>
                                                      updateStepField(
                                                        projectIndex,
                                                        surfaceIndex,
                                                        treatmentIndex,
                                                        stepIndex,
                                                        "hours",
                                                        e.target.value
                                                      )
                                                    }
                                                  />
                                                  <Input
                                                    type="number"
                                                    placeholder="Torktid (timmar)"
                                                    className="w-40"
                                                    value={step.dryTime}
                                                    onChange={(e) =>
                                                      updateStepField(
                                                        projectIndex,
                                                        surfaceIndex,
                                                        treatmentIndex,
                                                        stepIndex,
                                                        "dryTime",
                                                        e.target.value
                                                      )
                                                    }
                                                  />
                                                  <span className="text-green-500 text-sm">
                                                    Torktid klar:{" "}
                                                    {step.dryReady || ""}
                                                  </span>
                                                </div>
                                              )
                                            )}
                                            <p>Verktyg</p>- Bredspacklar
                                            <p>Material</p>- 20 l bredspackel
                                            <p>Arbetsplattformar</p>- Arbetsbock
                                            - Stege
                                          </div>
                                        </AccordionContent>
                                      </AccordionItem>
                                    </Accordion>
                                  )
                                )}
                                <Button
                                  onClick={() =>
                                    addTreatment(projectIndex, surfaceIndex)
                                  }
                                  variant="secondary"
                                >
                                  Lägg till behandling
                                </Button>
                              </div>
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
                    <div>Verktyg --- Material --- Arbetsplatformar</div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      ))}
      <Button
        onClick={() =>
          setProjects([
            ...projects,
            {
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
          ])
        }
      >
        Lägg till nytt projekt
      </Button>
    </div>
  );
}

// "use client";

// import React, { useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
// import Link from "next/link";
// import { Home } from "lucide-react";

// import { format, differenceInBusinessDays, addHours } from "date-fns";
// import {
//   Accordion,
//   AccordionItem,
//   AccordionTrigger,
//   AccordionContent,
// } from "@radix-ui/react-accordion"; // Importera för ackordion

// const UNDERLAG_OPTIONS = [
//   { value: "betong", label: "Betong" },
//   { value: "trä", label: "Trä" },
//   { value: "gips", label: "Gips" },
//   { value: "puts", label: "Puts" },
//   { value: "plåt", label: "Plåt" },
// ];

// const SLUTYTA_OPTIONS = [
//   { value: "målad", label: "Målad" },
//   { value: "tapetserad", label: "Tapetserad" },
//   { value: "lackad", label: "Lackad" },
//   { value: "oljebehandlad", label: "Oljebehandlad" },
//   { value: "obehandlad", label: "Obehandlad" },
// ];

// const BEHANDLINGAR = [
//   "Tvättning",
//   "Uppskrapning",
//   "I och påspackling",
//   "Avslipning",
//   "Spackling",
//   "Grundning",
//   "Färdigstrykning",
// ];

// const TORKTID = {
//   Grundning: 4,
//   Spackling: 12,
//   Färdigstrykning: 6,
// };

// const App = () => {
//   const [projects, setProjects] = useState([]);
//   const [projectName, setProjectName] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [selectedBehandling, setSelectedBehandling] = useState("");

//   const createProject = () => {
//     const newProject = {
//       id: Date.now(),
//       name: projectName || `Projekt ${projects.length + 1}`,
//       start: startDate || null,
//       stop: endDate || null,
//       finished: false,
//       ytor: [],
//     };
//     setProjects([...projects, newProject]);
//     setProjectName("");
//     setStartDate("");
//     setEndDate("");
//   };

//   const addYta = (projectId) => {
//     const updated = projects.map((p) => {
//       if (p.id === projectId) {
//         const newYta = {
//           id: Date.now(),
//           name: `Yta ${p.ytor.length + 1}`,
//           kvm: "",
//           underlag: "",
//           slutbehandling: "",
//           behandlingar: [],
//         };
//         return { ...p, ytor: [...p.ytor, newYta] };
//       }
//       return p;
//     });
//     setProjects(updated);
//   };

//   const updateYta = (projectId, ytaId, field, value) => {
//     const updated = projects.map((p) => {
//       if (p.id === projectId) {
//         const ytor = p.ytor.map((yta) =>
//           yta.id === ytaId ? { ...yta, [field]: value } : yta
//         );
//         return { ...p, ytor };
//       }
//       return p;
//     });
//     setProjects(updated);
//   };

//   const toggleBehandlingDone = (projectId, ytaId, index) => {
//     const updated = projects.map((p) => {
//       if (p.id === projectId) {
//         const ytor = p.ytor.map((yta) => {
//           if (yta.id === ytaId) {
//             const behandlingar = yta.behandlingar.map((b, i) =>
//               i === index
//                 ? {
//                     ...b,
//                     done: !b.done,
//                     torktid: calculateTorktid(b.name, b.startDate),
//                   }
//                 : b
//             );
//             return { ...yta, behandlingar };
//           }
//           return yta;
//         });
//         return { ...p, ytor };
//       }
//       return p;
//     });
//     setProjects(updated);
//   };

//   const addBehandlingToYta = (projectId, ytaId) => {
//     if (!selectedBehandling) return;
//     const updated = projects.map((p) => {
//       if (p.id === projectId) {
//         const ytor = p.ytor.map((yta) => {
//           if (yta.id === ytaId) {
//             return {
//               ...yta,
//               behandlingar: [
//                 ...yta.behandlingar,
//                 {
//                   name: selectedBehandling,
//                   done: false,
//                   startDate: new Date(),
//                   torktid: null,
//                 },
//               ],
//             };
//           }
//           return yta;
//         });
//         return { ...p, ytor };
//       }
//       return p;
//     });
//     setProjects(updated);
//   };

//   const calculateTorktid = (behandling, startDate) => {
//     const torktid = TORKTID[behandling];
//     if (!torktid) return null;
//     return addHours(new Date(startDate), torktid);
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <div className="p-4 space-y-4">
//         <Link href="/" className="w-full">
//           <Button variant="outline">
//             <Home className="w-6 h-6" />
//             Hem
//           </Button>
//         </Link>

//         <Card>
//           <CardContent className="space-y-2 p-4">
//             <h2 className="text-xl font-bold">Skapa nytt projekt</h2>
//             <Label htmlFor="projectName">Projektnamn</Label>
//             <Input
//               id="projectName"
//               value={projectName}
//               onChange={(e) => setProjectName(e.target.value)}
//               placeholder="Målningsarbete våren 2025"
//             />
//             <Label>Startdatum</Label>
//             <Input
//               type="date"
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//             />
//             <Label>Slutdatum</Label>
//             <Input
//               type="date"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//             />
//             <Button onClick={createProject}>Skapa projekt</Button>
//           </CardContent>
//         </Card>

//         <div className="space-y-4">
//           {projects.map((project) => (
//             <Accordion key={project.id} type="single" collapsible>
//               <AccordionItem value={`project-${project.id}`}>
//                 <AccordionTrigger className="p-4 flex justify-between items-center">
//                   <h3 className="text-lg font-semibold">
//                     {project.name} {project.finished ? "(Färdigt)" : ""}
//                   </h3>
//                   <div className="flex gap-2">
//                     <Button
//                       onClick={() => addYta(project.id)}
//                       variant="outline"
//                     >
//                       Lägg till yta
//                     </Button>
//                     <Button
//                       onClick={() => toggleProjectFinished(project.id)}
//                       variant="secondary"
//                     >
//                       {project.finished
//                         ? "Markera som ofärdigt"
//                         : "Markera som färdigt"}
//                     </Button>
//                   </div>
//                 </AccordionTrigger>
//                 <AccordionContent className="p-4 space-y-4">
//                   <p>
//                     {project.start && project.stop
//                       ? `Start: ${project.start}, Slut: ${
//                           project.stop
//                         } — Arbetsdagar: ${differenceInBusinessDays(
//                           new Date(project.stop),
//                           new Date(project.start)
//                         )}`
//                       : "Inget start/stoppdatum"}
//                   </p>
//                   {project.ytor.map((yta) => (
//                     <div key={yta.id} className="border p-2 rounded space-y-2">
//                       <Label>Namn</Label>
//                       <Input
//                         value={yta.name}
//                         onChange={(e) =>
//                           updateYta(project.id, yta.id, "name", e.target.value)
//                         }
//                       />
//                       <Label>Kvadratmeter</Label>
//                       <Input
//                         type="number"
//                         value={yta.kvm}
//                         onChange={(e) =>
//                           updateYta(project.id, yta.id, "kvm", e.target.value)
//                         }
//                       />
//                       <Label>Underlag</Label>
//                       <select
//                         className="w-full border rounded px-2 py-1"
//                         value={yta.underlag}
//                         onChange={(e) =>
//                           updateYta(
//                             project.id,
//                             yta.id,
//                             "underlag",
//                             e.target.value
//                           )
//                         }
//                       >
//                         <option value="">Välj underlag</option>
//                         {UNDERLAG_OPTIONS.map((opt) => (
//                           <option key={opt.value} value={opt.value}>
//                             {opt.label}
//                           </option>
//                         ))}
//                       </select>
//                       <Label>Slutyta</Label>
//                       <select
//                         className="w-full border rounded px-2 py-1"
//                         value={yta.slutbehandling}
//                         onChange={(e) =>
//                           updateYta(
//                             project.id,
//                             yta.id,
//                             "slutbehandling",
//                             e.target.value
//                           )
//                         }
//                       >
//                         <option value="">Välj slutbehandling</option>
//                         {SLUTYTA_OPTIONS.map((opt) => (
//                           <option key={opt.value} value={opt.value}>
//                             {opt.label}
//                           </option>
//                         ))}
//                       </select>
//                       <div>
//                         <Label>Behandlingar</Label>
//                         <div className="flex items-center gap-2 mb-2">
//                           <select
//                             className="border rounded px-2 py-1"
//                             value={selectedBehandling}
//                             onChange={(e) =>
//                               setSelectedBehandling(e.target.value)
//                             }
//                           >
//                             <option value="">Välj behandling</option>
//                             {BEHANDLINGAR.map((b) => (
//                               <option key={b} value={b}>
//                                 {b}
//                               </option>
//                             ))}
//                           </select>
//                           <Button
//                             variant="secondary"
//                             onClick={() =>
//                               addBehandlingToYta(project.id, yta.id)
//                             }
//                           >
//                             Lägg till behandling
//                           </Button>
//                         </div>
//                         <ul className="list-inside space-y-1">
//                           {yta.behandlingar.map((b, index) => (
//                             <li key={index} className="flex items-center gap-2">
//                               <Checkbox
//                                 checked={b.done}
//                                 onCheckedChange={() =>
//                                   toggleBehandlingDone(
//                                     project.id,
//                                     yta.id,
//                                     index
//                                   )
//                                 }
//                               />
//                               <span
//                                 className={
//                                   b.done ? "line-through text-gray-500" : ""
//                                 }
//                               >
//                                 {b.name}
//                               </span>
//                               <Input
//                                 type="number"
//                                 placeholder="Tid (timmar)"
//                                 value={b.arbetadTid || ""}
//                                 onChange={(e) =>
//                                   updateBehandling(
//                                     project.id,
//                                     yta.id,
//                                     index,
//                                     "arbetadTid",
//                                     e.target.value
//                                   )
//                                 }
//                               />
//                               {b.torktid && (
//                                 <span className="text-sm text-green-500">
//                                   Torktid klar:{" "}
//                                   {format(
//                                     new Date(b.torktid),
//                                     "yyyy-MM-dd HH:mm"
//                                   )}
//                                 </span>
//                               )}
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     </div>
//                   ))}
//                 </AccordionContent>
//               </AccordionItem>
//             </Accordion>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default App;
