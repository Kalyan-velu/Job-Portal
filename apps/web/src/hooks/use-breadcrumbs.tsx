import React from 'react';
import { useLocation } from 'react-router-dom';

function useBreadcrumbs() {
  const location = useLocation();

  // Memoize breadcrumbs calculation based on location
  const breadcrumbs = React.useMemo(() => {
    const pathnames = location.pathname.split('/').filter((x) => x);

    // Create breadcrumbs array
    const breadcrumbsArray = pathnames
      .map((value, index) => {
        const path = `/${pathnames.slice(0, index + 1).join('/')}`;

        // Capitalize the label
        return { path, label: value.charAt(0).toUpperCase() + value.slice(1) };
      })
      .filter((value) => value.label !== 'app');

    // Combine home breadcrumb with the rest of the breadcrumbs
    return [...breadcrumbsArray];
  }, [location.pathname]); // Recalculate only when location.pathname changes

  return breadcrumbs;
}

export default useBreadcrumbs;
