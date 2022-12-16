import React from 'react';
import { ImageEditorInterface } from './interfaces';
import FilerobotImageEditor, { TABS, TOOLS } from 'react-filerobot-image-editor';

const ImageEditor: React.FC<ImageEditorInterface> = ({ imageSrc, imageName, handleSaveImage }) => {
    return (
        <FilerobotImageEditor
            source={imageSrc}
            annotationsCommon={{
                fill: '#00000000',
                strokeWidth: 1,
                stroke: '#ff0000'
            }}
            onSave={(savedImageData) => handleSaveImage(savedImageData.imageBase64, savedImageData.name, savedImageData.extension)}
            tabsIds={[TABS.ADJUST, TABS.ANNOTATE, TABS.WATERMARK, TABS.FILTERS, TABS.FINETUNE, TABS.RESIZE]}
            defaultTabId={TABS.ANNOTATE}
            defaultToolId={TOOLS.TEXT}
            savingPixelRatio={4}
            previewPixelRatio={window.devicePixelRatio}
            defaultSavedImageName={imageName}
            Rect={{
                fill: '#00000000'
            }}
        />
    )
}

export default ImageEditor