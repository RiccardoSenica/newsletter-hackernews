import { Container } from '@react-email/container';
import { Html } from '@react-email/html';
import { Section } from '@react-email/section';
import { Text } from '@react-email/text';
import { container, main, paragraph } from './utils/styling';

export default function NewsletterEmail(ids: number[]) {
  return (
    <Html>
      <Section style={main}>
        <Container style={container}>
          <Text style={paragraph}>
            These were the ids retrieved: {ids.join(', ')}
          </Text>
        </Container>
      </Section>
    </Html>
  );
}
