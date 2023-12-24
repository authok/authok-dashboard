import urljoin from 'url-join';


export const formatPath = (path: string) => {
  const segments = window.location.pathname.split('/');

  return urljoin('/', segments[1], segments[2], path);
}