# Multer Proxy Storage

This is a custom multer storage engine that proxy the received file into a savefiles.org drive.
The data is forwarded as multipart/form-data.

## Install

```
npm install --save multer-savefilesorg-storage
```

## Usage

In this example we are forwarding user uploaded file into savefiles.org drive https://savefiles.org/api/v1/uploads, with the file
identified with the parameter 'file'.

``` javascript
var multer = require('multer')
var {MulterSaveFilesOrgStorage} = require('multer-savefilesorg-storage')

this.routePost('/uploadFile',
  (req, res, next) => {
    multer({
      storage: MulterSaveFilesOrgStorage(
        {
          serverPath: `https://savefiles.org/api/v1/uploads`,
          apiAccessToken: '<create access token under account settings>',
          fileParamName: 'file' // If left blank, this defaults to 'file',
          relativePath: '/' // If left blank, this defaults to root of drive '/',
        }),
      preservePath: true
    }).array('file')(req, res, next)
  }, (req, res, next) => {
    res.send('Success!')
  })
```

## License
multer-savefilesorg-storage is released under the [MIT](License) license.
