import Link from "next/link"
import { version } from '../../../../package.json'

export function AppVersion ( { size } ) {
    return (
        <div className="flex flex-row gap-1 text-sm py-0.5 px-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semi bold rounded"> 
            <h1> v </h1> <span> { version } </span>
        </div>
    )
}

export function Logo ( ) {
    return (
           <svg
            width="70"
            height="70"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polygon points="50,150 100,50 150,150" fill="blue" />
            <polygon points="100,151 150,71 200,151" fill="#87CEEB" />
          </svg>
    )
}

export default function HeaderLogo({ url } : { url: string }) {
  return (
    <div className="flex items-center">
      <Link href={ url }>
        <div className="flex flex-row items-center">
            <Logo  />
            <AppVersion size={undefined} />
        </div>
      </Link>
    </div>
  );
}