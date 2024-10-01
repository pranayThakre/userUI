import React, { useEffect, useReducer } from 'react';
import './Input.css';
import { validate } from 'shared/util/validators';

const inputReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE':
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      };
    case 'TOUCH':
      return {
        ...state,
        isTouched: true,
      };
    default:
      return state;
  }
};

const Input = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || '',
    isValid: props.initialValid || false,
    isTouched: false,
  });

  const changeHandler = (event) => {
    dispatch({
      type: 'CHANGE',
      val: event.target.value,
      validators: props.validators,
    });
  };

  const touchHandler = () => {
    dispatch({
      type: 'TOUCH',
    });
  };

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  const element =
    props.element === 'input' ? (
      <input
        id={props.id}
        type={props.type}
        onChange={changeHandler}
        onBlur={touchHandler}
        placeholder={props.placeholder}
        value={inputState.value}
      />
    ) : (
      <textarea
        id={props.id}
        value={inputState.value}
        onBlur={touchHandler}
        onChange={changeHandler}
        rows={props.rows || 3}
      />
    );
  return (
    <div
      className={`form-control ${
        !inputState.isValid && inputState.isTouched && 'form-control--invalid'
      } `}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText} </p>}
    </div>
  );
};

export default Input;
