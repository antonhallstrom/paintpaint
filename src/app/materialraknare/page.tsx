"use client";

import React, { useState, useEffect } from "react";
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

const standardProducts = [
  { name: "Spackel", unit: "liter", defaultConsumption: 0.9 },
  { name: "Väggfärg", unit: "liter", defaultConsumption: 0.12 },
  { name: "Snickerifärg", unit: "liter", defaultConsumption: 0.12 },
  { name: "Tapetklister", unit: "liter", defaultConsumption: 0.25 },
  { name: "Lackfärg", unit: "liter", defaultConsumption: 0.08 },
  { name: "Grundfärg", unit: "liter", defaultConsumption: 0.1 },
  { name: "Takfärg", unit: "liter", defaultConsumption: 0.12 },
  { name: "Elementfärg", unit: "liter", defaultConsumption: 0.12 },
  { name: "Metallfärg", unit: "liter", defaultConsumption: 0.13 },
];

const rollProducts = [
  { name: "Tapetrullar", defaultRollLength: 1000 }, // cm
  { name: "Golvpapp", defaultRollLength: 4000 },
  { name: "Tejp", defaultRollLength: 2500 },
  { name: "Väv", defaultRollLength: 3000 },
  { name: "Gipsremsor", defaultRollLength: 2000 },
  { name: "Skarvremsor", defaultRollLength: 2000 },
];

export default function MaterialCalculator() {
  const [sqm, setSqm] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(standardProducts[0]);
  const [customConsumption, setCustomConsumption] = useState(
    selectedProduct.defaultConsumption
  );
  const [items, setItems] = useState([]);

  const [selectedRollProduct, setSelectedRollProduct] = useState(
    rollProducts[0].name
  );
  const [wallWidth, setWallWidth] = useState("");
  const [wallHeight, setWallHeight] = useState("");
  const [rollWidth, setRollWidth] = useState("53"); // cm
  const [patternRepeat, setPatternRepeat] = useState("0");
  const [rollLength, setRollLength] = useState(1000); // cm (default 10m)

  useEffect(() => {
    const prod = rollProducts.find((p) => p.name === selectedRollProduct);
    if (prod) setRollLength(prod.defaultRollLength);
  }, [selectedRollProduct]);

  const convertToCm = (val) => (isNaN(val) ? 0 : Number(val));

  const calculateStandardAmount = Math.ceil(sqm * customConsumption);

  const addStandardItem = () => {
    setItems([
      ...items,
      {
        name: selectedProduct.name,
        unit: selectedProduct.unit,
        sqm,
        consumption: customConsumption,
        amount: calculateStandardAmount,
        comment: "",
      },
    ]);
  };

  const calculateRolls = () => {
    const width = convertToCm(Number(wallWidth));
    const height = convertToCm(Number(wallHeight));
    const rollW = convertToCm(Number(rollWidth));
    const repeat = convertToCm(Number(patternRepeat));

    if (!width || !height || !rollW) return 0;

    const effectiveDrop = repeat ? Math.ceil(height / repeat) * repeat : height;

    const dropsPerRoll = Math.floor(rollLength / effectiveDrop);
    const dropsNeeded = Math.ceil(width / rollW);

    return dropsPerRoll > 0 ? Math.ceil(dropsNeeded / dropsPerRoll) : 0;
  };

  const addRollItem = () => {
    setItems([
      ...items,
      {
        name: selectedRollProduct,
        unit: "rullar",
        amount: calculateRolls(),
        width: wallWidth,
        height: wallHeight,
        comment: "",
      },
    ]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateComment = (index, comment) => {
    const updated = [...items];
    updated[index].comment = comment;
    setItems(updated);
  };

  return (
    <>
      <Link href="/" className="w-full">
        <Button variant="outline">
          <Home className="w-6 h-6" />
          Hem
        </Button>
      </Link>

      <Card className="max-w-xl mx-auto p-4 mt-6 space-y-8">
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold">Färg och spackelräknare</h2>

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
                  const prod = standardProducts.find((p) => p.name === value);
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
                  {standardProducts.map((product) => (
                    <SelectItem key={product.name} value={product.name}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={addStandardItem}>Lägg till</Button>
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
            Du behöver cirka <strong>{calculateStandardAmount}</strong>{" "}
            {selectedProduct.unit} {selectedProduct.name}
          </div>
        </CardContent>

        <CardContent className="space-y-4 pt-6 border-t">
          <h2 className="text-xl font-semibold">Rullproduktsräknare</h2>

          <div>
            <Label>Välj produkt</Label>
            <Select
              value={selectedRollProduct}
              onValueChange={(value) => setSelectedRollProduct(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Välj rullprodukt" />
              </SelectTrigger>
              <SelectContent>
                {rollProducts.map((product) => (
                  <SelectItem key={product.name} value={product.name}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Väggbredd (meter)</Label>
              <Input
                value={wallWidth}
                onChange={(e) => setWallWidth(e.target.value)}
              />
            </div>

            <div>
              <Label>Väggens höjd (meter)</Label>
              <Input
                value={wallHeight}
                onChange={(e) => setWallHeight(e.target.value)}
              />
            </div>

            <div>
              <Label>Rullens bredd (cm)</Label>
              <Input
                value={rollWidth}
                onChange={(e) => setRollWidth(e.target.value)}
              />
            </div>

            <div>
              <Label>Mönsterpassning (cm)</Label>
              <Input
                value={patternRepeat}
                onChange={(e) => setPatternRepeat(e.target.value)}
              />
            </div>

            <div>
              <Label>Rullängd (meter)</Label>
              <Input
                type="number"
                value={rollLength / 100}
                onChange={(e) => setRollLength(Number(e.target.value) * 100)}
              />
            </div>
          </div>

          <div className="text-lg font-medium">
            Du behöver cirka <strong>{calculateRolls()}</strong> rullar{" "}
            {selectedRollProduct}
          </div>

          <Button onClick={addRollItem}>Lägg till</Button>
        </CardContent>

        {items.length > 0 && (
          <CardContent className="space-y-4 pt-6 border-t">
            <h3 className="text-lg font-semibold">Valda material</h3>
            <ul className="space-y-2">
              {items.map((item, idx) => (
                <li key={idx} className="border rounded p-2 space-y-1">
                  <div>
                    {item.name}: {item.amount} {item.unit}
                    {item.sqm && ` för ${item.sqm} m²`}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeItem(idx)}
                  >
                    Ta bort
                  </Button>
                  <div>
                    <Label htmlFor={`comment-${idx}`}>Kommentar (valfri)</Label>
                    <Input
                      id={`comment-${idx}`}
                      type="text"
                      value={item.comment}
                      onChange={(e) => updateComment(idx, e.target.value)}
                      placeholder="T.ex. typ av rum"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        )}
      </Card>
    </>
  );
}

// "use client";

// import React, { useState } from "react";
// import Link from "next/link";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Home } from "lucide-react";

// const products = [
//   { name: "Spackel", unit: "liter", defaultConsumption: 0.67 },
//   { name: "Väggfärg", unit: "liter", defaultConsumption: 0.17 },
//   { name: "Snickerifärg", unit: "liter", defaultConsumption: 0.2 },
//   { name: "Tapetklister", unit: "liter", defaultConsumption: 0.25 },
//   { name: "Lackfärg", unit: "liter", defaultConsumption: 0.15 },
//   { name: "Golvpapp", unit: "rullar", defaultConsumption: 0.05 },
//   { name: "Tapetrullar", unit: "rullar", defaultConsumption: 0.2 },
//   { name: "Tejp", unit: "rullar", defaultConsumption: 0.1 },
// ];

// export default function MaterialCalculator() {
//   const [sqm, setSqm] = useState(0);
//   const [selectedProduct, setSelectedProduct] = useState(products[0]);
//   const [customConsumption, setCustomConsumption] = useState(
//     selectedProduct.defaultConsumption
//   );
//   const [items, setItems] = useState([]);

//   const calculatedAmount = Math.ceil(sqm * customConsumption);

//   const addItem = () => {
//     setItems([
//       ...items,
//       {
//         name: selectedProduct.name,
//         unit: selectedProduct.unit,
//         sqm,
//         consumption: customConsumption,
//         amount: calculatedAmount,
//         comment: "", // Set an empty comment initially
//       },
//     ]);
//   };

//   const removeItem = (index) => {
//     setItems(items.filter((_, i) => i !== index));
//   };

//   const updateComment = (index, comment) => {
//     const updatedItems = [...items];
//     updatedItems[index].comment = comment;
//     setItems(updatedItems);
//   };

//   return (
//     <>
//       <Link href="/" className="w-full">
//         <Button variant="outline">
//           <Home className="w-6 h-6" />
//           Hem
//         </Button>
//       </Link>
//       <Card className="max-w-xl mx-auto p-4 mt-6">
//         <CardContent className="space-y-4">
//           <div>
//             <Label htmlFor="sqm">Antal kvm</Label>
//             <Input
//               id="sqm"
//               type="number"
//               min={0}
//               value={sqm}
//               onChange={(e) => setSqm(Number(e.target.value))}
//               placeholder="Skriv in yta i m²"
//             />
//           </div>

//           <div className="flex items-end gap-2">
//             <div className="flex-1">
//               <Label>Välj produkt</Label>
//               <Select
//                 value={selectedProduct.name}
//                 onValueChange={(value) => {
//                   const prod = products.find((p) => p.name === value);
//                   if (prod) {
//                     setSelectedProduct(prod);
//                     setCustomConsumption(prod.defaultConsumption);
//                   }
//                 }}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Välj produkt" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {products.map((product) => (
//                     <SelectItem key={product.name} value={product.name}>
//                       {product.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <Button onClick={addItem}>Lägg till</Button>
//           </div>

//           <div>
//             <Label htmlFor="consumption">Materialåtgång (per m²)</Label>
//             <Input
//               id="consumption"
//               type="number"
//               step="0.01"
//               value={customConsumption}
//               onChange={(e) => setCustomConsumption(Number(e.target.value))}
//             />
//           </div>

//           <div className="text-lg font-medium">
//             Du behöver cirka <strong>{calculatedAmount}</strong>{" "}
//             {selectedProduct.unit} {selectedProduct.name}
//           </div>

//           {items.length > 0 && (
//             <div className="pt-4">
//               <h3 className="text-md font-semibold">Valda material</h3>
//               <ul className="space-y-2 mt-2">
//                 {items.map((item, idx) => (
//                   <li key={idx} className="border rounded p-2 space-y-1">
//                     <div>
//                       {item.name}: {item.amount} {item.unit} för {item.sqm} m²
//                       (åtgång: {item.consumption}/m²)
//                     </div>
//                     {/* {item.comment && (
//                     <div className="text-sm text-muted-foreground">
//                       Kommentar: {item.comment}
//                     </div>
//                   )} */}
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       onClick={() => removeItem(idx)}
//                     >
//                       Ta bort
//                     </Button>
//                     <div>
//                       <Label htmlFor={`comment-${idx}`}>
//                         Kommentar (valfri)
//                       </Label>
//                       <Input
//                         id={`comment-${idx}`}
//                         type="text"
//                         value={item.comment}
//                         onChange={(e) => updateComment(idx, e.target.value)}
//                         placeholder="T.ex. produkt'"
//                       />
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </>
//   );
// }
