import Email from './template';

export default function UnsubscribeTemplate() {
  return {
    subject: 'Unsubscribe confirmation',
    template: (
      <Email
        title="We're sad you're leaving :("
        body={<>You have unsubscribed from the newsletter.</>}
      />
    ),
  };
}
