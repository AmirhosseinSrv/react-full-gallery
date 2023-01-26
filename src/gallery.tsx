import React, { useEffect, useState, Fragment } from 'react'
import { Button, Skeleton } from 'antd'
import GalleryItem from './gallery-item'
import { GalleryInterface, ImageInterface } from './interfaces';

const Gallery: React.FC<GalleryInterface> = (props) => {
    const [newImages, setNewImages] = useState<ImageInterface[]>([]);
    const [saveLoading, setSaveLoading] = useState<boolean>(false);
    const [uploadLoading, setUploadLoading] = useState<boolean>(false);

    useEffect(() => {
        setNewImages([...props.images]);
    }, [props.images]);

    const handleRemoveImage = async (id: string) => {
        setSaveLoading(true);
        const images = [...newImages];
        const index = images.findIndex((image) => image.id === id);
        images.splice(index, 1);
        setNewImages(images);
        if(props.mode === 'Upload') {
            props.setImagesToUpload(images);
        } else if(!props.allowMultipleDelete) {
            setSaveLoading(true);
            await handleRemove(images);
            setSaveLoading(false);
        }
    };

    const handleRemove = async (incomingNewImages: ImageInterface[] | null = null) => {
        const localNewImages = incomingNewImages ? incomingNewImages : newImages;
        const removedImages = props.images.filter((image) => !localNewImages.find(newImage => newImage.id === image.id));
        await props.handleRemoveImages(removedImages, localNewImages);
    };

    const handleSaveImage = async (id: string, imageBase64: string, name: string, extension: string) => {
        const newModifiedImages = [...newImages];
        const modifiedIndex = newModifiedImages.findIndex((image) => image.id === id);
        newModifiedImages[modifiedIndex] = {...newModifiedImages[modifiedIndex], originalUrl: imageBase64, previewUrl: imageBase64, name: `${name}.${extension}`, modified: true};
        setNewImages(newModifiedImages); 
        if(!props.allowMultipleEdit) {
            setSaveLoading(true);
            await handleUpdate(newModifiedImages);
            setSaveLoading(false);
        }
    }

    const handleUpdate = async (incomingNewImages: ImageInterface[] | null = null) => {
        const localNewImages = incomingNewImages ? incomingNewImages : newImages;
        const modifiedImages = localNewImages.filter((image) => image.modified === true);
        await props.handleUpdateImages(modifiedImages);
    };

    const handleSaveChanges = async () => {
        setSaveLoading(true);
        await handleRemove();
        await handleUpdate();
        setSaveLoading(false);
    };

    const handleUpload = async () => {
        setUploadLoading(true);
        await props.handleUploadImages(newImages);
        props.setImagesToUpload([]);
        setUploadLoading(false);
    };

    return (
        <div className='uppy-Root image-gallery' style={{ width: 750 }}>
            <div className='uppy-Dashboard uppy-Dashboard--animateOpenClose uppy-size--md uppy-size--lg uppy-size--height-md uppy-Dashboard--isInnerWrapVisible'>
                <div className="uppy-Dashboard-files" role="list">
                    <div role="presentation" style={{ position: 'relative', width: '100%', height: 350 }}>
                        <div role="presentation" style={{ position: 'absolute', top: 0, left: 0, width: '100%', overflow: 'visible' }}>
                            <div className="uppy-Dashboard-filesInner" style={{ display: 'flex', flexWrap:'wrap' }} role="presentation">
                                {
                                    props.loading ?
                                        new Array(5).fill(0).map((_, index) => (
                                            <Skeleton.Button active key={index} style={{ width: 170, height: 277, margin: '0 5px 15px 5px' }} />
                                        ))
                                    :
                                        newImages.map((image) => (
                                            <GalleryItem key={image.id} image={image} mode={props.mode} handleRemoveImage={handleRemoveImage} handleSaveImage={handleSaveImage} />
                                        ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
                {
                    !props.allowMultipleDelete && !props.allowMultipleEdit && props.mode !== 'Upload' ?
                        null
                    :
                        <div style={{ width: '100%', textAlign: 'right' }} id="gallery-footer">
                            {
                                props.mode === 'Update' ?
                                    <Button style={{ borderRadius: 0, marginTop: 10 }} type="primary" onClick={handleSaveChanges} loading={saveLoading} disabled={saveLoading || JSON.stringify(props.images) === JSON.stringify(newImages)}>Save</Button>
                                : props.mode === 'Upload' ?
                                    <Fragment>
                                        <Button style={{ borderRadius: 0, marginTop: 10 }} onClick={() => props.setImagesToUpload([])} disabled={uploadLoading}>Cancel</Button>
                                        <Button style={{ borderRadius: 0, marginTop: 10 }} type="primary" onClick={handleUpload} loading={uploadLoading} disabled={uploadLoading}>Upload</Button>
                                    </Fragment>
                                :
                                    null
                            }
                        </div>
                }
            </div>
        </div>
    )
}

export default Gallery