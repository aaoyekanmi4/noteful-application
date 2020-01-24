const express = require('express')

const bodyParser = express.json()
const FoldersService = require('./folders-service')
const foldersRouter = express.Router()


const serializeFolder= folder=> ({
  id: folder.id,
  title: folder.title,
})

foldersRouter
.route('/folders')
.get((req, res, next) => {
  FoldersService.getAllFolders(req.app.get('db'))
    .then(folders => {
      res.json(folders.map(serializeFolder))
    })
    .catch(next)
})
.post(bodyParser, (req, res, next) => { 
  const {title} = req.body;
  const newFolder = { title }
    if (!title) {
    
      return res.status(400).send(`folder name is required`)
    }

  FoldersService.insertFolder(
    req.app.get('db'),
    newFolder
  )
    .then(folder=> {
      res
        .status(201)
        .location(`/folders/${folder.id}`)
        .json(serializeFolder(folder))
    })
    .catch(next)
})
foldersRouter
.route('/folders/:id')
.all((req, res, next) => {
  const { id } = req.params
 FoldersService.getFolderById(req.app.get('db'), id)
    .then(folder => {
      if (!folder) {
        return res.status(404).json({
          error: { message: `Folder Not Found` }
        })
      }
      res.folder = folder
      next()
    })
    .catch(next)

})
.get((req, res) => {
  res.json(serializeFolder(res.folder))
})
.delete((req, res, next) => {
 
  const { id } = req.params
FoldersService.deleteFolder(
    req.app.get('db'),
    id
  )
    .then(numRowsAffected => {
      res.status(204).end()
    })
    .catch(next)
})

module.exports = foldersRouter