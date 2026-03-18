import { useState } from "react";
import { Branch } from "../types";

export const useBranches = () => {
  const [branches, setBranches] = useState<Branch[]>([
    { id: "1", name: "Bulangon Branch", phone: "09602887539", telephone: "6775351" },
    { id: "2", name: "Barit Branch", phone: "09650321774", telephone: "6775351" },
    { id: "3", name: "Rizal Branch", phone: "09951916946", telephone: "6775351" },
  ]);
  const [newBranch, setNewBranch] = useState({ name: "", phone: "", telephone: "" });
  const [showAddBranch, setShowAddBranch] = useState(false);

  const addBranch = () => {
    if (!newBranch.name) return;
    setBranches((prev) => [...prev, { id: Date.now().toString(), ...newBranch }]);
    setNewBranch({ name: "", phone: "", telephone: "" });
    setShowAddBranch(false);
  };

  const deleteBranch = (id: string) =>
    setBranches((prev) => prev.filter((b) => b.id !== id));

  return {
    branches,
    newBranch,
    setNewBranch,
    showAddBranch,
    setShowAddBranch,
    addBranch,
    deleteBranch,
  };
};