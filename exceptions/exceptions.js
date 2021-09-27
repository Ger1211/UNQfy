class EntityIdDoesntExist extends Error {
  constructor(entityType, entityId) {
    super(`The ${entityType} with id ${entityId} doesn´t exist.`);
    this.message = `The ${entityType} with id ${entityId} doesn´t exist.`;
  }
}

class EntityNameDoesntExist extends Error {
  constructor(entityType, entityName) {
    super(`The ${entityType} with name ${entityName} doesn´t exist.`);
    this.message = `The ${entityType} with name ${entityName} doesn´t exist.`;
  }
}

class AlbumIdNotFound extends Error {
  constructor(albumId) {
    super(`The album ID ${albumId} doesn´t exist. Please insert an exist Album ID.`);
    this.message = `The album ID ${albumId} doesn´t exist. Please insert an exist Album ID.`;
  }
}

class EntityNameDuplicated extends Error {
  constructor(entityType, entityName) {
    super(`The ${entityType} with name ${entityName} already exists. Please insert another one.`);
    this.message = `The ${entityType} with name ${entityName} already exists. Please insert another one.`;
  }
}
class EntityIdDuplicated extends Error {
  constructor(entityType, entityId) {
    super(`The ${entityType} with id ${entityId} already exists. Please insert another one.`);
    this.message = `The ${entityType} with id ${entityId} already exists. Please insert another one.`;
  }
}

class InvalidArtist extends Error {
  constructor(artistId) {
    super(`The Artist with id ${artistId} is already used in another album with the same name. Please use other`);
    this.message =`The Artist with id ${artistId} is already used in another album with the same name. Please use other.`;
  }
}

module.exports = { EntityIdDoesntExist, EntityNameDoesntExist, AlbumIdNotFound, EntityNameDuplicated, EntityIdDuplicated, InvalidArtist };
