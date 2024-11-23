import Head from 'next/head';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SchemaOrg = ({ schema }: Record<string, any>) => (
  <Head>
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  </Head>
);
