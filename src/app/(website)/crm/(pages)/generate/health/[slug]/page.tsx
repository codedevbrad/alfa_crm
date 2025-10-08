"use client"
import RamsChatWizard from "./ai/component"
import RamsEditable from "./editor"

import { useState } from "react"
import { Rams } from "./rams";

export default function Page() {
     const [rams, setRams] = useState<Rams | null>(null);
    return (
      <div className="p-4">

        <h1 className="text-2xl font-bold mb-4">
          Health Rams Generator
        </h1>

        <div>
          <RamsChatWizard updateRams={setRams} /> 
          { rams && (
            <RamsEditable generatedRams={rams} />
          )}  
        </div>
      </div>
    )
}