import { Dimmer, Loader } from "semantic-ui-react";
type Props = {
  inverted?: boolean;
  content?: string;
};
const LoadingComponent = ({ inverted = true, content = "Loading..." }: Props) => {
  return (
    <Dimmer active inverted={inverted}>
      <Loader content={content} />
    </Dimmer>
  );
};

export default LoadingComponent;