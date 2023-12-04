import { Container } from '@react-email/container';
import { Html } from '@react-email/html';
import { Section } from '@react-email/section';
import { Text } from '@react-email/text';
import { container, main, paragraph } from './utils/styling';

export default function UnsubscribeEmail() {
  return (
    <Html>
      <Section style={main}>
        <Container style={container}>
          <Text style={paragraph}>
            You have unsubscribed from the newsletter.
          </Text>
        </Container>
      </Section>
    </Html>
  );
}
