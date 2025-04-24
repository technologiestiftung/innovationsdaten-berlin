/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module "*.svg" {
  import React from "react";
  import { SVGProps } from "react";
  const SVG: React.FC<SVGProps<SVGSVGElement>>;
  export default SVG;
}
