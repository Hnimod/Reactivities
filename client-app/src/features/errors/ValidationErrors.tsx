import { Message } from "semantic-ui-react";

interface Props {
  errors: string[] | null;
}

function ValidationErrors({ errors }: Props) {
  return (
    <Message error>
      {errors && (
        <Message.List>
          {errors.map((err, index) => (
            <Message.Item key={index}>{err}</Message.Item>
          ))}
        </Message.List>
      )}
    </Message>
  );
}

export default ValidationErrors;
