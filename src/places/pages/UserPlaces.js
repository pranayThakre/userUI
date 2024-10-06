import React, { useEffect, useState } from 'react';
import PlacesList from '../components/PlacesList';
import { useParams } from 'react-router-dom';
import { useHttpClient } from 'shared/hooks/http-hook';
import ErrorModal from 'shared/components/UIElements/ErrorModal';
import LoadingSpinner from 'shared/components/UIElements/LoadingSpinner';

const UserPlaces = () => {
  const userId = useParams().userId;
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [filteredPlaces, setFilteredPlaces] = useState();

  
  useEffect(() => {
    const getPlacesById = async () => {
      try {
        const response = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/places/user/${userId}`
        );
        setFilteredPlaces(response.places);
      } catch (err) {}
    };
    getPlacesById();
  }, [sendRequest, userId]);

  const placeDeleteHandler = (deletedId) => {
    setFilteredPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedId)
    );
  };
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && filteredPlaces && (
        <PlacesList items={filteredPlaces} onDelete={placeDeleteHandler} />
      )}
    </>
  );
};

export default UserPlaces;
