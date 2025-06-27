import path from "path";
import fs from "fs";

// 디렉토리가 있는지 체크하고 없으면 생성합니다.
export function ensureDirectoryExists(pathName: string): void {
    const dirname = path.dirname(pathName);

    if(!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
    }
}