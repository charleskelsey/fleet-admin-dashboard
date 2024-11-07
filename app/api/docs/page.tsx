import { getApiDocs } from '@/lib/swagger';
import SwaggerUI from './SwaggerUI';

export default async function ApiDocsPage() {
  const spec = await getApiDocs();
  return <SwaggerUI spec={spec} />;
}
