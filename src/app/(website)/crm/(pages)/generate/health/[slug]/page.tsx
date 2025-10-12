"use client"
import RamsChatBot from "./ai/v2/generation"
import RamsEditable from "./editor"
import RamsImporter from "./loader"

import { useState } from "react"
import { Rams , initial } from "./rams";

export default function Page() {
     const [rams, setRams] = useState<Rams | null>(initial);
    return (
      <div className="p-4">

        <h1 className="text-2xl font-bold mb-4">
          Risk Assessment and Method Statement (RAMS) Generator
        </h1>

          <div className="mb-4 flex justify-center gap-4"> 
            <RamsImporter updateRams={setRams} />
            <RamsChatBot updateRams={setRams} />
          </div>

        <div>
          <RamsEditable generatedRams={rams} />
        </div>
      </div>
    )
}