export default function Footer() {
  return (
    <footer
      style={{
        paddingTop: '1.5rem',
        backgroundColor: `#E6F2F2`,
        color: 'black'
      }}
    >
      <div
        style={{
          marginLeft: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '2rem'
        }}
      >
        <div>
          <h4 style={{ fontSize: '1.125rem', fontWeight: '600' }}>
            Contact Us
          </h4>
          <p>{process.env.NEXT_PUBLIC_BRAND_NAME}</p>
          <p>
            Email:{' '}
            <a href={`mailto:${process.env.NEXT_PUBLIC_BRAND_EMAIL}`}>
              {process.env.NEXT_PUBLIC_BRAND_EMAIL}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
