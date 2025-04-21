export function getRealFile(value: string) {
    const realFile = this.app.metadataCache.getFirstLinkpathDest(value, "");
    return realFile;
}

export function getFileRealLink(value: string) {
    const realFile = getRealFile(value);
    if (!realFile) {
        console.log(value, "미디어 파일을 불러오는 데 실패했습니다.");
        return null;
    }
    const resourcePath = this.app.vault.getResourcePath(realFile);
    return resourcePath;
}

export function linkFileToText(value: string) {
    value = value.replace("[[", "");
    value = value.includes("|") ? value.slice(0, value.lastIndexOf("|") + 1) : value.replace("]]", "");
    
    if (value.includes("/")) {
        value = value.slice(value.lastIndexOf("/") + 1, value.length);
    }
    return value;
}