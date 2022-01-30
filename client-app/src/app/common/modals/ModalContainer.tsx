import { observer } from "mobx-react-lite";
import { Modal } from "semantic-ui-react";
import { useStore } from "../../stores/store";

function ModalContainer() {
  const {
    modalStore: { open, body, closeModal },
  } = useStore();

  return (
    <Modal open={open} onClose={closeModal} size="mini">
      <Modal.Content>{body}</Modal.Content>
    </Modal>
  );
}

export default observer(ModalContainer);
