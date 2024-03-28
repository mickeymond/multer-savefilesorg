# Multer SaveFilesOrg Storage

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
var {multerSaveFilesOrgStorage} = require('multer-savefilesorg-storage')

// Configure upload middleware
const upload = multer({
    storage: multerSaveFilesOrgStorage({
        apiAccessToken: process.env.SAVEFILESORG_API_KEY,
        relativePath: '/' // If left blank, this defaults to root of drive '/',
    }),
    preservePath: true
});

// Use upload middleware
router.post('/', upload.single('image'), (req, res, next) => {
  console.log(req.file); // If single upload was done
  console.log(req.files); // If array upload was done
});
```

## License
multer-savefilesorg-storage is released under the [MIT](License) license.
