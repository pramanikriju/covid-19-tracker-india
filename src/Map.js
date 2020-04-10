import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import React, { useState } from "react";
import { scaleQuantile } from "d3-scale";
import ReactTooltip from "react-tooltip";

const INDIA_TOPO_JSON = require("./india.topo.json");
const DEFAULT_COLOR = "#EEE";
const COLOR_RANGE = [
  "#ffedea",
  "#ffcec5",
  "#ffad9f",
  "#ff8a75",
  "#ff5533",
  "#e2492d",
  "#be3d26",
  "#9a311f",
  "#782618",
];

const PROJECTION_CONFIG = {
  scale: 900,
  center: [78.9629, 22.5937],
};
const geographyStyle = {
  default: {
    outline: "none",
  },
  hover: {
    fill: "#ccc",
    transition: "all 250ms",
    outline: "none",
  },
  pressed: {
    outline: "none",
  },
};

function Map({ data }) {
  const [tooltipContent, setTooltipContent] = useState("");

  const colorScale = scaleQuantile()
    .domain(data.map((d) => d.value))
    .range(COLOR_RANGE);

  const onMouseEnter = (geo, current = { value: "NA" }) => {
    return () => {
      setTooltipContent(`${geo.properties.name}: ${current.value}`);
    };
  };

  const onMouseLeave = () => {
    setTooltipContent("");
  };

  console.log("render count", data.length);
  return (
    <div>
      <ReactTooltip>{tooltipContent}</ReactTooltip>

      <ComposableMap
        projectionConfig={PROJECTION_CONFIG}
        projection="geoMercator"
        width={700}
        height={600}
        data-tip=""
      >
        <Geographies geography={INDIA_TOPO_JSON}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const current = data.find((s) => {
                return s.id === geo.id;
              });
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={current ? colorScale(current.value) : DEFAULT_COLOR}
                  style={geographyStyle}
                  onMouseEnter={onMouseEnter(geo, current)}
                  onMouseLeave={onMouseLeave}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}
export default Map;
