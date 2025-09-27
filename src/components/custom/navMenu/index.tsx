"use client";
import * as React from "react";
import {
  NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuTrigger, navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { Card } from "@/components/ui/card"
import GradientBackground from "@/lib/helpers/svggradients/gradient.colors";


// --------------------------------------------
// Types
// --------------------------------------------

interface CardLink {
  title: string;
  href: string;
  colorChosen?: string;
  emoji?: string;
}

interface CardComponentProps {
  colorChosen?: string;
  emoji?: string;
  each: CardLink;
}

interface NavMenuProps {
  link: CardLink;
  subLinks?: CardLink[] | React.ReactNode;
  basePathDepth?: number;
  theme?: "dark" | "light";
}

// --------------------------------------------
// Utility functions
// --------------------------------------------

function normalizePath(path: string): string {
  return path.replace(/\/+$/, "");
}

function getBasePath(path: string, depth: number): string {
  return path.split("/").slice(0, depth + 1).join("/");
}


// --------------------------------------------
//      Child Component: CardComponent
// --------------------------------------------

function CardComponent({
  colorChosen = "red",
  emoji = "🔥",
  each,
}: CardComponentProps) {
  const gradientBackground = GradientBackground({ colorChosen, animate: true });


  return (
        <NavigationMenuLink key={each.title} ref={ soundRef as any}>
          <Link href={each.href} legacyBehavior passHref >
              <Card className={`cursor-pointer relative mr-5 min-w-[200px] h-[125px] flex justify-center items-center overflow-hidden ${gradientBackground}`}>
                <div className="absolute top-12 inset-0 flex justify-center items-center">
                  <span className="text-white text-4xl">{emoji}</span>
                </div>

                <div className="relative z-10 bottom-2">
                    <h1> { each.title } </h1>
                </div>
              </Card>
          </Link>
        </NavigationMenuLink>
  );
}

// --------------------------------------------
//         Main Component: NavMenu
// --------------------------------------------

export default function NavMenu({
  link,
  subLinks,
  basePathDepth = 2,
  theme = "light",
}: NavMenuProps) {
  const pathname = usePathname() ?? "";

  const hasSubLinks = subLinks !== null && subLinks !== undefined;
  const isArraySubLinks = Array.isArray(subLinks);

  const basePathname = getBasePath(normalizePath(pathname), basePathDepth);
  const baseLinkHref = getBasePath(normalizePath(link.href), basePathDepth);

  const isActive = basePathname === baseLinkHref;


  const isSubLinkActive =
    isArraySubLinks &&
    subLinks.some(
      (subLink: CardLink) =>
        getBasePath(normalizePath(subLink.href), basePathDepth) === basePathname
    );

  const themeStyles =
    theme === "light"
      ? "text-gray-800 hover:bg-gray-100"
      : "text-white bg-transparent";

  return (
    <NavigationMenuItem>
      {!hasSubLinks ? (
        <>
          <Link href={link.href} legacyBehavior passHref>
              <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()} mx-4 ${themeStyles}`}
              >
                {link.title}
              </NavigationMenuLink>
          </Link>
        </>
      ) : (
        <NavigationMenuTrigger className={`${themeStyles} mx-4`}>
          {link.title}
        </NavigationMenuTrigger>
      )}

      {hasSubLinks && (
        <NavigationMenuContent className="z-50 min-w-96 min-h-36 flex flex-col justify-center py-5 px-7">
          {isArraySubLinks ? (
            <div className="flex flex-row">
              {subLinks.map((each: CardLink, index: number) => (
                <CardComponent
                  key={index}
                  colorChosen={each.colorChosen}
                  emoji={each.emoji}
                  each={each}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-row">{subLinks}</div>
          )}
        </NavigationMenuContent>
      )}
    </NavigationMenuItem>
  );
}
