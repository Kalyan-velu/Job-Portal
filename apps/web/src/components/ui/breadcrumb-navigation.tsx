import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import useBreadcrumbs from '@/hooks/use-breadcrumbs';
import { ChevronRight, Home } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

export default function BreadcrumbNavigation() {
  const breadcrumbs = useBreadcrumbs();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, index) => (
          <React.Fragment key={breadcrumb.path}>
            <BreadcrumbItem>
              {index === breadcrumbs.length - 1 ? (
                <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={breadcrumb.path}>
                    {index === 0 ? (
                      <Home className='h-4 w-4' />
                    ) : (
                      breadcrumb.label
                    )}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 && (
              <BreadcrumbSeparator>
                <ChevronRight className='h-4 w-4' />
              </BreadcrumbSeparator>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
