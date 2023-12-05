import { Container } from '@react-email/container';
import { Html } from '@react-email/html';
import { Section } from '@react-email/section';
import { Text } from '@react-email/text';

type EmailProps = {
  title: string;
  body: JSX.Element;
};

export default function Email({ title, body }: EmailProps) {
  return (
    <Html>
      <Section style={main}>
        <Container style={container}>
          <Text style={heading}>{title}</Text>
          <Text style={paragraph}>{body}</Text>
        </Container>
      </Section>
    </Html>
  );
}

const main = {
  backgroundColor: '#ffffff',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px',
};

const heading = {
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: '16px',
};

const paragraph = {
  fontSize: '16px',
  marginBottom: '16px',
};
