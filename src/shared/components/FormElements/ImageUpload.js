import React, { useEffect, useRef, useState } from 'react';
import './ImageUpload.css';
import Button from './Button';

const ImageUpload = (props) => {
  const fileInputRef = useRef();
  const [file, setFile] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setImageUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedImageHandler = (event) => {
    let pickedFile;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    props.onInput(props.id, pickedFile, fileIsValid);
  };

  const filePickerHandler = () => {
    fileInputRef.current.click();
  };
  return (
    <div className="form-control">
      <input
        ref={fileInputRef}
        id={props.id}
        style={{ display: 'none' }}
        type="file"
        onChange={pickedImageHandler}
        accept=".jpg,.png,.jpeg"
      />
      <div className={`image-upload ${props.center && 'center'}`}>
        <div className="image-upload__preview">
          {imageUrl ? (
            <img src={imageUrl} alt="Preview" />
          ) : (
            <p>Please pick an image.</p>
          )}
        </div>
        <Button type="button" onClick={filePickerHandler}>
          PICK IMAGE
        </Button>
      </div>
      {!isValid && <p style={{ color: 'red' }}>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
