type NoteProps = {
  children: React.ReactNode;
};

export function Note({ children }: NoteProps) {
  return (
    <div className='mt-8 bg-gray-100 px-6 py-4 dark:bg-gray-800'>
      <div className='text-sm text-gray-600 dark:text-gray-400'>{children}</div>
    </div>
  );
}
