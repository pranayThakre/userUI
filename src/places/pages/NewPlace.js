import React, { useContext } from 'react';
import './PlaceForm.css';
import Input from 'shared/components/FormElements/Input';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from 'shared/util/validators';
import Button from 'shared/components/FormElements/Button';
import useForm from 'shared/hooks/form-hook';
import { useHttpClient } from 'shared/hooks/http-hook';
import ErrorModal from 'shared/components/UIElements/ErrorModal';
import LoadingSpinner from 'shared/components/UIElements/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import ImageUpload from 'shared/components/FormElements/ImageUpload';
import { AuthContext } from 'shared/context/auth-context';

const NewPlace = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: '',
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
      address: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', formState.inputs.title.value);
      formData.append('description', formState.inputs.description.value);
      formData.append('address', formState.inputs.address.value);
      formData.append('image', formState.inputs.image.value);
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + '/places',
        'POST',
        formData,
        {
          Authorization: 'Bearer ' + auth.token,
        }
      );
      navigate('/');
    } catch (err) {}
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          type="text"
          label="Title"
          element="input"
          onInput={inputHandler}
          validators={[VALIDATOR_REQUIRE()]}
          errorText={'Please enter a valid title.'}
        />
        <Input
          id="description"
          label="Description"
          element="textarea"
          onInput={inputHandler}
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText={
            'Please enter a valid Description (at least 5 characters).'
          }
        />
        <Input
          id="address"
          label="Address"
          element="input"
          onInput={inputHandler}
          validators={[VALIDATOR_REQUIRE()]}
          errorText={'Please enter a valid address.'}
        />
        <ImageUpload id="image" onInput={inputHandler} />
        <Button type="submit" disabled={!formState.isValid}>
          Add Place
        </Button>
      </form>
    </>
  );
};

export default NewPlace;
