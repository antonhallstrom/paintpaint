/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { addDays, format, getWeek } from "date-fns";
import { DateRange } from "react-date-range";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil, Copy, Home } from "lucide-react";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const workStructure = {
  "Invändig målning": {
    Snickerier: ["Underbehandling", "Målning"],
    "Tak & Väggar": [
      "Underbehandling",
      "Målning",
      "Tapetsering",
      "Vävsättning",
    ],
  },
  "Utvändig målning": {
    "Trä & Mineraliska ytor": ["Underbehandling", "Målning"],
    Fönster: ["Underbehandling", "Målning"],
  },
  Övrigt: {
    "Övrigt arbete": [
      "Plåt",
      "Stål",
      "Golv",
      "Facklig information",
      "Branschutbildning",
      "Våtrum",
    ],
  },
};

export default function TimesheetApp() {
  const [category, setCategory] = useState<string | null>(null);
  const [subtype, setSubtype] = useState<string | null>(null);
  const [moment, setMoment] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [hours, setHours] = useState("");
  const [ackordHours, setAckordHours] = useState(""); // Nytt state för ackordtimmar
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [comment, setComment] = useState(""); // Kommentar state
  const [log, setLog] = useState<
    {
      work: string;
      date: string;
      hours: string;
      ackordHours: string;
      comment: string;
    }[] // Lägg till ackordtimmar i loggen
  >([]);
  const [range, setRange] = useState<any>([
    {
      startDate: addDays(new Date(), -7),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const addEntry = () => {
    if (selected && hours && date) {
      const newEntry = {
        work: selected,
        date,
        hours,
        ackordHours, // Lägg till ackordtimmar till loggen
        comment,
      };
      if (editingIndex !== null) {
        const newLog = [...log];
        newLog[editingIndex] = newEntry;
        setLog(newLog);
        setEditingIndex(null);
      } else {
        setLog([...log, newEntry]);
      }
      setSelected(null);
      setHours("");
      setAckordHours(""); // Rensa ackordtimmar
      setDate(format(new Date(), "yyyy-MM-dd"));
      setComment(""); // Rensa kommentar efter tillägg
      setCategory(null);
      setSubtype(null);
      setMoment(null);
    }
  };

  const deleteEntry = (index: number) => {
    const newLog = [...log];
    newLog.splice(index, 1);
    setLog(newLog);
  };

  const editEntry = (index: number) => {
    const entry = log[index];
    setSelected(entry.work);
    setDate(entry.date);
    setHours(entry.hours);
    setAckordHours(entry.ackordHours); // Hämta ackordtimmar vid redigering
    setComment(entry.comment); // Hämta kommentar vid redigering
    setEditingIndex(index);
  };

  const filteredLog = log.filter((entry) => {
    const d = new Date(entry.date);
    return d >= range[0].startDate && d <= range[0].endDate;
  });

  const totalHours = filteredLog.reduce(
    (acc, entry) => acc + parseFloat(entry.hours),
    0
  );
  const totalAckordHours = filteredLog.reduce(
    (acc, entry) => acc + parseFloat(entry.ackordHours),
    0
  );

  const hoursPerDayAndCategory = filteredLog.reduce((acc, entry) => {
    const day = format(new Date(entry.date), "EEEE"); // Get day name
    const key = `${day} > ${entry.work}`;
    if (acc[key]) {
      acc[key].hours += parseFloat(entry.hours);
      acc[key].ackordHours += parseFloat(entry.ackordHours); // Lägg till ackordtimmar
    } else {
      acc[key] = {
        hours: parseFloat(entry.hours),
        ackordHours: parseFloat(entry.ackordHours),
      };
    }
    return acc;
  }, {} as Record<string, { hours: number; ackordHours: number }>);

  const getWeekRange = () => {
    const start = format(range[0].startDate, "yyyy-MM-dd");
    const end = format(range[0].endDate, "yyyy-MM-dd");
    const startWeek = getWeek(range[0].startDate);
    const endWeek = getWeek(range[0].endDate);
    return `${start} - ${end} (Vecka ${startWeek} - Vecka ${endWeek})`;
  };

  const copyLogToClipboard = () => {
    const savedLog = localStorage.getItem("workLog");
    if (savedLog) {
      navigator.clipboard.writeText(savedLog).then(
        () => {
          alert("Arbetslogg kopierad till urklipp!");
        },
        (err) => {
          console.error("Misslyckades med att kopiera till urklipp: ", err);
        }
      );
    } else {
      alert("Ingen arbetslogg finns sparad.");
    }
  };

  useEffect(() => {
    const savedLog = localStorage.getItem("workLog");
    if (savedLog) {
      try {
        const parsedLog = JSON.parse(savedLog);
        setLog(parsedLog);
      } catch (err) {
        console.error("Kunde inte parsa arbetsloggen från localStorage:", err);
      }
    }
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Arbetskort</h1>

      <Button onClick={copyLogToClipboard} className="mt-4">
        <Copy size={16} /> Kopiera arbetslogg
      </Button>

      <Link href="/" className="w-full">
        <Button variant="outline">
          <Home className="w-6 h-6" />
          Hem
        </Button>
      </Link>

      {!category && (
        <>
          <div className="space-y-2">
            <h2>Välj kategori</h2>
            {Object.keys(workStructure).map((cat) => (
              <Button
                className="mr-1"
                key={cat}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
          <div className="pb-2 text-sm text-gray-600">
            Övrigt (Plåt, Stål, Golv, Facklig information, Branschutbildning,
            Våtrum, etc.)
          </div>
        </>
      )}
      {category && !subtype && (
        <>
          <div className="space-y-2">
            <h2>Välj typ av arbete</h2>
            {Object.keys(workStructure[category]).map((type) => (
              <Button
                className="mr-1"
                key={type}
                onClick={() => setSubtype(type)}
              >
                {type}
              </Button>
            ))}
            <div className="pb-2 text-sm text-gray-600">
              Snickerier (dörrar, fönster, rör, element, etc.)
            </div>
            <Button variant="ghost" onClick={() => setCategory(null)}>
              Tillbaka
            </Button>
          </div>
        </>
      )}

      {category && subtype && !moment && (
        <div className="space-y-2">
          <h2>Välj moment</h2>
          {workStructure[category][subtype].map((m) => (
            <Button
              className="mr-1"
              key={m}
              onClick={() => {
                setMoment(m);
                setSelected(`${category} > ${subtype} > ${m}`);
              }}
            >
              {m}
            </Button>
          ))}
          <div className="pb-2 text-sm text-gray-600">
            Underbehandling (slipning, skrapning, spackling, tvättning,
            skyddning, grundning, lägga remsa, i o påspackling)
          </div>
          <div className="pb-2 text-sm text-gray-600">
            Målning-Färdigbehandlingar (strykning, grunding, tapet uppsättning,
            klistring, mellanstrykningar, färdigstrykning)
          </div>
          <Button variant="ghost" onClick={() => setSubtype(null)}>
            Tillbaka
          </Button>
        </div>
      )}

      {selected && (
        <div className="space-y-2">
          <p className="font-medium">Rapportera: {selected}</p>
          <Input
            placeholder="Datum (YYYY-MM-DD)"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <Input
            placeholder="Antal timmar"
            type="number"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />
          <Input
            placeholder="Ackordtimmar"
            type="number"
            value={ackordHours} // Nytt fält för ackordtimmar
            onChange={(e) => setAckordHours(e.target.value)}
          />
          <Input
            placeholder="Kommentar"
            value={comment}
            onChange={(e) => setComment(e.target.value)} // Uppdatera kommentar
          />
          <Button onClick={addEntry}>
            {editingIndex !== null ? "Uppdatera" : "Lägg till"}
          </Button>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold">Välj 2-veckorsperiod</h2>
        <DateRange
          editableDateInputs={true}
          onChange={(item) => setRange([item.selection])}
          moveRangeOnFirstSelection={false}
          ranges={range}
        />
      </div>

      <h2 className="text-lg font-semibold mt-4">
        Rapporterade timmar per dag och kategori ({getWeekRange()})
      </h2>
      <div className="overflow-auto w-full">
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr>
              <th className="border px-2 py-1">Dag</th>
              <th className="border px-2 py-1">Kategori</th>
              <th className="border px-2 py-1">Timmar</th>
              <th className="border px-2 py-1">Ackordtimmar</th>{" "}
              {/* Ny kolumn för ackordtimmar */}
            </tr>
          </thead>
          <tbody>
            {Object.keys(hoursPerDayAndCategory).map((key) => {
              const [day, ...categoryParts] = key.split(" > ");
              const { hours, ackordHours } = hoursPerDayAndCategory[key];
              const category = categoryParts.join(" > "); // Kombinera hela flödet igen
              return (
                <tr key={key}>
                  <td className="border px-2 py-1">{day}</td>
                  <td className="border px-2 py-1">{category}</td>
                  <td className="border px-2 py-1">{hours.toFixed(1)} h</td>
                  <td className="border px-2 py-1">
                    {ackordHours.toFixed(1)} h
                  </td>{" "}
                  {/* Ackordtimmar i tabellen */}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <h2 className="text-lg font-semibold mt-4">
        Sammanlagda timmar: {totalHours.toFixed(1)} timmar (inkl. ackordtimmar:{" "}
        {totalAckordHours.toFixed(1)} timmar)
      </h2>

      <h2 className="text-lg font-semibold mt-4">
        Tidigare registrerade arbeten
      </h2>
      <div className="overflow-auto w-full">
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr>
              <th className="border px-2 py-1">Datum</th>
              <th className="border px-2 py-1">Arbete</th>
              <th className="border px-2 py-1">Timmar</th>
              <th className="border px-2 py-1">Ackordtimmar</th>{" "}
              {/* Ackordtimmar i loggen */}
              <th className="border px-2 py-1">Kommentar</th>
              <th className="border px-2 py-1">Åtgärder</th>
            </tr>
          </thead>
          <tbody>
            {log.map((entry, index) => (
              <tr key={index}>
                <td className="border px-2 py-1">{entry.date}</td>
                <td className="border px-2 py-1">{entry.work}</td>
                <td className="border px-2 py-1">{entry.hours} h</td>
                <td className="border px-2 py-1">{entry.ackordHours} h</td>{" "}
                {/* Ackordtimmar i loggen */}
                <td className="border px-2 py-1">{entry.comment}</td>
                <td className="border px-2 py-1">
                  <Button
                    variant="outline"
                    onClick={() => editEntry(index)}
                    className="mr-2"
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button variant="outline" onClick={() => deleteEntry(index)}>
                    <Trash2 size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
