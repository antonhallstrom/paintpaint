/* eslint-disable @typescript-eslint/no-unused-vars */
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  ClipboardList,
  Calculator,
  Car,
  Cuboid,
  Hammer,
  BookOpen,
  DatabaseBackup,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 max-w-4xl w-full">
        <Link href="/larlingsrapportering" className="w-full">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center p-6 gap-4 text-lg rounded-2xl shadow hover:shadow-lg transition"
          >
            <ClipboardList className="w-6 h-6" />
            Lärlingsrapportering
          </Button>
        </Link>

        <Link href="/projekt" className="w-full">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center p-6 gap-4 text-lg rounded-2xl shadow hover:shadow-lg transition"
          >
            <Briefcase className="w-6 h-6" />
            Projekt
          </Button>
        </Link>

        <Link href="/estimera" className="w-full">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center p-6 gap-4 text-lg rounded-2xl shadow hover:shadow-lg transition"
          >
            <Calculator className="w-6 h-6" />
            Estimera
          </Button>
        </Link>

        <Link href="/amakodtolk" className="w-full">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center p-6 gap-4 text-lg rounded-2xl shadow hover:shadow-lg transition"
          >
            <BookOpen className="w-6 h-6" />
            Ama kod tolk
          </Button>
        </Link>

        <Link href="/materialraknare" className="w-full">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center p-6 gap-4 text-lg rounded-2xl shadow hover:shadow-lg transition"
          >
            <Cuboid className="w-6 h-6" />
            Materialräknare
          </Button>
        </Link>

        <Link href="/datamanager" className="w-full">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center p-6 gap-4 text-lg rounded-2xl shadow hover:shadow-lg transition"
          >
            <DatabaseBackup className="w-6 h-6" />
            Import / Export
          </Button>
        </Link>

        {/* <Link href="/reseersattning" className="w-full">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center p-6 gap-4 text-lg rounded-2xl shadow hover:shadow-lg transition"
          >
            <Car className="w-6 h-6" />
            Reserersättning
          </Button>
        </Link>

        <Link href="/material" className="w-full">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center p-6 gap-4 text-lg rounded-2xl shadow hover:shadow-lg transition"
          >
            <Cuboid className="w-6 h-6" />
            Identifiera material
          </Button>
        </Link>

        <Link href="/fakta" className="w-full">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center p-6 gap-4 text-lg rounded-2xl shadow hover:shadow-lg transition"
          >
            <Hammer className="w-6 h-6" />
            Verktyg och skötsel
          </Button>
        </Link>

        <Link href="/fakta" className="w-full">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center p-6 gap-4 text-lg rounded-2xl shadow hover:shadow-lg transition"
          >
            <BookOpen className="w-6 h-6" />
            Fakta
          </Button>
        </Link> */}
      </div>
    </main>
  );
}
