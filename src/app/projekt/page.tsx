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
  // Ladda projekt från localStorage när komponenten mountas
  useEffect(() => {
    const stored = localStorage.getItem("projects");
    if (stored) {
      try {
        setProjects(JSON.parse(stored));
      } catch (err) {
        console.error("Kunde inte parsa localStorage-data:", err);
      }
    } else {
      // Initiera med ett tomt projekt
      setProjects([
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
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
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
        id: crypto.randomUUID(), // 👈 Lägg till unikt id
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

  const updateTreatments = (projectIndex, surfaceIndex, newTreatments) => {
    const updated = [...projects];
    updated[projectIndex].surfaces[surfaceIndex].treatments = newTreatments;
    setProjects(updated);
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
                  <div className="m-4 space-y-2">
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
                              <div className="flex">
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
                                    <SelectItem value="betong">
                                      Betong
                                    </SelectItem>
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
                                    <SelectItem value="slipad">
                                      Slipad
                                    </SelectItem>
                                    <SelectItem value="tapetserad">
                                      Tapetserad
                                    </SelectItem>
                                    <SelectItem value="lackad">
                                      Lackad
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
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
                    <div>Verktyg --- Material --- Arbetsplatformar</div>
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
