type NoteProps = {
  children: React.ReactNode;
};

export default function Note({ children }: NoteProps) {
  return (
    <div
      style={{
        marginTop: '2rem',
        padding: '1.5rem 1.5rem',
        backgroundColor: '#EBF1F5',
        color: '#718096'
      }}
    >
      <div style={{ fontSize: '0.875rem' }}>{children}</div>
    </div>
  );
}
