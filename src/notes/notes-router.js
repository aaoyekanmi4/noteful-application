const express = require('express')

const bodyParser = express.json()
const NotesService = require('./notes-service')
const notesRouter = express.Router()



const serializeNote= note=> ({
  id: note.id,
  title: note.title,
  modified: note.modified,
  content: note.content,
  folderId: note.folderId
})

notesRouter
.route('/notes')
.get((req, res, next) => {
  NotesService.getAllNotes(req.app.get('db'))
    .then(notes => {
      res.json(notes.map(serializeNote))
    })
    .catch(next)
})
.post(bodyParser, (req, res, next) => { 
  const {title, folderid, content, modified} = req.body;
  const newNote = { title, content, modified, folderid }
  
 for (const [key,value] of Object.entries(newNote)) {
  if (!value) {
    
    return res.status(400).send(`${key} is required`)
  }
 }
  NotesService.insertNote(
    req.app.get('db'),
    newNote
  )
    .then(note=> {
      res
        .status(201)
        .location(`/notes/${note.id}`)
        .json(serializeNote(note))
    })
    .catch(next)
})
notesRouter
.route('/notes/:id')
.all((req, res, next) => {
  const { id } = req.params
 NotesService.getNoteById(req.app.get('db'), id)
    .then(note => {
      if (!note) {
        return res.status(404).json({
          error: { message: `Note Not Found` }
        })
      }
      res.note = note
      next()
    })
    .catch(next)

})
.get((req, res) => {
  res.json(serializeNote(res.note))
})
.delete((req, res, next) => {
 
  const { id } = req.params
NotesService.deleteNote(
    req.app.get('db'),
    id
  )
    .then(numRowsAffected => {
      res.status(204).end()
    })
    .catch(next)
})


module.exports = notesRouter