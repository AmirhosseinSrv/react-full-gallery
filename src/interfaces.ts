import { Dispatch, SetStateAction } from "react";
import { UppyFileType } from "./types";

export interface FilesInterface {
  [key: string]: UppyFileType;
}

export interface ImageInterface {
  id: string;
  originalUrl: string;
  previewUrl?: string;
  name: string;
  numberOfUse?: number;
  modified?: boolean;
}

export interface ImageGalleryInterface {
  companionUrl: string;
  remoteSources?: ('Box' | 'Dropbox' | 'Facebook' | 'GoogleDrive' | 'Instagram' | 'OneDrive' | 'Unsplash' | 'Url' | 'Zoom')[];
  targetId: string;
  height?: number;
  note: string;
  formTargetId: string;
  dropTargetId?: string;
  style?: React.CSSProperties;
  images: ImageInterface[];
  maxFileSize?: number;
  allowedFileTypes?: string[];
  loading?: boolean;
  onBeforeFileAdded?: (currentImage: UppyFileType, images: FilesInterface) => UppyFileType | undefined | boolean;
  onBeforeUpload?: (images: FilesInterface) => FilesInterface | boolean;
  handleUploadImages: (newImages: ImageInterface[]) => Promise<void>;
  handleUpdateImages: (modifiedImages: ImageInterface[]) => Promise<void>;
  handleRemoveImages: (removedImages: ImageInterface[], newImages: ImageInterface[]) => Promise<void>;
};

export interface GalleryInterface {
  images: ImageInterface[];
  setImagesToUpload: Dispatch<SetStateAction<ImageInterface[]>>;
  mode: 'Update' | 'Upload';
  loading?: boolean;
  handleUploadImages: (newImages: ImageInterface[]) => Promise<void>;
  handleUpdateImages: (modifiedImages: ImageInterface[]) => Promise<void>;
  handleRemoveImages: (removedImages: ImageInterface[], newImages: ImageInterface[]) => Promise<void>;
}

export interface GalleryItemInterface {
  image: ImageInterface;
  mode: 'Update' | 'Upload';
  handleSaveImage: (id: string, imageBase64: string, name: string, extension: string) => void;
  handleRemoveImage: (id: string) => void;
}

export interface ImageEditorInterface {
  imageSrc: string;
  imageName: string;
  handleSaveImage: (imageBase64: string | undefined, name: string, extension: string) => void;
}