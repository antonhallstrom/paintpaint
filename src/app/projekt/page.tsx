"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { Home } from "lucide-react";

import { format, differenceInBusinessDays, addHours } from "date-fns";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@radix-ui/react-accordion"; // Importera för ackordion

const UNDERLAG_OPTIONS = [
  { value: "betong", label: "Betong" },
  { value: "trä", label: "Trä" },
  { value: "gips", label: "Gips" },
  { value: "puts", label: "Puts" },
  { value: "plåt", label: "Plåt" },
];

const SLUTYTA_OPTIONS = [
  { value: "målad", label: "Målad" },
  { value: "tapetserad", label: "Tapetserad" },
  { value: "lackad", label: "Lackad" },
  { value: "oljebehandlad", label: "Oljebehandlad" },
  { value: "obehandlad", label: "Obehandlad" },
];

const BEHANDLINGAR = [
  "Tvättning",
  "Uppskrapning",
  "I och påspackling",
  "Avslipning",
  "Spackling",
  "Grundning",
  "Färdigstrykning",
];

const TORKTID = {
  Grundning: 4,
  Spackling: 12,
  Färdigstrykning: 6,
};

const App = () => {
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedBehandling, setSelectedBehandling] = useState("");

  const createProject = () => {
    const newProject = {
      id: Date.now(),
      name: projectName || `Projekt ${projects.length + 1}`,
      start: startDate || null,
      stop: endDate || null,
      finished: false,
      ytor: [],
    };
    setProjects([...projects, newProject]);
    setProjectName("");
    setStartDate("");
    setEndDate("");
  };

  const addYta = (projectId) => {
    const updated = projects.map((p) => {
      if (p.id === projectId) {
        const newYta = {
          id: Date.now(),
          name: `Yta ${p.ytor.length + 1}`,
          kvm: "",
          underlag: "",
          slutbehandling: "",
          behandlingar: [],
        };
        return { ...p, ytor: [...p.ytor, newYta] };
      }
      return p;
    });
    setProjects(updated);
  };

  const updateYta = (projectId, ytaId, field, value) => {
    const updated = projects.map((p) => {
      if (p.id === projectId) {
        const ytor = p.ytor.map((yta) =>
          yta.id === ytaId ? { ...yta, [field]: value } : yta
        );
        return { ...p, ytor };
      }
      return p;
    });
    setProjects(updated);
  };

  const toggleBehandlingDone = (projectId, ytaId, index) => {
    const updated = projects.map((p) => {
      if (p.id === projectId) {
        const ytor = p.ytor.map((yta) => {
          if (yta.id === ytaId) {
            const behandlingar = yta.behandlingar.map((b, i) =>
              i === index
                ? {
                    ...b,
                    done: !b.done,
                    torktid: calculateTorktid(b.name, b.startDate),
                  }
                : b
            );
            return { ...yta, behandlingar };
          }
          return yta;
        });
        return { ...p, ytor };
      }
      return p;
    });
    setProjects(updated);
  };

  const addBehandlingToYta = (projectId, ytaId) => {
    if (!selectedBehandling) return;
    const updated = projects.map((p) => {
      if (p.id === projectId) {
        const ytor = p.ytor.map((yta) => {
          if (yta.id === ytaId) {
            return {
              ...yta,
              behandlingar: [
                ...yta.behandlingar,
                {
                  name: selectedBehandling,
                  done: false,
                  startDate: new Date(),
                  torktid: null,
                },
              ],
            };
          }
          return yta;
        });
        return { ...p, ytor };
      }
      return p;
    });
    setProjects(updated);
  };

  const calculateTorktid = (behandling, startDate) => {
    const torktid = TORKTID[behandling];
    if (!torktid) return null;
    return addHours(new Date(startDate), torktid);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="p-4 space-y-4">
        <Link href="/" className="w-full">
          <Button variant="outline">
            <Home className="w-6 h-6" />
            Hem
          </Button>
        </Link>

        <Card>
          <CardContent className="space-y-2 p-4">
            <h2 className="text-xl font-bold">Skapa nytt projekt</h2>
            <Label htmlFor="projectName">Projektnamn</Label>
            <Input
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Målningsarbete våren 2025"
            />
            <Label>Startdatum</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Label>Slutdatum</Label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <Button onClick={createProject}>Skapa projekt</Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {projects.map((project) => (
            <Accordion key={project.id} type="single" collapsible>
              <AccordionItem value={`project-${project.id}`}>
                <AccordionTrigger className="p-4 flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    {project.name} {project.finished ? "(Färdigt)" : ""}
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => addYta(project.id)}
                      variant="outline"
                    >
                      Lägg till yta
                    </Button>
                    <Button
                      onClick={() => toggleProjectFinished(project.id)}
                      variant="secondary"
                    >
                      {project.finished
                        ? "Markera som ofärdigt"
                        : "Markera som färdigt"}
                    </Button>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 space-y-4">
                  <p>
                    {project.start && project.stop
                      ? `Start: ${project.start}, Slut: ${
                          project.stop
                        } — Arbetsdagar: ${differenceInBusinessDays(
                          new Date(project.stop),
                          new Date(project.start)
                        )}`
                      : "Inget start/stoppdatum"}
                  </p>
                  {project.ytor.map((yta) => (
                    <div key={yta.id} className="border p-2 rounded space-y-2">
                      <Label>Namn</Label>
                      <Input
                        value={yta.name}
                        onChange={(e) =>
                          updateYta(project.id, yta.id, "name", e.target.value)
                        }
                      />
                      <Label>Kvadratmeter</Label>
                      <Input
                        type="number"
                        value={yta.kvm}
                        onChange={(e) =>
                          updateYta(project.id, yta.id, "kvm", e.target.value)
                        }
                      />
                      <Label>Underlag</Label>
                      <select
                        className="w-full border rounded px-2 py-1"
                        value={yta.underlag}
                        onChange={(e) =>
                          updateYta(
                            project.id,
                            yta.id,
                            "underlag",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Välj underlag</option>
                        {UNDERLAG_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <Label>Slutyta</Label>
                      <select
                        className="w-full border rounded px-2 py-1"
                        value={yta.slutbehandling}
                        onChange={(e) =>
                          updateYta(
                            project.id,
                            yta.id,
                            "slutbehandling",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Välj slutbehandling</option>
                        {SLUTYTA_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <div>
                        <Label>Behandlingar</Label>
                        <div className="flex items-center gap-2 mb-2">
                          <select
                            className="border rounded px-2 py-1"
                            value={selectedBehandling}
                            onChange={(e) =>
                              setSelectedBehandling(e.target.value)
                            }
                          >
                            <option value="">Välj behandling</option>
                            {BEHANDLINGAR.map((b) => (
                              <option key={b} value={b}>
                                {b}
                              </option>
                            ))}
                          </select>
                          <Button
                            variant="secondary"
                            onClick={() =>
                              addBehandlingToYta(project.id, yta.id)
                            }
                          >
                            Lägg till behandling
                          </Button>
                        </div>
                        <ul className="list-inside space-y-1">
                          {yta.behandlingar.map((b, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <Checkbox
                                checked={b.done}
                                onCheckedChange={() =>
                                  toggleBehandlingDone(
                                    project.id,
                                    yta.id,
                                    index
                                  )
                                }
                              />
                              <span
                                className={
                                  b.done ? "line-through text-gray-500" : ""
                                }
                              >
                                {b.name}
                              </span>
                              <Input
                                type="number"
                                placeholder="Tid (timmar)"
                                value={b.arbetadTid || ""}
                                onChange={(e) =>
                                  updateBehandling(
                                    project.id,
                                    yta.id,
                                    index,
                                    "arbetadTid",
                                    e.target.value
                                  )
                                }
                              />
                              {b.torktid && (
                                <span className="text-sm text-green-500">
                                  Torktid klar:{" "}
                                  {format(
                                    new Date(b.torktid),
                                    "yyyy-MM-dd HH:mm"
                                  )}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
