import React, { useEffect, useRef, useState } from 'react';
import './index.css';
import "antd/dist/antd.css";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import "@uppy/audio/dist/style.css";
import "@uppy/screen-capture/dist/style.css";
import "@uppy/image-editor/dist/style.css";
import Uppy from '@uppy/core';
import Dashboard from '@uppy/dashboard';
import RemoteSources from '@uppy/remote-sources';
import ImageEditor from '@uppy/image-editor';
import Form from '@uppy/form';
import DropTarget from '@uppy/drop-target';
import Compressor from '@uppy/compressor';
import { v4 as uuidv4 } from 'uuid';
import Gallery from './gallery';
import { FilesInterface, ImageGalleryInterface, ImageInterface } from './interfaces';
import { UppyFileType } from './types';

function blobToBase64(blob: Blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

const ImageGallery: React.FC<ImageGalleryInterface> = (props) => {
  const [images, setImages] = useState<ImageInterface[]>([]);
  const [imagesToUpload, setImagesToUpload] = useState<ImageInterface[]>([]);
  const uppyRef = useRef<Uppy | null>(null);
  const imagesRef = useRef<ImageInterface[]>([]);
  const imagesToUploadRef = useRef<ImageInterface[]>([]);

  useEffect(() => {
    setImages(props.images);
  }, [props.images]);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    imagesToUploadRef.current = imagesToUpload;
  }, [imagesToUpload]);

  useEffect(() => {
    setTimeout(() => {
      if(!uppyRef.current) {
        const uppy = new Uppy({
          restrictions: {
            maxFileSize: props.maxFileSize || 200000,
            allowedFileTypes: props.allowedFileTypes,
          },
          onBeforeFileAdded: (currentFile: UppyFileType, files: FilesInterface) => {
            let shouldFileBeAdded: boolean  = true;
            if (props.onBeforeFileAdded) {
              shouldFileBeAdded = !!props.onBeforeFileAdded(currentFile, files);
            }
            if(shouldFileBeAdded) {
              if(currentFile.preview) {
                const fullWidthImageUrl = new URL(currentFile.preview);
                fullWidthImageUrl.searchParams.delete('w');
                setImagesToUpload([...imagesToUploadRef.current, {
                  originalUrl: fullWidthImageUrl.toString(),
                  name: currentFile.name,
                  id: uuidv4()
                }]);
              } else if(currentFile.data?.size) {
                blobToBase64(currentFile.data).then((imageBase64: any) => {
                  setImagesToUpload([...imagesToUploadRef.current, {
                    originalUrl: imageBase64,
                    name: currentFile.name,
                    id: uuidv4()
                  }]);
                });
              } else if(currentFile.remote?.body?.url) {
                const imageUrl = currentFile.remote?.body?.url.toString();
                setImagesToUpload([...imagesToUploadRef.current, {
                  originalUrl: imageUrl,
                  name: currentFile.name,
                  id: uuidv4()
                }]);
              }
            }
            return false;
          },
          onBeforeUpload: (files: FilesInterface) => {
            const newImages = Object.keys(files).map((key) => {
              return {
                originalUrl: files[key].preview || '',
                name: files[key].name,
                id: ''
              }
            });
            setImages([...imagesRef.current, ...newImages]);
            setTimeout(() => {
              document.querySelector<HTMLElement>('.uppy-DashboardContent-back')?.click();
            }, 200);
            if(props.onBeforeUpload) {
              return props.onBeforeUpload(files);
            }
            return false;
          },
        })
        .use(Dashboard, {
          target: `#${props.targetId}`,
          inline: true,
          height: props.height || 470,
          metaFields: [
            { id: 'name', name: 'Name', placeholder: 'file name' },
            { id: 'caption', name: 'Caption', placeholder: 'add description' },
          ],
          note: props.note
        })
        .use(RemoteSources, {
          sources: props.remoteSources || ['Box', 'Dropbox', 'Facebook', 'GoogleDrive','Instagram', 'OneDrive', 'Unsplash', 'Url', 'Zoom'],
          companionUrl: props.companionUrl,
        })
        .use(Form, { target: `#${props.formTargetId}` })
        .use(ImageEditor, { target: Dashboard })
        .use(DropTarget, { target: document.querySelector(`#${props.dropTargetId || props.targetId}`) as Element })
        .use(Compressor)

        uppyRef.current = uppy;
      }
    }, 200);
    //eslint-disable-next-line
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', ...props.style }}>
      <div id={props.targetId}></div>
      <form id={props.formTargetId}></form>
      <Gallery 
        images={imagesToUpload.length ? imagesToUpload : images} 
        setImagesToUpload={setImagesToUpload} 
        loading={props.loading} 
        mode={imagesToUpload.length ? 'Upload' : 'Update'} 
        allowMultipleEdit={props.allowMultipleEdit}
        allowMultipleDelete={props.allowMultipleDelete}
        handleRemoveImages={props.handleRemoveImages} 
        handleUploadImages={props.handleUploadImages} 
        handleUpdateImages={props.handleUpdateImages} 
      />
    </div>
  );
}

export default ImageGallery;