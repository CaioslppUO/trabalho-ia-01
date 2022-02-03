import React from "react";
import * as d3 from "d3";

export const useD3Svg = (
  renderChartFn: (param: any) => void,
  dependencies: Array<any>
) => {
  const ref = React.useRef<SVGSVGElement>(null);

  React.useEffect(() => {
    renderChartFn(d3.select(ref.current as any));
    return () => {};
  }, dependencies);
  return ref;
};
