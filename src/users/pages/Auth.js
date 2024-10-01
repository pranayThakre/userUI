import React, { useContext, useState } from 'react';
import './Auth.css';
import Input from 'shared/components/FormElements/Input';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from 'shared/util/validators';
import useForm from 'shared/hooks/form-hook';
import Button from 'shared/components/FormElements/Button';
import Card from 'shared/components/UIElements/Card';
import { AuthContext } from 'shared/context/auth-context';
import LoadingSpinner from 'shared/components/UIElements/LoadingSpinner';
import ErrorModal from 'shared/components/UIElements/ErrorModal';
import { useHttpClient } from 'shared/hooks/http-hook';
import ImageUpload from 'shared/components/FormElements/ImageUpload';

const Auth = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [authState, inputHandler, setFormData] = useForm(
    {
      email: { value: '', isValid: false },
      password: { value: '', isValid: false },
    },
    false
  );

  const anthSubmitHandler = async (event) => {
    event.preventDefault();
    if (isLoginMode) {
      try {
        const response = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + '/users/login',
          'POST',
          JSON.stringify({
            email: authState.inputs.email.value,
            password: authState.inputs.password.value,
          }),
          { 'Content-Type': 'application/json' }
        );
        auth.login(response.userId, response.token);
      } catch (err) {}
    } else {
      try {
        // now on this post request we not just send the json body but it includes image which is binary data
        // and data type is "multipart/form-data"
        const formData = new FormData();
        formData.append('email', authState.inputs.email.value);
        formData.append('name', authState.inputs.name.value);
        formData.append('password', authState.inputs.password.value);
        formData.append('image', authState.inputs.image.value);
        const response = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + '/users/signup',
          'POST',
          formData // with formData we don't need to set 'Content-Type' header to 'multipart/form-data,
          // it automatically does that for us
        );
        auth.login(response.userId, response.token);
      } catch (err) {}
    }
  };

  const switchHandler = () => {
    if (!isLoginMode) {
      setFormData(
        { ...authState.inputs, name: undefined, image: undefined },
        authState.inputs.email.isValid && authState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...authState.inputs,
          name: {
            value: '',
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((mode) => !mode);
  };
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={anthSubmitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              label="Name"
              type="text"
              onInput={inputHandler}
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name."
            />
          )}
          {!isLoginMode && (
            <ImageUpload center id="image" onInput={inputHandler} />
          )}
          <Input
            element="input"
            id="email"
            label="E-Mail"
            type="email"
            onInput={inputHandler}
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email id."
          />
          <Input
            element="input"
            id="password"
            label="Password"
            type="password"
            onInput={inputHandler}
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid password, at least 6 characters"
          />
          <Button type="submit" disabled={!authState.isValid}>
            {isLoginMode ? 'LOGIN' : 'SIGNUP'}
          </Button>
        </form>
        <Button inverse onClick={switchHandler}>
          SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
        </Button>
      </Card>
    </>
  );
};

export default Auth;
