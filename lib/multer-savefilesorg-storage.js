var axios = require('axios')
var concat = require('concat-stream')
var FormData = require('form-data')

// Maximum time to upload to the server
const UPLOAD_TIMEOUT = 5000

/*
  This is a custom multer storage engine that orxy the received data into a savefiles.org drive.
  The data is forwarded as multipart/form-data.

  opts: {
    serverPath: 'https://savefiles.org/api/v1/uploads',
    apiAccessToken: '<create access token under account settings>',
    fileParamName: 'file' // If left blank, this defaults to 'file',
    relativePath: '/' // If left blank, this defaults to root of drive '/',
  }

  SaveFilesOrg is expected to return:
    HTTP Code 201
      or
    HTTP Code Non-201, which is considered an error
*/
class MulterSaveFilesOrgStorage {
  constructor(opts) {
    this.opts = opts
  }

  _handleFile(req, file, cb) {
    var form = new FormData()
    // Use filepath to specify the file's fullpath. If we use filename, it'll be cut down into only the filename
    form.append(this.opts.fileParamName || 'file', file.stream, { filepath: file.originalname })
    form.append('relativePath', this.opts.relativePath || '/')
    form.pipe(concat({ encoding: 'buffer' }, data => {
      axios.post(
        this.opts.serverPath,
        data,
        {
          headers: {
            ...form.getHeaders(),
            Authorization: `Bearer ${this.opts.apiAccessToken}`
          },
          timeout: UPLOAD_TIMEOUT
        }
      ).then(resp => {
        req.serverResp = resp.data
        cb(null)
      }).catch(err => {
        cb(err)
      })
    }))
  }

  _removeFile(req, file, cb) {
    cb(null)
  }
}

module.exports = opts => {
  return new MulterSaveFilesOrgStorage(opts)
}