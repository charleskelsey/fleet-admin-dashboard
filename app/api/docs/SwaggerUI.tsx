'use client';

import dynamic from 'next/dynamic';
import { SwaggerUIProps } from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic<SwaggerUIProps>(
  () => import('swagger-ui-react').then((mod) => mod.default),
  { ssr: false }
);

export default function SwaggerUIWrapper({ spec }: { spec: SwaggerUIProps['spec'] }) {
  return <SwaggerUI spec={spec} />;
}