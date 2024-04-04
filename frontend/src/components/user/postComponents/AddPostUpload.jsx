// addPostUpload.jsx

import { Textarea } from '@nextui-org/react';
import {  useState } from 'react';

const AddPostUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [caption, setCaption] = useState('');
   
    console.log(caption)
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const file = event.dataTransfer.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
    };

    const isUploadBoxVisible = !selectedFile;

    return (
        <section className="container w-full  mx-auto items-center py-8" onDragOver={handleDragOver} onDrop={handleDrop}>
            <div className="max-w-lg mx-auto bg-black rounded-lg shadow-md overflow-auto">
                <div className="">
                    <div id="image-preview" className={` ${ selectedFile ? '' : 'py-3 border-dashed border-1 border-purple-500' } rounded-lg items-center mx-auto text-center cursor-pointer max-h-[50vh]`}>
                        {selectedFile && (
                            <>
                                <div className="relative w-full  rounded-lg" draggable>
                                    <button onClick={removeFile} className="absolute top-2 right-2 text-red-500 focus:outline-none z-20">
                                        <div className=' bg-black opacity-80 rounded-full'>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </div>
                                    </button>
                                    <img src={URL.createObjectURL(selectedFile)} className="w-auto h-auto max-h-[25vh]  rounded-lg mx-auto mb-4 object-scale-down bg-white" alt={`Image`} />
                                </div>
                                <div className="mt-4 text-left text-white ">
                                    <Textarea
                                        label="Caption"
                                        variant="bordered"
                                        value={caption}
                                        labelPlacement="outside"
                                        placeholder="Enter your Caption"
                                        className="text-white"
                                        color='secondary'
                                        onChange={(e) => setCaption(e.target.value)}
                                    />

                                </div>
                            </>
                        )}
                        {isUploadBoxVisible && (
                            <label htmlFor="upload" className="cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className="w-8 h-8 text-gray-700 mx-auto mb-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                </svg>
                                <h5 className="mb-2 text-xl font-bold tracking-tight text-white">Upload picture</h5>
                                <p className="font-normal text-sm text-gray-400 md:px-6">Choose photo size should be less than <b className="text-white">2mb</b></p>
                                <p className="font-normal text-sm text-gray-400 md:px-6">and should be in <b className="text-white">JPG, PNG, or GIF</b> format.</p>
                                <span id="filename" className="text-white bg-gray-200 z-50"></span>
                            </label>

                        )}
                    </div>
                    <div className="flex items-center justify-center mt-4">
                        <div className="w-full">
                            <input id="upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            {isUploadBoxVisible && (
                                <label htmlFor="upload" className="w-full text-black bg-purple-500 hover:bg-purple-600/90 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 flex items-center justify-center cursor-pointer">
                                    <span className="text-center ml-2 text-white">Upload</span>
                                </label>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AddPostUpload;
