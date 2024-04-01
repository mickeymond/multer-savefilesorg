import axios from 'axios'
import concat from 'concat-stream'
import FormData from 'form-data'

/*
  This is a custom multer storage engine that orxy the received data into a savefiles.org drive.
  The data is forwarded as multipart/form-data.

  opts: {
    apiAccessToken: '<create access token under account settings>',
    relativePath: '/' // If left blank, this defaults to root of drive '/',
  }

  SaveFilesOrg is expected to return:
    HTTP Code 201
      or
    HTTP Code Non-201, which is considered an error
*/
class MulterSaveFilesOrg {
  constructor(opts) {
    this.opts = opts
  }

  _handleFile(req, file, cb) {
    var form = new FormData()
    // Use filepath to specify the file's fullpath. If we use filename, it'll be cut down into only the filename
    form.append('file', file.stream, { filepath: file.originalname })
    form.append('relativePath', this.opts.relativePath || '/')
    form.pipe(concat({ encoding: 'buffer' }, data => {
      axios.post(
        `https://savefiles.org/api/v1/uploads`,
        data,
        {
          headers: {
            ...form.getHeaders(),
            Authorization: `Bearer ${this.opts.apiAccessToken}`
          }
        }
      ).then(({ data }) => {
        cb(null, { filename: data.fileEntry.url })
      }).catch(err => {
        cb(err)
      })
    }))
  }

  _removeFile(req, file, cb) {
    cb(null)
  }
}

export const multerSaveFilesOrg = opts => {
  return new MulterSaveFilesOrg(opts)
}
