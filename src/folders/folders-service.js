const FoldersService = {
  getAllFolders(knex) {
    return knex.select('*').from('folders')
  },
  insertFolder(knex, newFolder) {
    return knex.insert(newFolder).into('folders').returning('*').then(rows => {return rows[0]})
  },
  getFolderById(knex, id) {
    return knex.select('*').from('folders').where({ id }).first()
  },
  deleteFolder(knex, id) {
    return knex('folders').where({id}).delete()
  }
 
}

module.exports = FoldersService