import FileEdit from 'src/utils/fileEdit'
const baseDir = '/images/sys-images/mammography/static'
const fileEdit = new FileEdit(baseDir)
export default function () {
  return {
    baseDir,
    fileEdit,
    activeTechnician: '',
    bodyPng: FileEdit.fileUID('body.png'),
    viewBmp: FileEdit.fileUID('view.bmp'),
    viewDcm: FileEdit.fileUID('view.dcm'),
    messageDump: FileEdit.fileUID('message.dump'),
    messageDcm: FileEdit.fileUID('message.dcm'),
    pushDcm: FileEdit.fileUID('push.dcm')
  }
}
