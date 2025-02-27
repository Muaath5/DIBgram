import TdLib from './tdlib';

/**
 * Downloads a file. Promise is resolved when the file is downloaded.
 * @param {number} file_id ID of file to be downloaded
 * @param {number} priority From 1 to 32, higher number results in earlier download
 * @returns {import('tdweb').TdObject} File object
 */
export function downloadFile (file_id, priority) {
    let onReject;
    TdLib.sendQuery({
        '@type': 'downloadFile',
        'file_id': file_id,
        'priority': priority,
        'offset': 0,
        'limit': 0,
        'synchronous': false
    }).catch(onReject);

    return new Promise((resolve, reject) => {
        downloadCallbacks[file_id]=result=> {
            resolve(result);
            delete downloadCallbacks[file_id];
        };
        onReject=reject;
    });
}
var downloadCallbacks = {};

TdLib.registerUpdateHandler('updateFile', function (update) {
    if(update.file.local.is_downloading_completed){
        downloadCallbacks[update.file.id]?.(update.file);
    }
});

const cachedFiles= {};

/**
 * Gets file content (downloads if necessary). Promise is resolved with a `filePart` object when file content is ready
 * @param {import('tdweb').TdObject} file File object
 * @param {number} priority Download priority from 1 to 32. Higher value = earlier download
 * @param {boolean} enableCache If true, file content will be stored in a cache in the RAM. Files larger than 500KiB will not be cached whatsoever.
 * @returns {import('tdweb').TdObject} A `filePart` object
 * 
 */
export function getFileContent(file, priority, enableCache=true) {
    if(file.id in cachedFiles){ // If we have it in cache, we can use that
        return Promise.resolve({data: cachedFiles[file.id]});
    }

    function resolveFilePart(filePart){
        if(enableCache && file.size<=500*1024){
            cachedFiles[file.id]=filePart.data;
        }
        return filePart;
    }

    if(file.local.is_downloading_completed){ // File is already downloaded - only read file
        return new Promise((resolve, reject) => {
            TdLib.sendQuery({
                '@type': 'readFilePart',
                'file_id': file.id,
                'offset': 0,
                'count': 0
            }).then((f)=>resolve(resolveFilePart(f))).catch(reject);
        });
    } 
    else if(file.local.is_downloading_active){ // File is already being downloaded - gets quite complex here.
        return new Promise((resolve, reject) => {
            const callback = downloadCallbacks[file.id];
            downloadCallbacks[file.id] = (result) => { // Replace old callback with a new callback that calls the old one and also does its own stuff
                callback(result); // Call the old callback
                TdLib.sendQuery({ // Read the file
                    '@type': 'readFilePart',
                    'file_id': file.id,
                    'offset': 0,
                    'count': 0
                }).then((f)=>resolve(resolveFilePart(f))).catch(reject);
            };
        });
    } else {
        return new Promise((resolve, reject) => { // File is not downloaded.
            downloadFile(file.id, priority).then(()=> { // Download it...
                TdLib.sendQuery({ // ...then read it
                    '@type': 'readFilePart',
                    'file_id': file.id,
                    'offset': 0,
                    'count': 0
                }).then((f)=>resolve(resolveFilePart(f))).catch(reject);
            }).catch(reject);
        });
    }
}

/**
 * Converts a blob to a URL
 * @param {Blob} blob Blob to convert
 * @returns {string} Created URL
 */
export function blobToUrl (blob) {
    return (window.URL || window.webkitURL).createObjectURL(blob);
}
