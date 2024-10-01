import React, { useEffect, useState } from 'react';
import UsersList from '../components/UsersList';
import ErrorModal from 'shared/components/UIElements/ErrorModal';
import LoadingSpinner from 'shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from 'shared/hooks/http-hook';

const Users = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [usersData, setUsersData] = useState();

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const response = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + '/users'
        );
        setUsersData(response.users);
      } catch (err) {}
    };
    getAllUsers();
  }, [sendRequest]);
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && usersData && <UsersList items={usersData} />}
    </>
  );
};

export default Users;
