
export default function tenantFromLocation() {
  const segments = window.location.pathname.split('/');
  let region;
  let tenant;
  if (segments.length >= 3) {
    region = segments[1];
    tenant = segments[2];
  }

  return { region, tenant };
}