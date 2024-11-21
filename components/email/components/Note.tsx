interface NoteProps {
  children: React.ReactNode;
}

export default function Note({ children }: NoteProps) {
  return (
    <div className='mt-6 rounded-md bg-gray-50 p-4 text-sm text-gray-600'>
      {children}
    </div>
  );
}
