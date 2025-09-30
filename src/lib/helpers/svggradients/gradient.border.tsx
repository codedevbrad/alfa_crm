/* eslint-disable @typescript-eslint/no-explicit-any */
import GradientBackground , { colorsTypes } from "./gradient.colors"

type GradientBorderType = {
    children: any;
    gradientType: colorsTypes
}

export default function GradientBorder ( { children , gradientType } : GradientBorderType ) {
    return (
        <div className={`p-1 rounded-lg ${ GradientBackground({ colorChosen : gradientType , animate: true })}`}>
            <div className="p-1 rounded-lg">
                { children }
            </div>
        </div>
    )
}