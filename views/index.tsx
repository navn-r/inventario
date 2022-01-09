interface IndexProps {
  message: string;
}

const Index = ({ message }: IndexProps) => {
  return <p>{message}</p>;
};

export default Index;