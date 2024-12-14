import React from 'react';

const Users = () => {
  return (
    <div style={{ width: '100%', height: '100vh' }} className="custom-scroll">
      <iframe
        className="custom-scroll"
        src="http://localhost:3001/status"
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Status Page"
      />
    </div>
  );
};

export default Users;