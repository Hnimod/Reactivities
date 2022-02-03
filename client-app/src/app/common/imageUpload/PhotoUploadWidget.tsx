import { useEffect, useState } from "react";
import { Button, Grid, Header } from "semantic-ui-react";
import PhotoWidgetCropper from "./PhotoWidgetCropper";
import PhotoWidgetDropzone from "./PhotoWidgetDropzone";

interface Props {
  onUpload: (file: Blob) => void;
  loading: boolean;
}

function PhotoUploadWidget({ onUpload, loading }: Props) {
  const [files, setFiles] = useState<any>([]);
  const [cropper, setCropper] = useState<Cropper>();

  useEffect(() => {
    return () => files.forEach((file: any) => URL.revokeObjectURL(file.preview));
  }, [files]);

  function onDrop() {
    if (cropper)
      cropper.getCroppedCanvas().toBlob(blob => {
        if (blob) onUpload(blob);
      });
  }

  return (
    <Grid>
      <Grid.Column width={4}>
        <Header sub color="teal" content="Step 1 - Add photo" />
        <PhotoWidgetDropzone setFiles={setFiles} />
      </Grid.Column>
      <Grid.Column width={1} />
      <Grid.Column width={4}>
        <Header sub color="teal" content="Step 2 - Resize photo" />
        {files.length > 0 && (
          <PhotoWidgetCropper setCropper={setCropper} imagePreview={files[0].preview} />
        )}
      </Grid.Column>
      <Grid.Column width={1} />
      <Grid.Column width={4}>
        <Header sub color="teal" content="Step 3 - Preview & Upload" />
        {files.length > 0 && (
          <>
            <div className="img-preview" style={{ minHeight: 200, overflow: "hidden" }} />
            <Button.Group widths={2}>
              <Button onClick={onDrop} icon="check" positive loading={loading} />
              <Button onClick={() => setFiles([])} icon="close" disabled={loading} />
            </Button.Group>
          </>
        )}
      </Grid.Column>
    </Grid>
  );
}

export default PhotoUploadWidget;
