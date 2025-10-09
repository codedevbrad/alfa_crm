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

          <RamsImporter updateRams={setRams} />

        <div>
          {/* <RamsChatWizard updateRams={setRams} />  */}
          <RamsChatBot updateRams={setRams} />
          <RamsEditable generatedRams={rams} />
        </div>
      </div>
    )
}
