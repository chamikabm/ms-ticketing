import { useState } from 'react';
import axios from 'axios';

export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
      setErrors(null);
      const resp = await axios[method](url, body);

      if(onSuccess) {
        onSuccess(resp.data);
      }

      return resp.data;
    } catch (err) {
      setErrors(
          <div className="alert alert-danger">
            <h4>Oooops...</h4>
            <ul className="my-0">
              {
                err.response.data.errors.map(error => (
                    <li key={error.message}>{error.message}</li>
                ))
              }
            </ul>
          </div>
      );
    }
  };

  return { doRequest, errors };
};
