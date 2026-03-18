import { Suspense } from "react";
import ProductManagement from "./ProductManagement";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ProductManagement />
    </Suspense>
  );
}
