// Stolen from: https://blog.shovonhasan.com/using-promises-with-filereader/
// It's simpler than the FileReader API and more flexible
// noinspection JSUnusedGlobalSymbols
export class FileReaderAsync extends FileReader
{
    readAsDataUrlAsync(blob: Blob): Promise<string>
    {
        return new Promise((resolve, reject) =>
        {
            this.onerror = () =>
            {
                this.abort();
                reject(new DOMException('Problem parsing input file.'));
            };

            this.onload = () =>
            {
                resolve(this.result as string);
            };

            this.readAsDataURL(blob);
        });
    }

    readAsTextAsync(blob: Blob, encoding?: string): Promise<string>
    {
        return new Promise((resolve, reject) =>
        {
            this.onerror = () =>
            {
                this.abort();
                reject(new DOMException('Problem parsing input file.'));
            };

            this.onload = () =>
            {
                resolve(this.result as string);
            };

            this.readAsText(blob, encoding);
        });
    }

    readAsArrayBufferAsync(blob: Blob): Promise<ArrayBuffer>
    {
        return new Promise((resolve, reject) =>
        {
            this.onerror = () =>
            {
                this.abort();
                reject(new DOMException('Problem parsing input file.'));
            };

            this.onload = () =>
            {
                resolve(this.result as ArrayBuffer);
            };

            this.readAsArrayBuffer(blob);
        });
    }

    readAsBinaryStringAsync(blob: Blob): Promise<string>
    {
        return new Promise((resolve, reject) =>
        {
            this.onerror = () =>
            {
                this.abort();
                reject(new DOMException('Problem parsing input file.'));
            };

            this.onload = () =>
            {
                resolve(this.result as string);
            };

            this.readAsBinaryString(blob);
        });
    }

    toBlob(dataUrl: string): Blob
    {
        const dataUrlSplit = dataUrl.split(',');
        const dataUrlType = dataUrlSplit[0];
        const dataUrlData = dataUrlSplit[1];

        const dataUrlTypeSplit = dataUrlType.split(';');
        const dataUrlMediaType = dataUrlTypeSplit[0].split(':')[1];
        const shouldDecode = dataUrlTypeSplit.length === 2 && dataUrlTypeSplit[1] === 'base64';

        let resultData;
        if (shouldDecode)
        {
            const bytes = atob(dataUrlData);

            resultData = [
                new Uint8Array(
                        (
                                function* ()
                                {
                                    let current = 0;
                                    while (current < bytes.length)
                                    {
                                        yield bytes.charCodeAt(current);
                                        current++;
                                    }
                                }
                        )()
                )
            ];
        }
        else resultData = [dataUrlData];

        return new Blob(resultData, {type: dataUrlMediaType});
    }

    async toBlobAsync(dataUrl: string): Promise<Blob>
    {
        return new Promise<Blob>((resolve, reject) =>
        {
            try
            {
                resolve(this.toBlob(dataUrl));
            }
            catch (error)
            {
                reject(new DOMException(error));
            }
        });
    }
}
