import React, { useEffect, useState, Fragment } from 'react'
import { Button, Skeleton } from 'antd'
import GalleryItem from './gallery-item'
import { GalleryInterface, ImageInterface } from './interfaces';

const Gallery: React.FC<GalleryInterface> = ({ images, setImagesToUpload, mode, loading, handleUpdateImages, handleUploadImages, handleRemoveImages }) => {
    const [newImages, setNewImages] = useState<ImageInterface[]>([]);
    const [saveLoading, setSaveLoading] = useState<boolean>(false);

    useEffect(() => {
        setNewImages([...images]);
    }, [images]);

    const handleRemoveImage = (id: string) => {
        const images = [...newImages];
        const index = images.findIndex((image) => image.id === id);
        images.splice(index, 1);
        setNewImages(images);
    };

    const handleRemove = async () => {
        const removedImages = images.filter((image) => !newImages.find(newImage => newImage.id === image.id));
        await handleRemoveImages(removedImages, newImages);
    };

    const handleSaveImage = async (id: string, imageBase64: string, name: string, extension: string) => {
        const newModifiedImages = [...newImages];
        const modifiedIndex = newModifiedImages.findIndex((image) => image.id === id);
        newModifiedImages[modifiedIndex] = {...newModifiedImages[modifiedIndex], originalUrl: imageBase64, previewUrl: imageBase64, name: `${name}.${extension}`, modified: true};
        setNewImages(newModifiedImages); 
    }

    const handleUpdate = async () => {
        const modifiedImages = newImages.filter((image) => image.modified === true);
        await handleUpdateImages(modifiedImages);
    };

    const handleSaveChanges = async () => {
        setSaveLoading(true);
        await handleRemove();
        await handleUpdate();
        setSaveLoading(false);
    };

    const handleUpload = async () => {
        setSaveLoading(true);
        await handleUploadImages(newImages);
        setImagesToUpload([]);
        setSaveLoading(false);
    };

    return (
        <div className='uppy-Root image-gallery' style={{ width: 750 }}>
            <div className='uppy-Dashboard uppy-Dashboard--animateOpenClose uppy-size--md uppy-size--lg uppy-size--height-md uppy-Dashboard--isInnerWrapVisible'>
                <div className="uppy-Dashboard-files" role="list">
                    <div role="presentation" style={{ position: 'relative', width: '100%', minHeight: '100%', height: 350 }}>
                        <div role="presentation" style={{ position: 'absolute', top: 0, left: 0, width: '100%', overflow: 'visible' }}>
                            <div className="uppy-Dashboard-filesInner" style={{ display: 'flex', flexWrap:'wrap' }} role="presentation">
                                {
                                    loading ?
                                        new Array(5).fill(0).map((_, index) => (
                                            <Skeleton.Button active key={index} style={{ width: 170, height: 277, margin: '0 5px 15px 5px' }} />
                                        ))
                                    :
                                        newImages.map((image) => (
                                            <GalleryItem key={image.id} image={image} mode={mode} handleRemoveImage={handleRemoveImage} handleSaveImage={handleSaveImage} />
                                        ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ width: '100%', textAlign: 'right' }} id="gallery-footer">
                    {
                        mode === 'Update' ?
                            <Button style={{ borderRadius: 0, marginTop: 10 }} type="primary" onClick={handleSaveChanges} loading={saveLoading} disabled={saveLoading || JSON.stringify(images) === JSON.stringify(newImages)}>Save</Button>
                        : mode === 'Upload' ?
                            <Fragment>
                                <Button style={{ borderRadius: 0, marginTop: 10 }} onClick={() => setImagesToUpload([])} disabled={saveLoading}>Cancel</Button>
                                <Button style={{ borderRadius: 0, marginTop: 10 }} type="primary" onClick={handleUpload} loading={saveLoading} disabled={saveLoading}>Upload</Button>
                            </Fragment>
                        :
                            null
                    }
                </div>
            </div>
        </div>
    )
}

export default Gallery