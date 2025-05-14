import useRequest from '../../hooks/use-request';
import { useEffect } from 'react';
import Router from 'next/router';

export default () => {
  const { doRequest } = useRequest({
    method: 'post',
    url: '/api/users/signout',
    body: {},
    onSuccess: () => {
      Router.push('/');
    },
  });

  useEffect(() => {
    doRequest();
  }, []);
  return <div>Signing you out....</div>;
};
