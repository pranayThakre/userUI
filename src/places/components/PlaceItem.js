import React, { useContext, useState } from 'react';

import './PlaceItem.css';
import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from 'shared/components/UIElements/Modal';
import Map from 'shared/components/UIElements/Map';
import { AuthContext } from 'shared/context/auth-context';
import { useHttpClient } from 'shared/hooks/http-hook';
import ErrorModal from 'shared/components/UIElements/ErrorModal';
import LoadingSpinner from 'shared/components/UIElements/LoadingSpinner';

const PlaceItem = ({ place, onDelete }) => {
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const auth = useContext(AuthContext);

  const showMapHandler = (action) => {
    if (action === 'show') {
      setShowMap(true);
    } else {
      setShowMap(false);
    }
  };

  const confirmModalHandler = (action) => {
    if (action === 'show') {
      setShowConfirmModal(true);
    } else {
      setShowConfirmModal(false);
    }
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/places/${place.id}`,
        'DELETE',
        null,
        { Authorization: 'Bearer ' + auth.token }
      );
      onDelete(place.id);
    } catch (err) {}
  };

  const Footer = () => {
    return (
      <>
        <Button inverse onClick={() => confirmModalHandler('hide')}>
          CANCEL
        </Button>
        <Button danger onClick={confirmDeleteHandler}>
          DELETE
        </Button>
      </>
    );
  };
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={() => showMapHandler('hide')}
        header={place.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={() => showMapHandler('hide')}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={place.location} zoom={16} />
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={() => confirmModalHandler('hide')}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={<Footer />}
      >
        <p>
          Do you want to proceed and delete this place? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="place-item__image">
            <img
              src={`${process.env.REACT_APP_ASSET_URL}/${place.image}`}
              alt={place.title}
            />
          </div>
          <div className="place-item__info">
            <h2>{place.title}</h2>
            <h3>{place.address}</h3>
            <p>{place.description}</p>
          </div>
          <div className="place-item__actions">
            <Button onClick={() => showMapHandler('show')} inverse>
              VIEW ON MAP
            </Button>
            {place.creator === auth.userId && (
              <Button to={`/places/${place.id}`}>EDIT</Button>
            )}
            {place.creator === auth.userId && (
              <Button danger onClick={() => confirmModalHandler('show')}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </>
  );
};

export default PlaceItem;
