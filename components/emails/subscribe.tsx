import { Container } from '@react-email/container';
import { Html } from '@react-email/html';
import { Section } from '@react-email/section';
import { Text } from '@react-email/text';
import { container, main, paragraph } from './utils/styling';

export default function SubscribeEmail(code: string) {
  return (
    <Html>
      <Section style={main}>
        <Container style={container}>
          <Text style={paragraph}>
            To confirm the subscription, please click{' '}
            <a href={`${process.env.HOME_URL}/confirmation?code=${code}`}>
              here
            </a>
            .
          </Text>
        </Container>
      </Section>
    </Html>
  );
}
