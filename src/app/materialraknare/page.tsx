"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const products = [
  { name: "Spackel", unit: "liter", defaultConsumption: 0.67 },
  { name: "Väggfärg", unit: "liter", defaultConsumption: 0.17 },
  { name: "Snickerifärg", unit: "liter", defaultConsumption: 0.2 },
  { name: "Tapetklister", unit: "liter", defaultConsumption: 0.25 },
  { name: "Lackfärg", unit: "liter", defaultConsumption: 0.15 },
  { name: "Golvpapp", unit: "rullar", defaultConsumption: 0.05 },
  { name: "Tapetrullar", unit: "rullar", defaultConsumption: 0.2 },
  { name: "Tejp", unit: "rullar", defaultConsumption: 0.1 },
];

export default function MaterialCalculator() {
  const [sqm, setSqm] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [customConsumption, setCustomConsumption] = useState(
    selectedProduct.defaultConsumption
  );
  const [items, setItems] = useState([]);

  const calculatedAmount = Math.ceil(sqm * customConsumption);

  const addItem = () => {
    setItems([
      ...items,
      {
        name: selectedProduct.name,
        unit: selectedProduct.unit,
        sqm,
        consumption: customConsumption,
        amount: calculatedAmount,
        comment: "", // Set an empty comment initially
      },
    ]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateComment = (index, comment) => {
    const updatedItems = [...items];
    updatedItems[index].comment = comment;
    setItems(updatedItems);
  };

  return (
    <>
      <Link href="/" className="w-full">
        <Button variant="outline">
          <Home className="w-6 h-6" />
          Hem
        </Button>
      </Link>
      <Card className="max-w-xl mx-auto p-4 mt-6">
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="sqm">Antal kvm</Label>
            <Input
              id="sqm"
              type="number"
              min={0}
              value={sqm}
              onChange={(e) => setSqm(Number(e.target.value))}
              placeholder="Skriv in yta i m²"
            />
          </div>

          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Label>Välj produkt</Label>
              <Select
                value={selectedProduct.name}
                onValueChange={(value) => {
                  const prod = products.find((p) => p.name === value);
                  if (prod) {
                    setSelectedProduct(prod);
                    setCustomConsumption(prod.defaultConsumption);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Välj produkt" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.name} value={product.name}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={addItem}>Lägg till</Button>
          </div>

          <div>
            <Label htmlFor="consumption">Materialåtgång (per m²)</Label>
            <Input
              id="consumption"
              type="number"
              step="0.01"
              value={customConsumption}
              onChange={(e) => setCustomConsumption(Number(e.target.value))}
            />
          </div>

          <div className="text-lg font-medium">
            Du behöver cirka <strong>{calculatedAmount}</strong>{" "}
            {selectedProduct.unit} {selectedProduct.name}
          </div>

          {items.length > 0 && (
            <div className="pt-4">
              <h3 className="text-md font-semibold">Valda material</h3>
              <ul className="space-y-2 mt-2">
                {items.map((item, idx) => (
                  <li key={idx} className="border rounded p-2 space-y-1">
                    <div>
                      {item.name}: {item.amount} {item.unit} för {item.sqm} m²
                      (åtgång: {item.consumption}/m²)
                    </div>
                    {/* {item.comment && (
                    <div className="text-sm text-muted-foreground">
                      Kommentar: {item.comment}
                    </div>
                  )} */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeItem(idx)}
                    >
                      Ta bort
                    </Button>
                    <div>
                      <Label htmlFor={`comment-${idx}`}>
                        Kommentar (valfri)
                      </Label>
                      <Input
                        id={`comment-${idx}`}
                        type="text"
                        value={item.comment}
                        onChange={(e) => updateComment(idx, e.target.value)}
                        placeholder="T.ex. produkt'"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
