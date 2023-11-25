interface ButtonProps {
  label: string;
  onClick: () => void;
}

export const Button = ({ label, onClick }: ButtonProps) => (
  <button onClick={onClick} key={1} className="overflow-hidden rounded-md">
    <h1>{label}</h1>
  </button>
);
