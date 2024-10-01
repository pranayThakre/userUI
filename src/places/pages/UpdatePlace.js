import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from 'shared/components/FormElements/Button';
import Input from 'shared/components/FormElements/Input';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from 'shared/util/validators';
import './PlaceForm.css';
import useForm from 'shared/hooks/form-hook';
import Card from 'shared/components/UIElements/Card';
import { useHttpClient } from 'shared/hooks/http-hook';
import LoadingSpinner from 'shared/components/UIElements/LoadingSpinner';
import ErrorModal from 'shared/components/UIElements/ErrorModal';
import { AuthContext } from 'shared/context/auth-context';

const UpdatePlace = () => {
  const placeId = useParams().placeId;
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const [identifiedPlace, setIdentifiedPlace] = useState();

  const {
    isLoading: isReqLoading,
    error,
    sendRequest,
    clearError,
  } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: { value: '', isValid: false },
      description: { value: '', isValid: false },
    },
    false
  );

  useEffect(() => {
    const findPlace = async () => {
      try {
        const response = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/places/${placeId}`
        );
        setIdentifiedPlace(response.place);
        setFormData(
          {
            title: { value: response.place.title, isValid: true },
            description: { value: response.place.description, isValid: true },
          },
          true
        );
      } catch (err) {}
    };
    findPlace();
  }, [setFormData, placeId, sendRequest]);

  const submitUpdatePlaceHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/places/${placeId}`,
        'PATCH',
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token,
        }
      );
      navigate(`/${auth.userId}/places`);
    } catch (err) {}
  };

  if (isReqLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!identifiedPlace && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {!isReqLoading && identifiedPlace && (
        <form className="place-form" onSubmit={submitUpdatePlaceHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={identifiedPlace.title}
            initialValid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (min. 5 characters.)."
            onInput={inputHandler}
            initialValue={identifiedPlace.description}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            Update Place
          </Button>
        </form>
      )}
    </>
  );
};

export default UpdatePlace;
