import React, { useState, useEffect, Fragment } from 'react';
import { Card, Image, Modal, Skeleton, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, AlignLeftOutlined, CopyOutlined } from '@ant-design/icons';
import { GalleryItemInterface } from './interfaces';
import ImageEditor from './image-editor';
import { dataURItoBlob } from './utils';

const { Meta } = Card;

const GalleryItem: React.FC<GalleryItemInterface> = ({ image, mode, handleRemoveImage, handleSaveImage }) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [previewImageSrc, setPreviewImageSrc] = useState<string | null>(null);
    const [blobImage, setBlobImage] = useState<Blob | null>(null);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [loadImageEditor, setLoadImageEditor] = useState<boolean>(false);
    const [showCopiedTest, setShowCopiedText] = useState<boolean>(false);

    const fetchImage = async (url: string) => {
        await fetch(url).then(res => res.blob()).then((blobFile) => setBlobImage(blobFile)).catch(() => {});
    };

    const handleCopyUrl = () => {
        setShowCopiedText(true);
        navigator.clipboard.writeText(image.originalUrl);
        setTimeout(() => {
            setShowCopiedText(false);
        }, 2000);
    };

    const handleEditButtonClicked = () => {
        setIsEditMode(true); 
        setTimeout(() => {
            setLoadImageEditor(true)
        }, 500)
    }

    const handleCloseModal = () => {
        setIsEditMode(false);
        setLoadImageEditor(false);
    }

    const handleSave = async (imageBase64: string | undefined = undefined, name: string, extension: string) => {
        if(imageBase64) {
            setPreviewImageSrc(imageBase64);
            setImageSrc(imageBase64);
            const blob = dataURItoBlob(imageBase64);
            setBlobImage(blob);
            setIsEditMode(false);
            handleSaveImage(image.id, imageBase64, name, extension);
        }
    }

    useEffect(() => {
        if(image) {
            setImageSrc(image.originalUrl);
            setPreviewImageSrc(image.previewUrl || image.originalUrl)
            fetchImage(image.previewUrl || image.originalUrl);
        }
        //eslint-disable-next-line
    }, [image]);

    if(imageSrc && previewImageSrc) {
        const actions = [];
        if(mode === 'Update') {
            actions.push(<Tooltip title={showCopiedTest ? "Copied !" : "Copy URL"}><CopyOutlined key="copy" onClick={handleCopyUrl} /></Tooltip>);
        }
        actions.push(<Tooltip title="Edit"><EditOutlined key="edit" onClick={handleEditButtonClicked} /></Tooltip>);
        actions.push(<Tooltip title="Delete"><DeleteOutlined key="delete" onClick={() => handleRemoveImage(image.id)} /></Tooltip>);
        return (
            <Fragment>
                <Card
                    style={{ width: 170, margin: '0 5px 15px 5px' }}
                    cover={<Image className="uppy-Dashboard-Item-previewImg" style={{ objectFit: 'contain' }} alt={image.name} src={previewImageSrc} />}
                    actions={actions}
                >
                    <Meta 
                        title={<Tooltip title={image.name} placement='left'><span style={{ fontSize: 12 }}>{image.name}</span></Tooltip>} 
                        description={
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>
                                    {
                                        blobImage ?
                                            Math.round(blobImage.size / 1000) + ' KB'
                                        :
                                            <Skeleton.Button style={{ width: 50, height: 22 }} />
                                    }            
                                </span>
                                {
                                    image.numberOfUse ?
                                        <span>
                                            <Tooltip title={`This image is used ${image.numberOfUse} times`}>
                                                {image.numberOfUse} <AlignLeftOutlined />
                                            </Tooltip>
                                        </span>
                                    :
                                        null
                                }
                            </div>
                        } 
                    />
                </Card>
                <Modal style={{ width: 800, height: 800 }} open={isEditMode} destroyOnClose={true} okButtonProps={{ style: { display: 'none' } }} onCancel={handleCloseModal}>
                    {
                        loadImageEditor ?
                            <ImageEditor imageSrc={previewImageSrc} imageName={image.name} handleSaveImage={handleSave}  />
                        :
                            <Skeleton.Button active style={{ width: 753, height: 496 }} />
                    }
                </Modal>
            </Fragment>
        )
    } else {
        return null;
    }
}

export default GalleryItem