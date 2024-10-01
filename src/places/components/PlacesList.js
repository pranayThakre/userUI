import React from "react";

import "./PlaceList.css";
import Card from "../../shared/components/UIElements/Card";
import PlaceItem from "./PlaceItem";
import Button from "shared/components/FormElements/Button";

const PlacesList = ({ items, onDelete }) => {
  if (items.length === 0) {
    return (
      <div className="center place-list">
        <Card>
          <h2>No Places Found. May be create one?</h2>
          <Button to="/places/new">Share Place</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="place-list">
      {items.map((place) => {
        return <PlaceItem key={place.id} place={place} onDelete={onDelete} />;
      })}
    </ul>
  );
};

export default PlacesList;
