import * as fs from 'fs'

export const readFileContent = (filePath: string): string => fs.readFileSync(filePath, 'utf-8')

export const writeFileContent = (filePath: string, data: any): void => fs.writeFileSync(filePath, data)

export const createFolders = (folderPath: string): Promise<string> => fs.promises.mkdir(folderPath, { recursive: true })

export const removeFiles = (filePaths: Array<string>): Array<Promise<void>> => {
  return filePaths.map((file: string) => {
    return new Promise((resolve) => {
      fs.unlinkSync(file)
      resolve()
    })
  })
}

export const removeFolders = (paths: Array<string>): Array<Promise<void>> => {
  return paths.map((path: string) => {
    return new Promise((resolve) => {
      fs.rmdirSync(path, {recursive: true})
      resolve()
    })
  })
}
