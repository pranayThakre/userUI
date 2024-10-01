import React, { useEffect, useRef } from "react";
import "./Map.css";

const Map = (props) => {
  const mapRef = useRef();

  // this is important cause we are using zoom and center as dependencies of
  // useeffect so rather than using props.zoom and props.center we will use
  // zoom and center directly because props can change in many sinarios and
  // that will lead to sevral unnecessary useffect reload (We don't want that).
  const { zoom, center } = props;

  useEffect(() => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: center,
      zoom: zoom,
    });

    new window.google.maps.Marker({ position: center, map: map });
  }, [center, zoom]);

  return (
    <div
      ref={mapRef}
      style={props.style}
      className={`map ${props.className}`}
    ></div>
  );
};

export default Map;
