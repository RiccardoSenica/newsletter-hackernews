import Footer from './components/Footer';

interface TemplateProps {
  title: string;
  body: JSX.Element;
}

export default function Template({ title, body }: TemplateProps) {
  return (
    <div
      style={{
        maxWidth: '720px',
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FBFB'
      }}
    >
      <h2
        style={{
          padding: '20px',
          textAlign: 'center',
          color: 'white',
          backgroundColor: `#8230CC`
        }}
      >
        {title}
      </h2>
      <div style={{ margin: '20px', padding: '20px' }}>{body}</div>
      <Footer />
    </div>
  );
}
