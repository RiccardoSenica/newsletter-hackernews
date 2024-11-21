import {
  User,
  Building2,
  Mail,
  LogOut,
  LayoutGrid,
  Shield,
  Home
} from 'lucide-react';

export default function Footer() {
  return (
    <footer
      style={{
        background: 'linear-gradient(180deg, #F8FAFC 0%, #F1F4F9 100%)',
        paddingTop: '1.5rem',
        borderBottomLeftRadius: '8px',
        borderBottomRightRadius: '8px',
        borderLeft: '1px solid #E5E9F0',
        borderRight: '1px solid #E5E9F0',
        borderBottom: '1px solid #E5E9F0'
      }}
    >
      <div
        style={{
          margin: '0 2rem',
          paddingBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <div>
          <h4
            style={{
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '1rem',
              marginTop: '0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#2F4858',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            <User size={16} color='#386FA4' />
            Contact Us
          </h4>
          <p
            style={{
              margin: '0.5rem 0',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#4A5568'
            }}
          >
            <Building2 size={14} color='#386FA4' />
            {process.env.NEXT_PUBLIC_BRAND_NAME}
          </p>
          <p
            style={{
              margin: '0.5rem 0',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#4A5568'
            }}
          >
            <Mail size={14} color='#386FA4' />
            <a
              href={`mailto:${process.env.NEXT_PUBLIC_BRAND_EMAIL}`}
              style={{ color: '#386FA4', textDecoration: 'none' }}
            >
              {process.env.NEXT_PUBLIC_BRAND_EMAIL}
            </a>
          </p>
          <p
            style={{
              margin: '0.5rem 0',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#4A5568'
            }}
          >
            <LogOut size={14} color='#386FA4' />
            <span>
              Click{' '}
              <a
                href={`${process.env.HOME_URL}/unsubscribe`}
                style={{ color: '#386FA4', textDecoration: 'none' }}
              >
                here
              </a>{' '}
              to unsubscribe
            </span>
          </p>
        </div>
        <div
          style={{
            width: '1px',
            background: 'linear-gradient(180deg, #E5E9F0 0%, transparent 100%)',
            alignSelf: 'stretch',
            height: 'auto'
          }}
        />
        <div>
          <h4
            style={{
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '1rem',
              marginTop: '0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#2F4858',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            <LayoutGrid size={16} color='#386FA4' />
            Quick Links
          </h4>
          <p
            style={{
              margin: '0.5rem 0',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#4A5568'
            }}
          >
            <Shield size={14} color='#386FA4' />
            <a
              href={`${process.env.HOME_URL}/privacy`}
              style={{ color: '#386FA4', textDecoration: 'none' }}
            >
              Privacy Policy
            </a>
          </p>
          <p
            style={{
              margin: '0.5rem 0',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#4A5568'
            }}
          >
            <Home size={14} color='#386FA4' />
            <a
              href={process.env.HOME_URL}
              style={{ color: '#386FA4', textDecoration: 'none' }}
            >
              Visit Website
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
