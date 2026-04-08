import { Suspense } from "react";
import InventoryManagement from "./InventoryManagement";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <InventoryManagement />
    </Suspense>
  );
}
