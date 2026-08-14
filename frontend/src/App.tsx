import { Button } from "@/components/ui/button";

export default function App() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">StockFlow</h1>

        <p className="mt-2 text-gray-600">
          Inventory Management Platform
        </p>

        <Button className="mt-6">Create Product</Button>
      </div>
    </main>
  );
}
