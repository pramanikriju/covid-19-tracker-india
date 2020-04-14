import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import React, { useState } from "react";
import { scaleQuantile } from "d3-scale";
import ReactTooltip from "react-tooltip";
import LinearGradient from "./LinearGradient";

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
  scale: 1000,
  center: [78.9629, 22.5937],
};
const geographyStyle = {
  default: {
    outline: "#fff",
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
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });

  function handleZoomIn(e) {
    e.preventDefault();
    if (position.zoom >= 4) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 2 }));
  }

  function handleZoomOut(e) {
    e.preventDefault();
    if (position.zoom <= 1) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 2 }));
  }

  function handleMoveEnd(position) {
    setPosition(position);
  }

  const gradientData = {
    fromColor: COLOR_RANGE[0],
    toColor: COLOR_RANGE[COLOR_RANGE.length - 1],
    min: 0,
    max: Math.max.apply(
      Math,
      data.map(function (o) {
        return o.value;
      })
    ),
  };

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
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={handleMoveEnd}
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
        </ZoomableGroup>
      </ComposableMap>
      <LinearGradient data={gradientData} />
    </div>
  );
}
export default Map;
